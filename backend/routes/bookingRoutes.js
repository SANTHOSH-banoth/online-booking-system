import express from "express";
import Booking from "../models/Booking.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";
import { sendEmail } from "../utils/sendEmail.js";


const router = express.Router();

/**
 * ================================
 * CREATE BOOKING (USER)
 * ================================
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { service, date, timeSlot, notes } = req.body;

    if (!service || !date || !timeSlot) {
      return res.status(400).json({
        message: "Service, date and time slot are required",
      });
    }

    // Normalize date (remove time part)
    const bookingDate = new Date(date);
    bookingDate.setHours(0, 0, 0, 0);

    // Check for conflict
    const existingBooking = await Booking.findOne({
      service,
      date: bookingDate,
      timeSlot,
    });

    if (existingBooking) {
      return res.status(409).json({
        message: "This time slot is already booked for the selected service",
      });
    }

    // Create booking
    const booking = await Booking.create({
      user: req.user.id,
      service,
      date: bookingDate,
      timeSlot,
      notes,
      status: "pending", // default status
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    // Handle MongoDB duplicate key error (unique index fallback)
    if (error.code === 11000) {
      return res.status(409).json({
        message: "This time slot is already booked",
      });
    }

    res.status(500).json({ message: error.message });
  }
});

/**
 * ================================
 * GET LOGGED-IN USER BOOKINGS
 * ================================
 */
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("service", "name price")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * ================================
 * GET ALL BOOKINGS (ADMIN)
 * ================================
 */
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("service", "name price")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * ================================
 * UPDATE BOOKING STATUS (ADMIN)
 * ================================
 */
router.put("/:id/status", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved", "rejected", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate("user", "name email")
      .populate("service", "name price");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({
      message: "Booking status updated successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

