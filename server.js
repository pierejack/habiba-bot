require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const rateLimit = require('express-rate-limit');

const app = express();
const port = process.env.PORT || 3000;
const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY;

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: 'Too many requests, please try again later'
});

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(limiter);

// Routes
app.get('/', (req, res) => {
  res.status(200).send("Habiba bot is working!");
});

app.post('/tts', async (req, res) => {
  try {
    if (!elevenLabsApiKey) {
      throw new Error('API key not configured');
    }

    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }

    const response = await axios({
      method: 'POST',
      url: 'https://api.elevenlabs.io/v1/text-to-speech/OfGMGmhShO8iL9jCkXy8',
      headers: {
        'xi-api-key': elevenLabsApiKey,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg'
      },
      data: {
        text: text,
        voice_settings: { 
          stability: 0.5, 
          similarity_boost: 0.75 
        }
      },
      responseType: 'arraybuffer',
      timeout: 10000
    });

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Disposition': 'inline; filename="response.mp3"'
    });
    res.status(200).send(response.data);

  } catch (error) {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data
    });
    
    const statusCode = error.response?.status || 500;
    const errorMessage = error.response?.data?.message || error.message;
    
    res.status(statusCode).json({ 
      error: errorMessage,
      details: statusCode === 401 ? 'Check your API key' : undefined
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});