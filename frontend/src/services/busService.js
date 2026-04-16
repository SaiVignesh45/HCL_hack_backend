import { apiGet } from "./api";

const mapBus = (bus) => {
    const parseTime = (isoString) => {
        if (!isoString) return "";
        return isoString.substring(11, 16); 
    };

    return {
        id: bus.busId,
        name: bus.name,
        type: bus.type,
        from: bus.source,
        to: bus.destination,
        departure: parseTime(bus.departureTime),
        arrival: parseTime(bus.arrivalTime),
        duration: "Scheduled", 
        price: bus.price,
        totalSeats: bus.capacity,
        availableSeats: bus.capacity, // Standard hackathon baseline since complex aggregation wasn't in original design
        amenities: ["Comfort Seats", "Air Conditioned"],
        rating: 4.8,
        date: bus.date
    };
};

export const busService = {
  searchBuses: async ({ source, destination, date }) => {
    const buses = await apiGet(`/buses?source=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}&date=${encodeURIComponent(date)}`);
    return buses.map(mapBus);
  },

  getBusById: async (busId) => {
    const bus = await apiGet(`/buses/${busId}`);
    return mapBus(bus);
  },

  getBusSeats: async (busId) => {
    const seats = await apiGet(`/buses/${busId}/seats`);
    const labels = ["A", "B", "C", "D"];
    return seats.map(s => {
      // Create a graphical seat label like "1A" instead of raw integer
      // Indexing logic: 4 seats per row. 1 -> 1A, 2 -> 1B, 5 -> 2A
      const index = s.seatNumber - 1;
      const row = Math.floor(index / 4) + 1;
      const colLabel = labels[index % 4];
      
      return {
          seat_id: s.seatId,
          seat_number: `${row}${colLabel}`,
          status: s.status
      };
    });
  },
};
