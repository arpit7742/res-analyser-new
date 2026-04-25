"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { RotateCcw, CheckCircle2, XCircle, AlertCircle, TrendingUp } from "lucide-react";
import { useStore } from "@/store/store";
import MatchScore from "@/components/results/MatchScore";
import SkillBar from "@/components/results/SkillBar";
import LearningPlan from "@/components/results/LearningPlan";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay },
});

export default function ResultsPage() {
  const router = useRouter();
  const { result, clear } = useStore();

  useEffect(() => {
    if (!result) router.push("/");
  }, [result, router]);

  if (!result) return null;

  const strong  = result.skills.filter((s) => s.status === "strong");
  const partial = result.skills.filter((s) => s.status === "partial");
  const missing = result.skills.filter((s) => s.status === "missing");

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">

      {/* Header */}
      <motion.div {...fade()} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Analysis Results</h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">Here&apos;s how your resume matches the job description</p>
        </div>
        <button
          onClick={() => { clear(); router.push("/"); }}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] hover:border-[var(--accent)]/40 text-sm transition-colors"
        >
          <RotateCcw size={14} /> New Analysis
        </button>
      </motion.div>

      {/* Top row: score + summary + stats */}
      <motion.div {...fade(0.05)} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Score ring */}
        <div className="sm:col-span-1 p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] flex flex-col items-center justify-center gap-3">
          <MatchScore score={result.overallMatch} />
          <p className="text-xs text-[var(--text-muted)] text-center">Overall Job Fit</p>
        </div>

        {/* Summary */}
        <div className="sm:col-span-2 p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] flex flex-col justify-between gap-4">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{result.summary}</p>
          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-[var(--border)]">
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-500">{strong.length}</p>
              <p className="text-xs text-[var(--text-muted)]">Strong</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-500">{partial.length}</p>
              <p className="text-xs text-[var(--text-muted)]">Partial</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-rose-500">{missing.length}</p>
              <p className="text-xs text-[var(--text-muted)]">Missing</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Strengths + Critical Gaps */}
      <motion.div {...fade(0.1)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/15">
          <h2 className="font-semibold text-sm flex items-center gap-2 mb-3 text-emerald-500">
            <CheckCircle2 size={16} /> Your Strengths
          </h2>
          <ul className="space-y-2">
            {result.strengths.map((s, i) => (
              <li key={i} className="text-sm text-[var(--text-secondary)] flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5 shrink-0">✓</span> {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Critical Gaps */}
        <div className="p-5 rounded-2xl bg-rose-500/5 border border-rose-500/15">
          <h2 className="font-semibold text-sm flex items-center gap-2 mb-3 text-rose-500">
            <XCircle size={16} /> Critical Gaps
          </h2>
          <ul className="space-y-2">
            {result.criticalGaps.map((g, i) => (
              <li key={i} className="text-sm text-[var(--text-secondary)] flex items-start gap-2">
                <span className="text-rose-500 mt-0.5 shrink-0">✗</span> {g}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Skills Breakdown */}
      <motion.div {...fade(0.15)}>
        <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
          <AlertCircle size={18} className="text-[var(--accent)]" /> Skills Breakdown
        </h2>

        {missing.length > 0 && (
          <div className="mb-5">
            <p className="text-xs font-medium text-rose-500 uppercase tracking-wider mb-3">Missing Skills</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {missing.map((s) => <SkillBar key={s.name} skill={s} />)}
            </div>
          </div>
        )}

        {partial.length > 0 && (
          <div className="mb-5">
            <p className="text-xs font-medium text-amber-500 uppercase tracking-wider mb-3">Partial Match</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {partial.map((s) => <SkillBar key={s.name} skill={s} />)}
            </div>
          </div>
        )}

        {strong.length > 0 && (
          <div>
            <p className="text-xs font-medium text-emerald-500 uppercase tracking-wider mb-3">Strong Match</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {strong.map((s) => <SkillBar key={s.name} skill={s} />)}
            </div>
          </div>
        )}
      </motion.div>

      {/* Learning Plan */}
      <motion.div {...fade(0.2)}>
        <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-[var(--accent)]" /> Personalised Learning Plan
        </h2>
        <LearningPlan plan={result.learningPlan} />
      </motion.div>
    </div>
  );
}
