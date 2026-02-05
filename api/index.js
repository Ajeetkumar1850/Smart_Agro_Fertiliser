// Vercel serverless function wrapper with error handling
try {
  const app = require('../app');
  module.exports = app;
} catch (error) {
  console.error('Error loading app:', error);
  module.exports = (req, res) => {
    res.status(500).json({ 
      error: 'Failed to load application',
      message: error.message,
      stack: error.stack
    });
  };
}
