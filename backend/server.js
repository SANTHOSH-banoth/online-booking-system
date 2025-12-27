import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import "./cron/reminderJob.js"; // cron job for email reminders

import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";

dotenv.config();

const app = express();

/* =======================
   CORS CONFIG (FINAL FIX)
   ======================= */
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, Render health checks)
      if (!origin) return callback(null, true);

      // Allow localhost
      if (origin === "http://localhost:3000") {
        return callback(null, true);
      }

      // Allow ALL Vercel deployments
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      // Otherwise block
      return callback(new Error("CORS not allowed"), false);
    },
    credentials: true,
  })
);

/* =======================
   MIDDLEWARE
   ======================= */
app.use(express.json());

/* =======================
   ROUTES
   ======================= */
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/services", serviceRoutes);

/* =======================
   HEALTH CHECK
   ======================= */
app.get("/", (req, res) => {
  res.send("API is running ✅");
});

/* =======================
   ERROR HANDLER
   ======================= */
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message || err);
  res.status(500).json({ message: err.message || "Something went wrong!" });
});

/* =======================
   SERVER + DB
   ======================= */
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
    process.exit(1);
  });
