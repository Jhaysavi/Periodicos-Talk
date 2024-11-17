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

    // Simula a resposta do bot de acordo com a mensagem do usuário
    const simulatedResponse = simulateBotResponse(message);

    const botResponse = {
      role: "bot",
      content: simulatedResponse,
    };

    setMessages((prev) => [...prev, botResponse]);
    speak(botResponse.content);
  };

  // Função para simular uma resposta mais completa, com orientações passo a passo
  const simulateBotResponse = (message) => {
    if (message.includes("pesquisar")) {
      return (
        "Ótimo! Vamos começar a pesquisa. Sobre qual área de pesquisa você gostaria de saber mais? Por exemplo: 'educação', 'saúde', 'tecnologia', etc."
      );
    } else if (message.includes("educação")) {
      return (
        "Você escolheu a área de Educação. Que tipo de pesquisa você procura? Artigos, dissertações, teses? Ou quer ver os mais citados?"
      );
    } else if (message.includes("artigos")) {
      return (
        "Certo! Vou procurar por artigos na área de Educação. Por favor, aguarde um momento..."
      );
    } else if (message.includes("tecnologia")) {
      return (
        "Você escolheu a área de Tecnologia. Podemos procurar artigos, dissertações ou teses. O que você prefere?"
      );
    } else if (message.includes("resultados")) {
      return (
        "Aqui estão alguns resultados na área de Educação:\n1. Artigo sobre Inovações em Ensino (2023) - 230 citações\n2. Artigo sobre Tecnologia Educacional (2022) - 450 citações\n3. Estudo sobre Inclusão Digital (2021) - 150 citações"
      );
    } else {
      return (
        "Desculpe, não entendi sua pergunta. Você pode me dizer sobre qual área de pesquisa você gostaria de saber mais?"
      );
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
