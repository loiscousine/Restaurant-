const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  product:   { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  userName:  String,
  rating:    { type: Number, required: true, min: 1, max: 5 },
  comment:   { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

reviewSchema.index({ product: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('review', reviewSchema);
