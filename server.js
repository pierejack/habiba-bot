const backendUrl = "https://habiba-bot.onrender.com"; // غيّر هذا حسب رابطك
const messages = document.getElementById("messages");

function appendMessage(text, type) {
  const div = document.createElement("div");
  div.className = "msg " + type;
  div.innerText = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ar-DZ";
  speechSynthesis.speak(utterance);
}

function startListening() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "ar-DZ";
  recognition.start();

  recognition.onresult = async (event) => {
    const userMessage = event.results[0][0].transcript;
    appendMessage(userMessage, "user");

    const res = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage }),
    });

    const data = await res.json();
    appendMessage(data.reply, "bot");
    speak(data.reply);
  };

  recognition.onerror = () => {
    appendMessage("ما قدرتش نسمعك، جرب عاود.", "bot");
  };
}
