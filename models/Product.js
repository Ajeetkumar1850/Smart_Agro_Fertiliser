const mongoose = require('mongoose');
// Product Schema for Agro Management System
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    filename: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  },
  price: {
    type: Number,
    required: true
  },
  stock_quantity: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    default: 'General'
  }
}, {
    timestamps: true
    
});

module.exports = mongoose.model('Product', productSchema);