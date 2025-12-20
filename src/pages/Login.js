import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      // ✅ Save JWT & role safely
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      // ✅ Redirect based on role
      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/services");
      }

      // optional cleanup
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "40px auto" }}>
      <h2>Login</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />

        <button
          type="submit"
          style={{ width: "100%", padding: "10px" }}
        >
          Login
        </button>
      </form>
    </div>
  );
}

