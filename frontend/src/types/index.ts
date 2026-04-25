export interface SkillMatch {
  name: string;
  requiredLevel: number;
  candidateLevel: number;
  status: "strong" | "partial" | "missing";
  resumeEvidence: string;
  gap: number;
}

export interface LearningResource {
  title: string;
  url: string;
  type: "documentation" | "free_course" | "tutorial" | "project" | "video";
}

export interface LearningPlanItem {
  skill: string;
  priority: "high" | "medium" | "low";
  currentLevel: number;
  targetLevel: number;
  resources: LearningResource[];
  hoursEstimate: number;
  tip: string;
}

export interface AnalysisResult {
  overallMatch: number;
  summary: string;
  skills: SkillMatch[];
  strengths: string[];
  criticalGaps: string[];
  learningPlan: LearningPlanItem[];
}
