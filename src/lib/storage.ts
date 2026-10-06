import {
  HomeworkScan,
  TutorMessage,
  QuizResult,
  NoteItem,
  FlashcardItem,
  StudyPlanData,
  NotificationItem,
  AchievementBadge,
  MistakeRecord,
  WeeklyReportData
} from '../types';
import { localStore, db, firestoreSync } from './firebase';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';

export const storage = {
  // Scans
  getScans: (userId: string): HomeworkScan[] => {
    return localStore.get<HomeworkScan[]>(`scans_${userId}`, []);
  },
  saveScan: (userId: string, scan: HomeworkScan): void => {
    const list = storage.getScans(userId);
    const updated = [scan, ...list.filter(s => s.id !== scan.id)];
    localStore.set(`scans_${userId}`, updated);

    // Persist to Cloud Firestore database
    firestoreSync.saveScan(userId, scan);
  },
  deleteScan: (userId: string, scanId: string): void => {
    const list = storage.getScans(userId);
    localStore.set(`scans_${userId}`, list.filter(s => s.id !== scanId));

    if (db) {
      try {
        deleteDoc(doc(db, 'homework_scans', scanId)).catch(() => {});
      } catch {}
    }
  },

  // Chat History
  getChatHistory: (userId: string, subject?: string): TutorMessage[] => {
    const all = localStore.get<TutorMessage[]>(`chat_${userId}`, []);
    if (subject && subject !== 'All Subjects') {
      return all.filter(m => !m.subject || m.subject === subject);
    }
    return all;
  },
  saveChatMessage: (userId: string, message: TutorMessage): void => {
    const all = storage.getChatHistory(userId);
    localStore.set(`chat_${userId}`, [...all, message]);

    // Persist to Firestore
    if (db) {
      try {
        setDoc(doc(db, 'chat_history', message.id), {
          ...message,
          userId,
          syncedAt: new Date().toISOString()
        }).catch((err: any) => console.log('Firestore chat sync:', err?.message));
      } catch {}
    }
  },
  clearChatHistory: (userId: string): void => {
    localStore.set(`chat_${userId}`, []);
  },

  // Quiz Results
  getQuizResults: (userId: string): QuizResult[] => {
    return localStore.get<QuizResult[]>(`quiz_results_${userId}`, []);
  },
  saveQuizResult: (userId: string, result: QuizResult): void => {
    const all = storage.getQuizResults(userId);
    localStore.set(`quiz_results_${userId}`, [result, ...all]);

    // Persist to Cloud Firestore database
    firestoreSync.saveQuizResult(userId, result);
  },

  // 📕 My Mistake Book
  getMistakes: (userId: string): MistakeRecord[] => {
    return localStore.get<MistakeRecord[]>(`mistakes_${userId}`, [
      {
        id: 'mistake_init_1',
        userId,
        question: 'Which of the following represents the correct identity for (a - b)³?',
        options: [
          'a³ - b³ - 3ab(a - b)',
          'a³ + b³ - 3ab(a - b)',
          'a³ - b³ + 3ab(a + b)',
          'a³ - 3a²b + 3ab² + b³'
        ],
        studentAnswer: 'a³ - 3a²b + 3ab² + b³',
        correctAnswer: 'a³ - b³ - 3ab(a - b) [which equals a³ - 3a²b + 3ab² - b³]',
        explanation: 'In the expansion of (a - b)³, the last term is (-b)³ = -b³, not +b³.',
        misconception: 'Sign error on the cubic term of (-b) when expanding brackets.',
        correctReasoning: '(a - b)³ = (a - b)(a - b)² = (a - b)(a² - 2ab + b²) = a³ - 2a²b + ab² - a²b + 2ab² - b³ = a³ - 3a²b + 3ab² - b³.',
        examTip: 'Remember: odd powers of negative terms retain the minus sign. (-b)¹ = -b, (-b)³ = -b³.',
        similarQuestion: 'Expand and simplify: (2x - 3y)³ using standard algebraic identities.',
        subject: 'Mathematics',
        chapter: 'Polynomials',
        topic: 'Algebraic Identities',
        source: 'quiz',
        mastered: false,
        timestamp: new Date(Date.now() - 3600000 * 12).toISOString()
      },
      {
        id: 'mistake_init_2',
        userId,
        question: 'An object is placed 15 cm in front of a concave mirror of focal length 10 cm. Find the nature and position of the image.',
        options: [
          'v = -30 cm (Real and Inverted)',
          'v = +30 cm (Virtual and Erect)',
          'v = -6 cm (Real and Inverted)',
          'v = +6 cm (Virtual and Erect)'
        ],
        studentAnswer: 'v = +30 cm (Virtual and Erect)',
        correctAnswer: 'v = -30 cm (Real and Inverted)',
        explanation: 'For a concave mirror, focal length f = -10 cm, object distance u = -15 cm. Using 1/f = 1/v + 1/u, 1/v = 1/(-10) - 1/(-15) = -1/10 + 1/15 = -1/30 => v = -30 cm.',
        misconception: 'Sign convention mistake: took focal length as positive or used lens formula instead of mirror formula.',
        correctReasoning: 'Mirror formula: 1/f = 1/v + 1/u. With Cartesian signs: f = -10 cm, u = -15 cm. 1/v = 1/f - 1/u = (-3 + 2)/30 = -1/30 => v = -30 cm (negative sign confirms real, inverted image in front of mirror).',
        examTip: 'CBSE Rule: Always state the sign convention clearly before substituting values to avoid losing 1 mark.',
        similarQuestion: 'A concave mirror produces 3 times magnified real image of an object placed at 10 cm in front of it. Where is the image located?',
        subject: 'Science',
        chapter: 'Light - Reflection and Refraction',
        topic: 'Mirror Formula Numericals',
        source: 'quiz',
        mastered: false,
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString()
      }
    ]);
  },
  saveMistake: (userId: string, mistake: MistakeRecord): void => {
    const list = storage.getMistakes(userId);
    const existingIndex = list.findIndex(m => m.id === mistake.id || (m.question === mistake.question && m.subject === mistake.subject));
    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...mistake };
      localStore.set(`mistakes_${userId}`, list);
    } else {
      localStore.set(`mistakes_${userId}`, [mistake, ...list]);
    }

    // Persist to Cloud Firestore database
    firestoreSync.saveMistake(userId, mistake);
  },
  saveMistakesBatch: (userId: string, newMistakes: MistakeRecord[]): void => {
    const list = storage.getMistakes(userId);
    let updated = [...list];
    for (const m of newMistakes) {
      const idx = updated.findIndex(item => item.id === m.id || (item.question === m.question && item.subject === m.subject));
      if (idx >= 0) {
        updated[idx] = { ...updated[idx], ...m };
      } else {
        updated.unshift(m);
      }
      firestoreSync.saveMistake(userId, m);
    }
    localStore.set(`mistakes_${userId}`, updated);
  },
  markMistakeMastered: (userId: string, mistakeId: string, mastered: boolean = true): void => {
    const list = storage.getMistakes(userId);
    const updated = list.map(m => m.id === mistakeId ? { ...m, mastered } : m);
    localStore.set(`mistakes_${userId}`, updated);
  },
  deleteMistake: (userId: string, mistakeId: string): void => {
    const list = storage.getMistakes(userId);
    localStore.set(`mistakes_${userId}`, list.filter(m => m.id !== mistakeId));
  },

  // Notes
  getNotes: (userId: string): NoteItem[] => {
    return localStore.get<NoteItem[]>(`notes_${userId}`, [
      {
        id: 'note_demo_1',
        userId,
        title: 'Light: Lens Formula and Sign Conventions',
        content: 'Convex Lens:\n• Focal length (f) is always positive (+)\n• Object distance (u) is always negative (-)\n• Real image distance (v) is positive (+)\n• Formula: 1/f = 1/v - 1/u\n• Magnification: m = v/u = h\'/h',
        subject: 'Science',
        chapter: 'Light - Reflection and Refraction',
        tags: ['Physics', 'Formulas', 'CBSE Board High Priority'],
        updatedAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 'note_demo_2',
        userId,
        title: 'Quadratic Equations: Nature of Roots Summary',
        content: 'For ax² + bx + c = 0:\nDiscriminant D = b² - 4ac\n1. D > 0 => Two distinct real roots: x = (-b ± √D) / 2a\n2. D = 0 => Two equal real roots: x = -b / 2a\n3. D < 0 => No real roots (imaginary)',
        subject: 'Mathematics',
        chapter: 'Quadratic Equations',
        tags: ['Algebra', 'Exam Formula'],
        updatedAt: new Date(Date.now() - 172800000).toISOString()
      }
    ]);
  },
  saveNote: (userId: string, note: NoteItem): void => {
    const list = storage.getNotes(userId);
    const updated = [note, ...list.filter(n => n.id !== note.id)];
    localStore.set(`notes_${userId}`, updated);
  },
  deleteNote: (userId: string, noteId: string): void => {
    const list = storage.getNotes(userId);
    localStore.set(`notes_${userId}`, list.filter(n => n.id !== noteId));
  },

  // Flashcards
  getFlashcards: (userId: string): FlashcardItem[] => {
    return localStore.get<FlashcardItem[]>(`flashcards_${userId}`, [
      {
        id: 'fc_1',
        userId,
        front: 'What is the Fundamental Theorem of Arithmetic?',
        back: 'Every composite number can be uniquely expressed (factorised) as a product of prime numbers, apart from the order in which the prime factors occur.',
        subject: 'Mathematics',
        chapter: 'Real Numbers',
        mastery: 'learning',
        reviewCount: 3
      },
      {
        id: 'fc_2',
        userId,
        front: 'What is Snell\'s Law of Refraction?',
        back: 'The ratio of sine of angle of incidence to the sine of angle of refraction is a constant for a given pair of media: sin(i) / sin(r) = n (Refractive Index).',
        subject: 'Science',
        chapter: 'Light - Reflection and Refraction',
        mastery: 'mastered',
        reviewCount: 5
      },
      {
        id: 'fc_3',
        userId,
        front: 'What is the chemical formula of Plaster of Paris and how is it prepared?',
        back: 'CaSO₄ · ½H₂O (Calcium Sulphate Hemihydrate). Prepared by heating Gypsum (CaSO₄ · 2H₂O) at 373 K (100°C).',
        subject: 'Science',
        chapter: 'Acids, Bases and Salts',
        mastery: 'new',
        reviewCount: 1
      },
      {
        id: 'fc_4',
        userId,
        front: 'What are the twin obligations described by Nelson Mandela?',
        back: '1. Obligation to family, parents, wife, and children.\n2. Obligation to his people, community, and country.',
        subject: 'English',
        chapter: 'Long Walk to Freedom',
        mastery: 'learning',
        reviewCount: 2
      }
    ]);
  },
  saveFlashcards: (userId: string, cards: FlashcardItem[]): void => {
    localStore.set(`flashcards_${userId}`, cards);
  },
  saveFlashcard: (userId: string, card: FlashcardItem): void => {
    const cards = storage.getFlashcards(userId);
    const existingIndex = cards.findIndex(c => c.id === card.id);
    if (existingIndex >= 0) {
      cards[existingIndex] = card;
    } else {
      cards.unshift(card);
    }
    localStore.set(`flashcards_${userId}`, cards);
  },

  // Study Plan
  getStudyPlan: (userId: string): StudyPlanData | null => {
    return localStore.get<StudyPlanData | null>(`study_plan_${userId}`, {
      id: 'plan_default',
      userId,
      classLevel: 'Class 10',
      summary: 'Focused 4-week CBSE preparation schedule with special emphasis on Quadratic Equations, Light Numericals, and Chemical Equations.',
      targetScore: '95%+',
      examDate: '2026-11-15',
      dailySchedule: [
        {
          id: 'task_1',
          time: '05:30 PM - 06:30 PM',
          subject: 'Mathematics',
          activity: 'Solve 8 Quadratic formula problems & verify discriminant',
          focus: 'Weak Topic Review',
          completed: false
        },
        {
          id: 'task_2',
          time: '06:45 PM - 07:45 PM',
          subject: 'Science',
          activity: 'Lens formula numericals & ray diagram practice',
          focus: 'Numerical Mastery',
          completed: false
        },
        {
          id: 'task_3',
          time: '08:15 PM - 09:00 PM',
          subject: 'Social Science',
          activity: 'Nationalism in Europe timeline & French Revolution notes',
          focus: 'Retention & Flashcards',
          completed: false
        }
      ],
      weeklyMilestones: [
        { week: 'Week 1', goal: 'Master Quadratic Equations & Light Numericals', mockTest: 'Class 10 Science Chapter 10 Test' },
        { week: 'Week 2', goal: 'Chemical Reactions balancing & Acids/Bases', mockTest: 'Class 10 Maths Sections A & B' },
        { week: 'Week 3', goal: 'English Formal Writing & Social Science Map Work', mockTest: 'Full 80-mark Practice Paper' }
      ],
      retentionStrategy: 'Spaced repetition: Day 1 initial study, Day 3 active recall quiz, Day 7 practice numericals, Day 21 mock test.',
      motivationalQuote: 'Success in board exams is the sum of small efforts repeated day in and day out.',
      createdAt: new Date().toISOString()
    });
  },
  saveStudyPlan: (userId: string, plan: StudyPlanData): void => {
    localStore.set(`study_plan_${userId}`, plan);
  },

  // Notifications
  getNotifications: (userId: string): NotificationItem[] => {
    return localStore.get<NotificationItem[]>(`notifications_${userId}`, [
      {
        id: 'notif_welcome',
        title: 'Welcome to EduGenius AI!',
        message: 'Your personalized CBSE dashboard is active with clean 0-value stats. Scan your first worksheet or take a quiz to begin!',
        type: 'reminder',
        timestamp: 'Just now',
        read: false
      },
      {
        id: 'notif_streak_info',
        title: 'Start Your Study Streak Today',
        message: 'Complete any question or doubt query today to unlock your Day 1 Streak badge.',
        type: 'streak',
        timestamp: '10m ago',
        read: false
      },
      {
        id: 'notif_exam',
        title: 'CBSE Board Prep Active',
        message: 'Your syllabus curriculum is aligned to CBSE 2026 guidelines. Explore NCERT chapters anytime.',
        type: 'exam',
        timestamp: '1h ago',
        read: true
      }
    ]);
  },
  markNotificationRead: (userId: string, notifId: string): void => {
    const list = storage.getNotifications(userId);
    localStore.set(`notifications_${userId}`, list.map(n => n.id === notifId ? { ...n, read: true } : n));
  },

  // Badges & Gamification
  getBadges: (): AchievementBadge[] => {
    return [
      { id: 'b_first_scan', title: 'Eagle Eye Scanner', description: 'Scanned first homework or worksheet', icon: 'Camera', unlocked: true, unlockedAt: '2026-09-01', progress: 1, maxProgress: 1 },
      { id: 'b_streak_7', title: '7-Day Scholar Streak', description: 'Studied 7 days consecutively', icon: 'Flame', unlocked: false, progress: 6, maxProgress: 7 },
      { id: 'b_quiz_master', title: 'Quiz Whiz', description: 'Scored 90%+ in 5 CBSE quizzes', icon: 'Trophy', unlocked: true, unlockedAt: '2026-09-05', progress: 5, maxProgress: 5 },
      { id: 'b_math_pro', title: 'Aryabhata Math Master', description: 'Solved 50 CBSE Math problems with AI', icon: 'Calculator', unlocked: false, progress: 34, maxProgress: 50 },
      { id: 'b_doubt_crusher', title: 'Curious Mind', description: 'Asked 20 thoughtful questions to AI Tutor', icon: 'Sparkles', unlocked: true, unlockedAt: '2026-09-04', progress: 20, maxProgress: 20 }
    ];
  },

  // Weekly Email Reports
  getWeeklyReports: (userId: string): WeeklyReportData[] => {
    return localStore.get<WeeklyReportData[]>(`weekly_reports_${userId}`, []);
  },
  saveWeeklyReport: (userId: string, report: WeeklyReportData): void => {
    const list = storage.getWeeklyReports(userId);
    localStore.set(`weekly_reports_${userId}`, [report, ...list.filter(r => r.id !== report.id)]);
  }
};
