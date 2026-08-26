<div align="center">

# Meridian - AI Market Research & Strategy Engine

### An autonomous multi-agent system that turns a research brief into a fully cited, consulting-grade market report

<br/>

<img src="https://skillicons.dev/icons?i=react,vite,tailwind,fastapi,python,supabase,postgres,vercel&theme=dark" />

<br/><br/>

<img src="https://img.shields.io/badge/status-deployed-2e7d32?style=for-the-badge&labelColor=1a1a1a" />
<img src="https://img.shields.io/badge/frontend-React_19_%2B_Vite-646cff?style=for-the-badge&labelColor=1a1a1a" />
<img src="https://img.shields.io/badge/backend-FastAPI-009688?style=for-the-badge&labelColor=1a1a1a" />
<img src="https://img.shields.io/badge/database-Supabase-3ecf8e?style=for-the-badge&labelColor=1a1a1a" />
<img src="https://img.shields.io/badge/LLM-Gemini-4285f4?style=for-the-badge&labelColor=1a1a1a" />
<img src="https://img.shields.io/badge/search-Tavily-f97316?style=for-the-badge&labelColor=1a1a1a" />

</div>

<br/>

> A signed-in user submits a research brief. Seven specialized AI agents plan, search the live web, extract evidence, validate it, and write a polished report — every finding traceable back to its original source.

<br/>

## Table of Contents

