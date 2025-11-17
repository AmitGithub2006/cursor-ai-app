'use client';

import { useState } from 'react';
import { Quiz } from '@/lib/strapi/types';

interface StrapiQuizProps {
  quiz: Quiz | null;
}

export function StrapiQuiz({ quiz }: StrapiQuizProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  if (!quiz) {
    return (
      <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm text-center text-gray-500">
        No quiz available for this subtopic yet.
      </div>
    );
  }

  const questions = quiz.attributes.questions || [];
  const score = questions.reduce((total, question, index) => {
    if (selectedAnswers[index] === question.correctOption) {
      return total + 1;
    }
    return total;
  }, 0);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
      <div>
        <h3 className="text-2xl font-bold text-green-900">{quiz.attributes.title}</h3>
        <p className="text-sm text-gray-600">Answer the questions below:</p>
      </div>
      {questions.map((question, index) => (
        <div key={index} className="space-y-2 border border-gray-100 rounded-xl p-4">
          <p className="font-semibold text-green-900">
            Q{index + 1}. {question.question}
          </p>
          {(['A', 'B', 'C', 'D'] as const).map((option) => {
            const value = question[`option${option}` as keyof typeof question] as string;
            return (
              <label
                key={option}
                className={`flex items-center gap-2 p-2 rounded-lg border transition-colors cursor-pointer ${
                  selectedAnswers[index] === option
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${index}`}
                  value={option}
                  checked={selectedAnswers[index] === option}
                  onChange={() =>
                    setSelectedAnswers((prev) => ({
                      ...prev,
                      [index]: option,
                    }))
                  }
                  className="text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">{value}</span>
              </label>
            );
          })}
        </div>
      ))}
      <button
        onClick={() => setShowResults(true)}
        className="w-full py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
      >
        Submit Quiz
      </button>
      {showResults && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 font-semibold text-center">
          You scored {score} / {questions.length}
        </div>
      )}
    </div>
  );
}

