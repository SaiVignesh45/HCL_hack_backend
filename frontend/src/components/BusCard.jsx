import { useNavigate } from "react-router-dom";
import "../styles/global.css";
import "./BusCard.css";

const TYPE_LABELS = {
  AC: { label: "AC" },
  NON_AC: { label: "Non-AC" },
  SLEEPER: { label: "Sleeper" },
  SEMI_SLEEPER: { label: "Semi-Sleeper" },
};

export default function BusCard({ bus }) {
  const navigate = useNavigate();
  const typeInfo = TYPE_LABELS[bus.type] || { label: bus.type };
  const availPct = (bus.availableSeats / bus.totalSeats) * 100;
  const availColor =
    availPct > 50 ? "var(--success)" : availPct > 20 ? "var(--warning)" : "var(--danger)";

  const handleSelectSeats = () => {
    navigate(`/seats/${bus.id}`, { state: { bus } });
  };

  return (
    <div className="bus-card card card-hover animate-fade-in" id={`bus-${bus.id}`}>
      {/* Top strip */}
      <div className="bus-card-header">
        <div className="bus-card-name">
          <span className="bus-type-badge">{typeInfo.label}</span>
          <h3>{bus.name}</h3>
        </div>
        <div className="bus-card-rating">
          <span>{bus.rating?.toFixed(1)}</span>
        </div>
      </div>

      {/* Route & time */}
      <div className="bus-route">
        <div className="route-point">
          <span className="route-time">{bus.departure}</span>
          <span className="route-city">{bus.from}</span>
        </div>
        <div className="route-middle">
          <div className="route-line">
            <span className="route-dot" />
            <div className="route-dash" />
            <span className="route-duration">{bus.duration}</span>
            <div className="route-dash" />
            <span className="route-dot" />
          </div>
        </div>
        <div className="route-point right">
          <span className="route-time">{bus.arrival}</span>
          <span className="route-city">{bus.to}</span>
        </div>
      </div>

      {/* Amenities */}
      <div className="bus-amenities">
        {bus.amenities?.map((a) => (
          <span key={a} className="amenity-tag">{a}</span>
        ))}
      </div>

      {/* Footer */}
      <div className="bus-card-footer">
        <div className="seats-info">
          <div
            className="seats-bar-track"
            title={`${bus.availableSeats} of ${bus.totalSeats} available`}
          >
            <div
              className="seats-bar-fill"
              style={{ width: `${availPct}%`, background: availColor }}
            />
          </div>
          <span className="seats-label" style={{ color: availColor }}>
            {bus.availableSeats} seats left
          </span>
        </div>
        <div className="bus-price-block">
          <span className="price-currency">₹</span>
          <span className="price-amount">{bus.price}</span>
          <span className="price-per">/ seat</span>
        </div>
        <button
          className="btn btn-primary"
          onClick={handleSelectSeats}
          id={`select-seats-${bus.id}`}
        >
          Select Seats →
        </button>
      </div>
    </div>
  );
}
