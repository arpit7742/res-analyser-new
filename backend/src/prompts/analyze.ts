export function analyzePrompt(jd: string, resume: string): string {
  return `You are a technical recruiter. Analyze how well this resume matches the job description.

JOB DESCRIPTION:
${jd}

RESUME:
${resume}

Return ONLY a JSON object with these fields (no markdown, no extra text):

{
  "overallMatch": <integer 0-100>,
  "summary": "<2 sentence summary of fit>",
  "skills": [
    {
      "name": "<skill name>",
      "requiredLevel": <integer 0-100>,
      "candidateLevel": <integer 0-100>,
      "status": "<strong|partial|missing>",
      "resumeEvidence": "<brief evidence from resume or 'Not mentioned'>",
      "gap": <candidateLevel minus requiredLevel>
    }
  ],
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "criticalGaps": ["<gap 1>", "<gap 2>", "<gap 3>"],
  "learningPlan": [
    {
      "skill": "<skill name>",
      "priority": "<high|medium|low>",
      "currentLevel": <integer>,
      "targetLevel": <integer>,
      "resources": [
        { "title": "<title>", "url": "<real url>", "type": "<documentation|free_course|tutorial|project|video>" },
        { "title": "<title>", "url": "<real url>", "type": "<type>" }
      ],
      "hoursEstimate": <integer>,
      "tip": "<one sentence tip>"
    }
  ]
}

RULES:
- skills: extract 5-8 most important skills from JD only.
- requiredLevel: "expert/mastery"=85, "proficient/strong"=70, "experienced"=60, "familiar/knowledge of"=40, "basic"=30.
- candidateLevel: 0 if skill not mentioned in resume.
- status: "strong" if candidateLevel >= requiredLevel-10, "partial" if >= requiredLevel-30, else "missing".
- learningPlan: only for "partial" or "missing" skills, max 5 items, 2 resources each.
- Return valid JSON only.`;
}
