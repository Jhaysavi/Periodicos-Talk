import React, { useState } from "react";
import VoiceInput from "./VoiceInput";
import "/src/Components/styles/Chat.css";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    // Simular resposta da IA
    const botMessage = { role: "bot", content: "Buscando resultados..." };
    setMessages((prev) => [...prev, botMessage]);

    // TODO:Integrar com backend futuramente
    // const response = await axios.post('/api/chat', { message: input });

    setInput("");
  };

  return (
    <section className="chat-container">
      <h1>Periódicos Talk</h1>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.role === "user" ? "user" : "bot"}`}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <VoiceInput setInput={setInput} />
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua mensagem..."
          aria-label="Campo de texto para enviar mensagens"
        />
        <button onClick={handleSend} aria-label="Enviar mensagem">
          Enviar
        </button>
      </div>
    </section>
  );
};

export default Chat;