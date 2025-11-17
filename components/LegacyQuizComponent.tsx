'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { Concept } from '@/types';
import { CheckCircle2, XCircle, ArrowLeft, Award, Trophy } from 'lucide-react';

interface QuizComponentProps {
  concept: Concept;
  onComplete: () => void;
  onBack: () => void;
}

export default function QuizComponent({ concept, onComplete, onBack }: QuizComponentProps) {
  const { completeQuiz } = useStore();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const quiz = concept.quiz;
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const newAnswers = [...answers, isCorrect];
    setAnswers(newAnswers);
    setShowResult(true);

    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      // Calculate final score
      const finalScore = Math.round((score / quiz.questions.length) * 100);
      completeQuiz(concept.id, finalScore);
      onComplete();
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const progressPercentage = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  const finalScore = Math.round((score / quiz.questions.length) * 100);
  const passed = finalScore >= quiz.passingScore;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-green-700 hover:text-green-900 mb-4 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Videos
        </button>
        <h2 className="text-3xl font-bold text-green-800 mb-2">
          Quiz: {concept.title}
        </h2>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <motion.div
            className="bg-green-600 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="text-sm text-gray-600">
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">
          {currentQuestion.question}
        </h3>

        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === currentQuestion.correctAnswer;
            const showCorrectness = showResult;

            return (
              <motion.button
                key={index}
                onClick={() => !showResult && handleAnswerSelect(index)}
                disabled={showResult}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  showCorrectness
                    ? isCorrect
                      ? 'border-green-500 bg-green-50'
                      : isSelected && !isCorrect
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 bg-white'
                    : isSelected
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-white hover:border-green-300'
                }`}
                whileHover={!showResult ? { scale: 1.02 } : {}}
                whileTap={!showResult ? { scale: 0.98 } : {}}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-800">{option}</span>
                  {showCorrectness && (
                    <>
                      {isCorrect && (
                        <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                      )}
                      {isSelected && !isCorrect && (
                        <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                      )}
                    </>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {showResult && currentQuestion.explanation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl"
          >
            <p className="text-blue-800">
              <strong>Explanation:</strong> {currentQuestion.explanation}
            </p>
          </motion.div>
        )}
      </div>

      <div className="flex justify-end gap-4">
        {!showResult ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={selectedAnswer === null}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-green-700 transition-colors"
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            {isLastQuestion ? (
              <>
                <Trophy className="w-5 h-5" />
                Finish Quiz
              </>
            ) : (
              'Next Question'
            )}
          </button>
        )}
      </div>

      {/* Final Results */}
      {isLastQuestion && showResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-300 text-center"
        >
          <Award className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-green-800 mb-2">
            {passed ? 'Congratulations! 🎉' : 'Keep Learning!'}
          </h3>
          <p className="text-lg text-gray-700 mb-4">
            Your Score: <span className="font-bold text-green-700">{finalScore}%</span>
          </p>
          {passed ? (
            <p className="text-green-700 font-semibold">
              You've completed this concept! Continue to unlock more regions.
            </p>
          ) : (
            <p className="text-gray-700">
              You need {quiz.passingScore}% to pass. Review the videos and try again!
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
}

