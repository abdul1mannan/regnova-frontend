interface ChatWindowProps {
  messages: { sender: string; text: string }[];
}

export default function ChatWindow({ messages }: ChatWindowProps) {
  return (
    <div className="flex-1 overflow-y-auto border p-4">
      {messages.map((msg, index) => (
        <p
          key={index}
          className={msg.sender === "User" ? "text-right" : "text-left"}
        >
          <strong>{msg.sender}:</strong> {msg.text}
        </p>
      ))}
    </div>
  );
}
