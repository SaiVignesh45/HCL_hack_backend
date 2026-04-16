import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import SeatGrid from "../components/SeatGrid";
import Loader from "../components/Loader";
import { busService } from "../services/busService";
import { authService } from "../services/authService";
import { SEAT_STATUS } from "../utils/constants";
import "../styles/global.css";
import "../styles/seat.css";

export default function SeatSelection() {
  const { busId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [bus, setBus] = useState(state?.bus || null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [seatsData, busData] = await Promise.all([
          busService.getBusSeats(parseInt(busId)),
          bus ? Promise.resolve(bus) : busService.getBusById(parseInt(busId)),
        ]);
        setSeats(seatsData);
        if (!bus) setBus(busData);
      } catch {
        setError("Failed to load seat data. Please go back and try again.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [busId, bus]);

  const handleSeatClick = (seat) => {
    if (seat.status === SEAT_STATUS.BOOKED) return;

    setSelectedSeats((prev) =>
      prev.includes(seat.seat_id)
        ? prev.filter((id) => id !== seat.seat_id)
        : [...prev, seat.seat_id]
    );
  };

  const selectedSeatObjects = seats.filter((s) => selectedSeats.includes(s.seat_id));
  const pricePerSeat = bus?.price || 0;
  const subtotal = selectedSeats.length * pricePerSeat;
  const taxes = Math.round(subtotal * 0.05);
  const total = subtotal + taxes;

  const handleProceed = async () => {
    if (selectedSeats.length === 0) {
      setError("Please select at least one seat to continue.");
      return;
    }
    const user = authService.getCurrentUser();
    if (!user) {
      navigate("/login");
      return;
    }

    setBooking(true);
    try {
      // Navigate to confirmation with booking metadata
      navigate("/booking-confirmation", {
        state: {
          bookingPayload: {
            busId: parseInt(busId),
            busDetails: bus,
            seatIds: selectedSeats,
            seatNumbers: selectedSeatObjects.map((s) => s.seat_number),
            totalPrice: total,
            date: bus?.date || new Date().toISOString().split("T")[0],
            userId: user.id,
          },
        },
      });
    } finally {
      setBooking(false);
    }
  };

  const availableCount = seats.filter((s) => s.status === SEAT_STATUS.AVAILABLE).length;
  const bookedCount = seats.filter((s) => s.status === SEAT_STATUS.BOOKED).length;

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="container section seat-page">
          {/* Breadcrumb */}
          <nav className="breadcrumb animate-fade-in">
            <button onClick={() => navigate("/search")} className="crumb-link">Search</button>
            <span className="crumb-sep">›</span>
            <button onClick={() => navigate(-1)} className="crumb-link">Bus List</button>
            <span className="crumb-sep">›</span>
            <span className="crumb-current">Select Seats</span>
          </nav>

          {error && (
            <div className="auth-error animate-fade-in" style={{ marginBottom: "1rem" }}>
              {error}
            </div>
          )}

          {loading ? (
            <div style={{ padding: "4rem 0" }}>
              <Loader text="Loading seat map…" />
            </div>
          ) : (
            <>
              {/* Bus info banner */}
              {bus && (
                <div className="bus-info-banner card animate-fade-in">
                  <div className="bus-info-left">
                    <div className="bus-info-name">
                      <span className="bus-type-chip">{bus.type}</span>
                      <h2>{bus.name}</h2>
                    </div>
                    <div className="bus-info-route">
                      <span className="route-bold">{bus.from}</span>
                      <span className="route-sep">→</span>
                      <span className="route-bold">{bus.to}</span>
                      <span className="route-meta">
                        {bus.departure} – {bus.arrival} · {bus.duration}
                      </span>
                    </div>
                  </div>
                  <div className="bus-info-stats">
                    <div className="stat">
                      <span className="stat-val" style={{ color: "var(--success)" }}>{availableCount}</span>
                      <span className="stat-label">Available</span>
                    </div>
                    <div className="stat">
                      <span className="stat-val" style={{ color: "var(--danger)" }}>{bookedCount}</span>
                      <span className="stat-label">Booked</span>
                    </div>
                    <div className="stat">
                      <span className="stat-val" style={{ color: "var(--accent)" }}>₹{bus.price}</span>
                      <span className="stat-label">Per Seat</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Legend */}
              <div className="seat-legend animate-fade-in">
                <div className="legend-item">
                  <div className="legend-dot available" />
                  <span>Available</span>
                </div>
                <div className="legend-item">
                  <div className="legend-dot selected" />
                  <span>Selected</span>
                </div>
                <div className="legend-item">
                  <div className="legend-dot booked" />
                  <span>Booked</span>
                </div>
              </div>

              {/* Main layout */}
              <div className="seat-selection-layout">
                {/* Seat grid */}
                <div className="animate-fade-in">
                  <SeatGrid
                    seats={seats}
                    selectedSeats={selectedSeats}
                    onSeatClick={handleSeatClick}
                  />
                </div>

                {/* Booking summary */}
                <div className="booking-summary animate-fade-in">
                  <h3>Booking Summary</h3>

                  {selectedSeats.length === 0 ? (
                    <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", textAlign: "center", padding: "1rem 0" }}>
                      Click on any green seat to select it
                    </p>
                  ) : (
                    <>
                      <div className="selected-seats-list">
                        {selectedSeatObjects.map((s) => (
                          <span key={s.seat_id} className="selected-seat-tag">
                            {s.seat_number}
                          </span>
                        ))}
                      </div>

                      <div className="price-breakdown">
                        <div className="price-row">
                          <span className="label">
                            {selectedSeats.length} seat{selectedSeats.length > 1 ? "s" : ""} × ₹{pricePerSeat}
                          </span>
                          <span className="value">₹{subtotal.toLocaleString()}</span>
                        </div>
                        <div className="price-row">
                          <span className="label">GST (5%)</span>
                          <span className="value">₹{taxes.toLocaleString()}</span>
                        </div>
                        <div className="price-row total">
                          <span className="label">Total</span>
                          <span className="value">₹{total.toLocaleString()}</span>
                        </div>
                      </div>
                    </>
                  )}

                  <button
                    className="btn btn-accent btn-lg"
                    style={{ width: "100%" }}
                    onClick={handleProceed}
                    disabled={selectedSeats.length === 0 || booking}
                    id="proceed-booking-btn"
                  >
                    {booking ? "Processing…" : selectedSeats.length === 0
                      ? "Select Seats First"
                      : `Confirm ${selectedSeats.length} Seat${selectedSeats.length > 1 ? "s" : ""} →`}
                  </button>

                  {selectedSeats.length > 0 && (
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ width: "100%", marginTop: "0.5rem" }}
                      onClick={() => setSelectedSeats([])}
                    >
                      Clear Selection
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
