const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { ensureAuthenticated, ensureUser, ensureAdmin } = require('../middleware/auth');

// Get all approved reviews (public)
router.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ isApproved: true })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching reviews' });
  }
});

// User submit review
router.post('/submit', ensureAuthenticated, ensureUser, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    // Check if user already submitted a review
    const existingReview = await Review.findOne({ user: req.user._id });
    if (existingReview) {
      req.flash('error', 'You have already submitted a review');
      return res.redirect('/user/dashboard');
    }

    const review = new Review({
      user: req.user._id,
      userName: req.user.displayName,
      rating: parseInt(rating),
      comment: comment.trim(),
      isApproved: false // Needs admin approval
    });

    await review.save();
    req.flash('success', 'Review submitted! It will appear after admin approval.');
    res.redirect('/user/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error submitting review');
    res.redirect('/user/dashboard');
  }
});

// Admin: Get all reviews
router.get('/admin/all', ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const reviews = await Review.find({}).sort({ createdAt: -1 });
    res.render('admin/reviews', { reviews, user: req.user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching reviews');
  }
});

// Admin: Approve review
router.post('/admin/approve/:id', ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    await Review.findByIdAndUpdate(req.params.id, { isApproved: true });
    res.redirect('/reviews/admin/all');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error approving review');
  }
});

// Admin: Delete review
router.delete('/admin/delete/:id', ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.redirect('/reviews/admin/all');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting review');
  }
});

module.exports = router;
