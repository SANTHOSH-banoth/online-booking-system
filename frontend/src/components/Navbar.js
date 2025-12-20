import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  if (!token) return null; // hide navbar if not logged in

  return (
    <nav style={{ padding: "10px", background: "#eee" }}>
      <Link to="/services">Services</Link>{" | "}
      <Link to="/book">Book</Link>{" | "}

      {role === "admin" && (
        <>
          <Link to="/admin">Admin</Link>{" | "}
        </>
      )}

      <button onClick={logout} style={{ marginLeft: "10px" }}>
        Logout
      </button>
    </nav>
  );
}

