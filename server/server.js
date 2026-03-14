const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
const users = require('./users');
const products = require('./products');
const { authenticate, requireAdmin, JWT_SECRET } = require('./middleware');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// ════════════════════════════════════════════════════════════════════════════
// AUTH ROUTES
// ════════════════════════════════════════════════════════════════════════════

// POST /auth/register
app.post('/auth/register', async (req, res) => {
    try {
        const { name, email, password, role = 'customer' } = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ success: false, error: 'Name, email and password are required.' });
        if (!['admin', 'customer'].includes(role))
            return res.status(400).json({ success: false, error: 'Role must be admin or customer.' });

        const hash = await bcrypt.hash(password, 10);
        const user = await users.insert({ name, email: email.toLowerCase(), password: hash, role, created_at: new Date().toISOString() });

        const token = jwt.sign({ id: user._id, name: user.name, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        if (err.errorType === 'uniqueViolated')
            return res.status(409).json({ success: false, error: 'Email already registered.' });
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST /auth/login
app.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ success: false, error: 'Email and password are required.' });

        const user = await users.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(401).json({ success: false, error: 'Invalid credentials.' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ success: false, error: 'Invalid credentials.' });

        const token = jwt.sign({ id: user._id, name: user.name, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET /auth/me — verify token and return current user
app.get('/auth/me', authenticate, (req, res) => {
    res.json({ success: true, user: req.user });
});

// ════════════════════════════════════════════════════════════════════════════
// COUPON ROUTES
// ════════════════════════════════════════════════════════════════════════════

// GET all coupons — public (customers see active only; admin sees all)
app.get('/api/coupons', authenticate, async (req, res) => {
    try {
        const { search, type, active } = req.query;
        const query = {};

        // Customers can only see active coupons
        if (req.user.role === 'customer') {
            query.is_active = true;
        } else {
            if (active !== undefined && active !== 'all') query.is_active = active === 'true';
        }

        if (type && type !== 'all') query.discount_type = type;

        let coupons = await db.find(query).sort({ created_at: -1 });

        if (search) {
            const term = search.toLowerCase();
            coupons = coupons.filter(c =>
                c.code.toLowerCase().includes(term) || c.description.toLowerCase().includes(term)
            );
        }

        res.json({ success: true, data: coupons });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET single coupon — admin only
app.get('/api/coupons/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const coupon = await db.findOne({ _id: req.params.id });
        if (!coupon) return res.status(404).json({ success: false, error: 'Coupon not found' });
        res.json({ success: true, data: coupon });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST create coupon — admin only
app.post('/api/coupons', authenticate, requireAdmin, async (req, res) => {
    try {
        const {
            code, description, discount_type, discount_value,
            min_order_value = 0, valid_from, valid_until, usage_limit = 1, is_active = true
        } = req.body;

        if (!code || !description || !discount_type || discount_value == null || !valid_from || !valid_until)
            return res.status(400).json({ success: false, error: 'Missing required fields.' });
        if (!['percentage', 'fixed'].includes(discount_type))
            return res.status(400).json({ success: false, error: 'discount_type must be "percentage" or "fixed".' });
        if (discount_type === 'percentage' && (Number(discount_value) <= 0 || Number(discount_value) > 100))
            return res.status(400).json({ success: false, error: 'Percentage discount must be between 1 and 100.' });

        const newCoupon = await db.insert({
            code: code.toUpperCase(), description, discount_type,
            discount_value: Number(discount_value), min_order_value: Number(min_order_value),
            valid_from, valid_until, usage_limit: Number(usage_limit), usage_count: 0, is_active,
            created_at: new Date().toISOString(),
        });

        res.status(201).json({ success: true, data: newCoupon });
    } catch (err) {
        if (err.errorType === 'uniqueViolated')
            return res.status(409).json({ success: false, error: 'Coupon code already exists.' });
        res.status(500).json({ success: false, error: err.message });
    }
});

// PUT update coupon — admin only
app.put('/api/coupons/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const existing = await db.findOne({ _id: req.params.id });
        if (!existing) return res.status(404).json({ success: false, error: 'Coupon not found' });

        const updateData = { ...req.body };
        if (updateData.code) updateData.code = updateData.code.toUpperCase();
        if (updateData.discount_value != null) updateData.discount_value = Number(updateData.discount_value);
        if (updateData.min_order_value != null) updateData.min_order_value = Number(updateData.min_order_value);
        if (updateData.usage_limit != null) updateData.usage_limit = Number(updateData.usage_limit);
        delete updateData._id;

        await db.update({ _id: req.params.id }, { $set: updateData });
        const updated = await db.findOne({ _id: req.params.id });
        res.json({ success: true, data: updated });
    } catch (err) {
        if (err.errorType === 'uniqueViolated')
            return res.status(409).json({ success: false, error: 'Coupon code already exists.' });
        res.status(500).json({ success: false, error: err.message });
    }
});

// DELETE coupon — admin only
app.delete('/api/coupons/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const removed = await db.remove({ _id: req.params.id }, {});
        if (removed === 0) return res.status(404).json({ success: false, error: 'Coupon not found' });
        res.json({ success: true, message: 'Coupon deleted.' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST redeem — customer + admin (authenticated)
app.post('/api/coupons/:code/redeem', authenticate, async (req, res) => {
    try {
        const { order_value = 0 } = req.body;
        const coupon = await db.findOne({ code: req.params.code.toUpperCase() });

        if (!coupon) return res.status(404).json({ success: false, error: 'Coupon code not found.' });
        if (!coupon.is_active) return res.status(400).json({ success: false, error: 'This coupon is not active.' });

        const today = new Date().toISOString().split('T')[0];
        if (today < coupon.valid_from) return res.status(400).json({ success: false, error: `Coupon not valid yet. Available from ${coupon.valid_from}.` });
        if (today > coupon.valid_until) return res.status(400).json({ success: false, error: 'This coupon has expired.' });
        if (coupon.usage_count >= coupon.usage_limit) return res.status(400).json({ success: false, error: 'Coupon usage limit reached.' });
        if (Number(order_value) < coupon.min_order_value) return res.status(400).json({ success: false, error: `Minimum order value of ₹${coupon.min_order_value} required.` });

        const discount_amount = coupon.discount_type === 'percentage'
            ? (Number(order_value) * coupon.discount_value) / 100
            : coupon.discount_value;
        const final_amount = Math.max(0, Number(order_value) - discount_amount);

        await db.update({ _id: coupon._id }, { $inc: { usage_count: 1 } });

        res.json({
            success: true,
            message: `Coupon "${coupon.code}" applied successfully!`,
            data: {
                coupon_code: coupon.code, description: coupon.description,
                discount_type: coupon.discount_type, discount_value: coupon.discount_value,
                order_value: Number(order_value),
                discount_amount: parseFloat(discount_amount.toFixed(2)),
                final_amount: parseFloat(final_amount.toFixed(2)),
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET /api/products — list all products (authenticated)
app.get('/api/products', authenticate, async (req, res) => {
    try {
        const { search, category } = req.query;
        let all = await products.find({});
        if (category && category !== 'all') all = all.filter(p => p.category === category);
        if (search) { const t = search.toLowerCase(); all = all.filter(p => p.name.toLowerCase().includes(t) || p.category.toLowerCase().includes(t)); }
        res.json({ success: true, data: all });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.listen(PORT, () => console.log(`🚀 discokart API running at http://localhost:${PORT}`));
