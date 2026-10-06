import React from 'react';
import { Heart, Sparkles, GraduationCap } from 'lucide-react';

interface AttributionBadgeProps {
  className?: string;
  position?: 'fixed' | 'inline';
}

export const AttributionBadge: React.FC<AttributionBadgeProps> = ({
  className = '',
  position = 'fixed'
}) => {
  if (position === 'inline') {
    return (
      <div className={`flex items-center justify-center gap-2 py-3 px-4 text-xs text-slate-400 border-t border-white/10 bg-slate-950/40 backdrop-blur-md ${className}`}>
        <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
        <span>
          Made by <strong className="text-white font-semibold">Siddharth Yadav</strong> for <span className="text-indigo-300 font-medium">9th Grade</span>
        </span>
        <span className="text-slate-600">•</span>
        <span className="text-[11px] text-slate-500">EduGenius AI</span>
      </div>
    );
  }

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 pointer-events-auto transition-all duration-300 hover:scale-105 ${className}`}
      role="contentinfo"
      aria-label="Creator Attribution"
    >
      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-850 border border-indigo-500/30 hover:border-indigo-400/50 shadow-xl shadow-indigo-950/50 backdrop-blur-xl text-xs text-slate-300 group">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-slate-300 group-hover:text-white transition-colors">
          Made by <strong className="text-indigo-300 font-semibold">Siddharth Yadav</strong> for <span className="text-purple-300 font-medium">9th Grade</span>
        </span>
        <GraduationCap className="h-3.5 w-3.5 text-indigo-400 group-hover:text-indigo-300" />
      </div>
    </div>
  );
};
