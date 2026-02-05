const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

// Login page
router.get('/login', (req, res) => {
  res.render('auth/login', { error: req.flash('error') });
});

// Register page
router.get('/register', (req, res) => {
  res.render('auth/register', { error: req.flash('error') });
});

// Register POST
router.post('/register', async (req, res) => {
  try {
    const { email, password, displayName } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      req.flash('error', 'Email already registered');
      return res.redirect('/auth/register');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      displayName,
      role: 'user' // Default role
    });

    await user.save();

    // Auto login after registration
    req.login(user, (err) => {
      if (err) {
        return res.redirect('/auth/login');
      }
      // Redirect based on role
      if (user.role === 'admin') {
        return res.redirect('/dash');
      } else {
        return res.redirect('/user/dashboard');
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    req.flash('error', 'Registration failed');
    res.redirect('/auth/register');
  }
});

// Login POST
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash('error', info.message || 'Invalid email or password');
      return res.redirect('/auth/login');
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      // Redirect based on role
      if (user.role === 'admin') {
        return res.redirect('/dash');
      } else {
        return res.redirect('/user/dashboard');
      }
    });
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

module.exports = router;
