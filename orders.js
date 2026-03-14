const router = require('express').Router();
const Order = require('../order');
const { protect, adminOnly } = require('../auths');

// POST create order
router.post('/', async (req, res) => {
  try {
    const { items, customer, payment, subtotal, deliveryFee, total, userId } = req.body;
    const order = await Order.create({
      items, customer, payment, subtotal,
      deliveryFee: deliveryFee || 500,
      total,
      user: userId || null,
      statusHistory: [{ status: 'received', note: 'Order placed successfully' }]
    });
    res.status(201).json({ success: true, order, orderId: order.orderId });
  } catch (e) { res.status(400).json({ success: false, message: e.message }); }
});

// GET track order by orderId
router.get('/track/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order: { orderId: order.orderId, status: order.status, statusHistory: order.statusHistory, total: order.total, createdAt: order.createdAt, items: order.items } });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// GET my orders (authenticated)
router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// GET all orders (admin)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, count: orders.length, orders });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// PATCH update order status (admin)
router.patch('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id,
      { status, $push: { statusHistory: { status, note, timestamp: new Date() } } },
      { new: true }
    );
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (e) { res.status(400).json({ success: false, message: e.message }); }
});

module.exports = router;
