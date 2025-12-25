import { useEffect, useState } from "react";
import API from "../api/api";

const SERVICES = ["Consultation", "Repair", "Maintenance"];

export default function Booking() {
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [timeSlot, setTimeSlot] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!date) return;

    const fetchSlots = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await API.get(
          `/bookings/available-slots?date=${date}`
        );
        setSlots(res.data);
        setTimeSlot("");
      } catch {
        setError("Failed to fetch available slots");
        setSlots([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!service || !date || !timeSlot) {
      return setError("All fields are required");
    }

    try {
      await API.post("/bookings", {
        service,
        date,
        timeSlot,
      });

      setMessage("✅ Booking request submitted");
      setService("");
      setDate("");
      setTimeSlot("");
      setSlots([]);
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: "500px", margin: "auto" }}>
        <h2 style={{ textAlign: "center" }}>Book Appointment</h2>

        <form onSubmit={handleSubmit}>
          {/* Service */}
          <label>Service</label>
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
          >
            <option value="">Select service</option>
            {SERVICES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* Date */}
          <label>Date</label>
          <input
            type="date"
            value={date}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setDate(e.target.value)}
          />

          {/* Time Slot */}
          <label>Time Slot</label>
          {loading ? (
            <p>Loading slots...</p>
          ) : (
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              disabled={!slots.length}
            >
              <option value="">Select time slot</option>
              {slots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          )}

          <button
            type="submit"
            style={{ width: "100%", marginTop: "10px" }}
          >
            Book Now
          </button>
        </form>

        {message && (
          <p style={{ color: "green", marginTop: "10px" }}>
            {message}
          </p>
        )}
        {error && (
          <p style={{ color: "red", marginTop: "10px" }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
