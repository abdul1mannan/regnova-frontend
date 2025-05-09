"use client";

import { useState, useEffect, useRef } from "react";
import ChatWindow from "@/app/components/ChatWindow";
import MessageInput from "@/app/components/MessageInput";
import FileUploader from "@/app/components/FileUploader";
export default function ChatInterface() {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const chatWindowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      {
        sender: "REGNOVA Bot",
        text: "Hello! I'm Regenova Compliance Assistant . How can I help you today?\n\nYou can ask questions about product classification, regulations, or anything else.",
      },
    ]);
  }, []);

  const addMessage = async (message: { sender: string; text: string }) => {
    setMessages((prev) => [...prev, message]);
    if (message.sender === "User") {
      const textToSend = message.text;

      try {
        const response = await fetch("http://localhost:8000/chat/ask", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: textToSend }),
        });
        const data = await response.json();
        setMessages((prev) => [
          ...prev,
          { sender: "REGNOVA Bot", text: data.answer },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            sender: "REGNOVA Bot",
            text: "Error: Unable to fetch response from backend.",
          },
        ]);
      }
    }
  };

  return (
    <div className="w-full h-full bg-[#EEF2F5] flex flex-col relative">
      <div className="flex-1 overflow-y-auto px-2 pb-20" ref={chatWindowRef}>
        <ChatWindow messages={messages} />
      </div>
      <div className="absolute bottom-0 left-0 w-full bg-white border-t border-[#ced6d3] z-10">
        <div className="flex justify-center items-center space-x-3 bg-[#EEF2F5] rounded-lg p-3">
          <FileUploader addMessage={addMessage} />
          <MessageInput addMessage={addMessage} />
        </div>
      </div>
    </div>
  );
}
