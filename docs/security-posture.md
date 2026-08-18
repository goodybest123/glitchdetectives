# Security Posture — Glitch Detectives

**Last reviewed:** 2026-08-18
**Scope:** Full-stack web application (TanStack Start + Lovable Cloud + Cloudflare Workers)
**Target audience:** Hackathon judges, future maintainers, and anyone evaluating the safety of an AI-powered educational product for children.

## 1. Executive Summary

Glitch Detectives is designed as a low-risk, privacy-first educational experience:

- **No child accounts or PII:** Users do not sign up, log in, or provide any personal information to play. Progress is stored only in the browser's `localStorage`.
- **No database writes by learners:** All AI tutoring, grading, and diagnostic logic is stateless and uses short-lived API calls.
- **AI is gated by strict prompts and structured outputs:** ZED-4 (the in-game robot) cannot give answers and must validate the child's own explanation before a case is closed.
- **Dependencies are kept current:** The dependency tree is scanned before every presentation and patched when advisories are found.

This document explains the architecture, active controls, and known limitations so the security posture can be verified and reproduced.

## 2. Architecture & Threat Model

```text
Browser (child/parent)
  ├── localStorage: progress, diagnostic report, audio preferences
  └── React UI ──► TanStack Router ──► TanStack Start server functions

TanStack Start (Cloudflare Worker)
  ├── API routes /api/chat/* ──► Lovable AI Gateway ──► Google Gemini 3 Flash
  └── Server function /gradeExplanation ──► Lovable AI Gateway ──► Gemini 3 Flash

External services
  ├── Lovable AI Gateway (API key auth, no PII in prompts)
  └── Supabase (auth middleware available, but unused for public routes)
```

### Key assets & threats

| Asset | Threat | Control |
|-------|--------|---------|
| Child's free-text explanation | Injection, prompt leakage, abuse of AI API | Zod validation, role/content limits, message length caps, strict system prompts |
| AI API key (`LOVABLE_API_KEY`) | Leakage | Server-only read; never exposed to the browser |
| Diagnostic report | Leakage of child progress | Stored in `localStorage` only; no server-side persistence |
| Public API endpoints | Spam / abuse | Input size and count limits; no write-side effects on the backend |
| Dependencies | Known vulnerabilities | Automated `npm audit` / `security--dependency_scan` checks |

## 3. Input Validation & Abuse Protection

All AI endpoints validate input before it reaches the model:

### Chat endpoints (`/api/chat/*`)

Shared helper: `src/lib/chat-validation.ts`

- `messages` must be an array.
- Each message must have a valid role (`user`, `assistant`, `system`) and a string content.
- Maximum 50 messages per request.
- Individual message content capped at 2,000 characters.
- Total content across all messages capped at 8,000 characters.
- Empty or malformed bodies return `400 Bad Request`.

### Grading endpoint (`/api/gradeExplanation`)

Schema: `src/lib/report.functions.ts` (Zod)

- `caseTitle`: 1–100 characters
- `subTitle`: 1–120 characters
- `glitchSummary`: 1–200 characters
- `conceptMastered`: 1–200 characters
- `childExplanation`: 1–2,000 characters

These bounds prevent oversized prompts, reduce token costs, and make prompt-injection attempts harder to hide.

### Rate limiting

There is no application-level rate limiter because the backend is intentionally stateless and there is no persistent user identity. The platform layers provide:

- **Cloudflare edge DDoS protection** on the published and preview domains.
- **Lovable AI Gateway quotas** on the upstream API key.

A future hardening step would add a lightweight per-IP or per-session rate limit using Cloudflare's `CF-Connecting-IP` header with a small in-memory or KV-backed store.

## 4. AI Safety & Output Guardrails

ZED-4 is intentionally designed to be a "wrong-believing" robot that cannot solve the problem for the child. This is enforced in multiple layers:

### 4.1. System prompt constraints

Every case route has a strict `SYSTEM_PROMPT` that tells the model:

- The target audience is a Grade 1 child (~6 years old).
- Use only age-appropriate vocabulary; avoid formal fraction notation, denominators, numerators, percentages, etc.
- Ask one tiny question at a time.
- **Never give the answer.** Guide with questions only.
- Close the case only after the child demonstrates the idea in their own words.
- Append a special `[[CASE_SOLVED]]` token only when the learning goal is met.

### 4.2. Structured output grading

The diagnostic report uses `generateText` with `experimental_output: Output.object({ schema: Schema })` and the Zod schema forces:

