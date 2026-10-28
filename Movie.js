const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    genre: { type: String, default: '' },
    language: { type: String, default: 'English' },
    durationMins: { type: Number, default: 120 },
    rating: { type: Number, default: 0 },
    posterColor: { type: String, default: '#1d3557' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Movie', movieSchema);
