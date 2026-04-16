import { Link, useNavigate, useLocation } from "react-router-dom";
import { authService } from "../services/authService";
import "../styles/global.css";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = authService.getCurrentUser();
  const isLoggedIn = authService.isAuthenticated();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        {/* Logo */}
        <Link to={isLoggedIn ? "/search" : "/"} className="navbar-logo">
          <span className="logo-icon">🚌</span>
          <span className="logo-text">
            Bus<span className="logo-accent">Swift</span>
          </span>
        </Link>

        {/* Links */}
        {isLoggedIn && (
          <div className="navbar-links">
            <Link
              to="/search"
              className={`nav-link ${isActive("/search") ? "active" : ""}`}
            >
              🔍 Search
            </Link>
            <Link
              to="/my-bookings"
              className={`nav-link ${isActive("/my-bookings") ? "active" : ""}`}
            >
              🎟️ My Bookings
            </Link>
          </div>
        )}

        {/* Right section */}
        <div className="navbar-right">
          {isLoggedIn ? (
            <>
              <div className="user-pill">
                <span className="user-avatar">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
                <span className="user-name">{user?.name?.split(" ")[0]}</span>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
