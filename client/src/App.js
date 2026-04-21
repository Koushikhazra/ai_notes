import React, { useState, useRef } from "react";
import axios from "axios";
import NoteInput from "./components/NoteInput";
import SummaryDisplay from "./components/SummaryDisplay";
import ExplanationDisplay from "./components/ExplanationDisplay";
import QuizDisplay from "./components/QuizDisplay";
import ATSScoreDisplay from "./components/ATSScoreDisplay";

const API_BASE_URL = (process.env.REACT_APP_API_URL || "http://localhost:5000").replace(/\/$/, "");
const API_URL = `${API_BASE_URL}/api/notes`;

// Helper function to handle error messages
const formatErrorMessage = (error) => {
  const errorMsg = error.response?.data?.message || error.message || "";
  const errorStr = errorMsg.toLowerCase();
  
  // Check for AI/service related issues
  if (
    errorStr.includes("gemini") ||
    errorStr.includes("quota") ||
    errorStr.includes("rate") ||
    errorStr.includes("resource exhausted") ||
    errorStr.includes("timed out") ||
    errorStr.includes("unavailable") ||
    errorStr.includes("api key") ||
    errorStr.includes("model")
  ) {
    return "Something went wrong. Please try again later.";
  }
  
  // Return user-friendly message for validation errors
  if (errorStr.includes("please enter") || errorStr.includes("upload")) {
    return error.response?.data?.message || "Please enter text or upload a file.";
  }
  
  // Default generic error
  return "Something went wrong. Please try again later.";
};

