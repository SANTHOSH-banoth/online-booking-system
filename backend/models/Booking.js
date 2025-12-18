const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  userId: String,
  serviceId: String,
  date: String,
  time: String,
  status: { type: String, default: 'Confirmed' }
});

module.exports = mongoose.model('Booking', BookingSchema);
