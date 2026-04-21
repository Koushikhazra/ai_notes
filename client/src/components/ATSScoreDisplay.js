import React from "react";

function ATSScoreDisplay({ atsScore }) {
  if (!atsScore) return null;

  const { totalScore, scoreBreakdown, strengths, weaknesses, recommendations, atsCompatibility, summary } = atsScore;

  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-amber-400";
    return "text-red-400";
  };

  const getCompatibilityColor = (compatibility) => {
    if (compatibility === "High") return "from-emerald-600 to-green-600";
    if (compatibility === "Medium") return "from-amber-600 to-yellow-600";
    return "from-red-600 to-rose-600";
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
          <h2 className="text-3xl font-bold text-white">📄 Resume Score</h2>
          <p className="text-purple-100 mt-1">How your resume ranks with hiring systems</p>
        </div>

        {/* Main Score Card */}
        <div className="p-8">
          <div className={`bg-gradient-to-br ${getCompatibilityColor(atsCompatibility)} rounded-xl p-8 text-center mb-8 shadow-lg`}>
            <h3 className="text-lg font-bold text-white mb-2">Overall ATS Score</h3>
            <div className="flex items-center justify-center gap-4">
              <div className="text-7xl font-bold text-white">{totalScore}</div>
              <div className="text-right">
                <p className="text-3xl font-bold text-white">/100</p>
                <p className={`text-xl font-bold mt-2 ${atsCompatibility === "High" ? "text-emerald-100" : atsCompatibility === "Medium" ? "text-amber-100" : "text-red-100"}`}>
                  {atsCompatibility} Compatibility
                </p>
              </div>
            </div>
          </div>

          {/* Summary */}
          {summary && (
            <div className="bg-purple-900/20 border-l-4 border-purple-400 p-5 rounded-lg mb-8 backdrop-blur-sm">
              <p className="text-slate-300">{summary}</p>
            </div>
          )}

          {/* Score Breakdown */}
          {scoreBreakdown && (
            <div className="mb-8">
              <h4 className="text-xl font-bold text-slate-200 mb-5">Score Breakdown</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(scoreBreakdown).map(([category, score]) => (
                  <div key={category} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-300 font-semibold capitalize">{category.replace(/([A-Z])/g, " $1")}</span>
                      <span className={`font-bold text-lg ${getScoreColor(score)}`}>{score}</span>
                    </div>
                    <div className="w-full bg-slate-600 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          score >= 80 ? "bg-emerald-500" : score >= 60 ? "bg-amber-500" : "bg-red-500"
                        }`}
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Strengths */}
          {strengths && strengths.length > 0 && (
            <div className="mb-8">
              <h4 className="text-xl font-bold text-emerald-400 mb-4">✨ Strengths</h4>
              <div className="space-y-3">
                {strengths.map((strength, index) => (
                  <div key={index} className="bg-emerald-900/20 border-l-4 border-emerald-400 p-4 rounded-lg backdrop-blur-sm">
                    <p className="text-slate-300">✓ {strength}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Weaknesses */}
          {weaknesses && weaknesses.length > 0 && (
            <div className="mb-8">
              <h4 className="text-xl font-bold text-red-400 mb-4">⚠️ Areas to Improve</h4>
              <div className="space-y-3">
                {weaknesses.map((weakness, index) => (
                  <div key={index} className="bg-red-900/20 border-l-4 border-red-400 p-4 rounded-lg backdrop-blur-sm">
                    <p className="text-slate-300">× {weakness}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {recommendations && recommendations.length > 0 && (
            <div className="mb-8">
              <h4 className="text-xl font-bold text-blue-400 mb-4">💡 Recommendations</h4>
              <div className="space-y-3">
                {recommendations.map((recommendation, index) => (
                  <div key={index} className="bg-blue-900/20 border-l-4 border-blue-400 p-4 rounded-lg backdrop-blur-sm">
                    <p className="text-slate-300">{index + 1}. {recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="px-8 pb-8 flex flex-wrap gap-3">
          <button
            onClick={() => {
              const text = `ATS Score: ${totalScore}/100\nCompatibility: ${atsCompatibility}\n\nSummary: ${summary}\n\nScore Breakdown:\n${Object.entries(scoreBreakdown).map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nStrengths:\n${strengths.map(s => `- ${s}`).join("\n")}\n\nWeaknesses:\n${weaknesses.map(w => `- ${w}`).join("\n")}\n\nRecommendations:\n${recommendations.map((r, i) => `${i + 1}. ${r}`).join("\n")}`;
              navigator.clipboard.writeText(text);
              alert("ATS Score copied to clipboard!");
            }}
            className="flex-1 min-w-[150px] py-3 px-4 rounded-xl font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            📋 Copy Report
          </button>
          <button
            onClick={() => {
              const text = `ATS Score: ${totalScore}/100\nCompatibility: ${atsCompatibility}\n\nSummary: ${summary}\n\nScore Breakdown:\n${Object.entries(scoreBreakdown).map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nStrengths:\n${strengths.map(s => `- ${s}`).join("\n")}\n\nWeaknesses:\n${weaknesses.map(w => `- ${w}`).join("\n")}\n\nRecommendations:\n${recommendations.map((r, i) => `${i + 1}. ${r}`).join("\n")}`;
              const element = document.createElement("a");
              element.setAttribute(
                "href",
                "data:text/plain;charset=utf-8," + encodeURIComponent(text)
              );
              element.setAttribute("download", "ats-score-report.txt");
              element.style.display = "none";
              document.body.appendChild(element);
              element.click();
              document.body.removeChild(element);
            }}
            className="flex-1 min-w-[150px] py-3 px-4 rounded-xl font-semibold bg-pink-600 hover:bg-pink-700 text-white shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            ⬇️ Download
          </button>
        </div>
      </div>
    </div>
  );
}

export default ATSScoreDisplay;
