require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/AGRO_MANAGEMENT";

const newProducts = [
  {
    name: "Premium Vermicompost",
    description: "100% organic vermicompost rich in nutrients. Improves soil structure and water retention. Perfect for all crops.",
    image: {
      filename: "vermicompost",
      url: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500"
    },
    price: 450,
    stock_quantity: 200,
    category: "Organic Products"
  },
  {
    name: "Drip Irrigation Kit",
    description: "Complete drip irrigation system for 1 acre. Saves 60% water. Easy installation with all accessories included.",
    image: {
      filename: "drip-irrigation",
      url: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=500"
    },
    price: 8500,
    stock_quantity: 25,
    category: "Tools"
  },
  {
    name: "Hybrid Tomato Seeds F1",
    description: "High yielding hybrid tomato seeds. Disease resistant variety. Suitable for all seasons with excellent fruit quality.",
    image: {
      filename: "tomato-seeds",
      url: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=500"
    },
    price: 850,
    stock_quantity: 150,
    category: "Seeds"
  },
  {
    name: "Calcium Nitrate Fertilizer",
    description: "Water soluble calcium nitrate. Prevents blossom end rot. Ideal for vegetables and fruits. 25kg bag.",
    image: {
      filename: "calcium-nitrate",
      url: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=500"
    },
    price: 1200,
    stock_quantity: 80,
    category: "Fertilizers"
  },
  {
    name: "Organic Neem Cake Powder",
    description: "Pure neem cake powder. Natural pest repellent and soil conditioner. Enriches soil with organic matter. 10kg pack.",
    image: {
      filename: "neem-cake",
      url: "https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=500"
    },
    price: 650,
    stock_quantity: 120,
    category: "Organic Products"
  }
];

async function addProducts() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('✅ Connected to MongoDB');

    // Insert products
    const result = await Product.insertMany(newProducts);
    console.log(`✅ Successfully added ${result.length} products!`);
    
    // Display added products
    result.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - ₹${product.price} (Stock: ${product.stock_quantity})`);
    });

    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addProducts();
