import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchMyBookings = async () => {
    try {
      const res = await api.get("/bookings/my");
      setBookings(res.data);
    } catch (err) {
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const cancelBooking = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;

    try {
      await api.put(`/bookings/${id}/status`, { status: "cancelled" });
      fetchMyBookings();
    } catch (err) {
      alert("Failed to cancel booking");
    }
  };

  if (loading) return <p>Loading your bookings...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Bookings</h2>

      {bookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        <table border="1" cellPadding="10" width="100%">
          <thead>
            <tr>
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
                <td>{b.service?.name}</td>
                <td>{new Date(b.date).toLocaleDateString()}</td>
                <td>{b.timeSlot}</td>
                <td>{b.status}</td>

                <td>
                  {b.status !== "cancelled" && (
                    <>
                      <button
                        onClick={() =>
                          navigate("/reschedule", {
                            state: { booking: b },
                          })
                        }
                        style={{ marginRight: "5px" }}
                      >
                        Reschedule
                      </button>

                      <button onClick={() => cancelBooking(b._id)}>
                        Cancel
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
