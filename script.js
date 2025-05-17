const chat = document.getElementById('chat');
const input = document.getElementById('userInput');

const API_KEY = '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';

function appendMessage(text, sender) {
  const div = document.createElement('div');
  div.className = `message ${sender}`;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

async function sendMessage() {
  const userMessage = input.value;
  if (!userMessage) return;

  appendMessage("👤: " + userMessage, "user");
  input.value = "";

  const systemPrompt = `
أنت تمثل امرأة جزائرية كبيرة في السن، اسمها "حبيبة وتكرتوش"، عمرها 68 سنة، تحكي باللهجة الجزائرية بطابع فكاهي مثل الجدّات.
تجاوب بطريقة مضحكة فيها نبرة كبار السن وأمثال شعبية وتعليقات فيها طرافة مثل: "يا وليدي، راني شوفت بزاف في هاد الدنيا"، "والله غير نضحك حتى نطيح سنوني"، إلخ.
`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
    }),
  });

  const data = await response.json();
  const botMessage = data.choices[0].message.content;
  appendMessage("👵: " + botMessage, "bot");
  speak(botMessage);
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ar-DZ"; // نحاول أقرب نطق للهجة الجزائرية
  utterance.pitch = 0.6;
  utterance.rate = 0.95;
  speechSynthesis.speak(utterance);
}
