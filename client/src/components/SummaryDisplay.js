import React, { useState } from "react";

function SummaryDisplay({ summary }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(summary)
    );
    element.setAttribute("download", "summary.txt");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6">
          <h2 className="text-3xl font-bold text-white">📚 Summary</h2>
          <p className="text-green-100 mt-1">Key points extracted from your content</p>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="bg-emerald-900/20 border-l-4 border-emerald-400 p-6 rounded-lg backdrop-blur-sm">
            <div className="text-slate-200 whitespace-pre-wrap leading-relaxed text-base">
              {summary}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="px-8 pb-8">
          <div className="bg-emerald-900/10 border-l-4 border-emerald-400 p-4 rounded-lg backdrop-blur-sm">
            <p className="text-emerald-300 text-sm">
              ✨ Main points and key takeaways from your notes.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-8 pb-8 flex flex-wrap gap-3">
          <button
            onClick={handleCopy}
            className={`flex-1 min-w-[150px] py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 ${
              copied
                ? "bg-emerald-600 text-white shadow-lg"
                : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg"
            }`}
          >
            {copied ? "✓ Copied!" : "📋 Copy"}
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 min-w-[150px] py-3 px-4 rounded-xl font-semibold bg-green-600 hover:bg-green-700 text-white shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            ⬇️ Download
          </button>
        </div>
      </div>
    </div>
  );
}

export default SummaryDisplay;
