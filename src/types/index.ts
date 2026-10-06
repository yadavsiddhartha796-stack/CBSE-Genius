export type UserRole = 'student' | 'parent' | 'teacher';
export type SubscriptionPlan = 'standard' | 'premium';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  classLevel: string; // e.g. "Class 10"
  board: string; // e.g. "CBSE", "ICSE", "State Board"
  role: UserRole;
  plan?: SubscriptionPlan;
  preferredLanguage: 'English' | 'Hindi' | 'Hinglish';
  subjects: string[];
  weakSubjects?: string[];
  dailyHours?: number;
  onboardingCompleted?: boolean;
  learningGoals: string;
  examDate?: string;
  profilePhoto?: string;
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: string;
  parentLinkedCode?: string;
  linkedStudentUids?: string[];
  createdAt: string;
  updatedAt: string;
}

export type HomeworkMode = 'check' | 'solve' | 'practice' | 'teach' | 'hint';

export interface ScanCorrection {
  step: string;
  studentWrote: string;
  correctVersion: string;
  issue: string;
  severity: 'minor' | 'critical' | 'formatting';
}

export interface HomeworkScan {
  id: string;
  userId: string;
  mode: HomeworkMode;
  imageUrl?: string;
  subject: string;
  chapter: string;
  topic?: string;
  questionNumber?: string;
  extractedQuestions: string;
  detectedAnswers?: string;
  status: 'Correct' | 'Partially Correct' | 'Needs Rework' | 'Evaluated';
  score: number; // 0 to 100
  corrections?: ScanCorrection[];
  explanations: string;
  expectedSolution?: string;
  improvementTips?: string[];
  hints?: string[];
  similarQuestion?: string;
  firstMilestone?: string;
  createdAt: string;
}

export type TutorMode =
  | 'Explain Simply'
  | 'Step-by-Step'
  | 'Exam Answer'
  | 'Give Me a Hint'
  | 'Quiz Me'
  | 'Show Example'
  | 'Deep Explanation'
  | 'Friendly Teacher'
  | 'Doubt Solver'
  | 'Exam Coach'
  | 'Concept Explainer'
  | 'Revision Teacher'
  | 'Homework Helper';

export interface TutorMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  subject?: string;
  chapter?: string;
  suggestions?: string[];
}

export interface AIModelOption {
  id: string;
  name: string;
  provider: 'Gemini' | 'OpenAI' | 'Anthropic';
  badge: string;
  bestFor: string[];
  description: string;
  configured: boolean;
  recommended: boolean;
  latency: string;
}

export interface QuizQuestion {
  id: number;
  type: 'MCQ' | 'True/False' | 'Fill in Blanks' | 'Assertion-Reason';
  question: string;
  options: string[];
  correctIndex: number;
  correctAnswer: string;
  explanation: string;
  topic: string;
}

export interface QuizData {
  id: string;
  title: string;
  classLevel: string;
  subject: string;
  chapter: string;
  timeLimitMinutes: number;
  questions: QuizQuestion[];
}

export interface QuizResult {
  id: string;
  userId: string;
  quizId?: string;
  title?: string;
  subject: string;
  chapter: string;
  totalQuestions: number;
  correctCount: number;
  score?: number;
  percentage?: number;
  scorePercentage: number;
  timeTakenSeconds?: number;
  answers?: { [questionId: number]: number };
  selectedAnswers?: { [questionId: number]: number };
  questions?: QuizQuestion[];
  date?: string;
  weakTopics?: string[];
  createdAt?: string;
}

export interface StudyTask {
  id: string;
  time: string;
  subject: string;
  activity: string;
  focus: string;
  completed: boolean;
}

export interface StudyPlanData {
  id: string;
  userId: string;
  classLevel: string;
  summary: string;
  targetScore: string;
  examDate: string;
  dailySchedule: StudyTask[];
  weeklyStrategy?: Record<string, string>;
  weeklyMilestones?: { week: string; goal: string; mockTest: string }[];
  retentionStrategy?: string;
  motivationalQuote?: string;
  createdAt: string;
}

export type StudyPlan = StudyPlanData;

export interface NoteItem {
  id: string;
  userId: string;
  title: string;
  content: string;
  subject: string;
  chapter: string;
  tags: string[];
  updatedAt: string;
}

export type StudyNote = NoteItem;

export interface FlashcardItem {
  id: string;
  userId: string;
  front: string;
  back: string;
  subject: string;
  chapter: string;
  mastery?: 'new' | 'learning' | 'mastered';
  reviewCount?: number;
  interval?: number;
  easeFactor?: number;
}

export type Flashcard = FlashcardItem;

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'exam' | 'reminder' | 'streak' | 'quiz' | 'homework';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface MistakeRecord {
  id: string;
  userId: string;
  question: string;
  options?: string[];
  studentAnswer: string;
  correctAnswer: string;
  explanation: string;
  misconception?: string;
  correctReasoning?: string;
  examTip?: string;
  similarQuestion?: string;
  subject: string;
  chapter: string;
  topic: string;
  source: 'quiz' | 'homework' | 'diagnostic' | 'practice';
  mastered: boolean;
  timestamp: string;
}

export interface QuickRevisionData {
  subject: string;
  chapter: string;
  keyConcepts: { title: string; summary: string; formula?: string }[];
  importantDefinitions: { term: string; definition: string }[];
  cbseExamQuestions: { marks: number; question: string; answerKey: string }[];
  commonMistakes: { mistake: string; correction: string }[];
  miniQuiz: QuizQuestion[];
}

export interface AnswerEvaluationResult {
  scoreObtained: number;
  maxMarks: number;
  percentage: number;
  verdict: 'Excellent' | 'Good Attempt' | 'Needs Improvement' | 'Incomplete';
  whatYouDidWell: string[];
  whatYouMissed: string[];
  cbseStepMarking: { step: string; marksAwarded: number; maxStepMarks: number; feedback: string }[];
  idealCbseAnswer: string;
  examTip: string;
}

export interface WeeklyReportData {
  id: string;
  studentName: string;
  studentEmail: string;
  classLevel: string;
  weekRange: string;
  totalStudyMinutes: number;
  quizzesCompleted: number;
  avgQuizScore: number;
  homeworkScansEvaluated: number;
  xpEarnedThisWeek: number;
  currentStreakDays: number;
  subjectBreakdown: { subject: string; score: number; questionsAnswered: number }[];
  strengths: string[];
  focusAreas: string[];
  aiCoachComment: string;
  generatedAt: string;
  sentStatus: 'sent' | 'scheduled' | 'preview';
}

export interface LeaderboardStudent {
  id: string;
  rank: number;
  name: string;
  avatar?: string;
  isCurrentUser?: boolean;
  school?: string;
  city?: string;
  classLevel: string;
  totalPoints: number;
  badgePoints: number;
  badgesCount: number;
  quizPoints: number;
  quizzesCompleted: number;
  avgQuizScore: number;
  streakDays: number;
  favoriteSubject: string;
  recentHonor?: string;
}

