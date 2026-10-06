import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  Lock,
  Mail,
  User as UserIcon,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Camera,
  MessageSquare,
  Award,
  BarChart3,
  Flame,
  Zap,
  Loader2,
  Check,
  Crown,
  Layers,
  BookCheck,
  IndianRupee
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole, SubscriptionPlan } from '../types';
import { CBSE_CLASSES } from '../lib/cbseData';
import { AttributionBadge } from './AttributionBadge';

const AVAILABLE_SUBJECTS = [
  { id: 'Mathematics', name: 'Mathematics', color: 'blue' },
  { id: 'Science', name: 'Science (Physics, Chem, Bio)', color: 'purple' },
  { id: 'English', name: 'English Language & Lit', color: 'emerald' },
  { id: 'Social Science', name: 'Social Science (History, Geo, Civics)', color: 'amber' },
  { id: 'Hindi', name: 'Hindi (Course A / B)', color: 'rose' },
  { id: 'Computer Science', name: 'Computer Applications / AI', color: 'cyan' },
  { id: 'Sanskrit', name: 'Sanskrit', color: 'teal' }
];

export const LoginPage: React.FC = () => {
  const { login, signup, loginWithGoogle, loginDemoStudent, isLoading } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [role, setRole] = useState<UserRole>('student');
  const [classLevel, setClassLevel] = useState<string>('Class 9');
  const [board, setBoard] = useState<string>('CBSE');
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('standard');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([
    'Mathematics',
    'Science',
    'English',
    'Social Science'
  ]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Google Account prompt modal state
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState<boolean>(false);
  const [googleEmailInput, setGoogleEmailInput] = useState<string>('');
  const [googleNameInput, setGoogleNameInput] = useState<string>('');

  const toggleSubject = (subjectId: string) => {
    setSelectedSubjects(prev =>
      prev.includes(subjectId)
        ? prev.length > 1
          ? prev.filter(s => s !== subjectId)
          : prev // keep at least one
        : [...prev, subjectId]
    );
  };

  const handleSelectAllSubjects = () => {
    if (selectedSubjects.length === AVAILABLE_SUBJECTS.length) {
      setSelectedSubjects(['Mathematics', 'Science']);
    } else {
      setSelectedSubjects(AVAILABLE_SUBJECTS.map(s => s.id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    try {
      if (mode === 'signup') {
        if (!name.trim()) throw new Error('Please enter your full name');
        if (!email.trim() || !email.includes('@')) throw new Error('Please enter a valid email address');
        if (password.length < 4) throw new Error('Password must be at least 4 characters');
        if (selectedSubjects.length === 0) throw new Error('Please select at least 1 subject');
        await signup(email.trim(), password, name.trim(), role, classLevel, board, selectedSubjects, selectedPlan);
      } else {
        if (!email.trim()) throw new Error('Please enter your email');
        if (!password.trim()) throw new Error('Please enter your password');
        await login(email.trim(), password);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    }
  };

  const handleGoogleLogin = () => {
    setErrorMsg(null);
    // Open Google Account dialog so the user explicitly signs in with their own Google account
    setGoogleEmailInput(email.trim());
    setGoogleNameInput(name.trim());
    setIsGoogleModalOpen(true);
  };

  const handleConfirmGoogleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleEmailInput.trim() || !googleEmailInput.includes('@')) {
      setErrorMsg('Please enter a valid Google Account email (e.g. yourname@gmail.com)');
      return;
    }

    try {
      const parsedName =
        googleNameInput.trim() ||
        googleEmailInput.trim().split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

      await loginWithGoogle({
        email: googleEmailInput.trim(),
        name: parsedName,
        classLevel,
        board,
        plan: selectedPlan,
        subjects: selectedSubjects
      });
      setIsGoogleModalOpen(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to sign in with Google');
    }
  };

  const handleDemoLogin = async () => {
    setErrorMsg(null);
    try {
      await loginDemoStudent({
        name: name.trim() || 'Guest Scholar',
        classLevel,
        board,
        plan: selectedPlan,
        subjects: selectedSubjects
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to enter guest mode');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center py-8 px-4 sm:px-6 relative overflow-hidden font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Background ambient decorative glow effects */}
      <div className="fixed top-0 left-1/4 w-[36rem] h-[36rem] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none -translate-y-1/2 z-0" />
      <div className="fixed bottom-0 right-1/4 w-[32rem] h-[32rem] bg-purple-600/15 rounded-full blur-3xl pointer-events-none translate-y-1/3 z-0" />
      <div className="fixed top-1/2 right-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Main Container Card */}
      <div className="w-full max-w-5xl relative z-10 grid grid-cols-1 lg:grid-cols-12 rounded-3xl border border-white/15 bg-white/[0.03] backdrop-blur-2xl shadow-2xl shadow-indigo-950/60 overflow-hidden">
        {/* Left Side: Brand Narrative & Feature Highlights */}
        <div className="lg:col-span-5 p-6 sm:p-10 bg-gradient-to-br from-indigo-950/70 via-slate-900/70 to-purple-950/50 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 border border-white/20">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xl text-white tracking-tight">
                    EduGenius <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">AI</span>
                  </span>
                </div>
                <p className="text-[11px] text-indigo-200/80 font-medium">
                  CBSE Classes 1–12 Diagnostic Learning Platform
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
                Your AI Teacher for CBSE Board Excellence.
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Step-by-step homework evaluation, 24/7 doubt resolution in Hinglish & English, and diagnostic tracking tailored to your syllabus.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
                <div className="h-8 w-8 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-300 shrink-0">
                  <Camera className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">AI Homework Scanner</h4>
                  <p className="text-[11px] text-slate-300">
                    Upload handwritten pages to get exact step corrections and CBSE marking scheme scores.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
                <div className="h-8 w-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0">
                  <Award className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Academic Badges System</h4>
                  <p className="text-[11px] text-slate-300">
                    Unlock honors like <em>Quiz Master</em> and <em>Early Bird</em> based on your practice progress.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
                <div className="h-8 w-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 shrink-0">
                  <BarChart3 className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Zero-Baseline Progress Tracking</h4>
                  <p className="text-[11px] text-slate-300">
                    Every student begins from 0 stats (0 streak, 0 XP, 0%). Real mastery grows as you scan & practice.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Value Callout */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/30 text-xs text-slate-300">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Crown className="h-3.5 w-3.5 text-amber-400" />
                Affordable Student Editions
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                From ₹49
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Choose between Standard (₹49) or Premium Pro (₹69) for complete NCERT coverage and AI tutoring.
            </p>
          </div>
        </div>

        {/* Right Side: Auth Tabs & Configurable Signup Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
          {/* Header & Tabs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              {/* Tab Switcher */}
              <div className="flex rounded-xl bg-white/5 p-1 border border-white/10">
                <button
                  type="button"
                  id="tab-signin"
                  onClick={() => setMode('signin')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    mode === 'signin'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  id="tab-signup"
                  onClick={() => setMode('signup')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    mode === 'signup'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Create Account
                </button>
              </div>

              <span className="text-[11px] text-slate-400 font-medium">
                {mode === 'signin' ? 'Existing Scholar' : 'New Scholar (0 Stats)'}
              </span>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">
                {mode === 'signin' ? 'Sign In to Your Learning Space' : 'Configure Your Student Profile & Plan'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {mode === 'signin'
                  ? 'Enter your credentials to access homework scans, AI teacher chat, and study plans.'
                  : 'Select your class, subjects, and membership tier to start with a clean 0-value baseline.'}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <UserIcon className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-white/15 bg-white/5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 backdrop-blur-md transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email (e.g. student@gmail.com)"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-white/15 bg-white/5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 backdrop-blur-md transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-200">
                  Password
                </label>
                {mode === 'signin' && (
                  <span className="text-[11px] text-indigo-400 hover:underline cursor-pointer">
                    Forgot password?
                  </span>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={mode === 'signup' ? 'Create a password (min. 4 chars)' : 'Enter your password'}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-white/15 bg-white/5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 backdrop-blur-md transition-all"
                />
              </div>
            </div>

            {/* Class & Board Selection (Shown in both or SignUp) */}
            <div className="space-y-3 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1.5 flex items-center justify-between">
                    <span>Select Class / Grade</span>
                    <span className="text-[10px] text-indigo-400 font-normal">CBSE Syllabus</span>
                  </label>
                  <select
                    value={classLevel}
                    onChange={e => setClassLevel(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-white/15 bg-slate-900 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 backdrop-blur-md"
                  >
                    {CBSE_CLASSES.map(c => (
                      <option key={c} value={c}>
                        {c} {c === 'Class 9' ? '(Recommended for 9th Grade)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                    Curriculum Board
                  </label>
                  <select
                    value={board}
                    onChange={e => setBoard(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-white/15 bg-slate-900 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 backdrop-blur-md"
                  >
                    <option value="CBSE">CBSE Board (NCERT)</option>
                    <option value="ICSE">ICSE Board</option>
                    <option value="State Board">State Board</option>
                  </select>
                </div>
              </div>

              {/* Subject Selection Pills */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <BookCheck className="h-3.5 w-3.5 text-indigo-400" />
                    <span>Select Enrolled Subjects ({selectedSubjects.length})</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleSelectAllSubjects}
                    className="text-[10px] font-semibold text-indigo-300 hover:text-white transition-colors"
                  >
                    {selectedSubjects.length === AVAILABLE_SUBJECTS.length ? 'Reset' : 'Select All'}
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {AVAILABLE_SUBJECTS.map(subj => {
                    const isSelected = selectedSubjects.includes(subj.id);
                    return (
                      <button
                        key={subj.id}
                        type="button"
                        onClick={() => toggleSubject(subj.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 border ${
                          isSelected
                            ? 'bg-indigo-600/30 border-indigo-400/60 text-white shadow-sm'
                            : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20'
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${
                            isSelected ? 'bg-indigo-400' : 'bg-slate-600'
                          }`}
                        />
                        <span>{subj.name}</span>
                        {isSelected && <Check className="h-3 w-3 text-indigo-300 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Subscription Plan Selection (Standard ₹49 vs Premium ₹69) */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Crown className="h-3.5 w-3.5 text-amber-400" />
                    <span>Choose Edition / Plan</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold">100% Guaranteed 0-Stats Start</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Standard Plan - ₹49 */}
                  <div
                    onClick={() => setSelectedPlan('standard')}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                      selectedPlan === 'standard'
                        ? 'bg-indigo-950/40 border-indigo-400/70 shadow-lg shadow-indigo-950/50 ring-1 ring-indigo-400'
                        : 'bg-white/[0.03] border-white/10 hover:border-white/20 opacity-85 hover:opacity-100'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-white">Standard Version</span>
                        <div className="flex items-baseline gap-0.5 text-emerald-400 font-black text-sm">
                          <span>₹</span>
                          <span className="text-base">49</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-2 leading-tight">
                        Full NCERT AI Question Solver, Step-by-Step Homework Scanner, AI Tutor & 0-Baseline Tracking.
                      </p>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">Class {classLevel.replace('Class ', '')} Full Access</span>
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                          selectedPlan === 'standard'
                            ? 'bg-indigo-600 border-indigo-400 text-white'
                            : 'border-white/20'
                        }`}
                      >
                        {selectedPlan === 'standard' && <Check className="h-2.5 w-2.5" />}
                      </div>
                    </div>
                  </div>

                  {/* Premium Plan - ₹69 */}
                  <div
                    onClick={() => setSelectedPlan('premium')}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                      selectedPlan === 'premium'
                        ? 'bg-gradient-to-br from-amber-950/40 via-purple-950/30 to-indigo-950/40 border-amber-400/70 shadow-xl shadow-amber-950/40 ring-1 ring-amber-400'
                        : 'bg-white/[0.03] border-white/10 hover:border-white/20 opacity-85 hover:opacity-100'
                    }`}
                  >
                    {/* Popular Tag */}
                    <div className="absolute -top-2 right-3">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md">
                        Best Value
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                          <Crown className="h-3 w-3 text-amber-400" />
                          Premium Pro
                        </span>
                        <div className="flex items-baseline gap-0.5 text-amber-300 font-black text-sm">
                          <span>₹</span>
                          <span className="text-base">69</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-300 line-clamp-2 leading-tight">
                        Everything in Standard + Dual-AI Comparison, Badges Honors System & Parental AI Intelligence.
                      </p>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px]">
                      <span className="text-amber-200/80 font-medium">All Features Unlocked</span>
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                          selectedPlan === 'premium'
                            ? 'bg-amber-500 border-amber-300 text-slate-950'
                            : 'border-white/20'
                        }`}
                      >
                        {selectedPlan === 'premium' && <Check className="h-2.5 w-2.5 font-bold" />}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                <span className="shrink-0 mt-0.5 font-bold">!</span>
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              id="btn-submit-auth"
              className="w-full py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-xl shadow-indigo-500/25 border border-white/15 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>
                    {mode === 'signin'
                      ? `Sign In (${selectedPlan === 'premium' ? 'Premium Pro' : 'Standard'} • ${classLevel})`
                      : `Create Account (${selectedPlan === 'premium' ? '₹69 Premium' : '₹49 Standard'})`}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Alternative Auth Dividers */}
          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-slate-950/80 px-2.5 text-slate-400 font-semibold tracking-wider">
                Or Continue With
              </span>
            </div>
          </div>

          {/* Google and Demo Quick Actions */}
          <div className="space-y-3">
            <button
              type="button"
              id="btn-login-google"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full py-2.5 px-3.5 rounded-xl border border-white/20 bg-white/[0.06] hover:bg-white/[0.12] hover:border-indigo-400/50 text-xs font-semibold text-white flex items-center justify-between transition-all shadow-md group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <div className="text-left">
                  <span className="font-bold text-white block">Continue with Google</span>
                  <span className="text-[10px] text-indigo-300 font-normal">{email.trim() || 'Sign in with your Google account'}</span>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 group-hover:bg-indigo-500/30 font-semibold">
                Google Sign In
              </span>
            </button>

            <button
              type="button"
              id="btn-login-demo"
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="w-full py-2 px-3 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-xs font-semibold text-indigo-200 flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <span>Explore as Guest (0 Baseline Stats)</span>
            </button>
          </div>

          {/* Reassurance text */}
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 text-[11px] text-slate-400 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>
              All new student profiles start with <strong>0 Streak</strong>, <strong>0 XP</strong>, and <strong>0% scores</strong>.
            </span>
          </div>

          <div className="pt-1">
            <AttributionBadge position="inline" className="rounded-xl border border-white/10" />
          </div>
        </div>
      </div>

      {/* Interactive Google Account Selection Dialog */}
      {isGoogleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl border border-white/15 bg-slate-900/95 backdrop-blur-2xl shadow-2xl p-6 sm:p-7 space-y-4 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <svg className="h-6 w-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <div>
                  <h3 className="text-sm font-bold text-white">Sign in with Google</h3>
                  <p className="text-[11px] text-slate-400">Enter your personal Google Account details</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsGoogleModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmGoogleLogin} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Google Account Email:
                </label>
                <input
                  type="email"
                  required
                  autoFocus
                  value={googleEmailInput}
                  onChange={e => setGoogleEmailInput(e.target.value)}
                  placeholder="your.google.account@gmail.com"
                  className="w-full p-2.5 rounded-xl border border-white/15 bg-white/5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Your Full Name:
                </label>
                <input
                  type="text"
                  value={googleNameInput}
                  onChange={e => setGoogleNameInput(e.target.value)}
                  placeholder="e.g. Your Name"
                  className="w-full p-2.5 rounded-xl border border-white/15 bg-white/5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-200">
                Signing in for: <strong className="text-white">{classLevel}</strong> ({board}) • <span className="capitalize">{selectedPlan}</span> Plan
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsGoogleModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                  <span>Sign In as {googleNameInput.trim() || 'Student'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Bottom Corner Badge */}
      <AttributionBadge position="fixed" />
    </div>
  );
};
