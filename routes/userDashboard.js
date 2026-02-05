const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const Product = require('../models/Product');

// User dashboard home (any authenticated customer)
router.get('/dashboard', ensureAuthenticated, async (req, res) => {
  try {
    const products = await Product.find({}).limit(10);
    res.render('user/dashboard', {
      user: req.user,
      products: products,
      title: 'User Dashboard'
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// User products page - view all products (any authenticated customer)
router.get('/products', ensureAuthenticated, async (req, res) => {
  try {
    const products = await Product.find({});
    res.render('user/products', {
      user: req.user,
      products: products,
      title: 'Browse Products'
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// User profile page (any authenticated customer)
router.get('/profile', ensureAuthenticated, (req, res) => {
  res.render('user/profile', {
    user: req.user,
    title: 'My Profile'
  });
});

module.exports = router;
