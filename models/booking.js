const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    movieId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    time: {
      type: String,
      default: ""
    },
    seats: {
      type: [String],
      default: []
    },
    total: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);