require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;
const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

// Health check endpoint
app.get('/', (req, res) => {
  res.send("Habiba bot is working properly!");
});

// Text-to-speech endpoint
app.post('/tts', async (req, res) => {
  try {
    // Validate API key
    if (!elevenLabsApiKey) {
      throw new Error('ElevenLabs API key is missing');
    }

    // Validate input
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required and must be a string' });
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
      responseType: 'arraybuffer'
    });

    // Send audio response
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Disposition': 'inline; filename="response.mp3"'
    });
    res.send(response.data);

  } catch (error) {
    console.error('Error:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });

    const statusCode = error.response?.status || 500;
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred';

    res.status(statusCode).json({
      error: errorMessage,
      details: error.response?.data?.details
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`ElevenLabs API Key: ${elevenLabsApiKey ? '***configured***' : 'NOT configured!'}`);
});