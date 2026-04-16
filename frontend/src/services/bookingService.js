import { apiGet, apiPost, apiPut } from "./api";
import { busService } from "./busService";

export const bookingService = {
  createBooking: async ({ busId, seatIds }) => {
    return await apiPost("/bookings", { busId, seatIds });
  },

  getMyBookings: async () => {
    // Fetch raw database rows from Spring Boot
    const rawBookings = await apiGet("/me/bookings");

    // Loop through them and hydrate the data for the UI
    const mappedBookings = await Promise.all(
      rawBookings.map(async (raw) => {
        // Fetch the rich bus details so the frontend can read the name, time, etc.
        const busDetails = await busService.getBusById(raw.busId);
        
        // Let's get the seat map so we know if seatId '4' is "1D" or "2A"
        const allSeats = await busService.getBusSeats(raw.busId);
        const seatObj = allSeats.find(s => s.seat_id === raw.seatId);

        return {
          bookingId: raw.bookingId,
          busDetails: busDetails, 
          date: busDetails.date,             
          seatNumbers: [seatObj ? seatObj.seat_number : raw.seatId], 
          totalPrice: busDetails.price,      
          status: raw.status
        };
      })
    );

    return mappedBookings;
  },

  cancelBooking: async (bookingId) => {
    return await apiPut(`/bookings/${bookingId}/cancel`);
  },

  getBookingById: async (bookingId) => {
    // Instead of raw mapped, use the mapped output itself natively 
    const mappedBookings = await bookingService.getMyBookings();
    return mappedBookings.find(b => parseInt(b.bookingId) === parseInt(bookingId)) || null;
  },
};
