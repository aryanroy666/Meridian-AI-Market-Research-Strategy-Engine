<div align="center">

# API Reference

### Meridian - FastAPI backend

<img src="https://img.shields.io/badge/base_url-%2Fapi-185FA5?style=for-the-badge&labelColor=1a1a1a" />
<img src="https://img.shields.io/badge/auth-Bearer_JWT-3ecf8e?style=for-the-badge&labelColor=1a1a1a" />
<img src="https://img.shields.io/badge/docs-%2Fdocs%20(Swagger)-BA7517?style=for-the-badge&labelColor=1a1a1a" />

</div>

<br/>

> Interactive, always-current documentation is also generated automatically by FastAPI at `/docs` (Swagger UI) and `/redoc` on any running instance of the backend. This file is the narrative companion to what each route is for and how the pieces fit together, and not a replacement for it.

<br/>

## Table of Contents

- [Authentication](#authentication)
- [Base URL](#base-url)
- [Service Routes](#service-routes)
- [Research Routes](#research-routes)
- [Job-Scoped Sub-Resources](#job-scoped-sub-resources)
- [Error Responses](#error-responses)
- [Rate Limits & Timeouts](#rate-limits--timeouts)

<br/>

## Authentication

Every route under `/api/research` requires a valid Supabase session token, sent as a standard bearer token:

```
Authorization: Bearer <supabase-access-token>
```

**How it's verified** (`backend/core/auth.py`):

1. The frontend obtains the token from its active Supabase Auth session.
2. On each request, the backend calls `supabase.auth.get_user(token)`, verifying the token **server-side against Supabase**, not just decoding it locally.
3. If the token is valid, the resolved `user` is injected into the route handler via the `get_current_user` dependency.
4. If it's missing, expired, or invalid, the route returns `401 Unauthorized` before any handler logic runs.

**Ownership checks.** Routes scoped to a specific job (anything under `/api/research/{job_id}/...`) run an additional `_ensure_owner` check: the authenticated user must be the one who created that job, or the route returns `403 Forbidden` even if the `job_id` itself is a valid, existing UUID. There is no route that lets one user read another user's research job, tasks, sources, evidence, or report.

<br/>

## Base URL

| Environment | URL |
|---|---|
| Local development | `http://localhost:8000` |
| Production | Whichever host you deploy the FastAPI service to (Render, Railway, Fly.io, etc.), set as `VITE_API_BASE_URL` in the frontend's environment |

<br/>

## Service Routes

Unauthenticated - used for liveness checks and deploy platform health probes.

| Method | Route | Purpose |
|:---:|---|---|
| `GET` | `/` | Service metadata confirms the API is up and responding |
| `GET` | `/health` | Health check endpoint, intended for uptime monitors and deployment platforms |

<br/>

## Research Routes

All require the `Authorization` header described above.

### Create a research job

```
POST /api/research/
```

Submits a new research brief. This call runs the **entire seven-stage pipeline synchronously**: Planning → Research → Extraction → Validation → Citations → Report → Linking. It only returns once it finishes. There is no separate "poll for status" route; the frontend's animated progress screen is a client-side timeline rather than a server-pushed status feed (see [Known Limitations](../README.md#known-limitations) in the main README).

**Request body**

```json
{
  "query": "Analyze the competitive landscape of the EV battery market in Southeast Asia"
}
```

**Response** - the completed job, including at minimum its `job_id`, `title`, and executive summary. The full report body is fetched separately via the report sub-resource below.

**Possible outcomes**

| Status | Meaning |
|:---:|---|
| `200` | Pipeline completed; job is `completed` |
| `401` | Missing or invalid bearer token |
| Job marked `failed` | Any pipeline stage returned an empty result even after its retries (see [Evaluation & Reliability](../README.md#evaluation--reliability)) |

### List your research jobs

```
GET /api/research/
```

Returns every research job owned by the authenticated user. This is what powers the Dashboard's job list. Never returns another user's jobs.

### Get a single job

```
GET /api/research/{job_id}
```

Returns status and metadata for one job. `403` if the job exists but belongs to a different user.

<br/>

## Job-Scoped Sub-Resources

Each of these drills into one stage's output for a specific job. The same ownership check applies to all of them.

| Method | Route | Returns |
|:---:|---|---|
| `GET` | `/api/research/{job_id}/tasks` | The Planner's decomposed `ResearchTask`s for this job |
| `GET` | `/api/research/{job_id}/sources` | Sources the Research agent found via Tavily |
| `GET` | `/api/research/{job_id}/evidence` | Evidence items the Extraction agent pulled from those sources |
| `GET` | `/api/research/{job_id}/validations` | Confidence verdicts the Validation agent assigned to each evidence item |
| `GET` | `/api/research/{job_id}/report` | The final linked report is what backs the Report / Evidence / Sources tabs in the UI |

Together, `evidence` + `validations` + `sources` are what let the frontend trace any key finding in the report all the way back to a specific web page.

<br/>

## Error Responses

| Status | When it happens |
|:---:|---|
| `401 Unauthorized` | No bearer token, or the token failed Supabase verification |
| `403 Forbidden` | Token is valid, but the authenticated user doesn't own the requested job |
| `404 Not Found` | `job_id` doesn't correspond to any existing job |
| `422 Unprocessable Entity` | Request body failed validation (e.g. missing `query`) |
| `500 Internal Server Error` | Unhandled backend error is mapped centrally in `backend/core/errors.py` |

<br/>

## Rate Limits & Timeouts

There's no application-level rate limiting on the API itself. In practice, throughput is bounded by the upstream Gemini and Tavily APIs the pipeline calls, see [Performance Metrics](../README.md#performance-metrics) in the main README for typical end-to-end run times under normal vs. heavy upstream load.

