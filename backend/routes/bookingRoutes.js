import express from "express";
import Booking from "../models/Booking.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";
import sendEmail from "../utils/sendEmail.js";

const router = express.Router();

/**
 * ================================
 * CREATE BOOKING (USER)
 * POST /api/bookings
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

    const bookingDate = new Date(date);
    bookingDate.setHours(0, 0, 0, 0);

    const existingBooking = await Booking.findOne({
      service,
      date: bookingDate,
      timeSlot,
      status: { $ne: "cancelled" },
    });

    if (existingBooking) {
      return res.status(409).json({
        message: "This time slot is already booked",
      });
    }

    const booking = await Booking.create({
      user: req.user.id,
      service,
      date: bookingDate,
      timeSlot,
      notes,
      status: "pending",
    });

    // 📧 EMAIL: Booking Created
    await sendEmail(
      req.user.email,
      "Booking Request Submitted",
      `
        <h3>Booking Submitted</h3>
        <p>Your booking request has been received.</p>
        <p><b>Date:</b> ${bookingDate.toDateString()}</p>
        <p><b>Time:</b> ${timeSlot}</p>
        <p>Status: Pending approval</p>
      `
    );

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * ================================
 * GET AVAILABLE SLOTS
 * ================================
 */
router.get("/available-slots", authMiddleware, async (req, res) => {
  try {
    const { date } = req.query;

    const bookingDate = new Date(date);
    bookingDate.setHours(0, 0, 0, 0);

    const ALL_SLOTS = [
      "09:00-10:00",
      "10:00-11:00",
      "11:00-12:00",
      "14:00-15:00",
      "15:00-16:00",
    ];

    const bookings = await Booking.find({
      date: bookingDate,
      status: { $ne: "cancelled" },
    });

    const bookedSlots = bookings.map(b => b.timeSlot);
    const availableSlots = ALL_SLOTS.filter(
      slot => !bookedSlots.includes(slot)
    );

    res.json(availableSlots);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch slots" });
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
      .sort({ date: 1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * ================================
 * RESCHEDULE BOOKING (USER)
 * ================================
 */
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { date, timeSlot } = req.body;

    const bookingDate = new Date(date);
    bookingDate.setHours(0, 0, 0, 0);

    const conflict = await Booking.findOne({
      _id: { $ne: req.params.id },
      date: bookingDate,
      timeSlot,
      status: { $ne: "cancelled" },
    });

    if (conflict) {
      return res.status(409).json({
        message: "Selected time slot is already booked",
      });
    }

    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { date: bookingDate, timeSlot },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // 📧 EMAIL: Rescheduled
    await sendEmail(
      req.user.email,
      "Booking Rescheduled",
      `
        <h3>Booking Rescheduled</h3>
        <p><b>New Date:</b> ${bookingDate.toDateString()}</p>
        <p><b>New Time:</b> ${timeSlot}</p>
      `
    );

    res.json({ message: "Booking rescheduled successfully", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * ================================
 * CANCEL BOOKING (USER)
 * ================================
 */
router.put("/:id/cancel", authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { status: "cancelled" },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // 📧 EMAIL: Cancelled
    await sendEmail(
      req.user.email,
      "Booking Cancelled",
      `
        <h3>Booking Cancelled</h3>
        <p>Your booking has been cancelled successfully.</p>
      `
    );

    res.json({ message: "Booking cancelled", booking });
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

    // 📧 EMAIL: Admin decision
    await sendEmail(
      booking.user.email,
      `Booking ${status}`,
      `
        <h3>Booking ${status.toUpperCase()}</h3>
        <p><b>Date:</b> ${booking.date.toDateString()}</p>
        <p><b>Time:</b> ${booking.timeSlot}</p>
      `
    );

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
