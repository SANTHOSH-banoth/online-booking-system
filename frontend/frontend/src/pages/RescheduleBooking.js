import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
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

export default function RescheduleBooking() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const booking = state?.booking;

  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!booking) return;
    setDate(booking.date.split("T")[0]);
    setTimeSlot(booking.timeSlot);
  }, [booking]);

  useEffect(() => {
    if (!booking || !date) return;

    const fetchSlots = async () => {
      try {
        const res = await api.get(
          `/bookings/slots?serviceId=${booking.service._id}&date=${date}`
        );
        setBookedSlots(res.data);
      } catch (err) {
        setError("Failed to load slots");
      }
    };

    fetchSlots();
  }, [booking, date]);

  const handleReschedule = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.put(`/bookings/${booking._id}/reschedule`, {
        date,
        timeSlot,
      });
      navigate("/my-bookings");
    } catch (err) {
      setError(err.response?.data?.message || "Reschedule failed");
    }
  };

  if (!booking) return <p>No booking selected</p>;

  return (
    <div style={{ maxWidth: "400px", margin: "40px auto" }}>
      <h2>Reschedule Booking</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleReschedule}>
        <label>Date</label>
        <input
          type="date"
          value={date}
          required
          onChange={(e) => setDate(e.target.value)}
        />

        <label>Time</label>
        <select
          value={timeSlot}
          required
          onChange={(e) => setTimeSlot(e.target.value)}
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

        <button type="submit">Confirm Reschedule</button>
      </form>
    </div>
  );
}

