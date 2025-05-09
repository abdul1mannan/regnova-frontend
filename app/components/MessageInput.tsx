import { useState, useRef, useEffect } from "react";

interface MessageInputProps {
  addMessage: (message: { sender: string; text: string }) => void;
  disabled?: boolean;
}

export default function MessageInput({ addMessage, disabled = false }: MessageInputProps) {
  const [input, setInput] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);


  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || disabled) return;
    addMessage({ sender: "User", text: input });
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleFocus = () => setFocused(true);
  const handleBlur = () => setFocused(false);

  return (
    <div className="flex-1 flex items-center gap-2">
      <div 
        className={`flex-1 flex items-end bg-white rounded-xl border shadow-sm transition-all duration-200 
          ${focused ? "border-blue-300 ring-2 ring-blue-50" : "border-slate-200"} 
          ${disabled ? "opacity-75" : ""}
        `}
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder="Type your message..."
          rows={1}
          className="flex-1 py-3 px-4 bg-transparent rounded-xl resize-none focus:outline-none text-sm min-h-[44px] max-h-[200px]"
          style={{
            overflow: 'auto',
            height: 'auto'
          }}
        />

        <button
          onClick={sendMessage}
          disabled={disabled || !input.trim()}
          className={`px-4 h-[44px] rounded-r-xl transition-all duration-200 flex items-center justify-center group
            ${disabled || !input.trim() 
              ? "text-slate-400 cursor-not-allowed" 
              : "text-white bg-blue-600 hover:bg-blue-700 active:scale-95"
            }
          `}
        >
          <svg 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-200 group-hover:translate-x-1"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
