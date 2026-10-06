import React, { useState, useEffect } from 'react';
import {
  Settings,
  X,
  Shield,
  Moon,
  Sun,
  Key,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  User,
  BookOpen,
  Crown,
  Sparkles,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { aiService } from '../lib/aiService';
import { AIModelOption, SubscriptionPlan } from '../types';
import { CBSE_CLASSES, getCurriculumByClass } from '../lib/cbseData';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ALL_SUBJECT_OPTIONS = [
  'Mathematics',
  'Science',
  'Physics',
  'Chemistry',
  'Biology',
  'English',
  'Social Science',
  'History',
  'Geography',
  'Economics',
  'Political Science',
  'Hindi',
  'Computer Science',
  'Sanskrit'
];

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { user, updateUserProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [name, setName] = useState<string>(user?.name || '');
  const [classLevel, setClassLevel] = useState<string>(user?.classLevel || 'Class 9');
  const [board, setBoard] = useState<string>(user?.board || 'CBSE');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(user?.subjects || ['Mathematics', 'Science', 'English', 'Social Science', 'Hindi']);
  const [plan, setPlan] = useState<SubscriptionPlan>(user?.plan || 'standard');
  const [models, setModels] = useState<AIModelOption[]>([]);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && user) {
      aiService.getModels().then(m => setModels(m));
      setName(user.name);
      setClassLevel(user.classLevel);
      setBoard(user.board);
      setSelectedSubjects(user.subjects || ['Mathematics', 'Science', 'English', 'Social Science', 'Hindi']);
      setPlan(user.plan || 'standard');
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const toggleSubject = (sub: string) => {
    if (selectedSubjects.includes(sub)) {
      if (selectedSubjects.length > 1) {
        setSelectedSubjects(selectedSubjects.filter(s => s !== sub));
      }
    } else {
      setSelectedSubjects([...selectedSubjects, sub]);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      classLevel,
      board,
      subjects: selectedSubjects,
      plan
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all local homework scans, notes, and quiz history to defaults?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-slate-900/90 backdrop-blur-2xl shadow-2xl shadow-indigo-950/50 p-6 space-y-6 max-h-[90vh] overflow-y-auto text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 shadow-md backdrop-blur-sm">
              <Settings className="h-4 w-4" />
            </div>
            <h2 className="text-sm font-bold text-white">
              EduGenius AI Settings & Plan
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Profile Settings */}
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-indigo-400" />
            <span>Student Profile & Curriculum Setup</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Student Full Name:
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-white/15 bg-white/5 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 backdrop-blur-md"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Class Level:
                </label>
                <select
                  value={classLevel}
                  onChange={e => setClassLevel(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-white/15 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 backdrop-blur-md"
                >
                  {CBSE_CLASSES.map(c => (
                    <option key={c} value={c} className="bg-slate-900 text-white">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Educational Board:
                </label>
                <select
                  value={board}
                  onChange={e => setBoard(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-white/15 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 backdrop-blur-md"
                >
                  <option className="bg-slate-900 text-white">CBSE</option>
                  <option className="bg-slate-900 text-white">ICSE</option>
                  <option className="bg-slate-900 text-white">State Board</option>
                </select>
              </div>
            </div>

            {/* Enrolled Subjects Selection */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1 flex items-center justify-between">
                <span>Active Subjects ({selectedSubjects.length} selected):</span>
                <span className="text-[10px] text-slate-400">Used in AI Quiz, Scanner & Explorer</span>
              </label>
              <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-white/[0.03] border border-white/10 max-h-32 overflow-y-auto">
                {ALL_SUBJECT_OPTIONS.map(sub => {
                  const isSelected = selectedSubjects.includes(sub);
                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => toggleSubject(sub)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm border border-indigo-400/40'
                          : 'bg-white/5 hover:bg-white/10 text-slate-400 border border-white/10'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}{sub}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Membership Plan Selection */}
            <div className="pt-2">
              <label className="block text-slate-300 font-semibold mb-1.5 flex items-center gap-1.5">
                <Crown className="h-3.5 w-3.5 text-amber-400" />
                <span>Subscription Tier</span>
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <div
                  onClick={() => setPlan('standard')}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                    plan === 'standard'
                      ? 'border-blue-500 bg-blue-500/15 text-white shadow-md'
                      : 'border-white/10 bg-white/5 hover:border-white/20 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">Standard</span>
                    <span className="text-xs font-black text-blue-300">₹49</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    AI Scanner • NCERT Explorer • Practice Quizzes
                  </p>
                </div>

                <div
                  onClick={() => setPlan('premium')}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                    plan === 'premium'
                      ? 'border-amber-500 bg-amber-500/15 text-white shadow-md'
                      : 'border-white/10 bg-white/5 hover:border-white/20 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-xs text-amber-300">Premium</span>
                      <Sparkles className="h-3 w-3 text-amber-400 fill-amber-400" />
                    </div>
                    <span className="text-xs font-black text-amber-300">₹69</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Voice Socratic Tutor • Priority Scans • Unlimited
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-indigo-500/25 transition-all"
          >
            {savedSuccess ? '✓ Profile & Plan Saved' : 'Save Changes'}
          </button>
        </form>

        {/* Theme and Preferences */}
        <div className="space-y-3 pt-3 border-t border-white/10">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Display & Storage
          </h3>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">Appearance Theme:</span>
            <button
              onClick={toggleTheme}
              className="px-3 py-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-slate-200 flex items-center gap-1.5 font-semibold backdrop-blur-sm transition-all"
            >
              {theme === 'dark' ? (
                <>
                  <Moon className="h-3.5 w-3.5 text-blue-400" />
                  <span>Dark Mode</span>
                </>
              ) : (
                <>
                  <Sun className="h-3.5 w-3.5 text-amber-400" />
                  <span>Light Mode</span>
                </>
              )}
            </button>
          </div>

          <div className="pt-2">
            <button
              onClick={handleResetData}
              className="text-xs text-red-400 hover:text-red-300 hover:underline flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Clear Local Cache & Reset Demo State</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
