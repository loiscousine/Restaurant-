const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: { type: String, required: true },
  price:       { type: Number, required: true, min: 0 },
  category:    { type: String, required: true, enum: ['burgers','cakes','snacks','pastries','nigerian','drinks','sandwich'] },
  emoji:       { type: String, default: '🍽' },
  image:       { type: String },
  badge:       { type: String },
  available:   { type: Boolean, default: true },
  rating:      { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  featured:    { type: Boolean, default: false },
  createdAt:   { type: Date, default: Date.now }
});

productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('product', productSchema);
