import React, { useState, useMemo } from 'react';
import {
  Award,
  Sparkles,
  Trophy,
  Flame,
  Zap,
  Target,
  BookOpen,
  CheckCircle2,
  Lock,
  Sunrise,
  Brain,
  HelpCircle,
  FileCheck2,
  Compass,
  Star,
  ChevronRight,
  Info,
  Clock,
  BookmarkCheck,
  Check,
  TrendingUp,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { storage } from '../lib/storage';
import { localStore } from '../lib/firebase';
import { QuizResult, HomeworkScan, MistakeRecord } from '../types';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { StreakFireAnimation } from './StreakFireAnimation';

export interface BadgeDefinition {
  id: string;
  title: string;
  category: 'quiz' | 'mastery' | 'streak';
  description: string;
  requirement: string;
  iconName: string;
  iconColor: string;
  bgGradient: string;
  borderGlow: string;
  xpReward: number;
  currentProgress: number;
  targetProgress: number;
  unlocked: boolean;
  unlockedDate?: string;
  hint: string;
  actionTab?: string;
  actionLabel?: string;
}

interface BadgesSystemProps {
  compact?: boolean;
  onNavigateTab?: (tab: string) => void;
  className?: string;
}

export const BadgesSystem: React.FC<BadgesSystemProps> = ({
  compact = false,
  onNavigateTab,
  className = ''
}) => {
  const { user, addXP } = useAuth();
  const userStreak = user?.streakDays ?? 0;
  const userXP = user?.xp ?? 0;

  const [selectedCategory, setSelectedCategory] = useState<'all' | 'quiz' | 'mastery' | 'streak'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [activeBadgeModal, setActiveBadgeModal] = useState<BadgeDefinition | null>(null);
  const [isStreakModalOpen, setIsStreakModalOpen] = useState<boolean>(false);
  const [streakModalData, setStreakModalData] = useState<{ days: number; bonusXP: number; badgeTitle: string }>({
    days: userStreak || 1,
    bonusXP: 150,
    badgeTitle: 'Streak Champion'
  });

  // Track claimed rewards in local storage
  const [claimedBadges, setClaimedBadges] = useState<Record<string, boolean>>(() => {
    return localStore.get<Record<string, boolean>>(`claimed_badges_${user?.uid || 'guest'}`, {});
  });

  // Calculate live badge data from real user activity
  const badgesData = useMemo<BadgeDefinition[]>(() => {
    const userScans = user ? storage.getScans(user.uid) : [];
    const userQuizzes = user ? storage.getQuizResults(user.uid) : [];
    const userMistakes = user ? storage.getMistakes(user.uid) : [];

    // Check morning activity (5:00 AM - 10:00 AM)
    const hasMorningActivity = userScans.some(s => {
      const h = new Date(s.createdAt).getHours();
      return h >= 5 && h < 10;
    }) || userQuizzes.some(q => {
      const h = new Date(q.createdAt || q.date || Date.now()).getHours();
      return h >= 5 && h < 10;
    });

    // Quiz computations
    const totalQuizzes = userQuizzes.length;
    const highScoringQuizzes = userQuizzes.filter(q => (q.scorePercentage ?? q.percentage ?? 0) >= 80);
    const perfectQuizzes = userQuizzes.filter(q => (q.scorePercentage ?? q.percentage ?? 0) === 100);
    const speedQuizzes = userQuizzes.filter(q => {
      const time = q.timeTakenSeconds ?? 0;
      const pct = q.scorePercentage ?? q.percentage ?? 0;
      return time > 0 && time <= 180 && pct >= 80;
    });

    // Chapter mastery computations
    const chaptersMasteredSet = new Set(highScoringQuizzes.map(q => q.chapter));
    const chaptersMasteredCount = chaptersMasteredSet.size;
    const masteredMistakesCount = userMistakes.filter(m => m.mastered).length;
    const subjectsPracticedSet = new Set([
      ...userQuizzes.map(q => q.subject),
      ...userScans.map(s => s.subject)
    ]);
    const subjectsPracticedCount = subjectsPracticedSet.size;

    const list: BadgeDefinition[] = [
      // ==========================================
      // 1. QUIZ COMPLETION & PERFORMANCE BADGES
      // ==========================================
      {
        id: 'first-quiz',
        title: 'Quiz Initiate',
        category: 'quiz',
        description: 'Take your first step on the learning loop by completing a CBSE quiz assessment.',
        requirement: 'Complete 1 chapter quiz',
        iconName: 'Target',
        iconColor: 'text-blue-400',
        bgGradient: 'from-blue-500/20 via-indigo-500/10 to-cyan-500/5',
        borderGlow: 'border-blue-500/40 group-hover:border-blue-400',
        xpReward: 100,
        currentProgress: Math.min(totalQuizzes, 1),
        targetProgress: 1,
        unlocked: totalQuizzes >= 1,
        unlockedDate: totalQuizzes >= 1 ? 'First Step Completed' : undefined,
        hint: 'Generate and submit any quiz from the AI Quiz Coach.',
        actionTab: 'quizzes',
        actionLabel: 'Take First Quiz'
      },
      {
        id: 'quiz-prodigy',
        title: 'Quiz Prodigy',
        category: 'quiz',
        description: 'Complete 5 different CBSE practice quizzes across your enrolled subjects.',
        requirement: 'Complete 5 CBSE quizzes',
        iconName: 'Trophy',
        iconColor: 'text-amber-400',
        bgGradient: 'from-amber-500/20 via-yellow-500/10 to-orange-500/5',
        borderGlow: 'border-amber-500/40 group-hover:border-amber-400',
        xpReward: 250,
        currentProgress: Math.min(totalQuizzes, 5),
        targetProgress: 5,
        unlocked: totalQuizzes >= 5,
        unlockedDate: totalQuizzes >= 5 ? 'Mastery in Action' : undefined,
        hint: 'Build testing momentum by taking regular quizzes.',
        actionTab: 'quizzes',
        actionLabel: 'Take a Quiz'
      },
      {
        id: 'accuracy-ace',
        title: 'Accuracy Ace',
        category: 'quiz',
        description: 'Attain high diagnostic accuracy by scoring 80% or higher in 3 quizzes.',
        requirement: 'Score 80%+ on 3 quizzes',
        iconName: 'Award',
        iconColor: 'text-emerald-400',
        bgGradient: 'from-emerald-500/20 via-teal-500/10 to-green-500/5',
        borderGlow: 'border-emerald-500/40 group-hover:border-emerald-400',
        xpReward: 200,
        currentProgress: Math.min(highScoringQuizzes.length, 3),
        targetProgress: 3,
        unlocked: highScoringQuizzes.length >= 3,
        unlockedDate: highScoringQuizzes.length >= 3 ? 'High Precision' : undefined,
        hint: 'Carefully review each question and aim for 80% or better.',
        actionTab: 'quizzes',
        actionLabel: 'Boost Accuracy'
      },
      {
        id: 'flawless-run',
        title: 'Flawless 100%',
        category: 'quiz',
        description: 'Attain a perfect 100% score on any chapter assessment without any errors.',
        requirement: 'Score 100% on any quiz',
        iconName: 'Star',
        iconColor: 'text-yellow-300',
        bgGradient: 'from-yellow-400/25 via-amber-500/15 to-purple-500/10',
        borderGlow: 'border-yellow-400/50 group-hover:border-yellow-300',
        xpReward: 300,
        currentProgress: perfectQuizzes.length > 0 ? 1 : 0,
        targetProgress: 1,
        unlocked: perfectQuizzes.length > 0,
        unlockedDate: perfectQuizzes.length > 0 ? 'Perfect Score' : undefined,
        hint: 'Answer every question in a chapter quiz correctly.',
        actionTab: 'quizzes',
        actionLabel: 'Attempt 100%'
      },
      {
        id: 'speed-scholar',
        title: 'Speed Scholar',
        category: 'quiz',
        description: 'Demonstrate agile problem-solving by finishing a quiz under 3 minutes with >= 80% score.',
        requirement: 'Finish quiz in < 3 mins with >= 80% score',
        iconName: 'Clock',
        iconColor: 'text-cyan-400',
        bgGradient: 'from-cyan-500/20 via-blue-500/10 to-indigo-500/5',
        borderGlow: 'border-cyan-500/40 group-hover:border-cyan-400',
        xpReward: 180,
        currentProgress: speedQuizzes.length > 0 ? 1 : 0,
        targetProgress: 1,
        unlocked: speedQuizzes.length > 0,
        unlockedDate: speedQuizzes.length > 0 ? 'Agile Thinker' : undefined,
        hint: 'Complete a timed quiz briskly without sacrificing accuracy.',
        actionTab: 'quizzes',
        actionLabel: 'Take Timed Quiz'
      },

      // ==========================================
      // 2. CHAPTER MASTERY & CONCEPTS BADGES
      // ==========================================
      {
        id: 'chapter-conqueror',
        title: 'Chapter Conqueror',
        category: 'mastery',
        description: 'Master a complete NCERT chapter by scoring 80%+ on its dedicated topic quiz.',
        requirement: 'Score 80%+ on any chapter test',
        iconName: 'BookOpen',
        iconColor: 'text-purple-400',
        bgGradient: 'from-purple-500/20 via-indigo-500/10 to-pink-500/5',
        borderGlow: 'border-purple-500/40 group-hover:border-purple-400',
        xpReward: 150,
        currentProgress: Math.min(chaptersMasteredCount, 1),
        targetProgress: 1,
        unlocked: chaptersMasteredCount >= 1,
        unlockedDate: chaptersMasteredCount >= 1 ? 'Chapter Cleared' : undefined,
        hint: 'Select any chapter from CBSE Explorer and ace its quiz.',
        actionTab: 'cbse-explorer',
        actionLabel: 'Explore Chapters'
      },
      {
        id: 'triple-chapter-master',
        title: 'Triple Chapter Master',
        category: 'mastery',
        description: 'Achieve proven chapter mastery across 3 distinct CBSE chapters with 80%+ scores.',
        requirement: 'Master 3 distinct chapters with 80%+ scores',
        iconName: 'Layers',
        iconColor: 'text-fuchsia-400',
        bgGradient: 'from-fuchsia-500/20 via-purple-500/15 to-violet-500/10',
        borderGlow: 'border-fuchsia-500/40 group-hover:border-fuchsia-400',
        xpReward: 350,
        currentProgress: Math.min(chaptersMasteredCount, 3),
        targetProgress: 3,
        unlocked: chaptersMasteredCount >= 3,
        unlockedDate: chaptersMasteredCount >= 3 ? 'Deep Syllabus Mastery' : undefined,
        hint: 'Test and master 3 different chapters from Math or Science.',
        actionTab: 'cbse-explorer',
        actionLabel: 'Master 3 Chapters'
      },
      {
        id: 'mistake-crusher',
        title: 'Mistake Crusher',
        category: 'mastery',
        description: 'Overcome misconceptions by reviewing and marking mastered 2 tricky questions in 📕 My Mistake Book.',
        requirement: 'Mark mastered 2 questions in Mistake Book',
        iconName: 'BookmarkCheck',
        iconColor: 'text-rose-400',
        bgGradient: 'from-rose-500/20 via-pink-500/10 to-red-500/5',
        borderGlow: 'border-rose-500/40 group-hover:border-rose-400',
        xpReward: 200,
        currentProgress: Math.min(masteredMistakesCount, 2),
        targetProgress: 2,
        unlocked: masteredMistakesCount >= 2,
        unlockedDate: masteredMistakesCount >= 2 ? 'Gaps Cleared' : undefined,
        hint: 'Visit My Mistake Book, understand the Socratic error diagnosis, and mark mastered.',
        actionTab: 'mistake-book',
        actionLabel: 'Open Mistake Book'
      },
      {
        id: 'syllabus-pioneer',
        title: 'Syllabus Pioneer',
        category: 'mastery',
        description: 'Broaden your academic foundation by completing activities across at least 3 distinct subjects.',
        requirement: 'Study or test in 3 different subjects',
        iconName: 'Compass',
        iconColor: 'text-teal-400',
        bgGradient: 'from-teal-500/20 via-emerald-500/10 to-blue-500/5',
        borderGlow: 'border-teal-500/40 group-hover:border-teal-400',
        xpReward: 175,
        currentProgress: Math.min(subjectsPracticedCount, 3),
        targetProgress: 3,
        unlocked: subjectsPracticedCount >= 3,
        unlockedDate: subjectsPracticedCount >= 3 ? 'Well-Rounded Scholar' : undefined,
        hint: 'Practice across Mathematics, Science, and English or Social Science.',
        actionTab: 'cbse-explorer',
        actionLabel: 'Browse Subjects'
      },
      {
        id: 'homework-hero',
        title: 'Homework Hero',
        category: 'mastery',
        description: 'Scan and review 2 homework worksheets with AI Vision OCR and step-by-step marking.',
        requirement: 'Scan and review 2 homework assignments',
        iconName: 'FileCheck2',
        iconColor: 'text-indigo-400',
        bgGradient: 'from-indigo-500/20 via-blue-500/10 to-cyan-500/5',
        borderGlow: 'border-indigo-500/40 group-hover:border-indigo-400',
        xpReward: 150,
        currentProgress: Math.min(userScans.length, 2),
        targetProgress: 2,
        unlocked: userScans.length >= 2,
        unlockedDate: userScans.length >= 2 ? 'Assignments Checked' : undefined,
        hint: 'Upload or snap a photo of your handwritten notebook solutions.',
        actionTab: 'homework-scanner',
        actionLabel: 'Scan Homework'
      },

      // ==========================================
      // 3. STUDY STREAK & CONSISTENCY BADGES
      // ==========================================
      {
        id: 'consistency-spark',
        title: 'Consistency Spark',
        category: 'streak',
        description: 'Establish a study routine by studying 2 consecutive days.',
        requirement: 'Maintain a 2-day study streak',
        iconName: 'Flame',
        iconColor: 'text-orange-400',
        bgGradient: 'from-orange-500/20 via-amber-500/10 to-yellow-500/5',
        borderGlow: 'border-orange-500/40 group-hover:border-orange-400',
        xpReward: 100,
        currentProgress: Math.min(userStreak, 2),
        targetProgress: 2,
        unlocked: userStreak >= 2,
        unlockedDate: userStreak >= 2 ? `${userStreak} Days Active` : undefined,
        hint: 'Study consecutively for 2 days to spark your daily habit.',
        actionTab: 'study-planner',
        actionLabel: 'Study Today'
      },
      {
        id: 'streak-champion',
        title: 'Streak Champion',
        category: 'streak',
        description: 'Maintain an active daily study streak of 3 consecutive days.',
        requirement: 'Maintain a 3-day study streak',
        iconName: 'Flame',
        iconColor: 'text-rose-400',
        bgGradient: 'from-rose-500/20 via-red-500/10 to-orange-500/5',
        borderGlow: 'border-rose-500/40 group-hover:border-rose-400',
        xpReward: 250,
        currentProgress: Math.min(userStreak, 3),
        targetProgress: 3,
        unlocked: userStreak >= 3,
        unlockedDate: userStreak >= 3 ? `${userStreak} Days Active` : undefined,
        hint: 'Log in daily and complete at least 1 practice task.',
        actionTab: 'study-planner',
        actionLabel: 'Keep Streak'
      },
      {
        id: 'streak-legend',
        title: '7-Day Scholar Streak',
        category: 'streak',
        description: 'Reach a milestone 7-day study streak. Consistency is the secret of board exam rankers.',
        requirement: 'Maintain a 7-day study streak',
        iconName: 'Trophy',
        iconColor: 'text-amber-300',
        bgGradient: 'from-amber-500/25 via-yellow-500/15 to-rose-500/10',
        borderGlow: 'border-amber-400/50 group-hover:border-amber-300',
        xpReward: 500,
        currentProgress: Math.min(userStreak, 7),
        targetProgress: 7,
        unlocked: userStreak >= 7,
        unlockedDate: userStreak >= 7 ? '7 Days Unbroken' : undefined,
        hint: 'Maintain daily practice for an entire week.',
        actionTab: 'study-planner',
        actionLabel: 'View Schedule'
      },
      {
        id: 'early-bird',
        title: 'Early Bird',
        category: 'streak',
        description: 'Complete a focused study session or question solve in the morning hours (5 AM - 10 AM).',
        requirement: 'Study or solve 1 problem in morning hours',
        iconName: 'Sunrise',
        iconColor: 'text-amber-400',
        bgGradient: 'from-amber-500/20 via-orange-500/10 to-yellow-500/5',
        borderGlow: 'border-amber-500/40 group-hover:border-amber-400',
        xpReward: 120,
        currentProgress: hasMorningActivity ? 1 : 0,
        targetProgress: 1,
        unlocked: hasMorningActivity,
        unlockedDate: hasMorningActivity ? 'Morning Mindset' : undefined,
        hint: 'Practice a quick quiz or homework scan before 10 AM.',
        actionTab: 'quizzes',
        actionLabel: 'Morning Quiz'
      },
      {
        id: 'scholar-level-2',
        title: 'Level 2 Scholar',
        category: 'streak',
        description: 'Earn 500 total XP through quizzes, step scans, and conceptual mastery.',
        requirement: 'Accumulate 500 total XP',
        iconName: 'Zap',
        iconColor: 'text-violet-400',
        bgGradient: 'from-violet-500/20 via-purple-500/10 to-indigo-500/5',
        borderGlow: 'border-violet-500/40 group-hover:border-violet-400',
        xpReward: 250,
        currentProgress: Math.min(userXP, 500),
        targetProgress: 500,
        unlocked: userXP >= 500,
        unlockedDate: userXP >= 500 ? 'Level 2 Reached' : undefined,
        hint: 'Every quiz, doubt, and mistake review adds real XP.',
        actionTab: 'quizzes',
        actionLabel: 'Earn More XP'
      }
    ];

    return list;
  }, [user]);

  const unlockedCount = badgesData.filter(b => b.unlocked).length;
  const totalCount = badgesData.length;
  const unlockPercentage = Math.round((unlockedCount / totalCount) * 100);
  const totalXPEarnedFromBadges = badgesData
    .filter(b => b.unlocked)
    .reduce((sum, b) => sum + b.xpReward, 0);

  // Filter badges by category & status
  const filteredBadges = useMemo(() => {
    return badgesData.filter(b => {
      const matchCategory = selectedCategory === 'all' || b.category === selectedCategory;
      const matchStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'unlocked' && b.unlocked) ||
        (selectedStatus === 'locked' && !b.unlocked);
      return matchCategory && matchStatus;
    });
  }, [badgesData, selectedCategory, selectedStatus]);

  const renderBadgeIcon = (iconName: string, className: string = 'h-5 w-5') => {
    switch (iconName) {
      case 'Sunrise':
        return <Sunrise className={className} />;
      case 'Trophy':
        return <Trophy className={className} />;
      case 'FileCheck2':
        return <FileCheck2 className={className} />;
      case 'Flame':
        return <Flame className={className} />;
      case 'Star':
        return <Star className={className} />;
      case 'Brain':
        return <Brain className={className} />;
      case 'Compass':
        return <Compass className={className} />;
      case 'Target':
        return <Target className={className} />;
      case 'BookOpen':
        return <BookOpen className={className} />;
      case 'Clock':
        return <Clock className={className} />;
      case 'BookmarkCheck':
        return <BookmarkCheck className={className} />;
      case 'Layers':
        return <Layers className={className} />;
      case 'Award':
      case 'Zap':
      default:
        return <Zap className={className} />;
    }
  };

  const handleClaimReward = (badge: BadgeDefinition) => {
    if (claimedBadges[badge.id]) return;

    if (badge.category === 'streak' || badge.id.includes('streak')) {
      // Trigger Framer Motion Fire and Mega Confetti Celebration
      setStreakModalData({
        days: Math.max(user?.streakDays || 1, badge.targetProgress),
        bonusXP: badge.xpReward,
        badgeTitle: badge.title
      });
      setIsStreakModalOpen(true);
    } else {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
    }

    addXP(badge.xpReward, `Claimed Reward: ${badge.title} Badge`);
    const updated = { ...claimedBadges, [badge.id]: true };
    setClaimedBadges(updated);
    if (user) {
      localStore.set(`claimed_badges_${user.uid}`, updated);
    }
  };

  // Compact View (for sidebar widgets or small previews)
  if (compact) {
    return (
      <div className={`rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-5 shadow-xl space-y-4 ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500/20 to-yellow-500/20 border border-amber-500/30 text-amber-400">
              <Trophy className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-white tracking-tight uppercase">
                  Achievements Summary
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {unlockedCount}/{totalCount}
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                Reward milestones for quizzes, mastery & streaks
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-300">
            <Sparkles className="h-3 w-3 text-amber-400" />
            <span>+{totalXPEarnedFromBadges} XP</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-slate-300">
            <span>Overall Badges Mastery</span>
            <span className="font-bold text-amber-300">{unlockPercentage}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400 transition-all duration-500"
              style={{ width: `${unlockPercentage}%` }}
            />
          </div>
        </div>

        {/* Mini Preview Icons */}
        <div className="grid grid-cols-4 gap-2 pt-1">
          {badgesData.slice(0, 4).map(badge => {
            const isUnlocked = badge.unlocked;
            return (
              <div
                key={badge.id}
                onClick={() => setActiveBadgeModal(badge)}
                className={`p-2.5 rounded-xl border flex flex-col items-center text-center cursor-pointer transition-all ${
                  isUnlocked
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:scale-105'
                    : 'bg-white/[0.02] border-white/10 text-slate-500 opacity-60 hover:opacity-100'
                }`}
                title={badge.title}
              >
                <div className="mb-1">
                  {renderBadgeIcon(badge.iconName, 'h-4 w-4')}
                </div>
                <span className="text-[9px] font-bold truncate max-w-full text-slate-200">
                  {badge.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Full Rich View for the dedicated 'Achievements' Section
  return (
    <div className={`rounded-3xl border border-white/15 bg-gradient-to-br from-slate-900/90 via-[#0d1322]/90 to-indigo-950/70 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl space-y-6 ${className}`}>
      {/* Top Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-6 border-b border-white/10">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-500 to-orange-500 text-slate-950 shadow-xl shadow-amber-500/25 font-black shrink-0">
            <Trophy className="h-7 w-7 text-slate-950" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Achievements & Badges
              </h2>
              <span className="px-3 py-0.5 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {unlockedCount} of {totalCount} Unlocked ({unlockPercentage}%)
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Earn milestone honors and bonus XP by completing quizzes, mastering NCERT chapters, and keeping daily study streaks.
            </p>
          </div>
        </div>

        {/* XP Counter & Quick Stats */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md flex items-center gap-2.5">
            <Zap className="h-5 w-5 text-amber-400 fill-amber-400" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                Bonus XP Earned
              </span>
              <span className="text-base font-black text-amber-300">
                +{totalXPEarnedFromBadges} XP
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress & Category Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-white/[0.03] border border-white/10 text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({totalCount})
          </button>
          <button
            onClick={() => setSelectedCategory('quiz')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedCategory === 'quiz'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Target className="h-3.5 w-3.5" />
            <span>📝 Quizzes</span>
          </button>
          <button
            onClick={() => setSelectedCategory('mastery')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedCategory === 'mastery'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>📖 Chapter Mastery</span>
          </button>
          <button
            onClick={() => setSelectedCategory('streak')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedCategory === 'streak'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="h-3.5 w-3.5" />
            <span>🔥 Study Streaks</span>
          </button>
        </div>

        {/* Status Toggle Pills */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-[11px] text-slate-400 font-semibold mr-1">Status:</span>
          <button
            onClick={() => setSelectedStatus('all')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              selectedStatus === 'all'
                ? 'bg-white/15 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedStatus('unlocked')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              selectedStatus === 'unlocked'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Unlocked ({unlockedCount})
          </button>
          <button
            onClick={() => setSelectedStatus('locked')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              selectedStatus === 'locked'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            In Progress ({totalCount - unlockedCount})
          </button>
        </div>
      </div>

      {/* Dynamic Framer Motion Flame Showcase for Study Streak */}
      <div className="p-4 sm:p-5 rounded-2xl border border-orange-500/35 bg-gradient-to-r from-orange-950/40 via-slate-900/80 to-amber-950/30 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          {/* Pulsing Framer Motion Animated Flame */}
          <motion.div
            animate={{
              scale: [1, 1.15, 0.96, 1.12, 1],
              rotate: [-3, 4, -4, 2, 0]
            }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="relative h-14 w-14 rounded-2xl bg-gradient-to-tr from-red-600 via-orange-500 to-amber-400 p-0.5 shadow-[0_0_30px_rgba(249,115,22,0.6)] flex items-center justify-center shrink-0 cursor-pointer"
            onClick={() => {
              setStreakModalData({
                days: Math.max(1, userStreak),
                bonusXP: 150,
                badgeTitle: userStreak >= 7 ? '7-Day Scholar Streak' : userStreak >= 3 ? 'Streak Champion' : 'Consistency Spark'
              });
              setIsStreakModalOpen(true);
            }}
            title="Click to celebrate study streak!"
          >
            <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center">
              <Flame className="h-7 w-7 text-orange-400 fill-orange-400 animate-pulse" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-orange-500"></span>
            </span>
          </motion.div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-white">
                Study Streak: <span className="text-amber-400">{userStreak} Days Unbroken</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
                {userStreak > 0 ? '🔥 On Fire' : 'Daily Study Flame'}
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Each consecutive day fuels your study flame, multiplies leaderboard points, and unlocks exclusive CBSE badges.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setStreakModalData({
              days: Math.max(1, userStreak),
              bonusXP: 150,
              badgeTitle: userStreak >= 7 ? '7-Day Scholar Streak' : userStreak >= 3 ? 'Streak Champion' : 'Consistency Spark'
            });
            setIsStreakModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 hover:from-amber-300 hover:to-orange-300 shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer active:scale-98"
        >
          <Flame className="h-4 w-4 fill-slate-950 text-slate-950" />
          <span>Celebrate Streak & Fire Animation 🔥</span>
        </button>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
        {filteredBadges.map(badge => {
          const isUnlocked = badge.unlocked;
          const isClaimed = claimedBadges[badge.id];
          const pct = Math.min(100, Math.round((badge.currentProgress / badge.targetProgress) * 100));

          return (
            <div
              key={badge.id}
              onClick={() => setActiveBadgeModal(badge)}
              className={`relative p-4 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between ${
                isUnlocked
                  ? `bg-gradient-to-b ${badge.bgGradient} border-white/20 hover:border-amber-400/80 shadow-lg shadow-amber-950/20 hover:scale-[1.02]`
                  : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
              }`}
            >
              <div>
                {/* Header: Category & Lock/Check status */}
                <div className="flex items-center justify-between mb-3 text-[10px]">
                  <span className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    isUnlocked
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-white/5 text-slate-400 border border-white/10'
                  }`}>
                    {isUnlocked ? 'Unlocked' : `${pct}% Done`}
                  </span>

                  <span className="font-extrabold text-amber-300 flex items-center gap-0.5">
                    +{badge.xpReward} XP
                  </span>
                </div>

                {/* Badge Icon & Name */}
                <div className="flex flex-col items-center text-center space-y-2 mb-3">
                  <div
                    className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-md ${
                      isUnlocked
                        ? `${badge.iconColor} bg-white/15 border border-white/25 shadow-amber-500/20`
                        : 'text-slate-500 bg-white/5 border border-white/10'
                    }`}
                  >
                    {renderBadgeIcon(badge.iconName, 'h-6 w-6')}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-amber-200 transition-colors line-clamp-1">
                      {badge.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2 leading-snug">
                      {badge.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress Bar & Claim action */}
              <div className="pt-2 border-t border-white/10 space-y-1.5">
                <div className="flex justify-between text-[10px] text-slate-300">
                  <span className="text-slate-400">Progress</span>
                  <span className="font-bold text-white">
                    {badge.currentProgress} / {badge.targetProgress}
                  </span>
                </div>

                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isUnlocked
                        ? 'bg-gradient-to-r from-emerald-400 to-teal-400'
                        : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {isUnlocked && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClaimReward(badge);
                    }}
                    className={`w-full mt-1 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${
                      isClaimed
                        ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 cursor-default'
                        : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 cursor-pointer shadow-xs animate-pulse'
                    }`}
                  >
                    {isClaimed ? (
                      <>
                        <Check className="h-3 w-3" />
                        <span>Claimed</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3 w-3" />
                        <span>Claim +{badge.xpReward} XP</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Achievement Detail Modal */}
      {activeBadgeModal && (
        <BadgeDetailModal
          badge={activeBadgeModal}
          isClaimed={claimedBadges[activeBadgeModal.id]}
          onClaim={() => handleClaimReward(activeBadgeModal)}
          onClose={() => setActiveBadgeModal(null)}
          onNavigateTab={onNavigateTab}
          renderIcon={renderBadgeIcon}
        />
      )}

      {/* Framer Motion Streak Fire & Confetti Animation Celebration Modal */}
      <StreakFireAnimation
        isOpen={isStreakModalOpen}
        onClose={() => setIsStreakModalOpen(false)}
        streakDays={streakModalData.days}
        bonusXP={streakModalData.bonusXP}
        badgeTitle={streakModalData.badgeTitle}
        onClaimReward={() => {
          addXP(streakModalData.bonusXP, `Streak Fire Bonus: ${streakModalData.badgeTitle}`);
        }}
      />
    </div>
  );
};

// Detailed Achievement Inspection Modal
interface BadgeDetailModalProps {
  badge: BadgeDefinition;
  isClaimed?: boolean;
  onClaim?: () => void;
  onClose: () => void;
  onNavigateTab?: (tab: string) => void;
  renderIcon: (name: string, cls?: string) => React.ReactNode;
}

const BadgeDetailModal: React.FC<BadgeDetailModalProps> = ({
  badge,
  isClaimed = false,
  onClaim,
  onClose,
  onNavigateTab,
  renderIcon
}) => {
  const isUnlocked = badge.unlocked;
  const pct = Math.min(100, Math.round((badge.currentProgress / badge.targetProgress) * 100));

  const handleAction = () => {
    onClose();
    if (!onNavigateTab) return;
    if (badge.actionTab) {
      onNavigateTab(badge.actionTab);
    } else if (badge.category === 'quiz') {
      onNavigateTab('quizzes');
    } else if (badge.category === 'mastery') {
      onNavigateTab('cbse-explorer');
    } else {
      onNavigateTab('study-planner');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-md rounded-3xl border border-white/20 bg-slate-900/95 p-6 shadow-2xl relative text-center space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          ✕
        </button>

        {/* Center Icon */}
        <div className="flex justify-center pt-2">
          <div
            className={`h-20 w-20 rounded-3xl flex items-center justify-center shadow-2xl border ${
              isUnlocked
                ? `${badge.iconColor} bg-white/15 border-amber-400/50 shadow-amber-500/30`
                : 'text-slate-500 bg-white/5 border-white/10'
            }`}
          >
            {renderIcon(badge.iconName, 'h-10 w-10')}
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2">
            <h3 className="text-lg font-black text-white">{badge.title}</h3>
            {isUnlocked ? (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Unlocked
              </span>
            ) : (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-white/10 text-slate-400 border border-white/10">
                Locked
              </span>
            )}
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{badge.description}</p>
        </div>

        {/* Requirement & Criteria Card */}
        <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 text-left space-y-3 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-0.5">
              Unlock Requirement
            </span>
            <span className="text-slate-200 font-semibold">{badge.requirement}</span>
          </div>

          <div className="space-y-1.5 pt-1 border-t border-white/10">
            <div className="flex justify-between text-slate-300 text-[11px]">
              <span>Current Progress</span>
              <span className="font-bold text-amber-300">
                {badge.currentProgress} / {badge.targetProgress} ({pct}%)
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-1 border-t border-white/10 text-[11px]">
            <span className="text-slate-400">XP Reward</span>
            <span className="font-bold text-amber-300">+{badge.xpReward} XP</span>
          </div>
        </div>

        {/* Hint */}
        <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-indigo-200 flex items-start gap-2 text-left">
          <Info className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
          <span className="text-[11px] leading-tight">{badge.hint}</span>
        </div>

        {/* Action Button */}
        <div className="pt-1 flex flex-col gap-2">
          {isUnlocked && onClaim && !isClaimed && (
            <button
              onClick={() => {
                onClaim();
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-500/30 cursor-pointer"
            >
              🎉 Claim +{badge.xpReward} XP Bonus
            </button>
          )}

          {!isUnlocked && onNavigateTab ? (
            <button
              onClick={handleAction}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-500/25 cursor-pointer"
            >
              {badge.actionLabel || 'Start Activity to Unlock'}
            </button>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-all border border-white/10 cursor-pointer"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
