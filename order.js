const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId:   { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
  name:        String,
  emoji:       String,
  price:       Number,
  qty:         Number
});

const orderSchema = new mongoose.Schema({
  orderId:     { type: String, unique: true },
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  items:       [orderItemSchema],
  customer: {
    name:    { type: String, required: true },
    phone:   { type: String, required: true },
    address: { type: String, required: true },
    notes:   String
  },
  subtotal:    { type: Number, required: true },
  deliveryFee: { type: Number, default: 500 },
  total:       { type: Number, required: true },
  payment:     { type: String, enum: ['Paystack','Flutterwave','Cash on Delivery'], required: true },
  paymentStatus: { type: String, enum: ['pending','paid','failed'], default: 'pending' },
  status: {
    type: String,
    enum: ['received','preparing','delivery','delivered','cancelled'],
    default: 'received'
  },
  statusHistory: [{
    status:    String,
    timestamp: { type: Date, default: Date.now },
    note:      String
  }],
  createdAt:   { type: Date, default: Date.now }
});

orderSchema.pre('save', function(next) {
  if (!this.orderId) this.orderId = 'AK' + Date.now() + Math.floor(Math.random() * 1000);
  next();
});

module.exports = mongoose.model('order', orderSchema);
