import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  RefreshCw,
  Loader2,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { aiService } from '../lib/aiService';
import { storage } from '../lib/storage';
import { StudyPlan } from '../types';

export const StudyPlanner: React.FC = () => {
  const { user, addXP } = useAuth();

  const userSubjects = user?.subjects || ['Mathematics', 'Science', 'English', 'Social Science'];
  const [availableHours, setAvailableHours] = useState<number>(3);
  const [weakSubjects, setWeakSubjects] = useState<string>(
    userSubjects.slice(0, 2).join(', ') || 'Mathematics, Science'
  );
  const [strongSubjects, setStrongSubjects] = useState<string>(
    userSubjects.slice(2).join(', ') || 'English, Social Science'
  );
  const [targetExamDate, setTargetExamDate] = useState<string>('2026-03-15');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [plan, setPlan] = useState<StudyPlan | null>(() => {
    return user ? storage.getStudyPlan(user.uid) : null;
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await aiService.generateStudyPlan({
        classLevel: user?.classLevel || 'Class 9',
        dailyHours: availableHours,
        weakChapters: weakSubjects.split(',').map(s => s.trim()).filter(Boolean),
        subjects: strongSubjects.split(',').map(s => s.trim()).filter(Boolean),
        examDate: targetExamDate,
        targetScore: '95%+'
      });

      if (res.plan) {
        setPlan(res.plan);
        setErrorMsg(null);
        if (user) {
          storage.saveStudyPlan(user.uid, res.plan);
          addXP(30, 'Generated AI Study Plan');
        }
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Failed to generate timetable. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleTask = (taskId: string) => {
    if (!plan || !user) return;
    const updated = {
      ...plan,
      dailySchedule: plan.dailySchedule.map(t =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      )
    };
    setPlan(updated);
    storage.saveStudyPlan(user.uid, updated);
  };

  // Calculate days to exam
  const daysToExam = Math.max(
    0,
    Math.ceil(
      (new Date(targetExamDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    )
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-2 sm:p-4 animate-in fade-in">
      <div className="rounded-3xl bg-gradient-to-r from-indigo-700/80 via-purple-700/80 to-pink-700/80 p-6 sm:p-8 text-white shadow-xl border border-white/15 backdrop-blur-md">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md mb-2 border border-white/20">
            <Calendar className="h-3.5 w-3.5" />
            <span>Spaced Repetition & Exam Countdown</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            AI Personalized Study Planner
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-indigo-100 leading-relaxed">
            Optimized for CBSE Class 1–12. Adapts dynamically to your school homework load, strengthens weak chapters, and automatically builds spaced repetition review cycles.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Configuration */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-5 shadow-xl shadow-indigo-950/20 space-y-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Study Plan Preferences
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Daily Available Self-Study Hours:
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="1"
                  max="8"
                  step="0.5"
                  value={availableHours}
                  onChange={e => setAvailableHours(Number(e.target.value))}
                  className="flex-1 accent-indigo-500"
                />
                <span className="text-xs font-bold text-indigo-300 px-2.5 py-1 rounded-xl bg-indigo-500/20 border border-indigo-500/30 backdrop-blur-sm">
                  {availableHours} Hours
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Weak Subjects (Prioritized for First Slot):
              </label>
              <input
                type="text"
                value={weakSubjects}
                onChange={e => setWeakSubjects(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-white/15 bg-white/5 text-slate-200 placeholder:text-slate-500 backdrop-blur-md"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Strong Subjects (Revision & Practice):
              </label>
              <input
                type="text"
                value={strongSubjects}
                onChange={e => setStrongSubjects(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-white/15 bg-white/5 text-slate-200 placeholder:text-slate-500 backdrop-blur-md"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Target CBSE Exam Date:
              </label>
              <input
                type="date"
                value={targetExamDate}
                onChange={e => setTargetExamDate(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-white/15 bg-slate-900/80 text-slate-200 backdrop-blur-md"
              />
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {errorMsg}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 disabled:opacity-60 transition-all"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Computing Spaced Repetition Cycles...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Generate AI Timetable</span>
                </>
              )}
            </button>
          </div>

          {/* Exam Countdown Widget */}
          <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-xl p-4 text-center shadow-lg shadow-indigo-950/20">
            <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider block">
              CBSE Board Exam Countdown
            </span>
            <div className="text-3xl font-black text-white my-1">
              {daysToExam} Days
            </div>
            <p className="text-[11px] text-slate-300">
              Focus on syllabus completion by Day {Math.max(1, daysToExam - 20)} to reserve 20 full days for sample papers.
            </p>
          </div>
        </div>

        {/* Right: Today's Schedule & Weekly Overview */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-5 shadow-xl shadow-indigo-950/20 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Today's Actionable Timetable
              </span>
              <span className="text-[11px] text-indigo-300 font-semibold">
                Click task to mark done
              </span>
            </div>

            {plan?.dailySchedule ? (
              <div className="space-y-2.5">
                {plan.dailySchedule.map(task => (
                  <div
                    key={task.id}
                    onClick={() => handleToggleTask(task.id)}
                    className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all text-xs backdrop-blur-sm ${
                      task.completed
                        ? 'bg-white/[0.02] border-white/5 text-slate-500'
                        : 'bg-white/5 border-white/10 hover:border-indigo-400/50 text-slate-200'
                    }`}
                  >
                    <div className="mt-0.5">
                      {task.completed ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-white/20" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`font-bold ${task.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                          {task.subject}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {task.time}
                        </span>
                      </div>
                      <p className={`mt-0.5 text-[11px] ${task.completed ? 'line-through text-slate-500' : 'text-slate-300'}`}>
                        {task.activity}
                      </p>
                      <span className="inline-block mt-1 text-[10px] font-semibold text-indigo-300 bg-indigo-500/20 border border-indigo-500/30 px-2 py-0.5 rounded-full backdrop-blur-sm">
                        {task.focus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-8">
                Click "Generate AI Timetable" to create your customized daily schedule.
              </p>
            )}

            {/* Weekly Blueprint */}
            {(plan?.weeklyMilestones || plan?.weeklyStrategy) && (
              <div className="pt-4 border-t border-white/10 space-y-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                  Weekly Milestones & Review Strategy
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {plan.weeklyMilestones
                    ? plan.weeklyMilestones.map((m, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
                        >
                          <span className="font-bold text-indigo-300">
                            {m.week}:{' '}
                          </span>
                          <span className="text-slate-300 text-[11px] block mt-0.5">
                            {m.goal}
                          </span>
                          <span className="text-[10px] text-purple-300 font-semibold block mt-1">
                            Mock: {m.mockTest}
                          </span>
                        </div>
                      ))
                    : plan.weeklyStrategy &&
                      Object.entries(plan.weeklyStrategy).map(([day, text]: [string, any]) => (
                        <div
                          key={day}
                          className="p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
                        >
                          <span className="font-bold text-indigo-300">
                            {day}:{' '}
                          </span>
                          <span className="text-slate-300 text-[11px]">
                            {text}
                          </span>
                        </div>
                      ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
