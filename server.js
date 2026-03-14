require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/angel-kitchen')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err.message));

app.use('/api/auth',     require('./auth'));
app.use('/api/products', require('./products'));
app.use('/api/orders',   require('./orders'));
app.use('/api/reviews',  require('./reviews'));
app.use('/api/admin',    require('./admin'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', app: 'Angel Kitchen API' }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Server Error' });
});

app.listen(PORT, () => console.log(`🍽 Angel Kitchen API → http://localhost:${PORT}`));
module.exports = app;
