"use client";

import { useState, useEffect, useRef } from "react";
import ChatWindow from "@/app/components/ChatWindow";
import MessageInput from "@/app/components/MessageInput";
import FileUploader from "@/app/components/FileUploader";
import { v4 as uuidv4 } from "uuid";

export default function ChatInterface() {
  const [messages, setMessages] = useState<
    {
      sender: string;
      text: string;
      timestamp: Date;
      id?: string;
      status?: "sending" | "sent" | "error";
    }[]
  >([]);
  const [userId] = useState<string>(() => uuidv4());
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  
  const countries = [
    { code: "MY", name: "Malaysia" },
    { code: "SG", name: "Singapore" },
    { code: "ID", name: "Indonesia" },
    { code: "VN", name: "Vietnam" },
    { code: "SA", name: "KSA" },
    { code: "AE", name: "UAE" },
  ];

  useEffect(() => {
    setMessages([
      {
        sender: "REGNOVA Bot",
        text: "Hello! I'm Regenova Compliance Assistant. Please select your country to begin.",
        timestamp: new Date(),
        id: uuidv4(),
        status: "sent",
      },
    ]);
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "User",
          text: `Selected country: ${selectedCountry}`,
          timestamp: new Date(),
          id: uuidv4(),
          status: "sent",
        },
        {
          sender: "REGNOVA Bot",
          text: `Thank you for selecting ${selectedCountry}. Please upload a label or document for checking.`,
          timestamp: new Date(),
          id: uuidv4(),
          status: "sent",
        },
      ]);
      
      // Store selected country in session storage
      sessionStorage.setItem("selected_country", selectedCountry);
    }
  }, [selectedCountry]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatWindowRef.current) {
      const scrollContainer = chatWindowRef.current;
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const addMessage = async (message: { 
    sender: string; 
    text: string; 
    id?: string;
    status?: "sending" | "sent" | "error" 
  }) => {
    // Create unique ID for message tracking
    const messageId = message.id || uuidv4();
    
    const newMessage = {
      ...message,
      id: messageId,
      timestamp: new Date(),
      status: message.status || "sending" as const,
    };

    setMessages((prev) => [...prev, newMessage]);

    if (message.sender === "User") {
      const textToSend = message.text;
      setIsLoading(true);

      try {
        // Update message to show a smooth transition from sending to sent
        setTimeout(() => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === messageId ? { ...msg, status: "sent" } : msg
            )
          );
        }, 800); // Delay status change for visual feedback

        // Get document name from session storage if available
        const documentName = sessionStorage.getItem("current_document_name");
        // Get selected country from session storage
        const country = sessionStorage.getItem("selected_country");

        const response = await fetch("https://regnova-backend.onrender.com/chat/ask", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: textToSend,
            user_id: userId,
            format_type: "structured",
            ...(sessionId ? { session_id: sessionId } : {}),
            ...(documentName ? { document_name: documentName } : {}),
            ...(country ? { country: country } : {})
          }),
        });

        const data = await response.json();

        // Add the bot response
        setMessages((prev) => [
          ...prev,
          {
            sender: "REGNOVA Bot",
            text: data.answer,
            id: uuidv4(),
            timestamp: new Date(),
            status: "sent",
          },
        ]);
      } catch (error) {
        console.error("Error in addMessage:", error);
        
        // Update the user message status to show error
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId ? { ...msg, status: "error" } : msg
          )
        );

        // Add error message
        setMessages((prev) => [
          ...prev,
          {
            sender: "REGNOVA Bot",
            text: "Error: Unable to fetch response from backend. Please try again.",
            id: uuidv4(),
            timestamp: new Date(),
            status: "error",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 relative">
      <div className="p-4 border-b border-slate-200 bg-white shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-800">
              Regulatory Assistant
            </h1>
            <p className="text-sm text-slate-500">
              Get instant answers about compliance requirements
            </p>
          </div>
          <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-100">
            Active Session
          </div>
        </div>
      </div>

      {!selectedCountry && (
        <div className="max-w-4xl mx-auto w-full p-4 mt-4">
          <div className="bg-white shadow-sm rounded-lg p-4 border border-slate-200">
            <h2 className="text-lg font-medium text-slate-800 mb-3">Select your country</h2>
            <div className="flex flex-wrap gap-2">
              {countries.map((country) => (
                <button
                  key={country.code}
                  onClick={() => setSelectedCountry(country.name)}
                  className="px-4 py-2 rounded-full bg-slate-100 hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200 text-slate-700 text-sm font-medium"
                >
                  {country.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div
        className="flex-1 overflow-y-auto px-4 pb-24 pt-6 transition-all duration-300"
        ref={chatWindowRef}
      >
        <ChatWindow messages={messages} isLoading={isLoading} />
      </div>

      <div className="absolute bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 shadow-md transition-all duration-200">
        <div className="max-w-4xl mx-auto flex justify-center items-center gap-3">
          <FileUploader
            addMessage={addMessage}
            userId={userId}
            setSessionId={setSessionId}
          />
          <MessageInput addMessage={addMessage} disabled={isLoading} />
        </div>
      </div>
    </div>
  );
}