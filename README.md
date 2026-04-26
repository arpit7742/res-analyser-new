SkillProbe — AI-Powered Skill Assessment & Learning Plan

An AI agent that takes a Job Description and a candidate's resume, conversationally assesses real proficiency on each required skill, identifies gaps, and generates a personalised learning plan with curated resources and time estimates.

## 🏗️ Architecture

```
[Next.js Frontend] → [Express Backend] → [Gemini 1.5 Flash]
     (Vercel)           (Render)           (Google AI)
```

## Architecture digram

<img width="1440" height="1640" alt="image" src="https://github.com/user-attachments/assets/88defed5-f8bf-45aa-a5f0-04447d236697" />


**Agent Pipeline:** Skill Extractor → Assessor (3-5 Q&A per skill) → Scorer → Gap Analyzer → Learning Planner

See [docs/architecture.md](docs/architecture.md) for detailed scoring logic.

## Agentic pipline architecture

<img width="1536" height="1024" alt="image" src="https://github.com/user-attachments/assets/aaecfa3f-a466-42d6-9c23-1b2b7924ab3d" />


## 🚀 Local Setup

### Prerequisites
- Node.js 20+
- Gemini API key ([get free key](https://aistudio.google.com/apikey))

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
npm install
npm run dev
```

Server runs on `http://localhost:3001`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs on `http://localhost:3000`

## 🌐 Deployment

### Frontend → Vercel
1. Import repo on Vercel
2. Set root directory to `frontend`
3. Add env: `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api`

### Backend → Render
1. Create new Web Service on Render
2. Set root directory to `backend`
3. Build command: `npm install && npm run build`
4. Start command: `npm start`
5. Add env: `GEMINI_API_KEY`, `ALLOWED_ORIGINS=https://your-frontend.vercel.app`

## 📁 Project Structure

```
├── frontend/          Next.js 15 + TypeScript + Tailwind CSS
│   └── src/
│       ├── app/       Pages (home, assessment, results)
│       ├── components/ UI components
│       ├── store/     Zustand state management
│       └── lib/       API client, utilities
├── backend/           Node.js + Express + TypeScript
│   └── src/
│       ├── agents/    Gemini-powered AI agents
│       ├── prompts/   Prompt templates
│       ├── routes/    API endpoints
│       └── services/  Gemini client, session store, PDF parser
└── docs/              Architecture docs + sample I/O
```

## 🎯 Features

- **Conversational Assessment** — 3-5 adaptive questions per skill
- **Scoring** — 0-100 with reasoning and evidence
- **Gap Analysis** — Required vs actual with severity levels
- **Learning Plan** — Curated free resources + time estimates
- **Dark Mode** — System preference + manual toggle
- **PDF Upload** — Parse resume PDFs automatically
- **Responsive** — Works on mobile and desktop

## 📊 Sample I/O

See [docs/sample-io/](docs/sample-io/) for example inputs and outputs.

## 🔧 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, Zustand, Framer Motion, Recharts |
| Backend | Node.js 20, Express, TypeScript, Zod |
| AI | Gemini 1.5 Flash (free tier) via @google/generative-ai |
| Deploy | Vercel (frontend) + Render (backend) |
