const mongoose = require('mongoose');

const showSchema = new mongoose.Schema(
  {
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    screen: { type: String, default: 'Screen 1' },
    startTime: { type: Date, required: true },
    price: { type: Number, default: 200 },
    rows: { type: Number, default: 6 },
    cols: { type: Number, default: 10 },
    bookedSeats: { type: [String], default: [] }, // e.g. "A1", "C7"
  },
  { timestamps: true }
);

module.exports = mongoose.model('Show', showSchema);
