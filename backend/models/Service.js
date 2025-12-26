import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
    },

    duration: {
      type: Number, // in minutes
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Service", serviceSchema);

