const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');
// const { Client, LocalAuth } = require('whatsapp-web.js'); // DISABLED
const qrcode = require('qrcode-terminal');
const cron = require('node-cron');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const CropRecommendation = require('./models/CropRecommendation'); 

// Load environment variables
require('dotenv').config();

// User language storage
const userLanguages = {};
const whatsappUserLanguages = {};

// User subscriptions for weather alerts
const userSubscriptions = { telegram: {}, whatsapp: {} };

// Initialize Telegram bot
const telegramBot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

// WhatsApp bot DISABLED - dummy object
const whatsappBot = {
  on: () => {},
  sendMessage: () => {},
  initialize: () => Promise.resolve()
};

// Telegram: Handle polling errors
telegramBot.on('polling_error', (error) => {
  console.error('Telegram polling error:', error.message);
});

// Multi-language welcome messages
const welcomeMessages = {
  en: {
    welcome: "🌱 *Welcome to Crop Advisor!* 🌾\n\n🤖 I'm here to guide you with the best crop advice.",
    features: "👉 *Available Features:*",
    buttons: [
      "🌾 Get Crop Recommendation",
      "📷 Detect Crop Disease", 
      "💧 Irrigation Advice",
      "🌦️ Weather Alerts",
      "🛒 Available Products",
      "🌐 Change Language"
    ]
  },
  hi: {
    welcome: "🌱 *क्रॉप एडवाइजर में आपका स्वागत है!* 🌾\n\n🤖 मैं आपको सर्वोत्तम फसल सलाह देने के लिए यहां हूं।",
    features: "👉 *उपलब्ध सुविधाएं:*",
    buttons: [
      "🌾 फसल सिफारिश लें",
      "📷 फसल रोग पहचानें",
      "💧 सिंचाई सलाह",
      "🌦️ मौसम अलर्ट",
      "🛒 उपलब्ध उत्पाद",
      "🌐 भाषा बदलें"
    ]
  }
};

// ================= PRODUCT FUNCTIONS =================

// Function to fetch products from your database
async function fetchProducts() {
  try {
    const response = await fetch(`http://localhost:${process.env.PORT || 8080}/prod/api`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const products = await response.json();
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// Function to show products in Telegram
async function showTelegramProducts(chatId) {
  try {
    const products = await fetchProducts();
    
    if (products.length === 0) {
      return telegramBot.sendMessage(chatId, "📭 No products available at the moment. Please check back later.");
    }

    const lang = userLanguages[chatId] || 'en';
    
    let message = `🛒 *AVAILABLE PRODUCTS* 🛒\n\n`;
    
    products.forEach((product, index) => {
      if (lang === 'hi') {
        message += `*${index + 1}. ${product.name_hindi || product.name}*\n`;
        message += `💵 Price: ₹${product.price}\n`;
        message += `📦 Stock: ${product.stock_quantity}\n`;
        message += `📝 ${product.description_hindi || product.description}\n`;
        message += `🏷️ Category: ${product.category}\n\n`;
      } else {
        message += `*${index + 1}. ${product.name}*\n`;
        message += `💵 Price: ₹${product.price}\n`;
        message += `📦 Stock: ${product.stock_quantity}\n`;
        message += `📝 ${product.description}\n`;
        message += `🏷️ Category: ${product.category}\n\n`;
      }
    });

    message += `💳 *Secure Payment:* Visit our website\n`;
    message += `🌐 http://localhost:8080/prod\n\n`;
    message += `🔒 100% Secure | SSL Encrypted | Fast Delivery\n\n`;
    message += `📋 Copy the link above and paste in your browser to shop securely!`;

    telegramBot.sendMessage(chatId, message, {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "🔄 Refresh Products", callback_data: "show_products" }],
          [{ text: "🔙 Back to Menu", callback_data: "back_to_menu" }]
        ]
      }
    });
  } catch (error) {
    console.error('Error showing products:', error);
    telegramBot.sendMessage(chatId, "❌ Error loading products. Please try again later.");
  }
}

