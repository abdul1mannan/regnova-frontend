import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface FileUploaderProps {
  addMessage: (message: { 
    sender: string; 
    text: string; 
    id?: string; 
    status?: "sending" | "sent" | "error" 
  }) => void;
  userId: string;
  setSessionId: (sessionId: string) => void;
}

export default function FileUploader({
  addMessage,
  userId,
  setSessionId,
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length) {
      await uploadFiles(files);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await uploadFiles(files);
    }
  };

  const uploadFiles = async (files: FileList) => {
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append("user_id", userId);
      formData.append("file", files[0]);

      const response = await fetch("http://localhost:8000/temp/process-temp", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.session_id) {
        setSessionId(result.session_id);
        
        // Store document name in session storage for context reference
        if (files[0].name) {
          sessionStorage.setItem("current_document_name", files[0].name);
        }
      }

      addMessage({
        sender: "REGNOVA Bot",
        text: result.answer || "Files uploaded successfully.",
        id: uuidv4(),
        status: "sent"
      });
    } catch (error) {
      console.error("Error uploading files:", error);
      addMessage({
        sender: "REGNOVA Bot",
        text: "Error: Unable to upload files. Please try again.",
        id: uuidv4(),
        status: "error"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative">
      <label
        className={`flex items-center justify-center w-11 h-11 rounded-full cursor-pointer 
          transition-all duration-300 ${
            isDragging
              ? "bg-blue-100 text-blue-600 scale-110 ring-2 ring-blue-200"
              : isUploading
              ? "bg-blue-100 text-blue-600 animate-pulse"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        title="Upload files"
      >
        <input
          type="file"
          multiple
          className="hidden"
          onChange={handleFileInput}
          disabled={isUploading}
        />
        {isUploading ? (
          <svg
            className="w-5 h-5 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            ></path>
          </svg>
        )}
      </label>
      {isDragging && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1.5 rounded-lg shadow-md text-xs whitespace-nowrap animate-fade-in border border-blue-100">
          Drop files to upload
        </div>
      )}
    </div>
  );
}
