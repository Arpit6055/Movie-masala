
const mongoose = require('mongoose')
const Schema = mongoose.Schema


const Comment = mongoose.model('Comment', {
  title: String,
  content: String,
  reviewId: { type: Schema.Types.ObjectId, ref: 'Review', required: true },
  date: { type: Date, default: Date.now }
});


module.exports = Comment
