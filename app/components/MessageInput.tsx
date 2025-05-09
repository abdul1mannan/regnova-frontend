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

  return (
    <div className="flex space-x-2 items-center w-full">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        className="border p-2 flex-1 rounded-md"
      />
      <button
        onClick={sendMessage}
        className="bg-blue-500 text-white p-2 rounded-md"
      >
        Send
      </button>
    </div>
  );
}
