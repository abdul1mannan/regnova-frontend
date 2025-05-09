import { useState, useEffect } from "react";
import FormattedMessage from "./FormattedMessage";

interface ChatWindowProps {
  messages: { 
    sender: string; 
    text: string; 
    timestamp: Date;
    id?: string;
    status?: "sending" | "sent" | "error";
  }[];
  isLoading?: boolean;
}

const BotAvatar = () => (
  <div className="flex-shrink-0 h-9 w-9 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center text-white shadow-sm transition-transform duration-300 hover:scale-110">
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 15s1.5 2 4 2 4-2 4-2" />
      <line x1="9" y1="9" x2="9.01" y2="9" />
      <line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
  </div>
);

const UserAvatar = () => (
  <div className="flex-shrink-0 h-9 w-9 rounded-full bg-gradient-to-r from-slate-700 to-slate-800 flex items-center justify-center text-white shadow-sm transition-transform duration-300 hover:scale-110">
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-2.21 3.58-4 8-4s8 1.79 8 4" />
    </svg>
  </div>
);

const LoadingIndicator = () => (
  <div className="flex space-x-1.5 mt-1">
    <div className="h-2.5 w-2.5 rounded-full bg-blue-200 animate-bounce" style={{ animationDelay: "0ms" }}></div>
    <div className="h-2.5 w-2.5 rounded-full bg-blue-200 animate-bounce" style={{ animationDelay: "150ms" }}></div>
    <div className="h-2.5 w-2.5 rounded-full bg-blue-200 animate-bounce" style={{ animationDelay: "300ms" }}></div>
  </div>
);

export default function ChatWindow({ messages, isLoading = false }: ChatWindowProps) {
  // Animation state for new messages
  const [visibleMessages, setVisibleMessages] = useState<number>(0);

  useEffect(() => {
    // Add a small delay before showing new messages for animation effect
    const timer = setTimeout(() => {
      setVisibleMessages(messages.length);
    }, 100);
    return () => clearTimeout(timer);
  }, [messages.length]);

  const formatTimestamp = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  return (
    <div className="space-y-6 pb-6 max-w-4xl mx-auto">
      {messages.slice(0, visibleMessages).map((msg, index) => (
        <div
          key={index}
          className={`flex ${
            msg.sender === "User" ? "justify-end" : "justify-start"
          } opacity-0 animate-fade-in`}
          style={{
            animationDelay: `${index * 100}ms`,
            animationFillMode: "forwards",
          }}
        >
          <div
            className={`flex max-w-[85%] ${
              msg.sender === "User" ? "flex-row-reverse" : "flex-row"
            } items-end gap-2`}
          >
            {msg.sender !== "User" ? <BotAvatar /> : <UserAvatar />}
            
            <div className="space-y-1 max-w-[calc(100%-3rem)]">
              <div
                className={`px-4 py-3 rounded-2xl shadow-sm ${
                  msg.sender === "User"
                    ? "bg-white border border-slate-200 text-slate-800"
                    : "bg-blue-50 border border-blue-100 text-slate-800"
                } transition-all duration-300 hover:shadow-md`}
              >
                {msg.sender !== "User" && (
                  <div className="text-xs font-medium text-blue-600 mb-1">
                    REGNOVA Assistant
                  </div>
                )}
                {msg.sender === "User" ? (
                  <div className="whitespace-pre-wrap text-sm break-words leading-relaxed">
                    {msg.text}
                  </div>
                ) : (
                  <FormattedMessage text={msg.text} />
                )}
              </div>
              
              <div className="flex items-center px-2">
                <span className="text-xs text-slate-400">
                  {formatTimestamp(msg.timestamp)}
                </span>
                
                {msg.status === "sending" && (
                  <span className="ml-2 text-xs text-yellow-500 flex items-center">
                    <span className="mr-1">Sending</span>
                    <span className="flex space-x-0.5">
                      <span className="h-1 w-1 rounded-full bg-yellow-500 animate-pulse" style={{ animationDelay: "0ms" }}></span>
                      <span className="h-1 w-1 rounded-full bg-yellow-500 animate-pulse" style={{ animationDelay: "150ms" }}></span>
                      <span className="h-1 w-1 rounded-full bg-yellow-500 animate-pulse" style={{ animationDelay: "300ms" }}></span>
                    </span>
                  </span>
                )}
                
                {msg.status === "error" && (
                  <span className="ml-2 text-xs text-red-500 flex items-center">
                    <svg
                      className="w-3 h-3 mr-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    Failed
                  </span>
                )}
                
                {msg.status === "sent" && msg.sender === "User" && (
                  <span className="ml-2 flex items-center text-green-500 transition-opacity duration-300">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="flex justify-start mt-4 opacity-0 animate-fade-in" style={{ animationFillMode: "forwards" }}>
          <div className="flex items-end gap-2">
            <BotAvatar />
            <div className="px-4 py-3 rounded-2xl bg-blue-50 border border-blue-100">
              <LoadingIndicator />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
