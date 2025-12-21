import mongoose from "mongoose";

// Mongoose schema for bookings
const bookingSchema = new mongoose.Schema({
  reminderSent: {
  type: Boolean,
  default: false,
},

  service: { type: String, required: true },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  notes: { type: String },
}, { timestamps: true });


const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
