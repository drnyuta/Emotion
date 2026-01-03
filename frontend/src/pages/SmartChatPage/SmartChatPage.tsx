import { useState } from "react";
import { sendChatMessage } from "../../api/aiApi";
import SmartChat from "../../components/SmartChat/SmartChat";
import "./SmartChatPage.scss";
import { Message } from "../../globalInterfaces";

export default function SmartChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
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
      const aiResponse = await sendChatMessage(userMessage.content);
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

  return (
    <div className="smart-chat-page">
      <div className="smart-chat-page__container">
        <SmartChat
          messages={messages}
          input={input}
          isThinking={isThinking}
          onInputChange={setInput}
          onSendMessage={sendMessage}
        />
      </div>
    </div>
  );
}
