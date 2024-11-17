import React, { useState, useEffect } from "react";
import axios from "axios";
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

  const processUserMessage = async (message) => {
    const userMessage = { role: "user", content: message };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await axios.post("http://localhost:5000/search", {
        query: message,
      });

      const botResponse = {
        role: "bot",
        content: response.data
          .map(
            (result, index) =>
              `${index + 1}. ${result.title} (${result.year}) - ${result.citations} citações`
          )
          .join("\n"),
      };

      setMessages((prev) => [...prev, botResponse]);
      speak(botResponse.content);
    } catch (error) {
      const botResponse = {
        role: "bot",
        content: "Ocorreu um erro ao buscar os resultados. Tente novamente.",
      };
      setMessages((prev) => [...prev, botResponse]);
      speak(botResponse.content);
    }
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
      <h2>Seu assistente de voz</h2>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.role === "user" ? "user" : "bot"}`}
          >
            {msg.content.split("\n").map((line, i) => (
              <p key={i}>{line}</p>
            ))}
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
