import React, { useState, useEffect } from 'react';
import {
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  RotateCcw,
  Flag,
  ArrowRight,
  ArrowLeft,
  Loader2,
  BookOpen,
  HelpCircle,
  Flame,
  Zap,
  BarChart3,
  Layers,
  MessageSquare,
  Check,
  X,
  TrendingUp,
  Lightbulb,
  Target
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { aiService } from '../lib/aiService';
import { storage } from '../lib/storage';
import { QuizQuestion, QuizResult } from '../types';
import { getCurriculumByClass, getChaptersForSubject } from '../lib/cbseData';
import confetti from 'canvas-confetti';

interface QuizGeneratorProps {
  initialSubject?: string;
  initialChapter?: string;
  onAskTutor?: (question: string) => void;
}

const QUESTION_TYPES = [
  { id: 'mixed', label: 'Mixed CBSE Format', desc: 'MCQs, Assertion-Reason & Case Questions' },
  { id: 'MCQ', label: 'Multiple Choice (MCQ)', desc: 'Standard 4-option questions with 1 correct answer' },
  { id: 'Assertion-Reason', label: 'Assertion & Reason', desc: 'CBSE pattern Statement (A) and Reason (R)' },
  { id: 'True/False', label: 'True / False', desc: 'Rapid concept verification' },
  { id: 'Case-based', label: 'Case-Based / Competency', desc: 'Application and real-world scenario questions' }
];

export const QuizGenerator: React.FC<QuizGeneratorProps> = ({
  initialSubject = 'Science',
  initialChapter = 'Motion',
  onAskTutor
}) => {
  const { user, addXP } = useAuth();
  const userClass = user?.classLevel || 'Class 9';
  const availableCurriculumSubjects = getCurriculumByClass(userClass, user?.subjects);

  // Generator Config
  const [subject, setSubject] = useState<string>(initialSubject || availableCurriculumSubjects[0]?.name || 'Science');
  const availableChapters = getChaptersForSubject(userClass, subject);
  const [chapter, setChapter] = useState<string>(initialChapter || availableChapters[0]?.title || 'Motion');
  const [count, setCount] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | 'Mixed'>('Medium');
  const [questionType, setQuestionType] = useState<string>('mixed');
  const [isTimed, setIsTimed] = useState<boolean>(true);

  // Improvement comparison state (for learning loop)
  const [previousScorePct, setPreviousScorePct] = useState<number | null>(null);

  // When subject changes, reset default chapter
  const handleSubjectChange = (newSubject: string) => {
    setSubject(newSubject);
    const chs = getChaptersForSubject(userClass, newSubject);
    if (chs.length > 0) {
      setChapter(chs[0].title);
    }
  };

  // Quiz State
  const [quizState, setQuizState] = useState<'config' | 'playing' | 'result'>('config');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});
  const [startTime, setStartTime] = useState<number>(0);
  const [timeTakenSeconds, setTimeTakenSeconds] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 mins default
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Mistake deep explanation modal state
  const [explainingQuestion, setExplainingQuestion] = useState<{
    q: QuizQuestion;
    studentAnswerText: string;
    correctAnswerText: string;
  } | null>(null);
  const [mistakeData, setMistakeData] = useState<any>(null);
  const [isLoadingMistake, setIsLoadingMistake] = useState<boolean>(false);

  // Timer effect
  useEffect(() => {
    if (quizState !== 'playing' || !isTimed) return;
    if (timeLeft <= 0) {
      handleSubmitQuiz();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [quizState, isTimed, timeLeft]);

  // Generate Quiz
  const handleStartQuiz = async (customConfig?: {
    overrideSubject?: string;
    overrideChapter?: string;
    retryQuestions?: QuizQuestion[];
    preservePrevScore?: number;
  }) => {
    setIsGenerating(true);
    setErrorMsg(null);

    if (customConfig?.preservePrevScore !== undefined) {
      setPreviousScorePct(customConfig.preservePrevScore);
    }

    // If retry questions are passed directly
    if (customConfig?.retryQuestions && customConfig.retryQuestions.length > 0) {
      setQuestions(customConfig.retryQuestions);
      setSelectedAnswers({});
      setFlagged({});
      setCurrentIndex(0);
      setStartTime(Date.now());
      setTimeLeft(customConfig.retryQuestions.length * 60);
      setQuizState('playing');
      setIsGenerating(false);
      return;
    }

    const targetSubj = customConfig?.overrideSubject || subject;
    const targetChap = customConfig?.overrideChapter || chapter;

    try {
      const res: any = await aiService.generateQuiz({
        subject: targetSubj,
        chapter: targetChap,
        classLevel: user?.classLevel || 'Class 9',
        questionCount: count,
        difficulty,
        questionTypes: [questionType]
      });

      const questionList = res.quiz?.questions || res.questions || [];
      if (questionList && questionList.length > 0) {
        setQuestions(questionList);
        setSelectedAnswers({});
        setFlagged({});
        setCurrentIndex(0);
        setStartTime(Date.now());
        setTimeLeft(questionList.length * 60);
        setQuizState('playing');
      } else {
        throw new Error('No questions returned for this topic.');
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'We couldn\'t generate this quiz right now. Please check connection and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Submit Quiz
  const handleSubmitQuiz = () => {
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    setTimeTakenSeconds(elapsed > 0 ? elapsed : count * 45);

    let score = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        score++;
      }
    });

    const percentage = Math.round((score / questions.length) * 100);
    const xpEarned = score * 20;

    const result: QuizResult = {
      id: 'quiz_' + Date.now(),
      userId: user?.uid || 'guest',
      subject,
      chapter,
      score,
      correctCount: score,
      totalQuestions: questions.length,
      percentage,
      scorePercentage: percentage,
      date: new Date().toISOString(),
      questions,
      selectedAnswers
    };

    setQuizResult(result);
    setQuizState('result');

    if (user) {
      storage.saveQuizResult(user.uid, result);
      addXP(xpEarned, `Completed CBSE Quiz (${percentage}%)`);

      // Archive mistakes into 📕 My Mistake Book
      const mistakesToArchive = questions
        .map((q, idx) => {
          const studentAnsIdx = selectedAnswers[idx];
          const isCorrect = studentAnsIdx === q.correctAnswer;
          if (isCorrect) return null;

          const studentAnswerText = studentAnsIdx !== undefined && q.options[studentAnsIdx] ? q.options[studentAnsIdx] : 'Skipped / Unanswered';
          const correctAnswerText = q.options[q.correctAnswer] || String(q.correctAnswer);

          return {
            id: 'mistake_' + Date.now() + '_' + idx,
            userId: user.uid,
            question: q.question,
            options: q.options,
            studentAnswer: studentAnswerText,
            correctAnswer: correctAnswerText,
            explanation: q.explanation || 'Reviewed as part of CBSE standard evaluation.',
            subject,
            chapter,
            topic: q.topic || chapter,
            source: 'quiz' as const,
            mastered: false,
            timestamp: new Date().toISOString()
          };
        })
        .filter(Boolean) as any[];

      if (mistakesToArchive.length > 0) {
        storage.saveMistakesBatch(user.uid, mistakesToArchive);
      }
    }

    if (percentage >= 70) {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  // "Practice My Weakness" Action
  const handlePracticeMyWeakness = () => {
    if (!quizResult) return;
    const incorrectQuestions = quizResult.questions.filter((q, idx) => quizResult.selectedAnswers[idx] !== q.correctAnswer);
    const prev = quizResult.percentage;

    if (incorrectQuestions.length > 0) {
      handleStartQuiz({ retryQuestions: incorrectQuestions, preservePrevScore: prev });
    } else {
      handleStartQuiz({ preservePrevScore: prev });
    }
  };

  // Open "Explain My Mistake" Socratic Modal
  const handleOpenExplainMistake = async (q: QuizQuestion, studentAnswerIdx: number | undefined) => {
    const studentAnswerText = studentAnswerIdx !== undefined ? q.options[studentAnswerIdx] : 'Unanswered / Skipped';
    const correctAnswerText = q.options[q.correctAnswer] || String(q.correctAnswer);

    setExplainingQuestion({
      q,
      studentAnswerText,
      correctAnswerText
    });
    setMistakeData(null);
    setIsLoadingMistake(true);

    try {
      const res = await aiService.explainMistake({
        question: q.question,
        studentAnswer: studentAnswerText,
        correctAnswer: correctAnswerText,
        subject,
        chapter,
        classLevel: userClass
      });
      if (res.success && res.explanation) {
        setMistakeData(res.explanation);
      }
    } catch (e: any) {
      setMistakeData({
        studentAction: `Selected: ${studentAnswerText}`,
        misconception: 'Concept confusion or miscalculation during step derivation.',
        correctReasoning: q.explanation || `The correct answer is ${correctAnswerText}.`,
        correctAnswer: correctAnswerText,
        examTip: 'Review NCERT textbook definitions and verify units before selecting.',
        similarQuestion: `Practice similar question on ${chapter}`
      });
    } finally {
      setIsLoadingMistake(false);
    }
  };

  const currentQ = questions[currentIndex];

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-2 sm:p-4 animate-in fade-in">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-700/80 via-teal-700/80 to-indigo-800/80 p-6 sm:p-8 text-white shadow-xl border border-white/15 backdrop-blur-md">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md mb-2 border border-white/20">
            <Award className="h-3.5 w-3.5" />
            <span>LEARN → PRACTICE → ANALYZE → IMPROVE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            AI Quiz & Diagnostic Coach
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-emerald-100 leading-relaxed">
            Generate adaptive practice tests for <span className="font-bold text-white">{userClass}</span>. Automatic mistake detection isolates knowledge gaps for instant 1-click targeted improvement.
          </p>
        </div>
      </div>

      {quizState === 'config' && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6 shadow-xl shadow-indigo-950/20 max-w-2xl mx-auto space-y-5">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-white/10">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span>Customize Assessment Test</span>
          </h2>

          <div className="space-y-4 text-xs">
            {/* Subject Selection */}
            <div>
              <label className="block font-semibold text-slate-200 mb-1 flex items-center justify-between">
                <span>Subject:</span>
                <span className="text-[10px] text-emerald-400 font-normal">{userClass} CBSE Syllabus</span>
              </label>
              <select
                value={subject}
                onChange={e => handleSubjectChange(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-white/15 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 backdrop-blur-md"
              >
                {availableCurriculumSubjects.map(s => (
                  <option key={s.id} value={s.name} className="bg-slate-900 text-white">
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Chapter Selection */}
            <div>
              <label className="block font-semibold text-slate-200 mb-1 flex items-center justify-between">
                <span>NCERT Chapter:</span>
                <span className="text-[10px] text-slate-400">{availableChapters.length} Chapters</span>
              </label>
              <select
                value={chapter}
                onChange={e => setChapter(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-white/15 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 backdrop-blur-md"
              >
                {availableChapters.map(c => (
                  <option key={c.id} value={c.title} className="bg-slate-900 text-white">
                    Ch {c.number}: {c.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Question Type Selection */}
            <div>
              <label className="block font-semibold text-slate-200 mb-1.5">
                Question Format:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {QUESTION_TYPES.map(type => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setQuestionType(type.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      questionType === type.id
                        ? 'border-emerald-400 bg-emerald-500/20 text-white shadow-sm'
                        : 'border-white/10 bg-white/5 hover:bg-white/10 text-slate-300'
                    }`}
                  >
                    <p className="font-bold text-xs">{type.label}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{type.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Question Count & Difficulty */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-200 mb-1">
                  Number of Questions:
                </label>
                <div className="flex gap-2">
                  {[3, 5, 10].map(n => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setCount(n)}
                      className={`flex-1 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                        count === n
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {n} Qs
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-200 mb-1">
                  Difficulty Level:
                </label>
                <select
                  value={difficulty}
                  onChange={e => setDifficulty(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-white/15 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 backdrop-blur-md"
                >
                  <option value="Easy" className="bg-slate-900 text-white">Foundation (Easy)</option>
                  <option value="Medium" className="bg-slate-900 text-white">Standard (Medium)</option>
                  <option value="Hard" className="bg-slate-900 text-white">Exemplar / Board (Hard)</option>
                  <option value="Mixed" className="bg-slate-900 text-white">Mixed Difficulty</option>
                </select>
              </div>
            </div>

            {/* Timed Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
              <div>
                <span className="font-bold text-white block">Timed Exam Mode</span>
                <span className="text-[11px] text-slate-400">60 seconds per question with live countdown</span>
              </div>
              <input
                type="checkbox"
                checked={isTimed}
                onChange={e => setIsTimed(e.target.checked)}
                className="h-4 w-4 rounded accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span>{errorMsg}</span>
                <button
                  type="button"
                  onClick={() => handleStartQuiz()}
                  className="block mt-1 font-bold underline text-rose-200 hover:text-white cursor-pointer"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          <button
            id="btn-generate-quiz"
            onClick={() => handleStartQuiz()}
            disabled={isGenerating}
            className="w-full py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-xl shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Creating your personalized quiz...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Launch Quiz ({count} Questions)</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      )}

      {quizState === 'playing' && currentQ && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6 shadow-xl shadow-indigo-950/20 max-w-3xl mx-auto space-y-6 animate-in fade-in">
          {/* Quiz Header with Timer & Progress */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-emerald-400">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400 font-medium">{subject}</span>
            </div>

            {isTimed && (
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-mono font-bold text-xs backdrop-blur-sm ${
                timeLeft < 60 ? 'bg-red-500/20 text-red-300 border border-red-500/30 animate-pulse' : 'bg-white/10 text-slate-200 border border-white/15'
              }`}>
                <Clock className="h-3.5 w-3.5 text-emerald-400" />
                <span>
                  {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                </span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question Text */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold text-indigo-300 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
              {currentQ.type || 'CBSE Question'}
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-white leading-relaxed">
              {currentQ.question}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = selectedAnswers[currentIndex] === optIdx;
              return (
                <button
                  key={optIdx}
                  onClick={() =>
                    setSelectedAnswers(prev => ({ ...prev, [currentIndex]: optIdx }))
                  }
                  className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center gap-3 backdrop-blur-sm cursor-pointer ${
                    isSelected
                      ? 'border-emerald-400 bg-emerald-500/20 text-white shadow-md'
                      : 'border-white/10 bg-white/5 hover:border-emerald-400/40 text-slate-300'
                  }`}
                >
                  <span
                    className={`h-6 w-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                      isSelected
                        ? 'bg-emerald-500 text-white'
                        : 'bg-white/10 text-slate-400'
                    }`}
                  >
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Bottom Controls */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <button
              onClick={() =>
                setFlagged(prev => ({ ...prev, [currentIndex]: !prev[currentIndex] }))
              }
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors backdrop-blur-sm cursor-pointer ${
                flagged[currentIndex]
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Flag className="h-3.5 w-3.5" />
              <span>{flagged[currentIndex] ? 'Flagged' : 'Flag for Review'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="px-3 py-2 rounded-xl text-xs font-semibold border border-white/15 bg-white/5 text-slate-300 hover:bg-white/10 disabled:opacity-40 transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>

              {currentIndex < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIndex(prev => prev + 1)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                >
                  <span>Next</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  id="btn-submit-test"
                  onClick={handleSubmitQuiz}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Submit Assessment</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {quizState === 'result' && quizResult && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6 shadow-xl shadow-indigo-950/20 max-w-3xl mx-auto space-y-6 animate-in fade-in">
          {/* Result Card Header */}
          <div className="text-center space-y-2 pb-4 border-b border-white/10">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              {quizResult.subject} • {quizResult.chapter}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Score: {quizResult.score} / {quizResult.totalQuestions} ({quizResult.percentage}%)
            </h2>

            {/* Improvement Trend Comparison (Learning Loop) */}
            {previousScorePct !== null && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                <TrendingUp className="h-4 w-4" />
                <span>
                  Previous: {previousScorePct}% → New: {quizResult.percentage}% ({quizResult.percentage >= previousScorePct ? `+${quizResult.percentage - previousScorePct}% Improvement!` : 'Keep practicing!'})
                </span>
              </div>
            )}

            <p className="text-xs text-slate-300 mt-1">
              {quizResult.percentage >= 80
                ? '🌟 Outstanding! You have solid conceptual clarity in this chapter.'
                : quizResult.percentage >= 60
                ? '👍 Good performance! Review the step explanations below for full marks.'
                : `⚠️ Needs practice in ${quizResult.chapter}. Tap "Practice My Weakness" to reach 90%+ mastery.`}
            </p>

            {/* Performance KPIs */}
            <div className="grid grid-cols-3 gap-3 pt-3 max-w-md mx-auto text-center">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Accuracy</span>
                <span className="text-base font-black text-emerald-400">{quizResult.percentage}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Time Taken</span>
                <span className="text-base font-black text-slate-200">{timeTakenSeconds}s</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">XP Gained</span>
                <span className="text-base font-black text-purple-300">+{quizResult.score * 20} XP</span>
              </div>
            </div>
          </div>

          {/* SIGNATURE ACTION: "Practice My Weakness" */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900/80 to-purple-950/80 border border-indigo-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-indigo-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Automated Weakness Analysis
                </span>
              </div>
              <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full border border-indigo-500/30">
                {quizResult.totalQuestions - quizResult.score} Mistakes Found
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {quizResult.totalQuestions - quizResult.score > 0
                ? `Your performance shows you need more practice with ${quizResult.chapter}. Tap below to launch an instant targeted booster quiz focused solely on your mistakes.`
                : `Flawless score! You demonstrated 100% mastery in ${quizResult.chapter}. Ready to advance to the next CBSE chapter?`}
            </p>

            <button
              id="btn-practice-my-weakness"
              onClick={handlePracticeMyWeakness}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-black text-xs sm:text-sm shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Practice My Weakness ({quizResult.totalQuestions - quizResult.score > 0 ? `${quizResult.totalQuestions - quizResult.score} Questions` : 'New Booster Quiz'})</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Question Breakdown with "Explain My Mistake" buttons */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Detailed Question-by-Question Analysis:
            </h4>

            {quizResult.questions.map((q, idx) => {
              const studentAnswer = quizResult.selectedAnswers[idx];
              const isCorrect = studentAnswer === q.correctAnswer;

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border text-xs space-y-2.5 backdrop-blur-sm ${
                    isCorrect
                      ? 'border-emerald-500/30 bg-emerald-500/10'
                      : 'border-red-500/30 bg-red-500/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-white">
                      Q{idx + 1}. {q.question}
                    </p>
                    {isCorrect ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                        +20 XP Correct
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/30 shrink-0">
                        Incorrect
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 text-[11px]">
                    <p className="text-slate-300">
                      Your answer:{' '}
                      <span className={isCorrect ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                        {studentAnswer !== undefined ? q.options[studentAnswer] : 'Unanswered'}
                      </span>
                    </p>
                    {!isCorrect && (
                      <p className="text-emerald-300 font-bold">
                        Correct answer: {q.options[q.correctAnswer]}
                      </p>
                    )}
                  </div>

                  {q.explanation && (
                    <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-[11px] text-slate-200 backdrop-blur-sm">
                      <span className="font-bold text-white">CBSE Concept: </span>
                      {q.explanation}
                    </div>
                  )}

                  {/* Socratic "Explain My Mistake" Action */}
                  {!isCorrect && (
                    <div className="pt-1 flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleOpenExplainMistake(q, studentAnswer)}
                        className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/30 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <HelpCircle className="h-3.5 w-3.5 text-red-300" />
                        <span>Explain My Mistake</span>
                      </button>

                      {onAskTutor && (
                        <button
                          onClick={() => onAskTutor(`Explain this CBSE question step-by-step: "${q.question}"`)}
                          className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>Ask AI Teacher directly</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/10">
            <button
              onClick={() => setQuizState('config')}
              className="px-4 py-2 rounded-xl text-xs font-bold border border-white/15 bg-white/5 text-slate-200 hover:bg-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Configure New Quiz</span>
            </button>

            <button
              onClick={() => handleStartQuiz()}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all cursor-pointer"
            >
              Generate New Topic Quiz
            </button>
          </div>
        </div>
      )}

      {/* "Explain My Mistake" Socratic Modal */}
      {explainingQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-xl rounded-3xl border border-white/15 bg-slate-900/95 backdrop-blur-2xl shadow-2xl p-6 sm:p-7 space-y-5 text-white max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-300">
                  <AlertCircle className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Socratic Mistake Diagnosis
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Understanding why it was wrong & how to solve it correctly
                  </p>
                </div>
              </div>
              <button
                onClick={() => setExplainingQuestion(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Question Recap */}
            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1.5 text-xs">
              <span className="font-bold text-indigo-300 block uppercase text-[10px]">Question:</span>
              <p className="font-bold text-white">{explainingQuestion.q.question}</p>
              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300">
                  <span className="font-semibold block text-[10px] text-slate-400">You Picked:</span>
                  {explainingQuestion.studentAnswerText}
                </div>
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                  <span className="font-semibold block text-[10px] text-slate-400">Correct Answer:</span>
                  {explainingQuestion.correctAnswerText}
                </div>
              </div>
            </div>

            {/* AI Breakdown Body */}
            {isLoadingMistake ? (
              <div className="py-12 text-center space-y-3">
                <Loader2 className="h-7 w-7 text-indigo-400 animate-spin mx-auto" />
                <p className="text-xs text-slate-300">
                  Your AI Learning Coach is diagnosing the exact misconception...
                </p>
              </div>
            ) : mistakeData ? (
              <div className="space-y-3.5 text-xs">
                {/* Misconception */}
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-1">
                  <span className="font-bold text-amber-300 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>Why This Error Occurred (Misconception):</span>
                  </span>
                  <p className="text-slate-300 leading-relaxed text-[12px]">
                    {mistakeData.misconception}
                  </p>
                </div>

                {/* Correct Reasoning */}
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-1">
                  <span className="font-bold text-emerald-300 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Correct CBSE Step Reasoning:</span>
                  </span>
                  <p className="text-slate-200 leading-relaxed text-[12px] whitespace-pre-wrap font-mono">
                    {mistakeData.correctReasoning}
                  </p>
                </div>

                {/* Exam Tip */}
                {mistakeData.examTip && (
                  <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 flex items-start gap-2 text-[11px]">
                    <Lightbulb className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">Board Exam Tip:</span>
                      <span>{mistakeData.examTip}</span>
                    </div>
                  </div>
                )}

                {/* Similar Practice Question */}
                {mistakeData.similarQuestion && (
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                    <span className="font-bold text-slate-300 block text-[10px] uppercase tracking-wider">
                      Similar Question for Immediate Practice:
                    </span>
                    <p className="text-slate-200 italic">{mistakeData.similarQuestion}</p>
                  </div>
                )}
              </div>
            ) : null}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setExplainingQuestion(null)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md cursor-pointer"
              >
                Got It, Continue Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
