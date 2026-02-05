module.exports = (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Vercel function is working!',
    env: {
      hasMongoUrl: !!process.env.MONGO_URL,
      hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
      isVercel: process.env.VERCEL
    }
  });
};
