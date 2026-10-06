import React, { useState } from 'react';
import {
  GraduationCap,
  Flame,
  Zap,
  Moon,
  Sun,
  Bell,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { storage } from '../lib/storage';

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenSettings: () => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  onOpenSettings,
  onToggleSidebar,
  isSidebarOpen,
  setActiveTab
}) => {
  const { user, logout, switchRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const notifications = user ? storage.getNotifications(user.uid) : [];
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-slate-950/60 backdrop-blur-2xl transition-colors shadow-lg shadow-black/20">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left: Brand & Sidebar toggle */}
        <div className="flex items-center gap-3">
          <button
            id="btn-toggle-sidebar"
            onClick={onToggleSidebar}
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl border border-transparent hover:border-white/10 lg:hidden transition-all"
            title="Toggle Navigation"
            aria-label="Toggle Navigation"
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 border border-white/20 transition-transform">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-white tracking-tight">
                  EduGenius <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">AI</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-semibold text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 rounded-full backdrop-blur-md">
                  CBSE 1–12
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden md:block">
                Personal AI Teacher • Homework Scanner • Exam Coach
              </p>
            </div>
          </div>
        </div>

        {/* Center: Quick info for logged in student */}
        {user && (
          <div className="hidden md:flex items-center gap-3 text-xs font-semibold">
            {/* Class Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 text-slate-200 border border-white/10 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50" />
              <span>{user.classLevel}</span>
              <span className="text-slate-400">({user.board})</span>
            </div>

            {/* Streak */}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 backdrop-blur-md cursor-pointer hover:bg-amber-500/20 transition-all"
              title={`${user.streakDays} Day Study Streak`}
            >
              <Flame className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span>{user.streakDays} Days</span>
            </div>

            {/* XP Points */}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 backdrop-blur-md cursor-pointer hover:bg-purple-500/20 transition-all"
              title={`Level ${user.level} Scholar (${user.xp} XP)`}
            >
              <Zap className="h-4 w-4 fill-purple-400 text-purple-400" />
              <span>{user.xp} XP</span>
              <span className="text-[10px] bg-purple-500/30 border border-purple-400/30 px-1.5 py-0.2 rounded-full font-bold">
                Lvl {user.level}
              </span>
            </div>
          </div>
        )}

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick AI solve trigger */}
          <button
            id="btn-nav-solve"
            onClick={() => setActiveTab('homework-scanner')}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-xl shadow-md shadow-indigo-500/25 border border-white/15 transition-all"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Scan Homework</span>
          </button>

          {/* Theme toggle */}
          <button
            id="btn-toggle-theme"
            onClick={toggleTheme}
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl border border-transparent hover:border-white/10 transition-all"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-indigo-300" />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              id="btn-notifications"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl border border-transparent hover:border-white/10 transition-all"
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-slate-900">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#0d1322]/90 backdrop-blur-2xl border border-white/15 p-3.5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
                  <h4 className="text-xs font-bold text-white">Recent Notifications</h4>
                  <span className="text-[10px] text-indigo-400 hover:text-indigo-300 cursor-pointer">Mark all as read</span>
                </div>
                <div className="divide-y divide-white/5 max-h-72 overflow-y-auto mt-2">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">No notifications yet</p>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className="py-2.5 px-1 hover:bg-white/5 rounded-xl transition-colors">
                        <div className="flex items-start justify-between">
                          <p className="text-xs font-semibold text-slate-200">{n.title}</p>
                          <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Account / Login */}
          {user ? (
            <div className="relative">
              <button
                id="btn-user-dropdown"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/10 border border-transparent hover:border-white/10 transition-all"
                aria-label="User profile menu"
              >
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-sm border border-white/20">
                  {user.name.charAt(0)}
                </div>
                <div className="text-left hidden lg:block">
                  <p className="text-xs font-semibold text-white leading-none">{user.name}</p>
                  <p className="text-[10px] text-slate-400 capitalize">{user.role}</p>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden lg:block" />
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0d1322]/90 backdrop-blur-2xl border border-white/15 p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2 border-b border-white/10">
                    <p className="text-xs font-bold text-white">{user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold uppercase border border-indigo-500/30">
                        {user.classLevel}
                      </span>
                      <span className="text-[10px] text-slate-400">Lvl {user.level}</span>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onOpenSettings();
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-white/10 hover:text-white rounded-xl flex items-center gap-2 transition-colors"
                    >
                      <User className="h-4 w-4 text-indigo-400" />
                      <span>Profile & Settings</span>
                    </button>
                    {user.role === 'student' ? (
                      <button
                        onClick={() => {
                          switchRole('parent');
                          setActiveTab('parent-dashboard');
                          setShowUserDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-indigo-400 hover:bg-white/10 hover:text-indigo-300 rounded-xl flex items-center gap-2 transition-colors"
                      >
                        <span>Switch to Parent View</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          switchRole('student');
                          setActiveTab('dashboard');
                          setShowUserDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-indigo-400 hover:bg-white/10 hover:text-indigo-300 rounded-xl flex items-center gap-2 transition-colors"
                      >
                        <span>Switch to Student View</span>
                      </button>
                    )}
                  </div>

                  <div className="pt-1 border-t border-white/10">
                    <button
                      onClick={() => {
                        logout();
                        setShowUserDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-xl flex items-center gap-2 font-medium transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              id="btn-sign-in"
              onClick={onOpenAuth}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-xl shadow-md shadow-indigo-500/20 border border-white/15 transition-all"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
