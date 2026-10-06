import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Search,
  Filter,
  Check,
  X,
  ArrowRight,
  Flame,
  Zap,
  Trash2,
  BookmarkCheck,
  Lightbulb,
  Award,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { storage } from '../lib/storage';
import { aiService } from '../lib/aiService';
import { MistakeRecord, QuizQuestion } from '../types';
import confetti from 'canvas-confetti';

interface MistakeBookProps {
  onPracticeTopic?: (subject: string, chapter: string) => void;
  onAskTutor?: (questionContext: string) => void;
  onPracticeCustomQuiz?: (questions: QuizQuestion[]) => void;
}

export const MistakeBook: React.FC<MistakeBookProps> = ({
  onPracticeTopic,
  onAskTutor,
  onPracticeCustomQuiz
}) => {
  const { user, addXP } = useAuth();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'needs-practice' | 'mastered'>('all');

  // Load mistakes from storage
  const [mistakes, setMistakes] = useState<MistakeRecord[]>(() => {
    return user ? storage.getMistakes(user.uid) : [];
  });

  // Modal for Socratic AI Explanation
  const [activeMistakeModal, setActiveMistakeModal] = useState<MistakeRecord | null>(null);
  const [isExplaining, setIsExplaining] = useState<boolean>(false);
  const [explanationResult, setExplanationResult] = useState<any>(null);

  // Filtered mistakes
  const filteredMistakes = mistakes.filter(m => {
    const matchesSearch =
      m.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.chapter.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSubject = selectedSubject === 'all' || m.subject.toLowerCase() === selectedSubject.toLowerCase();

    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'mastered' && m.mastered) ||
      (filterStatus === 'needs-practice' && !m.mastered);

    return matchesSearch && matchesSubject && matchesStatus;
  });

  const subjectsList = Array.from(new Set(mistakes.map(m => m.subject)));

  const unmasteredCount = mistakes.filter(m => !m.mastered).length;
  const masteredCount = mistakes.filter(m => m.mastered).length;
  const masteryPercentage = mistakes.length > 0 ? Math.round((masteredCount / mistakes.length) * 100) : 100;

  // Toggle Mastery
  const handleToggleMastered = (mistake: MistakeRecord) => {
    if (!user) return;
    const newMastered = !mistake.mastered;
    storage.markMistakeMastered(user.uid, mistake.id, newMastered);
    setMistakes(storage.getMistakes(user.uid));

    if (newMastered) {
      addXP(15, 'Mastered a previously tricky question');
      try {
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
      } catch {}
    }
  };

  // Delete mistake
  const handleDeleteMistake = (mistakeId: string) => {
    if (!user) return;
    storage.deleteMistake(user.uid, mistakeId);
    setMistakes(storage.getMistakes(user.uid));
  };

  // Open Socratic Mistake Diagnosis
  const handleOpenDiagnosis = async (mistake: MistakeRecord) => {
    setActiveMistakeModal(mistake);
    setExplanationResult({
      misconception: mistake.misconception,
      correctReasoning: mistake.correctReasoning,
      examTip: mistake.examTip,
      similarQuestion: mistake.similarQuestion
    });

    if (!mistake.misconception || !mistake.correctReasoning) {
      setIsExplaining(true);
      try {
        const res = await aiService.explainMistake({
          question: mistake.question,
          studentAnswer: mistake.studentAnswer,
          correctAnswer: mistake.correctAnswer,
          subject: mistake.subject,
          chapter: mistake.chapter,
          classLevel: user?.classLevel || 'Class 10'
        });

        if (res.success && res.explanation) {
          setExplanationResult(res.explanation);

          // Update mistake record with newly fetched explanation
          const updatedMistake: MistakeRecord = {
            ...mistake,
            misconception: res.explanation.misconception,
            correctReasoning: res.explanation.correctReasoning,
            examTip: res.explanation.examTip,
            similarQuestion: res.explanation.similarQuestion
          };
          if (user) {
            storage.saveMistake(user.uid, updatedMistake);
            setMistakes(storage.getMistakes(user.uid));
          }
        }
      } catch (err) {
        console.error('Explanation error:', err);
      } finally {
        setIsExplaining(false);
      }
    }
  };

  // Practice all unmastered mistakes as a targeted quiz
  const handlePracticeUnmastered = () => {
    const unmastered = mistakes.filter(m => !m.mastered);
    if (unmastered.length === 0) return;

    if (onPracticeTopic) {
      onPracticeTopic(unmastered[0].subject, unmastered[0].chapter);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-2 sm:p-4 animate-in fade-in">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-red-600/80 via-rose-700/80 to-indigo-800/80 p-6 sm:p-8 text-white shadow-xl border border-white/15 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md border border-white/20">
              <BookOpen className="h-3.5 w-3.5 text-rose-300" />
              <span>Personalized CBSE Error Log</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              📕 My Mistake Book
            </h1>
            <p className="text-xs sm:text-sm text-rose-100 leading-relaxed">
              Every incorrect answer from quizzes and assignments is automatically remembered here. Analyze misconceptions, practice similar questions, and turn weaknesses into strengths.
            </p>
          </div>

          {unmasteredCount > 0 && (
            <button
              onClick={handlePracticeUnmastered}
              className="px-5 py-3 rounded-2xl bg-white text-slate-900 hover:bg-rose-50 font-bold text-xs sm:text-sm shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <Zap className="h-4 w-4 text-amber-500 fill-amber-500" />
              <span>Practice Unmastered ({unmasteredCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl shadow-xl space-y-1">
          <span className="text-[11px] font-bold uppercase text-slate-400 block">Total Recorded</span>
          <div className="text-2xl font-black text-white">{mistakes.length}</div>
          <span className="text-[10px] text-slate-400">Errors tracked</span>
        </div>

        <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl shadow-xl space-y-1">
          <span className="text-[11px] font-bold uppercase text-amber-300 block">Needs Practice</span>
          <div className="text-2xl font-black text-amber-400">{unmasteredCount}</div>
          <span className="text-[10px] text-amber-400/80">Active study targets</span>
        </div>

        <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl shadow-xl space-y-1">
          <span className="text-[11px] font-bold uppercase text-emerald-400 block">Mastered</span>
          <div className="text-2xl font-black text-emerald-400">{masteredCount}</div>
          <span className="text-[10px] text-emerald-400/80">Concepts cleared</span>
        </div>

        <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl shadow-xl space-y-1">
          <span className="text-[11px] font-bold uppercase text-indigo-300 block">Error Recovery Rate</span>
          <div className="text-2xl font-black text-indigo-300">{masteryPercentage}%</div>
          <span className="text-[10px] text-indigo-400">Mastery progress</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by topic, chapter, or question..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-white/15 bg-white/5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          {/* Subject Filter */}
          <select
            value={selectedSubject}
            onChange={e => setSelectedSubject(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-white/15 bg-slate-900 text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="all">All Subjects</option>
            {subjectsList.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Status Filter */}
          <div className="flex rounded-xl border border-white/15 bg-white/5 p-0.5">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterStatus === 'all' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('needs-practice')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterStatus === 'needs-practice' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Needs Practice
            </button>
            <button
              onClick={() => setFilterStatus('mastered')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterStatus === 'mastered' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Mastered
            </button>
          </div>
        </div>
      </div>

      {/* Mistake Items Grid */}
      {filteredMistakes.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-md space-y-3">
          <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <BookmarkCheck className="h-7 w-7" />
          </div>
          <h3 className="text-base font-bold text-white">
            {mistakes.length === 0
              ? 'Your Mistake Book is clean. That\'s great!'
              : 'No matching mistakes found.'}
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {mistakes.length === 0
              ? 'As you take CBSE quizzes and scan homework, any incorrect answers or tricky concepts will be automatically organized here for step-by-step revision.'
              : 'Try clearing your search query or switching subject filters.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMistakes.map((item, idx) => (
            <div
              key={item.id || idx}
              className={`p-5 rounded-3xl border backdrop-blur-2xl transition-all ${
                item.mastered
                  ? 'border-emerald-500/25 bg-emerald-950/10 shadow-lg shadow-emerald-950/10'
                  : 'border-red-500/20 bg-white/[0.03] shadow-xl hover:border-red-500/40'
              }`}
            >
              {/* Header Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-bold">
                    {item.subject}
                  </span>
                  <span className="text-slate-400">
                    {item.chapter} • <strong className="text-slate-300">{item.topic}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500">
                    {new Date(item.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>

                  <button
                    onClick={() => handleToggleMastered(item)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      item.mastered
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25'
                    }`}
                  >
                    {item.mastered ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Mastered</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-3.5 w-3.5 text-amber-400" />
                        <span>Needs Practice</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDeleteMistake(item.id)}
                    className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                    title="Remove from Mistake Book"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Question Body */}
              <div className="py-3.5 space-y-3">
                <div className="text-xs sm:text-sm font-semibold text-white leading-relaxed">
                  {item.question}
                </div>

                {/* Comparison Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/25 space-y-1">
                    <span className="text-[10px] font-bold text-red-300 uppercase tracking-wider block">
                      Your Answer:
                    </span>
                    <p className="text-red-200 font-medium">{item.studentAnswer}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 space-y-1">
                    <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">
                      Correct Answer:
                    </span>
                    <p className="text-emerald-200 font-medium">{item.correctAnswer}</p>
                  </div>
                </div>

                {/* Stored Quick Explanation */}
                {item.explanation && (
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-slate-300">
                    <strong className="text-indigo-300">Concept Note: </strong>
                    {item.explanation}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/10 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenDiagnosis(item)}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                    <span>Explain My Mistake (Socratic AI)</span>
                  </button>

                  {onAskTutor && (
                    <button
                      onClick={() => onAskTutor(`I made a mistake on this CBSE question from ${item.chapter}: "${item.question}". Please explain the step-by-step concept.`)}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <HelpCircle className="h-3.5 w-3.5 text-indigo-400" />
                      <span>Ask AI Tutor</span>
                    </button>
                  )}
                </div>

                {onPracticeTopic && (
                  <button
                    onClick={() => onPracticeTopic(item.subject, item.chapter)}
                    className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Practice {item.chapter}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Socratic Mistake Diagnosis Modal */}
      {activeMistakeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl rounded-3xl border border-white/15 bg-slate-900/95 backdrop-blur-2xl shadow-2xl p-6 sm:p-7 space-y-5 text-white max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-300">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    Socratic Mistake Diagnosis
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {activeMistakeModal.subject} • {activeMistakeModal.chapter} ({activeMistakeModal.topic})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveMistakeModal(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Question Summary */}
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2 text-xs">
              <span className="font-bold text-rose-300 block uppercase text-[10px] tracking-wider">
                Question:
              </span>
              <p className="font-semibold text-white text-xs sm:text-sm">
                {activeMistakeModal.question}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-[11px]">
                <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300">
                  <span className="font-semibold block text-[10px] text-slate-400">You Picked:</span>
                  {activeMistakeModal.studentAnswer}
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                  <span className="font-semibold block text-[10px] text-slate-400">Correct Answer:</span>
                  {activeMistakeModal.correctAnswer}
                </div>
              </div>
            </div>

            {/* AI Diagnosis Details */}
            {isExplaining ? (
              <div className="py-10 text-center space-y-3">
                <div className="h-8 w-8 rounded-full border-2 border-rose-500 border-t-transparent animate-spin mx-auto" />
                <p className="text-xs text-slate-300">
                  Your AI Learning Coach is diagnosing the exact concept gap...
                </p>
              </div>
            ) : explanationResult ? (
              <div className="space-y-4 text-xs">
                {/* Misconception */}
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-1">
                  <span className="font-bold text-amber-300 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <AlertCircle className="h-4 w-4" />
                    <span>Why This Error Occurred (Misconception):</span>
                  </span>
                  <p className="text-slate-200 leading-relaxed text-[13px]">
                    {explanationResult.misconception || 'Misinterpreted the core formula or applied standard rules incorrectly.'}
                  </p>
                </div>

                {/* Correct Reasoning */}
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-1">
                  <span className="font-bold text-emerald-300 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Correct CBSE Step Reasoning:</span>
                  </span>
                  <p className="text-slate-200 leading-relaxed text-[13px] whitespace-pre-wrap font-sans">
                    {explanationResult.correctReasoning || activeMistakeModal.explanation}
                  </p>
                </div>

                {/* Exam Tip */}
                {explanationResult.examTip && (
                  <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 flex items-start gap-2.5 text-[11px]">
                    <Lightbulb className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Board Exam Strategy:</strong>
                      <span>{explanationResult.examTip}</span>
                    </div>
                  </div>
                )}

                {/* Similar Question */}
                {explanationResult.similarQuestion && (
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-300 text-[10px] uppercase tracking-wider">
                        Similar Question for Immediate Practice:
                      </span>
                      {onAskTutor && (
                        <button
                          onClick={() => {
                            setActiveMistakeModal(null);
                            onAskTutor(`Let's solve this similar practice question: "${explanationResult.similarQuestion}"`);
                          }}
                          className="text-[11px] font-bold text-rose-400 hover:text-rose-300 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>Solve with AI Tutor</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                    <p className="text-slate-200 italic font-medium">
                      "{explanationResult.similarQuestion}"
                    </p>
                  </div>
                )}
              </div>
            ) : null}

            {/* Modal Actions */}
            <div className="pt-2 flex items-center justify-between border-t border-white/10">
              <button
                onClick={() => {
                  handleToggleMastered(activeMistakeModal);
                  setActiveMistakeModal(null);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeMistakeModal.mastered
                    ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40 hover:bg-amber-600/40'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                }`}
              >
                {activeMistakeModal.mastered ? 'Mark as Needs Practice' : '✓ Mark as Mastered'}
              </button>

              <button
                onClick={() => setActiveMistakeModal(null)}
                className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
