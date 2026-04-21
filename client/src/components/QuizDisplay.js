import React, { useState } from "react";

function QuizDisplay({ quiz }) {
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers({
      ...answers,
      [questionIndex]: answer,
    });
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const score = calculateScore();
  const percentage = Math.round((score / quiz.length) * 100);
  const allAnswered = quiz.length === Object.keys(answers).length;

  const getScoreFeedback = () => {
    if (percentage >= 90) return "🌟 Outstanding! You've mastered this!";
    if (percentage >= 80) return "🎉 Excellent! Great understanding!";
    if (percentage >= 70) return "👍 Good! You're on the right track!";
    if (percentage >= 50) return "📚 Fair! Keep studying!";
    return "💪 Keep practicing and you'll improve!";
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
        <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6">
          <h2 className="text-3xl font-bold text-white">❓ Test Your Knowledge</h2>
          <p className="text-orange-100 mt-1">Answer all questions to see your score</p>
        </div>

        {/* Progress Bar */}
        {!showResults && (
          <div className="px-8 pt-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-slate-400">
                Progress: {Object.keys(answers).length}/{quiz.length}
              </span>
              <span className="text-sm font-semibold text-slate-400">
                {Math.round((Object.keys(answers).length / quiz.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(Object.keys(answers).length / quiz.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        )}

        {/* Questions */}
        <div className="p-8">
          {!showResults ? (
            <div className="space-y-6">
              {quiz.map((question, qIndex) => (
                <div
                  key={qIndex}
                  className="border-2 border-slate-600 rounded-xl p-6 hover:border-orange-400 transition-colors bg-slate-700/30"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-200 flex-1">
                      <span className="bg-orange-600 text-orange-100 px-3 py-1 rounded-full text-sm mr-3">
                        Q{qIndex + 1}
                      </span>
                      {question.question}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {question.options.map((option, oIndex) => {
                      const optionLabel = String.fromCharCode(65 + oIndex);
                      const isSelected = answers[qIndex] === optionLabel;

                      return (
                        <label
                          key={oIndex}
                          className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                            isSelected
                              ? "border-orange-500 bg-orange-900/30 backdrop-blur-sm"
                              : "border-slate-600 hover:border-slate-500 hover:bg-slate-600/20"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${qIndex}`}
                            value={optionLabel}
                            checked={isSelected}
                            onChange={() => handleAnswerChange(qIndex, optionLabel)}
                            className="mr-4 w-5 h-5 accent-orange-500"
                          />
                          <span className="font-bold text-slate-300 mr-3 min-w-[30px]">
                            {optionLabel}.
                          </span>
                          <span className="text-slate-200">{option}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Results View
            <div className="space-y-6">
              {/* Score Card */}
              <div className="bg-gradient-to-br from-orange-900/40 to-red-900/40 rounded-xl p-8 text-center border-2 border-orange-500/30 backdrop-blur-sm">
                <h3 className="text-2xl font-bold text-slate-200 mb-4">Your Score</h3>
                <div className="mb-6">
                  <div className="text-6xl font-bold text-orange-400 mb-2">
                    {score}/{quiz.length}
                  </div>
                  <div className="text-4xl font-bold text-red-400 mb-4">
                    {percentage}%
                  </div>
                </div>
                <p className="text-xl text-slate-300 mb-2 font-semibold">
                  {getScoreFeedback()}
                </p>
              </div>

              {/* Review Answers */}
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-slate-200">Review Your Answers:</h4>
                {quiz.map((question, qIndex) => {
                  const userAnswer = answers[qIndex];
                  const correctAnswer = question.correctAnswer;
                  const isCorrect = userAnswer === correctAnswer;

                  return (
                    <div
                      key={qIndex}
                      className={`border-2 rounded-lg p-4 backdrop-blur-sm ${
                        isCorrect
                          ? "border-emerald-500/30 bg-emerald-900/30"
                          : "border-red-500/30 bg-red-900/30"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-semibold text-slate-200 flex-1">
                          Q{qIndex + 1}. {question.question}
                        </h5>
                        {isCorrect ? (
                          <span className="text-emerald-400 font-bold ml-2">✓ Correct</span>
                        ) : (
                          <span className="text-red-400 font-bold ml-2">✗ Incorrect</span>
                        )}
                      </div>
                      <div className="text-sm text-slate-300">
                        <p>Your answer: <span className="font-semibold">{userAnswer}. {question.options[userAnswer.charCodeAt(0) - 65]}</span></p>
                        {!isCorrect && (
                          <p className="text-emerald-400 mt-2">Correct answer: <span className="font-semibold">{correctAnswer}. {question.options[correctAnswer.charCodeAt(0) - 65]}</span></p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="px-8 pb-8">
          {!showResults ? (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered}
              className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                allAnswered
                  ? "bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg"
                  : "bg-slate-700 text-slate-500 cursor-not-allowed"
              }`}
            >
              Submit Quiz ({Object.keys(answers).length}/{quiz.length} answered)
            </button>
          ) : (
            <button
              onClick={() => {
                setAnswers({});
                setShowResults(false);
              }}
              className="w-full py-4 px-6 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-slate-600 to-slate-700 shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              🔄 Retake Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuizDisplay;
