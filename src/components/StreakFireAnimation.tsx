import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Sparkles, Trophy, Award, Zap, ArrowRight, X, Share2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StreakFireAnimationProps {
  isOpen: boolean;
  onClose: () => void;
  streakDays: number;
  bonusXP?: number;
  onClaimReward?: () => void;
  badgeTitle?: string;
}

export const StreakFireAnimation: React.FC<StreakFireAnimationProps> = ({
  isOpen,
  onClose,
  streakDays,
  bonusXP = 100,
  onClaimReward,
  badgeTitle = 'Streak Champion'
}) => {
  const [claimed, setClaimed] = useState(false);

  // Trigger double confetti cannons on open
  useEffect(() => {
    if (isOpen) {
      setClaimed(false);
      // Center burst
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff4500', '#ff8c00', '#ffd700', '#ff1493', '#6366f1']
      });

      // Left and right side fireworks
      const timer = setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: ['#f97316', '#eab308', '#ef4444']
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: ['#f97316', '#eab308', '#ef4444']
        });
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClaim = () => {
    setClaimed(true);
    // Mega fire celebration burst
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#ff4500', '#ff8c00', '#ffd700', '#22c55e']
    });

    if (onClaimReward) {
      onClaimReward();
    }
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  // Randomized rising ember sparks
  const embers = Array.from({ length: 16 }).map((_, i) => ({
    id: i,
    x: (i % 8) * 18 - 60 + Math.random() * 20,
    delay: Math.random() * 1.5,
    duration: 1.6 + Math.random() * 1.2,
    size: 4 + Math.random() * 6
  }));

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          {/* Backdrop Framer Motion animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
            className="relative w-full max-w-md rounded-3xl border-2 border-amber-500/50 bg-gradient-to-b from-slate-900/95 via-slate-950 to-orange-950/40 p-6 sm:p-8 text-center text-white shadow-2xl shadow-orange-500/30 overflow-hidden z-10"
          >
            {/* Ambient Background Fire Glow */}
            <motion.div
              animate={{
                scale: [1, 1.25, 1.05, 1.2, 1],
                opacity: [0.35, 0.6, 0.4, 0.55, 0.35]
              }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              className="absolute top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-tr from-orange-600/40 via-amber-500/40 to-red-600/30 rounded-full blur-3xl pointer-events-none"
            />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Framer Motion Multi-Layered Flame */}
            <div className="relative w-36 h-44 mx-auto my-2 flex items-center justify-center">
              {/* Floating Embers */}
              {embers.map(e => (
                <motion.div
                  key={e.id}
                  initial={{ y: 20, x: e.x, opacity: 0, scale: 0.5 }}
                  animate={{
                    y: -110,
                    x: e.x + (Math.random() * 30 - 15),
                    opacity: [0, 1, 0.8, 0],
                    scale: [0.5, 1.2, 0.8, 0.2]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: e.duration,
                    delay: e.delay,
                    ease: 'easeOut'
                  }}
                  style={{ width: e.size, height: e.size }}
                  className="absolute bottom-6 rounded-full bg-amber-300 shadow-md shadow-orange-500 pointer-events-none"
                />
              ))}

              {/* Layer 1: Outer Red/Orange Flame Halo */}
              <motion.div
                animate={{
                  scale: [1, 1.15, 0.95, 1.1, 1],
                  rotate: [-3, 4, -4, 2, 0],
                  borderRadius: ['40% 60% 70% 30% / 40% 50% 60% 50%', '60% 40% 30% 70% / 50% 60% 30% 60%', '40% 60% 70% 30% / 40% 50% 60% 50%']
                }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                className="absolute inset-2 bg-gradient-to-t from-red-600 via-orange-500 to-amber-400 rounded-full blur-[2px] opacity-90 shadow-[0_0_50px_rgba(249,115,22,0.9)]"
              />

              {/* Layer 2: Mid Radiant Flame */}
              <motion.div
                animate={{
                  scale: [0.95, 1.18, 0.9, 1.12, 0.95],
                  rotate: [3, -4, 2, -2, 3],
                  y: [-2, 3, -4, 2, -2]
                }}
                transition={{ repeat: Infinity, duration: 1.3, ease: 'easeInOut' }}
                className="absolute inset-5 bg-gradient-to-t from-orange-500 via-amber-400 to-yellow-200 rounded-full blur-[1px] opacity-95"
              />

              {/* Layer 3: Inner White-Hot Core */}
              <motion.div
                animate={{
                  scale: [0.85, 1.15, 0.9, 1.2, 0.85],
                  y: [2, -3, 1, -2, 2]
                }}
                transition={{ repeat: Infinity, duration: 0.9, ease: 'easeInOut' }}
                className="absolute inset-9 bg-gradient-to-t from-amber-200 via-yellow-100 to-white rounded-full blur-[0.5px] shadow-[0_0_25px_rgba(255,255,255,0.9)] flex items-center justify-center"
              >
                <Flame className="h-10 w-10 text-orange-600 fill-orange-500" />
              </motion.div>

              {/* Center Icon Ring Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0.9, 1.1, 1] }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="absolute -bottom-2 px-3 py-1 rounded-full bg-slate-900/90 border border-amber-400/60 shadow-lg flex items-center gap-1.5"
              >
                <Flame className="h-4 w-4 text-orange-400 fill-orange-400 animate-pulse" />
                <span className="text-xs font-black text-amber-300 tracking-wider">
                  {streakDays} DAYS ACTIVE
                </span>
              </motion.div>
            </div>

            {/* Typography & Headline */}
            <div className="space-y-2 mt-4">
              <motion.div
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-300 text-xs font-extrabold uppercase tracking-wider"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Streak Milestone Achieved!</span>
              </motion.div>

              <motion.h3
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl sm:text-3xl font-black text-white tracking-tight"
              >
                You're on Fire! 🔥
              </motion.h3>

              <motion.p
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto leading-relaxed"
              >
                Consistent daily study is the true secret of CBSE rankers. You maintained a{' '}
                <strong className="text-amber-300 font-bold">{streakDays}-day streak</strong> and unlocked milestone honor badges!
              </motion.p>
            </div>

            {/* Perks Cards */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 gap-2.5 my-5"
            >
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-left space-y-0.5">
                <span className="text-[10px] text-amber-300 uppercase font-bold flex items-center gap-1">
                  <Zap className="h-3 w-3" /> Streak Bonus
                </span>
                <div className="text-lg font-black text-white">+{bonusXP} XP</div>
                <p className="text-[10px] text-slate-400">Added to leaderboard</p>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-left space-y-0.5">
                <span className="text-[10px] text-emerald-300 uppercase font-bold flex items-center gap-1">
                  <Award className="h-3 w-3" /> Honor Badge
                </span>
                <div className="text-sm font-extrabold text-white truncate">{badgeTitle}</div>
                <p className="text-[10px] text-slate-400">Unlocked in Achievements</p>
              </div>
            </motion.div>

            {/* Interactive Action Buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="space-y-2"
            >
              <button
                type="button"
                onClick={handleClaim}
                disabled={claimed}
                className="w-full py-3.5 rounded-2xl font-black text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 hover:from-amber-300 hover:to-orange-300 shadow-xl shadow-orange-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-80 transform active:scale-98"
              >
                <Flame className="h-4 w-4 fill-slate-950 text-slate-950" />
                <span>{claimed ? '🔥 Streak Ignited! (+XP Added)' : 'Keep The Flame Burning & Claim +XP'}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Continue Learning Loop
              </button>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
