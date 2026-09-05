<div align="center">

# Testing

### Current state and a recommended approach for Meridian

<img src="https://img.shields.io/badge/automated_tests-none_yet-A32D2D?style=for-the-badge&labelColor=1a1a1a" />
<img src="https://img.shields.io/badge/manual_verification-documented-BA7517?style=for-the-badge&labelColor=1a1a1a" />

</div>

<br/>

> **Honesty upfront:** there is no automated test suite in this repository today. This doc covers how to manually verify the system now, and lays out a concrete, low-effort way to start adding automated tests — it's a starting point, not a description of existing coverage.

<br/>

## Table of Contents

- [Current State](#current-state)
- [Manual Verification (What Exists Today)](#manual-verification-what-exists-today)
- [Recommended: Where to Start](#recommended-where-to-start)
- [Backend Testing Plan](#backend-testing-plan)
- [Frontend Testing Plan](#frontend-testing-plan)
- [Pipeline-Specific Testing](#pipeline-specific-testing)
- [Suggested Tooling](#suggested-tooling)

<br/>

## Current State

| Layer | Automated tests | Manual verification |
|---|:---:|---|
| Backend (FastAPI, pipeline agents) | None | Run a real research brief end-to-end locally |
| Frontend (React components, routing) | None | Click through the app manually per the checklist below |
| Database migrations | None | Run migrations against a fresh Supabase project and confirm no errors |

This lines up with [Evaluation & Reliability](EVALUATION.md) — reliability today comes from the pipeline's own structural checks (validation stage, fail-fast behavior), not from a test suite that verifies the code itself.

<br/>

## Manual Verification (What Exists Today)

This is the same checklist from [Getting the Project Running Locally](../README.md#getting-the-project-running-locally) — run it after any nontrivial change:

1. Sign up for a new account through the frontend.
2. Submit a test research brief and confirm the progress screen runs through to completion.
3. Confirm the completed job produces a report with populated Report, Evidence, and Sources tabs.
4. Spot-check 2–3 findings against their linked sources (see [EVALUATION.md](EVALUATION.md#how-to-manually-spot-check-a-report-today) for the full process).

<br/>

## Recommended: Where to Start

Adding a full test suite all at once is a big lift. A more realistic path:

1. **Start with the backend's pure logic** — things like the Citation Builder or Report Linker's linking logic are the easiest to unit test, since they transform typed data without needing a live LLM or web search call.
2. **Add one integration test for the happy path** — a single test that runs `POST /api/research/` against a mocked LLM/search response and asserts a `completed` job comes back with a report. This catches "the pipeline is completely broken" regressions cheaply.
3. **Add auth tests next** — confirm a request with no token gets `401`, and a request for another user's job gets `403`. These are cheap to write and protect the most security-sensitive behavior in the app.
4. **Frontend tests last** — component and route tests matter, but they're lower-risk to skip initially since a broken UI is usually caught immediately in manual use, unlike a silent backend regression.

<br/>

## Backend Testing Plan

| Area | What to test | Suggested approach |
|---|---|---|
| Citation Builder | Given raw sources, produces correctly formatted citation objects | Pure unit test, no mocking needed |
| Report Linker | Given a report and evidence, every key finding gets a citation link | Unit test with fixture data |
| Auth dependency (`get_current_user`) | Missing/invalid token → `401`; valid token → user injected | Unit test with a mocked Supabase client |
| Ownership check (`_ensure_owner`) | Non-owner request → `403` | Unit test with two fixture users |
| Full pipeline (`research_pipeline.py`) | A brief produces a `completed` job with all sub-resources populated | Integration test with mocked Gemini/Tavily calls — **do not hit real APIs in CI** |
| Fail-fast behavior | An empty result at any stage marks the job `failed`, not silently continues | Integration test forcing an empty return from one stage |

<br/>

## Frontend Testing Plan

| Area | What to test | Suggested approach |
|---|---|---|
| `ProtectedRoute` | Unauthenticated visitor is redirected to `/login` | Component test with a mocked `AuthContext` |
| `AuthContext` | Login/signup/logout update session state correctly | Unit test with a mocked Supabase client |
| Routing map | Each route in [the Routing Map](../README.md#routing-map) renders the expected page | Integration test with a router wrapper |
| `ResearchProgress.jsx` | Animation renders all seven stages without crashing given a mock job state | Component test |

<br/>

## Pipeline-Specific Testing

The pipeline's dependency on real, paid external APIs (Gemini, Tavily) makes it a poor fit for hitting them directly in automated tests. Recommended pattern:

- Mock `ai/llm/gemini.py` and `ai/browser/tavily_search.py` at the boundary in tests, returning fixed fixture responses.
- The repo already has `mock_search.py` as an offline fallback for the Research agent — that's a natural seam to reuse for test fixtures rather than building a second mocking layer.
- Keep a small, fixed set of fixture briefs (e.g. one that should clearly succeed, one designed to produce low-confidence evidence) so pipeline behavior can be checked deterministically. This overlaps with the "benchmark briefs" idea in [ROADMAP.md](ROADMAP.md#automated-report-evaluation).

<br/>

## Suggested Tooling

| Layer | Suggested tools |
|---|---|
| Backend | `pytest`, `pytest-asyncio` (FastAPI routes are async), `httpx` for calling the app in-process |
| Frontend | `vitest` (pairs naturally with Vite), `@testing-library/react` |
| CI | GitHub Actions workflow running both suites on every PR |

None of this is installed yet — treat this table as a starting shopping list, not a claim about the current `requirements.txt` / `package.json`.

