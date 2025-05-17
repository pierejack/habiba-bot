const express = require("express");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

app.post("/ask", async (req, res) => {
  const message = req.body.message;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "أنت حبيبة وتكرتوش، امرأة جزائرية عمرها 68 سنة، تتكلم باللهجة الجزائرية، عندها حس الدعابة وتضحك بزاف، ترد بطريقة شبابية وكبار السن، استعمل كلمات جزائرية دارجة.",
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.9,
    });

    res.json({ reply: completion.data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
