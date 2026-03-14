const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const Product = require('../product');
const { protect, adminOnly } = require('../auths');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// GET all products
router.get('/', async (req, res) => {
  try {
    const { cat, search, featured } = req.query;
    let query = { available: true };
    if (cat) query.category = cat;
    if (featured) query.featured = true;
    if (search) query.$text = { $search: search };
    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: products.length, products });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product: p });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// POST create product (admin)
router.post('/', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = '/uploads/' + req.file.filename;
    const product = await Product.create(data);
    res.status(201).json({ success: true, product });
  } catch (e) { res.status(400).json({ success: false, message: e.message }); }
});

// PUT update product (admin)
router.put('/:id', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = '/uploads/' + req.file.filename;
    const product = await Product.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (e) { res.status(400).json({ success: false, message: e.message }); }
});

// DELETE product (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product deleted' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
