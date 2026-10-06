import React, { useState } from 'react';
import {
  Camera,
  MessageSquare,
  HelpCircle,
  Award,
  Calendar,
  BookOpen,
  Cpu,
  StickyNote,
  BarChart3,
  FileText,
  Flame,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Crown,
  Play,
  Check,
  Target,
  RefreshCw,
  Sliders,
  RotateCcw,
  Compass,
  Trophy,
  Mail
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { storage } from '../lib/storage';
import { BadgesSystem } from './BadgesSystem';
import { Leaderboard } from './Leaderboard';
import { motion } from 'framer-motion';
import { StreakFireAnimation } from './StreakFireAnimation';

interface DashboardProps {
  onNavigate: (tabId: string) => void;
  onOpenScanWithPrompt?: (prompt: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { user, addXP, incrementStreak } = useAuth();
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [activeSubSection, setActiveSubSection] = useState<'leaderboard' | 'badges'>('leaderboard');
  const [isStreakCelebrationOpen, setIsStreakCelebrationOpen] = useState<boolean>(false);

  // Time of day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const studentName = user?.name ? user.name.split(' ')[0] : 'Scholar';
  const userClass = user?.classLevel || 'Class 9';
  const userBoard = user?.board || 'CBSE';
  const enrolledSubjects = user?.subjects && user.subjects.length > 0
    ? user.subjects
    : ['Mathematics', 'Science', 'English', 'Social Science'];

  // Real user data
  const realScans = user ? storage.getScans(user.uid) : [];
  const realQuizResults = user ? storage.getQuizResults(user.uid) : [];

  // Sample data for Competition Demo Mode
  const demoScans = [
    {
      id: 'demo_scan_1',
      subject: 'Science',
      chapter: 'Motion & Laws of Motion',
      score: 88,
      status: 'Correct' as const,
      createdAt: '2026-10-04T10:30:00Z',
      corrections: []
    },
    {
      id: 'demo_scan_2',
      subject: 'Mathematics',
      chapter: 'Polynomials & Algebraic Identities',
      score: 68,
      status: 'Partially Correct' as const,
      createdAt: '2026-10-03T16:15:00Z',
      corrections: [{ step: 'Step 2', studentWrote: '(x-2)(x+3)', correctVersion: '(x-2)(x-3)', issue: 'Sign error in factor', severity: 'minor' as const }]
    }
  ];

  const demoQuizzes = [
    {
      id: 'demo_q_1',
      subject: 'Mathematics',
      chapter: 'Number Systems',
      score: 5,
      totalQuestions: 5,
      percentage: 100,
      scorePercentage: 100,
      date: '2026-10-04T12:00:00Z'
    },
    {
      id: 'demo_q_2',
      subject: 'Science',
      chapter: 'Cell - Structure & Functions',
      score: 4,
      totalQuestions: 5,
      percentage: 80,
      scorePercentage: 80,
      date: '2026-10-02T14:30:00Z'
    }
  ];

  const scans = isDemoMode ? demoScans : realScans;
  const quizResults = isDemoMode ? demoQuizzes : realQuizResults;
  const streakDays = isDemoMode ? 7 : (user?.streakDays ?? 0);
  const xp = isDemoMode ? 480 : (user?.xp ?? 0);
  const level = isDemoMode ? 3 : (user?.level ?? 1);

  // Subject statistics calculation
  const getSubjectStat = (subjName: string) => {
    if (isDemoMode) {
      if (subjName.toLowerCase().includes('math')) return { percentage: 88, prevPct: 72, total: 12, weakTopic: 'Algebraic Identities' };
      if (subjName.toLowerCase().includes('science')) return { percentage: 82, prevPct: 75, total: 10, weakTopic: 'Work & Energy formulas' };
      if (subjName.toLowerCase().includes('english')) return { percentage: 91, prevPct: 84, total: 8, weakTopic: 'Report Writing format' };
      return { percentage: 85, prevPct: 78, total: 6, weakTopic: 'Map skills' };
    }

    const sScans = scans.filter(s => s.subject.toLowerCase().includes(subjName.toLowerCase()));
    const sQuizzes = quizResults.filter(q => q.subject.toLowerCase().includes(subjName.toLowerCase()));
    const totalCount = sScans.length + sQuizzes.length;
    if (totalCount === 0) {
      return { percentage: 0, prevPct: 0, total: 0, weakTopic: null };
    }
    let totalScore = 0;
    sScans.forEach(s => { totalScore += (s.score || 0); });
    sQuizzes.forEach(q => { totalScore += (q.scorePercentage ?? q.percentage ?? 0); });
    const avg = Math.min(100, Math.max(0, Math.round(totalScore / totalCount)));
    return {
      percentage: avg,
      prevPct: Math.max(0, avg - 10),
      total: totalCount,
      weakTopic: avg < 75 ? 'Revision required' : null
    };
  };

  // Exam Countdown calculation
  const targetExamDateStr = user?.examDate || '2026-11-15';
  const targetExamDate = new Date(targetExamDateStr);
  const today = new Date();
  const diffDays = Math.max(1, Math.ceil((targetExamDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  // Tasks for Today
  const [tasks, setTasks] = useState<{ id: string; title: string; subject: string; duration: string; completed: boolean }[]>([
    {
      id: 'task_1',
      title: 'Practice 5 questions on Motion equations',
      subject: 'Science',
      duration: '20 mins',
      completed: isDemoMode
    },
    {
      id: 'task_2',
      title: 'Review Chapter formulas & flashcards',
      subject: 'Mathematics',
      duration: '15 mins',
      completed: false
    },
    {
      id: 'task_3',
      title: 'Take 1 diagnostic assessment quiz',
      subject: 'English',
      duration: '10 mins',
      completed: false
    }
  ]);

  const toggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
    addXP(15, 'Completed Daily Study Task');
  };

  const completedTasksCount = tasks.filter(t => t.completed).length;
  const taskProgressPct = Math.round((completedTasksCount / tasks.length) * 100);

  // Dynamic AI Learning Coach Insight
  const getCoachNotice = () => {
    if (isDemoMode) {
      return {
        strongArea: 'Linear Equations & Number Systems (100% accuracy)',
        weakArea: 'Polynomials & Algebraic Identities (68% accuracy)',
        insight: 'You are doing well in Linear Equations but need more practice in Algebraic Identities factoring.',
        actionLabel: 'Practice My Weak Area (Polynomials)',
        actionTab: 'quizzes',
        subject: 'Mathematics',
        chapter: 'Polynomials'
      };
    }

    const weakScan = scans.find(s => s.score !== undefined && s.score < 75);
    if (weakScan) {
      return {
        strongArea: `${userClass} Coursework`,
        weakArea: `${weakScan.subject} - ${weakScan.chapter}`,
        insight: `Your recent worksheet scan in ${weakScan.chapter} scored ${weakScan.score}%. Let's review the exact step errors and master this concept.`,
        actionLabel: `Practice My Weak Area (${weakScan.chapter})`,
        actionTab: 'quizzes',
        subject: weakScan.subject,
        chapter: weakScan.chapter
      };
    }

    if (quizResults.length > 0) {
      const lastQuiz = quizResults[quizResults.length - 1];
      if (lastQuiz.percentage < 80) {
        return {
          strongArea: 'Consistent practice',
          weakArea: `${lastQuiz.subject} - ${lastQuiz.chapter}`,
          insight: `You scored ${lastQuiz.percentage}% in ${lastQuiz.chapter}. Take a quick 5-question booster test to reach 90%+ mastery.`,
          actionLabel: `Practice Weakness: ${lastQuiz.chapter}`,
          actionTab: 'quizzes',
          subject: lastQuiz.subject,
          chapter: lastQuiz.chapter
        };
      }
    }

    return {
      strongArea: `Enrolled in CBSE ${userClass}`,
      weakArea: 'Baseline Diagnostic',
      insight: `Welcome to EduGenius AI! Take a quick 5-minute diagnostic quiz or scan a worksheet so your AI Coach can map your strengths and weaknesses.`,
      actionLabel: 'Start Diagnostic Quiz',
      actionTab: 'quizzes',
      subject: enrolledSubjects[0] || 'Science',
      chapter: 'Diagnostic Review'
    };
  };

  const coachNotice = getCoachNotice();

  // Core Learning Loop Steps
  const learningLoopSteps = [
    { num: '01', name: 'LEARN', desc: 'Socratic AI Teacher & NCERT Concepts', tab: 'tutor-chat', color: 'text-indigo-400' },
    { num: '02', name: 'PRACTICE', desc: 'AI Quizzes & Homework Vision OCR', tab: 'quizzes', color: 'text-emerald-400' },
    { num: '03', name: 'ANALYZE', desc: 'Step Mistakes & Knowledge Gaps', tab: 'analytics', color: 'text-amber-400' },
    { num: '04', name: 'IMPROVE', desc: '1-Click Targeted Weakness Booster', tab: 'quizzes', color: 'text-purple-400' }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-2 sm:p-4 animate-in fade-in">
      {/* Top Banner: Product Vision & Student Welcome */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900/95 via-[#0f172a]/95 to-indigo-950/90 backdrop-blur-2xl border border-white/15 p-6 sm:p-8 text-white shadow-2xl shadow-indigo-950/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            {/* Header kicker */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
              <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 tracking-wide uppercase">
                EduGenius AI
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300 font-semibold">Personal AI Learning Coach for CBSE</span>
              <span className="text-slate-500">•</span>
              <span className="text-amber-300 font-bold flex items-center gap-1">
                <Crown className="h-3.5 w-3.5 text-amber-400" />
                {user?.plan === 'premium' ? 'Premium Pro (₹69)' : 'Standard Plan (₹49)'}
              </span>
            </div>

            {/* Main Welcome Heading */}
            <div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                {getGreeting()}, {studentName} 👋
              </h1>
              <p className="text-sm sm:text-base font-medium text-indigo-200 mt-1">
                "EduGenius doesn't just answer questions — it identifies weak areas, creates targeted practice, and helps you improve."
              </p>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Active in <span className="text-white font-bold">{userClass} ({userBoard})</span>. Ready to master your syllabus today.
              </p>
            </div>

            {/* Active Enrolled Subjects */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs text-slate-400">
              <span className="font-semibold text-slate-400">Active Subjects:</span>
              {enrolledSubjects.map(subj => (
                <span
                  key={subj}
                  className="px-2.5 py-0.5 rounded-lg bg-white/5 border border-white/10 text-slate-200 font-medium text-[11px]"
                >
                  {subj}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Quick Stats & Competition Demo Switch */}
          <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
            {/* Competition Demo Mode Switcher for Judges */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/[0.06] border border-white/15 backdrop-blur-md">
              <Sliders className="h-3.5 w-3.5 text-indigo-400" />
              <span className="text-[11px] font-semibold text-slate-300">Competition Demo Data:</span>
              <button
                type="button"
                onClick={() => setIsDemoMode(!isDemoMode)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isDemoMode ? 'bg-indigo-600' : 'bg-slate-700'
                }`}
                aria-label="Toggle Demo Mode for Presentation"
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isDemoMode ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* KPI Stat Cards */}
            <div className="grid grid-cols-3 gap-2.5 w-full sm:w-auto">
              <motion.div
                whileHover={{ scale: 1.06, borderColor: 'rgba(251, 146, 60, 0.6)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsStreakCelebrationOpen(true)}
                className="rounded-2xl bg-gradient-to-b from-orange-500/15 via-white/[0.06] to-white/[0.04] backdrop-blur-xl border border-orange-500/35 p-3 text-center min-w-[85px] shadow-sm cursor-pointer group"
                title="Click to celebrate study streak with fire and confetti animation!"
              >
                <div className="flex items-center justify-center gap-1 text-amber-400 font-black text-lg">
                  <motion.div
                    animate={{ scale: [1, 1.25, 1], rotate: [-4, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.8 }}
                  >
                    <Flame className="h-4 w-4 fill-amber-400 text-amber-400" />
                  </motion.div>
                  <span>{streakDays}</span>
                </div>
                <p className="text-[10px] text-amber-300 uppercase tracking-wider font-bold mt-0.5 group-hover:underline">
                  🔥 Streak
                </p>
              </motion.div>

              <div className="rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/15 p-3 text-center min-w-[85px] shadow-sm">
                <div className="flex items-center justify-center gap-1 text-purple-300 font-black text-lg">
                  <Zap className="h-4 w-4 fill-purple-400" />
                  <span>{xp}</span>
                </div>
                <p className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold mt-0.5">
                  Total XP
                </p>
              </div>

              <div className="rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/15 p-3 text-center min-w-[85px] shadow-sm">
                <div className="flex items-center justify-center gap-1 text-emerald-300 font-black text-lg">
                  <Award className="h-4 w-4" />
                  <span>Lvl {level}</span>
                </div>
                <p className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold mt-0.5">
                  Scholar Tier
                </p>
              </div>
            </div>

            {isDemoMode && (
              <span className="text-[10px] text-indigo-300 font-semibold bg-indigo-500/20 px-2 py-0.5 rounded-md border border-indigo-500/30">
                ✨ Populated sample data for competition presentation
              </span>
            )}
          </div>
        </div>
      </div>

      {/* CORE LEARNING LOOP BANNER (LEARN → PRACTICE → ANALYZE → IMPROVE) */}
      <div className="rounded-2xl border border-indigo-500/20 bg-slate-900/60 backdrop-blur-xl p-4 shadow-lg space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-indigo-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              The EduGenius Learning Loop
            </span>
          </div>
          <span className="text-[11px] text-slate-400 hidden sm:inline">Continuous Mastery System</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {learningLoopSteps.map((step, idx) => (
            <div
              key={step.name}
              onClick={() => onNavigate(step.tab)}
              className="p-3 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-indigo-400/40 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-black ${step.color}`}>{step.num}. {step.name}</span>
                <ArrowRight className="h-3 w-3 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-[11px] text-slate-300 leading-tight line-clamp-2">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Launch Icons Strip */}
        <div className="pt-2 border-t border-white/10 flex flex-wrap items-center gap-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mr-1">Quick Launch:</span>
          <button
            onClick={() => onNavigate('tutor-chat')}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-indigo-600/30 text-slate-200 hover:text-indigo-200 border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <MessageSquare className="h-3.5 w-3.5 text-indigo-400" />
            <span>Ask AI Teacher</span>
          </button>
          <button
            onClick={() => onNavigate('quizzes')}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-emerald-600/30 text-slate-200 hover:text-emerald-200 border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Award className="h-3.5 w-3.5 text-emerald-400" />
            <span>Take CBSE Quiz</span>
          </button>
          <button
            onClick={() => onNavigate('mistake-book')}
            className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/25 text-rose-200 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <BookOpen className="h-3.5 w-3.5 text-rose-400" />
            <span>📕 My Mistake Book</span>
          </button>
          <button
            onClick={() => onNavigate('homework-scanner')}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-blue-600/30 text-slate-200 hover:text-blue-200 border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Camera className="h-3.5 w-3.5 text-blue-400" />
            <span>Scan Homework</span>
          </button>
          <button
            onClick={() => onNavigate('study-planner')}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-purple-600/30 text-slate-200 hover:text-purple-200 border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Calendar className="h-3.5 w-3.5 text-purple-400" />
            <span>Study Planner</span>
          </button>
          <button
            onClick={() => {
              setActiveSubSection('leaderboard');
              const el = document.getElementById('dashboard-leaderboard');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/25 text-amber-200 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Trophy className="h-3.5 w-3.5 text-amber-400" />
            <span>Leaderboard</span>
          </button>
          <button
            onClick={() => {
              setActiveSubSection('badges');
              const el = document.getElementById('dashboard-leaderboard');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/25 text-indigo-200 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Award className="h-3.5 w-3.5 text-indigo-400" />
            <span>Achievements</span>
          </button>
          <button
            onClick={() => onNavigate('analytics')}
            className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-200 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Mail className="h-3.5 w-3.5 text-emerald-400" />
            <span>Weekly Email Digest</span>
          </button>
        </div>
      </div>

      {/* SIGNATURE SECTION: "Your AI Learning Coach noticed..." */}
      <div className="rounded-3xl border-2 border-indigo-500/40 bg-gradient-to-r from-indigo-950/90 via-slate-900/95 to-purple-950/80 backdrop-blur-2xl p-6 shadow-2xl shadow-indigo-950/50 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-lg border border-white/20">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                Your AI Learning Coach noticed...
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                Live Diagnostic
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white">
              {coachNotice.insight}
            </h3>
            <p className="text-xs text-slate-400">
              Strong in: <span className="text-slate-200">{coachNotice.strongArea}</span> • Target: <span className="text-amber-300 font-semibold">{coachNotice.weakArea}</span>
            </p>
          </div>
        </div>

        {/* Big Signature Action Button */}
        <button
          id="btn-practice-weak-area"
          onClick={() => onNavigate(coachNotice.actionTab)}
          className="py-3 px-6 rounded-2xl text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-xl shadow-indigo-500/30 border border-white/20 flex items-center justify-center gap-2 shrink-0 transition-all cursor-pointer group"
        >
          <span>{coachNotice.actionLabel}</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Two Column Layout: Today's Study Goal & Subject Mastery */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Today's Study Goal & Schedule */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: "What should I study today?" */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                  Daily Priority Focus
                </span>
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2 mt-0.5">
                  <Calendar className="h-4 w-4 text-indigo-400" />
                  <span>Today's Study Plan & Tasks</span>
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-300 font-bold">
                  {completedTasksCount}/{tasks.length} Done ({taskProgressPct}%)
                </span>
                <button
                  onClick={() => onNavigate('study-planner')}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 ml-2"
                >
                  <span>Edit</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${taskProgressPct}%` }}
              />
            </div>

            {/* Task List */}
            <div className="space-y-2.5">
              {tasks.map(t => (
                <div
                  key={t.id}
                  onClick={() => toggleTask(t.id)}
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    t.completed
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-slate-300'
                      : 'border-white/10 bg-white/5 hover:border-white/20 text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-5 w-5 rounded-lg border flex items-center justify-center transition-colors ${
                        t.completed
                          ? 'border-emerald-400 bg-emerald-500 text-white'
                          : 'border-white/30 bg-white/5'
                      }`}
                    >
                      {t.completed && <Check className="h-3.5 w-3.5" />}
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${t.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                        {t.title}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                        <span className="font-semibold text-indigo-300">{t.subject}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {t.duration}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold text-slate-400">
                    {t.completed ? '✓ Completed' : 'Tap to mark done'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Subject Performance & Improvement Trend */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-blue-400" />
                <span>Subject Performance & Trends</span>
              </h3>
              <button
                onClick={() => onNavigate('analytics')}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <span>Full Diagnostics</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="space-y-4">
              {enrolledSubjects.map(subj => {
                const stat = getSubjectStat(subj);
                return (
                  <div key={subj} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{subj}</span>
                        {stat.prevPct > 0 && (
                          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
                            <TrendingUp className="h-3 w-3" />
                            {stat.prevPct}% → {stat.percentage}%
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {stat.weakTopic && (
                          <span className="text-[10px] text-amber-400 font-semibold">
                            ⚠️ {stat.weakTopic}
                          </span>
                        )}
                        <span className="font-bold text-slate-200">{stat.percentage}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          stat.percentage >= 80
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                            : stat.percentage >= 50
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-400'
                            : stat.percentage > 0
                            ? 'bg-gradient-to-r from-amber-500 to-orange-400'
                            : 'bg-white/10'
                        }`}
                        style={{ width: `${Math.max(5, stat.percentage)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Exam Countdown, Badges & Diagnostic Mistake Review */}
        <div className="lg:col-span-5 space-y-6">
          {/* Target Exam Countdown Card */}
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-950/60 to-slate-900/60 backdrop-blur-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5 text-indigo-400" />
                Target Exam Date
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-500/30">
                {userClass}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-black text-white">
                  {diffDays} <span className="text-sm font-semibold text-slate-300">Days Left</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Target Date: {targetExamDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>

              <button
                onClick={() => onNavigate('study-planner')}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all cursor-pointer"
              >
                Plan Timetable
              </button>
            </div>
          </div>

          {/* Achievement Badges System */}
          <BadgesSystem compact={true} onNavigateTab={onNavigate} />

          {/* Diagnostic Weak Topics Action Widget */}
          <div className="rounded-2xl border border-amber-500/25 bg-amber-500/5 backdrop-blur-xl p-4 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                Targeted Weakness Remediation
              </span>
              <span className="text-[10px] font-bold text-amber-300/80">Diagnostic AI</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Whenever you make a mistake in a quiz or worksheet, EduGenius detects the underlying misconception and builds adaptive practice sets until you reach 100% mastery.
            </p>

            <button
              onClick={() => onNavigate('quizzes')}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Practice My Weakness Now</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION: ACADEMIC LEADERBOARD & ACHIEVEMENTS SYSTEM       */}
      {/* ========================================================= */}
      <section id="dashboard-leaderboard" className="pt-2 space-y-4">
        {/* Toggle Switcher Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl shadow-lg">
          <div className="flex rounded-xl bg-white/5 p-1 border border-white/10">
            <button
              type="button"
              id="tab-leaderboard"
              onClick={() => setActiveSubSection('leaderboard')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeSubSection === 'leaderboard'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Trophy className="h-4 w-4" />
              <span>🏆 Class & Global Leaderboard</span>
            </button>
            <button
              type="button"
              id="tab-achievements"
              onClick={() => setActiveSubSection('badges')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeSubSection === 'badges'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Award className="h-4 w-4" />
              <span>🏅 Honor Badges & Achievements</span>
            </button>
          </div>

          <span className="text-[11px] text-slate-400 px-3 font-medium">
            {activeSubSection === 'leaderboard'
              ? 'Rankings computed live from badges earned & quiz performance'
              : 'Unlock milestone badges and claim +XP bonuses'}
          </span>
        </div>

        {activeSubSection === 'leaderboard' ? (
          <Leaderboard onNavigateTab={onNavigate} />
        ) : (
          <div id="dashboard-achievements">
            <BadgesSystem compact={false} onNavigateTab={onNavigate} />
          </div>
        )}
      </section>

      {/* Framer Motion Fire and Confetti Streak Celebration Modal */}
      <StreakFireAnimation
        isOpen={isStreakCelebrationOpen}
        onClose={() => setIsStreakCelebrationOpen(false)}
        streakDays={Math.max(1, streakDays)}
        bonusXP={150}
        badgeTitle={streakDays >= 7 ? '7-Day Scholar Streak' : streakDays >= 3 ? 'Streak Champion' : 'Consistency Spark'}
        onClaimReward={() => {
          addXP(150, `Study Streak Milestone Claimed (${Math.max(1, streakDays)} Days)`);
        }}
      />
    </div>
  );
};
