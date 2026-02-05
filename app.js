require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const qrcode = require('qrcode-terminal');
const Product = require('./models/Product');
const cropRoutes = require('./routes/cropRoutes');

// MongoDB Connection - Use environment variable
const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/AGRO_MANAGEMENT";

// For Vercel serverless, connect on demand
if (process.env.VERCEL === '1') {
  // Serverless: Connect with shorter timeout
  mongoose.connect(MONGO_URL, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  }).catch(err => console.error("MongoDB connection error:", err));
} else {
  // Local: Normal connection
  mongoose.connect(MONGO_URL)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));
  
  mongoose.connection.on('connected', () => {
    console.log('MongoDB connection state:', mongoose.connection.readyState);
  });
}

const app = express();

// ================= MIDDLEWARE SETUP =================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ================ SESSION & PASSPORT SETUP ================
app.use(session({
  secret: 'agro-secret-key',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());



// Passport config
require('./config/passport')(passport);


// ================ after user role implementation  =================
app.use('/user', require('./routes/userDashboard'));
// ===========================================
app.use('/auth', require('./routes/auth'));
app.use('/auth', require('./routes/passwordReset'));
app.use('/reviews', require('./routes/review'));
app.use('/orders', require('./routes/order'));
app.use('/chatbot', require('./routes/chatbot'));
app.use('/api', require('./routes/recommend'));
app.use('/prod', require('./routes/product'));
app.use('/cust', require('./routes/customer'));
app.use('/worker', require('./routes/worker')); // Make sure this line exists
app.use('/dash', require('./routes/dashboard'));// this is admin dashboard route

app.use('/api', cropRoutes);

// Only start bots if NOT on Vercel (bots need persistent connection)
if (process.env.VERCEL !== '1') {
  const { telegramBot, whatsappBot, sendWeatherAlerts } = require('./bots');
  telegramBot.startPolling();
  whatsappBot.initialize();
  sendWeatherAlerts();
  console.log('✅ Bots and weather alerts started');
} else {
  console.log('⚠️ Running on Vercel - Bots disabled (use Railway/Render for bots)');
}


// ================ HOME PAGE ================
app.get('/', async (req, res) => {
  try {
    // Wait for MongoDB connection if it's connecting
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGO_URL, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
    } else if (mongoose.connection.readyState === 2) {
      // Wait for existing connection attempt
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Connection timeout')), 5000);
        mongoose.connection.once('connected', () => {
          clearTimeout(timeout);
          resolve();
        });
        mongoose.connection.once('error', (err) => {
          clearTimeout(timeout);
          reject(err);
        });
      });
    }
    
    // Track visitor
    const SiteStats = require('./models/SiteStats');
    const Review = require('./models/Review');
    const User = require('./models/user');
    
    let stats = await SiteStats.findOne({});
    if (!stats) {
      stats = new SiteStats({ totalVisits: 0 });
    }
    stats.totalVisits += 1;
    await stats.save();
    
    // Count total registered users
    const userCount = await User.countDocuments({});
    
    const products = await Product.find({}).limit(10);
    const reviews = await Review.find({ isApproved: true }).sort({ createdAt: -1 }).limit(6);
    
    res.render('home', { 
      products, 
      reviews,
      user: req.user,
      totalVisits: stats.totalVisits,
      userCount: userCount
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: err.message,
      mongoState: mongoose.connection.readyState
    });
  }
});

// // ================ GOOGLE AUTH PROTECTED ROUTES ================
// const { ensureAuthenticated, ensureAdmin } = require('./middleware/auth');
// app.get('/dashboard', ensureAuthenticated, (req, res) => {
//   res.send(`
//     <h2>Welcome, ${req.user.displayName}</h2>
//     <p>Email: ${req.user.email}</p>
//     <p>Role: ${req.user.role}</p>
//     <a href="/auth/logout">Logout</a>
//   `);
// });

// app.get('/admin', ensureAdmin, (req, res) => {
//   res.send(`
//     <h2>Admin Panel</h2>
//     <p>Hello Admin: ${req.user.displayName}</p>
//     <a href="/auth/logout">Logout</a>
//   `);
// });

// ================ ERROR HANDLER ================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

// ================ START SERVER ================
const PORT = process.env.PORT || 8080;

// Only start server if not in Vercel environment
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

// Export for Vercel
module.exports = app;