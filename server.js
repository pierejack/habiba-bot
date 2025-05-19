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
  max: 15,
  message: 'Too many requests, please try again later'
});

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(limiter);

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ status: 'running', message: 'Habiba bot is ready' });
});

// TTS endpoint
app.post('/tts', async (req, res) => {
  try {
    // Validate API key
    if (!elevenLabsApiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Validate input
    const { text } = req.body;
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text is required and must be a valid string' });
    }

    // Call ElevenLabs API
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
      timeout: 15000
    });

    // Send audio response
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Disposition': 'inline; filename="habiba-response.mp3"'
    });
    res.status(200).send(response.data);

  } catch (error) {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data
    });

    const statusCode = error.response?.status || 500;
    let errorMessage = 'Error processing your request';

    if (statusCode === 401) {
      errorMessage = 'Invalid API key - check your ElevenLabs configuration';
    } else if (statusCode === 429) {
      errorMessage = 'Too many requests - please wait and try again';
    }

    res.status(statusCode).json({
      error: errorMessage,
      details: error.response?.data?.message || error.message
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`ElevenLabs API Key: ${elevenLabsApiKey ? '***configured***' : 'NOT configured!'}`);
});