// Function to show products in WhatsApp
async function showWhatsAppProducts(chatId) {
  try {
    const products = await fetchProducts();
    
    if (products.length === 0) {
      return whatsappBot.sendMessage(chatId, "📭 No products available at the moment. Please check back later.");
    }

    const lang = whatsappUserLanguages[chatId] || 'en';
    
    let message = `🛒 *AVAILABLE PRODUCTS* 🛒\n\n`;
    
    products.forEach((product, index) => {
      if (lang === 'hi') {
        message += `*${index + 1}. ${product.name_hindi || product.name}*\n`;
        message += `💵 Price: ₹${product.price}\n`;
        message += `📦 Stock: ${product.stock_quantity}\n`;
        message += `📝 ${product.description_hindi || product.description}\n`;
        message += `🏷️ Category: ${product.category}\n\n`;
      } else {
        message += `*${index + 1}. ${product.name}*\n`;
        message += `💵 Price: ₹${product.price}\n`;
        message += `📦 Stock: ${product.stock_quantity}\n`;
        message += `📝 ${product.description}\n`;
        message += `🏷️ Category: ${product.category}\n\n`;
      }
    });

    message += `💳 *Secure Payment:* Visit our website\n`;
    message += `🌐 http://localhost:8080/prod\n\n`;
    message += `🔒 100% Secure | SSL Encrypted | Fast Delivery\n\n`;
    message += `📋 Copy the link above and paste in your browser to shop securely!\n\n`;
    message += `Type /products to refresh or /start to go back to main menu`;

    whatsappBot.sendMessage(chatId, message);
  } catch (error) {
    console.error('Error showing products:', error);
    whatsappBot.sendMessage(chatId, "❌ Error loading products. Please try again later.");
  }
}

// ================= TELEGRAM BOT =================

// Telegram: Enhanced Start command
telegramBot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const lang = userLanguages[chatId] || 'en';
  const messages = welcomeMessages[lang];
  
  const message = 
    `${messages.welcome}\n\n${messages.features}\n` +
    `1. ${messages.buttons[0]} (/recommend)\n` +
    `2. ${messages.buttons[1]} (upload image)\n` +
    `3. ${messages.buttons[2]} (/irrigation)\n` +
    `4. ${messages.buttons[3]} (/subscribe <location>)\n` +
    `5. ${messages.buttons[4]} (/products)\n` +
    `6. ${messages.buttons[5]} (/lang en or /lang hi)`;

  telegramBot.sendMessage(chatId, message, {
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [
          { text: messages.buttons[0], callback_data: "recommend" },
          { text: messages.buttons[1], callback_data: "disease" }
        ],
        [
          { text: messages.buttons[2], callback_data: "irrigation" },
          { text: messages.buttons[3], callback_data: "weather" }
        ],
        [
          { text: "🛒 Products", callback_data: "show_products" },
          { text: "🌐 Language", callback_data: "language_menu" }
        ]
      ]
    }
  });
});

// Telegram: Handle button clicks
telegramBot.on("callback_query", async (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;

  if (data === "recommend") {
    telegramBot.sendMessage(chatId, "🌾 Enter soil type, season, location (e.g., loamy, Kharif, Punjab or red, Monsoon, Tamil Nadu)!");
  } else if (data === "disease") {
    telegramBot.sendMessage(chatId, "📷 Please upload an image of the crop to detect diseases.");
  } else if (data === "irrigation") {
    telegramBot.sendMessage(chatId, "💧 For irrigation advice, use /irrigation command");
  } else if (data === "weather") {
    telegramBot.sendMessage(chatId, "🌦️ Use /subscribe <location> to get weather alerts\nExample: /subscribe Bihar");
  } else if (data === "show_products") {
    await showTelegramProducts(chatId);
  } else if (data === "language_menu") {
    telegramBot.sendMessage(chatId, "Choose language:", {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "🌐 English", callback_data: "lang_en" },
            { text: "🇮🇳 हिंदी", callback_data: "lang_hi" }
          ]
        ]
      }
    });
  } else if (data === "lang_en") {
    userLanguages[chatId] = 'en';
    telegramBot.sendMessage(chatId, "✅ Language set to English.");
  } else if (data === "lang_hi") {
    userLanguages[chatId] = 'hi';
    telegramBot.sendMessage(chatId, "✅ भाषा हिंदी में सेट हो गई है।");
  } else if (data === "back_to_menu") {
    // Restart the menu
    const lang = userLanguages[chatId] || 'en';
    const messages = welcomeMessages[lang];
    
    const message = 
      `${messages.welcome}\n\n${messages.features}\n` +
      `1. ${messages.buttons[0]} (/recommend)\n` +
      `2. ${messages.buttons[1]} (upload image)\n` +
      `3. ${messages.buttons[2]} (/irrigation)\n` +
      `4. ${messages.buttons[3]} (/subscribe <location>)\n` +
      `5. ${messages.buttons[4]} (/products)\n` +
      `6. ${messages.buttons[5]} (/lang en or /lang hi)`;

    telegramBot.sendMessage(chatId, message, {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            { text: messages.buttons[0], callback_data: "recommend" },
            { text: messages.buttons[1], callback_data: "disease" }
          ],
          [
            { text: messages.buttons[2], callback_data: "irrigation" },
            { text: messages.buttons[3], callback_data: "weather" }
          ],
          [
            { text: "🛒 Products", callback_data: "show_products" },
            { text: "🌐 Language", callback_data: "language_menu" }
          ]
        ]
      }
    });
  } else if (data === "unsubscribe_now") {
    if (userSubscriptions.telegram[chatId]) {
      const location = userSubscriptions.telegram[chatId];
      delete userSubscriptions.telegram[chatId];
      const lang = userLanguages[chatId] || 'en';
      const message = lang === 'hi' ?
        `❌ ${location} के मौसम अलर्ट बंद कर दिए गए` :
        `❌ Unsubscribed from weather alerts for ${location}`;
      telegramBot.sendMessage(chatId, message);
      telegramBot.answerCallbackQuery(callbackQuery.id);
    }
  }
});

