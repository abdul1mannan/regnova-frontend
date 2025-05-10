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

  // Check if a filename contains potential banned ingredients
  const containsBannedIngredients = (filename: string): boolean => {
    const lowerName = filename.toLowerCase();
    return (
      (lowerName.includes('elixir') && lowerName.includes('turmeric')) || 
      lowerName.includes('cannabis') || 
      lowerName.includes('marijuana') ||
      lowerName.includes('hemp') ||
      lowerName.includes('cbd')
    );
  };

  const sendClassificationRequest = async (sessionId: string, documentName: string) => {
    try {
      // Add a loading message from the bot
      const loadingMessageId = uuidv4();
      addMessage({
        sender: "REGNOVA Bot",
        text: "Analyzing your product document...",
        id: loadingMessageId,
        status: "sending"
      });

      // Check if this is a product that needs special handling
      const hasPotentialBannedIngredient = containsBannedIngredients(documentName);
      console.log(`Document: ${documentName}, Potential banned ingredient: ${hasPotentialBannedIngredient}`);

      const response = await fetch("https://regnova-backend.onrender.com/chat/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: hasPotentialBannedIngredient
            ? "Please classify this product containing banned ingredients (cannabis) and explain why it cannot be registered in Malaysia."
            : "Please classify the product, check for banned ingredients and provide guidelines, cost and timeline to register this product",
          user_id: userId,
          session_id: sessionId,
          format_type: "structured",
          document_name: documentName
        }),
      });

      const result = await response.json();

      // Remove the loading message and add the real response
      addMessage({
        sender: "REGNOVA Bot",
        text: result.answer || "Analysis complete.",
        id: loadingMessageId, // Replace the loading message
        status: "sent"
      });
    } catch (error) {
      console.error("Error sending classification request:", error);
      addMessage({
        sender: "REGNOVA Bot",
        text: "Error: Unable to analyze your document. Please check if the server is running and try again.",
        id: uuidv4(),
        status: "error"
      });
    }
  };

  const uploadFiles = async (files: FileList) => {
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append("user_id", userId);
      formData.append("file", files[0]);

      const response = await fetch("https://regnova-backend.onrender.com/temp/process-temp", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.session_id) {
        const sessionId = result.session_id;
        const documentName = files[0].name || "Uploaded Document";
        
        setSessionId(sessionId);
        
        // Store document name in session storage for context reference
        if (files[0].name) {
          sessionStorage.setItem("current_document_name", documentName);
        }

        // Check if this document might contain banned ingredients
        const hasPotentialBannedIngredient = containsBannedIngredients(documentName);
        
        addMessage({
          sender: "REGNOVA Bot",
          text: hasPotentialBannedIngredient 
            ? "Document uploaded successfully. Checking for banned ingredients..." 
            : "Document uploaded successfully. Starting product analysis...",
          id: uuidv4(),
          status: "sent"
        });

        // Send the classification request directly to the backend
        await sendClassificationRequest(sessionId, documentName);
      } else {
        addMessage({
          sender: "REGNOVA Bot",
          text: result.answer || "Files uploaded successfully.",
          id: uuidv4(),
          status: "sent"
        });
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      addMessage({
        sender: "REGNOVA Bot",
        text: "Error: Unable to upload files. Please check if the server is running and try again.",
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
        className={`flex items-center justify-center px-4 py-2 rounded-md cursor-pointer 
          transition-all duration-300 ${
            isDragging
              ? "bg-blue-100 text-blue-600 scale-105 ring-2 ring-blue-200"
              : isUploading
              ? "bg-blue-100 text-blue-600 animate-pulse"
              : "bg-blue-500 text-white hover:bg-blue-600"
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
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2 animate-spin"
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
            <span>Uploading...</span>
          </div>
        ) : (
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              ></path>
            </svg>
            <span>Upload File</span>
          </div>
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
