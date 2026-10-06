import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Scale,
  Award,
  Loader2
} from 'lucide-react';
import { aiService } from '../lib/aiService';
import { AIModelOption } from '../types';

interface AIComparisonModeProps {
  initialQuestion?: string;
}

export const AIComparisonMode: React.FC<AIComparisonModeProps> = ({
  initialQuestion = 'Explain why light bends when traveling from water into air, and derive Snell\'s law.'
}) => {
  const [models, setModels] = useState<AIModelOption[]>([]);
  const [question, setQuestion] = useState<string>(initialQuestion);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [comparisonResult, setComparisonResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    aiService.getModels().then(m => setModels(m));
  }, []);

  const handleRunComparison = async () => {
    if (!question.trim()) return;
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const data = await aiService.compareModels(question);
      setComparisonResult(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Comparison failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-2 sm:p-4 animate-in fade-in">
      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-cyan-700/80 via-blue-700/80 to-indigo-800/80 p-6 sm:p-8 text-white shadow-xl border border-white/15 backdrop-blur-md">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md mb-2 border border-white/20">
            <Scale className="h-3.5 w-3.5" />
            <span>Multi-AI Provider & Reasoning Comparison</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            AI Model Comparison Engine
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-cyan-100 leading-relaxed">
            Send the exact same CBSE question to multiple AI reasoning models simultaneously.
            Inspect differences in explanation depth, verify mistakes, and read the synthesized best answer.
          </p>
        </div>
      </div>

      {/* Available Models Grid */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-5 shadow-xl shadow-indigo-950/20 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Connected AI Models & Capabilities
          </h3>
          <span className="text-[11px] text-slate-400">
            Real provider status (Only genuinely configured models are active)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {models.map(m => (
            <div
              key={m.id}
              className={`p-3.5 rounded-xl border transition-all text-xs space-y-2 backdrop-blur-md ${
                m.configured
                  ? 'border-blue-400/30 bg-blue-500/10'
                  : 'border-white/10 bg-white/[0.02] opacity-75'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white truncate">
                  {m.name.split('(')[0]}
                </span>
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    m.configured
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-white/10 text-slate-400 border border-white/10'
                  }`}
                >
                  {m.configured ? 'Configured' : 'Setup Required'}
                </span>
              </div>

              <span className="inline-block text-[10px] font-semibold text-blue-400">
                {m.badge}
              </span>
              <p className="text-[11px] text-slate-400 line-clamp-2">{m.description}</p>

              <div className="pt-1 flex flex-wrap gap-1">
                {m.bestFor.slice(0, 2).map((tag, i) => (
                  <span
                    key={i}
                    className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison Input */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-5 shadow-xl shadow-indigo-950/20 space-y-3">
        <label className="block text-xs font-bold text-slate-200">
          Enter CBSE Question to Compare Across Models:
        </label>
        <textarea
          value={question}
          onChange={e => setQuestion(e.target.value)}
          rows={3}
          className="w-full text-xs p-3 rounded-xl border border-white/15 bg-white/5 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-md"
          placeholder="Type any science, maths, or writing problem to benchmark..."
        />

        {errorMsg && (
          <p className="text-xs text-red-300 bg-red-950/40 p-2.5 rounded-xl border border-red-500/30 backdrop-blur-sm">
            {errorMsg}
          </p>
        )}

        <button
          id="btn-trigger-compare"
          onClick={handleRunComparison}
          disabled={isLoading}
          className="w-full py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Querying Models in Parallel & Synthesizing Best Answer...</span>
            </>
          ) : (
            <>
              <Scale className="h-4 w-4" />
              <span>Run Live Side-by-Side Model Comparison</span>
            </>
          )}
        </button>
      </div>

      {/* Comparison Results */}
      {comparisonResult && (
        <div className="space-y-6 animate-in fade-in">
          {/* Side-by-Side Model Answers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {comparisonResult.answers.map((ans: any, idx: number) => (
              <div
                key={idx}
                className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-5 shadow-xl shadow-indigo-950/20 space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-xs font-bold text-blue-400">
                    {ans.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded">
                      {ans.quality}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      ⚡ {ans.speed}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto pr-1 font-sans">
                  {ans.text}
                </div>
              </div>
            ))}
          </div>

          {/* AI Synthesis & Verdict Box */}
          {comparisonResult.comparison && (
            <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-900/30 to-purple-900/30 backdrop-blur-2xl p-5 shadow-xl shadow-indigo-950/20 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">
                  Comparative Analysis & Pedagogical Verdict
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <span className="font-bold text-indigo-300 block mb-1">
                    Key Differences:
                  </span>
                  <p className="text-[11px] text-slate-300">
                    {comparisonResult.comparison.differences}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <span className="font-bold text-indigo-300 block mb-1">
                    Strengths:
                  </span>
                  <p className="text-[11px] text-slate-300">
                    {comparisonResult.comparison.flashStrength}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <span className="font-bold text-indigo-300 block mb-1">
                    Examiner Verdict:
                  </span>
                  <p className="text-[11px] text-slate-300">
                    {comparisonResult.comparison.verdict}
                  </p>
                </div>
              </div>

              {/* Combined Best Answer */}
              {comparisonResult.comparison.combinedBestAnswer && (
                <div className="p-4 rounded-xl bg-white/5 border border-indigo-500/30 backdrop-blur-md space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                    <Award className="h-4 w-4" />
                    <span>Combined Best Answer (Synthesized Consensus):</span>
                  </div>
                  <div className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed font-sans">
                    {comparisonResult.comparison.combinedBestAnswer}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
