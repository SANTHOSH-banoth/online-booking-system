import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Services from "./pages/Services";
import Booking from "./pages/Booking";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import MyBookings from "./pages/MyBookings";
import RescheduleBooking from "./pages/RescheduleBooking";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* Default route */}
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />

        {/* USER ROUTES */}
        <Route
          path="/services"
          element={
            <ProtectedRoute>
              <Services />
            </ProtectedRoute>
          }
        />

        <Route
          path="/book"
          element={
            <ProtectedRoute>
              <Booking />
            </ProtectedRoute>
          }
        />

        {/* ADMIN ROUTE */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }

        />
        <Route
  path="/my-bookings"
  element={
    <ProtectedRoute>
      <MyBookings />
    </ProtectedRoute>
  }
/>
<Route
  path="/reschedule"
  element={
    <ProtectedRoute>
      <RescheduleBooking />
    </ProtectedRoute>
  }
/>
      </Routes>
    </Router>
  );
}

export default App;

