import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, boolean } from 'drizzle-orm/pg-core';

// 1. Users Table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID (string)
  email: text('email').notNull(),
  displayName: text('display_name'),
  photoURL: text('photo_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Users relationships
export const usersRelations = relations(users, ({ many }) => ({
  reservations: many(reservations),
  favorites: many(favorites),
}));

// 2. Cars Table
export const cars = pgTable('cars', {
  id: serial('id').primaryKey(),
  brand: text('brand').notNull(),
  model: text('model').notNull(),
  year: integer('year').notNull(),
  dailyRate: integer('daily_rate').notNull(), // Daily rate in USD
  photos: text('photos').array().notNull(), // PostgreSQL array of photo URLs
  engine: text('engine').notNull(),
  horsepower: integer('horsepower').notNull(),
  topSpeed: text('top_speed').notNull(), // e.g. "211 mph"
  zeroToSixty: text('zero_to_sixty').notNull(), // e.g. "2.5s"
  transmission: text('transmission').notNull(),
  drivetrain: text('drivetrain').notNull(),
  seats: integer('seats').notNull(),
  description: text('description').notNull(),
});

// Cars relationships
export const carsRelations = relations(cars, ({ many }) => ({
  reservations: many(reservations),
  favorites: many(favorites),
}));

// 3. Pickup Locations Table
export const pickupLocations = pgTable('pickup_locations', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  city: text('city').notNull(),
  country: text('country').notNull(),
  address: text('address').notNull(),
});

// Pickup Locations relationships
export const pickupLocationsRelations = relations(pickupLocations, ({ many }) => ({
  reservations: many(reservations),
}));

// 4. Featured Destinations Table
export const destinations = pgTable('destinations', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  city: text('city').notNull(),
  country: text('country').notNull(),
  photo: text('photo').notNull(), // Scenic background photo
});

// 5. Reservations Table
export const reservations = pgTable('reservations', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  carId: integer('car_id')
    .references(() => cars.id)
    .notNull(),
  pickupLocationId: integer('pickup_location_id')
    .references(() => pickupLocations.id)
    .notNull(),
  pickupDate: text('pickup_date').notNull(), // YYYY-MM-DD
  returnDate: text('return_date').notNull(), // YYYY-MM-DD
  driverName: text('driver_name').notNull(),
  driverEmail: text('driver_email').notNull(),
  driverPhone: text('driver_phone').notNull(),
  driverLicense: text('driver_license').notNull(),
  driverDob: text('driver_dob').notNull(), // YYYY-MM-DD
  insuranceSelected: boolean('insurance_selected').notNull().default(false),
  chauffeurSelected: boolean('chauffeur_selected').notNull().default(false),
  rentalDays: integer('rental_days').notNull(),
  basePrice: integer('base_price').notNull(), // dailyRate * rentalDays
  addonsPrice: integer('addons_price').notNull(),
  taxesAndFees: integer('taxes_and_fees').notNull(),
  totalPrice: integer('total_price').notNull(),
  status: text('status').notNull().default('confirmed'), // 'confirmed', 'cancelled'
  confirmationCode: text('confirmation_code').notNull().unique(), // VEL-XXXXXXXX
  createdAt: timestamp('created_at').defaultNow(),
});

// Reservations relationships
export const reservationsRelations = relations(reservations, ({ one }) => ({
  user: one(users, {
    fields: [reservations.userId],
    references: [users.id],
  }),
  car: one(cars, {
    fields: [reservations.carId],
    references: [cars.id],
  }),
  pickupLocation: one(pickupLocations, {
    fields: [reservations.pickupLocationId],
    references: [pickupLocations.id],
  }),
}));

// 6. Favorites Table
export const favorites = pgTable('favorites', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  carId: integer('car_id')
    .references(() => cars.id)
    .notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Favorites relationships
export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
  car: one(cars, {
    fields: [favorites.carId],
    references: [cars.id],
  }),
}));