// Telegram: Products command
telegramBot.onText(/\/products/, async (msg) => {
  const chatId = msg.chat.id;
  await showTelegramProducts(chatId);
});

// Telegram: Subscribe to weather alerts with unsubscribe option
telegramBot.onText(/\/subscribe (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const location = match[1].trim();
  userSubscriptions.telegram[chatId] = location;
  
  const lang = userLanguages[chatId] || 'en';
  const message = lang === 'hi' ?
    `✅ ${location} के लिए मौसम अलर्ट सब्सक्राइब किए गए\n\nआपको नियमित अपडेट मिलते रहेंगे।\n\n❌ अलर्ट बंद करने के लिए /unsubscribe टाइप करें` :
    `✅ Subscribed to weather alerts for ${location}\n\nYou'll receive regular updates.\n\n❌ To stop alerts, type /unsubscribe`;
  
  telegramBot.sendMessage(chatId, message, {
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [[
        { text: "❌ Unsubscribe Alerts", callback_data: "unsubscribe_now" }
      ]]
    }
  });
});

// Telegram: Unsubscribe command
telegramBot.onText(/\/unsubscribe/, (msg) => {
  const chatId = msg.chat.id;
  if (userSubscriptions.telegram[chatId]) {
    const location = userSubscriptions.telegram[chatId];
    delete userSubscriptions.telegram[chatId];
    const lang = userLanguages[chatId] || 'en';
    const message = lang === 'hi' ?
      `❌ ${location} के मौसम अलर्ट बंद कर दिए गए` :
      `❌ Unsubscribed from weather alerts for ${location}`;
    telegramBot.sendMessage(chatId, message);
  } else {
    const lang = userLanguages[chatId] || 'en';
    const message = lang === 'hi' ?
      "ℹ️ आप किसी भी मौसम अलर्ट के सब्सक्राइब नहीं हैं" :
      "ℹ️ You are not subscribed to any weather alerts";
    telegramBot.sendMessage(chatId, message);
  }
});

