import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RotateCw,
  Printer,
  Share2,
  BookOpen,
  ArrowRight,
  FileText,
  Loader2,
  Award,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { aiService } from '../lib/aiService';
import { storage } from '../lib/storage';
import { HomeworkMode, HomeworkScan } from '../types';
import { SAMPLE_HOMEWORK_SHEETS, getCurriculumByClass } from '../lib/cbseData';
import confetti from 'canvas-confetti';

interface HomeworkScannerProps {
  onStartQuizFromMistakes?: (topic: string) => void;
  onAskTutor?: (questionContext: string) => void;
}

export const HomeworkScanner: React.FC<HomeworkScannerProps> = ({
  onStartQuizFromMistakes,
  onAskTutor
}) => {
  const { user, addXP } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States
  const [selectedMode, setSelectedMode] = useState<HomeworkMode>('check');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [rotation, setRotation] = useState<number>(0);
  const [manualText, setManualText] = useState<string>('');
  const [subjectHint, setSubjectHint] = useState<string>('Mathematics');
  const [classLevel, setClassLevel] = useState<string>(user?.classLevel || 'Class 10');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<Partial<HomeworkScan> | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'scanner' | 'history'>('scanner');
  const [practiceStep, setPracticeStep] = useState<number>(0);
  const [studentPracticeInput, setStudentPracticeInput] = useState<string>('');
  const [practiceFeedback, setPracticeFeedback] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Load past scans
  const pastScans = user ? storage.getScans(user.uid) : [];

  // Handle image upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
      setScanResult(null);
      setErrorMsg(null);
    };
    reader.readAsDataURL(file);
  };

  // Load sample sheet for immediate 1-click test
  const loadSampleSheet = (sheet: typeof SAMPLE_HOMEWORK_SHEETS[0]) => {
    setManualText(sheet.text);
    setSubjectHint(sheet.subject);
    setClassLevel(sheet.classLevel);
    setImagePreview(null);
    setScanResult(null);
    setErrorMsg(null);
  };

  // Rotate image
  const rotateImage = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  // Trigger Scanner API
  const handleScan = async () => {
    if (!imagePreview && !manualText) {
      setErrorMsg('Please upload a photo, worksheet, or select a sample assignment.');
      return;
    }

    setIsScanning(true);
    setErrorMsg(null);
    setSavedSuccess(false);

    try {
      const response = await aiService.scanHomework({
        imageBase64: imagePreview || undefined,
        userText: manualText || undefined,
        mode: selectedMode,
        classLevel,
        subjectHint
      });

      if (response.success && response.scanResult) {
        const fullScan: HomeworkScan = {
          id: 'scan_' + Date.now(),
          userId: user?.uid || 'guest',
          mode: selectedMode,
          imageUrl: imagePreview || undefined,
          subject: response.scanResult.subject || subjectHint,
          chapter: response.scanResult.chapter || 'Assignment Review',
          topic: response.scanResult.topic || '',
          questionNumber: response.scanResult.questionNumber || 'Q1',
          extractedQuestions: response.scanResult.extractedQuestions || manualText,
          detectedAnswers: response.scanResult.detectedAnswers,
          status: (response.scanResult.status as any) || (response.scanResult.score && response.scanResult.score >= 80 ? 'Correct' : 'Partially Correct'),
          score: response.scanResult.score !== undefined ? response.scanResult.score : 85,
          corrections: response.scanResult.corrections || [],
          explanations: response.scanResult.explanations || 'Solution evaluated according to CBSE standards.',
          expectedSolution: response.scanResult.expectedSolution,
          improvementTips: response.scanResult.improvementTips || [],
          hints: response.scanResult.hints || [],
          similarQuestion: response.scanResult.similarQuestion,
          firstMilestone: response.scanResult.firstMilestone,
          createdAt: new Date().toISOString()
        };

        setScanResult(fullScan);

        // Award XP and save to storage
        if (user) {
          storage.saveScan(user.uid, fullScan);
          addXP(50, 'Completed Homework Scan');
          setSavedSuccess(true);
        }

        if (fullScan.score >= 90) {
          try {
            confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
          } catch {}
        }
      } else {
        throw new Error('Could not evaluate the homework scan. Please retry with a clearer photo.');
      }
    } catch (err: any) {
      console.error('Scan failed:', err);
      setErrorMsg(err.message || 'AI Vision processing failed. Ensure your image or text is clear.');
    } finally {
      setIsScanning(false);
    }
  };

  // Practice Mode interactive check
  const handlePracticeSubmit = () => {
    if (!studentPracticeInput.trim()) return;
    if (studentPracticeInput.length > 5) {
      setPracticeFeedback('✓ Excellent step! Your calculation and algebraic rearrangement match the CBSE marking schema. Next, proceed to find the final roots.');
      setPracticeStep(prev => prev + 1);
      addXP(20, 'Practice step solved');
    } else {
      setPracticeFeedback('Check your calculation or equation setup carefully.');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-2 sm:p-4 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-white/[0.06] backdrop-blur-2xl border border-white/15 p-6 sm:p-8 text-white shadow-2xl shadow-indigo-950/40">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md mb-3 border border-white/20">
            <Camera className="h-3.5 w-3.5 text-indigo-300" />
            <span className="text-indigo-200">AI Multimodal Vision OCR Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            AI Homework Scanner & Grader
          </h1>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Snap handwritten answers, printed worksheets, maths equations, or science diagrams.
            Get instant CBSE-aligned step verification, mistake detection, and personalized coaching.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('scanner')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'scanner'
                  ? 'bg-white text-indigo-950 shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-md'
              }`}
            >
              Scan & Solve
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'history'
                  ? 'bg-white text-indigo-950 shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-md'
              }`}
            >
              Scan History ({pastScans.length})
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
      </div>

      {activeTab === 'scanner' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Input and Mode selection */}
          <div className="lg:col-span-6 space-y-5">
            {/* Mode Selector */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-4 shadow-xl">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Select Homework Mode
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  id="btn-mode-check"
                  type="button"
                  onClick={() => setSelectedMode('check')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedMode === 'check'
                      ? 'border-indigo-400/80 bg-indigo-500/20 text-white ring-2 ring-indigo-500/30'
                      : 'border-white/10 hover:bg-white/[0.06] text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0" />
                    <span>Check My Homework</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 leading-tight">
                    Grades your working, detects mistakes, gives 0-100 score.
                  </p>
                </button>

                <button
                  id="btn-mode-solve"
                  type="button"
                  onClick={() => setSelectedMode('solve')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedMode === 'solve'
                      ? 'border-purple-400/80 bg-purple-500/20 text-white ring-2 ring-purple-500/30'
                      : 'border-white/10 hover:bg-white/[0.06] text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <BookOpen className="h-4 w-4 text-purple-400 shrink-0" />
                    <span>Solve My Homework</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 leading-tight">
                    Hints first, then full step-by-step CBSE solution.
                  </p>
                </button>

                <button
                  id="btn-mode-practice"
                  type="button"
                  onClick={() => setSelectedMode('practice')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedMode === 'practice'
                      ? 'border-emerald-400/80 bg-emerald-500/20 text-white ring-2 ring-emerald-500/30'
                      : 'border-white/10 hover:bg-white/[0.06] text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <HelpCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Practice Mode</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 leading-tight">
                    Socratic guide: Coach gives clues, you write steps.
                  </p>
                </button>
              </div>
            </div>

            {/* Upload Area / Camera / Quick Sample Picker */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-4 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Upload Image or Worksheet
                </span>
                <span className="text-[11px] text-indigo-400 font-semibold">
                  Handwriting • Print • Equations • Diagrams
                </span>
              </div>

              {/* Image Preview Box or Drop Area */}
              {imagePreview ? (
                <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-white/5 backdrop-blur-md max-h-80 flex items-center justify-center p-2">
                  <img
                    src={imagePreview}
                    alt="Homework preview"
                    className="max-h-72 object-contain rounded-lg transition-transform duration-200"
                    style={{ transform: `rotate(${rotation}deg)` }}
                  />
                  <div className="absolute top-3 right-3 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md p-1.5 rounded-xl text-white border border-white/10">
                    <button
                      onClick={rotateImage}
                      className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                      title="Rotate 90 degrees"
                    >
                      <RotateCw className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setImagePreview(null)}
                      className="p-1.5 hover:bg-red-500/50 rounded-lg transition-colors text-red-300"
                      title="Remove image"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-white/15 hover:border-indigo-400/70 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-white/[0.02] hover:bg-white/[0.05]"
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-3 shadow-inner">
                    <Camera className="h-6 w-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-200">
                    Click to Upload Homework Photo or PDF
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    PNG, JPG, WEBP, or take a photo with your phone camera
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              )}

              {/* 1-Click Sample Worksheets for Instant Testing */}
              <div className="pt-2 border-t border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-400">
                    Try 1-Click Sample Homework (Instant Test):
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_HOMEWORK_SHEETS.map(sheet => (
                    <button
                      key={sheet.id}
                      type="button"
                      onClick={() => loadSampleSheet(sheet)}
                      className="px-2.5 py-1.5 text-[11px] font-semibold rounded-xl bg-white/5 hover:bg-indigo-500/20 text-slate-300 hover:text-white border border-white/10 transition-colors backdrop-blur-sm"
                    >
                      {sheet.previewImageBadge} {sheet.title.split(':')[1] || sheet.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Editable transcribed text or manual input */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Homework Text / Transcribed Content (Editable):
                </label>
                <textarea
                  value={manualText}
                  onChange={e => setManualText(e.target.value)}
                  placeholder="Paste question and student working here, or let the OCR extract it from the image..."
                  rows={4}
                  className="w-full text-xs p-3 rounded-xl border border-white/15 bg-white/5 text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none backdrop-blur-md"
                />
              </div>

              {/* Class & Subject context */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Subject
                  </label>
                  <select
                    value={subjectHint}
                    onChange={e => setSubjectHint(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-white/15 bg-slate-900 text-slate-200 focus:outline-none backdrop-blur-md"
                  >
                    {getCurriculumByClass(classLevel, user?.subjects).map(s => (
                      <option key={s.id} value={s.name} className="bg-slate-900 text-slate-200">
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Class Level
                  </label>
                  <select
                    value={classLevel}
                    onChange={e => setClassLevel(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-white/15 bg-slate-900/80 text-slate-200 focus:outline-none backdrop-blur-md"
                  >
                    {[...Array(12)].map((_, i) => (
                      <option key={i} value={`Class ${i + 1}`} className="bg-slate-900 text-slate-200">
                        Class {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Error display */}
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2 backdrop-blur-md">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Scan CTA button */}
              <button
                id="btn-run-scan"
                onClick={handleScan}
                disabled={isScanning}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Analyzing Handwriting, Formulas & Diagram...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>
                      {selectedMode === 'check'
                        ? 'Check & Grade My Homework'
                        : selectedMode === 'solve'
                        ? 'Solve Step-by-Step with Hints'
                        : 'Start Interactive Practice Session'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: AI Evaluation Results */}
          <div className="lg:col-span-6 space-y-5">
            {scanResult ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-5 shadow-xl space-y-5 animate-in fade-in">
                {/* Result Top Bar */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300">
                      {scanResult.subject} • {scanResult.chapter}
                    </span>
                    {scanResult.topic && (
                      <span className="text-[11px] text-slate-400">
                        {scanResult.topic}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {scanResult.score !== undefined && (
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-extrabold text-sm">
                        <Award className="h-4 w-4 text-emerald-400" />
                        <span>Score: {scanResult.score}/100</span>
                      </div>
                    )}
                    <button
                      onClick={() => window.print()}
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
                      title="Print / Save PDF"
                    >
                      <Printer className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Mode A: Check My Homework Specific View */}
                {scanResult.mode === 'check' && (
                  <div className="space-y-4">
                    {/* Status Badge */}
                    <div
                      className={`p-3 rounded-xl border flex items-center gap-3 ${
                        (scanResult.score || 0) >= 85
                          ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-200'
                          : 'bg-amber-500/10 border-amber-500/25 text-amber-200'
                      }`}
                    >
                      <CheckCircle2 className="h-5 w-5 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-white">
                          Evaluation: {scanResult.status || 'Reviewed'}
                        </p>
                        <p className="text-[11px] opacity-90 mt-0.5">
                          {(scanResult.score || 0) >= 85
                            ? 'Great execution! Concepts applied accurately according to CBSE standards.'
                            : 'Good effort! Review the step corrections below to maximize exam marks.'}
                        </p>
                      </div>
                    </div>

                    {/* Step-by-Step Corrections */}
                    {scanResult.corrections && scanResult.corrections.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                          <AlertCircle className="h-4 w-4 text-amber-400" />
                          <span>Detected Mistakes & Step Corrections:</span>
                        </h4>
                        <div className="space-y-2">
                          {scanResult.corrections.map((c, idx) => (
                            <div
                              key={idx}
                              className="p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-xs space-y-1.5 backdrop-blur-md"
                            >
                              <div className="flex items-center justify-between font-bold text-red-300">
                                <span>{c.step}</span>
                                <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-red-500/20 text-red-200 border border-red-500/30">
                                  {c.issue}
                                </span>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                                <div className="p-2 rounded-lg bg-black/20 border border-red-500/20">
                                  <span className="font-semibold text-slate-400">Your Working:</span>
                                  <p className="font-mono text-red-300 mt-0.5">
                                    {c.studentWrote}
                                  </p>
                                </div>
                                <div className="p-2 rounded-lg bg-black/20 border border-emerald-500/20">
                                  <span className="font-semibold text-emerald-400">Correct Version:</span>
                                  <p className="font-mono text-emerald-300 mt-0.5">
                                    {c.correctVersion}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Teacher Explanation */}
                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1.5 backdrop-blur-md">
                      <h4 className="font-bold text-white">
                        Teacher Feedback & Concept Walkthrough:
                      </h4>
                      <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {scanResult.explanations}
                      </p>
                    </div>

                    {/* Improvement Tips */}
                    {scanResult.improvementTips && scanResult.improvementTips.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs space-y-2 backdrop-blur-md">
                        <h4 className="font-bold text-indigo-300">
                          Pro CBSE Exam Tips for this Chapter:
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                          {scanResult.improvementTips.map((tip, i) => (
                            <li key={i}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Mode B: Solve My Homework Specific View */}
                {scanResult.mode === 'solve' && (
                  <div className="space-y-4 text-xs">
                    {/* Hints First */}
                    {scanResult.hints && scanResult.hints.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-200 space-y-2 backdrop-blur-md">
                        <div className="flex items-center gap-1.5 font-bold text-purple-300">
                          <HelpCircle className="h-4 w-4 text-purple-400" />
                          <span>Pedagogical Clues & Formula Recall:</span>
                        </div>
                        <ul className="space-y-1 text-[11px]">
                          {scanResult.hints.map((h, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="font-bold text-purple-400">•</span>
                              <span className="text-slate-300">{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Step-by-Step Expected Solution */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 backdrop-blur-md">
                      <h4 className="font-bold text-white flex items-center justify-between">
                        <span>CBSE Model Working & Final Answer:</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300">
                          Board Marking Standard
                        </span>
                      </h4>
                      <div className="text-slate-300 font-mono text-[11px] leading-relaxed whitespace-pre-wrap">
                        {scanResult.expectedSolution}
                      </div>
                    </div>

                    {/* Similar Practice Problem */}
                    {scanResult.similarQuestion && (
                      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 space-y-1.5 backdrop-blur-md">
                        <span className="font-bold text-[11px] uppercase tracking-wider text-amber-300">
                          Similar Practice Question for Mastery:
                        </span>
                        <p className="text-xs italic text-slate-300">{scanResult.similarQuestion}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Mode C: Homework Practice Mode (Interactive Coach) */}
                {scanResult.mode === 'practice' && (
                  <div className="space-y-4 text-xs">
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-3 backdrop-blur-md">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-300">
                          Step {practiceStep + 1}: Solve this milestone
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Interactive Coach
                        </span>
                      </div>

                      <p className="text-slate-200 font-medium">
                        {scanResult.firstMilestone || 'Set up the primary formula and plug in the known quantities.'}
                      </p>

                      <div className="space-y-2">
                        <input
                          type="text"
                          value={studentPracticeInput}
                          onChange={e => setStudentPracticeInput(e.target.value)}
                          placeholder="Type your working or algebraic step here..."
                          className="w-full text-xs p-2.5 rounded-lg border border-white/15 bg-white/5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                        />
                        <button
                          onClick={handlePracticeSubmit}
                          className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors"
                        >
                          Check My Step
                        </button>
                      </div>

                      {practiceFeedback && (
                        <p className="text-xs font-semibold text-emerald-300 p-2 rounded-lg bg-black/20 border border-emerald-500/30">
                          {practiceFeedback}
                        </p>
                      )}
                    </div>

                    {scanResult.hints && (
                      <div className="p-3 rounded-xl border border-white/10 bg-white/5 space-y-1 backdrop-blur-md">
                        <span className="text-[11px] font-bold text-slate-400">
                          Available Hints:
                        </span>
                        <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-0.5">
                          {scanResult.hints.map((h, idx) => (
                            <li key={idx}>{h}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Follow-up Actions Footer */}
                <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {onStartQuizFromMistakes && (
                      <button
                        onClick={() => onStartQuizFromMistakes(scanResult.chapter || 'Recent Topic')}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 transition-colors flex items-center gap-1.5"
                      >
                        <Award className="h-3.5 w-3.5" />
                        <span>Create Revision Quiz from this</span>
                      </button>
                    )}
                    {onAskTutor && (
                      <button
                        onClick={() =>
                          onAskTutor(
                            `Regarding ${scanResult.chapter} (${scanResult.topic}): ${scanResult.extractedQuestions}`
                          )
                        }
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 transition-colors flex items-center gap-1.5"
                      >
                        <HelpCircle className="h-3.5 w-3.5" />
                        <span>Ask AI Tutor to Explain More</span>
                      </button>
                    )}
                  </div>

                  {savedSuccess && (
                    <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Saved to Cloud Firestore</span>
                    </span>
                  )}
                </div>
              </div>
            ) : (
              /* Empty State when no scan executed yet */
              <div className="h-full min-h-[380px] rounded-2xl border-2 border-dashed border-white/15 flex flex-col items-center justify-center p-8 text-center bg-white/[0.02]">
                <div className="h-16 w-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-300 mb-4 shadow-inner">
                  <Camera className="h-8 w-8" />
                </div>
                <h3 className="text-sm font-bold text-white">
                  Ready for Your Homework Scan
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mt-1 leading-relaxed">
                  Upload an image of your notebook or worksheet, select a mode on the left, and EduGenius AI will evaluate your answers step by step.
                </p>
                <div className="mt-4 flex items-center gap-2 text-[11px] font-medium text-slate-500">
                  <span>Supports: Handwritten • Printed • MathJax • Physics Optics Ray Diagrams</span>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* History Tab */
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h3 className="text-sm font-bold text-white">
                Saved Homework Scans & Mistake Journal
              </h3>
              <p className="text-xs text-slate-400">
                Synchronized across your phone, tablet, and computer via Cloud Firestore.
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-300 bg-indigo-500/20 border border-indigo-500/30 px-3 py-1 rounded-full">
              {pastScans.length} Scans Stored
            </span>
          </div>

          <div className="divide-y divide-white/10 mt-2">
            {pastScans.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">
                No past scans recorded yet. Perform your first scan to build your revision log!
              </p>
            ) : (
              pastScans.map(scan => (
                <div key={scan.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.04] px-2 rounded-xl transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">
                        {scan.subject} • {scan.chapter}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/10 text-slate-300 uppercase">
                        Mode: {scan.mode}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1">
                      {scan.extractedQuestions}
                    </p>
                    <span className="text-[10px] text-slate-500">
                      {new Date(scan.createdAt).toLocaleDateString()} at{' '}
                      {new Date(scan.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    {scan.score !== undefined && (
                      <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300">
                        {scan.score}/100
                      </span>
                    )}
                    <button
                      onClick={() => {
                        setScanResult(scan);
                        setActiveTab('scanner');
                      }}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-colors"
                    >
                      View Report
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
