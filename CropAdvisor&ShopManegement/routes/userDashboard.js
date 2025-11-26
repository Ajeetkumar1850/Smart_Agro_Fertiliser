const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureUser } = require('../middleware/auth');

// User dashboard home
router.get('/dashboard', ensureAuthenticated, ensureUser, async (req, res) => {
  try {
    res.render('user/dashboard', {
      user: req.user,
      title: 'User Dashboard'
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// User profile page
router.get('/profile', ensureAuthenticated, ensureUser, (req, res) => {
  res.render('user/profile', {
    user: req.user,
    title: 'My Profile'
  });
});

// User settings page
router.get('/settings', ensureAuthenticated, ensureUser, (req, res) => {
  res.render('user/settings', {
    user: req.user,
    title: 'Settings'
  });
});

module.exports = router;