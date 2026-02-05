const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/ask', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Create agriculture-focused prompt
    const prompt = `You are an agricultural expert assistant for AgroConnect Pro. Answer the following agriculture-related question in a helpful, concise manner (max 150 words). If the question is not related to agriculture, farming, crops, fertilizers, pesticides, or agricultural business, politely redirect the user to ask agriculture-related questions.

Question: ${message}

Answer:`;

    // Generate response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ 
      success: true, 
      response: text 
    });

  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ 
      error: 'Failed to get response',
      message: error.message 
    });
  }
});

module.exports = router;
