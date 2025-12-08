import React, { useState, useRef, useEffect } from "react";
import { RingLoader } from "react-spinners";
import { sendChatMessage } from "../../api/ai/chatApi";
import "./SmartChatPage.scss";
import ReactMarkdown from "react-markdown";

export default function SmartChatPage() {
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [isThinking, setIsThinking] = useState(false);
  const userId = "user-123";

  type Role = "user" | "assistant";

  interface Message {
    role: Role;
    content: string;
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsThinking(true);

    try {
      const aiResponse = await sendChatMessage(userId, userMessage.content);
      const assistantMessage: Message = {
        role: "assistant",
        content: aiResponse,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setMessages((prev) => [...prev, { role: "assistant", content: message }]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="smart-chat-page">
      <div className="smart-chat-page__container">
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
            <textarea
              className="chat__input-area__input"
              placeholder="Ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="chat__input-area__send-button"
              onClick={sendMessage}
              disabled={!input.trim() || isThinking}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
