const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth');
const { sendOrderConfirmationEmail, sendBillEmail } = require('../services/emailService');
const { generateInvoicePDF } = require('../services/pdfService');

// User: Place order (any authenticated customer can place order)
router.post('/place', ensureAuthenticated, async (req, res) => {
  try {
    const { productId, quantity, deliveryAddress, phoneNumber, notes } = req.body;
    
    const product = await Product.findById(productId);
    if (!product) {
      req.flash('error', 'Product not found');
      return res.redirect('/user/products');
    }
    
    // Check stock
    if (product.stock_quantity < quantity) {
      req.flash('error', 'Insufficient stock');
      return res.redirect('/user/products');
    }
    
    const totalAmount = product.price * quantity;
    
    // Create or update customer record
    try {
      const existingCustomer = await Customer.findOne({ email: req.user.email });
      
      if (existingCustomer) {
        // Update existing customer with latest info
        existingCustomer.name = req.user.displayName;
        existingCustomer.phone = phoneNumber;
        existingCustomer.address = deliveryAddress;
        await existingCustomer.save();
      } else {
        // Create new customer
        const newCustomer = new Customer({
          name: req.user.displayName,
          phone: phoneNumber,
          email: req.user.email,
          address: deliveryAddress
        });
        await newCustomer.save();
      }
    } catch (customerErr) {
      // If customer creation fails (e.g., duplicate phone), just log and continue
      console.log('Customer record update skipped:', customerErr.message);
    }
    
    // Create order
    const order = new Order({
      user: req.user._id,
      userName: req.user.displayName,
      userEmail: req.user.email,
      product: product._id,
      productName: product.name,
      productPrice: product.price,
      quantity: parseInt(quantity),
      totalAmount,
      deliveryAddress,
      phoneNumber,
      notes
    });
    
    await order.save();
    
    // Send order confirmation email
    const emailData = {
      customerEmail: req.user.email,
      customerName: req.user.displayName,
      orderId: `#${order._id.toString().slice(-8).toUpperCase()}`,
      productName: product.name,
      quantity: parseInt(quantity),
      productPrice: product.price,
      totalAmount: totalAmount,
      deliveryAddress: deliveryAddress,
      phoneNumber: phoneNumber,
      orderDate: new Date(order.createdAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    };
    
    // Send email (non-blocking - don't wait for it)
    sendOrderConfirmationEmail(emailData).catch(err => {
      console.error('Email sending failed:', err);
    });
    
    req.flash('success', 'Order placed successfully! Check your email for confirmation.');
    res.redirect('/orders/user/my-orders');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error placing order');
    res.redirect('/user/products');
  }
});

// User: View own orders (any authenticated customer can view their orders)
router.get('/user/my-orders', ensureAuthenticated, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('product')
      .sort({ createdAt: -1 });
    res.render('user/orders', { orders, user: req.user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching orders');
  }
});

// Admin: View all orders
router.get('/admin/all', ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('product')
      .populate('user')
      .sort({ createdAt: -1 });
    res.render('admin/orders', { orders, user: req.user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching orders');
  }
});

// Admin: Approve order
router.post('/admin/approve/:id', ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('product');
    if (!order) {
      return res.status(404).send('Order not found');
    }
    
    // Update stock
    const product = await Product.findById(order.product._id);
    if (product.stock_quantity >= order.quantity) {
      product.stock_quantity -= order.quantity;
      await product.save();
    }
    
    order.status = 'approved';
    await order.save();
    
    res.redirect('/orders/admin/all');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error approving order');
  }
});

// Admin: Reject order
router.post('/admin/reject/:id', ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    await Order.findByIdAndUpdate(req.params.id, { status: 'rejected' });
    res.redirect('/orders/admin/all');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error rejecting order');
  }
});

// Admin: Generate bill
router.post('/admin/generate-bill/:id', ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user');
    if (!order) {
      return res.status(404).send('Order not found');
    }
    
    const billNumber = `BILL-${Date.now()}-${order._id.toString().slice(-6).toUpperCase()}`;
    order.billGenerated = true;
    order.billNumber = billNumber;
    order.status = 'completed';
    await order.save();
    
    // Generate PDF
    const pdfData = {
      billNumber: billNumber,
      billDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      orderId: `#${order._id.toString().slice(-8).toUpperCase()}`,
      orderDate: new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      customerName: order.userName,
      customerEmail: order.userEmail,
      phoneNumber: order.phoneNumber,
      deliveryAddress: order.deliveryAddress,
      productName: order.productName,
      quantity: order.quantity,
      productPrice: order.productPrice,
      totalAmount: order.totalAmount,
      status: 'Completed'
    };
    
    const pdfPath = await generateInvoicePDF(pdfData);
    
    // Send email with PDF attachment
    const emailData = {
      customerEmail: order.userEmail,
      customerName: order.userName,
      billNumber: billNumber,
      orderId: `#${order._id.toString().slice(-8).toUpperCase()}`,
      productName: order.productName,
      quantity: order.quantity,
      totalAmount: order.totalAmount,
      billDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    };
    
    // Send email (non-blocking)
    sendBillEmail(emailData, pdfPath).catch(err => {
      console.error('Email sending failed:', err);
    });
    
    res.redirect(`/orders/admin/bill/${order._id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error generating bill');
  }
});

// Admin: View bill
router.get('/admin/bill/:id', ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('product');
    if (!order) {
      return res.status(404).send('Order not found');
    }
    res.render('admin/bill', { order, user: req.user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching bill');
  }
});

module.exports = router;
