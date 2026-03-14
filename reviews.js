const router = require('express').Router();
const Review = require('../review');
const Product = require('../product');
const { protect } = require('../auths');

// GET reviews for a product
router.get('/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).sort({ createdAt: -1 });
    res.json({ success: true, count: reviews.length, reviews });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// POST create review
router.post('/', protect, async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const existing = await Review.findOne({ product: productId, user: req.user._id });
    if (existing) return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
    const review = await Review.create({ product: productId, user: req.user._id, userName: req.user.name, rating, comment });
    // Update product avg rating
    const reviews = await Review.find({ product: productId });
    const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    await Product.findByIdAndUpdate(productId, { rating: Math.round(avg * 10) / 10, reviewCount: reviews.length });
    res.status(201).json({ success: true, review });
  } catch (e) { res.status(400).json({ success: false, message: e.message }); }
});

module.exports = router;
