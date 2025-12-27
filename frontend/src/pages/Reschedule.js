import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Reschedule() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const booking = state?.booking;

  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (booking) {
      const d = new Date(booking.date).toISOString().split("T")[0];
      setDate(d);
      setTimeSlot(booking.timeSlot);
      fetchSlots(d);
    }
  }, [booking]);

  const fetchSlots = async (selectedDate) => {
    try {
      const res = await api.get(
        `/bookings/available-slots?date=${selectedDate}`
      );
      setAvailableSlots(res.data);
    } catch {
      setError("Failed to load time slots");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/bookings/${booking._id}`, { date, timeSlot });
      alert("Booking rescheduled successfully");
      navigate("/mybookings");
    } catch {
      alert("Failed to reschedule booking");
    }
  };

  if (!booking) return <p>No booking selected</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Reschedule Booking</h2>

      <form onSubmit={handleSubmit}>
        <label>
          Date:
          <input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              fetchSlots(e.target.value);
            }}
            required
          />
        </label>

        <br /><br />

        <label>
          Time Slot:
          <select
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            required
          >
            <option value="">Select</option>
            {availableSlots.map(slot => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </label>

        <br /><br />

        <button type="submit">Reschedule</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
