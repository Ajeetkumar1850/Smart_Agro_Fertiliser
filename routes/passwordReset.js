const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const PasswordReset = require('../models/PasswordReset');
const { sendPasswordResetEmail } = require('../services/emailService');

// Show forgot password form
router.get('/forgot-password', (req, res) => {
  res.render('auth/forgot-password', {
    title: 'Forgot Password',
    messages: {
      error: req.flash('error'),
      success: req.flash('success')
    }
  });
});

// Handle forgot password request
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    
    if (!user) {
      req.flash('error', 'No account found with that email address');
      return res.redirect('/auth/forgot-password');
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Save reset token to database
    const passwordReset = new PasswordReset({
      user: user._id,
      token: resetToken,
      expiresAt: new Date(Date.now() + 3600000) // 1 hour from now
    });
    
    await passwordReset.save();
    
    // Send email
    const emailResult = await sendPasswordResetEmail({
      email: user.email,
      displayName: user.displayName
    }, resetToken);
    
    if (emailResult.success) {
      req.flash('success', 'Password reset link has been sent to your email');
    } else {
      req.flash('error', 'Error sending email. Please try again later.');
    }
    
    res.redirect('/auth/login');
    
  } catch (error) {
    console.error('Forgot password error:', error);
    req.flash('error', 'An error occurred. Please try again.');
    res.redirect('/auth/forgot-password');
  }
});

// Show reset password form
router.get('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    // Find valid reset token
    const resetRecord = await PasswordReset.findOne({
      token,
      used: false,
      expiresAt: { $gt: new Date() }
    });
    
    if (!resetRecord) {
      req.flash('error', 'Password reset link is invalid or has expired');
      return res.redirect('/auth/forgot-password');
    }
    
    res.render('auth/reset-password', {
      title: 'Reset Password',
      token,
      messages: {
        error: req.flash('error'),
        success: req.flash('success')
      }
    });
    
  } catch (error) {
    console.error('Reset password page error:', error);
    req.flash('error', 'An error occurred');
    res.redirect('/auth/forgot-password');
  }
});

// Handle password reset
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;
    
    // Validate passwords match
    if (password !== confirmPassword) {
      req.flash('error', 'Passwords do not match');
      return res.redirect(`/auth/reset-password/${token}`);
    }
    
    // Validate password length
    if (password.length < 6) {
      req.flash('error', 'Password must be at least 6 characters long');
      return res.redirect(`/auth/reset-password/${token}`);
    }
    
    // Find valid reset token
    const resetRecord = await PasswordReset.findOne({
      token,
      used: false,
      expiresAt: { $gt: new Date() }
    });
    
    if (!resetRecord) {
      req.flash('error', 'Password reset link is invalid or has expired');
      return res.redirect('/auth/forgot-password');
    }
    
    // Find user
    const user = await User.findById(resetRecord.user);
    
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/auth/forgot-password');
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Update user password
    user.password = hashedPassword;
    await user.save();
    
    // Mark token as used
    resetRecord.used = true;
    await resetRecord.save();
    
    req.flash('success', 'Password has been reset successfully. Please login with your new password.');
    res.redirect('/auth/login');
    
  } catch (error) {
    console.error('Reset password error:', error);
    req.flash('error', 'An error occurred. Please try again.');
    res.redirect(`/auth/reset-password/${req.params.token}`);
  }
});

module.exports = router;
