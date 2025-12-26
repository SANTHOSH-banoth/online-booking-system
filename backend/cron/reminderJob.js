import cron from "node-cron";
import Booking from "../models/Booking.js";
import sendEmail from "../utils/sendEmail.js";

cron.schedule("*/5 * * * *", async () => {
  try {
    console.log("⏰ Checking for upcoming bookings...");

    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

    const bookings = await Booking.find({
      reminderSent: false,
    }).populate("user");

    for (let booking of bookings) {
      // 🔐 Safety checks
      if (!booking.user || !booking.user.email) continue;
      if (!booking.date || !booking.timeSlot) continue;

      const bookingTime = new Date(`${booking.date} ${booking.timeSlot}`);
      if (isNaN(bookingTime)) continue;

      if (bookingTime > now && bookingTime <= oneHourLater) {
        await sendEmail(
          booking.user.email,
          "Booking Reminder ⏰",
          `Reminder: You have a booking for ${booking.service} at ${booking.timeSlot}.`
        );

        booking.reminderSent = true;
        await booking.save();

        console.log(`📧 Reminder sent to ${booking.user.email}`);
      }
    }
  } catch (err) {
    // 🔥 PREVENT BACKEND CRASH
    console.error("CRON JOB ERROR:", err.message);
  }
});
