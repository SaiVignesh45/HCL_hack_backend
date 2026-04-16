import { SEAT_STATUS } from "../utils/constants";

// Mock bus data to simulate backend responses
const MOCK_BUSES = [
  {
    id: 1,
    name: "Royal Cruiser Express",
    type: "AC",
    from: "Mumbai",
    to: "Pune",
    departure: "06:00",
    arrival: "09:30",
    duration: "3h 30m",
    price: 450,
    totalSeats: 40,
    amenities: ["WiFi", "USB Charging", "AC", "Water Bottle"],
    rating: 4.5,
  },
  {
    id: 2,
    name: "Golden Star Travels",
    type: "SLEEPER",
    from: "Mumbai",
    to: "Pune",
    departure: "10:00",
    arrival: "14:00",
    duration: "4h",
    price: 650,
    totalSeats: 32,
    amenities: ["Blanket", "Pillow", "AC", "Snacks"],
    rating: 4.2,
  },
  {
    id: 3,
    name: "Swift Connect",
    type: "NON_AC",
    from: "Mumbai",
    to: "Pune",
    departure: "14:30",
    arrival: "18:00",
    duration: "3h 30m",
    price: 280,
    totalSeats: 44,
    amenities: ["USB Charging"],
    rating: 3.8,
  },
  {
    id: 4,
    name: "Night Rider Deluxe",
    type: "SEMI_SLEEPER",
    from: "Delhi",
    to: "Agra",
    departure: "22:00",
    arrival: "02:30",
    duration: "4h 30m",
    price: 520,
    totalSeats: 36,
    amenities: ["AC", "Blanket", "USB Charging"],
    rating: 4.0,
  },
  {
    id: 5,
    name: "Sunrise Express",
    type: "AC",
    from: "Bangalore",
    to: "Chennai",
    departure: "07:00",
    arrival: "12:00",
    duration: "5h",
    price: 580,
    totalSeats: 40,
    amenities: ["WiFi", "AC", "Snacks", "USB Charging"],
    rating: 4.7,
  },
];

// Generate seats for a bus
const generateSeats = (busId, totalSeats) => {
  const seats = [];
  const bookedIndices = new Set();
  const bookedCount = Math.floor(totalSeats * 0.4); // 40% pre-booked
  while (bookedIndices.size < bookedCount) {
    bookedIndices.add(Math.floor(Math.random() * totalSeats));
  }

  for (let i = 0; i < totalSeats; i++) {
    const row = Math.floor(i / 4) + 1;
    const col = (i % 4) + 1;
    const colLabel = ["A", "B", "C", "D"][i % 4];
    seats.push({
      id: `${busId}-${i + 1}`,
      seat_id: `${busId}-${i + 1}`,
      seat_number: `${row}${colLabel}`,
      row,
      col,
      status: bookedIndices.has(i) ? SEAT_STATUS.BOOKED : SEAT_STATUS.AVAILABLE,
    });
  }
  return seats;
};

export const busService = {
  searchBuses: async ({ source, destination, date }) => {
    await new Promise((res) => setTimeout(res, 900)); // Simulate API delay

    const results = MOCK_BUSES.filter(
      (bus) =>
        bus.from.toLowerCase().includes(source.toLowerCase()) &&
        bus.to.toLowerCase().includes(destination.toLowerCase())
    ).map((bus) => ({
      ...bus,
      date,
      availableSeats:
        bus.totalSeats - Math.floor(bus.totalSeats * 0.4),
    }));

    return results;
  },

  getBusById: async (busId) => {
    await new Promise((res) => setTimeout(res, 400));
    return MOCK_BUSES.find((b) => b.id === parseInt(busId)) || null;
  },

  getBusSeats: async (busId) => {
    await new Promise((res) => setTimeout(res, 700));
    const bus = MOCK_BUSES.find((b) => b.id === parseInt(busId));
    if (!bus) throw new Error("Bus not found");
    return generateSeats(busId, bus.totalSeats);
  },
};
