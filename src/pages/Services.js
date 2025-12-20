import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get("/services");
        setServices(res.data);
      } catch (err) {
        setError("Failed to load services");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) return <p style={styles.center}>Loading services...</p>;
  if (error) return <p style={{ ...styles.center, color: "red" }}>{error}</p>;

  return (
    <div style={styles.container}>
      <h2>Available Services</h2>

      <div style={styles.grid}>
        {services.map((service) => (
          <div key={service._id} style={styles.card}>
            <h3>{service.name}</h3>
            <p>{service.description}</p>
            <p>
              <strong>Price:</strong> ₹{service.price}
            </p>
            <p>
              <strong>Duration:</strong> {service.duration}
            </p>

            <button
              style={styles.button}
              onClick={() =>
                navigate("/book", { state: { serviceId: service._id } })
              }
            >
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
  },
  center: {
    textAlign: "center",
    marginTop: "40px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },
  card: {
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    background: "#fff",
  },
  button: {
    marginTop: "10px",
    padding: "8px 12px",
    background: "#1976d2",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    borderRadius: "4px",
  },
};