function App() {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [explanation, setExplanation] = useState("");
  const [quiz, setQuiz] = useState([]);
  const [atsScore, setATSScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [activeTab, setActiveTab] = useState("input");
  const [successMessage, setSuccessMessage] = useState("");
  const [wordCount, setWordCount] = useState(0);

  const fileInputRef = useRef(null);

  // Handle text input
  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    setWordCount(newText.trim().split(/\s+/).filter(w => w.length > 0).length);
    setError("");
    setWarning("");
    setSuccessMessage("");
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setText(""); // Clear text when file is selected
    setWordCount(0);
    setError("");
    setWarning("");
    setSuccessMessage("");
  };

  // Summarize
  const handleSummarize = async () => {
    try {
      setError("");
      setWarning("");
      setSuccessMessage("");
      setLoading(true);

      const formData = new FormData();

      if (text.trim()) {
        formData.append("text", text);
      } else if (file) {
        formData.append("file", file);
      } else {
        setError("Please enter text or upload a file");
        setLoading(false);
        return;
      }

      const response = await axios.post(`${API_URL}/summarize`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSummary(response.data.summary);
      setWarning(response.data.warning || "");
      setSuccessMessage("Summary generated successfully!");
      setActiveTab("summary");
    } catch (err) {
      setError(formatErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Explain
  const handleExplain = async () => {
    try {
      setError("");
      setWarning("");
      setSuccessMessage("");
      setLoading(true);

      const formData = new FormData();

      if (text.trim()) {
        formData.append("text", text);
      } else if (file) {
        formData.append("file", file);
      } else {
        setError("Please enter text or upload a file");
        setLoading(false);
        return;
      }

      const response = await axios.post(`${API_URL}/explain`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setExplanation(response.data.explanation);
      setWarning(response.data.warning || "");
      setSuccessMessage("Explanation generated successfully!");
      setActiveTab("explanation");
    } catch (err) {
      setError(formatErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Generate Quiz
  const handleQuiz = async () => {
    try {
      setError("");
      setWarning("");
      setSuccessMessage("");
      setLoading(true);

      const formData = new FormData();

      if (text.trim()) {
        formData.append("text", text);
      } else if (file) {
        formData.append("file", file);
      } else {
        setError("Please enter text or upload a file");
        setLoading(false);
        return;
      }

      const response = await axios.post(`${API_URL}/quiz`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setQuiz(response.data.quiz);
      setWarning(response.data.warning || "");
      setSuccessMessage("Quiz generated successfully!");
      setActiveTab("quiz");
    } catch (err) {
      setError(formatErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Check ATS Score
  const handleATSScore = async () => {
    try {
      setError("");
      setWarning("");
      setSuccessMessage("");

      if (!text && !file) {
        setError("Error: Please enter resume text or upload a file.");
        return;
      }

      setLoading(true);

      const formData = new FormData();
      if (text.trim()) {
        formData.append("text", text);
      } else if (file) {
        formData.append("file", file);
      } else {
        setError("Please enter text or upload a file");
        setLoading(false);
        return;
      }

      const response = await axios.post(`${API_URL}/ats-score`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setATSScore(response.data.atsScore);
      setWarning(response.data.warning || "");
      setSuccessMessage("✅ ATS Score Analysis Complete!");
      setActiveTab("ats");
    } catch (err) {
      setError(formatErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Clear all
  const handleClear = () => {
    setText("");
    setFile(null);
    setSummary("");
    setExplanation("");
    setQuiz([]);
    setATSScore(null);
    setError("");
    setWarning("");
    setSuccessMessage("");
    setWordCount(0);
    setActiveTab("input");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/90 shadow-2xl border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                ✨ Smart Notes AI
              </h1>
              <p className="text-slate-400 mt-1">Transform your notes with AI-powered learning</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 animate-fadeIn">
            <div className="bg-gradient-to-r from-emerald-900/40 to-green-900/40 border-l-4 border-emerald-400 p-4 rounded-lg backdrop-blur-sm">
              <p className="text-emerald-300 font-semibold">✓ {successMessage}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 animate-fadeIn">
            <div className="bg-gradient-to-r from-red-900/40 to-rose-900/40 border-l-4 border-red-400 p-4 rounded-lg backdrop-blur-sm">
              <p className="text-red-300 font-semibold">{error}</p>
            </div>
          </div>
        )}

        {warning && !error && (
          <div className="mb-4 animate-fadeIn">
            <div className="bg-gradient-to-r from-amber-900/40 to-orange-900/40 border-l-4 border-amber-400 p-4 rounded-lg backdrop-blur-sm">
              <p className="text-amber-300 font-semibold">⚠️ {warning}</p>
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-40">
            <div className="bg-slate-800 rounded-xl p-8 shadow-2xl border border-slate-700">
              <div className="flex flex-col items-center gap-4">
                <div className="spinner-large"></div>
                <p className="text-slate-200 font-semibold">Processing your notes...</p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs Navigation */}
        {!loading && (
          <>
            <div className="flex gap-3 mb-8 flex-wrap">
              <button
                onClick={() => setActiveTab("input")}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                  activeTab === "input"
                    ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg"
                    : "bg-slate-700/50 text-slate-300 border-2 border-slate-600 hover:border-slate-500 hover:bg-slate-700/70"
                }`}
              >
                📝 Input
              </button>
              <button
                onClick={() => setActiveTab("summary")}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                  activeTab === "summary"
                    ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg"
                    : "bg-slate-700/50 text-slate-300 border-2 border-slate-600 hover:border-slate-500 hover:bg-slate-700/70"
                }`}
                disabled={!summary}
              >
                📚 Summary
              </button>
              <button
                onClick={() => setActiveTab("explanation")}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                  activeTab === "explanation"
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                    : "bg-slate-700/50 text-slate-300 border-2 border-slate-600 hover:border-slate-500 hover:bg-slate-700/70"
                }`}
                disabled={!explanation}
              >
                💡 Explanation
              </button>
              <button
                onClick={() => setActiveTab("quiz")}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                  activeTab === "quiz"
                    ? "bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg"
                    : "bg-slate-700/50 text-slate-300 border-2 border-slate-600 hover:border-slate-500 hover:bg-slate-700/70"
                }`}
                disabled={quiz.length === 0}
              >
                ❓ Quiz
              </button>
              <button
                onClick={() => setActiveTab("ats")}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                  activeTab === "ats"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                    : "bg-slate-700/50 text-slate-300 border-2 border-slate-600 hover:border-slate-500 hover:bg-slate-700/70"
                }`}
                disabled={!atsScore}
              >
                📄 ATS Score
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "input" && (
              <NoteInput
                text={text}
                file={file}
                wordCount={wordCount}
                onTextChange={handleTextChange}
                onFileChange={handleFileChange}
                onSummarize={handleSummarize}
                onExplain={handleExplain}
                onQuiz={handleQuiz}
                onATSScore={handleATSScore}
                onClear={handleClear}
                fileInputRef={fileInputRef}
              />
            )}

            {activeTab === "summary" && summary && (
              <SummaryDisplay summary={summary} />
            )}

            {activeTab === "explanation" && explanation && (
              <ExplanationDisplay explanation={explanation} />
            )}

            {activeTab === "quiz" && quiz.length > 0 && (
              <QuizDisplay quiz={quiz} />
            )}

            {activeTab === "ats" && atsScore && (
              <ATSScoreDisplay atsScore={atsScore} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
