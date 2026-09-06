<div align="center">

# Security Policy

### Meridian — AI Market Research & Strategy Engine

<img src="https://img.shields.io/badge/auth-Supabase_JWT-3ecf8e?style=for-the-badge&labelColor=1a1a1a" />
<img src="https://img.shields.io/badge/disclosure-responsible-BA7517?style=for-the-badge&labelColor=1a1a1a" />

</div>

<br/>

## Table of Contents

- [Reporting a Vulnerability](#reporting-a-vulnerability)
- [Scope](#scope)
- [Existing Safeguards](#existing-safeguards)
- [Secrets & Key Handling](#secrets--key-handling)
- [What We Ask You Not to Do](#what-we-ask-you-not-to-do)
- [Disclosure Timeline](#disclosure-timeline)

<br/>

## Reporting a Vulnerability

If you find a security issue in Meridian, please report it privately rather than opening a public GitHub issue.

- **Preferred:** open a [GitHub security advisory](../../security/advisories/new) on this repository (private by default, visible only to maintainers until resolved).
- **Alternative:** contact a maintainer directly; see [Team Contributions](../README.md#team-contributions) in the main README for who's involved.

Please include:
- A clear description of the issue and its potential impact
- Steps to reproduce it (a minimal example if possible)
- Which part of the system it affects (frontend, backend, or database/schema)

You'll get an acknowledgment as soon as a maintainer sees the report. This is a small, mostly-student-run project without a dedicated security team, so response time may vary, but reports won't be ignored.

<br/>

## Scope

**In scope:**
- The FastAPI backend and its routes (see [API.md](API.md))
- The React/Vite frontend
- Authentication and authorization logic (Supabase JWT verification, ownership checks)
- The database schema and migrations, where a schema-level issue could lead to data exposure

**Out of scope:**
- Vulnerabilities in Supabase, Vercel, Gemini, or Tavily themselves. Report those to the respective vendor
- Issues that require physical or already-compromised-device access to a user's machine
- Missing security headers or best-practice suggestions with no demonstrated exploit (still welcome as a regular GitHub issue, just not as a security report)

<br/>

## Existing Safeguards

Documented in full under [Security Notes](../README.md#security-notes) in the main README; summarized here:

| Safeguard | Summary |
|---|---|
| **Two-tier Supabase keys** | Frontend holds only the anon/public key; the service-role key never leaves the backend. |
| **Server-verified sessions** | Every bearer token is independently re-verified against Supabase on every request. The backend never trusts a client-asserted identity. |
| **Per-user data isolation** | `_ensure_owner` enforces that a user can only read their own jobs, tasks, sources, evidence, validations, and reports. |
| **Restricted CORS** | `CORS_ORIGINS` explicitly allowlists approved frontend origins. |

<br/>

## Secrets & Key Handling

If your report involves an exposed secret (an API key committed to the repo, a leaked service-role key, etc.):

1. Report it privately first, using the channel above. Do not post the secret itself in a public issue or PR comment.
2. If you can confirm which key is exposed, note that in your report so it can be rotated immediately in Supabase / Google AI Studio / Tavily.
3. Rotating a leaked key invalidates it everywhere it's used. Expect a short window of downtime while the new key is redeployed.

<br/>

## What We Ask You Not to Do

- Don't run automated scanners against the live deployment ([the demo](../README.md#live-demo)) without checking in first. The backend has no rate limiting of its own (see [API.md](API.md#rate-limits--timeouts)), and heavy scanning could exhaust the Gemini/Tavily quota shared by real users.
- Don't access, modify, or exfiltrate another user's data beyond the minimum needed to demonstrate the issue.
- Don't publicly disclose a vulnerability before it's been addressed or a reasonable amount of time has passed with no response.

<br/>

## Disclosure Timeline

Since this isn't a funded project with a formal SLA, treat the following as a good-faith target rather than a guarantee:

| Stage | Target |
|---|---|
| Acknowledgment of report | A few days |
| Initial assessment (confirmed / not applicable) | Within about a week |
| Fix or mitigation, for confirmed issues | Varies with severity. Critical auth/data-isolation issues are prioritized first |

We'll credit reporters (by name or handle, your choice) in the fix's commit message or release notes unless you'd prefer to stay anonymous.

