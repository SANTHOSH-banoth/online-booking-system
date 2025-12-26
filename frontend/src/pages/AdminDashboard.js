import { useEffect, useState } from "react";
import api from "../api/api";

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all bookings (ADMIN)
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get("/bookings");
      setBookings(res.data);
      setError("");
    } catch (err) {
      setError("Failed to load bookings (Admin only)");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Approve / Reject booking
  const updateStatus = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      setBookings((prev) =>
        prev.map((b) =>
          b._id === id ? { ...b, status } : b
        )
      );
    } catch (err) {
      alert("Failed to update booking status");
    }
  };

  if (loading) return <p>Loading bookings...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Dashboard</h2>

      {bookings.length === 0 ? (
        <p>No bookings available</p>
      ) : (
        <table border="1" cellPadding="10" width="100%">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
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
                <td>{b.user?.name}</td>
                <td>{b.user?.email}</td>
                <td>{b.service?.name || b.service}</td>
                <td>{new Date(b.date).toLocaleDateString()}</td>
                <td>{b.timeSlot}</td>
                <td>
                  <b
                    style={{
                      color:
                        b.status === "approved"
                          ? "green"
                          : b.status === "rejected"
                          ? "red"
                          : "orange",
                    }}
                  >
                    {b.status}
                  </b>
                </td>
                <td>
                  {b.status === "pending" ? (
                    <>
                      <button
                        onClick={() =>
                          updateStatus(b._id, "approved")
                        }
                        style={{ marginRight: "6px" }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          updateStatus(b._id, "rejected")
                        }
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span>—</span>
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
 

