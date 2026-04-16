import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import BusCard from "../components/BusCard";
import "../styles/global.css";
import "./BusList.css";

export default function BusList() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const buses = state?.buses || [];
  const params = state?.searchParams || {};

  useEffect(() => {
    if (!state) navigate("/search");
  }, [state, navigate]);

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="container section">
          {/* Header */}
          <div className="buslist-header animate-fade-in">
            <div>
              <div className="buslist-route-label">
                <span>{params.source}</span>
                <span className="route-arrow">→</span>
                <span>{params.destination}</span>
                {params.date && (
                  <span className="buslist-date">
                    📅 {new Date(params.date).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </span>
                )}
              </div>
              <h2>
                {buses.length > 0
                  ? `${buses.length} bus${buses.length > 1 ? "es" : ""} found`
                  : "No buses found"}
              </h2>
            </div>
            <button
              className="btn btn-ghost"
              onClick={() => navigate("/search")}
              id="modify-search-btn"
            >
              ← Modify Search
            </button>
          </div>

          {buses.length === 0 ? (
            <div className="empty-state animate-fade-in">
              <div className="empty-state-icon">🚌</div>
              <h3>No buses found</h3>
              <p>Try different cities or dates to find available buses.</p>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/search")}
                style={{ marginTop: "0.5rem" }}
              >
                Search Again
              </button>
            </div>
          ) : (
            <div className="buslist-grid">
              {buses.map((bus, i) => (
                <div
                  key={bus.id}
                  style={{ animationDelay: `${i * 0.07}s` }}
                  className="animate-fade-in"
                >
                  <BusCard bus={{ ...bus, date: params.date }} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
