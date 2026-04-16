import { apiGet, apiPost, apiPut } from "./api";

export const bookingService = {
  createBooking: async ({ busId, seatIds }) => {
    return await apiPost("/bookings", { busId, seatIds });
  },

  getMyBookings: async () => {
    return await apiGet("/me/bookings");
  },

  cancelBooking: async (bookingId) => {
    return await apiPut(`/bookings/${bookingId}/cancel`);
  },

  getBookingById: async (bookingId) => {
    // If your backend introduces /bookings/{id}, use it. Otherwise, filter locally:
    const bookings = await apiGet("/me/bookings");
    return bookings.find(b => parseInt(b.bookingId) === parseInt(bookingId)) || null;
  },
};
