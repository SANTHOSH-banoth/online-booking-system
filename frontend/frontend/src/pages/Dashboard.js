import { useEffect, useState } from "react";
import API from "../api/api";

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await API.get("/bookings/my");
        setBookings(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h2>👋 Welcome to Your Dashboard</h2>

      <div style={{ marginTop: "20px" }}>
        <h3>📅 Upcoming Bookings</h3>

        {bookings.length === 0 ? (
          <p>No bookings yet.</p>
        ) : (
          <ul>
            {bookings.map((b) => (
              <li key={b._id}>
                <strong>{b.service}</strong> — {b.date} at {b.timeSlot}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
