import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home">
      {/* HERO */}
      <section className="hero">
        <h1>Online Booking System</h1>
        <p>Manage appointments, services, and schedules effortlessly.</p>

        <div className="hero-buttons">
          <Link to="/login" className="btn primary">Login</Link>
          <Link to="/register" className="btn secondary">Get Started</Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <div className="feature-card">
          <h3>📅 Smart Scheduling</h3>
          <p>Book, reschedule, and manage appointments easily.</p>
        </div>

        <div className="feature-card">
          <h3>⏰ Calendar View</h3>
          <p>Visual calendar for quick planning.</p>
        </div>

        <div className="feature-card">
          <h3>📧 Email Reminders</h3>
          <p>Automatic booking confirmations & reminders.</p>
        </div>

        <div className="feature-card">
          <h3>🛠 Admin Dashboard</h3>
          <p>Manage services, users, and bookings.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;

