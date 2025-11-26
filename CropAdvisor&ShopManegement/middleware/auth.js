// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) return next();
//   res.redirect('/');
// }

// function ensureAdmin(req, res, next) {
//   if (req.isAuthenticated() && req.user.role === 'admin') return next();
//   res.status(403).send('Access Denied: Admins only');
// }

// module.exports = { ensureAuthenticated, ensureAdmin };




function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}

function ensureAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.role === 'admin') return next();
  res.status(403).render('error', { 
    message: 'Access Denied: Admins only',
    user: req.user 
  });
}

function ensureUser(req, res, next) {
  if (req.isAuthenticated() && req.user.role === 'user') return next();
  res.status(403).render('error', { 
    message: 'Access Denied: Users only',
    user: req.user 
  });
}

module.exports = { ensureAuthenticated, ensureAdmin, ensureUser };