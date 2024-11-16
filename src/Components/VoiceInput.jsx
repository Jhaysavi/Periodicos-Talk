import React from "react";
import { useSpeechRecognition } from "react-speech-kit";

const VoiceInput = ({ setInput }) => {
  const { listen, stop, listening } = useSpeechRecognition({
    onResult: (result) => {
      setInput(result);
    },
  });

  return (
    <div className="voice-input">
      <button
        onMouseDown={listen}
        onMouseUp={stop}
        disabled={listening}
        aria-label="Gravar mensagem de voz"
      >
        🎤 {listening ? "Gravando..." : "Pressione para falar"}
      </button>
    </div>
  );
};

export default VoiceInput;