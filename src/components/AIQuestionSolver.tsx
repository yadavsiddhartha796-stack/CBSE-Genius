import React, { useState } from 'react';
import {
  HelpCircle,
  Sparkles,
  Camera,
  Volume2,
  VolumeX,
  Copy,
  Check,
  BookmarkPlus,
  BookOpen,
  ArrowRight,
  Loader2,
  Languages,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { aiService } from '../lib/aiService';
import { storage } from '../lib/storage';
import { getCurriculumByClass } from '../lib/cbseData';

interface AIQuestionSolverProps {
  onCompare?: (question: string) => void;
  onCreateQuiz?: (chapter: string) => void;
}

export const AIQuestionSolver: React.FC<AIQuestionSolverProps> = ({
  onCompare,
  onCreateQuiz
}) => {
  const { user, addXP } = useAuth();

  const [questionText, setQuestionText] = useState<string>('');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Advanced' | 'Olympiad'>('Medium');
  const [language, setLanguage] = useState<'English' | 'Hindi' | 'Hinglish'>('English');
  const [subject, setSubject] = useState<string>('Mathematics');
  const [isSolving, setIsSolving] = useState<boolean>(false);
  const [solution, setSolution] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [savedToNotes, setSavedToNotes] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSolve = async (action: 'solve' | 'simplify' | 'example' | 'hindi' | 'hint' = 'solve') => {
    if (!questionText.trim() && !imageBase64) {
      setErrorMsg('Please enter a question or upload an image.');
      return;
    }

    setIsSolving(true);
    setErrorMsg(null);
    setSavedToNotes(false);

    try {
      const res = await aiService.solve({
        question: questionText,
        imageBase64: imageBase64 || undefined,
        difficulty,
        language: action === 'hindi' ? 'Hindi' : language,
        classLevel: user?.classLevel || 'Class 10',
        subject,
        action
      });

      setSolution(res.answer);
      if (user) {
        addXP(25, 'Solved Question with AI');
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Failed to solve question.');
    } finally {
      setIsSolving(false);
    }
  };

  const handleTTS = () => {
    if (!solution || !('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const clean = solution.replace(/[*#_`>~]/g, '').slice(0, 500);
    const utt = new SpeechSynthesisUtterance(clean);
    utt.onend = () => setIsSpeaking(false);
    utt.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utt);
  };

  const handleSaveNote = () => {
    if (!solution || !user) return;
    storage.saveNote(user.uid, {
      id: 'note_' + Date.now(),
      userId: user.uid,
      title: questionText.slice(0, 45) || 'Solved CBSE Question',
      content: solution,
      subject,
      chapter: 'Solved Questions',
      tags: ['AI Solved', difficulty],
      updatedAt: new Date().toISOString()
    });
    setSavedToNotes(true);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-2 sm:p-4 animate-in fade-in">
      <div className="rounded-3xl bg-gradient-to-r from-amber-600/90 via-orange-600/90 to-red-600/90 p-6 sm:p-8 text-white shadow-xl border border-white/15 backdrop-blur-md">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md mb-2 border border-white/20">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Step-by-Step Pedagogical Solver</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            CBSE AI Question Solver
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-amber-100 leading-relaxed">
            Get comprehensive step-by-step solutions, key formulas, common board exam pitfalls, and hints. Does not just output the final number—teaches you the intuition.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Form */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-5 shadow-xl shadow-indigo-950/20 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                  <span>Subject</span>
                  <span className="text-[10px] text-indigo-400 font-normal">{user?.classLevel || 'Class 9'}</span>
                </label>
                <select
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-white/15 bg-slate-900 text-slate-200 backdrop-blur-md focus:outline-none"
                >
                  {getCurriculumByClass(user?.classLevel, user?.subjects).map(s => (
                    <option key={s.id} value={s.name} className="bg-slate-900 text-slate-200">
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Difficulty Level
                </label>
                <select
                  value={difficulty}
                  onChange={e => setDifficulty(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-xl border border-white/15 bg-slate-900/80 text-slate-200 backdrop-blur-md focus:outline-none"
                >
                  <option className="bg-slate-900 text-slate-200">Easy (Foundational)</option>
                  <option className="bg-slate-900 text-slate-200">Medium (CBSE Standard)</option>
                  <option className="bg-slate-900 text-slate-200">Advanced (HOTS/Exemplar)</option>
                  <option className="bg-slate-900 text-slate-200">Olympiad / NTSE</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Type or Paste Question:
              </label>
              <textarea
                value={questionText}
                onChange={e => setQuestionText(e.target.value)}
                placeholder="e.g. Prove that the lengths of tangents drawn from an external point to a circle are equal..."
                rows={5}
                className="w-full text-xs p-3.5 rounded-xl border border-white/15 bg-white/5 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 backdrop-blur-md"
              />
            </div>

            {/* Quick Sample Questions */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400">Quick Test Prompts:</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setSubject('Mathematics');
                    setQuestionText(
                      'Find the zeroes of the quadratic polynomial 6x² - 3 - 7x and verify the relationship between the zeroes and the coefficients.'
                    );
                  }}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 backdrop-blur-sm text-left transition-colors"
                >
                  📐 Quadratic Zeroes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSubject('Science');
                    setQuestionText(
                      'An electric lamp of resistance 20 Ω and a conductor of 4 Ω resistance are connected in series to a 6 V battery. Calculate the total circuit resistance and current.'
                    );
                  }}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 backdrop-blur-sm text-left transition-colors"
                >
                  ⚡ Current Electricity
                </button>
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-red-300 bg-red-950/40 p-2.5 rounded-xl border border-red-500/30 backdrop-blur-sm">
                {errorMsg}
              </p>
            )}

            <button
              id="btn-solve-question"
              onClick={() => handleSolve('solve')}
              disabled={isSolving}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-lg shadow-amber-600/20 flex items-center justify-center gap-2 disabled:opacity-60 transition-all"
            >
              {isSolving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Deriving CBSE Step-by-Step Solution...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Solve Question Step-by-Step</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Solution Output & Pedagogical Enhancements */}
        <div className="lg:col-span-6 space-y-4">
          {solution ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-5 shadow-xl shadow-indigo-950/20 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-bold text-white">
                  {subject} • {difficulty} Solution
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleTTS}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    title={isSpeaking ? 'Stop Audio' : 'Listen with Audio'}
                  >
                    {isSpeaking ? (
                      <VolumeX className="h-4 w-4 text-amber-400 animate-pulse" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(solution);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    title="Copy Solution"
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={handleSaveNote}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    title="Save to My Notes"
                  >
                    <BookmarkPlus className={`h-4 w-4 ${savedToNotes ? 'text-indigo-400' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Solution Text */}
              <div className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap max-h-[460px] overflow-y-auto pr-2">
                {solution}
              </div>

              {/* Patient Teacher Action Buttons */}
              <div className="pt-3 border-t border-white/10 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
                  Patient Teacher Actions:
                </span>
                <div className="flex flex-wrap gap-2 text-xs">
                  <button
                    onClick={() => handleSolve('simplify')}
                    className="px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 font-semibold backdrop-blur-sm transition-colors"
                  >
                    💡 Explain More Simply
                  </button>
                  <button
                    onClick={() => handleSolve('example')}
                    className="px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 font-semibold backdrop-blur-sm transition-colors"
                  >
                    🌟 Give Another Example
                  </button>
                  <button
                    onClick={() => handleSolve('hindi')}
                    className="px-3 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 font-semibold backdrop-blur-sm transition-colors"
                  >
                    🇮🇳 Explain in Hindi
                  </button>
                  <button
                    onClick={() => handleSolve('hint')}
                    className="px-3 py-1.5 rounded-xl border border-purple-500/30 bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 font-semibold backdrop-blur-sm transition-colors"
                  >
                    🔍 Show Clues Only
                  </button>
                  {onCompare && (
                    <button
                      onClick={() => onCompare(questionText)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 font-semibold backdrop-blur-sm transition-colors"
                    >
                      ⚡ Compare Multiple AIs
                    </button>
                  )}
                </div>
              </div>

              {savedToNotes && (
                <p className="text-[11px] text-emerald-400 font-semibold text-right">
                  ✓ Solution bookmarked to your Notes
                </p>
              )}
            </div>
          ) : (
            <div className="h-full min-h-[350px] rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center p-8 text-center bg-white/[0.02] backdrop-blur-md">
              <div className="h-14 w-14 rounded-2xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-400 mb-3 shadow-lg shadow-amber-500/10">
                <HelpCircle className="h-7 w-7" />
              </div>
              <h3 className="text-xs font-bold text-white">
                Solution and Concept Workspace
              </h3>
              <p className="text-[11px] text-slate-400 max-w-xs mt-1">
                Enter your question on the left. The AI will explain the concept, apply CBSE formulas, and highlight common exam traps.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
