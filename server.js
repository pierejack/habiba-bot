const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/speak', async (req, res) => {
  const { text } = req.body;
  try {
    const response = await axios.post(
      'https://api.elevenlabs.io/v1/text-to-speech/habiba',
      {
        text,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      },
      {
        headers: {
          'xi-api-key': 'sk_4ac876ab92b603c607fbbae66fa052f4be74ae685812e859',
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      }
    );
    res.set('Content-Type', 'audio/mpeg');
    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating speech');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
