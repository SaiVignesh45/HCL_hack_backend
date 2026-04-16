export const API_BASE_URL = "http://localhost:8000/api";

export const SEAT_STATUS = {
  AVAILABLE: "AVAILABLE",
  SELECTED: "SELECTED",
  BOOKED: "BOOKED",
};

export const BUS_TYPES = {
  AC: "AC",
  NON_AC: "NON_AC",
  SLEEPER: "SLEEPER",
  SEMI_SLEEPER: "SEMI_SLEEPER",
};

export const PRICE_PER_SEAT = 350; // Default price per seat in INR

export const LOCAL_STORAGE_KEYS = {
  TOKEN: "busBook_token",
  USER: "busBook_user",
  BOOKINGS: "busBook_bookings",
};
