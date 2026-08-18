# Security hardening for presentation

Run a full security audit and fix the findings before today's presentation, then document the security posture so the hackathon judges can see it.

## What we know now

- Fresh dependency scan: no high or critical vulnerabilities currently detected.
- Fresh Lovable security scan: no backend/Supabase findings.
- Persisted scanner state: one `supply_chain` warning for TanStack packages (`react-router`, `react-start`, `router-plugin`) via a `seroval` deserialization advisory. Severity is reported as `warn` by the scanner, but the underlying advisory is critical.
- The app is published publicly and visibility is public.
- The app is a children's math game with no user accounts; progress is stored in `localStorage` only.
- AI interactions are driven by server routes and a server function that call the Lovable AI Gateway.

## Plan

### 1. Dependency remediation
- Review the exact TanStack versions and the `seroval` advisory.
- If a safe upgrade path exists (patch or minor version bump that resolves the advisory), update `package.json`, regenerate the lockfile, and run `bun install`.
- Verify the build still passes and the route tree works after the upgrade.
- If the vulnerable version is locked by Lovable's template and cannot be safely upgraded without breaking the framework, record the risk and mitigation in `docs/security-posture.md` and propose ignoring the scanner warning with a clear explanation.

### 2. Backend security verification
- Re-run the Supabase/security scanner after any dependency changes.
- Confirm that no `public` tables were added without RLS grants since the last scan.
- Review `src/routes/api/chat/*.ts` for:
  - Input validation (all routes should reject non-array or malformed `messages`).
  - Rate limiting or abuse protection (there is none currently; add a lightweight per-IP or per-session limit if feasible, or document why it is acceptable for this use case).
  - Prompt injection containment (system prompts are hard-coded, user content only flows inside the `messages` array).
- Review `src/lib/report.functions.ts` (AI grading) for input size limits and safe fallback handling.

### 3. AI safety & child-safety checks
- Verify every system prompt in `src/routes/api/chat/case-*.ts` prohibits:
  - giving direct answers to the child,
  - collecting personal information,
  - leaving the app context or encouraging external actions,
  - emojis/scores/grades.
- Confirm the report grading function uses adult-facing language and returns only educational diagnostics, not personal data.
- Document the AI safety layers in `docs/security-posture.md`.

### 4. Privacy review
- Confirm no sign-up, no PII fields, and no telemetry scripts are present in the client bundle.
- Document that progress and reports live only in the browser's `localStorage` and are never transmitted to the backend except the explicit AI grading request (which contains only the case metadata and the child's explanation, no name or identifier).
- Review external links (Seler workbook, Google Drive) to ensure they open in a new tab and do not embed tracking.

### 5. Security headers & published-site posture
- Check the published response headers for basic protections (TLS, `X-Content-Type-Options`, `Referrer-Policy`).
- Note that a Content Security Policy is not currently in place; decide whether adding one is feasible before the presentation or should be documented as a post-launch improvement.
- Confirm the published site is HTTPS-only and the custom domain (if any) is not in scope.

### 6. Documentation for judges
- Create `docs/security-posture.md` with:
  - One-paragraph summary of the architecture (Cloudflare Workers + Lovable Cloud + AI Gateway).
  - List of active security controls (no accounts, localStorage-only data, structured Zod outputs, prompt guardrails, input validation).
  - List of open risks with mitigation status (dependency warning, rate limiting, CSP).
  - Evidence that the latest scans are clean.
- Add a short "Security & Privacy" section to the README or a link to the new doc.

### 7. Final verification
- Run the build after dependency changes.
- Re-run dependency and security scans.
- Smoke-test the published preview: confirm the landing page, a case, the report, and the printables page still load correctly.

## Out of scope

- Adding full user accounts or backend storage for progress (this is a deliberate product choice, not a security fix).
- Implementing a custom WAF or CDN-level rate limiting (platform-level).
- SOC 2 or COPPA compliance certification (document posture only).

## Technical details

- **Hosting**: Cloudflare Workers via `@cloudflare/vite-plugin`, `nodejs_compat` enabled. No persistent server filesystem; server functions run in a workerd isolate.
- **Backend**: Lovable Cloud (Supabase). No auth-required server functions are used in public routes; `requireSupabaseAuth` exists but is not in the public path for this app.
- **AI gateway**: Calls go through the Lovable AI Gateway to `google/gemini-3-flash-preview`.
- **Data flow**: Child inputs → AI Gateway → streamed response; grading request → AI Gateway → structured diagnostic → `localStorage`.
- **Dependencies**: TanStack Start v1, React 19, Tailwind v4, Zod, `ai` SDK.
