const jwt = require('jsonwebtoken');
const database = require('../database');

const getJwtSecret = () => process.env.JWT_SECRET || 'dev-only-change-me';

const buildSafeUser = (user) => ({
  id: user.id,
  username: user.username,
  displayName: user.display_name || user.displayName || user.username,
  role: user.role
});

const signToken = (user) => {
  const payload = {
    sub: String(user.id),
    role: user.role,
    username: user.username,
    displayName: user.display_name || user.displayName || user.username
  };
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '7d' });
};

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: missing token' });
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret());
    const userId = Number(decoded.sub);
    if (!Number.isFinite(userId)) {
      return res.status(401).json({ error: 'Unauthorized: invalid token subject' });
    }

    const dbUser = database.getUserById(userId);
    if (!dbUser || !dbUser.is_active) {
      return res.status(401).json({ error: 'Unauthorized: user not found or inactive' });
    }

    req.user = buildSafeUser(dbUser);
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized: invalid or expired token' });
  }
};

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Forbidden: insufficient role' });
  }

  next();
};

module.exports = {
  signToken,
  authenticate,
  requireRole,
  buildSafeUser,
  getJwtSecret
};
