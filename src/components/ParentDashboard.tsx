import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  Award,
  Clock,
  Printer,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  HeartHandshake,
  MessageCircleQuestion,
  TrendingUp,
  Share2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { storage } from '../lib/storage';

export const ParentDashboard: React.FC = () => {
  const { user } = useAuth();
  const scans = user ? storage.getScans(user.uid) : [];
  const quizzes = user ? storage.getQuizResults(user.uid) : [];

  const [language, setLanguage] = useState<'English' | 'Hindi'>('English');

  const questionsForTonight = scans.length > 0 ? [
    {
      subject: scans[0].subject,
      question: `Ask ${user?.name?.split(' ')[0] || 'your child'}: "Can you show me the feedback you received on your ${scans[0].chapter} homework scan?"`,
      context: `Based on worksheet evaluation with score ${scans[0].score}/100.`
    },
    {
      subject: 'Study Habit',
      question: `Praise effort: "How did your CBSE practice go today? What's your target for your study streak?"`,
      context: `Current streak is ${user?.streakDays ?? 0} days.`
    }
  ] : [
    {
      subject: 'Mathematics',
      question: `Ask ${user?.name?.split(' ')[0] || 'your child'}: "Which chapter in Mathematics are you currently learning in school, and would you like to solve a few practice problems together?"`,
      context: 'Great way to establish a daily math habit.'
    },
    {
      subject: 'Science',
      question: `Ask ${user?.name?.split(' ')[0] || 'your child'}: "Have you tried snapping a photo of your science homework in EduGenius AI to check the step-by-step marking?"`,
      context: 'Encourage trying the AI OCR Homework Scanner.'
    },
    {
      subject: 'Daily Routine',
      question: `Praise initiative: "Setting a goal of 30 minutes focused study every day will build great momentum for board exams!"`,
      context: 'Initial study routine kickoff.'
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-2 sm:p-4 animate-in fade-in">
      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-teal-700/80 via-emerald-700/80 to-indigo-800/80 p-6 sm:p-8 text-white shadow-xl border border-white/15 backdrop-blur-md">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md mb-2 border border-white/20">
            <Users className="h-3.5 w-3.5" />
            <span>Parent & Educator Oversight</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Parent & Guardian Companion
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-teal-100 leading-relaxed">
            Transparent academic visibility for {user?.name || 'your child'} ({user?.classLevel}). Get plain-English weekly progress digests, homework verification, and conversation starters for tonight.
          </p>
        </div>
      </div>

      {/* Top Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-300">
            Summary Language:
          </span>
          <button
            onClick={() => setLanguage('English')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all backdrop-blur-sm ${
              language === 'English'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('Hindi')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all backdrop-blur-sm ${
              language === 'Hindi'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
            }`}
          >
            हिंदी (Hindi)
          </button>
        </div>

        <button
          onClick={() => window.print()}
          className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/5 border border-white/10 hover:bg-white/10 text-slate-200 flex items-center gap-2 shadow-xs backdrop-blur-sm transition-all"
        >
          <Printer className="h-4 w-4 text-slate-400" />
          <span>Print / Export PDF Report</span>
        </button>
      </div>

      {/* AI Plain Language Summary */}
      <div className="rounded-2xl border border-teal-500/30 bg-teal-500/10 backdrop-blur-2xl p-5 shadow-xl shadow-indigo-950/20 space-y-3">
        <div className="flex items-center gap-2 text-teal-300">
          <Sparkles className="h-4 w-4" />
          <h3 className="text-xs font-bold uppercase tracking-wider">
            AI Weekly Parental Digest
          </h3>
        </div>

        {language === 'English' ? (
          scans.length > 0 ? (
            <p className="text-xs text-slate-200 leading-relaxed">
              <strong>Overall Assessment:</strong> {user?.name || 'Your student'} has {scans.length} evaluated homework submissions with an active streak of {user?.streakDays ?? 0} days. Concepts in {scans[0].subject} are progressing well. Consistent daily review will consolidate board exam retention.
            </p>
          ) : (
            <p className="text-xs text-slate-200 leading-relaxed">
              <strong>Initial Onboarding Status:</strong> {user?.name || 'Your student'} is set up with fresh 0-baseline metrics (0 study streak days, 0 scanned worksheets). Once they submit their first homework scan or complete a chapter quiz, real-time diagnostic accuracy and subject-wise mastery reports will automatically populate here.
            </p>
          )
        ) : (
          scans.length > 0 ? (
            <p className="text-xs text-slate-200 leading-relaxed">
              <strong>साप्ताहिक प्रगति रिपोर्ट:</strong> {user?.name || 'विद्यार्थी'} ने कुल {scans.length} गृहकार्य प्रस्तुत किए हैं और अध्ययन स्ट्रीक {user?.streakDays ?? 0} दिन है। नियमित अभ्यास से बोर्ड परीक्षा की तैयारी और मजबूत होगी।
            </p>
          ) : (
            <p className="text-xs text-slate-200 leading-relaxed">
              <strong>प्रारंभिक स्थिति:</strong> {user?.name || 'विद्यार्थी'} का खाता नए सिरे से 0-आधार पर सक्रिय है। जैसे ही वे पहला गृहकार्य स्कैन करेंगे या अभ्यास प्रश्नोत्तरी देंगे, यहाँ विस्तृत विश्लेषण प्रदर्शित होने लगेगा।
            </p>
          )
        )}
      </div>

      {/* Questions to ask your child tonight */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-5 shadow-xl shadow-indigo-950/20 space-y-4">
        <div className="flex items-center gap-2">
          <MessageCircleQuestion className="h-4 w-4 text-indigo-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            3 High-Impact Conversation Starters for Tonight
          </h3>
        </div>
        <p className="text-[11px] text-slate-400">
          Rather than asking generic "Did you study today?", ask these specific questions tailored to what was scanned and practiced:
        </p>

        <div className="space-y-3">
          {questionsForTonight.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-xs space-y-1.5 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-300">
                  Question {idx + 1} ({item.subject})
                </span>
                <span className="text-[10px] text-slate-400 font-medium">{item.context}</span>
              </div>
              <p className="text-slate-200 font-medium italic">
                {item.question}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Homework Verification Overview */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-5 shadow-xl shadow-indigo-950/20 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Homework Scans & Teacher Evaluation Log
          </h3>
          <span className="text-[11px] text-slate-400">{scans.length} submissions reviewed</span>
        </div>

        <div className="space-y-2 text-xs">
          {scans.slice(0, 4).map(s => (
            <div
              key={s.id}
              className="p-3 rounded-xl border border-white/10 bg-white/5 flex items-center justify-between hover:bg-white/10 backdrop-blur-sm transition-all"
            >
              <div>
                <span className="font-bold text-white">
                  {s.subject} • {s.chapter}
                </span>
                <p className="text-[11px] text-slate-400 line-clamp-1">{s.extractedQuestions}</p>
              </div>
              {s.score !== undefined && (
                <span className="font-bold text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded backdrop-blur-sm">
                  {s.score}/100 Grade
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
