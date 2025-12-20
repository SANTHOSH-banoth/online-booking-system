import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/api";

const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

export default function Booking() {
  const location = useLocation();
  const navigate = useNavigate();

  const serviceId = location.state?.serviceId;

  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 🔄 Fetch booked slots when date changes
  useEffect(() => {
    if (!serviceId || !date) return;

    const fetchBookedSlots = async () => {
      try {
        const res = await api.get(
          `/bookings/slots?serviceId=${serviceId}&date=${date}`
        );
        setBookedSlots(res.data);
      } catch (err) {
        setError("Failed to load available slots");
      }
    };

    fetchBookedSlots();
  }, [serviceId, date]);

  const handleBooking = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await api.post("/bookings", {
        service: serviceId,
        date,
        timeSlot,
      });

      setSuccess("✅ Booking confirmed!");
      setTimeout(() => navigate("/services"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed");
    }
  };

  if (!serviceId) {
    return <p style={{ textAlign: "center" }}>No service selected</p>;
  }

  return (
    <div style={styles.container}>
      <h2>Book Service</h2>

      {error && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>{success}</p>}

      <form onSubmit={handleBooking}>
        <label>Date</label>
        <input
          type="date"
          value={date}
          required
          onChange={(e) => setDate(e.target.value)}
          style={styles.input}
        />

        <label>Time Slot</label>
        <select
          value={timeSlot}
          required
          onChange={(e) => setTimeSlot(e.target.value)}
          style={styles.input}
        >
          <option value="">Select time</option>

          {TIME_SLOTS.map((slot) => (
            <option
              key={slot}
              value={slot}
              disabled={bookedSlots.includes(slot)}
            >
              {slot} {bookedSlots.includes(slot) ? "(Booked)" : ""}
            </option>
          ))}
        </select>

        <button type="submit" style={styles.button}>
          Confirm Booking
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "40px auto",
  },
  input: {
    width: "100%",
    padding: "8px",
    marginBottom: "10px",
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#1976d2",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  error: {
    color: "red",
  },
  success: {
    color: "green",
  },
};

