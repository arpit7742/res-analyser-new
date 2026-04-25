# PRD — AI-Powered Skill Assessment & Personalised Learning Plan Agent

**Version:** 2.0  
**Stack:** Next.js 15 (TypeScript) · Node.js + Express · Gemini API (free tier)  
**Deployment:** Frontend → Vercel · Backend → Render (free instance)

---

## 1. Problem Statement

Resumes list claimed skills — they don't reveal actual proficiency depth. Hiring managers waste time on mismatched candidates. Candidates don't know which gaps to close or how. This agent bridges that gap by conversationally probing real skill depth, scoring it, and generating a focused, time-boxed learning plan with curated resources.

---

## 2. Goals

| Goal | Success Metric |
|------|---------------|
| Extract required skills from any JD accurately | ≥ 95% skill extraction accuracy |
| Assess candidate proficiency conversationally | 3–5 adaptive questions per skill |
| Score each skill 0–100 with reasoning | Scores correlate with demonstrated knowledge |
| Identify skill gaps vs JD requirements | Gap list matches manual review ≥ 90% |
| Generate actionable learning plan | Curated resources + realistic time estimates |
| Beautiful, accessible UI with dark mode | Lighthouse ≥ 90, WCAG AA compliant |

---

## 3. Non-Goals (v1)

- No user authentication / accounts
- No persistent database (session-only, in-memory)
- No payment or premium tier
- No mobile native app
- No file storage (PDF parsed on the fly, text discarded after extraction)

---

## 4. User Personas

**Persona A — Job Seeker (Primary)**  
Uploads resume + pastes JD → gets assessed skill-by-skill → receives personalised learning plan to close gaps before applying.

**Persona B — Recruiter / Hiring Manager**  
Pastes JD + candidate resume → runs assessment → gets structured proficiency report to focus interviews on real gaps.

---

## 5. Core User Flow

```
1. Landing Page
   └─ Paste Job Description + Upload/Paste Resume
   └─ Click "Start Assessment"

2. Skill Extraction (~3s)
   └─ Agent extracts required skills from JD
   └─ Maps candidate's claimed skills from resume
   └─ Shows skill list with "claimed" / "missing" badges

3. Conversational Assessment (per skill)
   └─ Chat UI — agent asks 3–5 adaptive questions
   └─ Candidate types answers in real-time
   └─ Progress sidebar shows completed / current / pending skills

4. Results Dashboard
   └─ Radar chart (required vs actual overlay)
   └─ Per-skill score card (0–100) with reasoning
   └─ Gap analysis with severity badges

5. Personalised Learning Plan
   └─ Prioritised skill gaps
   └─ Curated resources (docs, free courses, projects)
   └─ Time estimates per skill
   └─ Adjacent skill leverage tips
   └─ Export as PDF / copy markdown
```

---

## 6. Folder Structure

