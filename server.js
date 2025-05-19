require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const rateLimit = require('express-rate-limit');

const app = express();
const port = process.env.PORT || 3000;
const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY;

// Rate limiting to prevent API abuse
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Too many requests, please try again later'
});

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(limiter);

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).send("Habiba bot is working properly!");
});

// Text-to-speech endpoint
app.post('/tts', async (req, res) => {
  try {
    // Validate API key
    if (!elevenLabsApiKey) {
      throw new Error('ElevenLabs API key is not configured');
    }

    // Validate input
    const { text } = req.body;
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text is required and must be a non-empty string' });
    }

    // Call ElevenLabs API
    const response = await axios({
      method: 'POST',
      url: 'https://api.elevenlabs.io/v1/text-to-speech/OfGMGmhShO8iL9jCkXy8',
      headers: {
        'xi-api-key': elevenLabsApiKey,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg',
        'User-Agent': 'HabibaBot/1.0'
      },
      data: {
        text: text,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      },
      responseType: 'arraybuffer',
      timeout: 10000 // 10 seconds timeout
    });

    // Send audio response
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Disposition': 'inline; filename="habiba-response.mp3"'
    });
    res.status(200).send(response.data);

  } catch (error) {
    console.error('Error:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });

    const statusCode = error.response?.status || 500;
    const errorMessage = error.response?.data?.detail?.message || error.message || 'An error occurred';

    res.status(statusCode).json({
      error: errorMessage,
      details: statusCode === 401 ? 'Check your ElevenLabs API key' : undefined
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`ElevenLabs API Key: ${elevenLabsApiKey ? '***configured***' : 'NOT configured!'}`);
});