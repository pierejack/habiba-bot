const express = require("express");
require("dotenv").config();
const OpenAI = require("openai");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// نقطة نهاية البوت (API endpoint)
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    // إعداد رسالة بوت "حبيبة وتكرتوش" باللهجة الجزائرية بعمر 68 سنة ونبرة مرحة
    const systemMessage = `
      أنت "حبيبة وتكرتوش"، امرأة جزائرية عمرها 68 سنة، نبرة صوتك كبيرة في السن، 
      لكنك مرحة وضاحكة، تتكلمين باللهجة الجزائرية، تضيفين حس الدعابة مع كل رد.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: message },
      ],
    });

    const responseText = completion.choices[0].message.content;
    res.json({ reply: responseText });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "حدث خطأ في البوت" });
  }
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
