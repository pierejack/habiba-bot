import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/", (req, res) => {
  res.send("بوت حبيبة وتكرتوش جاهز!");
});

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "يجب إرسال رسالة للبوت" });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "أنت حبيبة وتكرتوش، امرأة جزائرية كبيرة في السن، 68 سنة، تتحدث باللهجة الجزائرية، دمها خفيف، تحب الدعابة والشصحات، طريفة ومضحكة.",
        },
        { role: "user", content: message },
      ],
    });

    const botReply = response.choices[0].message.content;

    res.json({ reply: botReply });
  } catch (error) {
    console.error("Error from OpenAI:", error);
    res.status(500).json({ error: "حدث خطأ في الاتصال بالبوت" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`السيرفر شغال على المنفذ ${PORT}`);
});