- [What This Project Is](#what-this-project-is)
- [Highlights](#highlights)
- [System Architecture](#system-architecture)
- [The Multi-Agent Research Pipeline](#the-multi-agent-research-pipeline)
- [Backend — FastAPI Service](#backend--fastapi-service)
- [Frontend — React + Vite Dashboard](#frontend--react--vite-dashboard)
- [End-to-End User Flow](#end-to-end-user-flow)
- [Tech Stack](#tech-stack)
- [Getting the Project Running Locally](#getting-the-project-running-locally)
- [Security Notes](#security-notes)
- [Project Status](#project-status)

<br/>

## What This Project Is

This project is an AI-powered market research analyst. A signed-in user submits a research brief — for example *"Analyze the competitive landscape of the EV battery market in Southeast Asia"* — and behind the scenes a pipeline of seven specialized AI agents works in sequence to:

| Step | What happens |
|:---:|---|
| 1 | Break the brief into a structured, searchable research plan |
| 2 | Search the live web for relevant, credible sources |
| 3 | Extract concrete, quotable evidence from each source |
| 4 | Cross-check that evidence for reliability |
| 5 | Turn validated evidence into a polished, structured report |
| 6 | Attach every claim in the report back to its original citation |

The result is served through a McKinsey-styled web dashboard, where the user watches the pipeline run in real time and then reads the final report through a **Report / Evidence / Sources** tabbed view — every key finding traceable back to a live web source.

<br/>

## Highlights

<table>
<tr>
<td width="33%" valign="top">

**Multi-agent pipeline**

Seven purpose-built agents → Planner, Research, Extraction, Validation, Citation, Report, Linker. Each with one job, chained into a single fail-fast pipeline.

</td>
<td width="33%" valign="top">

**Real authentication**

Full Supabase Auth with server-verified JWTs, not a demo gate. Every research job is scoped to its owner and enforced at the API layer.

</td>
<td width="33%" valign="top">

**Full traceability**

Every key finding in the final report links back to the exact evidence and web source that supports it. Nothing is asserted without a citation trail.

</td>
</tr>
</table>

<br/>

## System Architecture

The project is split into two independently deployed halves that communicate over a REST API secured with Supabase Auth.

```mermaid
flowchart TB
    classDef client fill:#DCEBFB,stroke:#185FA5,stroke-width:1.5px,color:#042C53,font-weight:bold
    classDef backend fill:#CFF0E3,stroke:#0F6E56,stroke-width:1.5px,color:#04342C,font-weight:bold
    classDef pipeline fill:#F3EFE6,stroke:#8a8578,stroke-width:1.5px,color:#2C2C2A,font-weight:bold
    classDef external fill:#F0EAFB,stroke:#534AB7,stroke-width:1.5px,color:#26215C,font-weight:bold
    classDef grp fill:transparent,stroke:#999,stroke-dasharray:3 3,color:#666

    subgraph CLIENT["Client — React + Vite"]
        direction LR
        A["Login / Signup"] --> B["Dashboard"] --> C["Research progress"] --> D["Report view<br/>Report · Evidence · Sources"]
    end

    subgraph API["Backend — FastAPI"]
        direction LR
        AUTH["Auth check<br/>Supabase JWT"] --> ROUTES["/api/research · /reports<br/>/evidence · /feedback"]
    end

    subgraph PIPELINE["AI pipeline — 7 sequential agents"]
        direction LR
        P1["1 · Planner"] --> P2["2 · Research"] --> P3["3 · Extraction"] --> P4["4 · Validation"] --> P5["5 · Citations"] --> P6["6 · Report"] --> P7["7 · Linker"]
    end

    subgraph EXT["External services"]
        direction LR
        LLM["Gemini LLM"]
        SEARCH["Tavily search"]
        DB["Supabase<br/>Postgres + pgvector"]
    end

    D -- "HTTPS + bearer token" --> AUTH
    ROUTES --> P1
    P2 <--> SEARCH
    P1 & P3 & P4 & P6 <--> LLM
    ROUTES <--> DB

    class A,B,C,D client
    class AUTH,ROUTES backend
    class P1,P2,P3,P4,P5,P6,P7 pipeline
    class LLM,SEARCH,DB external
    class CLIENT,API,PIPELINE,EXT grp
```

| Layer | Responsibility |
|---|---|
| **Frontend** | React 19 SPA (Vite) — authentication, brief submission, an animated progress screen, and a tabbed report viewer. |
| **Backend** | FastAPI service — enforces authentication, orchestrates the AI pipeline per request, and persists every intermediate artifact so any stage of a job can be queried later. |
| **Database** | Supabase (managed Postgres) — structured relational storage, plus a `pgvector`-backed `memory_records` table for future semantic recall. |

<br/>

## The Multi-Agent Research Pipeline

The heart of the project is `ai/pipeline/research_pipeline.py`, which orchestrates seven sequential stages. Each stage has a single, focused responsibility and hands a typed data structure to the next.

```mermaid
sequenceDiagram
    autonumber
    participant U as User
    participant API as FastAPI
    participant Pl as Planner
    participant R as Research
    participant Ex as Extraction
    participant V as Validation
    participant CB as Citations
    participant Rp as Report
    participant RL as Linker
    participant DB as Supabase

    U->>API: POST /api/research { query }
    API->>DB: create research_job (researching)
    API->>Pl: create_plan(query)
    Pl-->>API: research tasks
    API->>R: research(task) per task
    R-->>API: sources (via Tavily)
    API->>Ex: extract(source) per source
    Ex-->>API: evidence items
    API->>V: validate(evidence, sources)
    V-->>API: validation verdicts
    API->>CB: build(sources)
    CB-->>API: citations
    API->>Rp: generate_report(...)
    Rp-->>API: report
    API->>RL: link_report(...)
    RL-->>API: linked report
    API->>DB: persist report, mark completed
    API-->>U: job_id, title, executive summary
```

| Stage | Module | Responsibility |
|---|---|---|
| **1. Planning** | `ai/planner/planner_agent.py` | Decomposes the raw research brief into a list of discrete, searchable `ResearchTask`s. |
| **2. Research** | `ai/research/research_agent.py` | Executes a live web search per task (via Tavily) and returns candidate `Source`s. |
| **3. Extraction** | `ai/extraction/extraction_agent.py` | Reads each source and pulls out concrete, quotable `Evidence` (claim + supporting quote). |
| **4. Validation** | `ai/validation/validation_agent.py` | Cross-checks each piece of evidence against its source and assigns a confidence verdict. |
| **5. Citation Building** | `ai/report/citation_builder.py` | Converts raw sources into properly formatted citation objects. |
| **6. Report Generation** | `ai/report/report_agent.py` | Synthesizes validated evidence into a structured `Report` (title, executive summary, key findings). |
| **7. Report Linking** | `ai/report/report_linker.py` | Rewrites the report so every key finding links to its supporting evidence and citation — powers the Evidence / Sources tabs. |

> **Fail-fast by design.** If any stage returns an empty result (no tasks, no sources, no evidence...), the pipeline raises immediately instead of silently producing a hollow report, and the job is marked `failed`.

**LLM & search providers**
- **Gemini** (`google-genai`) — the reasoning engine behind the Planner, Extraction, Validation, and Report agents (`ai/llm/gemini.py`).
- **Tavily** — the live web search provider used by the Research agent (`ai/browser/tavily_search.py`), with a `mock_search.py` fallback for offline development.

<br/>

## Backend — FastAPI Service

**Location:** `Backend McKinsey/mckinsey-research-engine/`

<details>
<summary><b>Backend folder structure</b></summary>

```
backend/
├── main.py                  # FastAPI app factory, middleware, routers
├── core/
│   ├── config.py             # Pydantic settings loaded from .env
│   ├── auth.py                # Supabase JWT verification dependency
│   ├── errors.py              # Centralized AppError → HTTP response mapping
│   └── logging.py             # Structured logging configuration
├── middleware/
│   └── request_id.py          # Attaches a unique request ID to every request
├── api/
│   ├── research.py             # Create + inspect research jobs (the core workflow)
│   ├── reports.py              # Fetch generated reports
│   ├── evidence.py              # Fetch raw evidence records
│   └── feedback.py               # Reviewer feedback on reports
├── repositories/                # One repository per table — all Supabase reads/writes
├── services/
│   └── research_service.py       # Bridges the API layer to the AI pipeline
└── db/
    ├── supabase_client.py         # Supabase client singleton
    └── migrations/                  # Ordered SQL migrations (001 → 009)
```

</details>

### Authentication & Authorization

Every protected route depends on `get_current_user` (`backend/core/auth.py`):

1. The frontend sends the Supabase session's access token as a `Bearer` token in the `Authorization` header.
2. The backend calls `supabase.auth.get_user(token)` to verify the token server-side against Supabase.
3. If valid, the authenticated `user` object is injected into the route; if not, a `401` is raised.
4. On job-scoped routes (`/api/research/{job_id}/...`), an additional `_ensure_owner` check confirms the requesting user actually created that job — returning `403` otherwise.

> No research job or report is ever visible to a user who didn't create it, even if they know the job's UUID.

### API Surface

| Method | Route | Purpose |
|:---:|---|---|
| `GET` | `/` | Service metadata / liveness |
| `GET` | `/health` | Health check for uptime monitors / deploy platforms |
| `GET` | `/api/research/` | List all research jobs owned by the current user |
| `POST` | `/api/research/` | Submit a new brief → runs the full pipeline synchronously → returns the completed job |
| `GET` | `/api/research/{job_id}` | Fetch job status/metadata |
| `GET` | `/api/research/{job_id}/tasks` | Planner-generated research tasks |
| `GET` | `/api/research/{job_id}/sources` | Sources discovered during research |
| `GET` | `/api/research/{job_id}/evidence` | Extracted evidence items |
| `GET` | `/api/research/{job_id}/validations` | Validation verdicts per evidence item |
| `GET` | `/api/research/{job_id}/report` | The final generated report |

### Database Schema (Supabase / Postgres)

Nine ordered migrations build the schema incrementally:

| # | Migration | Table(s) created |
|:---:|---|---|
| 001 | Initial schema / Research Jobs | `research_jobs` |
| 002 | Planner Tasks | `planner_tasks` |
| 003 | Sources | `sources` |
| 004 | Evidence | `evidence` |
| 005 | Validation Records | `validation_records` |
| 006 | Memory | `memory_records` — `pgvector` column for future semantic search |
| 007 | Reports | `reports` |
| 008 | Feedback | `feedback` |
| 009 | Indexes | Indexes on `evidence.job_id`, `planner_tasks.job_id`, and an `ivfflat` vector index on `memory_records.embedding` |

`research_jobs.created_by` and `feedback.reviewer_id` both reference `auth.users(id)`, tying every record directly to a Supabase Auth identity — this is what makes per-user data isolation possible.

### Backend Environment Variables

```env
# Search / AI provider keys used by the research pipeline
GOOGLE_API_KEY=          # Gemini API key
TAVILY_API_KEY=          # Tavily web search API key

# Supabase project (Project Settings > API in the Supabase dashboard)
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_KEY=            # SERVICE ROLE key — backend only, never expose to the frontend
```

<br/>

## Frontend — React + Vite Dashboard

**Location:** `Frontend McKinsey/vite-project/`

<details>
<summary><b>Frontend folder structure</b></summary>

```
src/
├── App.jsx                     # Route definitions
├── main.jsx                     # React entry point
├── context/
│   ├── AuthContext.jsx           # Supabase session state, login/signup/logout
│   └── ThemeContext.jsx           # Light/dark theme toggle
├── components/
│   ├── ProtectedRoute.jsx          # Redirects unauthenticated users to /login
│   ├── AuthLayout.jsx               # Shared shell for Login/Signup
│   ├── Shell.jsx                     # Main app shell (nav, layout) for authenticated pages
│   ├── StatusBadge.jsx                # Visual pipeline-status indicator
│   └── Footer.jsx
├── pages/
│   ├── Login.jsx / Signup.jsx           # Supabase Auth screens
│   ├── Dashboard.jsx                      # List of past research jobs + "new research" entry point
│   ├── ResearchProgress.jsx                 # Animated live view of the 7-stage pipeline running
│   ├── ReportView.jsx                        # Tabbed final output: Report / Evidence / Sources
│   ├── Methodology.jsx                        # Explains how the AI pipeline works, for end users
│   └── AboutProject.jsx                        # Project background page
├── api/
│   └── client.js                # Central fetch wrapper — attaches the Supabase bearer token to every request
└── lib/
    └── supabaseClient.js         # Supabase JS client singleton (anon key)
```

</details>

### Routing Map

| Route | Page | Access |
|---|---|:---:|
| `/login` | `Login` | Public |
| `/signup` | `Signup` | Public |
| `/` | `Dashboard` | Protected |
| `/research/new` | `ResearchProgress` | Protected |
| `/research/:jobId` | `ReportView` | Protected |
| `/methodology` | `Methodology` | Protected |
| `/about` | `AboutProject` | Protected |
| `*` | → redirects to `/` | — |

`ProtectedRoute` wraps every authenticated page and reads session state from `AuthContext`; unauthenticated visitors are always redirected to `/login`.

### Design System

The UI follows a navy-and-gold "Meridian" consulting brand intended to evoke a McKinsey-style strategy deliverable: dark navy chrome, gold accent highlights, and clean, data-forward typography.

| Concern | Library |
|---|---|
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion — used heavily on the live `ResearchProgress` screen |
| Icons | Lucide React, React Icons, FontAwesome |

### Frontend Environment Variables

```env
# Supabase project settings (Project Settings > API in the Supabase dashboard)
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=paste-your-anon-public-key-here   # public/anon key only

# Base URL of the FastAPI backend
VITE_API_BASE_URL=http://localhost:8000
```

> The frontend must only ever use the Supabase anon/public key. The service role key belongs exclusively in the backend `.env` and must never ship to the browser.

<br/>

## End-to-End User Flow

```mermaid
flowchart LR
    classDef step fill:#DCEBFB,stroke:#185FA5,stroke-width:1.5px,color:#042C53
    classDef decision fill:#FAEEDA,stroke:#BA7517,stroke-width:1.5px,color:#633806
    classDef tab fill:#F0EAFB,stroke:#534AB7,stroke-width:1.5px,color:#26215C

    A(["User visits site"]) --> B{"Has account?"}
    B -- No --> C["Sign up<br/>Supabase Auth"]
    B -- Yes --> D["Log in"]
    C --> E["Dashboard"]
    D --> E
    E --> F["Submit new brief"]
    F --> G["Research progress<br/>animates 7 pipeline stages live"]
    G --> H["Backend runs full AI pipeline"]
    H --> I["Report view"]
    I --> J{"Tabs"}
    J --> K["Report<br/>synthesized findings"]
    J --> L["Evidence<br/>extracted claims + quotes"]
    J --> M["Sources<br/>original links + credibility"]

    class A,C,D,E,F,H,I step
    class B,J decision
    class K,L,M tab
```

1. A new user signs up or an existing user logs in through Supabase Auth on the frontend.
2. Once authenticated, the user lands on the Dashboard, listing any research jobs they've previously run.
3. Submitting a new brief navigates to `/research/new`, where the Research Progress screen calls `POST /api/research/` and animates the pipeline while the backend works.
4. The backend runs the entire seven-stage pipeline synchronously, persisting every intermediate artifact to Supabase, and returns the completed job.
5. The user lands on `/research/:jobId` — the Report View — and moves between Report, Evidence, and Sources tabs, from the final narrative down to the original web source behind any individual claim.

<br/>

## Tech Stack

<div align="center">

| Layer | Technology |
|---|---|
| Frontend framework | React 19 + Vite |
| Frontend styling | Tailwind CSS v4, Framer Motion |
| Frontend auth | Supabase JS client (`@supabase/supabase-js`) |
| Routing | React Router v7 |
| Backend framework | FastAPI (Python) |
| Backend server | Uvicorn |
| Config management | Pydantic Settings |
| Database | Supabase (Postgres) + `pgvector` |
| Backend auth | Supabase Auth (server-side JWT verification) |
| LLM provider | Google Gemini (`google-genai`) |
| Web search provider | Tavily |
| Deployment (frontend) | Vercel (`vercel.json` present) |

</div>

<br/>

## Getting the Project Running Locally

These are the exact steps to take this codebase from a fresh clone to a fully working local instance.

### Step 1 — Prerequisites
Install Git, Node.js (v18+), and Python (3.11+).

### Step 2 — Set Up Supabase
1. Create a new project at [supabase.com](https://supabase.com).
2. In the SQL editor, run each file in `backend/db/migrations/` in numeric order (`001` → `009`) to build the full schema, including the `pgvector` extension and indexes.
3. From Project Settings → API, copy:
   - The Project URL
   - The anon/public key (for the frontend)
   - The service_role key (for the backend only)

### Step 3 — Backend Setup
```bash
cd "Backend McKinsey/mckinsey-research-engine"
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r backend/requirements.txt

cp .env.example .env
# then fill in: GOOGLE_API_KEY, TAVILY_API_KEY, SUPABASE_URL, SUPABASE_KEY (service role)

uvicorn backend.main:app --reload --port 8000
```
The API will be live at `http://localhost:8000`, with interactive docs at `http://localhost:8000/docs`.

### Step 4 — Frontend Setup
```bash
cd "Frontend McKinsey/vite-project"
npm install

cp .env.example .env
# then fill in: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_API_BASE_URL=http://localhost:8000

npm run dev
```
The app will be live at `http://localhost:5173`.

### Step 5 — Verify
1. Open the frontend, sign up for a new account.
2. Submit a test research brief and confirm the progress screen animates through the pipeline stages.
3. Confirm the completed job produces a report with populated Report, Evidence, and Sources tabs.

### Step 6 — Deploy to Production
- **Frontend** — deploy via Vercel using the included `vercel.json`; set the three `VITE_*` environment variables, pointing `VITE_API_BASE_URL` at the deployed backend URL.
- **Backend** — deploy the FastAPI app to your platform of choice (Render, Railway, Fly.io); set `SUPABASE_URL`, `SUPABASE_KEY` (service role), `GOOGLE_API_KEY`, `TAVILY_API_KEY`, and `CORS_ORIGINS` (comma-separated list including the deployed frontend domain).

<br/>

## Security Notes

| Safeguard | Description |
|---|---|
| **Two-tier Supabase keys** | The anon/public key (safe for the browser) is used by the frontend for auth only; the service-role key (full database access) is confined to the backend and never exposed client-side. |
| **Server-verified sessions** | The backend never trusts client-supplied identity — every bearer token is independently verified against Supabase on every call. |
| **Per-user data isolation** | Job ownership is enforced at the API layer (`_ensure_owner`), so users can only ever read their own jobs, tasks, sources, evidence, validations, and reports. |
| **Restricted CORS** | `CORS_ORIGINS` explicitly allowlists origins rather than leaving the API open, so only approved frontend domains may call it. |

<br/>

## Project Status

<div align="center">

**This repository represents the final, deployed state of the Meridian AI Market Research & Strategy Engine**, a working, end-to-end multi-agent research application spanning authentication, a seven-stage AI pipeline, full evidence traceability, and a polished consulting-styled UI.

<br/>

<img src="https://img.shields.io/badge/pipeline-7%20agents-534AB7?style=for-the-badge&labelColor=1a1a1a" />
<img src="https://img.shields.io/badge/auth-Supabase%20JWT-3ecf8e?style=for-the-badge&labelColor=1a1a1a" />
<img src="https://img.shields.io/badge/traceability-source--linked-0F6E56?style=for-the-badge&labelColor=1a1a1a" />

</div>
