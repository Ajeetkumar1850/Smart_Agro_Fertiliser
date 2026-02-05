const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Generate Invoice PDF
const generateInvoicePDF = async (orderData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      
      // Create temp directory if it doesn't exist
      const tempDir = path.join(__dirname, '../temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      
      const fileName = `invoice-${orderData.billNumber}.pdf`;
      const filePath = path.join(tempDir, fileName);
      const writeStream = fs.createWriteStream(filePath);
      
      doc.pipe(writeStream);
      
      // Header with green background
      doc.rect(0, 0, doc.page.width, 150).fill('#2e7d32');
      
      // Company name
      doc.fillColor('#ffffff')
         .fontSize(28)
         .font('Helvetica-Bold')
         .text('AgroConnect Pro', 50, 40);
      
      doc.fontSize(12)
         .font('Helvetica')
         .text('Complete Farm Management Platform', 50, 75);
      
      doc.fontSize(10)
         .text('Sasaram, Bihar, India', 50, 95)
         .text('Phone: +91 98765 43210', 50, 110)
         .text('Email: support@agroconnect.pro', 50, 125);
      
      // Invoice title
      doc.fillColor('#000000')
         .fontSize(24)
         .font('Helvetica-Bold')
         .text('INVOICE', 400, 60);
      
      // Bill number and date
      doc.fontSize(10)
         .font('Helvetica')
         .text(`Bill No: ${orderData.billNumber}`, 400, 95)
         .text(`Date: ${orderData.billDate}`, 400, 110);
      
      // Customer details
      doc.fontSize(14)
         .font('Helvetica-Bold')
         .text('Bill To:', 50, 180);
      
      doc.fontSize(11)
         .font('Helvetica')
         .text(orderData.customerName, 50, 205)
         .text(orderData.customerEmail, 50, 220)
         .text(orderData.phoneNumber, 50, 235)
         .text(orderData.deliveryAddress, 50, 250, { width: 250 });
      
      // Order details
      doc.fontSize(14)
         .font('Helvetica-Bold')
         .text('Order Details:', 50, 310);
      
      doc.fontSize(10)
         .font('Helvetica')
         .text(`Order ID: ${orderData.orderId}`, 50, 335)
         .text(`Order Date: ${orderData.orderDate}`, 50, 350)
         .text(`Status: ${orderData.status}`, 50, 365);
      
      // Table header
      const tableTop = 410;
      doc.fontSize(11)
         .font('Helvetica-Bold');
      
      doc.text('Product', 50, tableTop);
      doc.text('Quantity', 280, tableTop);
      doc.text('Price', 380, tableTop);
      doc.text('Amount', 480, tableTop);
      
      // Line under header
      doc.moveTo(50, tableTop + 20)
         .lineTo(550, tableTop + 20)
         .stroke();
      
      // Product details
      const itemY = tableTop + 35;
      doc.fontSize(10)
         .font('Helvetica');
      
      doc.text(orderData.productName, 50, itemY, { width: 200 });
      doc.text(orderData.quantity.toString(), 280, itemY);
      doc.text(`₹${orderData.productPrice}`, 380, itemY);
      doc.text(`₹${orderData.totalAmount}`, 480, itemY);
      
      // Line after item
      doc.moveTo(50, itemY + 25)
         .lineTo(550, itemY + 25)
         .stroke();
      
      // Total section
      const totalY = itemY + 50;
      doc.fontSize(12)
         .font('Helvetica-Bold');
      
      doc.text('Subtotal:', 380, totalY);
      doc.text(`₹${orderData.totalAmount}`, 480, totalY);
      
      doc.text('Tax (0%):', 380, totalY + 20);
      doc.text('₹0', 480, totalY + 20);
      
      // Grand total with background
      doc.rect(370, totalY + 45, 180, 30).fill('#2e7d32');
      doc.fillColor('#ffffff')
         .fontSize(14)
         .text('Grand Total:', 380, totalY + 52);
      doc.text(`₹${orderData.totalAmount}`, 480, totalY + 52);
      
      // Footer
      doc.fillColor('#666666')
         .fontSize(9)
         .font('Helvetica')
         .text('Thank you for your business!', 50, 700, { align: 'center', width: 500 });
      
      doc.fontSize(8)
         .text('This is a computer-generated invoice and does not require a signature.', 50, 720, { 
           align: 'center', 
           width: 500 
         });
      
      doc.text('For any queries, contact us at support@agroconnect.pro or +91 98765 43210', 50, 735, { 
        align: 'center', 
        width: 500 
      });
      
      // Finalize PDF
      doc.end();
      
      writeStream.on('finish', () => {
        resolve(filePath);
      });
      
      writeStream.on('error', (err) => {
        reject(err);
      });
      
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  generateInvoicePDF
};
