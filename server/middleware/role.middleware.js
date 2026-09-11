/**
 * Role-based authorization middleware.
 *
 * Usage:
 *   router.post('/', authMiddleware, requireRole(['commander']), handler)
 *   router.put('/:id', authMiddleware, requireRole(['commander', 'logistics_officer']), handler)
 *
 * Must be used AFTER authMiddleware so that req.user is already populated.
 */
const requireRole = (roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized: No authenticated user.' });
  }
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      error: `Forbidden: This action requires one of these roles: ${roles.join(', ')}. Your role: ${req.user.role}.`
    });
  }
  next();
};

module.exports = { requireRole };
