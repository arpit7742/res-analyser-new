"use client";
import { motion } from "framer-motion";
import { SkillMatch } from "@/types";
import { getStatusStyle } from "@/lib/utils";

export default function SkillBar({ skill }: { skill: SkillMatch }) {
  const style = getStatusStyle(skill.status);

  return (
    <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--accent)]/20 transition-all">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-sm">{skill.name}</span>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${style.bg} ${style.color}`}>
          {style.label}
        </span>
      </div>

      {/* Stacked bars: required vs candidate */}
      <div className="space-y-1.5 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[var(--text-muted)] w-16 shrink-0">Required</span>
          <div className="flex-1 h-2 rounded-full bg-[var(--bg-input)]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${skill.requiredLevel}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full bg-indigo-500/40"
            />
          </div>
          <span className="text-[10px] font-mono text-[var(--text-muted)] w-6 text-right">{skill.requiredLevel}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[var(--text-muted)] w-16 shrink-0">You</span>
          <div className="flex-1 h-2 rounded-full bg-[var(--bg-input)]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${skill.candidateLevel}%` }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
              className={`h-full rounded-full ${
                skill.status === "strong" ? "bg-emerald-500" :
                skill.status === "partial" ? "bg-amber-500" : "bg-rose-500"
              }`}
            />
          </div>
          <span className="text-[10px] font-mono text-[var(--text-muted)] w-6 text-right">{skill.candidateLevel}</span>
        </div>
      </div>

      <p className="text-xs text-[var(--text-muted)] italic">{skill.resumeEvidence}</p>
    </div>
  );
}
