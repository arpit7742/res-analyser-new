# Architecture — SkillProbe

## Agent Pipeline

```
JD + Resume → [Skill Extractor] → [Assessor (per skill)] → [Scorer] → [Gap Analyzer] → [Learning Planner]
```

### 1. Skill Extractor Agent
- Input: Job Description + Resume text
- LLM: Gemini 1.5 Flash
- Output: Array of skills with required levels and claimed status
- Maps JD language ("expert in" → 85, "familiar with" → 40)

### 2. Assessor Agent
- Input: Skill name, conversation history, resume context
- LLM: Gemini 1.5 Flash (called per question)
- Generates 3–5 adaptive questions per skill
- Decides when enough data is collected to score

### 3. Scorer Agent
- Input: Skill name, full Q&A history, resume context
- LLM: Gemini 1.5 Flash
- Scoring rubric: 0–25 Novice, 26–50 Beginner, 51–75 Intermediate, 76–90 Advanced, 91–100 Expert
- Output: Score + reasoning + key evidence

### 4. Gap Analyzer (Pure Logic)
- No LLM call
- `actual >= required - 10` → none
- `actual >= required - 25` → minor
- `actual < required - 25` → major

### 5. Learning Plan Agent
- Input: Gaps, scores, resume context
- LLM: Gemini 1.5 Flash
- Output: Curated resources, time estimates, adjacent skill leverage tips

## Session Management
- In-memory Map with 30-minute TTL
- Auto-cleanup every 5 minutes
- No persistent storage needed

## Rate Limiting
- Express rate limiter: 30 req/min per IP
- Gemini backoff: exponential retry on 429 (3 attempts)
