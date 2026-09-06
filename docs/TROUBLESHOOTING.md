<div align="center">

# Troubleshooting

### Common issues when running or deploying Meridian

<img src="https://img.shields.io/badge/covers-setup_%2B_runtime-BA7517?style=for-the-badge&labelColor=1a1a1a" />

</div>

<br/>

> If your issue isn't covered here, check [Known Limitations](../README.md#known-limitations) first — some things that look like bugs are documented trade-offs. Otherwise, open a GitHub issue per [CONTRIBUTING.md](CONTRIBUTING.md#reporting-bugs).

<br/>

## Table of Contents

- [Setup Issues](#setup-issues)
- [Authentication Issues](#authentication-issues)
- [Pipeline / Research Job Issues](#pipeline--research-job-issues)
- [CORS Issues](#cors-issues)
- [Deployment Issues](#deployment-issues)
- [Database / Migration Issues](#database--migration-issues)

<br/>

## Setup Issues

### `pip install -r backend/requirements.txt` fails
- Confirm you're on Python 3.11+ inside an activated virtual environment — some pipeline dependencies don't support older versions.
- On Windows, make sure you activated the venv with `venv\Scripts\activate`, not the macOS/Linux `source venv/bin/activate` form.

### `npm install` fails or the frontend won't start
- Confirm Node.js v18+ is installed (`node -v`).
- Delete `node_modules` and `package-lock.json` and reinstall if you switched Node versions recently.
- Make sure you're running the command from `Frontend McKinsey/vite-project/`, not the repo root.

### Frontend loads but shows a blank page / console errors about `undefined` env vars
- Confirm `.env` exists in `Frontend McKinsey/vite-project/` (copied from `.env.example`) and all three `VITE_*` variables are set.
- Vite only picks up env vars prefixed with `VITE_` — anything else silently won't be exposed to the client.
- Restart the dev server after editing `.env` — Vite doesn't hot-reload environment variable changes.

<br/>

## Authentication Issues

### Login/signup succeeds but every API call returns `401`
- Check that the frontend is actually attaching the bearer token — see `src/api/client.js`'s fetch wrapper.
- Confirm `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the frontend match the **same** Supabase project the backend's `SUPABASE_URL` points to. A mismatch here is the single most common cause of "valid-looking" tokens the backend can't verify.

### Getting `403` on a job you're sure you created
- This is the `_ensure_owner` check working as intended — it usually means you're testing with a different account than the one that created the job (e.g. you signed out and back in with a new email). Confirm which user session is active.

### "Invalid API key" errors from Supabase
- Double-check you copied the **anon/public** key to the frontend and the **service_role** key to the backend — they are not interchangeable, and using the wrong one in the wrong place produces exactly this error.

<br/>

## Pipeline / Research Job Issues

### A research job takes much longer than expected
- Expected: run time varies with upstream API load — see [Performance Metrics](../README.md#performance-metrics) for the normal 45s–2.5min range. Consistently longer than that suggests an upstream issue, not a bug in Meridian itself.
- Check backend logs for repeated retry attempts (see [ARCHITECTURE.md](ARCHITECTURE.md#why-a-synchronous-pipeline)) — frequent retries usually mean Gemini or Tavily is rate-limiting or timing out.

### Job comes back `failed` immediately
- Per the fail-fast design (see [EVALUATION.md](EVALUATION.md#mechanism-3--fail-fast-on-weak-results)), this means some stage returned genuinely empty even after retrying — check backend logs for which stage raised, then:
  - **Planner returned no tasks** → the brief may be too vague or off-topic; try a more specific query.
  - **Research returned no sources** → check `TAVILY_API_KEY` is valid and has remaining quota.
  - **Any LLM-backed stage failed** → check `GOOGLE_API_KEY` is valid and Gemini isn't rate-limiting your project.

### "GOOGLE_API_KEY" or "TAVILY_API_KEY" errors in backend logs
- Confirm both are set in the backend's `.env` (local) or the platform's environment variables (production) — see [DEPLOYMENT.md](DEPLOYMENT.md#2-deploy-the-backend).
- Confirm the keys haven't hit a quota limit or expired on the provider's dashboard.

<br/>

## CORS Issues

### Frontend requests fail with a CORS error in the browser console
- The backend's `CORS_ORIGINS` must exactly match the frontend's origin, including the protocol (`https://`, not `http://`) and with no trailing slash.
- After changing `CORS_ORIGINS`, the backend must be **restarted/redeployed** — most platforms don't hot-reload environment variable changes.
- If you're testing against a Vercel preview deployment (a different URL per PR), remember `CORS_ORIGINS` needs that preview URL added too, not just your main production domain.

<br/>

## Deployment Issues

### Backend deploys successfully but `/health` doesn't respond
- Confirm the start command binds to `0.0.0.0` and the platform's `$PORT`, not a hardcoded `localhost:8000` — see [DEPLOYMENT.md](DEPLOYMENT.md#2-deploy-the-backend).

### Frontend builds on Vercel but shows API errors in production
- Confirm `VITE_API_BASE_URL` in Vercel's environment variables points to the **deployed** backend URL, not `http://localhost:8000`.
- Environment variable changes on Vercel require a redeploy to take effect — a redeploy triggered before you added the variable won't pick it up retroactively.

<br/>

## Database / Migration Issues

### Migration fails partway through
- Migrations must be run **in numeric order** (`001` → `009`) — running them out of order is a common cause of "relation does not exist" errors partway through a later migration.
- If a migration partially applied before failing, check what it created in the Supabase table editor before re-running — re-running a migration that already partially succeeded can cause "already exists" errors.

### `pgvector` extension errors
- Confirm the `pgvector` extension is enabled for your Supabase project (usually handled by the migration itself, but some Supabase plans require enabling extensions manually first via **Database → Extensions**).