```
res-analyzer/
├── frontend/                              # Next.js 15 + TypeScript + Tailwind CSS
│   ├── public/
│   │   └── fonts/                         # Inter + Geist Mono
│   ├── src/
│   │   ├── app/                           # App Router
│   │   │   ├── layout.tsx                 # Root layout + ThemeProvider
│   │   │   ├── page.tsx                   # Landing / Input page
│   │   │   ├── assessment/
│   │   │   │   └── page.tsx               # Chat assessment page
│   │   │   ├── results/
│   │   │   │   └── page.tsx               # Dashboard + Learning plan
│   │   │   └── globals.css                # Tailwind + CSS variables
│   │   ├── components/
│   │   │   ├── ui/                        # Button, Card, Badge, Input, Textarea
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── ThemeToggle.tsx        # Dark/light switch
│   │   │   │   └── Footer.tsx
│   │   │   ├── home/
│   │   │   │   ├── HeroSection.tsx        # Animated gradient hero
│   │   │   │   ├── InputForm.tsx          # JD + Resume input + PDF upload
│   │   │   │   └── FeatureCards.tsx       # How it works section
│   │   │   ├── assessment/
│   │   │   │   ├── ChatWindow.tsx         # Chat bubble UI
│   │   │   │   ├── ChatMessage.tsx        # Single message bubble
│   │   │   │   ├── SkillSidebar.tsx       # Skill progress tracker
│   │   │   │   ├── TypingIndicator.tsx    # Agent thinking animation
│   │   │   │   └── ChatInput.tsx          # Message input bar
│   │   │   └── results/
│   │   │       ├── RadarChart.tsx         # Recharts radar (required vs actual)
│   │   │       ├── SkillScoreCard.tsx     # Animated score bar + reasoning
│   │   │       ├── GapAnalysis.tsx        # Gap severity table
│   │   │       ├── LearningPlan.tsx       # Collapsible resource cards
│   │   │       └── ExportButton.tsx       # PDF / markdown export
│   │   ├── hooks/
│   │   │   ├── useAssessment.ts           # Assessment session logic
│   │   │   └── useTheme.ts               # Dark mode hook
│   │   ├── lib/
│   │   │   ├── api.ts                     # Fetch wrapper → backend
│   │   │   ├── utils.ts                   # cn(), formatScore()
│   │   │   └── constants.ts               # API_URL, score bands
│   │   ├── store/
│   │   │   └── assessmentStore.ts         # Zustand session state
│   │   └── types/
│   │       └── index.ts                   # Shared TypeScript interfaces
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── postcss.config.mjs
│   └── package.json
│
├── backend/                               # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── routes/
│   │   │   ├── extract.ts                 # POST /api/extract/skills
│   │   │   ├── assessment.ts              # POST /api/assess/start, /api/assess/answer
│   │   │   └── results.ts                 # GET  /api/results/:sessionId
│   │   ├── agents/
│   │   │   ├── skillExtractor.ts          # Gemini: JD + resume → skill list
│   │   │   ├── assessor.ts               # Gemini: adaptive Q&A per skill
│   │   │   ├── scorer.ts                 # Gemini: score 0–100 + reasoning
│   │   │   └── planner.ts                # Gemini: gap → learning plan
│   │   ├── prompts/
│   │   │   ├── extractSkills.ts           # Prompt template
│   │   │   ├── assessSkill.ts
│   │   │   ├── scoreSkill.ts
│   │   │   └── generatePlan.ts
│   │   ├── services/
│   │   │   ├── gemini.ts                  # Gemini API client wrapper
│   │   │   ├── sessionStore.ts            # In-memory Map with TTL cleanup
│   │   │   └── pdfParser.ts              # pdf-parse: resume PDF → text
│   │   ├── types/
│   │   │   └── index.ts                   # Session, Skill, Score, Gap, Plan types
│   │   ├── middleware/
│   │   │   ├── cors.ts
│   │   │   ├── errorHandler.ts
│   │   │   └── rateLimiter.ts
│   │   ├── config.ts                      # env vars, defaults
│   │   └── index.ts                       # Express app entry
│   ├── tsconfig.json
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
│
├── docs/
│   ├── architecture.md                    # Scoring logic + agent pipeline docs
│   ├── architecture-diagram.png           # Exported from Mermaid
│   └── sample-io/
│       ├── sample-jd.txt
│       ├── sample-resume.txt
│       └── sample-output.json
│
├── .agents/                               # Existing agent skills (unchanged)
├── README.md
└── PRD.md
```

---

## 7. Tech Stack

### Frontend — Next.js 15 + TypeScript

| Concern | Choice | Reason |
|---------|--------|--------|
| Framework | Next.js 15 (App Router) | SSR/SSG, file-based routing, Vercel-native |
| Language | TypeScript 5.x | Type safety across frontend |
| Styling | Tailwind CSS v4 | Utility-first, CSS variables for dark mode |
| Animations | Framer Motion | Chat bubbles, page transitions, score reveals |
| Charts | Recharts | Radar + bar charts, lightweight, React-native |
| State | Zustand | Minimal boilerplate for cross-page session state |
| HTTP | Native fetch + SWR | Next.js aligned, caching built-in |
| Icons | Lucide React | Tree-shakeable, consistent icon set |
| PDF export | html2canvas + jsPDF | Client-side results export |
| Dark mode | next-themes + CSS variables | System preference + manual toggle |

