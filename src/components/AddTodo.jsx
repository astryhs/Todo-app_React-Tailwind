import { useEffect, useRef, useState } from "react";
import { DeadlineBlock } from "./DeadlineBlock";
import { PlusIcon } from "./PlusIcon";
import MicrophoneIcon from "../assets/micro.png";

export const AddTodo = ({ onAdd }) => {
  const [text, setText] = useState("");
  const [deadline, setDeadline] = useState("");
  const [showDeadlineInput, setShowDeadlineInput] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const finalTextRef = useRef("");
  const inputRef = useRef(null);
  const moveCursorToEnd = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      const length = inputRef.current.value.length;
      inputRef.current.setSelectionRange(length, length);

      // Прокручиваем input до конца, если текст не помещается
      inputRef.current.scrollLeft = inputRef.current.scrollWidth;
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
      setText(finalTextRef.current);
      moveCursorToEnd();
    }
  };

  const startListening = () => {
    finalTextRef.current = "";
    setText("");
    if (recognition) {
      recognition.abort();
      recognition.start();
      setIsListening(true);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const recognitionInstance = new SpeechRecognition();
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionInstance.continuous = true;
        recognitionInstance.lang = "ru-RU";
        recognitionInstance.interimResults = true;

        recognitionInstance.onresult = (event) => {
          let finalTranscript = "";
          let intermScript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              intermScript += transcript;
            }
            if (finalTranscript) {
              finalTextRef.current =
                finalTextRef.current + " " + finalTranscript;
              setText(finalTextRef.current);
            } else if (intermScript) {
              setText(finalTextRef.current + " " + intermScript);
            }
          }
          moveCursorToEnd();
        };
        recognitionInstance.onerror = (event) => {
          console.error("Ошибка распознования: ", event.error.message);
          stopListening();
        };

        recognitionInstance.onend = () => {
          if (isListening) {
            recognitionInstance.start();
          }
        };
        setRecognition(recognitionInstance);
      }
    }
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text, deadline);
      setText("");
      setDeadline("");
      setShowDeadlineInput("");
      finalTextRef.current = "";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 ">
      <div className="flex items-center bg-white rounded-lg shadow-sm dark:shadow-white overflow-hidden border border-gray-100 focus-within:ring-2 focus-within:ring-blue-500">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          ref={inputRef}
          //  // Добавляем ref к input
          placeholder="Добавить задачу..."
          className="flex-1 p-3 text-gray-700 dark:bg-page-dark dark:text-txt-dark outline-none placeholder-gray-400"
        />
        <button
          type="button"
          onClick={toggleListening}
          className={`cursor-pointer p-3 ${isListening ? "bg-red-300 hover:bg-red-400" : "bg-blue-100  hover:bg-btn-light-hv hover:dark:bg-btn-light"} transition-colors duration-300 flex items-center justify-center`}
          title={isListening ? "Остановить запись" : "Начать запись"}
        >
          <img
            src={MicrophoneIcon}
            alt="Микрофон"
            className={`w-6 h-6 4${isListening ? "filter brightness-0 invert" : ""}`}
          />
        </button>
        <button
          type="submit"
          className={`p-3 ${isListening ? "bg-gray-400 cursor-not-allowed" : " bg-btn-light hover:bg-btn-light-hv  cursor-pointer dark:bg-btn-dark hover:dark:bg-btn-dark-hv "} text-white transition-colors duration-300`}
          disabled={isListening}
        >
          <PlusIcon />
        </button>
      </div>
      <DeadlineBlock
        showDeadlineInput={showDeadlineInput}
        deadline={deadline}
        setDeadline={setDeadline}
        setShowDeadlineInput={setShowDeadlineInput}
      />
      {isListening && (
        <div className="mt-2 text-sm text-red-400 flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-400 animate-pulse mr-2 "></div>{" "}
          <span>Идет запись...Нажмите микрофон для остановки</span>
        </div>
      )}
    </form>
  );
};
