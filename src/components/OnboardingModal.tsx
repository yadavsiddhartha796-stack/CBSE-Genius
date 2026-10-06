import React, { useState } from 'react';
import {
  Sparkles,
  GraduationCap,
  BookOpen,
  Calendar,
  Clock,
  AlertTriangle,
  ArrowRight,
  Check,
  Zap,
  Target
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CBSE_CLASSES } from '../lib/cbseData';
import confetti from 'canvas-confetti';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ALL_SUBJECTS = [
  'Mathematics',
  'Science',
  'Physics',
  'Chemistry',
  'Biology',
  'English',
  'Social Science',
  'Hindi',
  'Computer Science',
  'Sanskrit'
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const { user, updateUserProfile, addXP } = useAuth();

  const [step, setStep] = useState<number>(1);
  const [classLevel, setClassLevel] = useState<string>(user?.classLevel || 'Class 9');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(
    user?.subjects || ['Mathematics', 'Science', 'English', 'Social Science']
  );
  const [weakSubjects, setWeakSubjects] = useState<string[]>(['Mathematics']);
  const [examDate, setExamDate] = useState<string>(user?.examDate || '2026-11-15');
  const [dailyHours, setDailyHours] = useState<number>(user?.dailyHours || 2.5);

  if (!isOpen) return null;

  const toggleSubject = (s: string) => {
    if (selectedSubjects.includes(s)) {
      if (selectedSubjects.length > 1) {
        setSelectedSubjects(selectedSubjects.filter(sub => sub !== s));
      }
    } else {
      setSelectedSubjects([...selectedSubjects, s]);
    }
  };

  const toggleWeakSubject = (s: string) => {
    if (weakSubjects.includes(s)) {
      setWeakSubjects(weakSubjects.filter(sub => sub !== s));
    } else {
      setWeakSubjects([...weakSubjects, s]);
    }
  };

  const handleFinish = () => {
    updateUserProfile({
      classLevel,
      subjects: selectedSubjects,
      weakSubjects,
      examDate,
      dailyHours,
      onboardingCompleted: true
    });
    addXP(50, 'Completed AI Profile Setup');
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-slate-900/95 backdrop-blur-2xl shadow-2xl p-6 sm:p-8 space-y-6 text-white max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="text-center space-y-1.5 pb-2 border-b border-white/10">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg mx-auto mb-2">
            <GraduationCap className="h-6 w-6" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
            Step {step} of 3 • Quick Personalization
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {step === 1 && 'Welcome! Select Your CBSE Grade'}
            {step === 2 && 'Which subjects are most challenging?'}
            {step === 3 && 'Set Your Daily Goal & Target Exam'}
          </h2>
          <p className="text-xs text-slate-400">
            {step === 1 && 'EduGenius AI adapts curriculum and step marking to your class.'}
            {step === 2 && 'We will prioritize targeted practice on these areas.'}
            {step === 3 && 'We will automatically build your spaced repetition timetable.'}
          </p>
        </div>

        {/* Step 1: Grade & Enrolled Subjects */}
        {step === 1 && (
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-200 mb-1.5">Your Class / Grade:</label>
              <select
                value={classLevel}
                onChange={e => setClassLevel(e.target.value)}
                className="w-full p-3 rounded-xl border border-white/15 bg-slate-950 text-white font-semibold focus:outline-none"
              >
                {CBSE_CLASSES.map(c => (
                  <option key={c} value={c}>
                    {c} (CBSE Syllabus)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-200 mb-1.5">
                Your Subjects ({selectedSubjects.length} selected):
              </label>
              <div className="flex flex-wrap gap-1.5 p-2.5 rounded-2xl bg-white/[0.03] border border-white/10 max-h-40 overflow-y-auto">
                {ALL_SUBJECTS.map(s => {
                  const isSelected = selectedSubjects.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSubject(s)}
                      className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm border border-indigo-400/40'
                          : 'bg-white/5 hover:bg-white/10 text-slate-400 border border-white/10'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '} {s}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <span>Next: Identify Focus Areas</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Step 2: Difficult / Weak Subjects */}
        {step === 2 && (
          <div className="space-y-4 text-xs">
            <p className="text-slate-300 leading-relaxed">
              Tap the subjects where you would like extra Socratic hints, step-by-step proofs, and targeted quizzes:
            </p>

            <div className="grid grid-cols-2 gap-2">
              {selectedSubjects.map(s => {
                const isWeak = weakSubjects.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleWeakSubject(s)}
                    className={`p-3 rounded-xl border text-left font-bold transition-all cursor-pointer ${
                      isWeak
                        ? 'border-amber-400/80 bg-amber-500/20 text-amber-200 ring-1 ring-amber-400/40'
                        : 'border-white/10 bg-white/5 hover:bg-white/10 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{s}</span>
                      {isWeak && <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />}
                    </div>
                    <span className="text-[10px] text-slate-400 block font-normal mt-1">
                      {isWeak ? 'High AI Priority' : 'Standard Focus'}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setStep(1)}
                className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Next: Goal & Schedule</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Exam Date & Daily Hours */}
        {step === 3 && (
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-indigo-400" />
                <span>Next CBSE Exam Target Date:</span>
              </label>
              <input
                type="date"
                value={examDate}
                onChange={e => setExamDate(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-white/15 bg-slate-950 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-200 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Daily Study Commitment:</span>
                </span>
                <span className="text-indigo-300 font-bold">{dailyHours} Hours / Day</span>
              </label>
              <input
                type="range"
                min="1"
                max="6"
                step="0.5"
                value={dailyHours}
                onChange={e => setDailyHours(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-1">
              <span className="font-bold text-indigo-300 block">EduGenius Learning Loop Activated:</span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                1. <strong>LEARN</strong> with Socratic AI Teacher & CBSE Notes<br />
                2. <strong>PRACTICE</strong> with AI Quizzes & Homework Vision<br />
                3. <strong>ANALYZE</strong> step mistakes and knowledge gaps<br />
                4. <strong>IMPROVE</strong> through 1-click targeted remedial tests
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setStep(2)}
                className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={handleFinish}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                <span>Launch My Learning Dashboard</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
