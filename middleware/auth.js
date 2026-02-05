function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/auth/login');
}

function ensureAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.role === 'admin') return next();
  res.status(403).send('Access Denied: Admins only');
}

function ensureUser(req, res, next) {
  if (req.isAuthenticated() && req.user.role === 'user') return next();
  res.status(403).send('Access Denied: Users only');
}

module.exports = { ensureAuthenticated, ensureAdmin, ensureUser };
