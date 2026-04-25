"use client";
import { Brain } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-card)]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
          <div className="p-1.5 rounded-lg gradient-btn">
            <Brain size={20} className="text-white" />
          </div>
          <span className="gradient-text">SkillProbe</span>
        </Link>
        <ThemeToggle />
      </div>
    </nav>
  );
}
