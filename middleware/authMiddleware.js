const jwt = require('jsonwebtoken');

const AUTH_HEADER = process.env.AUTH_HEADER || 'authorization';

// Basic authentication middleware
const requireAuth = (req, res, next) => {
    const authHeader = req.headers[AUTH_HEADER.toLowerCase()];
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Malformed token' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// Role-based middleware
const requireRole = (...roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Forbidden: Insufficient role' });
    }
    next();
};

module.exports = { requireAuth, requireRole };