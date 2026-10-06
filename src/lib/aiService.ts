import { AIModelOption, HomeworkMode, HomeworkScan, TutorMode } from '../types';

export interface SolveParams {
  question?: string;
  imageBase64?: string;
  difficulty?: 'Easy' | 'Medium' | 'Advanced' | 'Olympiad';
  language?: 'English' | 'Hindi' | 'Hinglish';
  classLevel?: string;
  subject?: string;
  action?: 'solve' | 'simplify' | 'example' | 'hindi' | 'hint';
  modelId?: string;
}

export interface HomeworkScanParams {
  imageBase64?: string;
  mode: HomeworkMode;
  classLevel?: string;
  subjectHint?: string;
  userText?: string;
}

export interface TutorChatParams {
  message: string;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
  classLevel?: string;
  subject?: string;
  chapter?: string;
  mode?: TutorMode;
  modelId?: string;
}

export const aiService = {
  // Check health and available providers
  async checkHealth() {
    try {
      const res = await fetch('/api/health');
      return await res.json();
    } catch {
      return { status: 'offline', providers: { gemini: false, openai: false, anthropic: false } };
    }
  },

  // Get AI models
  async getModels(): Promise<AIModelOption[]> {
    try {
      const res = await fetch('/api/models');
      const data = await res.json();
      return data.models || [];
    } catch (e) {
      console.error('Failed to fetch models:', e);
      return [];
    }
  },

  // Solve question
  async solve(params: SolveParams): Promise<{ answer: string; success: boolean }> {
    const res = await fetch('/api/ai/solve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to solve question');
    }
    return await res.json();
  },

  // Homework Scanner
  async scanHomework(params: HomeworkScanParams): Promise<{ success: boolean; scanResult: Partial<HomeworkScan>; raw?: string }> {
    const res = await fetch('/api/ai/homework-scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Homework scanner encountered an issue');
    }
    return await res.json();
  },

  // AI Tutor Chat
  async chatWithTutor(params: TutorChatParams): Promise<{ reply: string; suggestions: string[] }> {
    const res = await fetch('/api/ai/tutor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Tutor failed to respond');
    }
    return await res.json();
  },

  // AI Comparison
  async compareModels(question: string, classLevel = 'Class 10', subject = 'Mathematics') {
    const res = await fetch('/api/ai/compare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, classLevel, subject })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Comparison failed');
    }
    return await res.json();
  },

  // Document Analyzer
  async analyzeDocument(params: { documentText?: string; imageBase64?: string; documentName: string; action: string; classLevel?: string }) {
    const res = await fetch('/api/ai/document-analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Document analysis failed');
    }
    return await res.json();
  },

  // Quiz Generator
  async generateQuiz(params: {
    classLevel: string;
    subject: string;
    chapter: string;
    difficulty?: string;
    questionCount?: number;
    questionTypes?: string[];
  }) {
    const res = await fetch('/api/ai/quiz-generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Quiz generation failed');
    }
    return await res.json();
  },

  // Study Planner
  async generateStudyPlan(params: {
    classLevel: string;
    examDate: string;
    dailyHours: number;
    subjects: string[];
    weakChapters: string[];
    targetScore: string;
  }) {
    const res = await fetch('/api/ai/study-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Study planner failed');
    }
    return await res.json();
  },

  // Notes Generator
  async generateNotes(params: {
    classLevel: string;
    subject: string;
    chapter: string;
    format: string;
  }): Promise<{ success: boolean; notes: string; title: string }> {
    const res = await fetch('/api/ai/notes-generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Notes generation failed');
    }
    return await res.json();
  },

  // Flashcards Generator
  async generateFlashcards(params: {
    classLevel: string;
    subject: string;
    chapter: string;
    count?: number;
    difficulty?: string;
  }): Promise<{ success: boolean; flashcards: Array<{ front: string; back: string; topic?: string }> }> {
    const res = await fetch('/api/ai/flashcards-generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Flashcards generation failed');
    }
    return await res.json();
  },

  // Explain Mistake (Deep Socratic Breakdown)
  async explainMistake(params: {
    question: string;
    studentAnswer: string;
    correctAnswer: string;
    subject?: string;
    chapter?: string;
    classLevel?: string;
  }): Promise<{
    success: boolean;
    explanation: {
      studentAction: string;
      misconception: string;
      correctReasoning: string;
      correctAnswer: string;
      examTip: string;
      similarQuestion: string;
    };
  }> {
    const res = await fetch('/api/ai/explain-mistake', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to explain mistake');
    }
    return await res.json();
  },

  // 15-Minute Quick Revision Generator
  async generateQuickRevision(params: {
    subject: string;
    chapter: string;
    classLevel?: string;
  }): Promise<{ success: boolean; revision: any }> {
    const res = await fetch('/api/ai/quick-revision', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to generate 15-minute quick revision');
    }
    return await res.json();
  },

  // Answer Presentation / Step Marking Checker
  async checkAnswer(params: {
    question: string;
    studentAnswer: string;
    maxMarks?: number;
    subject?: string;
    chapter?: string;
    classLevel?: string;
  }): Promise<{ success: boolean; evaluation: any }> {
    const res = await fetch('/api/ai/check-answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to check answer');
    }
    return await res.json();
  },

  // Weekly Academic Progress Report Generator & Dispatch
  async generateWeeklyReport(params: {
    studentName: string;
    studentEmail: string;
    classLevel?: string;
    totalStudyMinutes?: number;
    quizzesCompleted?: number;
    avgQuizScore?: number;
    homeworkScansEvaluated?: number;
    currentStreakDays?: number;
    xpEarnedThisWeek?: number;
    subjectBreakdown?: any[];
    weakTopics?: string[];
  }): Promise<{ success: boolean; report: any; message: string }> {
    const res = await fetch('/api/reports/weekly-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to generate weekly summary report');
    }
    return await res.json();
  }
};
