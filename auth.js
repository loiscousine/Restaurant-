const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../user');

const sign = id => jwt.sign({ id }, process.env.JWT_SECRET || 'angel-kitchen-secret', { expiresIn: '30d' });

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, country, phone } = req.body;
    if (await User.findOne({ email })) return res.status(400).json({ success: false, message: 'Email already registered' });
    const currencyMap = { Nigeria:'₦', USA:'$', UK:'£', Canada:'CA$', Ghana:'₵' };
    const user = await User.create({ name, email, password, country, phone, currency: currencyMap[country] || '₦' });
    res.status(201).json({ success: true, token: sign(user._id), user: user.toPublic() });
  } catch (e) { res.status(400).json({ success: false, message: e.message }); }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    res.json({ success: true, token: sign(user._id), user: user.toPublic() });
  } catch (e) { res.status(400).json({ success: false, message: e.message }); }
});

// GET /api/auth/me
router.get('/me', require('../auths').protect, (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;
