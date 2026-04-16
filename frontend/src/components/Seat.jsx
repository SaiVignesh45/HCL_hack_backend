import "../styles/seat.css";

export default function Seat({ seat, isSelected, onClick }) {
  const status = isSelected ? "selected" : seat.status.toLowerCase();

  const icons = {
    available: "💺",
    selected: "✅",
    booked: "🚫",
  };

  return (
    <button
      className={`seat ${status}`}
      onClick={() => onClick(seat)}
      disabled={seat.status === "BOOKED"}
      title={
        seat.status === "BOOKED"
          ? `Seat ${seat.seat_number} — Booked`
          : isSelected
          ? `Seat ${seat.seat_number} — Selected (Click to deselect)`
          : `Seat ${seat.seat_number} — Available`
      }
      aria-label={`Seat ${seat.seat_number}, ${status}`}
      id={`seat-${seat.seat_id}`}
    >
      <span className="seat-icon">{icons[status]}</span>
      <span className="seat-number">{seat.seat_number}</span>
    </button>
  );
}
