import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    service: {
      type: String,
      required: true,
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true,
    },
    timeSlot: {
      type: String, // e.g. "10:00 - 11:00"
      required: true,
    },
    notes: {
      type: String,
    },
    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);

// 🔥 prevent double booking
bookingSchema.index({ date: 1, timeSlot: 1 }, { unique: true });

export default mongoose.model("Booking", bookingSchema);
