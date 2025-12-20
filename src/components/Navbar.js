import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // 🔐 Hide navbar if user is not logged in
  if (!token) return null;

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <Link style={styles.link} to="/services">
          Services
        </Link>

        <Link style={styles.link} to="/book">
          Book
        </Link>

        {role === "admin" && (
          <Link style={styles.link} to="/admin">
            Admin
          </Link>
        )}
      </div>

      <button onClick={handleLogout} style={styles.logout}>
        Logout
      </button>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#f5f5f5",
    borderBottom: "1px solid #ddd",
  },
  left: {
    display: "flex",
    gap: "15px",
  },
  link: {
    textDecoration: "none",
    color: "#333",
    fontWeight: "500",
  },
  logout: {
    backgroundColor: "#e53935",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    cursor: "pointer",
    borderRadius: "4px",
  },
};
