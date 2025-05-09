import { useState } from "react";

interface FileUploaderProps {
  addMessage: (message: { sender: string; text: string }) => void;
}

export default function FileUploader({ addMessage }: FileUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    try {
      const response = await fetch("http://localhost:8000/userdoc/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        addMessage({
          sender: "User",
          text: `Uploaded file: ${e.target.files[0].name}`,
        });
        addMessage({
          sender: "REGNOVA Bot",
          text: "File uploaded successfully! You can now ask questions about it.",
        });
      } else {
        throw new Error(data.message || "Upload failed");
      }
    } catch {
      addMessage({
        sender: "REGNOVA Bot",
        text: "Error uploading file. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        onChange={handleFileUpload}
        disabled={isUploading}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        tabIndex={0}
        className={`flex items-center gap-2 cursor-pointer px-5 py-2 rounded-lg text-sm font-medium shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 border border-blue-500
          ${
            isUploading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }
        `}
        aria-disabled={isUploading}
      >
        {/* File icon SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 16v-8m0 0l-3 3m3-3l3 3M4 16.5V19a2 2 0 002 2h12a2 2 0 002-2v-2.5"
          />
        </svg>
        {isUploading ? "Uploading..." : "Upload File"}
      </label>
    </div>
  );
}
