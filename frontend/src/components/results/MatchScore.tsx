"use client";
import { motion } from "framer-motion";
import { getMatchColor } from "@/lib/utils";

export default function MatchScore({ score }: { score: number }) {
  const color = getMatchColor(score);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const dash = (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r={radius} fill="none" stroke="var(--bg-input)" strokeWidth="10" />
          <motion.circle
            cx="64" cy="64" r={radius}
            fill="none"
            stroke={score >= 75 ? "#10b981" : score >= 50 ? "#f59e0b" : "#f43f5e"}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - dash }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`text-3xl font-bold font-mono ${color}`}
          >
            {score}%
          </motion.span>
          <span className="text-xs text-[var(--text-muted)]">match</span>
        </div>
      </div>
    </div>
  );
}
