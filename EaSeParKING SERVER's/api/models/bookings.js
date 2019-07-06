const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema({
  booking_id: {
    type: Number,
    required: true
  },
  start_time: {
    type: String,
    default: '00:00:00'
  },
  start_date: {
    type: String,
    default: '0000-00-00'
  },
  end_time: {
    type: String,
    default: '00:00:00'
  },
  end_date: {
    type: String,
    default: '0000-00-00'
  },
  charge: {
    type: Number,
    required: true
  },
  book_status: {
    type: Boolean,
    default: true
  },
  vehicleNo: {
    type: String,
    required: true
  },
  _pid: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Parking'
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
