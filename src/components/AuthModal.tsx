import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Lock,
  Mail,
  User as UserIcon,
  BookOpen,
  Users,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { CBSE_CLASSES } from '../lib/cbseData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, signup, loginWithGoogle } = useAuth();

  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [role, setRole] = useState<UserRole>('student');
  const [classLevel, setClassLevel] = useState<string>('Class 10');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    try {
      if (isSignUp) {
        if (!name.trim()) throw new Error('Please enter your full name');
        await signup(email, password, name, role, classLevel);
      } else {
        await login(email, password);
      }
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      if (!email.trim() || !email.includes('@')) {
        setErrorMsg('Please enter your personal Google email above (e.g. yourname@gmail.com)');
        return;
      }
      await loginWithGoogle({
        email: email.trim(),
        name: name.trim() || email.trim().split('@')[0].replace(/[._-]/g, ' '),
        classLevel,
        role
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Google sign-in error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md rounded-3xl border border-white/15 bg-slate-900/80 backdrop-blur-2xl shadow-2xl shadow-indigo-950/50 p-6 space-y-5 text-white">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                {isSignUp ? 'Create EduGenius Account' : 'Welcome to EduGenius AI'}
              </h2>
              <p className="text-[10px] text-slate-400">
                CBSE Classes 1–12 AI Learning Platform
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {isSignUp && (
            <div>
              <label className="block font-semibold text-slate-200 mb-1">
                Full Name:
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Aarav Sharma"
                className="w-full p-2.5 rounded-xl border border-white/15 bg-white/5 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 backdrop-blur-md"
              />
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-200 mb-1">
              Email Address:
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="student@example.com"
              className="w-full p-2.5 rounded-xl border border-white/15 bg-white/5 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 backdrop-blur-md"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-200 mb-1">
              Password:
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-2.5 rounded-xl border border-white/15 bg-white/5 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 backdrop-blur-md"
            />
          </div>

          {isSignUp && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-200 mb-1">
                  I am a:
                </label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as UserRole)}
                  className="w-full p-2.5 rounded-xl border border-white/15 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 backdrop-blur-md"
                >
                  <option value="student" className="bg-slate-900 text-white">Student</option>
                  <option value="parent" className="bg-slate-900 text-white">Parent</option>
                  <option value="teacher" className="bg-slate-900 text-white">Teacher</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-200 mb-1">
                  Class:
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
            </div>
          )}

          {errorMsg && (
            <p className="text-xs text-red-300 bg-red-500/20 p-2.5 rounded-xl border border-red-500/30 backdrop-blur-sm">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-indigo-500/25 transition-all"
          >
            {isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="text-center pt-1">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full py-2.5 rounded-xl border border-white/15 hover:bg-white/10 text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 backdrop-blur-sm transition-all"
          >
            <span>Continue with Google Account</span>
          </button>
        </div>

        <div className="text-center pt-2 border-t border-white/10 text-xs">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-indigo-400 hover:text-indigo-300 font-semibold hover:underline transition-colors"
          >
            {isSignUp
              ? 'Already have an account? Sign in here'
              : "Don't have an account? Sign up for CBSE Classes 1–12"}
          </button>
        </div>
      </div>
    </div>
  );
};
