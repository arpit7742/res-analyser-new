"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Upload, FileText, Zap, ArrowRight, Loader2, X } from "lucide-react";
import { api } from "@/lib/api";
import { useStore } from "@/store/store";

export default function Home() {
  const router = useRouter();
  const setResult = useStore((s) => s.setResult);
  const [jd, setJd] = useState("");
  const [resume, setResume] = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    try {
      const text = file.type === "application/pdf"
        ? await api.uploadResume(file)
        : await file.text();
      setResume(text);
    } catch {
      setError("Could not read file. Please paste your resume text instead.");
    }
  };

  const handleAnalyze = async () => {
    if (!jd.trim() || !resume.trim()) {
      setError("Please provide both a job description and your resume.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const result = await api.analyze(jd, resume);
      setResult(result);
      router.push("/results");
    } catch (err: any) {
      setError(err.message || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">

      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[var(--accent)] text-sm font-medium mb-6">
          <Zap size={14} /> Powered by Gemini AI
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-4">
          Resume <span className="gradient-text">Gap Analyzer</span>
        </h1>
        <p className="text-lg text-[var(--text-secondary)] max-w-xl mx-auto">
          Paste a job description and your resume. Get an instant skill gap analysis and a personalised learning plan.
        </p>
      </motion.div>

      {/* Input Grid */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6"
      >
        {/* JD */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <FileText size={15} className="text-[var(--accent)]" />
            Job Description
          </label>
          <textarea
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder="Paste the full job description here…"
            rows={14}
            className="w-full p-4 rounded-2xl bg-[var(--bg-input)] border border-[var(--border)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 resize-none text-sm placeholder:text-[var(--text-muted)] leading-relaxed"
          />
        </div>

        {/* Resume */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Upload size={15} className="text-[var(--accent)]" />
            Your Resume
          </label>
          <textarea
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            placeholder="Paste your resume text here…"
            rows={11}
            className="w-full p-4 rounded-2xl bg-[var(--bg-input)] border border-[var(--border)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 resize-none text-sm placeholder:text-[var(--text-muted)] leading-relaxed"
          />
          {/* File upload */}
          <input ref={fileRef} type="file" accept=".pdf,.txt" onChange={handleFile} className="hidden" />
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-[var(--border)] hover:border-[var(--accent)]/40 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
          >
            <Upload size={15} />
            {fileName ? (
              <span className="flex items-center gap-1">
                {fileName}
                <X size={13} onClick={(e) => { e.stopPropagation(); setFileName(""); setResume(""); }} className="hover:text-rose-500" />
              </span>
            ) : "Upload PDF or TXT"}
          </button>
        </div>
      </motion.div>

      {/* Error */}
      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-5 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm text-center">
          {error}
        </motion.div>
      )}

      {/* CTA */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-center">
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="gradient-btn text-white px-10 py-4 rounded-full text-base font-semibold inline-flex items-center gap-2.5 hover:shadow-xl hover:shadow-indigo-500/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <><Loader2 size={20} className="animate-spin" /> Analyzing…</>
          ) : (
            <><Zap size={20} /> Analyze My Resume <ArrowRight size={18} /></>
          )}
        </button>
      </motion.div>
    </div>
  );
}
