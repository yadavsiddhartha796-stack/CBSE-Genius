import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Flame,
  Zap,
  Award,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Target,
  BookOpen,
  Camera,
  Star,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { storage } from '../lib/storage';
import { BadgesSystem } from './BadgesSystem';
import { WeeklyEmailReport } from './WeeklyEmailReport';

interface ProgressAnalyticsProps {
  onPracticeMistake?: (topic: string) => void;
}

export const ProgressAnalytics: React.FC<ProgressAnalyticsProps> = ({
  onPracticeMistake
}) => {
  const { user } = useAuth();
  const scans = user ? storage.getScans(user.uid) : [];
  const quizResults = user ? storage.getQuizResults(user.uid) : [];

  const totalScans = scans.length;
  const totalQuizzes = quizResults.length;
  const avgQuizScore =
    totalQuizzes > 0
      ? Math.round(
          quizResults.reduce((acc, q) => acc + (q.scorePercentage ?? q.percentage ?? 0), 0) /
            totalQuizzes
        )
      : 0;

  const enrolledSubjects = user?.subjects && user.subjects.length > 0
    ? user.subjects
    : ['Mathematics', 'Science', 'English', 'Social Science'];

  // Dynamic subject calculation starting from clean 0
  const getSubjectMastery = (subjectName: string) => {
    const sScans = scans.filter(s => s.subject.toLowerCase().includes(subjectName.toLowerCase()));
    const sQuizzes = quizResults.filter(q => q.subject.toLowerCase().includes(subjectName.toLowerCase()));
    const total = sScans.length + sQuizzes.length;
    if (total === 0) return { pct: 0, label: '0% • Not tested yet', total: 0 };
    let score = 0;
    sScans.forEach(s => { score += (s.score || 0); });
    sQuizzes.forEach(q => { score += (q.scorePercentage ?? q.percentage ?? 0); });
    const avg = Math.min(100, Math.max(0, Math.round(score / total)));
    let tier = 'Mastery';
    if (avg < 50) tier = 'Revision Target';
    else if (avg < 75) tier = 'Developing';
    else if (avg < 85) tier = 'Good';
    else tier = 'Proficient';
    return { pct: avg, label: `${avg}% (${tier})`, total };
  };

  // Collect real mistakes from scans that scored < 80 or have corrections
  const actualMistakes = scans
    .filter(s => (s.corrections && s.corrections.length > 0) || (s.score !== undefined && s.score < 80))
    .slice(0, 4);

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-2 sm:p-4 animate-in fade-in">
      <div className="rounded-3xl bg-gradient-to-r from-blue-700/80 via-indigo-700/80 to-purple-800/80 p-6 sm:p-8 text-white shadow-xl border border-white/15 backdrop-blur-md">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md mb-2 border border-white/20">
            <BarChart3 className="h-3.5 w-3.5" />
            <span>Academic Performance & Mastery Tracking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Learning Progress & Analytics
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-blue-100 leading-relaxed">
            Real-time analytics across your CBSE {user?.classLevel || 'Class 9'} coursework. Diagnostic tracking of mistakes, weekly study retention, and academic honors.
          </p>
        </div>
      </div>

      {/* KPI Stats Row (Clean 0-Value Baseline) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl shadow-xl shadow-indigo-950/20 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase">Study Streak</span>
            <Flame className="h-4 w-4 text-amber-400 fill-amber-400/20" />
          </div>
          <div className="text-2xl font-black text-white">
            {user?.streakDays ?? 0} Days
          </div>
          <p className="text-[10px] text-emerald-400 font-semibold">
            {(user?.streakDays ?? 0) > 0 ? '+1 day active' : 'Start streak today'}
          </p>
        </div>

        <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl shadow-xl shadow-indigo-950/20 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase">Total XP</span>
            <Zap className="h-4 w-4 text-purple-400 fill-purple-400/20" />
          </div>
          <div className="text-2xl font-black text-white">
            {user?.xp ?? 0}
          </div>
          <p className="text-[10px] text-slate-400">Level {user?.level ?? 1} Scholar</p>
        </div>

        <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl shadow-xl shadow-indigo-950/20 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase">Homework Scans</span>
            <Camera className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {totalScans}
          </div>
          <p className="text-[10px] text-blue-400 font-semibold">
            {totalScans > 0 ? '100% evaluated' : '0 submissions'}
          </p>
        </div>

        <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl shadow-xl shadow-indigo-950/20 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase">Average Test Score</span>
            <Award className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {avgQuizScore}%
          </div>
          <p className="text-[10px] text-emerald-400 font-semibold">
            {totalQuizzes > 0 ? `${totalQuizzes} quizzes completed` : '0 assessments taken'}
          </p>
        </div>
      </div>

      {/* ========================================================= */}
      {/* WEEKLY EMAIL REPORT SUMMARY & DIGEST DISPATCH            */}
      {/* ========================================================= */}
      <section id="weekly-email-report-section">
        <WeeklyEmailReport onPracticeTopic={onPracticeMistake} />
      </section>

      {/* Two Column: Subject Breakdown & Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Subject Mastery Gauges & Mistake Journal */}
        <div className="lg:col-span-7 space-y-5">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-5 shadow-xl shadow-indigo-950/20 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Subject Mastery Index ({user?.classLevel || 'Class 9'})
            </h3>

            <div className="space-y-4 text-xs">
              {enrolledSubjects.map(subj => {
                const mastery = getSubjectMastery(subj);
                return (
                  <div key={subj} className="space-y-1.5">
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-200">{subj}</span>
                      <span className={mastery.pct > 0 ? 'text-indigo-300' : 'text-slate-400'}>
                        {mastery.label}
                      </span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          mastery.pct >= 80
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                            : mastery.pct >= 50
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-400'
                            : mastery.pct > 0
                            ? 'bg-gradient-to-r from-amber-500 to-orange-400'
                            : 'bg-white/10'
                        }`}
                        style={{ width: `${Math.max(mastery.pct > 0 ? 5 : 0, mastery.pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mistake Journal / Frequent Traps */}
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 backdrop-blur-2xl p-5 shadow-xl shadow-indigo-950/20 space-y-3">
            <div className="flex items-center gap-2 text-amber-300">
              <AlertTriangle className="h-4 w-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider">
                Targeted Mistake Log & Remedial Actions
              </h3>
            </div>

            {actualMistakes.length > 0 ? (
              <>
                <p className="text-[11px] text-slate-300">
                  The AI detected errors across your evaluations that need revision:
                </p>

                <div className="space-y-2 text-xs">
                  {actualMistakes.map(m => (
                    <div
                      key={m.id}
                      className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between backdrop-blur-sm"
                    >
                      <div>
                        <span className="font-bold text-slate-100">
                          {m.subject}: {m.chapter}
                        </span>
                        <p className="text-[10px] text-red-400">
                          {m.corrections?.[0]?.issue || `Scored ${m.score}/100`}
                        </p>
                      </div>
                      {onPracticeMistake && (
                        <button
                          onClick={() => onPracticeMistake(m.chapter)}
                          className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-amber-600 hover:bg-amber-500 text-white transition-colors cursor-pointer"
                        >
                          Re-test Now
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="py-2 text-xs text-slate-300 space-y-2">
                <p className="text-[11px] leading-relaxed">
                  No diagnostic mistakes recorded yet. All metrics start cleanly at 0. As you upload homework worksheets and complete quizzes, the AI will log step mistakes here with one-click remedial practice.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Gamification Badges & Honors System */}
        <div className="lg:col-span-5 space-y-5">
          <BadgesSystem compact={false} />
        </div>
      </div>
    </div>
  );
};
