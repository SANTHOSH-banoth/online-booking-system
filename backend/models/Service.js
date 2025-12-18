const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  name: String,
  price: Number,
  duration: Number
});

module.exports = mongoose.model('Service', ServiceSchema);
