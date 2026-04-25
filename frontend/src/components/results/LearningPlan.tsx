"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Clock, ExternalLink, Lightbulb, BookOpen, Video, Wrench, FileText, GraduationCap } from "lucide-react";
import { LearningPlanItem } from "@/types";
import { getPriorityStyle } from "@/lib/utils";

const typeIcon: Record<string, React.ReactNode> = {
  documentation: <FileText size={13} />,
  free_course:   <GraduationCap size={13} />,
  tutorial:      <BookOpen size={13} />,
  project:       <Wrench size={13} />,
  video:         <Video size={13} />,
};

function PlanCard({ item }: { item: LearningPlanItem }) {
  const [open, setOpen] = useState(false);
  const p = getPriorityStyle(item.priority);

  return (
    <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-5 flex items-center gap-3 hover:bg-[var(--bg-input)]/40 transition-colors text-left"
      >
        <div className="flex-1 flex items-center gap-3 min-w-0">
          <span className="font-semibold truncate">{item.skill}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${p.bg} ${p.color}`}>{p.label}</span>
          <span className="text-xs text-[var(--text-muted)] shrink-0 flex items-center gap-1">
            <Clock size={11} /> {item.hoursEstimate}h
          </span>
        </div>
        {/* mini progress */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <span className="text-xs text-[var(--text-muted)]">{item.currentLevel} → {item.targetLevel}</span>
          <div className="w-20 h-1.5 rounded-full bg-[var(--bg-input)]">
            <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${item.targetLevel}%` }} />
          </div>
        </div>
        <ChevronDown size={16} className={`text-[var(--text-muted)] transition-transform shrink-0 ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-3 border-t border-[var(--border)]">
              {/* Tip */}
              <div className="flex gap-2 pt-4 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                <Lightbulb size={15} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-sm text-[var(--text-secondary)]">{item.tip}</p>
              </div>
              {/* Resources */}
              <div className="space-y-2">
                {item.resources.map((r, i) => (
                  <a
                    key={i}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-input)] hover:bg-[var(--accent)]/5 border border-transparent hover:border-[var(--accent)]/20 transition-all group"
                  >
                    <span className="text-[var(--accent)]">{typeIcon[r.type] ?? <BookOpen size={13} />}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{r.title}</p>
                      <p className="text-xs text-[var(--text-muted)] capitalize">{r.type.replace("_", " ")}</p>
                    </div>
                    <ExternalLink size={13} className="text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LearningPlan({ plan }: { plan: LearningPlanItem[] }) {
  if (!plan.length) return (
    <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-center text-emerald-500 font-medium">
      No learning plan needed — you meet all requirements! 🎉
    </div>
  );

  const totalHours = plan.reduce((s, p) => s + p.hoursEstimate, 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm text-[var(--text-secondary)]">
        <span>{plan.length} skill{plan.length > 1 ? "s" : ""} to improve</span>
        <span className="flex items-center gap-1 text-[var(--accent)]"><Clock size={13} /> ~{totalHours}h total</span>
      </div>
      {plan.map((item) => <PlanCard key={item.skill} item={item} />)}
    </div>
  );
}