- Verdict limited to `correct` | `partial` | `review`.
- Understanding level clamped to 1–5.
- Exactly four insight dimensions, one for each cognitive skill.
- Maximum field lengths on every textual output.

### 4.3. Fallback normalization

If the structured output call fails, a second plain-JSON prompt is attempted. If both fail, the server returns a safe default report (`verdict: "review"`, level 3, empty rubric, generic next step) rather than throwing a raw error to the client.

### 4.4. No adult content path

The product only accepts text related to the fraction cases. The narrow prompts and bounded inputs mean there is no general-purpose chat surface that could be repurposed.

## 5. Authentication & Authorization

- **No public authentication required.** The game, report, and printables are open to all visitors.
- **Supabase auth middleware is available but unused** for these public educational routes. `src/integrations/supabase/auth-middleware.ts` validates bearer tokens via Supabase, and `src/integrations/supabase/auth-attacher.ts` attaches the browser session when present. Neither is enforced on the learning flows.
- **Child accounts are not created.** This eliminates the entire class of account-takeover, password-leak, and child-PII risks.
- **Future authenticated features** (e.g., parent dashboard) should be placed under `src/routes/_authenticated/` and use the generated `requireSupabaseAuth` middleware.

## 6. Data Privacy & Storage

- **No PII collected.** Name, email, age, location, or device identifiers are not asked for or stored.
- **Progress lives in `localStorage`.** It can be cleared by the user at any time and never leaves the browser unless the user explicitly prints or downloads a report.
- **Printables are static files.** No sign-in or tracking is needed to preview or download the PDFs.
- **AI prompts contain only the case context and the child's explanation.** No names, IDs, or metadata are attached.
- **No analytics or third-party tracking scripts** are included in the application bundle.

## 7. Dependency & Supply-Chain Hygiene

- `package.json` pins `@tanstack/*` and other core packages to recently patched versions.
- `bun install` is used to generate a text `bun.lock` lockfile.
- `security--dependency_scan` is run before presentations to catch high/critical advisories.
- The most recent scan (2026-08-18) returned **no high or critical vulnerabilities** after patching `@tanstack/react-router`, `@tanstack/react-start`, and `@tanstack/router-plugin`.

## 8. Deployment & Hosting

- **Frontend:** TanStack Start SSR application hosted on Lovable Cloud (Cloudflare Workers).
- **Backend:** Lovable Cloud (Supabase) is connected but only used for auth when required; no learner-facing tables are in scope.
- **API key:** `LOVABLE_API_KEY` is injected into the server runtime and is never readable in the browser.
- **Published URL:** `https://glitchdetectives.lovable.app`

### Security headers

The application relies on the Cloudflare edge for TLS, HSTS, and DDoS protection. A future hardening step would add an explicit `Content-Security-Policy`, `X-Frame-Options`, and `Permissions-Policy` header in the SSR response wrapper in `src/server.ts`.

## 9. Known Limitations & Next Steps

| Priority | Item | Recommendation |
|----------|------|------------------|
| Medium | Application-level rate limiting | Add per-IP or per-session limits on `/api/chat/*` and `/gradeExplanation` using a Cloudflare KV or short-lived memory cache. |
| Medium | Explicit security headers | Set `Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options`, and `Permissions-Policy` in `src/server.ts`. |
| Low | Audit logging | If parent dashboards are added later, log AI grading requests server-side without storing child explanations verbatim. |
| Low | Fuzz testing of AI inputs | Periodically run a small test suite that sends malformed, long, and off-topic messages to verify validation. |

## 10. Reproduction Checklist

A reviewer can verify this posture in about 5 minutes:

1. **Run a dependency scan:** `bunx audit` or use the Lovable security scanner — confirm no critical/high findings.
2. **Inspect the chat API validation:** Open `src/lib/chat-validation.ts` and any `src/routes/api/chat/case-*.ts` file.
3. **Inspect the grading schema:** Open `src/lib/report.functions.ts` and read the Zod `Input` and `Schema`.
4. **Check for leaked secrets:** Search for `LOVABLE_API_KEY` in the client bundle — it should only appear in `src/lib/ai-gateway.ts` and inside server handlers.
5. **Confirm no auth on public routes:** `src/routes/play.*.tsx` and `src/routes/printables.*.tsx` do not import `requireSupabaseAuth` or use protected loaders.

---

If you find a security issue in this project, please contact the project maintainer through the Lovable workspace or the GitHub repository's Issues tab.
