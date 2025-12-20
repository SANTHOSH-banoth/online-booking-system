import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    date: String,
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);

