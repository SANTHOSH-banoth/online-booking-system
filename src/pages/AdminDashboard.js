import { useEffect, useState } from "react";
import api from "../api/api";

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get("/bookings");
      setBookings(res.data);
      setError("");
    } catch (err) {
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id, status) => {
    const confirmMsg =
      status === "approved"
        ? "Approve this booking?"
        : status === "rejected"
        ? "Reject this booking?"
        : "Cancel this booking?";

    if (!window.confirm(confirmMsg)) return;

    try {
      await api.put(`/bookings/${id}/status`, { status });
      fetchBookings(); // refresh list
    } catch (err) {
      alert("Failed to update booking status");
    }
  };

  if (loading) return <h3 style={styles.center}>Loading bookings...</h3>;
  if (error) return <h3 style={{ ...styles.center, color: "red" }}>{error}</h3>;

  return (
    <div style={styles.container}>
      <h2>Admin Dashboard</h2>

      {bookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        <table style={styles.table}>
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
                <td>{b.user?.name || "-"}</td>
                <td>{b.user?.email || "-"}</td>
                <td>{b.service?.name || "-"}</td>
                <td>{new Date(b.date).toLocaleDateString()}</td>
                <td>{b.timeSlot}</td>

                <td style={styles.status(b.status)}>
                  {b.status.toUpperCase()}
                </td>

                <td>
                  {b.status === "pending" && (
                    <>
                      <button
                        onClick={() => updateStatus(b._id, "approved")}
                        style={styles.approve}
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => updateStatus(b._id, "rejected")}
                        style={styles.reject}
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {b.status === "approved" && (
                    <button
                      onClick={() => updateStatus(b._id, "cancelled")}
                      style={styles.cancel}
                    >
                      Cancel
                    </button>
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

const styles = {
  container: {
    padding: "20px",
  },
  center: {
    textAlign: "center",
    marginTop: "40px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  approve: {
    background: "#4caf50",
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    marginRight: "5px",
    cursor: "pointer",
  },
  reject: {
    background: "#e53935",
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    marginRight: "5px",
    cursor: "pointer",
  },
  cancel: {
    background: "#ff9800",
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
  },
  status: (status) => ({
    fontWeight: "bold",
    color:
      status === "approved"
        ? "green"
        : status === "rejected"
        ? "red"
        : status === "cancelled"
        ? "orange"
        : "#555",
  }),
};