### Backend — Node.js + Express + TypeScript

| Concern | Choice | Reason |
|---------|--------|--------|
| Runtime | Node.js 20 LTS | Stable, wide ecosystem |
| Framework | Express 4 | Lightweight, battle-tested |
| Language | TypeScript 5.x | Shared types with frontend |
| LLM | Gemini 1.5 Flash (free tier) | Free API, 1M context window, fast |
| Gemini SDK | @google/generative-ai | Official Google AI SDK for Node.js |
| PDF parsing | pdf-parse | Extract text from uploaded resume PDFs |
| File upload | multer | Multipart form handling for PDF upload |
| Session store | In-memory Map + TTL | No DB needed, auto-cleanup stale sessions |
| Validation | zod | Runtime schema validation for all inputs |
| CORS | cors package | Vercel ↔ Render cross-origin |
| Rate limiting | express-rate-limit | Protect Gemini free tier quota |

### Deployment

| Service | Platform | Config |
|---------|----------|--------|
| Frontend | Vercel (free) | Auto-deploy from `frontend/`, Next.js preset |
| Backend | Render (free) | Docker from `backend/`, auto-deploy on push |

---

## 8. Agent Architecture

### 8.1 Agent Pipeline

```
JD + Resume (text or PDF)
    │
    ▼
┌─────────────────────────────┐
│  Skill Extractor Agent      │  Gemini Flash
│  JD + resume → skill list   │──────────────►  skills: [{name, requiredLevel, candidateClaimed}]
└─────────────────────────────┘
    │
    ▼
┌─────────────────────────────┐
│  Assessment Agent           │  Gemini Flash (per skill, 3–5 turns)
│  generateQuestion(skill,    │
│    history) → question      │──────────────►  conversational Q&A loop
│  evaluateAnswer(answer)     │
│    → continue | done        │
└─────────────────────────────┘
    │
    ▼
┌─────────────────────────────┐
│  Scorer Agent               │  Gemini Flash
│  Q&A history + resume       │──────────────►  {skill, score: 0–100, reasoning, evidence}
│  context → score            │
└─────────────────────────────┘
    │
    ▼
┌─────────────────────────────┐
│  Gap Analyzer               │  Pure logic (no LLM)
│  requiredLevel vs actual    │──────────────►  {skill, severity: none|minor|major, delta}
│  score → gap severity       │
└─────────────────────────────┘
    │
    ▼
┌─────────────────────────────┐
│  Learning Plan Agent        │  Gemini Flash
│  gaps + strengths →         │──────────────►  [{skill, resources[], hours, adjacentLeverage}]
│  personalised plan          │
└─────────────────────────────┘
```

### 8.2 Scoring Rubric

Passed to Gemini as part of the scorer prompt:

| Band | Score | Meaning |
|------|-------|---------|
| Novice | 0–25 | Heard of it, no practical experience |
| Beginner | 26–50 | Basic usage, needs guidance for real tasks |
| Intermediate | 51–75 | Independent work, some knowledge gaps |
| Advanced | 76–90 | Deep knowledge, can mentor others |
| Expert | 91–100 | Authoritative, cutting-edge understanding |

Scorer receives: skill name, all Q&A turns, resume context → outputs structured JSON:
```json
{ "score": 72, "reasoning": "...", "keyEvidence": ["...", "..."] }
```

### 8.3 Gap Analysis Logic (Pure TypeScript — No LLM)

```typescript
function getGapSeverity(actual: number, required: number): "none" | "minor" | "major" {
  if (actual >= required - 10) return "none";
  if (actual >= required - 25) return "minor";
  return "major";
}
```

