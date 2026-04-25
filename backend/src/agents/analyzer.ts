import { callGemini, parseJSON } from "../services/gemini";
import { analyzePrompt } from "../prompts/analyze";
import { AnalysisResult } from "../types";

export async function analyzeResume(jd: string, resume: string): Promise<AnalysisResult> {
  const prompt = analyzePrompt(jd, resume);
  const response = await callGemini(prompt);
  const result = parseJSON<AnalysisResult>(response);

  // Sanitize numeric fields
  result.overallMatch = Math.min(100, Math.max(0, result.overallMatch));
  result.skills = result.skills.map((s) => ({
    ...s,
    requiredLevel: Math.min(100, Math.max(0, s.requiredLevel)),
    candidateLevel: Math.min(100, Math.max(0, s.candidateLevel)),
    gap: s.candidateLevel - s.requiredLevel,
  }));

  return result;
}
