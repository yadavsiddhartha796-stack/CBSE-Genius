import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { HomeworkScanner } from './components/HomeworkScanner';
import { AITutorChat } from './components/AITutorChat';
import { AIQuestionSolver } from './components/AIQuestionSolver';
import { AIComparisonMode } from './components/AIComparisonMode';
import { CBSEExplorer } from './components/CBSEExplorer';
import { DocumentScanner } from './components/DocumentScanner';
import { QuizGenerator } from './components/QuizGenerator';
import { StudyPlanner } from './components/StudyPlanner';
import { ProgressAnalytics } from './components/ProgressAnalytics';
import { NotesAndFlashcards } from './components/NotesAndFlashcards';
import { MistakeBook } from './components/MistakeBook';
import { Leaderboard } from './components/Leaderboard';
import { ParentDashboard } from './components/ParentDashboard';
import { SettingsModal } from './components/SettingsModal';
import { AuthModal } from './components/AuthModal';
import { LoginPage } from './components/LoginPage';
import { AttributionBadge } from './components/AttributionBadge';

const AppContent: React.FC = () => {
  const { user } = useAuth();

  // If user is not authenticated, display the dedicated Login Page
  if (!user) {
    return <LoginPage />;
  }

  // Navigation state
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  // Cross-component contextual parameters
  const [tutorContext, setTutorContext] = useState<string | undefined>(undefined);
  const [quizContext, setQuizContext] = useState<{ subject: string; chapter: string } | undefined>(
    undefined
  );
  const [comparisonContext, setComparisonContext] = useState<string | undefined>(undefined);

  // Actions for cross-module jumping
  const handleAskTutor = (contextText: string) => {
    setTutorContext(contextText);
    setActiveTab('tutor-chat');
  };

  const handleStartQuiz = (subject: string, chapter: string) => {
    setQuizContext({ subject, chapter });
    setActiveTab('quizzes');
  };

  const handleCompare = (question: string) => {
    setComparisonContext(question);
    setActiveTab('model-comparison');
  };

  const handleScanFromChapter = (subject: string, chapter: string) => {
    setActiveTab('homework-scanner');
  };

  return (
    <div className="min-h-screen text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-x-hidden">
      {/* Ambient background glow orbs */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2 z-0" />
      <div className="fixed bottom-0 right-0 w-[30rem] h-[30rem] bg-purple-600/15 rounded-full blur-3xl pointer-events-none translate-x-1/3 translate-y-1/3 z-0" />
      <div className="fixed top-1/2 left-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Top Navigation */}
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        isSidebarOpen={isSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Container */}
      <div className="flex-1 flex pt-16 relative z-10">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={tab => {
            if (tab === 'settings') {
              setIsSettingsOpen(true);
            } else {
              setActiveTab(tab);
            }
          }}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Content View Area */}
        <main className="flex-1 lg:pl-64 w-full p-4 sm:p-6 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <Dashboard
              onNavigate={tab => setActiveTab(tab)}
            />
          )}

          {activeTab === 'homework-scanner' && (
            <HomeworkScanner
              onAskTutor={handleAskTutor}
              onStartQuizFromMistakes={chapter => handleStartQuiz('Science', chapter)}
            />
          )}

          {activeTab === 'tutor-chat' && (
            <AITutorChat
              initialQuestion={tutorContext}
              onOpenNotes={() => setActiveTab('notes-flashcards')}
            />
          )}

          {activeTab === 'solver' && (
            <AIQuestionSolver
              onCompare={handleCompare}
              onCreateQuiz={chapter => handleStartQuiz('Mathematics', chapter)}
            />
          )}

          {activeTab === 'model-comparison' && (
            <AIComparisonMode initialQuestion={comparisonContext} />
          )}

          {activeTab === 'cbse-explorer' && (
            <CBSEExplorer
              onAskTutor={(s, c) => handleAskTutor(`Explain Chapter: ${c} in ${s}`)}
              onStartQuiz={handleStartQuiz}
              onScanHomework={handleScanFromChapter}
            />
          )}

          {activeTab === 'document-scanner' && (
            <DocumentScanner
              onStartQuizFromDoc={docText =>
                handleStartQuiz('Science', 'Document Review')
              }
            />
          )}

          {activeTab === 'quizzes' && (
            <QuizGenerator
              initialSubject={quizContext?.subject || 'Science'}
              initialChapter={quizContext?.chapter || 'Light - Reflection and Refraction'}
              onAskTutor={handleAskTutor}
            />
          )}

          {activeTab === 'mistake-book' && (
            <MistakeBook
              onPracticeTopic={(subject, chapter) => handleStartQuiz(subject, chapter)}
              onAskTutor={handleAskTutor}
            />
          )}

          {activeTab === 'study-planner' && <StudyPlanner />}

          {activeTab === 'analytics' && (
            <ProgressAnalytics
              onPracticeMistake={topic => handleStartQuiz('Science', topic)}
            />
          )}

          {activeTab === 'notes-flashcards' && (
            <NotesAndFlashcards
              onStartQuizFromNotes={content =>
                handleStartQuiz('Science', 'Notes Revision')
              }
            />
          )}

          {activeTab === 'leaderboard' && (
            <Leaderboard onNavigateTab={tab => setActiveTab(tab)} />
          )}

          {activeTab === 'parent-dashboard' && <ParentDashboard />}
        </main>
      </div>

      {/* Global Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* Persistent Bottom Corner Attribution */}
      <AttributionBadge position="fixed" />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