Required level inferred from JD language by the Skill Extractor:
- "expert in" / "deep experience" → 85
- "proficient in" / "strong" → 70
- "experienced with" → 60
- "familiar with" / "knowledge of" → 40

### 8.4 Learning Plan Generation

For each skill with `minor` or `major` gap, Gemini generates:
- 2–3 curated free resources (official docs, free courses, GitHub repos)
- Realistic hours estimate based on gap delta
- Adjacent skill leverage tip (e.g., "Your Express knowledge transfers directly to Fastify")

---

## 9. API Contracts

Base URL: `https://<render-service>.onrender.com/api`

### POST `/api/extract/skills`
```typescript
// Request
{ jd: string; resume: string }  // resume = raw text or extracted PDF text

// Response
{
  sessionId: string;
  skills: Array<{
    name: string;
    requiredLevel: number;       // 0–100
    candidateClaimed: boolean;
  }>;
}
```

### POST `/api/assess/start`
```typescript
// Request
{ sessionId: string; skill: string }

// Response
{ question: string; questionIndex: number; totalQuestions: number }
```

### POST `/api/assess/answer`
```typescript
// Request
{ sessionId: string; skill: string; answer: string }

// Response
{ nextQuestion: string | null; done: boolean; questionIndex: number }
```

### GET `/api/results/:sessionId`
```typescript
// Response
{
  scores: Array<{
    skill: string;
    score: number;
    reasoning: string;
    keyEvidence: string[];
  }>;
  gaps: Array<{
    skill: string;
    severity: "none" | "minor" | "major";
    delta: number;
    requiredLevel: number;
    actualScore: number;
  }>;
  learningPlan: Array<{
    skill: string;
    resources: Array<{
      title: string;
      url: string;
      type: "documentation" | "free_course" | "tutorial" | "project" | "video";
    }>;
    hoursEstimate: number;
    adjacentLeverage: string;
  }>;
}
```

### POST `/api/upload/resume`
```typescript
// Request: multipart/form-data with file field "resume" (PDF)
// Response
{ text: string }  // extracted plain text from PDF
```

---

## 10. UI Design Spec

### Design Language
- **Style:** Glassmorphism cards + subtle gradients (dark), clean whites with soft shadows (light)
- **Font:** Inter (body) + Geist Mono (scores, code)
- **Primary:** Indigo-500 → Violet-600 gradient
- **Success:** Emerald-500 (high scores, no gap)
- **Warning:** Amber-500 (minor gap)
- **Danger:** Rose-500 (major gap)
- **Radius:** `rounded-2xl` cards, `rounded-full` badges/avatars
- **Shadows:** `shadow-xl` with colored glow on hover (dark mode)
- **Transitions:** 200ms ease on all interactive elements

### Dark Mode Implementation
- `next-themes` provider wrapping root layout
- CSS variables for all colors: `--bg-primary`, `--bg-card`, `--text-primary`, `--border`
- `class` strategy (Tailwind `dark:` prefix)
- Respects `prefers-color-scheme` on first visit
- Toggle persisted in `localStorage`
- Smooth 200ms transition on theme switch

### Key Screens

**Screen 1 — Landing / Input**
- Full-width animated gradient hero: "Know Your Real Skills"
- Two-column layout below: JD textarea (left) + Resume textarea with PDF drag-drop (right)
- Feature cards: "AI Assessment" / "Gap Analysis" / "Learning Plan"
- Prominent "Start Assessment →" CTA button with gradient + hover glow

**Screen 2 — Assessment Chat**
- Left sidebar: skill list with status icons (✓ done, ● current, ○ pending) + progress %
- Center: chat window with message bubbles (agent left with bot avatar, user right)
- Typing indicator (3 bouncing dots) while Gemini generates
- Bottom: input bar with send button, auto-focus
- "Skip Skill" option for skills candidate wants to skip

