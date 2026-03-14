const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'couponvault_secret_2026';

function authenticate(req, res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, error: 'Authentication required.' });
    }
    const token = header.slice(7);
    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch {
        return res.status(401).json({ success: false, error: 'Invalid or expired token.' });
    }
}

function requireAdmin(req, res, next) {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ success: false, error: 'Admin access only.' });
    }
    next();
}

module.exports = { authenticate, requireAdmin, JWT_SECRET };
