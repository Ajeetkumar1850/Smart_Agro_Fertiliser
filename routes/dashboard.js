const express = require('express');
const router = express.Router();
const dashboardController = require('../controller/dashboard');
const { ensureAuthenticated } = require('../middleware/auth');

// Dashboard requires authentication
router.get('/', ensureAuthenticated, dashboardController.renderDashboard);

module.exports = router;
