"use client";

import { useState, useEffect } from "react";
import ChatWindow from "@/app/components/ChatWindow";
import MessageInput from "@/app/components/MessageInput";
import FileUploader from "@/app/components/FileUploader";

export default function ChatInterface() {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [fileId, setFileId] = useState<string | null>(null);

  useEffect(() => {
    setMessages([
      {
        sender: "REGNOVA Bot",
        text: "Hello! I'm REGNOVA Bot. How can I help you today?\n\nYou can ask questions about product classification, regulations, or anything else.",
      },
    ]);
  }, []);

  const addMessage = async (message: { sender: string; text: string }) => {
    setMessages((prev) => [...prev, message]);
    if (message.sender === "User") {
      const textToSend = fileId
        ? `For file ID ${fileId}: ${message.text}`
        : message.text;

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
    <div className="w-full h-screen bg-gray-50">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 w-full bg-white z-10 shadow-sm border-b border-gray-200">
        <div className="max-w-full text-center py-4 font-semibold text-lg text-gray-700">
          REGNOVA Bot
        </div>
      </header>
      {/* Main Chat Area */}
      <div className="w-full h-full bg-white rounded-none shadow-none p-0 flex flex-col pt-16">
        <ChatWindow messages={messages} />
        <div className="flex items-center space-x-2 bg-gray-100 rounded-none p-4">
          <FileUploader addMessage={addMessage} setFileId={setFileId} />
          <MessageInput addMessage={addMessage} />
        </div>
      </div>
    </div>
  );
}
