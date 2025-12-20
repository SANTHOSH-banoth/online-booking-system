import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  // 🔐 Not logged in
  if (!token) {
    return <Navigate to="/login" />;
  }

  // 🔐 Role-based protection (admin/user)
  if (role && userRole !== role) {
    return <Navigate to="/services" />;
  }

  return children;
}
