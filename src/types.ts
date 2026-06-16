export interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  dailyRate: number;
  photos: string[];
  engine: string;
  horsepower: number;
  topSpeed: string;
  zeroToSixty: string;
  transmission: string;
  drivetrain: string;
  seats: number;
  description: string;
}

export interface PickupLocation {
  id: number;
  name: string;
  city: string;
  country: string;
  address: string;
}

export interface Destination {
  id: number;
  name: string;
  city: string;
  country: string;
  photo: string;
}

export interface Reservation {
  id: number;
  userId: number;
  carId: number;
  pickupLocationId: number;
  pickupDate: string;
  returnDate: string;
  driverName: string;
  driverEmail: string;
  driverPhone: string;
  driverLicense: string;
  driverDob: string;
  insuranceSelected: boolean;
  chauffeurSelected: boolean;
  rentalDays: number;
  basePrice: number;
  addonsPrice: number;
  taxesAndFees: number;
  totalPrice: number;
  status: string;
  confirmationCode: string;
  createdAt: string;
  car?: Car;
  location?: PickupLocation;
}
