import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, SubscriptionPlan } from '../types';
import { localStore, firestoreSync } from '../lib/firebase';
import confetti from 'canvas-confetti';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (
    email: string,
    pass: string,
    name?: string,
    role?: UserRole,
    classLevel?: string,
    board?: string,
    subjects?: string[],
    plan?: SubscriptionPlan
  ) => Promise<void>;
  register: (data: Partial<UserProfile> & { password?: string }) => Promise<void>;
  loginWithGoogle: (customData?: Partial<UserProfile>) => Promise<void>;
  loginDemoStudent: (customData?: Partial<UserProfile>) => Promise<void>;
  logout: () => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
  updateUserProfile: (updated: Partial<UserProfile>) => void;
  addXP: (amount: number, reason?: string) => void;
  incrementStreak: () => void;
  switchRole: (newRole: UserRole) => void;
  resetStatsToZero: () => void;
}

export const FRESH_ZERO_USER: UserProfile = {
  uid: 'edugenius_student_fresh',
  name: 'CBSE Scholar',
  email: 'scholar@edugenius.ai',
  classLevel: 'Class 9',
  board: 'CBSE',
  role: 'student',
  plan: 'standard',
  preferredLanguage: 'English',
  subjects: ['Mathematics', 'Science', 'English', 'Social Science'],
  learningGoals: 'Master CBSE Class 9 Syllabus & build strong conceptual foundations',
  examDate: '2026-11-15',
  xp: 0,
  level: 1,
  streakDays: 0,
  lastActiveDate: new Date().toISOString().split('T')[0],
  parentLinkedCode: 'EDU-PARENT-0001',
  linkedStudentUids: ['edugenius_student_fresh'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always start on login page as explicitly requested by user.
  // Stored profiles remain in storage for user to sign back into or pick.
  const [user, setUser] = useState<UserProfile | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      localStore.set('currentUser', user);
      firestoreSync.saveUser(user);
    } else {
      localStore.remove('currentUser');
    }
  }, [user]);

  const login = async (email: string, _pass: string) => {
    setIsLoading(true);
    try {
      const existingUser = localStore.get<UserProfile | null>('user_' + email, null);
      if (existingUser) {
        setUser(existingUser);
      } else {
        const namePart = email.split('@')[0].replace(/[._-]/g, ' ');
        const capitalizedName = namePart
          .split(' ')
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');

        const newUser: UserProfile = {
          uid: 'user_' + Date.now(),
          name: capitalizedName || 'CBSE Scholar',
          email,
          classLevel: 'Class 10',
          board: 'CBSE',
          role: 'student',
          preferredLanguage: 'English',
          subjects: ['Mathematics', 'Science', 'English', 'Social Science'],
          learningGoals: 'Master CBSE Board Exam syllabus with step-by-step clarity',
          xp: 0,
          level: 1,
          streakDays: 0,
          lastActiveDate: new Date().toISOString().split('T')[0],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        localStore.set('user_' + email, newUser);
        setUser(newUser);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    email: string,
    _pass: string,
    name?: string,
    role: UserRole = 'student',
    classLevel: string = 'Class 9',
    board: string = 'CBSE',
    subjects: string[] = ['Mathematics', 'Science', 'English', 'Social Science'],
    plan: SubscriptionPlan = 'standard'
  ) => {
    setIsLoading(true);
    try {
      const newUser: UserProfile = {
        uid: 'user_' + Date.now(),
        name: name?.trim() || email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'CBSE Scholar',
        email,
        classLevel,
        board,
        role,
        plan,
        preferredLanguage: 'English',
        subjects: subjects.length > 0 ? subjects : ['Mathematics', 'Science', 'English', 'Social Science'],
        learningGoals: 'Excel in CBSE exams with step-by-step conceptual mastery',
        xp: 0,
        level: 1,
        streakDays: 0,
        lastActiveDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      localStore.set('user_' + email, newUser);
      setUser(newUser);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: Partial<UserProfile> & { password?: string }) => {
    return signup(
      data.email || 'student@edugenius.ai',
      data.password || 'password123',
      data.name,
      data.role || 'student',
      data.classLevel || 'Class 9',
      data.board || 'CBSE',
      data.subjects,
      data.plan || 'standard'
    );
  };

  const loginWithGoogle = async (customData?: Partial<UserProfile>) => {
    setIsLoading(true);
    try {
      const email = (customData?.email && customData.email.trim()) || 'google.student@gmail.com';
      const existing = localStore.get<UserProfile | null>('user_' + email, null);

      const targetClass = customData?.classLevel || existing?.classLevel || 'Class 9';
      const targetBoard = customData?.board || existing?.board || 'CBSE';
      const targetPlan = customData?.plan || existing?.plan || 'standard';
      const targetSubjects =
        customData?.subjects && customData.subjects.length > 0
          ? customData.subjects
          : existing?.subjects && existing.subjects.length > 0
          ? existing.subjects
          : ['Mathematics', 'Science', 'English', 'Social Science'];

      const fallbackName = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Google Student';

      const googleUser: UserProfile = {
        uid: existing?.uid || 'google_' + email.replace(/[^a-zA-Z0-9]/g, '_'),
        name: customData?.name?.trim() || existing?.name || fallbackName,
        email: email,
        classLevel: targetClass,
        board: targetBoard,
        role: customData?.role || existing?.role || 'student',
        plan: targetPlan,
        preferredLanguage: existing?.preferredLanguage || 'English',
        subjects: targetSubjects,
        learningGoals: existing?.learningGoals || `CBSE ${targetClass} syllabus mastery with AI Teacher & Scanner`,
        xp: existing?.xp ?? 0,
        level: existing?.level ?? 1,
        streakDays: existing?.streakDays ?? 0,
        lastActiveDate: new Date().toISOString().split('T')[0],
        createdAt: existing?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      localStore.set('user_' + email, googleUser);
      localStore.set('currentUser', googleUser);
      setUser(googleUser);
    } finally {
      setIsLoading(false);
    }
  };

  const loginDemoStudent = async (customData?: Partial<UserProfile>) => {
    setIsLoading(true);
    try {
      const demoUser: UserProfile = {
        ...FRESH_ZERO_USER,
        ...customData,
        uid: 'demo_fresh_' + Date.now(),
        xp: 0,
        level: 1,
        streakDays: 0
      };
      setUser(demoUser);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStore.remove('currentUser');
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    setUser(prev => {
      if (!prev) return null;
      const next = { ...prev, ...updated, updatedAt: new Date().toISOString() };
      localStore.set('currentUser', next);
      if (next.email) {
        localStore.set('user_' + next.email, next);
      }
      return next;
    });
  };

  const resetStatsToZero = () => {
    setUser(prev => {
      if (!prev) return null;
      const next = {
        ...prev,
        xp: 0,
        level: 1,
        streakDays: 0,
        updatedAt: new Date().toISOString()
      };
      localStore.set('currentUser', next);
      if (next.email) {
        localStore.set('user_' + next.email, next);
      }
      return next;
    });
  };

  const addXP = (amount: number, _reason?: string) => {
    setUser(prev => {
      if (!prev) return null;
      const newXP = (prev.xp || 0) + amount;
      const newLevel = Math.max(1, Math.floor(newXP / 400) + 1);
      const leveledUp = newLevel > (prev.level || 1);
      if (leveledUp) {
        try {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 }
          });
        } catch {}
      }
      const updated = {
        ...prev,
        xp: newXP,
        level: newLevel,
        updatedAt: new Date().toISOString()
      };
      return updated;
    });
  };

  const incrementStreak = () => {
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        streakDays: (prev.streakDays || 0) + 1,
        lastActiveDate: new Date().toISOString().split('T')[0]
      };
    });
  };

  const switchRole = (newRole: UserRole) => {
    setUser(prev => {
      if (!prev) return null;
      return { ...prev, role: newRole };
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        register,
        loginWithGoogle,
        loginDemoStudent,
        logout,
        updateProfile,
        updateUserProfile: updateProfile,
        addXP,
        incrementStreak,
        switchRole,
        resetStatsToZero
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
