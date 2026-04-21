import React from "react";

function NoteInput({
  text,
  file,
  wordCount,
  onTextChange,
  onFileChange,
  onSummarize,
  onExplain,
  onQuiz,
  onATSScore,
  onClear,
  fileInputRef,
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Input Section */}
      <div className="lg:col-span-2">
        <div className="bg-slate-800 rounded-2xl shadow-2xl overflow-hidden card-transition border border-slate-700">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-6">
            <h2 className="text-3xl font-bold text-white">✍️ Add Your Notes</h2>
            <p className="text-cyan-100 mt-1">Paste text or upload a document</p>
          </div>

          <div className="p-8">
            {/* Text Area */}
            <div className="mb-8">
              <label className="block text-slate-200 font-semibold mb-3 text-lg">
                📝 Your notes:
              </label>
              <textarea
                value={text}
                onChange={onTextChange}
                placeholder="Paste your text here..."
                className="w-full h-56 p-4 border-2 border-slate-600 rounded-xl bg-slate-900 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 resize-none transition-all text-base leading-relaxed"
              ></textarea>
              <div className="mt-3 flex justify-between items-center">
                <p className="text-slate-400 text-sm">
                  {wordCount} words • {text.length} characters
                </p>
              </div>
            </div>

            {/* File Upload */}
            <div className="mb-8 border-2 border-dashed border-slate-600 rounded-xl p-8 hover:border-cyan-400 transition-colors cursor-pointer hover:bg-slate-700/30">
              <label className="block text-slate-200 font-semibold mb-3 text-lg cursor-pointer">
                📄 Upload file (PDF or text):
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt"
                onChange={onFileChange}
                className="block w-full text-slate-300 cursor-pointer"
              />
              {file && (
                <div className="mt-4 p-3 bg-emerald-900/30 border-l-4 border-emerald-400 rounded">
                  <p className="text-emerald-300 font-semibold">
                    ✓ File selected: {file.name}
                  </p>
                  <p className="text-emerald-400 text-sm">
                    Size: {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              )}
            </div>

            {/* Features Info */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="bg-blue-900/30 p-4 rounded-lg border-l-4 border-blue-400 backdrop-blur-sm">
                <p className="text-blue-300 text-sm font-semibold">📝 Summarize</p>
                <p className="text-blue-400 text-xs mt-1">Get key points</p>
              </div>
              <div className="bg-purple-900/30 p-4 rounded-lg border-l-4 border-purple-400 backdrop-blur-sm">
                <p className="text-purple-300 text-sm font-semibold">💡 Explain</p>
                <p className="text-purple-400 text-xs mt-1">Simple terms</p>
              </div>
              <div className="bg-orange-900/30 p-4 rounded-lg border-l-4 border-orange-400 backdrop-blur-sm">
                <p className="text-orange-300 text-sm font-semibold">❓ Quiz</p>
                <p className="text-orange-400 text-xs mt-1">Test yourself</p>
              </div>
              <div className="bg-pink-900/30 p-4 rounded-lg border-l-4 border-pink-400 backdrop-blur-sm">
                <p className="text-pink-300 text-sm font-semibold">📄 ATS Score</p>
                <p className="text-pink-400 text-xs mt-1">Resume analysis</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-4">
        <button
          onClick={onSummarize}
          className="group relative px-6 py-4 rounded-xl font-bold text-white text-lg overflow-hidden transition-all duration-300 transform hover:scale-105 active:scale-95 bg-gradient-to-r from-green-600 to-emerald-600 shadow-xl hover:shadow-2xl"
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
          <span className="relative block">📝 Summarize</span>
          <p className="text-xs text-green-200 mt-1">Extract key points</p>
        </button>

        <button
          onClick={onExplain}
          className="group relative px-6 py-4 rounded-xl font-bold text-white text-lg overflow-hidden transition-all duration-300 transform hover:scale-105 active:scale-95 bg-gradient-to-r from-blue-600 to-cyan-600 shadow-xl hover:shadow-2xl"
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
          <span className="relative block">💡 Explain</span>
          <p className="text-xs text-blue-200 mt-1">Simple explanation</p>
        </button>

        <button
          onClick={onQuiz}
          className="group relative px-6 py-4 rounded-xl font-bold text-white text-lg overflow-hidden transition-all duration-300 transform hover:scale-105 active:scale-95 bg-gradient-to-r from-orange-600 to-red-600 shadow-xl hover:shadow-2xl"
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
          <span className="relative block">❓ Quiz</span>
          <p className="text-xs text-orange-200 mt-1">Test yourself</p>
        </button>

        <button
          onClick={onATSScore}
          className="group relative px-6 py-4 rounded-xl font-bold text-white text-lg overflow-hidden transition-all duration-300 transform hover:scale-105 active:scale-95 bg-gradient-to-r from-purple-600 to-pink-600 shadow-xl hover:shadow-2xl"
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
          <span className="relative block">📄 ATS Score</span>
          <p className="text-xs text-purple-200 mt-1">Resume analysis</p>
        </button>

        <div className="border-t-2 border-slate-700 pt-4">
          <button
            onClick={onClear}
            className="w-full px-6 py-3 rounded-xl font-semibold text-slate-200 bg-slate-700 hover:bg-slate-600 transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            🔄 Clear All
          </button>
        </div>
      </div>
    </div>
  );
}

export default NoteInput;
