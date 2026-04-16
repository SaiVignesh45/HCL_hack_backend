import { LOCAL_STORAGE_KEYS } from "../utils/constants";

const getBookingsFromStorage = () => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEYS.BOOKINGS);
  return data ? JSON.parse(data) : [];
};

const saveBookingsToStorage = (bookings) => {
  localStorage.setItem(LOCAL_STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
};

export const bookingService = {
  createBooking: async ({ busId, busDetails, seatIds, seatNumbers, totalPrice, date, userId }) => {
    await new Promise((res) => setTimeout(res, 1000));

    const booking = {
      bookingId: `BK${Date.now()}`,
      busId,
      busDetails,
      seatIds,
      seatNumbers,
      totalPrice,
      date,
      userId,
      status: "CONFIRMED",
      bookedAt: new Date().toISOString(),
    };

    const bookings = getBookingsFromStorage();
    bookings.unshift(booking); // Latest first
    saveBookingsToStorage(bookings);

    return booking;
  },

  getMyBookings: async (userId) => {
    await new Promise((res) => setTimeout(res, 400));
    const bookings = getBookingsFromStorage();
    return bookings.filter((b) => b.userId === userId);
  },

  cancelBooking: async (bookingId) => {
    await new Promise((res) => setTimeout(res, 600));
    const bookings = getBookingsFromStorage();
    const updated = bookings.map((b) =>
      b.bookingId === bookingId ? { ...b, status: "CANCELLED" } : b
    );
    saveBookingsToStorage(updated);
    return { success: true };
  },

  getBookingById: async (bookingId) => {
    await new Promise((res) => setTimeout(res, 300));
    const bookings = getBookingsFromStorage();
    return bookings.find((b) => b.bookingId === bookingId) || null;
  },
};
