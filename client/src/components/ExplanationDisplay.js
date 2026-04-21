import React, { useState } from "react";

function ExplanationDisplay({ explanation }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(explanation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(explanation)
    );
    element.setAttribute("download", "explanation.txt");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6">
          <h2 className="text-3xl font-bold text-white">💡 Simplified Explanation</h2>
          <p className="text-blue-100 mt-1">Easy to understand breakdown</p>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="bg-blue-900/20 border-l-4 border-blue-400 p-6 rounded-lg backdrop-blur-sm">
            <div className="text-slate-200 whitespace-pre-wrap leading-relaxed text-base">
              {explanation}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="px-8 pb-8">
          <div className="bg-cyan-900/10 border-l-4 border-cyan-400 p-4 rounded-lg backdrop-blur-sm">
            <p className="text-cyan-300 text-sm">
              ✨ Simplified breakdown of the key concepts.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-8 pb-8 flex flex-wrap gap-3">
          <button
            onClick={handleCopy}
            className={`flex-1 min-w-[150px] py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 ${
              copied
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
            }`}
          >
            {copied ? "✓ Copied!" : "📋 Copy"}
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 min-w-[150px] py-3 px-4 rounded-xl font-semibold bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            ⬇️ Download
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExplanationDisplay;