// Telegram: Handle crop recommendation inputs
telegramBot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text || text.startsWith('/') || !text.includes(',')) return;

  const [soil_type, season, location] = text.split(',').map(s => s.trim());
  if (!soil_type || !season || !location) {
    return telegramBot.sendMessage(chatId, 
      '❌ Please use: soil_type, season, location\nExample: loamy, Kharif, Bihar\n\n💡 Use /start to see all options'
    );
  }

  try {
    await telegramBot.sendChatAction(chatId, 'typing');
    const response = await fetch(`http://localhost:${process.env.PORT || 8080}/api/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ soil_type, season, location })
    });
    const data = await response.json();

    if (data.error) {
      return telegramBot.sendMessage(chatId, 'Error getting recommendation. Try again.');
    }

    const lang = userLanguages[chatId] || 'both';
    let message = '';
    
    // Get recommended products from your API
    const recommendedProducts = await fetchProducts();
    const relevantProducts = recommendedProducts.filter(product => 
      product.category.toLowerCase().includes('seed') || 
      product.category.toLowerCase().includes('fertilizer') ||
      product.name.toLowerCase().includes(data.crop.toLowerCase())
    ).slice(0, 3); // Show top 3 relevant products

    const items = relevantProducts.map(p => {
      if (lang === 'en') return `${p.name}: ₹${p.price} (${p.category})`;
      else if (lang === 'hi') return `${p.name_hindi || p.name}: ₹${p.price} (${p.category})`;
      else return `${p.name}: ₹${p.price} (${p.category})`;
    }).join('\n');

    if (lang === 'en') {
      message = `✅ *Crop Recommendation*\n\n🌱 Crop: ${data.crop}\n💡 Advice: ${data.advice}\n🧪 Fertilizer: ${data.fertilizer}\n\n🛒 Recommended Products:\n${items || 'No specific products found'}\n\n💳 View all products: http://localhost:8080/prod`;
    } else if (lang === 'hi') {
      message = `✅ *फसल सिफारिश*\n\n🌱 फसल: ${data.crop_hindi}\n💡 सुझाव: ${data.advice_hindi}\n🧪 उर्वरक: ${data.fertilizer_hindi}\n\n🛒 अनुशंसित उत्पाद:\n${items || 'कोई विशेष उत्पाद नहीं मिला'}\n\n💳 सभी उत्पाद देखें: http://localhost:8080/prod`;
    } else {
      message = `✅ *Crop Recommendation*\n\n🌱 Crop: ${data.crop}\n💡 Advice: ${data.advice}\n🧪 Fertilizer: ${data.fertilizer}\n\n🛒 Recommended Products:\n${items || 'No specific products found'}\n\n💳 View all products: http://localhost:8080/prod`;
    }

    telegramBot.sendMessage(chatId, message, { parse_mode: "Markdown" });
  } catch (error) {
    console.error('Telegram bot error:', error.message);
    telegramBot.sendMessage(chatId, '❌ Server error. Please try again later.');
  }
});

// Telegram: Handle image uploads for disease detection
telegramBot.on('photo', async (msg) => {
  const chatId = msg.chat.id;
  const fileId = msg.photo[msg.photo.length - 1].file_id;
  const processingMsg = await telegramBot.sendMessage(chatId, "🔍 Analyzing image for diseases...");
  
  try {
    const file = await telegramBot.getFile(fileId);
    const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_TOKEN}/${file.file_path}`;
    const imageResponse = await axios.get(fileUrl, { responseType: 'arraybuffer' });
    const base64 = Buffer.from(imageResponse.data).toString('base64');
    const lang = userLanguages[chatId] || 'en';
    
    await telegramBot.sendChatAction(chatId, 'typing');
    const analysis = await analyzeImage(base64, 'image/jpeg', lang);
    
    await telegramBot.deleteMessage(chatId, processingMsg.message_id);
    telegramBot.sendMessage(chatId, 
      `📊 *Disease Analysis Complete*\n\n${analysis}\n\n🛒 Need treatment products? Visit: http://localhost:8080/prod`,
      { parse_mode: "Markdown" }
    );
  } catch (error) {
    console.error('Telegram image error:', error.message);
    await telegramBot.deleteMessage(chatId, processingMsg.message_id);
    telegramBot.sendMessage(chatId, '❌ Error analyzing image. Please try again.');
  }
});

// ================= WHATSAPP BOT =================

// WhatsApp: Setup with enhanced error handling
whatsappBot.on('qr', (qr) => {
  console.log('📱 WhatsApp QR code generated. Scan it with your phone:');
  qrcode.generate(qr, { small: true }, (code) => {
    console.log('QR Code:\n', code);
  });
});

whatsappBot.on('ready', () => {
  console.log('✅ WhatsApp bot is ready and connected!');
});

whatsappBot.on('authenticated', () => {
  console.log('✅ WhatsApp bot authenticated successfully!');
});

whatsappBot.on('auth_failure', (msg) => {
  console.error('❌ WhatsApp authentication failure:', msg);
});

