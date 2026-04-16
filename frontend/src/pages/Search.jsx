import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { busService } from "../services/busService";
import "../styles/global.css";
import "./Search.css";

const POPULAR_ROUTES = [
  { from: "Mumbai", to: "Pune" },
  { from: "Delhi", to: "Agra" },
  { from: "Bangalore", to: "Chennai" },
  { from: "Hyderabad", to: "Vizag" },
];

export default function Search() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({ source: "", destination: "", date: today });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!form.source.trim() || !form.destination.trim()) {
      setError("Please enter both source and destination.");
      return;
    }
    if (!form.date) {
      setError("Please select a travel date.");
      return;
    }
    setLoading(true);
    try {
      const buses = await busService.searchBuses({
        source: form.source,
        destination: form.destination,
        date: form.date,
      });
      navigate("/buses", { state: { buses, searchParams: form } });
    } catch (err) {
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fillRoute = (route) => {
    setForm((prev) => ({ ...prev, source: route.from, destination: route.to }));
  };

  return (
    <>
      <Navbar />
      <div className="page-wrapper search-page">
        {/* Hero */}
        <div className="search-hero">
          <div className="container">
            <div className="hero-text animate-fade-in">
              <div className="hero-eyebrow">India&apos;s Smartest Bus Booking</div>
              <h1 className="hero-title">
                Where are you<br />
                <span className="hero-gradient">headed today?</span>
              </h1>
              <p className="hero-sub">
                Search thousands of routes. Book your seat in seconds.
              </p>
            </div>

            {/* Search Card */}
            <form
              onSubmit={handleSearch}
              className="search-card card animate-fade-in"
              id="search-form"
            >
              <div className="search-fields">
                <div className="input-group search-field">
                  <label className="input-label" htmlFor="search-source">From</label>
                  <input
                    id="search-source"
                    name="source"
                    className="input"
                    placeholder="e.g. Mumbai"
                    value={form.source}
                    onChange={handleChange}
                    autoComplete="off"
                  />
                </div>

                <button
                  type="button"
                  className="swap-btn"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      source: prev.destination,
                      destination: prev.source,
                    }))
                  }
                  title="Swap cities"
                  aria-label="Swap source and destination"
                >
                  ⇄
                </button>

                <div className="input-group search-field">
                  <label className="input-label" htmlFor="search-destination">To</label>
                  <input
                    id="search-destination"
                    name="destination"
                    className="input"
                    placeholder="e.g. Pune"
                    value={form.destination}
                    onChange={handleChange}
                    autoComplete="off"
                  />
                </div>

                <div className="input-group search-field">
                  <label className="input-label" htmlFor="search-date">Travel Date</label>
                  <input
                    id="search-date"
                    name="date"
                    type="date"
                    className="input"
                    value={form.date}
                    min={today}
                    onChange={handleChange}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg search-btn"
                  disabled={loading}
                  id="search-submit"
                >
                  {loading ? "Searching…" : "Search Buses"}
                </button>
              </div>

              {error && <div className="auth-error" style={{ marginTop: "0.75rem" }}>{error}</div>}
            </form>

            {/* Popular Routes */}
            <div className="popular-routes animate-fade-in">
              <p className="popular-label">Popular Routes</p>
              <div className="routes-grid">
                {POPULAR_ROUTES.map((r) => (
                  <button
                    key={`${r.from}-${r.to}`}
                    className="route-chip"
                    onClick={() => fillRoute(r)}
                    type="button"
                  >
                    <span>{r.from}</span>
                    <span className="chip-arrow">→</span>
                    <span>{r.to}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="features-section container">
          {[
            { title: "Instant Booking", desc: "Reserve your seat in under 30 seconds with real-time availability." },
            { title: "Choose Your Seat", desc: "Interactive seat map lets you pick exactly where you want to sit." },
            { title: "Easy Cancellation", desc: "Plans changed? Cancel your booking hassle-free from My Bookings." },
            { title: "Secure Payments", desc: "Your payment info is fully encrypted and never stored." },
          ].map((f) => (
            <div key={f.title} className="feature-card card">
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
