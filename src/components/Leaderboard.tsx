import React, { useState, useMemo } from 'react';
import {
  Trophy,
  Award,
  Crown,
  Medal,
  Flame,
  Zap,
  Star,
  Users,
  Globe,
  School,
  Search,
  Filter,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  HelpCircle,
  Clock,
  Target,
  ArrowRight,
  User,
  Heart,
  Share2,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { storage } from '../lib/storage';
import { localStore } from '../lib/firebase';
import { LeaderboardStudent } from '../types';
import confetti from 'canvas-confetti';

interface LeaderboardProps {
  onNavigateTab?: (tab: string) => void;
  compact?: boolean;
  className?: string;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  onNavigateTab,
  compact = false,
  className = ''
}) => {
  const { user } = useAuth();

  // Tab & Filter States
  const [scope, setScope] = useState<'classroom' | 'global'>('classroom');
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'allTime'>('weekly');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [classroomCode, setClassroomCode] = useState<string>('CBSE-9A-DELHI');
  const [isEditingClass, setIsEditingClass] = useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<LeaderboardStudent | null>(null);
  const [cheeredStudents, setCheeredStudents] = useState<Record<string, number>>({});

  // Real Current User Metrics
  const userQuizzes = user ? storage.getQuizResults(user.uid) : [];
  const userScans = user ? storage.getScans(user.uid) : [];
  const claimedBadges = user
    ? localStore.get<Record<string, boolean>>(`claimed_badges_${user.uid}`, {})
    : {};

  const userBadgesCount = Math.max(Object.keys(claimedBadges).length, userQuizzes.length > 0 ? 1 : 0);
  const userQuizzesCount = userQuizzes.length;
  const userAvgQuizScore =
    userQuizzesCount > 0
      ? Math.round(
          userQuizzes.reduce((acc, q) => acc + (q.scorePercentage ?? q.percentage ?? 0), 0) /
            userQuizzesCount
        )
      : 0;

  // Real points calculated from:
  // 1. Badges: 150 pts per claimed badge
  // 2. Quizzes: 60 pts per quiz + 40 bonus pts for score >= 80%
  // 3. Streak: 25 pts per day
  // 4. Base XP
  const userBadgePoints = userBadgesCount * 150;
  const userQuizPoints = userQuizzes.reduce((acc, q) => {
    const pct = q.scorePercentage ?? q.percentage ?? 0;
    return acc + 60 + (pct >= 80 ? 40 : 0) + (pct === 100 ? 50 : 0);
  }, 0);
  const userStreakPoints = (user?.streakDays ?? 0) * 25;
  const userTotalPoints = userBadgePoints + userQuizPoints + userStreakPoints + (user?.xp ?? 0);

  const currentStudentName = user?.name?.trim() || 'You (Scholar)';
  const userClassLevel = user?.classLevel || 'Class 9';

  // Base peer cohort dataset for Classroom
  const classroomPeers: Omit<LeaderboardStudent, 'rank'>[] = useMemo(() => [
    {
      id: 'peer_1',
      name: 'Aarav Sharma',
      avatar: '👨‍🎓',
      school: 'DPS R.K. Puram',
      city: 'New Delhi',
      classLevel: userClassLevel,
      totalPoints: 1240,
      badgePoints: 600,
      badgesCount: 4,
      quizPoints: 490,
      quizzesCompleted: 6,
      avgQuizScore: 92,
      streakDays: 8,
      favoriteSubject: 'Science',
      recentHonor: 'Quiz Prodigy'
    },
    {
      id: 'peer_2',
      name: 'Diya Patel',
      avatar: '👩‍🎓',
      school: 'DPS R.K. Puram',
      city: 'New Delhi',
      classLevel: userClassLevel,
      totalPoints: 1080,
      badgePoints: 450,
      badgesCount: 3,
      quizPoints: 480,
      quizzesCompleted: 5,
      avgQuizScore: 90,
      streakDays: 6,
      favoriteSubject: 'Mathematics',
      recentHonor: 'Accuracy Ace'
    },
    {
      id: 'peer_3',
      name: 'Rohan Verma',
      avatar: '🧑‍🎓',
      school: 'DPS R.K. Puram',
      city: 'New Delhi',
      classLevel: userClassLevel,
      totalPoints: 890,
      badgePoints: 300,
      badgesCount: 2,
      quizPoints: 440,
      quizzesCompleted: 5,
      avgQuizScore: 84,
      streakDays: 4,
      favoriteSubject: 'Mathematics',
      recentHonor: 'First Quiz'
    },
    {
      id: 'peer_4',
      name: 'Ananya Iyer',
      avatar: '👩‍🏫',
      school: 'DPS R.K. Puram',
      city: 'New Delhi',
      classLevel: userClassLevel,
      totalPoints: 720,
      badgePoints: 300,
      badgesCount: 2,
      quizPoints: 320,
      quizzesCompleted: 4,
      avgQuizScore: 80,
      streakDays: 3,
      favoriteSubject: 'Social Science',
      recentHonor: 'Consistent Scholar'
    },
    {
      id: 'peer_5',
      name: 'Kabir Mehta',
      avatar: '👨‍💻',
      school: 'DPS R.K. Puram',
      city: 'New Delhi',
      classLevel: userClassLevel,
      totalPoints: 560,
      badgePoints: 150,
      badgesCount: 1,
      quizPoints: 310,
      quizzesCompleted: 3,
      avgQuizScore: 78,
      streakDays: 3,
      favoriteSubject: 'Science',
      recentHonor: 'Quiz Initiate'
    },
    {
      id: 'peer_6',
      name: 'Tanvi Nair',
      avatar: '👧',
      school: 'DPS R.K. Puram',
      city: 'New Delhi',
      classLevel: userClassLevel,
      totalPoints: 410,
      badgePoints: 150,
      badgesCount: 1,
      quizPoints: 210,
      quizzesCompleted: 2,
      avgQuizScore: 75,
      streakDays: 2,
      favoriteSubject: 'English',
      recentHonor: 'Quiz Initiate'
    },
    {
      id: 'peer_7',
      name: 'Ishaan Gupta',
      avatar: '👦',
      school: 'DPS R.K. Puram',
      city: 'New Delhi',
      classLevel: userClassLevel,
      totalPoints: 280,
      badgePoints: 0,
      badgesCount: 0,
      quizPoints: 230,
      quizzesCompleted: 2,
      avgQuizScore: 70,
      streakDays: 2,
      favoriteSubject: 'Mathematics',
      recentHonor: 'Rising Star'
    }
  ], [userClassLevel]);

  // Base peer cohort dataset for All-India Global CBSE
  const globalPeers: Omit<LeaderboardStudent, 'rank'>[] = useMemo(() => [
    {
      id: 'global_1',
      name: 'Aditya Srivastava',
      avatar: '🏆',
      school: 'The Mother\'s International',
      city: 'New Delhi',
      classLevel: userClassLevel,
      totalPoints: 2450,
      badgePoints: 1200,
      badgesCount: 8,
      quizPoints: 950,
      quizzesCompleted: 11,
      avgQuizScore: 98,
      streakDays: 14,
      favoriteSubject: 'Science',
      recentHonor: 'Flawless 100%'
    },
    {
      id: 'global_2',
      name: 'Meera Nambiar',
      avatar: '🌟',
      school: 'National Public School',
      city: 'Bengaluru',
      classLevel: userClassLevel,
      totalPoints: 2120,
      badgePoints: 1050,
      badgesCount: 7,
      quizPoints: 870,
      quizzesCompleted: 10,
      avgQuizScore: 95,
      streakDays: 12,
      favoriteSubject: 'Mathematics',
      recentHonor: 'Chapter Conqueror'
    },
    {
      id: 'global_3',
      name: 'Vihaan Kulkarni',
      avatar: '🚀',
      school: 'DAV Public School',
      city: 'Pune',
      classLevel: userClassLevel,
      totalPoints: 1890,
      badgePoints: 900,
      badgesCount: 6,
      quizPoints: 790,
      quizzesCompleted: 9,
      avgQuizScore: 93,
      streakDays: 10,
      favoriteSubject: 'Mathematics',
      recentHonor: 'Speed Scholar'
    },
    {
      id: 'global_4',
      name: 'Prisha Reddy',
      avatar: '🌺',
      school: 'Hyderabad Public School',
      city: 'Hyderabad',
      classLevel: userClassLevel,
      totalPoints: 1540,
      badgePoints: 750,
      badgesCount: 5,
      quizPoints: 640,
      quizzesCompleted: 7,
      avgQuizScore: 91,
      streakDays: 9,
      favoriteSubject: 'Social Science',
      recentHonor: 'Tri-Subject Specialist'
    },
    {
      id: 'global_5',
      name: 'Devansh Sen',
      avatar: '⚡',
      school: 'South Point High',
      city: 'Kolkata',
      classLevel: userClassLevel,
      totalPoints: 1320,
      badgePoints: 600,
      badgesCount: 4,
      quizPoints: 570,
      quizzesCompleted: 7,
      avgQuizScore: 89,
      streakDays: 7,
      favoriteSubject: 'Science',
      recentHonor: 'Accuracy Ace'
    },
    {
      id: 'global_6',
      name: 'Suhana Mir',
      avatar: '🌙',
      school: 'Burn Hall School',
      city: 'Srinagar',
      classLevel: userClassLevel,
      totalPoints: 1110,
      badgePoints: 450,
      badgesCount: 3,
      quizPoints: 510,
      quizzesCompleted: 6,
      avgQuizScore: 88,
      streakDays: 6,
      favoriteSubject: 'English',
      recentHonor: 'Quiz Prodigy'
    }
  ], [userClassLevel]);

  // Combine Current User with selected peers and sort by Total Points
  const rankedStudents: LeaderboardStudent[] = useMemo(() => {
    const rawPeers = scope === 'classroom' ? classroomPeers : globalPeers;

    // Build Current User entry
    const currentUserEntry: Omit<LeaderboardStudent, 'rank'> = {
      id: user?.uid || 'current_user',
      name: currentStudentName,
      avatar: '⭐',
      isCurrentUser: true,
      school: scope === 'classroom' ? 'DPS R.K. Puram' : 'CBSE Scholar',
      city: 'New Delhi',
      classLevel: userClassLevel,
      totalPoints: userTotalPoints,
      badgePoints: userBadgePoints,
      badgesCount: userBadgesCount,
      quizPoints: userQuizPoints,
      quizzesCompleted: userQuizzesCount,
      avgQuizScore: userAvgQuizScore,
      streakDays: user?.streakDays ?? 0,
      favoriteSubject: user?.subjects?.[0] || 'Science',
      recentHonor: userBadgesCount > 0 ? 'Active Contender' : 'Rising Scholar'
    };

    const combined = [...rawPeers, currentUserEntry];

    // Sort descending by totalPoints
    combined.sort((a, b) => b.totalPoints - a.totalPoints);

    // Assign 1-indexed ranks
    return combined.map((s, idx) => ({
      ...s,
      rank: idx + 1
    }));
  }, [
    scope,
    classroomPeers,
    globalPeers,
    user,
    currentStudentName,
    userClassLevel,
    userTotalPoints,
    userBadgePoints,
    userBadgesCount,
    userQuizPoints,
    userQuizzesCount,
    userAvgQuizScore
  ]);

  // Find Current User's dynamic ranking
  const currentUserRank = rankedStudents.find(s => s.isCurrentUser);
  const currentRankNum = currentUserRank ? currentUserRank.rank : 1;
  const nextAboveUser = rankedStudents.find(s => s.rank === currentRankNum - 1);
  const pointsToOvertake = nextAboveUser && currentUserRank
    ? Math.max(10, nextAboveUser.totalPoints - currentUserRank.totalPoints + 15)
    : 0;

  // Filtered by Search
  const displayStudents = useMemo(() => {
    if (!searchQuery.trim()) return rankedStudents;
    const q = searchQuery.toLowerCase();
    return rankedStudents.filter(
      s => s.name.toLowerCase().includes(q) || (s.school && s.school.toLowerCase().includes(q))
    );
  }, [rankedStudents, searchQuery]);

  // Top 3 Podium Students
  const podiumFirst = rankedStudents.find(s => s.rank === 1);
  const podiumSecond = rankedStudents.find(s => s.rank === 2);
  const podiumThird = rankedStudents.find(s => s.rank === 3);

  // Handle cheer button
  const handleCheer = (studentId: string, name: string) => {
    setCheeredStudents(prev => ({
      ...prev,
      [studentId]: (prev[studentId] || 0) + 1
    }));
    confetti({
      particleCount: 35,
      spread: 50,
      origin: { y: 0.7 }
    });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Primary Container Card */}
      <div className="rounded-3xl border border-white/15 bg-white/[0.03] backdrop-blur-2xl shadow-2xl shadow-indigo-950/40 p-5 sm:p-7 space-y-6 relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none translate-y-1/2" />

        {/* Header & Controls Bar */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-500 to-orange-500 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/25 border border-amber-300/30">
              <Trophy className="h-6 w-6 fill-slate-950/20" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  Academic Leaderboard & Rankings
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Sparkles className="h-2.5 w-2.5" />
                  Live CBSE Ranks
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Ranked by points earned from <strong className="text-amber-300">badges unlocked</strong> & <strong className="text-emerald-300">quiz precision</strong>.
              </p>
            </div>
          </div>

          {/* Scope Selector: Classroom vs All-India */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-xl bg-white/5 p-1 border border-white/10">
              <button
                type="button"
                onClick={() => setScope('classroom')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  scope === 'classroom'
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <School className="h-3.5 w-3.5" />
                <span>Classroom ({userClassLevel})</span>
              </button>

              <button
                type="button"
                onClick={() => setScope('global')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  scope === 'global'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Globe className="h-3.5 w-3.5" />
                <span>All-India Global</span>
              </button>
            </div>

            {/* Timeframe Dropdown */}
            <select
              value={timeframe}
              onChange={e => setTimeframe(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl border border-white/15 bg-slate-900 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="weekly">This Week</option>
              <option value="monthly">This Month</option>
              <option value="allTime">All-Time</option>
            </select>
          </div>
        </div>

        {/* Current User Highlight Status Bar */}
        <div className="relative z-10 p-4 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900/80 to-purple-950/80 border border-indigo-500/30 backdrop-blur-xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-sm shadow-md border border-white/20">
              #{currentRankNum}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-white">
                  Your Current Standing:
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Rank #{currentRankNum} of {rankedStudents.length}
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                <strong className="text-white font-bold">{userTotalPoints} Total Pts</strong> • {userBadgesCount} Badges ({userBadgePoints} pts) • {userQuizzesCount} Quizzes ({userQuizPoints} pts) • {user?.streakDays ?? 0}d Streak
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {nextAboveUser && (
              <span className="text-[11px] text-amber-300 font-semibold bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                +{pointsToOvertake} pts to overtake #{nextAboveUser.rank} {nextAboveUser.name.split(' ')[0]}
              </span>
            )}

            {onNavigateTab && (
              <button
                type="button"
                onClick={() => onNavigateTab('quizzes')}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-md transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>Take Quiz (+100 pts)</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Top 3 Podium Display */}
        {!searchQuery && (
          <div className="relative z-10 pt-2 pb-4">
            <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-2xl mx-auto items-end text-center">
              {/* 2nd Place (Silver) */}
              {podiumSecond && (
                <div
                  onClick={() => setSelectedStudent(podiumSecond)}
                  className="rounded-2xl border border-slate-400/30 bg-slate-900/60 backdrop-blur-xl p-3 sm:p-4 space-y-2 hover:border-slate-300/50 transition-all cursor-pointer group hover:-translate-y-1"
                >
                  <div className="relative mx-auto w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-slate-400 to-slate-200 p-0.5 shadow-lg shadow-slate-500/20">
                    <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-xl sm:text-2xl">
                      {podiumSecond.avatar || '🥈'}
                    </div>
                    <div className="absolute -bottom-1.5 -right-1.5 h-6 w-6 rounded-full bg-slate-400 text-slate-950 font-black text-[10px] flex items-center justify-center border-2 border-slate-900">
                      2
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-center gap-1">
                      <span className="font-extrabold text-xs sm:text-sm text-white truncate max-w-[100px] sm:max-w-none">
                        {podiumSecond.name}
                      </span>
                      {podiumSecond.isCurrentUser && (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-indigo-500 text-white font-bold">YOU</span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">{podiumSecond.school || podiumSecond.city}</p>
                  </div>

                  <div className="pt-1 border-t border-white/10">
                    <span className="text-xs sm:text-sm font-black text-slate-200">
                      {podiumSecond.totalPoints} <span className="text-[10px] text-slate-400 font-normal">pts</span>
                    </span>
                    <p className="text-[9px] text-slate-400">{podiumSecond.badgesCount} badges • {podiumSecond.quizzesCompleted} quizzes</p>
                  </div>
                </div>
              )}

              {/* 1st Place (Gold Crown) */}
              {podiumFirst && (
                <div
                  onClick={() => setSelectedStudent(podiumFirst)}
                  className="rounded-2xl border-2 border-amber-400/50 bg-gradient-to-b from-amber-500/15 via-slate-900/80 to-slate-900/90 backdrop-blur-xl p-3 sm:p-5 space-y-2.5 shadow-2xl shadow-amber-500/20 hover:border-amber-300 transition-all cursor-pointer group hover:-translate-y-1 relative"
                >
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Crown className="h-6 w-6 text-amber-400 fill-amber-400 drop-shadow-md animate-bounce" />
                  </div>

                  <div className="relative mx-auto w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 p-0.5 shadow-xl shadow-amber-500/40">
                    <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-2xl sm:text-3xl">
                      {podiumFirst.avatar || '👑'}
                    </div>
                    <div className="absolute -bottom-1.5 -right-1.5 h-6 w-6 rounded-full bg-amber-400 text-slate-950 font-black text-[11px] flex items-center justify-center border-2 border-slate-900">
                      1
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-center gap-1">
                      <span className="font-extrabold text-xs sm:text-base text-amber-200 truncate max-w-[110px] sm:max-w-none">
                        {podiumFirst.name}
                      </span>
                      {podiumFirst.isCurrentUser && (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500 text-slate-950 font-bold">YOU</span>
                      )}
                    </div>
                    <p className="text-[10px] text-amber-300/80 truncate">{podiumFirst.school || podiumFirst.city}</p>
                  </div>

                  <div className="pt-1.5 border-t border-amber-500/20">
                    <span className="text-sm sm:text-base font-black text-amber-300">
                      {podiumFirst.totalPoints} <span className="text-[10px] text-amber-400/80 font-normal">pts</span>
                    </span>
                    <p className="text-[10px] text-amber-200/70 font-semibold">{podiumFirst.badgesCount} badges • {podiumFirst.quizzesCompleted} quizzes ({podiumFirst.avgQuizScore}%)</p>
                  </div>
                </div>
              )}

              {/* 3rd Place (Bronze) */}
              {podiumThird && (
                <div
                  onClick={() => setSelectedStudent(podiumThird)}
                  className="rounded-2xl border border-amber-700/30 bg-slate-900/60 backdrop-blur-xl p-3 sm:p-4 space-y-2 hover:border-amber-600/50 transition-all cursor-pointer group hover:-translate-y-1"
                >
                  <div className="relative mx-auto w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-amber-700 to-amber-500 p-0.5 shadow-lg shadow-amber-900/30">
                    <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-xl sm:text-2xl">
                      {podiumThird.avatar || '🥉'}
                    </div>
                    <div className="absolute -bottom-1.5 -right-1.5 h-6 w-6 rounded-full bg-amber-700 text-white font-black text-[10px] flex items-center justify-center border-2 border-slate-900">
                      3
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-center gap-1">
                      <span className="font-extrabold text-xs sm:text-sm text-white truncate max-w-[100px] sm:max-w-none">
                        {podiumThird.name}
                      </span>
                      {podiumThird.isCurrentUser && (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-indigo-500 text-white font-bold">YOU</span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">{podiumThird.school || podiumThird.city}</p>
                  </div>

                  <div className="pt-1 border-t border-white/10">
                    <span className="text-xs sm:text-sm font-black text-amber-200">
                      {podiumThird.totalPoints} <span className="text-[10px] text-slate-400 font-normal">pts</span>
                    </span>
                    <p className="text-[9px] text-slate-400">{podiumThird.badgesCount} badges • {podiumThird.quizzesCompleted} quizzes</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Search & Classroom Code Bar */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search scholar by name, school, or city..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-white/10 bg-white/5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-300">
            {scope === 'classroom' && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[11px] text-slate-400 font-semibold">Cohort:</span>
                <span className="font-mono text-indigo-300 font-bold">{classroomCode}</span>
              </div>
            )}
            <span className="text-[11px] text-slate-400">
              Showing {displayStudents.length} Scholars
            </span>
          </div>
        </div>

        {/* Detailed Rankings List */}
        <div className="relative z-10 space-y-2 overflow-x-auto">
          <div className="min-w-[580px] space-y-2">
            {/* Table Header */}
            <div className="grid grid-cols-12 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-white/10">
              <span className="col-span-1">Rank</span>
              <span className="col-span-4">Student & School</span>
              <span className="col-span-2 text-center">Badges Earned</span>
              <span className="col-span-2 text-center">Quiz Precision</span>
              <span className="col-span-2 text-right">Total Points</span>
              <span className="col-span-1 text-center">Action</span>
            </div>

            {/* Student Rows */}
            {displayStudents.map((st) => {
              const isUser = st.isCurrentUser;
              return (
                <div
                  key={st.id}
                  onClick={() => setSelectedStudent(st)}
                  className={`grid grid-cols-12 items-center px-4 py-3 rounded-2xl border transition-all cursor-pointer ${
                    isUser
                      ? 'border-indigo-400/60 bg-gradient-to-r from-indigo-950/70 to-slate-900/80 shadow-lg shadow-indigo-950/40 text-white'
                      : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/20 text-slate-200'
                  }`}
                >
                  {/* Rank */}
                  <div className="col-span-1 flex items-center gap-1.5">
                    {st.rank === 1 ? (
                      <span className="text-base">🥇</span>
                    ) : st.rank === 2 ? (
                      <span className="text-base">🥈</span>
                    ) : st.rank === 3 ? (
                      <span className="text-base">🥉</span>
                    ) : (
                      <span className="text-xs font-black text-slate-400">#{st.rank}</span>
                    )}
                  </div>

                  {/* Student & School */}
                  <div className="col-span-4 flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-slate-800 border border-white/15 flex items-center justify-center text-sm shrink-0">
                      {st.avatar || '🎓'}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-bold truncate ${isUser ? 'text-indigo-200' : 'text-white'}`}>
                          {st.name}
                        </span>
                        {isUser && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-indigo-500 text-white font-extrabold uppercase">
                            You
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 truncate">
                        {st.school} • {st.city}
                      </p>
                    </div>
                  </div>

                  {/* Badges Earned */}
                  <div className="col-span-2 text-center">
                    <span className="text-xs font-bold text-amber-300">
                      🏅 {st.badgesCount}
                    </span>
                    <p className="text-[10px] text-slate-400">+{st.badgePoints} pts</p>
                  </div>

                  {/* Quiz Precision */}
                  <div className="col-span-2 text-center">
                    <span className="text-xs font-bold text-emerald-300">
                      {st.quizzesCompleted} tests
                    </span>
                    <p className="text-[10px] text-slate-400">Avg {st.avgQuizScore}%</p>
                  </div>

                  {/* Total Points */}
                  <div className="col-span-2 text-right">
                    <span className={`text-xs font-black ${isUser ? 'text-indigo-300' : 'text-white'}`}>
                      {st.totalPoints}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-1">pts</span>
                    {st.streakDays > 0 && (
                      <p className="text-[9px] text-amber-400 font-semibold flex items-center justify-end gap-0.5">
                        <Flame className="h-2.5 w-2.5" />
                        {st.streakDays}d streak
                      </p>
                    )}
                  </div>

                  {/* Cheer Action Button */}
                  <div className="col-span-1 text-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => handleCheer(st.id, st.name)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-pink-400 hover:bg-pink-500/10 transition-colors"
                      title="Cheer classmate"
                    >
                      <Heart className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* How Points Are Calculated Explanation Strip */}
        <div className="relative z-10 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-3.5 w-3.5 text-indigo-400" />
            <span className="text-[11px]">
              <strong>Scoring Formula:</strong> Badges (+150 pts each) + Quizzes (+60 pts + bonus) + Daily Streaks (+25 pts/day).
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="text-slate-300 font-semibold">Classroom Code: <strong>{classroomCode}</strong></span>
            <span className="text-indigo-400 hover:underline cursor-pointer" onClick={() => setIsEditingClass(true)}>
              Change Cohort
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* STUDENT PROFILE SHEET MODAL                               */}
      {/* ========================================================= */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl border border-white/15 bg-slate-900/95 backdrop-blur-2xl shadow-2xl p-6 space-y-5 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-2xl">
                  {selectedStudent.avatar || '🎓'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{selectedStudent.name}</h3>
                    {selectedStudent.isCurrentUser && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500 text-white font-bold">YOU</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">{selectedStudent.school} • {selectedStudent.city}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Standing Card */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Rank in {scope === 'classroom' ? 'Classroom' : 'CBSE'}</span>
                <div className="text-2xl font-black text-amber-300">
                  #{selectedStudent.rank}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Points</span>
                <div className="text-2xl font-black text-white">
                  {selectedStudent.totalPoints}
                </div>
              </div>
            </div>

            {/* Breakdown Stats */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-0.5">
                <span className="text-[10px] text-amber-300 font-bold">🏅 Badges</span>
                <div className="text-base font-extrabold text-white">{selectedStudent.badgesCount}</div>
                <p className="text-[9px] text-slate-400">+{selectedStudent.badgePoints} pts</p>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-0.5">
                <span className="text-[10px] text-emerald-300 font-bold">📝 Quizzes</span>
                <div className="text-base font-extrabold text-white">{selectedStudent.quizzesCompleted}</div>
                <p className="text-[9px] text-slate-400">Avg {selectedStudent.avgQuizScore}%</p>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-0.5">
                <span className="text-[10px] text-orange-400 font-bold">🔥 Streak</span>
                <div className="text-base font-extrabold text-white">{selectedStudent.streakDays}d</div>
                <p className="text-[9px] text-slate-400">Active days</p>
              </div>
            </div>

            <div className="text-xs space-y-1 text-slate-300">
              <p>Top Subject: <strong className="text-white">{selectedStudent.favoriteSubject}</strong></p>
              <p>Recent Honor: <strong className="text-indigo-300">{selectedStudent.recentHonor}</strong></p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => handleCheer(selectedStudent.id, selectedStudent.name)}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Heart className="h-3.5 w-3.5" />
                <span>Send High-Five / Cheer 👏</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cohort Code Editor Modal */}
      {isEditingClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-sm rounded-3xl border border-white/15 bg-slate-900 shadow-2xl p-6 space-y-4 text-white">
            <h3 className="text-sm font-bold text-white">Enter Classroom Cohort Code</h3>
            <p className="text-xs text-slate-400">
              Join your specific school section to compare ranks with classmates.
            </p>
            <input
              type="text"
              value={classroomCode}
              onChange={e => setClassroomCode(e.target.value.toUpperCase())}
              placeholder="e.g. CBSE-9A-DELHI"
              className="w-full p-2.5 rounded-xl border border-white/15 bg-white/5 text-xs text-white uppercase font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditingClass(false)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
              >
                Save & Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
