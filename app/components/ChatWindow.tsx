interface ChatWindowProps {
  messages: { sender: string; text: string }[];
}

const BotIcon = () => (
  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#0D2B52] mr-2">
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 15s1.5 2 4 2 4-2 4-2" />
      <line x1="9" y1="9" x2="9.01" y2="9" />
      <line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
  </span>
);

const UserIcon = () => (
  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#27B87A] ml-2">
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-2.21 3.58-4 8-4s8 1.79 8 4" />
    </svg>
  </span>
);

export default function ChatWindow({ messages }: ChatWindowProps) {
  return (
    <div className="flex-1 overflow-y-auto py-6 space-y-4 bg-gradient-to-br from-[#f3f6fa] to-[#e6ecf3] rounded-xl transition-colors duration-500 pt-20">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex items-end ${
            msg.sender === "User" ? "justify-end" : "justify-start"
          }`}
        >
          {msg.sender !== "User" && <BotIcon />}
          <div
            className={`max-w-[80%] rounded-lg px-4 py-3 shadow-md transition-all duration-300 flex flex-col ${
              msg.sender === "User"
                ? "bg-[#d2f7eb] text-black border border-[#99c2b0] items-end"
                : "bg-[#d1dceb] text-black border border-[#88b0e3] items-start"
            }`}
          >
            <div className="whitespace-pre-wrap text-base">{msg.text}</div>
          </div>
          {msg.sender === "User" && <UserIcon />}
        </div>
      ))}
    </div>
  );
}
