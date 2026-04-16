import Seat from "./Seat";
import "../styles/seat.css";

export default function SeatGrid({ seats, selectedSeats, onSeatClick }) {
  if (!seats || seats.length === 0) return null;

  // Group seats into rows of 4 (columns: A, B, [aisle], C, D)
  const rows = [];
  for (let i = 0; i < seats.length; i += 4) {
    rows.push(seats.slice(i, i + 4));
  }

  return (
    <div className="bus-visual">
      {/* Bus header with steering wheel and driver section */}
      <div className="bus-header">
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Driver
          </span>
          <div className="bus-steering">🚗</div>
        </div>
        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
          Front → Back
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.2rem" }}>
          <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Total Seats</span>
          <span style={{ fontSize: "0.9rem", fontWeight: "700", color: "var(--primary)" }}>
            {seats.length}
          </span>
        </div>
      </div>

      {/* Column header labels */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "8px",
          maxWidth: "320px",
          margin: "0 auto 0.5rem",
          padding: "0 2px",
        }}
      >
        {["A", "B", "C", "D"].map((col) => (
          <div
            key={col}
            style={{
              textAlign: "center",
              fontSize: "0.65rem",
              fontWeight: "700",
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            {col}
          </div>
        ))}
      </div>

      {/* Seat grid */}
      <div className="seat-grid-container">
        <div className="seat-grid">
          {rows.map((rowSeats, rowIndex) => (
            <React.Fragment key={rowIndex}>
              {rowSeats.map((seat) => (
                <Seat
                  key={seat.seat_id}
                  seat={seat}
                  isSelected={selectedSeats.includes(seat.seat_id)}
                  onClick={onSeatClick}
                />
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

// Need React for Fragment
import React from "react";
