import React, { useState, useEffect } from "react";
import "/src/Components/styles/Chat.css";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const synth = window.speechSynthesis;

  useEffect(() => {
    if (!recognition) {
      alert("Seu navegador não suporta reconhecimento de voz.");
      return;
    }

    const speechRecognition = new recognition();
    speechRecognition.lang = "pt-BR";
    speechRecognition.interimResults = false;

    // Processar o que o usuário diz
    speechRecognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();
      processUserMessage(transcript);
    };

    speechRecognition.onend = () => {
      if (isListening) {
        speechRecognition.start(); // Reinicia para fluxo contínuo
      }
    };

    if (isListening) {
      speechRecognition.start();
    } else {
      speechRecognition.stop();
    }

    return () => speechRecognition.abort();
  }, [isListening]);

  const processUserMessage = (message) => {
    const userMessage = { role: "user", content: message };
    setMessages((prev) => [...prev, userMessage]);

    // Simular resposta da IA
    const botResponse = { role: "bot", content: "Buscando resultados..." };
    setMessages((prev) => [...prev, botResponse]);

    speak(botResponse.content);
  };

  const speak = (text) => {
    if (synth.speaking) synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pt-BR";
    synth.speak(utterance);
  };

  const handleStartListening = () => {
    setIsListening(true);
    speak("Bem-vindo ao Periódicos Talk! O que você deseja pesquisar?");
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
      {!isListening && (
        <button
          onClick={handleStartListening}
          aria-label="Iniciar interação por voz"
          className="start-button"
        >
          Iniciar
        </button>
      )}
    </section>
  );
};

export default Chat;
