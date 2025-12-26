import React, { useState, useRef } from "react";
import axios from "axios";

import ReactMarkdown from "react-markdown";

export default function PDFQueryForm() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [response, setResponse] = useState("");
  const fileInputRef = useRef(null);

  const showNotification = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      // showNotification();
    } else if (selectedFile) {
      alert("Please upload a PDF file only");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
      showNotification();
    } else if (droppedFile) {
      alert("Please upload a PDF file only");
    }
  };

  const removeFile = () => {
    setFile(null);
    setResponse("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    // if (!file) {
    //   alert('Please upload a PDF file first');
    //   return;
    // }

    if (!query.trim()) {
      alert("Please enter your query");
      return;
    }

    setIsLoading(true);
    setResponse("");

    try {
      // Replace with your actual API endpoint
      const result = await axios.post("http://localhost:5000/api/query", {
        question: query,
      });
      console.log(result);
      setResponse(result?.data?.answer || "Response received");

      // For demo purposes (remove in production):
      // await new Promise(resolve => setTimeout(resolve, 2000));
      // setResponse('This is a simulated response. Replace the API endpoint with your actual server URL.');
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to get response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      setIsLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        console.log("File uploaded successfully!!");
        setIsLoading(false);
        setShowToast(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 px-5 py-10 font-sans">
      <div className="mx-auto max-w-[900px]">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="mb-3 text-4xl font-bold text-slate-900">
            PDF Query Assistant
          </h1>
          <p className="text-lg text-slate-500">
            Upload your PDF document and ask questions about its content
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl bg-white p-12 shadow-[0_20px_60px_rgba(0,0,0,0.1)]">
          {/* Upload */}
          <div className="mb-8">
            <label className="mb-4 block text-base font-semibold text-slate-800">
              Upload PDF Document
            </label>

            <div
              onClick={() => {
                if (!file) {
                  fileInputRef.current?.click();
                }
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative cursor-pointer rounded-2xl border-4 border-dashed 
    ${
      isDragging ? "border-blue-500 bg-blue-50" : "border-slate-300 bg-slate-50"
    }
    transition-all`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0 pointer-events-none"
              />

              {file ? (
                <div className="flex items-center justify-between px-6 py-8">
                  <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center justify-center gap-2 rounded-xl bg-red-100 px-4 py-3">
   <svg
    className="h-8 w-8 stroke-blue-600"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M12 12l-3 3m0 0l3 3m-3-3h6"
    />
  </svg>

</div>


                    <div>
                      <h4 className="font-semibold text-slate-900">
                        {file.name}
                      </h4>
                      <p className="text-sm text-slate-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-3">
                    {/* Send / Upload Button */}
                    <button
                      type="button"
                      onClick={handleFileUpload} // or handleFileUpload
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700"
                      title="Upload & Send"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                    </button>

                    {/* Remove File Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile();
                      }}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 transition hover:bg-red-100"
                      title="Remove file"
                    >
                      <svg
                        className="h-5 w-5 stroke-slate-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between px-6 py-8">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-red-100">
                      <svg
                        className="h-7 w-7 stroke-red-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                    </div>

                    <div>
                      <h4 className="font-semibold text-slate-900">
                        {file?.name ?? ""}
                      </h4>

                      {file && (
                        <p className="text-sm text-slate-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile();
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 transition hover:bg-red-100"
                  >
                    <svg
                      className="h-5 w-5 stroke-slate-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Query */}
          <div className="mb-8">
            <label className="mb-4 block text-base font-semibold text-slate-800">
              Ask Your Question
            </label>

            <textarea
              rows={5}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={!file || isLoading}
              placeholder="What would you like to know about this document?"
              className={`w-full resize-none rounded-2xl border-2 px-4 py-4 text-base outline-none transition
              ${
                !file || isLoading
                  ? "cursor-not-allowed bg-slate-100 border-slate-300"
                  : "border-slate-300 focus:border-blue-500"
              }
            `}
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!file || !query.trim() || isLoading}
            className={`flex w-full items-center justify-center gap-3 rounded-2xl px-6 py-5 text-lg font-semibold text-white transition
            ${
              !file || !query.trim() || isLoading
                ? "cursor-not-allowed bg-slate-300"
                : "bg-blue-600 shadow-lg shadow-blue-300 hover:-translate-y-0.5 hover:bg-blue-700"
            }
          `}
          >
            {isLoading ? (
              <>
                <svg
                  className="h-5 w-5 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
                Send Query
              </>
            )}
          </button>

          {/* Response */}
          {response && (
            <div className="mt-8 rounded-2xl border-2 border-slate-200 bg-slate-50 p-6">
              <h3 className="mb-3 font-semibold text-slate-800">Response:</h3>
              <div  className="prose max-w-none">
              <ReactMarkdown>
                {response}
              </ReactMarkdown>
              </div>
              {/* <p className="whitespace-pre-line leading-relaxed text-slate-600">{response}</p> */}
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Your documents are processed securely and are not stored permanently
        </p>
      </div>

      {/* Toast */}
      {showToast && (
        <div className="fixed right-6 top-6 z-50 flex items-center gap-4 rounded-2xl border-2 border-green-200 bg-white p-5 shadow-xl">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-6 w-6 stroke-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900">Success!</h4>
            <p className="text-sm text-slate-500">PDF uploaded successfully</p>
          </div>
        </div>
      )}
    </div>
  );
}
