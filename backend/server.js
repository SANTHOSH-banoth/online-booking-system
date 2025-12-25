import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import "./cron/reminderJob.js";
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

dotenv.config();

const app = express();

// ===== Middleware =====
app.use(cors());          // Allow requests from frontend
app.use(express.json());  // Parse JSON request bodies

// ===== Routes =====
app.use("/api/bookings", bookingRoutes);
app.use("/api/auth", authRoutes);


// ===== Health check route =====
app.get("/", (req, res) => {
  res.send("API is running");
});

// ===== Start server =====
const PORT = process.env.PORT || 5000;


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit process if DB connection fails
  });




