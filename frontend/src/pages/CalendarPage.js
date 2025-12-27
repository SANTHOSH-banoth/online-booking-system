import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import API from "../api/api";

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await API.get("/bookings");

      const formattedEvents = res.data.map((booking) => ({
        id: booking._id,
        title: booking.service,
        date: booking.date,
        extendedProps: booking, // 🔥 full booking object
      }));

      setEvents(formattedEvents);
    } catch (err) {
      console.error("Error fetching bookings", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Booking Calendar</h2>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={(info) => setSelectedBooking(info.event.extendedProps)}
        height="auto"
      />

      {/* MODAL */}
      {selectedBooking && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h3>Booking Details</h3>

            <p><b>Service:</b> {selectedBooking.service}</p>
            <p><b>Date:</b> {selectedBooking.date}</p>
            <p><b>Time:</b> {selectedBooking.timeSlot}</p>
            <p><b>User:</b> {selectedBooking.user?.email}</p>
            <p><b>Notes:</b> {selectedBooking.notes || "—"}</p>

            <button onClick={() => setSelectedBooking(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* Simple modal styles */
const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalContent = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "8px",
  width: "300px",
};
