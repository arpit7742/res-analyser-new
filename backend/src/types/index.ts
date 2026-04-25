export interface SkillMatch {
  name: string;
  requiredLevel: number;       // 0-100 inferred from JD language
  candidateLevel: number;      // 0-100 inferred from resume evidence
  status: "strong" | "partial" | "missing";
  resumeEvidence: string;      // what the resume says about this skill
  gap: number;                 // requiredLevel - candidateLevel (negative = gap)
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
  overallMatch: number;          // 0-100 overall fit score
  summary: string;               // 2-3 sentence summary
  skills: SkillMatch[];
  strengths: string[];           // top 3 things candidate does well
  criticalGaps: string[];        // top 3 most important missing skills
  learningPlan: LearningPlanItem[];
}
