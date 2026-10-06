import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Sparkles,
  Award,
  Layers,
  HelpCircle,
  BookOpen,
  Loader2,
  Copy,
  Check,
  Printer
} from 'lucide-react';
import { aiService } from '../lib/aiService';
import { useAuth } from '../context/AuthContext';
import { storage } from '../lib/storage';

interface DocumentScannerProps {
  onStartQuizFromDoc?: (content: string) => void;
}

export const DocumentScanner: React.FC<DocumentScannerProps> = ({
  onStartQuizFromDoc
}) => {
  const { user, addXP } = useAuth();

  const [docText, setDocText] = useState<string>('');
  const [docName, setDocName] = useState<string>('CBSE_Class10_Optics_Notes.pdf');
  const [action, setAction] = useState<
    'summary' | 'flashcards' | 'quiz' | 'questions' | 'revision-sheet'
  >('summary');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const sampleDoc = `CBSE Class 10 Science - Light: Reflection & Refraction Excerpt:
Reflection of Light: The bouncing back of light into the same medium when it falls on a polished surface.
Laws of Reflection:
1. The angle of incidence is equal to the angle of reflection (i = r).
2. The incident ray, the reflected ray, and the normal to the mirror at the point of incidence, all lie in the same plane.

Spherical Mirrors:
1. Concave mirror: Reflecting surface is curved inwards. It is a converging mirror. Focal length is negative (-f).
2. Convex mirror: Reflecting surface is curved outwards. It is a diverging mirror. Focal length is positive (+f).
Mirror Formula: 1/f = 1/v + 1/u.
Magnification (m): m = -v/u = h'/h.

Refraction of Light: Change in direction of light when it passes from one transparent medium into another.
Snell's Law: sin(i)/sin(r) = constant = n2/n1 (Refractive index).
Lens Formula: 1/f = 1/v - 1/u. Magnification for lens: m = v/u = h'/h.
Power of a lens (P): P = 1/f (in metres), measured in Dioptres (D).`;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDocName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      // In web environment, reading text or simulating doc text extraction
      const content = reader.result as string;
      setDocText(content || sampleDoc);
    };
    reader.readAsText(file);
  };

  const handleProcess = async (selectedAction = action) => {
    const textToAnalyze = docText.trim() || sampleDoc;
    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const res = await aiService.analyzeDocument({
        documentText: textToAnalyze,
        documentName: docName,
        action: selectedAction,
        classLevel: user?.classLevel || 'Class 10'
      });

      setResult(res.result);
      if (user) {
        addXP(30, 'Analyzed Educational Document');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to process document');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-2 sm:p-4 animate-in fade-in">
      <div className="rounded-3xl bg-gradient-to-r from-rose-700/80 via-pink-700/80 to-purple-800/80 p-6 sm:p-8 text-white shadow-xl border border-white/15 backdrop-blur-md">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md mb-2 border border-white/20">
            <FileText className="h-3.5 w-3.5" />
            <span>Document Synthesis & Revision Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Document & PDF Learning Assistant
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-rose-100 leading-relaxed">
            Upload any textbook chapter, handwritten study notes, or syllabus document. Instantly generate concise executive summaries, spaced-repetition flashcards, or mock revision sheets.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Document Upload and Action Selection */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-5 shadow-xl shadow-indigo-950/20 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Upload or Paste Document
              </span>
              <button
                type="button"
                onClick={() => setDocText(sampleDoc)}
                className="text-[11px] font-bold text-rose-400 hover:underline"
              >
                Insert Sample PDF Text
              </button>
            </div>

            <div className="border-2 border-dashed border-white/15 hover:border-rose-400/50 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-white/[0.02] backdrop-blur-sm">
              <input
                type="file"
                accept=".pdf,.txt,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="doc-upload-input"
              />
              <label htmlFor="doc-upload-input" className="cursor-pointer block">
                <Upload className="h-6 w-6 text-rose-400 mx-auto mb-1" />
                <span className="text-xs font-bold text-white block">
                  Click to Upload PDF or Text File
                </span>
                <span className="text-[10px] text-slate-400">
                  {docName ? `Loaded: ${docName}` : 'Textbook chapters, notes, sample papers'}
                </span>
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Document Content:
              </label>
              <textarea
                value={docText}
                onChange={e => setDocText(e.target.value)}
                placeholder="Paste chapter notes or text here..."
                rows={6}
                className="w-full text-xs p-3 rounded-xl border border-white/15 bg-white/5 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 backdrop-blur-md"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-2">
                Select Analysis Mode:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAction('summary')}
                  className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all backdrop-blur-sm ${
                    action === 'summary'
                      ? 'border-rose-500/50 bg-rose-500/20 text-rose-200'
                      : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <BookOpen className="h-3.5 w-3.5 mb-1" />
                  <span>Key Summary</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAction('flashcards')}
                  className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all backdrop-blur-sm ${
                    action === 'flashcards'
                      ? 'border-purple-500/50 bg-purple-500/20 text-purple-200'
                      : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <Layers className="h-3.5 w-3.5 mb-1" />
                  <span>Make Flashcards</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAction('questions')}
                  className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all backdrop-blur-sm ${
                    action === 'questions'
                      ? 'border-blue-500/50 bg-blue-500/20 text-blue-200'
                      : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <HelpCircle className="h-3.5 w-3.5 mb-1" />
                  <span>Important Questions</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAction('revision-sheet')}
                  className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all backdrop-blur-sm ${
                    action === 'revision-sheet'
                      ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-200'
                      : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5 mb-1" />
                  <span>1-Page Cheat Sheet</span>
                </button>
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-red-300 bg-red-950/40 p-2.5 rounded-xl border border-red-500/30 backdrop-blur-sm">{errorMsg}</p>
            )}

            <button
              id="btn-process-doc"
              onClick={() => handleProcess()}
              disabled={isProcessing}
              className="w-full py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2 disabled:opacity-60 transition-all"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Synthesizing Document Insights...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Analyze Document with AI</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Analysis Output */}
        <div className="lg:col-span-7 space-y-4">
          {result ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-5 shadow-xl shadow-indigo-950/20 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-bold text-rose-400 capitalize">
                  {action.replace('-', ' ')} Output
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(result);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    title="Copy Text"
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    title="Print Document"
                  >
                    <Printer className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap max-h-[480px] overflow-y-auto pr-2">
                {result}
              </div>

              {onStartQuizFromDoc && (
                <div className="pt-3 border-t border-white/10 flex justify-end">
                  <button
                    onClick={() => onStartQuizFromDoc(result)}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-md flex items-center gap-1.5 transition-all"
                  >
                    <Award className="h-3.5 w-3.5" />
                    <span>Generate Practice Quiz from this Document</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full min-h-[350px] rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center p-8 text-center bg-white/[0.02] backdrop-blur-md">
              <div className="h-14 w-14 rounded-2xl bg-rose-500/15 border border-rose-500/25 flex items-center justify-center text-rose-400 mb-3 shadow-lg shadow-rose-500/10">
                <FileText className="h-7 w-7" />
              </div>
              <h3 className="text-xs font-bold text-white">
                Document Summary & Extraction Box
              </h3>
              <p className="text-[11px] text-slate-400 max-w-xs mt-1">
                Upload or paste notes on the left to extract flashcards, formulas, and board questions instantly.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
