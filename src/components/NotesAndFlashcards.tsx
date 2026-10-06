import React, { useState } from 'react';
import {
  StickyNote,
  Layers,
  Plus,
  Trash2,
  Sparkles,
  Search,
  BookOpen,
  RotateCw,
  Check,
  Award,
  Share2,
  Copy,
  ArrowRight,
  RotateCcw,
  HelpCircle,
  Clock,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { storage } from '../lib/storage';
import { aiService } from '../lib/aiService';
import { StudyNote, Flashcard } from '../types';
import { getCurriculumByClass, getChaptersForSubject } from '../lib/cbseData';
import confetti from 'canvas-confetti';

interface NotesAndFlashcardsProps {
  onStartQuizFromNotes?: (notesContent: string) => void;
}

const NOTE_FORMATS = [
  'Quick Revision Notes',
  'Detailed Concept Notes',
  'Exam Formula Sheet & Definitions',
  'Important Board Questions & Answers'
];

export const NotesAndFlashcards: React.FC<NotesAndFlashcardsProps> = ({
  onStartQuizFromNotes
}) => {
  const { user, addXP } = useAuth();
  const userClass = user?.classLevel || 'Class 9';
  const availableCurriculum = getCurriculumByClass(userClass, user?.subjects);

  const [activeTab, setActiveTab] = useState<'notes' | 'flashcards'>('notes');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');

  // Notes state
  const [notes, setNotes] = useState<StudyNote[]>(() => {
    return user ? storage.getNotes(user.uid) : [];
  });
  const [activeNote, setActiveNote] = useState<StudyNote | null>(notes[0] || null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [copiedNote, setCopiedNote] = useState<boolean>(false);

  // AI Notes Generator State
  const [isGenModalOpen, setIsGenModalOpen] = useState<boolean>(false);
  const [genSubject, setGenSubject] = useState<string>(availableCurriculum[0]?.name || 'Science');
  const genChapters = getChaptersForSubject(userClass, genSubject);
  const [genChapter, setGenChapter] = useState<string>(genChapters[0]?.title || 'Motion');
  const [genFormat, setGenFormat] = useState<string>(NOTE_FORMATS[0]);
  const [isGeneratingNote, setIsGeneratingNote] = useState<boolean>(false);
  const [genError, setGenError] = useState<string | null>(null);

  // Flashcards state
  const [flashcards, setFlashcards] = useState<Flashcard[]>(() => {
    return user ? storage.getFlashcards(user.uid) : [];
  });
  const [flashcardIndex, setFlashcardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [needPracticeCards, setNeedPracticeCards] = useState<Flashcard[]>([]);
  const [isDeckFinished, setIsDeckFinished] = useState<boolean>(false);

  // Flashcards Generator State
  const [isFCModalOpen, setIsFCModalOpen] = useState<boolean>(false);
  const [fcSubject, setFcSubject] = useState<string>(availableCurriculum[0]?.name || 'Science');
  const fcChapters = getChaptersForSubject(userClass, fcSubject);
  const [fcChapter, setFcChapter] = useState<string>(fcChapters[0]?.title || 'Motion');
  const [fcCount, setFcCount] = useState<number>(5);
  const [fcDifficulty, setFcDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [isGeneratingFC, setIsGeneratingFC] = useState<boolean>(false);

  // Filtered notes
  const filteredNotes = notes.filter(n => {
    const matchSubject = selectedSubject === 'All' || n.subject === selectedSubject;
    const matchSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSubject && matchSearch;
  });

  const handleCreateBlankNote = () => {
    if (!user) return;
    const newNote: StudyNote = {
      id: 'note_' + Date.now(),
      userId: user.uid,
      title: 'New Study Note',
      content: '# Key Points & Formulas\n\n1. Definition:\n2. Mathematical Formula:\n3. Exam Tip:',
      subject: genSubject,
      chapter: genChapter,
      tags: ['Revision'],
      updatedAt: new Date().toISOString()
    };

    const updated = [newNote, ...notes];
    setNotes(updated);
    setActiveNote(newNote);
    setIsEditing(true);
    storage.saveNote(user.uid, newNote);
  };

  const handleGenerateAINote = async () => {
    setIsGeneratingNote(true);
    setGenError(null);
    try {
      const res = await aiService.generateNotes({
        classLevel: userClass,
        subject: genSubject,
        chapter: genChapter,
        format: genFormat
      });

      if (res.success && res.notes) {
        const newNote: StudyNote = {
          id: 'note_ai_' + Date.now(),
          userId: user?.uid || 'guest',
          title: res.title || `${genChapter} - ${genFormat}`,
          content: res.notes,
          subject: genSubject,
          chapter: genChapter,
          tags: ['AI Generated', genFormat],
          updatedAt: new Date().toISOString()
        };

        const updated = [newNote, ...notes];
        setNotes(updated);
        setActiveNote(newNote);
        setIsEditing(false);
        setIsGenModalOpen(false);

        if (user) {
          storage.saveNote(user.uid, newNote);
          addXP(30, 'Generated AI Study Note');
        }
        confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
      }
    } catch (err: any) {
      setGenError(err.message || 'Failed to generate note. Please retry.');
    } finally {
      setIsGeneratingNote(false);
    }
  };

  const handleSaveActiveNote = () => {
    if (!activeNote || !user) return;
    storage.saveNote(user.uid, activeNote);
    setNotes(prev => prev.map(n => (n.id === activeNote.id ? activeNote : n)));
    setIsEditing(false);
  };

  const handleDeleteNote = (id: string) => {
    if (!user) return;
    storage.deleteNote(user.uid, id);
    const remaining = notes.filter(n => n.id !== id);
    setNotes(remaining);
    setActiveNote(remaining[0] || null);
  };

  const handleCopyNote = () => {
    if (!activeNote) return;
    navigator.clipboard.writeText(activeNote.content);
    setCopiedNote(true);
    setTimeout(() => setCopiedNote(false), 2000);
  };

  // Convert note to flashcards
  const handleConvertNoteToFlashcards = () => {
    if (!activeNote || !user) return;
    const sampleCards: Flashcard[] = [
      {
        id: 'fc_' + Date.now() + '_1',
        userId: user.uid,
        subject: activeNote.subject,
        chapter: activeNote.chapter,
        front: `What is the core principle of ${activeNote.title}?`,
        back: activeNote.content.slice(0, 180),
        interval: 1,
        easeFactor: 2.5
      },
      {
        id: 'fc_' + Date.now() + '_2',
        userId: user.uid,
        subject: activeNote.subject,
        chapter: activeNote.chapter,
        front: `Key CBSE Exam Formula for ${activeNote.chapter}:`,
        back: 'Recall and write out the main equation with SI units.',
        interval: 1,
        easeFactor: 2.5
      }
    ];

    sampleCards.forEach(c => storage.saveFlashcard(user.uid, c));
    setFlashcards(prev => [...sampleCards, ...prev]);
    setFlashcardIndex(0);
    setIsDeckFinished(false);
    setActiveTab('flashcards');
    addXP(25, 'Created Flashcard Deck');
  };

  // Generate Flashcards Deck via AI
  const handleGenerateAIFlashcards = async () => {
    setIsGeneratingFC(true);
    try {
      const res = await aiService.generateFlashcards({
        classLevel: userClass,
        subject: fcSubject,
        chapter: fcChapter,
        count: fcCount,
        difficulty: fcDifficulty
      });

      if (res.success && res.flashcards && res.flashcards.length > 0) {
        const newCards: Flashcard[] = res.flashcards.map((fc, i) => ({
          id: 'fc_' + Date.now() + '_' + i,
          userId: user?.uid || 'guest',
          subject: fcSubject,
          chapter: fcChapter,
          front: fc.front,
          back: fc.back,
          interval: 1,
          easeFactor: 2.5
        }));

        if (user) {
          newCards.forEach(c => storage.saveFlashcard(user.uid, c));
          addXP(30, 'Generated Flashcards Deck');
        }

        setFlashcards(newCards);
        setFlashcardIndex(0);
        setIsFlipped(false);
        setIsDeckFinished(false);
        setNeedPracticeCards([]);
        setIsFCModalOpen(false);
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
      }
    } finally {
      setIsGeneratingFC(false);
    }
  };

  // Flashcard Play Actions
  const handleCardResponse = (known: boolean) => {
    const card = flashcards[flashcardIndex];
    if (!known && card) {
      setNeedPracticeCards(prev => [...prev, card]);
    }

    setIsFlipped(false);
    if (flashcardIndex + 1 < flashcards.length) {
      setFlashcardIndex(prev => prev + 1);
    } else {
      setIsDeckFinished(true);
      addXP(20, 'Completed Flashcard Deck Session');
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    }
  };

  const handleRestartDeck = () => {
    setFlashcardIndex(0);
    setIsFlipped(false);
    setIsDeckFinished(false);
    setNeedPracticeCards([]);
  };

  const handleRetestWeakCards = () => {
    if (needPracticeCards.length === 0) return;
    setFlashcards(needPracticeCards);
    setFlashcardIndex(0);
    setIsFlipped(false);
    setIsDeckFinished(false);
    setNeedPracticeCards([]);
  };

  const currentCard = flashcards[flashcardIndex];

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-2 sm:p-4 animate-in fade-in">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-700/80 via-indigo-700/80 to-blue-800/80 p-6 sm:p-8 text-white shadow-xl border border-white/15 backdrop-blur-md">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md mb-2 border border-white/20">
            <Layers className="h-3.5 w-3.5" />
            <span>Spaced Repetition & Revision Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            AI Notes & Spaced Flashcards
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-purple-100 leading-relaxed">
            Generate high-yield CBSE revision notes, formula cheat sheets, and active-recall flashcard decks for <span className="font-bold text-white">{userClass}</span>.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('notes')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all backdrop-blur-sm cursor-pointer ${
                activeTab === 'notes'
                  ? 'bg-white text-purple-800 shadow-lg'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
              }`}
            >
              Study Notes ({notes.length})
            </button>
            <button
              onClick={() => setActiveTab('flashcards')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all backdrop-blur-sm cursor-pointer ${
                activeTab === 'flashcards'
                  ? 'bg-white text-purple-800 shadow-lg'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
              }`}
            >
              Spaced Flashcards ({flashcards.length})
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'notes' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Notes Sidebar Column */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="relative flex-1">
                <Search className="h-3.5 w-3.5 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search notes..."
                  className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-white/15 bg-white/5 text-slate-200 placeholder:text-slate-500 backdrop-blur-md focus:outline-none"
                />
              </div>

              <button
                id="btn-ai-generate-note"
                onClick={() => setIsGenModalOpen(true)}
                className="px-2.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1 shadow-md cursor-pointer shrink-0"
                title="AI Generate Note"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>AI Note</span>
              </button>

              <button
                id="btn-create-blank-note"
                onClick={handleCreateBlankNote}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all cursor-pointer shrink-0"
                title="Create Blank Note"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Notes List */}
            <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
              {filteredNotes.length === 0 ? (
                <div className="p-8 text-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] text-xs text-slate-400 space-y-2">
                  <p>Turn any chapter into smart revision notes.</p>
                  <button
                    onClick={() => setIsGenModalOpen(true)}
                    className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold cursor-pointer"
                  >
                    Generate First AI Note
                  </button>
                </div>
              ) : (
                filteredNotes.map(n => (
                  <div
                    key={n.id}
                    onClick={() => {
                      setActiveNote(n);
                      setIsEditing(false);
                    }}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all text-xs space-y-1 backdrop-blur-sm ${
                      activeNote?.id === n.id
                        ? 'border-purple-400 bg-purple-500/20 text-white shadow-md'
                        : 'border-white/10 bg-white/[0.04] hover:border-purple-400/50 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white truncate">
                        {n.title}
                      </span>
                      <span className="text-[10px] text-purple-300 font-semibold shrink-0">
                        {n.subject}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{n.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Note Editor / Viewer Column */}
          <div className="lg:col-span-8 space-y-4">
            {activeNote ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-5 shadow-xl shadow-indigo-950/20 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex-1 mr-4">
                    <input
                      type="text"
                      value={activeNote.title}
                      onChange={e => setActiveNote({ ...activeNote, title: e.target.value })}
                      className="text-base font-extrabold text-white bg-transparent border-none focus:outline-none w-full"
                    />
                    <span className="text-[11px] text-slate-400">
                      {activeNote.subject} • {activeNote.chapter}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyNote}
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                      title="Copy Note"
                    >
                      {copiedNote ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                    </button>

                    <button
                      onClick={handleSaveActiveNote}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Save</span>
                    </button>

                    <button
                      onClick={() => handleDeleteNote(activeNote.id)}
                      className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                      title="Delete Note"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <textarea
                  value={activeNote.content}
                  onChange={e => setActiveNote({ ...activeNote, content: e.target.value })}
                  rows={14}
                  className="w-full text-xs sm:text-[13px] p-3.5 rounded-xl border border-white/15 bg-white/5 text-slate-200 leading-relaxed font-mono focus:outline-none focus:ring-2 focus:ring-purple-400 backdrop-blur-md"
                />

                {/* AI Action Integrations */}
                <div className="pt-3 border-t border-white/10 flex flex-wrap gap-2">
                  <button
                    onClick={handleConvertNoteToFlashcards}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5 hover:bg-purple-500/30 backdrop-blur-sm transition-all cursor-pointer"
                  >
                    <Layers className="h-3.5 w-3.5" />
                    <span>Convert to Active Flashcards</span>
                  </button>

                  {onStartQuizFromNotes && (
                    <button
                      onClick={() => onStartQuizFromNotes(activeNote.content)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1.5 hover:bg-blue-500/30 backdrop-blur-sm transition-all cursor-pointer"
                    >
                      <Award className="h-3.5 w-3.5" />
                      <span>Generate Quiz from this Note</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[350px] rounded-2xl border-2 border-dashed border-white/15 flex flex-col items-center justify-center p-8 text-center text-slate-400 text-xs space-y-3">
                <StickyNote className="h-8 w-8 text-purple-400/50" />
                <p>Turn any chapter into structured revision notes.</p>
                <button
                  onClick={() => setIsGenModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer"
                >
                  Generate First AI Note
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Flashcards Player Section */
        <div className="max-w-2xl mx-auto space-y-5">
          {/* Deck Action Bar */}
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Interactive Spaced Recall Deck
            </h3>
            <button
              onClick={() => setIsFCModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Generate New AI Deck</span>
            </button>
          </div>

          {!isDeckFinished && currentCard ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                <span>
                  Card {flashcardIndex + 1} of {flashcards.length}
                </span>
                <span>
                  {currentCard.subject} • {currentCard.chapter}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-purple-400 h-full rounded-full transition-all"
                  style={{ width: `${((flashcardIndex + 1) / flashcards.length) * 100}%` }}
                />
              </div>

              {/* 3D Flip Card Container */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="min-h-[260px] rounded-3xl border border-white/15 bg-white/[0.06] backdrop-blur-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer shadow-2xl hover:border-purple-400/50 transition-all select-none space-y-4"
              >
                <span className="text-[10px] uppercase font-bold text-purple-300 bg-purple-500/20 px-2.5 py-0.5 rounded-full border border-purple-500/30">
                  {isFlipped ? 'Answer & Explanation' : 'Question / Prompt (Tap to Flip)'}
                </span>

                <p className="text-base sm:text-lg font-bold text-white leading-relaxed max-w-lg">
                  {isFlipped ? currentCard.back : currentCard.front}
                </p>

                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <RotateCw className="h-3.5 w-3.5" />
                  <span>Click anywhere to flip</span>
                </span>
              </div>

              {/* Know vs Need Practice Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => handleCardResponse(false)}
                  className="py-3 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/30 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4 text-amber-400" />
                  <span>Need Practice</span>
                </button>

                <button
                  onClick={() => handleCardResponse(true)}
                  className="py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
                >
                  <Check className="h-4 w-4" />
                  <span>I Know This (+20 XP)</span>
                </button>
              </div>
            </div>
          ) : isDeckFinished ? (
            /* End of Deck Session Summary */
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-8 text-center space-y-5 shadow-2xl animate-in fade-in">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="h-6 w-6" />
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-white">
                  Flashcard Session Completed!
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  You reviewed all {flashcards.length} cards in this deck.
                </p>
              </div>

              {/* Topics to Revise Again */}
              {needPracticeCards.length > 0 ? (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-left space-y-2">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                    Topics to Revise Again ({needPracticeCards.length} Cards Flagged):
                  </span>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {needPracticeCards.map((c, i) => (
                      <li key={i} className="truncate">
                        • {c.front}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={handleRetestWeakCards}
                    className="mt-2 w-full py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    Re-test Weak Cards Only
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-200 text-xs">
                  🎉 Perfect recall! You mastered 100% of this deck's concepts.
                </div>
              )}

              <div className="flex gap-2 justify-center pt-2">
                <button
                  onClick={handleRestartDeck}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 transition-all cursor-pointer"
                >
                  Restart Full Deck
                </button>
                <button
                  onClick={() => setIsFCModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Generate Another Deck
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl border-2 border-dashed border-white/15 bg-white/[0.02] text-xs text-slate-400 space-y-3">
              <Layers className="h-8 w-8 text-purple-400/50 mx-auto" />
              <p>No active flashcard deck loaded.</p>
              <button
                onClick={() => setIsFCModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer"
              >
                Generate First Flashcard Deck
              </button>
            </div>
          )}
        </div>
      )}

      {/* AI Note Generator Modal */}
      {isGenModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl border border-white/15 bg-slate-900/90 backdrop-blur-2xl shadow-2xl p-6 space-y-5 text-white">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-white/10">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span>Generate CBSE Study Notes with AI</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Subject:</label>
                <select
                  value={genSubject}
                  onChange={e => {
                    setGenSubject(e.target.value);
                    const chs = getChaptersForSubject(userClass, e.target.value);
                    if (chs.length > 0) setGenChapter(chs[0].title);
                  }}
                  className="w-full p-2.5 rounded-xl border border-white/15 bg-slate-900 text-white focus:outline-none"
                >
                  {availableCurriculum.map(s => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Chapter:</label>
                <select
                  value={genChapter}
                  onChange={e => setGenChapter(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-white/15 bg-slate-900 text-white focus:outline-none"
                >
                  {genChapters.map(c => (
                    <option key={c.id} value={c.title}>
                      Ch {c.number}: {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Note Type:</label>
                <select
                  value={genFormat}
                  onChange={e => setGenFormat(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-white/15 bg-slate-900 text-white focus:outline-none"
                >
                  {NOTE_FORMATS.map(f => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {genError && (
              <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
                {genError}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsGenModalOpen(false)}
                className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleGenerateAINote}
                disabled={isGeneratingNote}
                className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50"
              >
                {isGeneratingNote ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Writing Note...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Generate Note</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Flashcards Generator Modal */}
      {isFCModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl border border-white/15 bg-slate-900/90 backdrop-blur-2xl shadow-2xl p-6 space-y-5 text-white">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-white/10">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span>Generate Flashcards Deck with AI</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Subject:</label>
                <select
                  value={fcSubject}
                  onChange={e => {
                    setFcSubject(e.target.value);
                    const chs = getChaptersForSubject(userClass, e.target.value);
                    if (chs.length > 0) setFcChapter(chs[0].title);
                  }}
                  className="w-full p-2.5 rounded-xl border border-white/15 bg-slate-900 text-white focus:outline-none"
                >
                  {availableCurriculum.map(s => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Chapter:</label>
                <select
                  value={fcChapter}
                  onChange={e => setFcChapter(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-white/15 bg-slate-900 text-white focus:outline-none"
                >
                  {fcChapters.map(c => (
                    <option key={c.id} value={c.title}>
                      Ch {c.number}: {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Cards Count:</label>
                  <select
                    value={fcCount}
                    onChange={e => setFcCount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-white/15 bg-slate-900 text-white focus:outline-none"
                  >
                    <option value={5}>5 Flashcards</option>
                    <option value={8}>8 Flashcards</option>
                    <option value={10}>10 Flashcards</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Difficulty:</label>
                  <select
                    value={fcDifficulty}
                    onChange={e => setFcDifficulty(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-white/15 bg-slate-900 text-white focus:outline-none"
                  >
                    <option value="Easy">Foundation</option>
                    <option value="Medium">Standard</option>
                    <option value="Hard">Exemplar</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsFCModalOpen(false)}
                className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleGenerateAIFlashcards}
                disabled={isGeneratingFC}
                className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50 cursor-pointer"
              >
                {isGeneratingFC ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Creating Deck...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Create Deck</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
