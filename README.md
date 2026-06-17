# Career Tracker Pro


A smart job tracking application powered by AI agents. Built with a composable agent architecture, enabling intelligent resume analysis and job matching.

## Overview

Job Smart Tracker is an AI-powered job application management system. It lets users track job applications, upload resumes for AI analysis, and get insights on their skills and experience.

Core features:

- Upload a resume and have it analyzed by AI (skills, experience, education extraction)
- Track job applications with status updates (Applied, Interview, Offer, Rejected)
- Composable AI agent architecture for resume analysis, job matching, and recommendations
- Deployable to the web

## Tech Stack

| Layer    | Technology                                                                 |
| -------- | -------------------------------------------------------------------------- |
| Frontend | React + Vite + Tailwind CSS                                                |
| Backend  | Node.js + Express                                                          |
| Database | MySQL (local) / PlanetScale (production)                                   |
| AI Model | Llama 3.1 8B (`llama-3.1-8b-instant`) via Groq Inference API              |

## Agent Architecture

- **Resume Agent** — Parses resume, extracts skills, experience, and education
- **Match Agent** — Scores resume against job requirements, highlights matching and missing skills
- **Recommend Agent** _(coming soon)_ — Generates personalized job recommendations

Each agent is independent and can be swapped or extended individually.

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL 8.0+
- A free [Groq](https://console.groq.com) account and API key

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in your DB credentials and GROQ_API_KEY in .env
node src/app.js
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

```
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=job_tracker
GROQ_API_KEY=gsk_...
```

## Future Plans

- Deploy as a live web service (PlanetScale + Render/Railway)
- Add user authentication
- Integrate job search API
- Add job match scoring with explanations
