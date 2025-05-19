
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

app.get('/', (req, res) => {
  res.send("Habiba bot is working!");
});

app.post('/', async (req, res) => {
  const text = req.body.text;

  try {
    const response = await axios({
      method: 'POST',
      url: 'https://api.elevenlabs.io/v1/text-to-speech/OfGMGmhShO8iL9jCkXy8',
      headers: {
        'xi-api-key': 'sk_4ac876ab92b603c607fbbae66fa052f4be74ae685812e859',
        'Content-Type': 'application/json'
      },
      data: {
        text: text,
        voice_settings: { stability: 0.5, similarity_boost: 0.75 }
      },
      responseType: 'arraybuffer'
    });

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Disposition': 'inline; filename="output.mp3"'
    });

    res.send(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send('Error generating speech.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