whatsappBot.on('disconnected', (reason) => {
  console.error('❌ WhatsApp disconnected:', reason);
});

// WhatsApp: Enhanced message handling
whatsappBot.on('message', async (msg) => {
  const chatId = msg.from;
  const text = msg.body;

  // Handle image uploads for disease detection
  if (msg.hasMedia && msg.type === 'image') {
    try {
      await msg.react('🔍');
      const media = await msg.downloadMedia();
      const base64 = media.data;
      const lang = whatsappUserLanguages[chatId] || 'en';
      const analysis = await analyzeImage(base64, media.mimetype, lang);
      await msg.react('✅');
      msg.reply(`📊 *Disease Analysis Complete*\n\n${analysis}\n\n🛒 Need treatment? Visit: http://localhost:8080/prod`);
    } catch (error) {
      console.error('WhatsApp image error:', error.message);
      await msg.react('❌');
      msg.reply('Error analyzing image. Try again with a clearer photo.');
    }
    return;
  }

  // Start command with interactive menu
  if (text === '/start' || text === 'start') {
    const message = 
      "🌱 *Welcome to Crop Advisor!* 🌾\n\n" +
      "🤖 I'm here to guide you with the best crop advice.\n\n" +
      "👉 *Tap a number or type the command:*\n\n" +
      "1️⃣ 🌾 Get Crop Recommendation\n" +
      "2️⃣ 📷 Detect Crop Disease\n" + 
      "3️⃣ 💧 Irrigation Advice\n" +
      "4️⃣ 🌦️ Weather Alerts\n" +
      "5️⃣ 🛒 Available Products\n" +
      "6️⃣ 🌐 Change Language\n" +
      "7️⃣ ❌ Unsubscribe Alerts\n\n" +
      "✨ *Quick commands:* /recommend, /products, /subscribe, /unsubscribe";
    
    msg.reply(message);
    return;
  }

  // Handle menu selections
  if (['1', '2', '3', '4', '5', '6', '7'].includes(text)) {
    if (text === '1') {
      msg.reply('🌾 *Get Crop Recommendation*\n\nPlease send: soil_type, season, location\n\nExample: loamy, Kharif, Bihar');
    } else if (text === '2') {
      msg.reply('📷 *Detect Crop Disease*\n\nPlease upload a clear image of the affected crop leaves or plants.');
    } else if (text === '3') {
      msg.reply('💧 *Irrigation Advice*\n\nPlease provide:\n• Crop name\n• Soil type\n• Current season\n\nExample: Wheat, loamy, winter');
    } else if (text === '4') {
      msg.reply('🌦️ *Weather Alerts*\n\nTo subscribe, type:\n/subscribe <your-location>\n\nExample: /subscribe Bihar\n\n❌ To stop: /unsubscribe');
    } else if (text === '5') {
      await showWhatsAppProducts(chatId);
    } else if (text === '6') {
      msg.reply('🌐 *Change Language*\n\nChoose your language:\n• /lang en - English\n• /lang hi - Hindi\n\nभाषा चुनें:\n• /lang en - अंग्रेजी\n• /lang hi - हिंदी');
    } else if (text === '7') {
      if (userSubscriptions.whatsapp[chatId]) {
        const location = userSubscriptions.whatsapp[chatId];
        delete userSubscriptions.whatsapp[chatId];
        msg.reply(`❌ Unsubscribed from weather alerts for ${location}`);
      } else {
        msg.reply("ℹ️ You are not subscribed to any weather alerts.");
      }
    }
    return;
  }

  // Products command
  if (text === '/products') {
    await showWhatsAppProducts(chatId);
    return;
  }

  // Handle crop recommendation inputs
  if (text && text.includes(',')) {
    const [soil_type, season, location] = text.split(',').map(s => s ? s.trim() : '');
    if (!soil_type || !season || !location) {
      return msg.reply('❌ Please use: soil_type, season, location\nExample: loamy, Kharif, Bihar\n\n💡 Type /start for help');
    }
    
    try {
      const response = await fetch(`http://localhost:${process.env.PORT || 8080}/api/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ soil_type, season, location })
      });
      const data = await response.json();

      if (data.error) {
        return msg.reply('Error getting recommendation. Try again.');
      }

      const lang = whatsappUserLanguages[chatId] || 'both';
      let message = '';
      
      // Get recommended products from your API
      const recommendedProducts = await fetchProducts();
      const relevantProducts = recommendedProducts.filter(product => 
        product.category.toLowerCase().includes('seed') || 
        product.category.toLowerCase().includes('fertilizer') ||
        product.name.toLowerCase().includes(data.crop.toLowerCase())
      ).slice(0, 3); // Show top 3 relevant products

      const items = relevantProducts.map(p => {
        if (lang === 'en') return `${p.name}: ₹${p.price} (${p.category})`;
        else if (lang === 'hi') return `${p.name_hindi || p.name}: ₹${p.price} (${p.category})`;
        else return `${p.name}: ₹${p.price} (${p.category})`;
      }).join('\n');

      if (lang === 'en') {
        message = `✅ *Crop Recommendation*\n\n🌱 Crop: ${data.crop}\n💡 Advice: ${data.advice}\n🧪 Fertilizer: ${data.fertilizer}\n\n🛒 Recommended Products:\n${items || 'No specific products found'}\n\n💳 View all products: http://localhost:8080/prod`;
      } else if (lang === 'hi') {
        message = `✅ *फसल सिफारिश*\n\n🌱 फसल: ${data.crop_hindi}\n💡 सुझाव: ${data.advice_hindi}\n🧪 उर्वरक: ${data.fertilizer_hindi}\n\n🛒 अनुशंसित उत्पाद:\n${items || 'कोई विशेष उत्पाद नहीं मिला'}\n\n💳 सभी उत्पाद देखें: http://localhost:8080/prod`;
      }

      msg.reply(message);
      return;
    } catch (error) {
      console.error('WhatsApp bot error:', error.message);
      msg.reply('❌ Server error. Please try again later.');
      return;
    }
  }

  // Handle other commands
  if (text === '/recommend') {
    msg.reply('🌾 *Get Crop Recommendation*\n\nPlease send: soil_type, season, location\n\nExample: loamy, Kharif, Bihar');
    return;
  }

  if (text === '/irrigation') {
    msg.reply('💧 *Irrigation Advice*\n\nPlease provide:\n• Crop name\n• Soil type\n• Current season\n\nExample: Wheat, loamy, winter');
    return;
  }

  if (text.match(/\/lang (en|hi)/)) {
    const lang = text.split(' ')[1];
    whatsappUserLanguages[chatId] = lang;
    msg.reply(`✅ Language set to ${lang === 'en' ? 'English' : 'Hindi'}.`);
    return;
  }

  if (text.match(/\/subscribe (.+)/)) {
    const location = text.split(' ')[1].trim();
    userSubscriptions.whatsapp[chatId] = location;
    msg.reply(`✅ Subscribed to weather alerts for ${location}\n\nYou'll receive regular farming advice based on weather conditions.\n\n❌ To stop alerts, type /unsubscribe`);
    return;
  }

  if (text === '/unsubscribe') {
    if (userSubscriptions.whatsapp[chatId]) {
      const location = userSubscriptions.whatsapp[chatId];
      delete userSubscriptions.whatsapp[chatId];
      msg.reply(`❌ Unsubscribed from weather alerts for ${location}`);
    } else {
      msg.reply("ℹ️ You are not subscribed to any weather alerts.");
    }
    return;
  }

  // Help for unrecognized messages
  if (text && !text.startsWith('/')) {
    msg.reply(
      "🤔 I didn't understand that. Please use:\n" +
      "• /start - See all options\n" +
      "• /products - See available products\n" +
      "• soil,season,location - Get crop advice\n" +
      "• Upload image - Detect diseases\n\n" +
      "Example: loamy, Kharif, Bihar"
    );
  }
});

