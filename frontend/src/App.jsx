import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { authService } from "./services/authService";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Search from "./pages/Search";
import BusList from "./pages/BusList";
import SeatSelection from "./pages/SeatSelection";
import BookingConfirmation from "./pages/BookingConfirmation";
import MyBookings from "./pages/MyBookings";

import "./styles/global.css";

// Protected route wrapper
function ProtectedRoute({ children }) {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Public route: redirect to /search if already logged in
function PublicRoute({ children }) {
  if (authService.isAuthenticated()) {
    return <Navigate to="/search" replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public routes */}
        <Route
          path="/login"
          element={<PublicRoute><Login /></PublicRoute>}
        />
        <Route
          path="/register"
          element={<PublicRoute><Register /></PublicRoute>}
        />

        {/* Protected routes */}
        <Route
          path="/search"
          element={<ProtectedRoute><Search /></ProtectedRoute>}
        />
        <Route
          path="/buses"
          element={<ProtectedRoute><BusList /></ProtectedRoute>}
        />
        <Route
          path="/seats/:busId"
          element={<ProtectedRoute><SeatSelection /></ProtectedRoute>}
        />
        <Route
          path="/booking-confirmation"
          element={<ProtectedRoute><BookingConfirmation /></ProtectedRoute>}
        />
        <Route
          path="/my-bookings"
          element={<ProtectedRoute><MyBookings /></ProtectedRoute>}
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
