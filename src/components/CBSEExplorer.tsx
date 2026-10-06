import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  AlertCircle,
  HelpCircle,
  Award,
  ChevronRight,
  Sparkles,
  Camera,
  Zap,
  X,
  Loader2,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { CBSE_CLASSES, getCurriculumByClass, ChapterData } from '../lib/cbseData';
import { useAuth } from '../context/AuthContext';
import { aiService } from '../lib/aiService';

interface CBSEExplorerProps {
  onStartQuiz: (subject: string, chapter: string) => void;
  onAskTutor: (subject: string, chapter: string) => void;
  onScanHomework: (subject: string, chapter: string) => void;
}

export const CBSEExplorer: React.FC<CBSEExplorerProps> = ({
  onStartQuiz,
  onAskTutor,
  onScanHomework
}) => {
  const { user } = useAuth();
  const [selectedClass, setSelectedClass] = useState<string>(user?.classLevel || 'Class 9');
  const subjects = getCurriculumByClass(selectedClass, user?.subjects);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || 'science-9');
  const [selectedChapter, setSelectedChapter] = useState<ChapterData | null>(null);
  const [chapterStatuses, setChapterStatuses] = useState<Record<string, string>>({});

  // 15-Minute Revision Modal state
  const [isRevisionOpen, setIsRevisionOpen] = useState<boolean>(false);
  const [isLoadingRevision, setIsLoadingRevision] = useState<boolean>(false);
  const [revisionData, setRevisionData] = useState<any>(null);

  const activeSubject = subjects.find(s => s.id === selectedSubjectId) || subjects[0];

  const updateStatus = (chId: string, status: string) => {
    setChapterStatuses(prev => ({ ...prev, [chId]: status }));
  };

  const handleOpenRevision = async () => {
    if (!selectedChapter) return;
    setIsRevisionOpen(true);
    setIsLoadingRevision(true);
    try {
      const res = await aiService.generateQuickRevision({
        subject: activeSubject.name,
        chapter: selectedChapter.title,
        classLevel: selectedClass
      });
      if (res.success && res.revision) {
        setRevisionData(res.revision);
      }
    } catch (e) {
      console.error('Failed to generate quick revision:', e);
    } finally {
      setIsLoadingRevision(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-2 sm:p-4 animate-in fade-in">
      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-700/80 via-indigo-700/80 to-cyan-800/80 p-6 sm:p-8 text-white shadow-xl border border-white/15 backdrop-blur-md">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md mb-2 border border-white/20">
            <BookOpen className="h-3.5 w-3.5" />
            <span>NCERT-Aligned Learning Progression</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            CBSE Curriculum Explorer (Classes 1–12)
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-blue-100 leading-relaxed">
            Navigate through official CBSE syllabus chapters. Read high-yield NCERT notes, verify key formulas, review board exam questions, and track your revision mastery.
          </p>
        </div>
      </div>

      {/* Class Level Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {CBSE_CLASSES.map(cls => (
          <button
            key={cls}
            onClick={() => {
              setSelectedClass(cls);
              const newSubs = getCurriculumByClass(cls, user?.subjects);
              if (newSubs.length > 0) setSelectedSubjectId(newSubs[0].id);
              setSelectedChapter(null);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all backdrop-blur-sm ${
              selectedClass === cls
                ? 'bg-blue-600 text-white shadow-md border border-white/20'
                : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
            }`}
          >
            {cls}
          </button>
        ))}
      </div>

      {/* Subject Selector */}
      <div className="flex flex-wrap gap-2.5">
        {subjects.map(s => (
          <button
            key={s.id}
            onClick={() => {
              setSelectedSubjectId(s.id);
              setSelectedChapter(null);
            }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 backdrop-blur-sm ${
              selectedSubjectId === s.id
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/20 border border-white/20'
                : 'bg-white/5 border border-white/10 text-slate-300 hover:border-blue-400/50 hover:bg-white/10'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>{s.name}</span>
          </button>
        ))}
      </div>

      {/* Chapter Cards and Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chapters List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              {activeSubject?.name} Chapters ({activeSubject?.chapters.length})
            </h3>
          </div>

          <div className="space-y-2.5">
            {activeSubject?.chapters.map(ch => {
              const status = chapterStatuses[ch.id] || 'Not Started';
              const isSelected = selectedChapter?.id === ch.id;

              return (
                <div
                  key={ch.id}
                  onClick={() => setSelectedChapter(ch)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all text-xs space-y-2 backdrop-blur-md ${
                    isSelected
                      ? 'border-blue-500/60 bg-blue-600/20 ring-2 ring-blue-500/30'
                      : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-white">
                      Chapter {ch.number}: {ch.title}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        status === 'Completed'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : status === 'In Progress'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : status === 'Needs Revision'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-white/10 text-slate-400 border border-white/10'
                      }`}
                    >
                      {status}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2">{ch.summary}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chapter Deep Dive */}
        <div className="lg:col-span-7 space-y-4">
          {selectedChapter ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-5 shadow-xl shadow-indigo-950/20 space-y-5 animate-in fade-in">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
                <div>
                  <span className="text-[11px] font-bold text-blue-400">
                    Chapter {selectedChapter.number} • {activeSubject.name}
                  </span>
                  <h2 className="text-base font-extrabold text-white">
                    {selectedChapter.title}
                  </h2>
                </div>

                {/* Status Toggle Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">Status:</span>
                  <select
                    value={chapterStatuses[selectedChapter.id] || 'Not Started'}
                    onChange={e => updateStatus(selectedChapter.id, e.target.value)}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-white/15 bg-slate-900/80 text-slate-200 backdrop-blur-md"
                  >
                    <option value="Not Started" className="bg-slate-900 text-slate-200">Not Started</option>
                    <option value="In Progress" className="bg-slate-900 text-slate-200">In Progress</option>
                    <option value="Completed" className="bg-slate-900 text-slate-200">Completed</option>
                    <option value="Needs Revision" className="bg-slate-900 text-slate-200">Needs Revision</option>
                  </select>
                </div>
              </div>

              {/* Core Concepts */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-blue-400" />
                  <span>Key NCERT Principles & Definitions:</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-200">
                  {selectedChapter.concepts.map((c, i) => (
                    <li key={i} className="p-2.5 rounded-xl bg-white/5 border border-white/10 leading-relaxed backdrop-blur-sm">
                      {c}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Formulas if applicable */}
              {selectedChapter.formulas && selectedChapter.formulas.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-indigo-300">
                    Essential Formulas & Equations:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedChapter.formulas.map((f, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-200 font-mono text-xs font-bold backdrop-blur-sm"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Important Board Questions */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-200">
                  High Probability CBSE Questions:
                </h4>
                <div className="space-y-1.5 text-xs text-slate-300">
                  {selectedChapter.importantQuestions.map((q, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2 backdrop-blur-sm">
                      <span className="font-bold text-blue-400">Q{i + 1}.</span>
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions for this chapter */}
              <div className="pt-3 border-t border-white/10 flex flex-wrap gap-2">
                <button
                  onClick={handleOpenRevision}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-md flex items-center gap-1.5 transition-all cursor-pointer font-extrabold"
                >
                  <Zap className="h-3.5 w-3.5 fill-slate-950" />
                  <span>⚡ 15-Min Quick Revision</span>
                </button>

                <button
                  onClick={() => onStartQuiz(activeSubject.name, selectedChapter.title)}
                  className="px-3 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Award className="h-3.5 w-3.5" />
                  <span>Start Practice Quiz</span>
                </button>

                <button
                  onClick={() => onAskTutor(activeSubject.name, selectedChapter.title)}
                  className="px-3 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                  <span>Ask AI Tutor</span>
                </button>

                <button
                  onClick={() => onScanHomework(activeSubject.name, selectedChapter.title)}
                  className="px-3 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Camera className="h-3.5 w-3.5" />
                  <span>Scan Homework on this</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[350px] rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center p-8 text-center bg-white/[0.02] backdrop-blur-md">
              <BookOpen className="h-10 w-10 text-blue-400 mb-3" />
              <h3 className="text-xs font-bold text-white">
                Select a Chapter to Explore
              </h3>
              <p className="text-[11px] text-slate-400 max-w-xs mt-1">
                Choose any chapter on the left to read NCERT definitions, test your understanding, or ask the AI tutor.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 15-Minute Revision Modal */}
      {isRevisionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl rounded-3xl border border-white/15 bg-slate-900/95 backdrop-blur-2xl shadow-2xl p-6 sm:p-7 space-y-5 text-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300">
                  <Zap className="h-5 w-5 fill-amber-400" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    ⚡ 15-Minute CBSE Quick Revision
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {selectedClass} • {activeSubject?.name} ({selectedChapter?.title})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsRevisionOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {isLoadingRevision ? (
              <div className="py-12 text-center space-y-3">
                <Loader2 className="h-8 w-8 text-amber-400 animate-spin mx-auto" />
                <p className="text-xs text-slate-300">
                  Synthesizing key formulas, definitions & exam pitfalls for {selectedChapter?.title}...
                </p>
              </div>
            ) : revisionData ? (
              <div className="space-y-4 text-xs">
                {/* Key Concepts */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>5 High-Yield Concepts:</span>
                  </h4>
                  <div className="space-y-2">
                    {revisionData.keyConcepts?.map((kc: any, i: number) => (
                      <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                        <span className="font-bold text-white block">{kc.title}</span>
                        <p className="text-slate-300 leading-relaxed text-[11px]">{kc.summary}</p>
                        {kc.formula && (
                          <span className="inline-block px-2.5 py-1 rounded-md bg-indigo-500/15 border border-indigo-500/30 text-indigo-200 font-mono text-[10px]">
                            {kc.formula}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Common Pitfalls & Mistakes */}
                {revisionData.commonMistakes && revisionData.commonMistakes.length > 0 && (
                  <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/25 space-y-2">
                    <span className="font-bold text-red-300 text-[11px] uppercase tracking-wider block">
                      ⚠️ Common Board Exam Mistakes to Avoid:
                    </span>
                    <div className="space-y-1.5">
                      {revisionData.commonMistakes.map((cm: any, i: number) => (
                        <div key={i} className="text-[11px] text-slate-200">
                          <strong className="text-red-200">Mistake:</strong> {cm.mistake}
                          <br />
                          <strong className="text-emerald-300">Correction:</strong> {cm.correction}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Important Exam Questions & Answer Keys */}
                {revisionData.cbseExamQuestions && revisionData.cbseExamQuestions.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
                      <span>Important Board Questions & Marking Keys:</span>
                    </h4>
                    <div className="space-y-2">
                      {revisionData.cbseExamQuestions.map((eq: any, i: number) => (
                        <div key={i} className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 space-y-1 text-[11px]">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white">Q: {eq.question}</span>
                            <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-bold text-[10px]">
                              {eq.marks} Mark{eq.marks > 1 ? 's' : ''}
                            </span>
                          </div>
                          <p className="text-slate-300">
                            <strong className="text-emerald-300">Answer Key: </strong>
                            {eq.answerKey}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            <div className="pt-2 flex items-center justify-between border-t border-white/10">
              <button
                onClick={() => {
                  setIsRevisionOpen(false);
                  if (selectedChapter) {
                    onStartQuiz(activeSubject.name, selectedChapter.title);
                  }
                }}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Award className="h-3.5 w-3.5" />
                <span>Take 5-Question Mini Quiz</span>
              </button>

              <button
                onClick={() => setIsRevisionOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
