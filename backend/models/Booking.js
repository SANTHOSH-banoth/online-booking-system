import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    service: {
      type: String,
      required: true,
    },

    date: {
      type: String, // YYYY-MM-DD
      required: true,
    },

    timeSlot: {
      type: String, // "10:00 - 11:00"
      required: true,
    },

    notes: {
      type: String,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "cancelled"],
      default: "pending",
    },

    reminderSent: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// 🔥 Prevent double booking per time slot
bookingSchema.index(
  { date: 1, timeSlot: 1 },
  { unique: true }
);

export default mongoose.model("Booking", bookingSchema);