// ================= COMMON FUNCTIONS =================

// Enhanced image analysis with better prompts
async function analyzeImage(base64, mimeType, lang) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

  const prompt = lang === 'hi' ?
    "इस फसल की छवि में रोग का पता लगाएं और उपचार के उपाय सुझाएं। कृपया विस्तृत जानकारी दें:\n1. रोग का नाम\n2. लक्षण\n3. कारण\n4. जैविक उपचार\n5. रासायनिक उपचार\n6. रोकथाम के उपाय" :
    "Detect crop disease in this image and suggest detailed remedies. Please provide:\n1. Disease name\n2. Symptoms\n3. Causes\n4. Organic treatment\n5. Chemical treatment\n6. Prevention measures";

  const imagePart = {
    inlineData: {
      data: base64,
      mimeType: mimeType
    },
  };

  try {
    const result = await model.generateContent([prompt, imagePart]);
    return result.response.text();
  } catch (error) {
    console.error('Gemini API error:', error.message);
    return lang === 'hi' ? 
      "❌ छवि विश्लेषण में त्रुटि। कृपया एक स्पष्ट फोटो के साथ फिर से प्रयास करें।" :
      "❌ Error analyzing image. Please try again with a clearer photo.";
  }
}

// Enhanced weather alerts with unsubscribe option
async function sendWeatherAlerts() {
  console.log('🌦️ Checking weather alerts for:', userSubscriptions);
  
  for (const platform in userSubscriptions) {
    for (const [chatId, location] of Object.entries(userSubscriptions[platform])) {
      try {
        const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${process.env.WEATHER_API_KEY}&units=metric`);
        const weather = response.data;
        const condition = weather.weather[0].main;
        const temp = weather.main.temp;
        const humidity = weather.main.humidity;
        const crop = await CropRecommendation.findOne({ location });

        let alert = `🌦️ *Weather Update for ${location}*\n\n`;
        alert += `Condition: ${condition}\n`;
        alert += `Temperature: ${temp}°C\n`;
        alert += `Humidity: ${humidity}%\n\n`;

        if (crop) {
          if (condition.includes('Rain') && humidity > 80) {
            alert += `⚠️ *Advice:* Heavy rain expected. Delay sowing for ${crop.crop_hindi || crop.crop}.`;
          } else if (temp > 35 && humidity < 30) {
            alert += `⚠️ *Advice:* High temperature. Increase irrigation for ${crop.crop_hindi || crop.crop}.`;
          } else if (temp < 10) {
            alert += `⚠️ *Advice:* Low temperature. Protect ${crop.crop_hindi || crop.crop} from frost.`;
          } else {
            alert += `✅ *Advice:* Good conditions for ${crop.crop_hindi || crop.crop}.`;
          }
        }

        alert += `\n\n❌ Stop alerts: /unsubscribe`;

        if (platform === 'telegram') {
          telegramBot.sendMessage(chatId, alert, { parse_mode: "Markdown" });
        } else {
          whatsappBot.sendMessage(chatId, alert);
        }
      } catch (error) {
        console.error(`Weather API error for ${location}:`, error.message);
        const errorMsg = `❌ Invalid location: ${location}. Use /subscribe with valid location.`;
        if (platform === 'telegram') {
          telegramBot.sendMessage(chatId, errorMsg);
        } else {
          whatsappBot.sendMessage(chatId, errorMsg);
        }
      }
    }
  }
}

// Daily farming tips
async function sendDailyFarmingTips() {
  const tips = [
    "💡 Tip: Rotate your crops to maintain soil health and reduce pests.",
    "💡 Tip: Test your soil every season to optimize fertilizer use.",
    "💡 Tip: Water plants in the early morning to reduce evaporation.",
    "💡 Tip: Use organic mulch to conserve moisture and control weeds.",
    "💡 Tip: Monitor plants regularly for early signs of disease."
  ];
  
  const tip = tips[Math.floor(Math.random() * tips.length)];
  
  for (const platform in userSubscriptions) {
    for (const chatId of Object.keys(userSubscriptions[platform])) {
      if (platform === 'telegram') {
        telegramBot.sendMessage(chatId, tip);
      } else {
        whatsappBot.sendMessage(chatId, tip);
      }
    }
  }
}

// Schedule weather alerts every 2 minutes
cron.schedule('*/2 * * * *', () => {
  sendWeatherAlerts();
});

// Schedule daily farming tips at 8 AM
cron.schedule('0 8 * * *', () => {
  sendDailyFarmingTips();
});

// Initialize bots
whatsappBot.initialize().then(() => {
  console.log('🚀 WhatsApp bot initializing...');
}).catch(err => {
  console.error('❌ WhatsApp bot initialization failed:', err);
});

// Export bots
module.exports = { telegramBot, whatsappBot, sendWeatherAlerts };