# 🌾 AgroConnect Pro - Complete Farm Management Platform

> Modern Agricultural Business Management System with AI-Powered Advisory, E-Commerce, and Multi-Channel Customer Engagement

[![License](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/mongodb-8.18.0-green)](https://www.mongodb.com)

---
## 📋 Overview

**AgroConnect Pro** is a comprehensive digital platform designed for agricultural retailers and farmers, combining inventory management, e-commerce, customer relationship tools, and AI-powered crop advisory services. The platform features a mobile-responsive web interface, intelligent chatbots, and automated email notifications.

### 🎯 Key Highlights

- 🏪 **Complete Retail Management** - Products, Customers, Workers, Stock, Orders
- 🛒 **E-Commerce Platform** - Online ordering with email confirmations and PDF invoices
- 🤖 **AI Crop Advisory** - Powered by Google Gemini for crop recommendations
- 💬 **Multi-Channel Bots** - Telegram & WhatsApp integration
- 📧 **Email Automation** - Order confirmations, password resets, invoices
- 📱 **Mobile-First Design** - Fully responsive UI for all devices
- 🔐 **Secure Authentication** - Google OAuth 2.0 + Local auth with password reset
- ⭐ **Review System** - Customer feedback and testimonials
- 📊 **Analytics Dashboard** - Real-time business metrics and insights

---



## ✨ Features

### 🏬 Core Business Management

#### Product Management
- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Product categories and descriptions
- ✅ Stock quantity tracking
- ✅ Image management with URLs
- ✅ Price management
- ✅ Search and filter capabilities

#### Customer Management (CRM)
- ✅ Customer database with contact details
- ✅ Purchase history tracking
- ✅ Order management
- ✅ Customer reviews and ratings
- ✅ Unique validation (email/phone)

#### Worker Management
- ✅ Employee records and profiles
- ✅ Role assignment
- ✅ Contact information
- ✅ Performance tracking ready

#### Stock Management
- ✅ Real-time inventory tracking
- ✅ Product-wise stock levels
- ✅ Low stock alerts
- ✅ Stock movement history

### 🛒 E-Commerce Features

#### Online Ordering System
- ✅ User-friendly product catalog
- ✅ Shopping cart functionality
- ✅ Order placement and tracking
- ✅ Order status management (Pending, Confirmed, Shipped, Delivered)
- ✅ Order history for customers

#### Email Notifications
- ✅ Order confirmation emails with details
- ✅ PDF invoice generation and attachment
- ✅ Password reset emails with secure tokens
- ✅ Professional HTML email templates
- ✅ Automated email delivery via Nodemailer

#### Billing & Invoicing
- ✅ Automated PDF invoice generation
- ✅ Professional invoice templates
- ✅ Order details and pricing breakdown
- ✅ Company branding and information
- ✅ Email delivery of invoices

### 🤖 AI & Automation

#### AI Chatbot
- ✅ Agriculture-focused AI assistant
- ✅ Crop recommendations
- ✅ Farming advice and tips
- ✅ Product information
- ✅ Powered by Google Gemini AI

#### Bot Integration
- ✅ Telegram bot for customer engagement
- ✅ WhatsApp bot (ready for activation)
- ✅ Automated responses
- ✅ Product catalog access
- ✅ Order status updates

### 🔐 Authentication & Security

#### Multi-Auth System
- ✅ Google OAuth 2.0 integration
- ✅ Local authentication with bcrypt
- ✅ Password reset functionality
- ✅ Secure token-based password recovery
- ✅ Session management
- ✅ Role-based access control (Admin/User)

#### Security Features
- ✅ Password hashing with bcryptjs
- ✅ Secure session handling
- ✅ Environment variable protection
- ✅ Input validation
- ✅ CORS configuration
- ✅ Admin whitelist system

### 📱 User Experience

#### Mobile-Responsive Design
- ✅ Optimized for all screen sizes
- ✅ Touch-friendly interface
- ✅ Responsive navigation
- ✅ Mobile-optimized forms
- ✅ Adaptive layouts

#### User Dashboard
- ✅ Personal profile management
- ✅ Order history and tracking
- ✅ Product browsing and ordering
- ✅ Review submission
- ✅ Account settings

#### Admin Dashboard
- ✅ Business metrics overview
- ✅ Customer statistics (340+ customers)
- ✅ Product management
- ✅ Order management
- ✅ Review moderation
- ✅ User management

### ⭐ Review & Rating System
- ✅ Customer review submission
- ✅ 5-star rating system
- ✅ Review display on homepage
- ✅ Admin review moderation
- ✅ Approve/reject functionality

---

## 🔧 Technology Stack

### Backend
- **Runtime:** Node.js v18+
- **Framework:** Express.js v5.1.0
- **Database:** MongoDB with Mongoose v8.18.0
- **Authentication:** Passport.js (Google OAuth 2.0 + Local)
- **Session:** Express-session
- **Password:** Bcryptjs v3.0.3

### AI & External Services
- **AI:** Google Gemini 1.5 (@google/generative-ai v0.24.1)
- **Email:** Nodemailer v7.0.12
- **PDF:** PDFKit v0.17.2
- **Bots:** node-telegram-bot-api v0.66.0, whatsapp-web.js v1.34.1
- **Automation:** node-cron v4.2.1

### Frontend
- **Template Engine:** EJS v3.1.10
- **Styling:** CSS3 with custom responsive design
- **JavaScript:** Vanilla JS
- **Icons:** Font Awesome 6.4.0
- **Fonts:** Google Fonts (Poppins)

### DevOps & Deployment
- **Hosting:** Vercel (Serverless)
- **Version Control:** Git & GitHub
- **Environment:** dotenv v16.6.1
- **Process Manager:** PM2 (for local/VPS)

---

## 📁 Project Structure

```
AgroConnect-Pro/
├── api/
│   ├── index.js              # Vercel serverless entry point
│   ├── test-db.js            # Database connection test
│   └── test.js               # API test endpoint
│
├── config/
│   ├── email.js              # Email configuration
│   └── passport.js           # OAuth & Local auth config
│
├── controller/
│   ├── customers.js          # Customer business logic
│   ├── dashboard.js          # Dashboard logic
│   ├── products.js           # Product business logic
│   ├── stocks.js             # Stock business logic
│   ├── users.js              # User management logic
│   └── workers.js            # Worker business logic
│
├── models/
│   ├── CropRecommendation.js # Crop advisory schema
│   ├── Customer.js           # Customer schema
│   ├── Order.js              # Order schema
│   ├── PasswordReset.js      # Password reset token schema
│   ├── Product.js            # Product schema
│   ├── Review.js             # Review schema
│   ├── SiteStats.js          # Site statistics schema
│   ├── Stock.js              # Stock schema
│   ├── user.js               # User authentication schema
│   └── Worker.js             # Worker schema
│
├── routes/
│   ├── auth.js               # Authentication routes
│   ├── chatbot.js            # AI chatbot routes
│   ├── cropRoutes.js         # Crop advisory routes
│   ├── customer.js           # Customer routes
│   ├── dashboard.js          # Dashboard routes
│   ├── gemini.js             # Gemini AI routes
│   ├── order.js              # Order routes
│   ├── passwordReset.js      # Password reset routes
│   ├── product.js            # Product routes
│   ├── recommend.js          # Recommendation routes
│   ├── review.js             # Review routes
│   ├── stock.js              # Stock routes
│   ├── userDashboard.js      # User dashboard routes
│   └── worker.js             # Worker routes
│
├── services/
│   ├── emailService.js       # Email sending service
│   └── pdfService.js         # PDF generation service
│
├── middleware/
│   ├── auth.js               # Authentication middleware
│   └── isLoggedIn.js         # Login check middleware
│
├── views/
│   ├── admin/
│   │   ├── bill.ejs          # Invoice template
│   │   ├── dashboard.ejs     # Admin dashboard
│   │   ├── orders.ejs        # Order management
│   │   └── reviews.ejs       # Review moderation
│   ├── auth/
│   │   ├── forgot-password.ejs
│   │   ├── login.ejs
│   │   ├── register.ejs
│   │   └── reset-password.ejs
│   ├── user/
│   │   ├── dashboard.ejs     # User dashboard
│   │   ├── orders.ejs        # User orders
│   │   ├── products.ejs      # Product catalog
│   │   └── profile.ejs       # User profile
│   ├── shop/                 # Shop management views
│   ├── includes/             # Reusable components
│   ├── layouts/              # Layout templates
│   └── home.ejs              # Landing page
│
├── public/
│   └── css/
│       └── style.css         # Custom styles
│
├── init/
│   ├── add-products.js       # Product seeder
│   ├── data.js               # Sample data
│   └── initdb.js             # Database initialization
│
├── app.js                    # Main application entry
├── bots.js                   # Bot logic (Telegram/WhatsApp)
├── package.json              # Dependencies
├── vercel.json               # Vercel configuration
├── .gitignore                # Git ignore rules
├── .vercelignore             # Vercel ignore rules
└── README.md                 # This file
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18 or higher
- MongoDB (local or Atlas)
- Gmail account (for email service)
- Google Cloud Console account (for OAuth)
- Gemini API key (for AI features)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Ajeetkumar1850/Smart_Agro_Fertiliser.git
cd Smart_Agro_Fertiliser
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=8080
NODE_ENV=development

# Database
MONGO_URL=mongodb://127.0.0.1:27017/AGRO_MANAGEMENT
# For production: mongodb+srv://username:password@cluster.mongodb.net/AGRO_MANAGEMENT

# Google OAuth 2.0
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:8080/auth/google/callback

# Email Service (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password

# AI Services
GEMINI_API_KEY=your_gemini_api_key

# Telegram Bot (Optional)
TELEGRAM_TOKEN=your_telegram_bot_token

# Admin Configuration
ADMIN_EMAILS=admin@example.com,admin2@example.com

# Session Secret
SESSION_SECRET=your_random_secret_key_here
```

4. **Initialize the database** (Optional)
```bash
node init/initdb.js
node init/add-products.js
```

5. **Start the application**
```bash
# Development
node app.js

# Or with nodemon
nodemon app.js

# Production with PM2
pm2 start app.js --name agroconnect
```

6. **Access the application**
```
http://localhost:8080
```

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel --prod
```

4. **Configure Environment Variables**
- Go to Vercel Dashboard → Your Project → Settings → Environment Variables
- Add all variables from `.env` file

5. **Set up MongoDB Atlas**
- Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Get connection string and add to Vercel environment variables

### Deploy to Other Platforms

#### Railway.app
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

#### Render.com
- Connect GitHub repository
- Set environment variables
- Deploy automatically on push

---

## 📧 Email Configuration

### Gmail Setup

1. **Enable 2-Factor Authentication**
   - Go to Google Account → Security
   - Enable 2-Step Verification

2. **Generate App Password**
   - Go to Security → 2-Step Verification → App passwords
   - Select "Mail" and "Other (Custom name)"
   - Copy the 16-character password

3. **Add to .env**
```env
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_char_app_password
```

---

## 🤖 Bot Setup

### Telegram Bot

1. **Create Bot**
   - Open Telegram, search for @BotFather
   - Send `/newbot` and follow instructions
   - Copy the bot token

2. **Configure**
```env
TELEGRAM_TOKEN=your_bot_token_here
```

3. **Start Bot**
```bash
node bots.js
```

### WhatsApp Bot (Optional)

1. **Uncomment WhatsApp code in `bots.js`**
2. **Restart server and scan QR code**
3. **Note:** Requires Chromium (large dependency)

---

## 📊 API Endpoints

### Authentication
```
GET    /auth/login              # Login page
POST   /auth/login              # Login submit
GET    /auth/register           # Register page
POST   /auth/register           # Register submit
GET    /auth/google             # Google OAuth
GET    /auth/google/callback    # OAuth callback
GET    /auth/logout             # Logout
GET    /auth/forgot-password    # Forgot password page
POST   /auth/forgot-password    # Send reset email
GET    /auth/reset-password/:token  # Reset password page
POST   /auth/reset-password/:token  # Reset password submit
```

### Products
```
GET    /user/products           # Product catalog
GET    /prod                    # Admin product list
POST   /prod                    # Create product
GET    /prod/:id/edit           # Edit product
PUT    /prod/:id                # Update product
DELETE /prod/:id                # Delete product
```

### Orders
```
POST   /orders/place            # Place order
GET    /user/orders             # User order history
GET    /admin/orders            # Admin order management
POST   /admin/orders/:id/status # Update order status
```

### Reviews
```
POST   /reviews/submit          # Submit review
GET    /admin/reviews           # Admin review list
POST   /admin/reviews/:id/approve   # Approve review
POST   /admin/reviews/:id/reject    # Reject review
```

### Chatbot
```
POST   /chatbot/ask             # AI chatbot query
```

### Dashboard
```
GET    /dash                    # Admin dashboard
GET    /user/dashboard          # User dashboard
```

---

## 🔒 Security Best Practices

### Implemented Security Measures

1. **Password Security**
   - Bcrypt hashing with salt rounds
   - Password strength validation
   - Secure password reset tokens

2. **Session Security**
   - Secure session cookies
   - Session expiration
   - CSRF protection ready

3. **Data Validation**
   - Mongoose schema validation
   - Input sanitization
   - Unique constraints

4. **Authentication**
   - OAuth 2.0 integration
   - Role-based access control
   - Admin whitelist

5. **Environment Protection**
   - Sensitive data in .env
   - .gitignore configuration
   - No hardcoded credentials

---

## 📈 Business Impact

### Platform Statistics
- **340+ Happy Customers**
- **55+ Products**
- **24/7 Bot Support**
- **Real-time Analytics**

### Key Benefits
- ✅ Streamlined inventory management
- ✅ Automated order processing
- ✅ Enhanced customer engagement
- ✅ AI-powered crop advisory
- ✅ Mobile-accessible platform
- ✅ Professional invoicing
- ✅ Email automation

---

## 🧪 Testing

### Manual Testing Checklist

#### Authentication
- [ ] User registration works
- [ ] Email login works
- [ ] Google OAuth works
- [ ] Password reset works
- [ ] Logout works

#### E-Commerce
- [ ] Product catalog loads
- [ ] Add to cart works
- [ ] Order placement works
- [ ] Email confirmation sent
- [ ] PDF invoice generated

#### Admin Functions
- [ ] Dashboard loads
- [ ] Product CRUD works
- [ ] Order management works
- [ ] Review moderation works
- [ ] User management works

#### Mobile Responsiveness
- [ ] Homepage responsive
- [ ] Navigation works on mobile
- [ ] Forms usable on mobile
- [ ] Dashboard responsive
- [ ] Product catalog responsive

---

## 🐛 Troubleshooting

### Common Issues

#### MongoDB Connection Error
```bash
# Check MongoDB is running
mongod --version

# Verify connection string
echo $MONGO_URL
```

#### Email Not Sending
```bash
# Verify Gmail app password
# Check EMAIL_USER and EMAIL_PASS in .env
# Ensure 2FA is enabled on Gmail
```

#### OAuth Not Working
```bash
# Verify Google Cloud Console settings
# Check callback URL matches
# Ensure OAuth consent screen is configured
```

#### Port Already in Use
```bash
# Find process using port 8080
netstat -ano | findstr :8080

# Kill the process or change PORT in .env
```

---

## 🤝 Contributing

This is a production system. For modifications:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

ISC License - See [LICENSE](LICENSE) file for details

---

## 👨‍💻 Developer

**Ajeet Kumar**
- 📧 Email: ajeetkumarssm9987@gmail.com
- 🐙 GitHub: [@Ajeetkumar1850](https://github.com/Ajeetkumar1850)
- 💼 LinkedIn: [ajeet-kumar-06424b292](https://www.linkedin.com/in/ajeet-kumar-06424b292)

---

## 🙏 Acknowledgments

- Google Gemini AI for intelligent crop advisory
- MongoDB for robust database solution
- Vercel for seamless deployment
- Node.js community for excellent packages
- All farmers and retailers using the platform

---

## 📞 Support

### For Technical Issues
- Check documentation first
- Review error logs
- Search existing issues
- Contact: ajeetkumarssm9987@gmail.com

### For Business Inquiries
- Demo requests
- Custom features
- Partnership opportunities
- Contact via email or LinkedIn

---

## 🎯 Roadmap

### ✅ Completed (v1.0)
- Core retail management
- E-commerce platform
- Email automation
- AI chatbot
- Review system
- Mobile-responsive UI
- Multi-auth system

### 🔄 In Progress (v1.1)
- WhatsApp bot activation
- Advanced analytics
- Payment gateway integration
- SMS notifications

### 📅 Planned (v2.0)
- Mobile app (React Native)
- Multi-location support
- Marketplace features
- IoT sensor integration
- Blockchain for supply chain

---

## 📊 Project Stats

- **Lines of Code:** 10,000+
- **API Endpoints:** 30+
- **Database Collections:** 9
- **External APIs:** 5+
- **Supported Languages:** English, Hindi (bot)
- **Deployment:** Vercel (Serverless)
- **Status:** Production Ready ✅

---

**Transform your agricultural business with AI-powered digital platform.**

**From traditional shop to modern e-commerce platform.**

---

*Built with ❤️ for farmers and agricultural retailers*

**Last Updated:** February 2026
**Version:** 1.0.0
**Status:** Production Ready & Actively Maintained
