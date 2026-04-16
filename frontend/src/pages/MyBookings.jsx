import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { bookingService } from "../services/bookingService";
import { authService } from "../services/authService";
import "../styles/global.css";
import "./MyBookings.css";

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  const user = authService.getCurrentUser();

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    const load = async () => {
      try {
        const data = await bookingService.getMyBookings(user.id);
        setBookings(data);
      } catch {
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    setCancelling(bookingId);
    try {
      await bookingService.cancelBooking(bookingId);
      setBookings((prev) =>
        prev.map((b) =>
          b.bookingId === bookingId ? { ...b, status: "CANCELLED" } : b
        )
      );
    } catch {
      alert("Failed to cancel. Please try again.");
    } finally {
      setCancelling(null);
    }
  };

  const handleViewTicket = (booking) => {
    navigate("/booking-confirmation", { state: { booking } });
  };

  const confirmed = bookings.filter((b) => b.status === "CONFIRMED");
  const cancelled = bookings.filter((b) => b.status === "CANCELLED");

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="container section">
          {/* Header */}
          <div className="my-bookings-header animate-fade-in">
            <div>
              <h1>My Bookings</h1>
              <p style={{ color: "var(--text-muted)", marginTop: "0.25rem" }}>
                All your journeys in one place
              </p>
            </div>
            <div className="bookings-stats">
              <div className="bstat">
                <span className="bstat-val">{confirmed.length}</span>
                <span className="bstat-label">Confirmed</span>
              </div>
              <div className="bstat">
                <span className="bstat-val" style={{ color: "var(--danger)" }}>{cancelled.length}</span>
                <span className="bstat-label">Cancelled</span>
              </div>
            </div>
          </div>

          {loading ? (
            <Loader text="Fetching your bookings…" />
          ) : bookings.length === 0 ? (
            <div className="empty-state animate-fade-in">
              <div className="empty-state-icon">🎟️</div>
              <h3>No bookings yet</h3>
              <p>Your booking history will appear here once you book a trip.</p>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/search")}
                style={{ marginTop: "0.5rem" }}
                id="search-now-btn"
              >
                Search Buses
              </button>
            </div>
          ) : (
            <div className="bookings-list">
              {bookings.map((booking, i) => {
                const bus = booking.busDetails;
                const isCancelled = booking.status === "CANCELLED";
                const travelDate = new Date(booking.date).toLocaleDateString("en-IN", {
                  day: "numeric", month: "short", year: "numeric",
                });

                return (
                  <div
                    key={booking.bookingId}
                    className={`booking-card card animate-fade-in ${isCancelled ? "cancelled" : ""}`}
                    style={{ animationDelay: `${i * 0.06}s` }}
                    id={`booking-${booking.bookingId}`}
                  >
                    {/* Card header */}
                    <div className="booking-card-top">
                      <div className="booking-id-row">
                        <span className="booking-id-label">Booking ID</span>
                        <span className="booking-id">{booking.bookingId}</span>
                      </div>
                      <span className={`badge ${isCancelled ? "badge-danger" : "badge-success"}`}>
                        {isCancelled ? "❌ Cancelled" : "✅ Confirmed"}
                      </span>
                    </div>

                    <hr className="divider" />

                    {/* Route */}
                    <div className="booking-route">
                      <div className="br-city">
                        <span className="br-time">{bus?.departure}</span>
                        <span className="br-name">{bus?.from}</span>
                      </div>
                      <div className="br-middle">
                        <span className="br-duration">{bus?.duration}</span>
                        <div className="br-line">
                          <span className="br-dot" />
                          <div className="br-dash" />
                          <span className="br-dot" />
                        </div>
                      </div>
                      <div className="br-city right">
                        <span className="br-time">{bus?.arrival}</span>
                        <span className="br-name">{bus?.to}</span>
                      </div>
                    </div>

                    {/* Meta info */}
                    <div className="booking-meta">
                      <div className="meta-item">
                        <span className="meta-label">🚌 Bus</span>
                        <span className="meta-value">{bus?.name}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">📅 Date</span>
                        <span className="meta-value">{travelDate}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">💺 Seats</span>
                        <span className="meta-value">{booking.seatNumbers?.join(", ")}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">💳 Paid</span>
                        <span className="meta-value" style={{ color: "var(--accent)", fontWeight: "700" }}>
                          ₹{booking.totalPrice?.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="booking-actions">
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleViewTicket(booking)}
                        id={`view-ticket-${booking.bookingId}`}
                      >
                        🎫 View Ticket
                      </button>
                      {!isCancelled && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleCancel(booking.bookingId)}
                          disabled={cancelling === booking.bookingId}
                          id={`cancel-${booking.bookingId}`}
                        >
                          {cancelling === booking.bookingId ? "Cancelling…" : "Cancel Booking"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}