const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true },
  password:  { type: String, required: true, minlength: 6 },
  phone:     { type: String },
  country:   { type: String, default: 'Nigeria' },
  currency:  { type: String, default: '₦' },
  addresses: [{ label: String, address: String, isDefault: Boolean }],
  role:      { type: String, enum: ['customer', 'admin'], default: 'customer' },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
userSchema.methods.comparePassword = function(p) { return bcrypt.compare(p, this.password); };
userSchema.methods.toPublic = function() {
  const o = this.toObject(); delete o.password; return o;
};

module.exports = mongoose.model('User', userSchema);
