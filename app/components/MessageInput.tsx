import { useState } from "react";

interface MessageInputProps {
  addMessage: (message: { sender: string; text: string }) => void;
}

export default function MessageInput({ addMessage }: MessageInputProps) {
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;
    addMessage({ sender: "User", text: input });
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex-1 flex items-center space-x-2">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type your message..."
        className="flex-1 bg-white border border-[#c0d1ca] rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#0D2B52] focus:border-transparent shadow-sm"
      />
      <button
        onClick={sendMessage}
        className="bg-[#abe7cd] text-black px-5 py-2 rounded-lg text-base font-semibold hover:bg-[#21996A] focus:outline-none focus:ring-2 focus:ring-[#0D2B52] focus:ring-offset-2 transition-colors shadow-md"
      >
        Send
      </button>
    </div>
  );
}
