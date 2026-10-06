import React from 'react';
import {
  LayoutDashboard,
  Camera,
  MessageSquare,
  HelpCircle,
  Cpu,
  BookOpen,
  FileText,
  Award,
  Calendar,
  BarChart3,
  StickyNote,
  Users,
  Settings,
  Sparkles,
  LogOut,
  Trophy
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  onClose
}) => {
  const { user, logout } = useAuth();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'tutor-chat',
      label: 'AI Teacher & Doubt Solver',
      icon: MessageSquare,
      badge: 'Voice'
    },
    {
      id: 'quizzes',
      label: 'AI Quiz Coach',
      icon: Award,
      badge: 'CBSE Pattern'
    },
    {
      id: 'mistake-book',
      label: 'My Mistake Book',
      icon: BookOpen,
      badge: 'Error Log',
      badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
    },
    {
      id: 'leaderboard',
      label: 'Academic Leaderboard',
      icon: Trophy,
      badge: 'Rankings',
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
    },
    {
      id: 'study-planner',
      label: 'AI Study Planner',
      icon: Calendar,
      badge: null
    },
    {
      id: 'homework-scanner',
      label: 'AI Homework Scanner',
      icon: Camera,
      badge: 'Vision OCR',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
    },
    {
      id: 'notes-flashcards',
      label: 'Notes & Flashcards',
      icon: StickyNote,
      badge: null
    },
    {
      id: 'cbse-explorer',
      label: 'CBSE Curriculum (6–12)',
      icon: BookOpen,
      badge: null
    },
    {
      id: 'analytics',
      label: 'Progress & Weekly Report',
      icon: BarChart3,
      badge: 'Weekly Digest',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
    },
    {
      id: 'solver',
      label: 'AI Step Solver',
      icon: HelpCircle,
      badge: null
    },
    {
      id: 'model-comparison',
      label: 'Multi-AI Comparison',
      icon: Cpu,
      badge: 'Comparison'
    },
    {
      id: 'document-scanner',
      label: 'PDF & Doc Analyzer',
      icon: FileText,
      badge: null
    },
    {
      id: 'parent-dashboard',
      label: 'Parent Companion',
      icon: Users,
      badge: user?.role === 'parent' ? 'Active' : null
    },
    {
      id: 'settings',
      label: 'Settings & Profile',
      icon: Settings,
      badge: null
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-md lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 border-r border-white/10 bg-slate-950/70 lg:bg-white/[0.03] backdrop-blur-2xl overflow-y-auto transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-3 space-y-1">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Learning Suite
          </div>

          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-white/10 text-white border border-white/15 shadow-sm'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 transition-colors ${
                      isActive
                        ? 'text-indigo-400'
                        : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      item.badgeColor ||
                      'bg-white/10 text-indigo-300 border border-white/10'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Pro Banner at bottom */}
        <div className="p-4 m-3 mt-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
          <div className="flex items-center gap-2 text-indigo-400">
            <Sparkles className="h-4 w-4" />
            <span className="text-xs font-bold text-white">EduGenius Pro Vision</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
            Multi-page handwritten OCR and step-by-step CBSE marking verification enabled.
          </p>
          <button
            onClick={() => {
              setActiveTab('homework-scanner');
              onClose();
            }}
            className="mt-3 w-full py-2 px-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-[11px] font-semibold text-center transition-all shadow-md shadow-indigo-500/20 border border-white/15"
          >
            Launch Scanner
          </button>
        </div>
        {/* User Account / Sign Out in Sidebar */}
        {user && (
          <div className="p-3 m-3 mt-2 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm border border-white/20">
                {user.name.charAt(0)}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate leading-tight">{user.name}</p>
                <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{user.classLevel} • {user.xp ?? 0} XP</p>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              title="Sign Out"
              className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Sidebar Footer Credit */}
        <div className="px-4 pb-4 pt-1 text-[11px] text-slate-400 text-center">
          <p>Made by <span className="text-indigo-300 font-semibold">Siddharth Yadav</span></p>
          <p className="text-[10px] text-slate-500">for 9th Grade • EduGenius AI</p>
        </div>
      </aside>
    </>
  );
};