**Screen 3 — Results Dashboard**
- Top: radar chart showing required vs actual scores overlay
- Middle: grid of skill score cards with animated circular progress + reasoning expandable
- Gap analysis table with severity badges (color-coded)
- Bottom: collapsible learning plan accordion per skill
  - Each resource as a card with icon (📄 docs, 🎓 course, 🔨 project)
  - Hours estimate badge
  - Adjacent leverage tip in a callout box
- Export bar: "Download PDF" + "Copy Markdown" buttons

---

## 11. Gemini API Usage (Free Tier)

| Limit | Value | Impact |
|-------|-------|--------|
| Requests per minute | 15 RPM | ~3 skills assessed per minute |
| Tokens per minute | 1M TPM | Plenty for all prompts |
| Requests per day | 1500 RPD | ~50 full sessions/day |
| Model | `gemini-1.5-flash` | Fast, free, 1M context |

**Rate limit strategy:**
- Backend queues Gemini calls with 4s minimum spacing
- Exponential backoff on 429 responses (3 retries max)
- Frontend shows "Agent is thinking…" during waits
- Session TTL: 30 minutes (auto-cleanup)

---

## 12. Deployment Configuration

### Vercel (Frontend)
```
Framework preset: Next.js
Root directory: frontend
Build command: next build
Output directory: .next
Environment variables:
  NEXT_PUBLIC_API_URL=https://<render-service>.onrender.com/api
```

### Render (Backend)
```
Root directory: backend
Runtime: Docker
Build: docker build -t backend .
Start: node dist/index.js
Environment variables:
  GEMINI_API_KEY=<key>
  ALLOWED_ORIGINS=https://<vercel-app>.vercel.app
  PORT=3001
  NODE_ENV=production
Free instance: spins down after 15min inactivity
  → cold start ~30s (frontend shows "Waking up server…" spinner)
```

### Backend Dockerfile
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ ./dist/
EXPOSE 3001
CMD ["node", "dist/index.js"]
```

---

## 13. Sample Input / Output

### Sample JD
```
Senior Full-Stack Engineer — Expert in React and TypeScript, proficient in Node.js
and Express, experienced with PostgreSQL, familiar with Docker and CI/CD pipelines,
knowledge of AWS services (S3, Lambda).
```

### Sample Resume
```
4 years full-stack development. Built React SPAs with TypeScript for 3 years.
Node.js + Express REST APIs for 2 years. Basic PostgreSQL queries. No Docker
or AWS experience. Used GitHub Actions for simple CI.
```

### Sample Output
```json
{
  "scores": [
    { "skill": "React", "score": 74, "reasoning": "Strong component architecture knowledge, gaps in advanced performance optimization and concurrent features." },
    { "skill": "TypeScript", "score": 68, "reasoning": "Good everyday usage, limited understanding of advanced generics and utility types." },
    { "skill": "Node.js + Express", "score": 61, "reasoning": "Solid REST API building, gaps in middleware patterns and error handling strategies." },
    { "skill": "PostgreSQL", "score": 35, "reasoning": "Basic CRUD queries only, no knowledge of indexing, joins optimization, or migrations." },
    { "skill": "Docker", "score": 10, "reasoning": "Awareness only, no hands-on experience with Dockerfiles or compose." },
    { "skill": "AWS (S3, Lambda)", "score": 5, "reasoning": "No practical experience demonstrated." }
  ],
  "gaps": [
    { "skill": "PostgreSQL", "severity": "minor", "delta": -25, "requiredLevel": 60, "actualScore": 35 },
    { "skill": "Docker", "severity": "major", "delta": -30, "requiredLevel": 40, "actualScore": 10 },
    { "skill": "AWS (S3, Lambda)", "severity": "major", "delta": -35, "requiredLevel": 40, "actualScore": 5 }
  ],
  "learningPlan": [
    {
      "skill": "Docker",
      "resources": [
        { "title": "Docker Getting Started (Official)", "url": "https://docs.docker.com/get-started/", "type": "documentation" },
        { "title": "Docker for Node.js — Best Practices", "url": "https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md", "type": "tutorial" }
      ],
      "hoursEstimate": 12,
      "adjacentLeverage": "You already deploy Node.js apps — Docker just wraps that process. Start by containerizing one of your Express APIs."
    },
    {
      "skill": "AWS (S3, Lambda)",
      "resources": [
        { "title": "AWS Free Tier + Lambda Tutorial", "url": "https://aws.amazon.com/getting-started/hands-on/run-serverless-code/", "type": "free_course" },
        { "title": "Serverless Express on Lambda", "url": "https://github.com/vendia/serverless-express", "type": "project" }
      ],
      "hoursEstimate": 18,
      "adjacentLeverage": "Your Express knowledge maps directly to Lambda — use serverless-express to deploy your existing APIs as Lambda functions."
    }
  ]
}
```

---

## 14. Architecture Diagram

```mermaid
graph TB
    subgraph "Vercel — Frontend (Next.js 15)"
        UI[Next.js App Router]
        UI --> HOME[Landing Page<br/>JD + Resume Input]
        UI --> CHAT[Assessment Page<br/>Chat UI + Skill Sidebar]
        UI --> DASH[Results Page<br/>Radar Chart + Learning Plan]
    end

    subgraph "Render — Backend (Node.js + Express)"
        API[Express Router]
        API --> EXT[Skill Extractor Agent]
        API --> ASS[Assessor Agent]
        API --> SCO[Scorer Agent]
        API --> PLN[Planner Agent]
        EXT & ASS & SCO & PLN --> GEM["Gemini 1.5 Flash<br/>(@google/generative-ai)"]
        API --> SESS[In-Memory Session Store<br/>Map + TTL]
        API --> PDF[PDF Parser<br/>(pdf-parse)]
    end

    UI -->|"HTTPS REST (fetch)"| API
    GEM -->|"Google AI API"| CLOUD[(Google Cloud)]

    style UI fill:#6366f1,color:#fff
    style API fill:#10b981,color:#fff
    style GEM fill:#f59e0b,color:#fff
