const { createTransporter } = require('../config/email');
const fs = require('fs');

// Send Order Confirmation Email
const sendOrderConfirmationEmail = async (orderData) => {
  try {
    const transporter = createTransporter();
    
    // If email not configured, skip silently
    if (!transporter) {
      console.log('📧 Email not configured - skipping order confirmation email');
      return { success: false, message: 'Email not configured' };
    }

    const { 
      customerEmail, 
      customerName, 
      orderId, 
      productName, 
      quantity, 
      productPrice, 
      totalAmount, 
      deliveryAddress, 
      phoneNumber,
      orderDate 
    } = orderData;

    const mailOptions = {
      from: `"AgroConnect Pro" <${process.env.EMAIL_USER}>`,
      to: customerEmail,
      subject: `Order Confirmation - ${orderId}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 0;
            }
            .email-container {
              background-color: #f5f5f5;
              padding: 20px;
            }
            .email-header {
              background: linear-gradient(135deg, #2e7d32, #1b5e20);
              color: white;
              padding: 30px 20px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .email-header h1 {
              margin: 0;
              font-size: 28px;
            }
            .email-header p {
              margin: 10px 0 0 0;
              font-size: 16px;
              opacity: 0.9;
            }
            .email-body {
              background: white;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .order-info {
              background: #f9f9f9;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
              border-left: 4px solid #2e7d32;
            }
            .order-info h2 {
              color: #2e7d32;
              margin-top: 0;
              font-size: 20px;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              padding: 10px 0;
              border-bottom: 1px solid #eee;
            }
            .info-row:last-child {
              border-bottom: none;
            }
            .info-label {
              font-weight: 600;
              color: #666;
            }
            .info-value {
              color: #333;
              text-align: right;
            }
            .total-amount {
              background: #2e7d32;
              color: white;
              padding: 15px;
              border-radius: 8px;
              text-align: center;
              font-size: 24px;
              font-weight: bold;
              margin: 20px 0;
            }
            .status-badge {
              display: inline-block;
              background: #fff3e0;
              color: #f57c00;
              padding: 8px 16px;
              border-radius: 20px;
              font-weight: 600;
              font-size: 14px;
            }
            .delivery-info {
              background: #e8f5e9;
              padding: 15px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .delivery-info h3 {
              color: #2e7d32;
              margin-top: 0;
              font-size: 16px;
            }
            .footer {
              text-align: center;
              padding: 20px;
              color: #666;
              font-size: 14px;
            }
            .footer a {
              color: #2e7d32;
              text-decoration: none;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #2e7d32, #1b5e20);
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 25px;
              font-weight: 600;
              margin: 20px 0;
            }
            .icon {
              font-size: 48px;
              margin-bottom: 10px;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="email-header">
              <div class="icon">🌾</div>
              <h1>Order Confirmed!</h1>
              <p>Thank you for your order, ${customerName}</p>
            </div>
            
            <div class="email-body">
              <p>Hi <strong>${customerName}</strong>,</p>
              <p>We've received your order and it's being processed. Here are your order details:</p>
              
              <div class="order-info">
                <h2>Order Details</h2>
                <div class="info-row">
                  <span class="info-label">Order ID:</span>
                  <span class="info-value"><strong>${orderId}</strong></span>
                </div>
                <div class="info-row">
                  <span class="info-label">Order Date:</span>
                  <span class="info-value">${orderDate}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Status:</span>
                  <span class="info-value"><span class="status-badge">⏳ Pending Approval</span></span>
                </div>
              </div>

              <div class="order-info">
                <h2>Product Information</h2>
                <div class="info-row">
                  <span class="info-label">Product:</span>
                  <span class="info-value">${productName}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Quantity:</span>
                  <span class="info-value">${quantity} units</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Price per unit:</span>
                  <span class="info-value">₹${productPrice}</span>
                </div>
              </div>

              <div class="total-amount">
                Total Amount: ₹${totalAmount}
              </div>

              <div class="delivery-info">
                <h3>📍 Delivery Address</h3>
                <p style="margin: 5px 0;">${deliveryAddress}</p>
                <p style="margin: 5px 0;"><strong>Contact:</strong> ${phoneNumber}</p>
              </div>

              <p><strong>What's Next?</strong></p>
              <ul>
                <li>Our team will review your order</li>
                <li>You'll receive an email once your order is approved</li>
                <li>We'll process and ship your order promptly</li>
                <li>Track your order status in your dashboard</li>
              </ul>

              <div style="text-align: center;">
                <a href="https://agroconnectpro.vercel.app/orders/user/my-orders" class="button">
                  View My Orders
                </a>
              </div>

              <p style="margin-top: 30px;">If you have any questions, feel free to contact us at <a href="mailto:support@agroconnect.pro">support@agroconnect.pro</a> or call us at +91 98765 43210.</p>
              
              <p>Thank you for choosing AgroConnect Pro!</p>
              <p><strong>Team AgroConnect Pro</strong></p>
            </div>

            <div class="footer">
              <p>© 2025 AgroConnect Pro. All Rights Reserved.</p>
              <p>Sasaram, Bihar, India</p>
              <p>
                <a href="https://agroconnectpro.vercel.app">Visit Website</a> | 
                <a href="mailto:support@agroconnect.pro">Contact Support</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Order confirmation email sent:', info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendOrderConfirmationEmail
};


// Send Bill/Invoice Email with PDF attachment
const sendBillEmail = async (billData, pdfPath) => {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      console.log('📧 Email not configured - skipping bill email');
      return { success: false, message: 'Email not configured' };
    }

    const { 
      customerEmail, 
      customerName, 
      billNumber,
      orderId,
      productName,
      quantity,
      totalAmount,
      billDate
    } = billData;

    const mailOptions = {
      from: `"AgroConnect Pro" <${process.env.EMAIL_USER}>`,
      to: customerEmail,
      subject: `Invoice ${billNumber} - AgroConnect Pro`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
            }
            .email-container {
              background-color: #f5f5f5;
              padding: 20px;
            }
            .email-header {
              background: linear-gradient(135deg, #2e7d32, #1b5e20);
              color: white;
              padding: 30px 20px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .email-body {
              background: white;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .bill-info {
              background: #f9f9f9;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
              border-left: 4px solid #2e7d32;
            }
            .total-amount {
              background: #2e7d32;
              color: white;
              padding: 15px;
              border-radius: 8px;
              text-align: center;
              font-size: 24px;
              font-weight: bold;
              margin: 20px 0;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #2e7d32, #1b5e20);
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 25px;
              font-weight: 600;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              padding: 20px;
              color: #666;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="email-header">
              <h1>📄 Invoice Generated</h1>
              <p>Your order has been completed</p>
            </div>
            
            <div class="email-body">
              <p>Hi <strong>${customerName}</strong>,</p>
              <p>Your order has been completed and the invoice has been generated. Please find the invoice attached to this email.</p>
              
              <div class="bill-info">
                <h2 style="color: #2e7d32; margin-top: 0;">Invoice Details</h2>
                <p><strong>Invoice Number:</strong> ${billNumber}</p>
                <p><strong>Invoice Date:</strong> ${billDate}</p>
                <p><strong>Order ID:</strong> ${orderId}</p>
              </div>

              <div class="bill-info">
                <h3 style="color: #2e7d32; margin-top: 0;">Order Summary</h3>
                <p><strong>Product:</strong> ${productName}</p>
                <p><strong>Quantity:</strong> ${quantity} units</p>
              </div>

              <div class="total-amount">
                Total Amount: ₹${totalAmount}
              </div>

              <p><strong>📎 Invoice PDF is attached to this email</strong></p>
              
              <p>Please keep this invoice for your records. If you have any questions about this invoice, please contact us.</p>

              <div style="text-align: center;">
                <a href="https://agroconnectpro.vercel.app/orders/user/my-orders" class="button">
                  View My Orders
                </a>
              </div>

              <p style="margin-top: 30px;">Thank you for your business!</p>
              <p><strong>Team AgroConnect Pro</strong></p>
            </div>

            <div class="footer">
              <p>© 2025 AgroConnect Pro. All Rights Reserved.</p>
              <p>Sasaram, Bihar, India</p>
              <p>support@agroconnect.pro | +91 98765 43210</p>
            </div>
          </div>
        </body>
        </html>
      `,
      attachments: [
        {
          filename: `Invoice-${billNumber}.pdf`,
          path: pdfPath
        }
      ]
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Bill email sent:', info.messageId);
    
    // Delete PDF file after sending
    try {
      fs.unlinkSync(pdfPath);
      console.log('🗑️ Temporary PDF deleted');
    } catch (err) {
      console.error('Error deleting temp PDF:', err);
    }
    
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('❌ Error sending bill email:', error);
    return { success: false, error: error.message };
  }
};

// Send Password Reset Email
const sendPasswordResetEmail = async (userData, resetToken) => {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      console.log('📧 Email not configured - skipping password reset email');
      return { success: false, message: 'Email not configured' };
    }

    const { email, displayName } = userData;
    const resetLink = `https://agroconnectpro.vercel.app/auth/reset-password/${resetToken}`;

    const mailOptions = {
      from: `"AgroConnect Pro" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request - AgroConnect Pro',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
            }
            .email-container {
              background-color: #f5f5f5;
              padding: 20px;
            }
            .email-header {
              background: linear-gradient(135deg, #2e7d32, #1b5e20);
              color: white;
              padding: 30px 20px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .email-body {
              background: white;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .warning-box {
              background: #fff3e0;
              border-left: 4px solid #f57c00;
              padding: 15px;
              margin: 20px 0;
              border-radius: 5px;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #2e7d32, #1b5e20);
              color: white;
              padding: 15px 40px;
              text-decoration: none;
              border-radius: 25px;
              font-weight: 600;
              font-size: 16px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              padding: 20px;
              color: #666;
              font-size: 14px;
            }
            .security-note {
              background: #e8f5e9;
              padding: 15px;
              border-radius: 8px;
              margin: 20px 0;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="email-header">
              <div style="font-size: 48px; margin-bottom: 10px;">🔐</div>
              <h1>Password Reset Request</h1>
            </div>
            
            <div class="email-body">
              <p>Hi <strong>${displayName}</strong>,</p>
              <p>We received a request to reset your password for your AgroConnect Pro account.</p>
              
              <p>Click the button below to reset your password:</p>

              <div style="text-align: center;">
                <a href="${resetLink}" class="button">
                  Reset Password
                </a>
              </div>

              <p style="font-size: 14px; color: #666;">Or copy and paste this link into your browser:</p>
              <p style="font-size: 12px; word-break: break-all; background: #f5f5f5; padding: 10px; border-radius: 5px;">
                ${resetLink}
              </p>

              <div class="warning-box">
                <p style="margin: 0;"><strong>⚠️ Important:</strong></p>
                <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                  <li>This link will expire in <strong>1 hour</strong></li>
                  <li>If you didn't request this, please ignore this email</li>
                  <li>Your password won't change until you create a new one</li>
                </ul>
              </div>

              <div class="security-note">
                <p style="margin: 0;"><strong>🛡️ Security Tips:</strong></p>
                <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                  <li>Never share your password with anyone</li>
                  <li>Use a strong, unique password</li>
                  <li>Don't use the same password across multiple sites</li>
                </ul>
              </div>

              <p>If you didn't request a password reset, please contact us immediately at <a href="mailto:support@agroconnect.pro">support@agroconnect.pro</a></p>
              
              <p style="margin-top: 30px;">Best regards,<br><strong>Team AgroConnect Pro</strong></p>
            </div>

            <div class="footer">
              <p>© 2025 AgroConnect Pro. All Rights Reserved.</p>
              <p>Sasaram, Bihar, India</p>
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent:', info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendOrderConfirmationEmail,
  sendBillEmail,
  sendPasswordResetEmail
};
