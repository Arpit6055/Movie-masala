const mongoose = require('mongoose');

const Review = mongoose.model('Review', {
  title: String,
  userId : { type: String, required: true },
  description: String,
  rating: Number,
  movieTitle: String,
  movieId: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = Review;