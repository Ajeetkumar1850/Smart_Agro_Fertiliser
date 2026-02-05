require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/AGRO_MANAGEMENT";

const products = [
  // Fertilizers (15 products)
  { name: "NPK 19-19-19 Fertilizer", description: "Balanced NPK fertilizer for all crops", price: 850, stock_quantity: 100, category: "Fertilizers", image: { filename: "npk", url: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400" }},
  { name: "Urea Fertilizer 50kg", description: "High nitrogen content for leafy growth", price: 650, stock_quantity: 150, category: "Fertilizers", image: { filename: "urea", url: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400" }},
  { name: "DAP Fertilizer", description: "Di-Ammonium Phosphate for root development", price: 1200, stock_quantity: 80, category: "Fertilizers", image: { filename: "dap", url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400" }},
  { name: "Potash Fertilizer", description: "Potassium-rich fertilizer for fruit quality", price: 950, stock_quantity: 90, category: "Fertilizers", image: { filename: "potash", url: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400" }},
  { name: "Organic Compost 25kg", description: "100% organic compost for soil health", price: 450, stock_quantity: 200, category: "Fertilizers", image: { filename: "compost", url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400" }},
  { name: "Vermicompost Premium", description: "Earthworm compost rich in nutrients", price: 550, stock_quantity: 120, category: "Fertilizers", image: { filename: "vermi", url: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400" }},
  { name: "Calcium Nitrate", description: "Prevents blossom end rot in tomatoes", price: 780, stock_quantity: 70, category: "Fertilizers", image: { filename: "calcium", url: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400" }},
  { name: "Zinc Sulphate", description: "Micronutrient for better crop yield", price: 320, stock_quantity: 150, category: "Fertilizers", image: { filename: "zinc", url: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400" }},
  { name: "Boron Fertilizer", description: "Essential for flowering and fruiting", price: 280, stock_quantity: 100, category: "Fertilizers", image: { filename: "boron", url: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400" }},
  { name: "Magnesium Sulphate", description: "Prevents yellowing of leaves", price: 350, stock_quantity: 110, category: "Fertilizers", image: { filename: "magnesium", url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400" }},
  { name: "Sulphur 90% WDG", description: "Improves soil pH and nutrient availability", price: 420, stock_quantity: 85, category: "Fertilizers", image: { filename: "sulphur", url: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400" }},
  { name: "Humic Acid Granules", description: "Improves soil structure and water retention", price: 680, stock_quantity: 95, category: "Fertilizers", image: { filename: "humic", url: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400" }},
  { name: "Seaweed Extract", description: "Natural growth stimulant", price: 890, stock_quantity: 60, category: "Fertilizers", image: { filename: "seaweed", url: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400" }},
  { name: "Bone Meal Organic", description: "Slow-release phosphorus source", price: 520, stock_quantity: 75, category: "Fertilizers", image: { filename: "bone", url: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400" }},
  { name: "Neem Cake Fertilizer", description: "Organic fertilizer with pest repellent properties", price: 480, stock_quantity: 130, category: "Fertilizers", image: { filename: "neem", url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400" }},

  // Seeds (12 products)
  { name: "Hybrid Tomato Seeds", description: "High-yielding disease-resistant variety", price: 450, stock_quantity: 200, category: "Seeds", image: { filename: "tomato", url: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400" }},
  { name: "Wheat Seeds HD-2967", description: "Premium quality wheat seeds", price: 850, stock_quantity: 300, category: "Seeds", image: { filename: "wheat", url: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400" }},
  { name: "Paddy Seeds Basmati", description: "Aromatic basmati rice seeds", price: 1200, stock_quantity: 150, category: "Seeds", image: { filename: "paddy", url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400" }},
  { name: "Corn Seeds Hybrid", description: "Sweet corn hybrid variety", price: 680, stock_quantity: 180, category: "Seeds", image: { filename: "corn", url: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400" }},
  { name: "Cabbage Seeds", description: "Round head cabbage variety", price: 320, stock_quantity: 250, category: "Seeds", image: { filename: "cabbage", url: "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=400" }},
  { name: "Carrot Seeds Nantes", description: "Sweet and crunchy carrot variety", price: 280, stock_quantity: 220, category: "Seeds", image: { filename: "carrot", url: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400" }},
  { name: "Cucumber Seeds", description: "Long green cucumber variety", price: 350, stock_quantity: 190, category: "Seeds", image: { filename: "cucumber", url: "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=400" }},
  { name: "Chilli Seeds Hot", description: "Spicy red chilli variety", price: 420, stock_quantity: 160, category: "Seeds", image: { filename: "chilli", url: "https://images.unsplash.com/photo-1583663848850-46af132dc08e?w=400" }},
  { name: "Onion Seeds Red", description: "Red onion bulb variety", price: 550, stock_quantity: 140, category: "Seeds", image: { filename: "onion", url: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400" }},
  { name: "Spinach Seeds", description: "Leafy green spinach variety", price: 220, stock_quantity: 280, category: "Seeds", image: { filename: "spinach", url: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400" }},
  { name: "Sunflower Seeds", description: "Oil-rich sunflower variety", price: 780, stock_quantity: 120, category: "Seeds", image: { filename: "sunflower", url: "https://images.unsplash.com/photo-1597848212624-e530bb5f0e00?w=400" }},
  { name: "Mustard Seeds Yellow", description: "High oil content mustard", price: 650, stock_quantity: 170, category: "Seeds", image: { filename: "mustard", url: "https://images.unsplash.com/photo-1599909533730-f9e0f8a4e3c8?w=400" }},

  // Pesticides (10 products)
  { name: "Neem Oil Pesticide", description: "Organic pest control solution", price: 380, stock_quantity: 150, category: "Pesticides", image: { filename: "neem-oil", url: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400" }},
  { name: "Cypermethrin 10% EC", description: "Broad-spectrum insecticide", price: 520, stock_quantity: 100, category: "Pesticides", image: { filename: "cyper", url: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400" }},
  { name: "Chlorpyrifos 20% EC", description: "Effective against soil insects", price: 680, stock_quantity: 90, category: "Pesticides", image: { filename: "chlor", url: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400" }},
  { name: "Imidacloprid 17.8% SL", description: "Systemic insecticide for sucking pests", price: 750, stock_quantity: 85, category: "Pesticides", image: { filename: "imida", url: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400" }},
  { name: "Mancozeb 75% WP", description: "Fungicide for leaf diseases", price: 420, stock_quantity: 120, category: "Pesticides", image: { filename: "manco", url: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400" }},
  { name: "Glyphosate 41% SL", description: "Non-selective herbicide", price: 580, stock_quantity: 110, category: "Pesticides", image: { filename: "glyph", url: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400" }},
  { name: "2,4-D Herbicide", description: "Selective weed killer", price: 450, stock_quantity: 95, category: "Pesticides", image: { filename: "24d", url: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400" }},
  { name: "Carbendazim 50% WP", description: "Systemic fungicide", price: 620, stock_quantity: 80, category: "Pesticides", image: { filename: "carben", url: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400" }},
  { name: "Profenofos 50% EC", description: "Contact and stomach insecticide", price: 890, stock_quantity: 70, category: "Pesticides", image: { filename: "profen", url: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400" }},
  { name: "Bacillus Thuringiensis", description: "Biological insecticide", price: 720, stock_quantity: 100, category: "Pesticides", image: { filename: "bt", url: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400" }},

  // Tools (8 products)
  { name: "Garden Spade Heavy Duty", description: "Steel spade for digging", price: 450, stock_quantity: 80, category: "Tools", image: { filename: "spade", url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400" }},
  { name: "Pruning Shears Professional", description: "Sharp pruning scissors", price: 680, stock_quantity: 60, category: "Tools", image: { filename: "shears", url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400" }},
  { name: "Garden Hoe", description: "Weeding and soil preparation tool", price: 320, stock_quantity: 90, category: "Tools", image: { filename: "hoe", url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400" }},
  { name: "Watering Can 10L", description: "Plastic watering can", price: 280, stock_quantity: 120, category: "Tools", image: { filename: "water", url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400" }},
  { name: "Garden Rake", description: "Metal rake for leveling soil", price: 380, stock_quantity: 75, category: "Tools", image: { filename: "rake", url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400" }},
  { name: "Hand Trowel Set", description: "3-piece gardening tool set", price: 520, stock_quantity: 100, category: "Tools", image: { filename: "trowel", url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400" }},
  { name: "Sprayer 16L Manual", description: "Backpack sprayer for pesticides", price: 1200, stock_quantity: 45, category: "Tools", image: { filename: "sprayer", url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400" }},
  { name: "Garden Gloves Pair", description: "Protective gardening gloves", price: 180, stock_quantity: 200, category: "Tools", image: { filename: "gloves", url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400" }},

  // Organic Products (5 products)
  { name: "Organic Pesticide Spray", description: "100% natural pest control", price: 580, stock_quantity: 90, category: "Organic", image: { filename: "org-pest", url: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400" }},
  { name: "Bio Fertilizer Liquid", description: "Microbial fertilizer for soil health", price: 720, stock_quantity: 70, category: "Organic", image: { filename: "bio-fert", url: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400" }},
  { name: "Organic Growth Booster", description: "Natural plant growth promoter", price: 650, stock_quantity: 85, category: "Organic", image: { filename: "growth", url: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400" }},
  { name: "Cow Dung Manure", description: "Organic manure 25kg bag", price: 350, stock_quantity: 150, category: "Organic", image: { filename: "cow-dung", url: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400" }},
  { name: "Panchagavya Organic", description: "Traditional organic tonic", price: 480, stock_quantity: 110, category: "Organic", image: { filename: "pancha", url: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400" }}
];

async function addProducts() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('Connected to MongoDB');
    
    // Clear existing products (optional)
    // await Product.deleteMany({});
    // console.log('Cleared existing products');
    
    // Add new products
    await Product.insertMany(products);
    console.log(`✅ Successfully added ${products.length} products!`);
    
    mongoose.connection.close();
  } catch (err) {
    console.error('Error:', err);
    mongoose.connection.close();
  }
}

addProducts();
