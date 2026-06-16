import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { db } from "./src/db/index.ts";
import { cars, pickupLocations, destinations, reservations, favorites, users } from "./src/db/schema.ts";
import { seedIfNeeded } from "./src/db/seed.ts";
import { requireAuth, AuthRequest } from "./src/middleware/auth.ts";
import { eq, and, or, lt, gt, sql } from "drizzle-orm";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Seed the database
  await seedIfNeeded();

  // --- API ROUTES ---

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // 1. Fetch all cars (with search & filters)
  app.get("/api/cars", async (req, res) => {
    try {
      const { brand, maxRate, search, sortBy } = req.query;

      let queryDb = db.select().from(cars);

      // We will perform client-side/in-memory filtering or build clean drizzle where clauses.
      // Drizzle dynamic where clause building:
      const conditions = [];

      if (brand && brand !== "All") {
        conditions.push(eq(cars.brand, brand as string));
      }

      if (maxRate) {
        conditions.push(sql`${cars.dailyRate} <= ${parseInt(maxRate as string)}`);
      }

      let allCarsResult = await queryDb;

      // Filter with search if provided (brand or model)
      if (search) {
        const term = (search as string).toLowerCase();
        allCarsResult = allCarsResult.filter(
          (car) =>
            car.brand.toLowerCase().includes(term) ||
            car.model.toLowerCase().includes(term)
        );
      }

      // Apply other filters locally if conditions were dynamic or just use Drizzle's direct result.
      let filtered = allCarsResult;
      if (brand && brand !== "All") {
        filtered = filtered.filter(car => car.brand.toLowerCase() === (brand as string).toLowerCase());
      }
      if (maxRate) {
        const rateLimit = parseInt(maxRate as string);
        filtered = filtered.filter(car => car.dailyRate <= rateLimit);
      }

      // Apply sorting
      if (sortBy) {
        if (sortBy === "price_asc") {
          filtered.sort((a, b) => a.dailyRate - b.dailyRate);
        } else if (sortBy === "price_desc") {
          filtered.sort((a, b) => b.dailyRate - a.dailyRate);
        } else if (sortBy === "horsepower_desc") {
          filtered.sort((a, b) => b.horsepower - a.horsepower);
        }
      }

      res.json(filtered);
    } catch (error) {
      console.error("Failed to query cars:", error);
      res.status(500).json({ error: "Failed to load supercars fleet." });
    }
  });

  // 2. Fetch single car with its confirmed unavailable dates
  app.get("/api/cars/:id", async (req, res) => {
    try {
      const carIdInput = parseInt(req.params.id);
      if (isNaN(carIdInput)) {
        return res.status(400).json({ error: "Invalid car ID" });
      }

      const carResult = await db.select().from(cars).where(eq(cars.id, carIdInput)).limit(1);
      if (carResult.length === 0) {
        return res.status(404).json({ error: "Supercar not found" });
      }

      // Fetch confirmed bookings for this car to get unavailable dates
      const bookings = await db
        .select({
          pickupDate: reservations.pickupDate,
          returnDate: reservations.returnDate,
        })
        .from(reservations)
        .where(
          and(
            eq(reservations.carId, carIdInput),
            eq(reservations.status, "confirmed")
          )
        );

      res.json({
        car: carResult[0],
        unavailableDates: bookings,
      });
    } catch (error) {
      console.error("Error fetching car detail:", error);
      res.status(500).json({ error: "Failed to fetch supercar details." });
    }
  });

  // 3. Fetch pickup locations
  app.get("/api/locations", async (req, res) => {
    try {
      const locs = await db.select().from(pickupLocations);
      res.json(locs);
    } catch (error) {
      console.error("Failed to fetch locations:", error);
      res.status(500).json({ error: "Failed to load locations." });
    }
  });

  // 4. Fetch featured destinations
  app.get("/api/destinations", async (req, res) => {
    try {
      const dests = await db.select().from(destinations);
      res.json(dests);
    } catch (error) {
      console.error("Failed to fetch destinations:", error);
      res.status(500).json({ error: "Failed to load destinations." });
    }
  });

  // 5. Fetch current user's favorites
  app.get("/api/favorites", requireAuth, async (req: AuthRequest, res) => {
    try {
      const userDbId = req.dbUser?.id;
      if (!userDbId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const userFavs = await db
        .select({ carId: favorites.carId })
        .from(favorites)
        .where(eq(favorites.userId, userDbId));

      const carIds = userFavs.map((f) => f.carId);
      res.json(carIds);
    } catch (error) {
      console.error("Error loading favorites:", error);
      res.status(500).json({ error: "Failed to get favorited cars." });
    }
  });

  // 6. Toggle favorite status for a car
  app.post("/api/cars/:id/favorite", requireAuth, async (req: AuthRequest, res) => {
    try {
      const userDbId = req.dbUser?.id;
      const carIdInput = parseInt(req.params.id);

      if (!userDbId) return res.status(401).json({ error: "Unauthorized" });
      if (isNaN(carIdInput)) return res.status(400).json({ error: "Invalid car ID" });

      // Check if already favorited
      const existing = await db
        .select()
        .from(favorites)
        .where(
          and(
            eq(favorites.userId, userDbId),
            eq(favorites.carId, carIdInput)
          )
        )
        .limit(1);

      if (existing.length > 0) {
        // Unfavorite (Delete)
        await db
          .delete(favorites)
          .where(
            and(
              eq(favorites.userId, userDbId),
              eq(favorites.carId, carIdInput)
            )
          );
        res.json({ favorited: false });
      } else {
        // Favorite (Insert)
        await db.insert(favorites).values({
          userId: userDbId,
          carId: carIdInput,
        });
        res.json({ favorited: true });
      }
    } catch (error) {
      console.error("Error toggling favorite status:", error);
      res.status(500).json({ error: "An error occurred while saving favorite status." });
    }
  });

  // 7. Get current user's reservations
  app.get("/api/reservations/user", requireAuth, async (req: AuthRequest, res) => {
    try {
      const userDbId = req.dbUser?.id;
      if (!userDbId) return res.status(401).json({ error: "Unauthorized" });

      // Join reservations with cars, pickupLocations for rich overview
      const userTrips = await db
        .select({
          reservation: reservations,
          car: cars,
          location: pickupLocations,
        })
        .from(reservations)
        .innerJoin(cars, eq(reservations.carId, cars.id))
        .innerJoin(pickupLocations, eq(reservations.pickupLocationId, pickupLocations.id))
        .where(eq(reservations.userId, userDbId));

      // Map back into clean response array
      const mappedTrips = userTrips.map((row) => ({
        ...row.reservation,
        car: row.car,
        location: row.location,
      }));

      // Sort by pickup date descending (newest first)
      mappedTrips.sort((a, b) => b.pickupDate.localeCompare(a.pickupDate));

      res.json(mappedTrips);
    } catch (error) {
      console.error("Error fetching user reservations:", error);
      res.status(500).json({ error: "Failed to load your reservations." });
    }
  });

  // 8. Create a reservation
  app.post("/api/reservations", requireAuth, async (req: AuthRequest, res) => {
    try {
      const userDbId = req.dbUser?.id;
      if (!userDbId) return res.status(401).json({ error: "Unauthorized" });

      const {
        carId,
        pickupLocationId,
        pickupDate,
        returnDate,
        driverName,
        driverEmail,
        driverPhone,
        driverLicense,
        driverDob,
        insuranceSelected,
        chauffeurSelected,
      } = req.body;

      // 1. Validations
      if (
        !carId ||
        !pickupLocationId ||
        !pickupDate ||
        !returnDate ||
        !driverName ||
        !driverEmail ||
        !driverPhone ||
        !driverLicense ||
        !driverDob
      ) {
        return res.status(400).json({ error: "Please fill in all driver details and select location/dates." });
      }

      // Parse and check dates
      const pDate = new Date(pickupDate);
      const rDate = new Date(returnDate);

      if (isNaN(pDate.getTime()) || isNaN(rDate.getTime())) {
        return res.status(400).json({ error: "Selected dates are invalid." });
      }

      if (rDate <= pDate) {
        return res.status(400).json({ error: "Return date must be after pickup date." });
      }

      // Check dates overlap safety
      // Overlap formula: (existing.pickup_date < returnDateInput) AND (existing.return_date > pickupDateInput)
      // Standard overlap logic
      const overlappingBookings = await db
        .select()
        .from(reservations)
        .where(
          and(
            eq(reservations.carId, carId),
            eq(reservations.status, "confirmed"),
            lt(reservations.pickupDate, returnDate),
            gt(reservations.returnDate, pickupDate)
          )
        );

      if (overlappingBookings.length > 0) {
        return res.status(400).json({
          error: "This car is already booked for the selected dates. Please choose different dates.",
        });
      }

      // 2. Fetch car daily rate
      const carResult = await db.select().from(cars).where(eq(cars.id, carId)).limit(1);
      if (carResult.length === 0) {
        return res.status(404).json({ error: "Selected car not found." });
      }
      const car = carResult[0];

      // Calculate days
      const diffTime = rDate.getTime() - pDate.getTime();
      const rentalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Price breakdown
      const basePrice = car.dailyRate * rentalDays;

      // Addons: Insurance $50/day, Chauffeur $150/day
      let dailyAddonCost = 0;
      if (insuranceSelected) dailyAddonCost += 50;
      if (chauffeurSelected) dailyAddonCost += 150;
      const addonsPrice = dailyAddonCost * rentalDays;

      // Taxes & fees: 10% of subtotal + $100 cleaning flat fee
      const subtotal = basePrice + addonsPrice;
      const taxesAndFees = Math.round(subtotal * 0.1) + 100;
      const totalPrice = subtotal + taxesAndFees;

      // Generate confirmation code like VEL-XXXXXXXX
      const randomString = Math.random().toString(36).substring(2, 10).toUpperCase();
      const confirmationCode = `VEL-${randomString}`;

      // Insert reservation
      const newReservation = await db.insert(reservations).values({
        userId: userDbId,
        carId,
        pickupLocationId,
        pickupDate,
        returnDate,
        driverName,
        driverEmail,
        driverPhone,
        driverLicense,
        driverDob,
        insuranceSelected: !!insuranceSelected,
        chauffeurSelected: !!chauffeurSelected,
        rentalDays,
        basePrice,
        addonsPrice,
        taxesAndFees,
        totalPrice,
        status: "confirmed",
        confirmationCode,
      }).returning();

      res.status(201).json({
        ...newReservation[0],
        car,
      });
    } catch (error) {
      console.error("Error creating reservation:", error);
      res.status(500).json({ error: "Failed to confirm your booking. Please try again." });
    }
  });

  // Vite Integration for Dev / Prod
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
