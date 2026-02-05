const mongoose = require('mongoose');

module.exports = async (req, res) => {
  try {
    const MONGO_URL = process.env.MONGO_URL;
    
    if (!MONGO_URL) {
      return res.json({ error: 'MONGO_URL not set' });
    }
    
    // Show connection string (masked password)
    const maskedUrl = MONGO_URL.replace(/:([^@]+)@/, ':****@');
    
    // Try to connect
    const conn = await mongoose.createConnection(MONGO_URL, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    }).asPromise();
    
    await conn.close();
    
    res.json({ 
      success: true,
      message: 'MongoDB connection successful!',
      connectionString: maskedUrl
    });
  } catch (err) {
    res.json({ 
      error: 'Connection failed',
      message: err.message,
      connectionString: process.env.MONGO_URL ? process.env.MONGO_URL.replace(/:([^@]+)@/, ':****@') : 'not set'
    });
  }
};