```

---

## 15. Shared TypeScript Types

Both frontend and backend use identical interfaces (copy or publish as shared package):

```typescript
interface Skill {
  name: string;
  requiredLevel: number;
  candidateClaimed: boolean;
}

interface SkillScore {
  skill: string;
  score: number;
  reasoning: string;
  keyEvidence: string[];
}

interface SkillGap {
  skill: string;
  severity: "none" | "minor" | "major";
  delta: number;
  requiredLevel: number;
  actualScore: number;
}

interface LearningResource {
  title: string;
  url: string;
  type: "documentation" | "free_course" | "tutorial" | "project" | "video";
}

interface LearningPlanItem {
  skill: string;
  resources: LearningResource[];
  hoursEstimate: number;
  adjacentLeverage: string;
}

interface AssessmentResults {
  scores: SkillScore[];
  gaps: SkillGap[];
  learningPlan: LearningPlanItem[];
}
```

---

## 16. Submission Checklist

- [ ] Working prototype — deployed Vercel URL + Render URL
- [ ] Public GitHub repo with README (local setup, env vars, architecture)
- [ ] 3–5 min demo video walking through a realistic use case
- [ ] Architecture diagram in `docs/architecture-diagram.png`
- [ ] Scoring logic documented in `docs/architecture.md`
- [ ] Sample inputs/outputs in `docs/sample-io/`
- [ ] Dark mode fully functional
- [ ] Mobile responsive (all 3 screens)
- [ ] PDF upload working
- [ ] Export results as PDF

---

## 17. Out of Scope (Future Versions)

- User accounts & session persistence (Supabase / MongoDB)
- Multi-language resume support
- Interviewer mode (shareable assessment link)
- Real-time streaming responses (SSE)
- LangGraph multi-agent orchestration
- Vector DB for smarter resource recommendations
- Shared types as npm package (monorepo with Turborepo)
