import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { bookingService } from "../services/bookingService";
import "../styles/global.css";
import "./BookingConfirmation.css";

export default function BookingConfirmation() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // If we already have a confirmed booking (from MyBookings view)
    if (state?.booking) {
      setBooking(state.booking);
      setLoading(false);
      return;
    }

    // Otherwise create a new booking from payload
    if (!state?.bookingPayload) {
      navigate("/search");
      return;
    }

    const confirm = async () => {
      try {
        const result = await bookingService.createBooking(state.bookingPayload);
        setBooking(result);
      } catch {
        setError("Booking failed. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    confirm();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="page-wrapper">
          <div style={{ padding: "6rem 0" }}>
            <Loader text="Confirming your booking…" />
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="page-wrapper container section">
          <div className="auth-error">{error}</div>
          <button className="btn btn-primary" onClick={() => navigate(-1)} style={{ marginTop: "1rem" }}>
            Go Back
          </button>
        </div>
      </>
    );
  }

  if (!booking) return null;

  const bus = booking.busDetails;
  const bookedAt = new Date(booking.bookedAt).toLocaleString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  const travelDate = new Date(booking.date).toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="container section">
          {/* Success banner */}
          <div className="success-banner animate-scale-in">
            <div className="success-icon-ring">
              <span className="success-icon">✓</span>
            </div>
            <div>
              <h1 className="success-title">Booking Confirmed!</h1>
              <p className="success-sub">
                Your seats are reserved. Have a great journey! 🎉
              </p>
            </div>
          </div>

          {/* Ticket */}
          <div className="ticket animate-fade-in">
            {/* Ticket header */}
            <div className="ticket-header">
              <div className="ticket-logo">🚌 BusSwift</div>
              <div className="ticket-status badge badge-success">
                ✅ {booking.status}
              </div>
            </div>

            {/* Booking ID */}
            <div className="ticket-booking-id">
              <span className="ticket-label">Booking ID</span>
              <span className="ticket-id">{booking.bookingId}</span>
            </div>

            <hr className="divider" />

            {/* Route */}
            <div className="ticket-route">
              <div className="ticket-city">
                <span className="city-name">{bus?.from}</span>
                <span className="city-time">{bus?.departure}</span>
              </div>
              <div className="ticket-route-mid">
                <div className="ticket-bus-icon">🚌</div>
                <div className="ticket-line" />
                <span className="ticket-duration">{bus?.duration}</span>
              </div>
              <div className="ticket-city right">
                <span className="city-name">{bus?.to}</span>
                <span className="city-time">{bus?.arrival}</span>
              </div>
            </div>

            <hr className="divider" />

            {/* Details grid */}
            <div className="ticket-details">
              <div className="ticket-detail-item">
                <span className="ticket-label">Bus</span>
                <span className="ticket-value">{bus?.name}</span>
              </div>
              <div className="ticket-detail-item">
                <span className="ticket-label">Type</span>
                <span className="ticket-value">{bus?.type}</span>
              </div>
              <div className="ticket-detail-item">
                <span className="ticket-label">Travel Date</span>
                <span className="ticket-value">{travelDate}</span>
              </div>
              <div className="ticket-detail-item">
                <span className="ticket-label">Booked At</span>
                <span className="ticket-value">{bookedAt}</span>
              </div>
            </div>

            <hr className="divider" />

            {/* Seats + Price */}
            <div className="ticket-seats-price">
              <div className="ticket-seats-block">
                <span className="ticket-label">Seat Numbers</span>
                <div className="ticket-seats-list">
                  {booking.seatNumbers?.map((sn) => (
                    <span key={sn} className="selected-seat-tag">{sn}</span>
                  ))}
                </div>
              </div>
              <div className="ticket-price-block">
                <span className="ticket-label">Total Paid</span>
                <span className="ticket-total">₹{booking.totalPrice?.toLocaleString()}</span>
              </div>
            </div>

            {/* Ticket perforated bottom */}
            <div className="ticket-perforation">
              <div className="perf-circle left" />
              <div className="perf-line" />
              <div className="perf-circle right" />
            </div>

            <div className="ticket-footer">
              <span>🎫 Show this ticket at the boarding point</span>
            </div>
          </div>

          {/* Actions */}
          <div className="confirmation-actions animate-fade-in">
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate("/my-bookings")}
              id="view-all-bookings-btn"
            >
              🎟️ View All Bookings
            </button>
            <button
              className="btn btn-ghost btn-lg"
              onClick={() => navigate("/search")}
              id="book-another-btn"
            >
              🔍 Book Another
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
