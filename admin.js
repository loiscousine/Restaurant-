const router = require('express').Router();
const Order = require('../order');
const Product = require('../product');
const User = require('../user');
const { protect, adminOnly } = require('../auths');

router.use(protect, adminOnly);

// GET dashboard analytics
router.get('/analytics', async (req, res) => {
  try {
    const [totalOrders, products, customers, orders] = await Promise.all([
      Order.countDocuments(),
      Product.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      Order.find().select('total status items createdAt')
    ]);
    const revenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + (o.total || 0), 0);
    const statusCounts = orders.reduce((acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc; }, {});
    // Popular meals
    const mealCounts = {};
    orders.forEach(o => o.items?.forEach(i => { mealCounts[i.name] = (mealCounts[i.name] || 0) + (i.qty || 1); }));
    const popularMeals = Object.entries(mealCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, count]) => ({ name, count }));
    res.json({ success: true, analytics: { totalOrders, products, customers, revenue, statusCounts, popularMeals } });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
