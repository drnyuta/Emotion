import React, { useRef, useEffect } from "react";
import { RingLoader } from "react-spinners";
import ReactMarkdown from "react-markdown";
import TextareaAutosize from "react-textarea-autosize";
import "./SmartChat.scss";
import { Message } from "../../globalInterfaces";

interface ChatProps {
  messages: Message[];
  input: string;
  isThinking: boolean;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
}

export default function Chat({
  messages,
  input,
  isThinking,
  onInputChange,
  onSendMessage,
}: ChatProps) {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="chat">
      <header className="chat__header">
        <h2>Welcome to your AI Chat!</h2>
        <p>
          This is a safe and supportive space where you can talk with an
          empathetic AI.
        </p>
      </header>

      <div className="chat__messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat__message chat__message--${msg.role}`}
          >
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          </div>
        ))}

        {isThinking && (
          <div className="chat__message chat__message--thinking">
            <p>Thinking...</p>
            <RingLoader color="#8830daff" size={20} />
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <div className="chat__input-area">
        <TextareaAutosize
          className="chat__input-area__input"
          minRows={1}
          maxRows={6}
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={handleKeyDown}
        />
        <button
          className="chat__input-area__send-button"
          onClick={onSendMessage}
          disabled={!input.trim() || isThinking}
        >
          Send
        </button>
      </div>
    </div>
  );
}
