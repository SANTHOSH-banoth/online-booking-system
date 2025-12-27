import { useEffect, useState } from "react";
import api from "../api/api";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [newSlot, setNewSlot] = useState("");

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get("/bookings/my");
      setBookings(res.data);
      setError("");
    } catch {
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  useEffect(() => {
    if (!newDate) return;

    const fetchSlots = async () => {
      try {
        const res = await api.get(
          `/bookings/available-slots?date=${newDate}`
        );
        setSlots(res.data);
        setNewSlot("");
      } catch {
        setSlots([]);
      }
    };

    fetchSlots();
  }, [newDate]);

  const cancelBooking = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;

    try {
      await api.put(`/bookings/${id}/cancel`);
      setBookings((prev) =>
        prev.map((b) =>
          b._id === id ? { ...b, status: "cancelled" } : b
        )
      );
    } catch {
      alert("Failed to cancel booking");
    }
  };

  const saveReschedule = async (id) => {
    if (!newDate || !newSlot) return;

    try {
      await api.put(`/bookings/${id}`, {
        date: newDate,
        timeSlot: newSlot,
      });

      setEditingId(null);
      setNewDate("");
      setNewSlot("");
      setSlots([]);
      fetchMyBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Reschedule failed");
    }
  };

  if (loading) return <p>Loading your bookings...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="container">
      <h2>My Bookings</h2>

      {bookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        <div className="card">
          <table width="100%" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f3f5f9" }}>
                <th>Service</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td>{b.service?.name || b.service}</td>
                  <td>{new Date(b.date).toLocaleDateString()}</td>
                  <td>{b.timeSlot}</td>
                  <td>
                    <span
                      style={{
                        color:
                          b.status === "approved"
                            ? "green"
                            : b.status === "pending"
                            ? "orange"
                            : "red",
                        fontWeight: "600",
                      }}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td>
                    {b.status !== "cancelled" && (
                      <>
                        <button
                          onClick={() => {
                            setEditingId(b._id);
                            setNewDate("");
                            setSlots([]);
                          }}
                          style={{ marginRight: "6px" }}
                        >
                          Reschedule
                        </button>
                        <button onClick={() => cancelBooking(b._id)}>
                          Cancel
                        </button>
                      </>
                    )}
                    {b.status === "cancelled" && <span>Cancelled</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingId && (
        <div className="card" style={{ marginTop: "20px" }}>
          <h3>Reschedule Booking</h3>

          <label>New Date</label>
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
          />

          <label>New Time Slot</label>
          <select
            value={newSlot}
            onChange={(e) => setNewSlot(e.target.value)}
            disabled={!slots.length}
          >
            <option value="">Select time slot</option>
            {slots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>

          <button onClick={() => saveReschedule(editingId)}>
            Save Changes
          </button>
          <button
            onClick={() => {
              setEditingId(null);
              setNewDate("");
              setNewSlot("");
              setSlots([]);
            }}
            style={{ marginLeft: "10px" }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}


