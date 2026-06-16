import { db } from './index.ts';
import { cars, pickupLocations, destinations } from './schema.ts';
import { eq } from 'drizzle-orm';

export async function seedIfNeeded() {
  try {
    // Check if we need to supplement/update locations and destinations
    const currentLocs = await db.select().from(pickupLocations);
    if (currentLocs.length < 10) {
      console.log('Supplementing database with extensive global locations...');
      try {
        // Attempt to clean old small set if no reservations stand in the way
        await db.delete(destinations);
        await db.delete(pickupLocations);
      } catch (err) {
        console.log('Previous locations have active reservations; appending new ones...');
      }

      const locationsToInsert = [
        { name: "Casino de Monte-Carlo", city: "Monte Carlo", country: "Monaco", address: "Place du Casino, 98000 Monaco" },
        { name: "Downtown Dubai", city: "Dubai", country: "United Arab Emirates", address: "Sheikh Mohammed bin Rashid Blvd, Downtown Dubai" },
        { name: "Beverly Hills Hotel", city: "Los Angeles", country: "United States", address: "9641 Sunset Blvd, Beverly Hills, CA 90210" },
        { name: "South Beach Front", city: "Miami", country: "United States", address: "Ocean Drive, Miami Beach, FL 33139" },
        { name: "The Plaza Hotel", city: "New York City", country: "United States", address: "768 5th Ave, New York, NY 10019" },
        { name: "The Ritz London", city: "London", country: "United Kingdom", address: "150 Piccadilly, London W1J 9BR" },
        { name: "Ginza Luxury Sky Lounge", city: "Tokyo", country: "Japan", address: "Chuo City, Tokyo 104-0061" },
        { name: "Champs-Élysées Elite Club", city: "Paris", country: "France", address: "Av. des Champs-Élysées, 75008 Paris" },
        { name: "Piazza del Duomo Exclusive VIP Lounge", city: "Milan", country: "Italy", address: "Piazza del Duomo, 20121 Milano" },
        { name: "Marina Bay Sands VIP Ground Suite", city: "Singapore", country: "Singapore", address: "10 Bayfront Ave, Singapore 018956" },
        { name: "President Wilson Yacht Haven", city: "Geneva", country: "Switzerland", address: "Quai Wilson 47, 1211 Genève" },
        { name: "Sydney Opera House Private Esplanade", city: "Sydney", country: "Australia", address: "Bennelong Point, Sydney NSW 2000" },
        { name: "V&A Waterfront Marina Luxury Suite", city: "Cape Town", country: "South Africa", address: "V&A Waterfront, Cape Town 8001" },
        { name: "Bayerischer Hof Premium Depot", city: "Munich", country: "Germany", address: "Promenadepl. 2-6, 80333 München" },
        { name: "The Taj Mahal Palace Gold Archway", city: "Mumbai", country: "India", address: "Apollo Bandar, Colaba, Mumbai 400001" },
        { name: "Marina Ibiza Yacht Club Lounge", city: "Ibiza", country: "Spain", address: "Passeig Joan Carles I, 07800 Eivissa" },
        { name: "Villa d'Este Lakeside Heliport", city: "Lake Como", country: "Italy", address: "Via Regina 40, Cernobbio" },
        { name: "The Bund Elite High-Rise Suite", city: "Shanghai", country: "China", address: "The Bund, Huangpu, Shanghai 200002" },
        { name: "CN Tower Luxury Valet Suite", city: "Toronto", country: "Canada", address: "290 Bremner Blvd, Toronto, ON M5V 3L9" }
      ];

      for (const loc of locationsToInsert) {
        // Prevent duplicate city names if already there
        const match = currentLocs.find(cl => cl.city.toLowerCase() === loc.city.toLowerCase());
        if (!match) {
          await db.insert(pickupLocations).values(loc);
        }
      }

      await db.insert(destinations).values([
        { name: "Swiss Alps Mountain Passes", city: "Geneva", country: "Switzerland", photo: "https://images.unsplash.com/photo-1531310197839-ccf54634509e?q=80&w=1200&auto=format&fit=crop" },
        { name: "Mt. Fuji Scenic Highways", city: "Tokyo", country: "Japan", photo: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop" },
        { name: "Lake Como Lakeside Drive", city: "Milan", country: "Italy", photo: "https://images.unsplash.com/photo-1532960401447-7dd05bef20b0?q=80&w=1200&auto=format&fit=crop" }
      ]).catch(() => {});
    }

    // Check if cars already exist
    const existingCars = await db.select().from(cars).limit(1);
    if (existingCars.length > 0) {
      console.log('Cars list already seeded - checking photos updates...');
      // Safely ensure McLaren and Bugatti images are fully active and not broken in existing database
      await db.update(cars)
        .set({
          photos: [
            "https://images.unsplash.com/photo-1621135802920-133df287f89c?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1562591176-969c3a37b385?q=80&w=1200&auto=format&fit=crop"
          ]
        })
        .where(eq(cars.brand, "McLaren"));

      await db.update(cars)
        .set({
          photos: [
            "https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1200&auto=format&fit=crop"
          ]
        })
        .where(eq(cars.brand, "Bugatti"));

      console.log('McLaren and Bugatti premium certified photos sync completed.');
      return;
    }

    console.log('Seeding database with default luxury supercars, destinations, and spots...');

    // 2. Insert Cars
    await db.insert(cars).values([
      {
        brand: "Ferrari",
        model: "SF90 Stradale",
        year: 2023,
        dailyRate: 1450,
        photos: [
          "https://images.unsplash.com/photo-1624571409412-1f253e1ecc89?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=1200&auto=format&fit=crop"
        ],
        engine: "4.0L Twin-Turbo V8 Hybrid",
        horsepower: 986,
        topSpeed: "211 mph",
        zeroToSixty: "2.5s",
        transmission: "8-speed dual-clutch",
        drivetrain: "AWD",
        seats: 2,
        description: "The absolute pinnacle of modern Italian engineering. The Ferrari SF90 Stradale blends a roaring twin-turbo V8 with three electric motors to deliver a breathtaking 986 horsepower. Experience near-silent zero-emissions around town or unleash absolute fury on the open road."
      },
      {
        brand: "Lamborghini",
        model: "Aventador SVJ",
        year: 2022,
        dailyRate: 1650,
        photos: [
          "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1200&auto=format&fit=crop"
        ],
        engine: "6.5L Naturally Aspirated V12",
        horsepower: 759,
        topSpeed: "217 mph",
        zeroToSixty: "2.8s",
        transmission: "7-speed ISR",
        drivetrain: "AWD",
        seats: 2,
        description: "A naturally-aspirated V12 symphony that commands attention. The Aventador SVJ is a track-focused beast with active aerodynamics and ferocious styling. Only 900 units exist worldwide. Hear the roar, feel the incredible G-force."
      },
      {
        brand: "McLaren",
        model: "765LT",
        year: 2023,
        dailyRate: 1550,
        photos: [
          "https://images.unsplash.com/photo-1621135802920-133df287f89c?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1562591176-969c3a37b385?q=80&w=1200&auto=format&fit=crop"
        ],
        engine: "4.0L Twin-Turbo V8",
        horsepower: 755,
        topSpeed: "205 mph",
        zeroToSixty: "2.7s",
        transmission: "7-speed dual-clutch",
        drivetrain: "RWD",
        seats: 2,
        description: "Lightweight, laser-focused, and mind-numbingly quick. The McLaren 765LT is a pure-bred track weapon designed for the road. Its extreme aerodynamics and ultra-responsive steering provide visceral driving feedback."
      },
      {
        brand: "Porsche",
        model: "911 GT3 RS",
        year: 2023,
        dailyRate: 950,
        photos: [
          "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop"
        ],
        engine: "4.0L Naturally Aspirated Boxer-6",
        horsepower: 518,
        topSpeed: "184 mph",
        zeroToSixty: "3.0s",
        transmission: "7-speed PDK",
        drivetrain: "RWD",
        seats: 2,
        description: "The undisputed king of precision handling. The Porsche 911 GT3 RS is a literal racing car with license plates, boasting a high-revving 9,000 RPM naturally aspirated flat-six and active DRS rear wings."
      },
      {
        brand: "Bugatti",
        model: "Chiron",
        year: 2021,
        dailyRate: 4500,
        photos: [
          "https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1200&auto=format&fit=crop"
        ],
        engine: "8.0L Quad-Turbo W16",
        horsepower: 1479,
        topSpeed: "261 mph",
        zeroToSixty: "2.4s",
        transmission: "7-speed dual-clutch",
        drivetrain: "AWD",
        seats: 2,
        description: "An unparalleled masterpiece of automotive art. The Bugatti Chiron harnesses a 16-cylinder engine with four massive turbochargers, creating a luxury hypercar experience that feels like piloting a private jet."
      },
      {
        brand: "Aston Martin",
        model: "DBS Superleggera",
        year: 2022,
        dailyRate: 1100,
        photos: [
          "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?q=80&w=1200&auto=format&fit=crop"
        ],
        engine: "5.2L Twin-Turbo V12",
        horsepower: 715,
        topSpeed: "211 mph",
        zeroToSixty: "3.2s",
        transmission: "8-speed automatic",
        drivetrain: "RWD",
        seats: 4,
        description: "The ultimate grand tourer. Elegance meets brutal force in the DBS Superleggera. Its massive 12-cylinder engine serves a wave of endless torque, wrapped in stunning hand-crafted leather and lightweight carbon fiber."
      },
      {
        brand: "Mercedes-AMG",
        model: "GT Black Series",
        year: 2021,
        dailyRate: 1250,
        photos: [
          "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1200&auto=format&fit=crop"
        ],
        engine: "4.0L Twin-Turbo V8 (Flat-Plane Crank)",
        horsepower: 720,
        topSpeed: "202 mph",
        zeroToSixty: "3.1s",
        transmission: "7-speed dual-clutch",
        drivetrain: "RWD",
        seats: 2,
        description: "Directly derived from Formula 1 racing technology. With its race-inspired flat-plane crank V8 and colossal manually-adjustable spoiler, the Black Series holds lap records globally and offers unmatched mechanical grip."
      },
      {
        brand: "Rolls-Royce",
        model: "Ghost",
        year: 2023,
        dailyRate: 1350,
        photos: [
          "https://images.unsplash.com/photo-1632245889029-e406faaa34cd?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop"
        ],
        engine: "6.75L Twin-Turbo V12",
        horsepower: 563,
        topSpeed: "155 mph",
        zeroToSixty: "4.6s",
        transmission: "8-speed automatic",
        drivetrain: "AWD",
        seats: 5,
        description: "The absolute standard of pure, uncompromised luxury travel. Effortless power from a whisper-quiet twin-turbo V12 is paired with the iconic 'Magic Carpet Ride' planar suspension system and hand-crafted wood and leather work."
      }
    ]);

    // 3. Insert Locations
    await db.insert(pickupLocations).values([
      { name: "Casino de Monte-Carlo", city: "Monte Carlo", country: "Monaco", address: "Place du Casino, 98000 Monaco" },
      { name: "Downtown Dubai", city: "Dubai", country: "United Arab Emirates", address: "Sheikh Mohammed bin Rashid Blvd, Downtown Dubai" },
      { name: "Beverly Hills Hotel", city: "Los Angeles", country: "United States", address: "9641 Sunset Blvd, Beverly Hills, CA 90210" },
      { name: "South Beach Front", city: "Miami", country: "United States", address: "Ocean Drive, Miami Beach, FL 33139" },
      { name: "The Plaza Hotel", city: "New York City", country: "United States", address: "768 5th Ave, New York, NY 10019" },
      { name: "The Ritz London", city: "London", country: "United Kingdom", address: "150 Piccadilly, London W1J 9BR" },
      { name: "Ginza Luxury Sky Lounge", city: "Tokyo", country: "Japan", address: "Chuo City, Tokyo 104-0061" },
      { name: "Champs-Élysées Elite Club", city: "Paris", country: "France", address: "Av. des Champs-Élysées, 75008 Paris" },
      { name: "Piazza del Duomo Exclusive VIP Lounge", city: "Milan", country: "Italy", address: "Piazza del Duomo, 20121 Milano" },
      { name: "Marina Bay Sands VIP Ground Suite", city: "Singapore", country: "Singapore", address: "10 Bayfront Ave, Singapore 018956" },
      { name: "President Wilson Yacht Haven", city: "Geneva", country: "Switzerland", address: "Quai Wilson 47, 1211 Genève" },
      { name: "Sydney Opera House Private Esplanade", city: "Sydney", country: "Australia", address: "Bennelong Point, Sydney NSW 2000" },
      { name: "V&A Waterfront Marina Luxury Suite", city: "Cape Town", country: "South Africa", address: "V&A Waterfront, Cape Town 8001" },
      { name: "Bayerischer Hof Premium Depot", city: "Munich", country: "Germany", address: "Promenadepl. 2-6, 80333 München" },
      { name: "The Taj Mahal Palace Gold Archway", city: "Mumbai", country: "India", address: "Apollo Bandar, Colaba, Mumbai 400001" },
      { name: "Marina Ibiza Yacht Club Lounge", city: "Ibiza", country: "Spain", address: "Passeig Joan Carles I, 07800 Eivissa" },
      { name: "Villa d'Este Lakeside Heliport", city: "Lake Como", country: "Italy", address: "Via Regina 40, Cernobbio" },
      { name: "The Bund Elite High-Rise Suite", city: "Shanghai", country: "China", address: "The Bund, Huangpu, Shanghai 200002" },
      { name: "CN Tower Luxury Valet Suite", city: "Toronto", country: "Canada", address: "290 Bremner Blvd, Toronto, ON M5V 3L9" }
    ]);

    // 4. Insert Destinations
    await db.insert(destinations).values([
      { name: "French Riviera Coastline", city: "Monte Carlo", country: "Monaco", photo: "https://images.unsplash.com/photo-1554147090-e1221a247de6?q=80&w=1200&auto=format&fit=crop" },
      { name: "Arabian Desert Horizons", city: "Dubai", country: "United Arab Emirates", photo: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200&auto=format&fit=crop" },
      { name: "Malibu Scenic Highway 1", city: "Los Angeles", country: "United States", photo: "https://images.unsplash.com/photo-1534430480872-3498386e7856?q=80&w=1200&auto=format&fit=crop" },
      { name: "Coral Gables & SoBe Sands", city: "Miami", country: "United States", photo: "https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?q=80&w=1200&auto=format&fit=crop" },
      { name: "Swiss Alps Mountain Passes", city: "Geneva", country: "Switzerland", photo: "https://images.unsplash.com/photo-1531310197839-ccf54634509e?q=80&w=1200&auto=format&fit=crop" },
      { name: "Mt. Fuji Scenic Highways", city: "Tokyo", country: "Japan", photo: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop" },
      { name: "Lake Como Lakeside Drive", city: "Milan", country: "Italy", photo: "https://images.unsplash.com/photo-1532960401447-7dd05bef20b0?q=80&w=1200&auto=format&fit=crop" }
    ]);

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}
