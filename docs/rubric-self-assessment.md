# Glitch Detectives — BuildVerse Hackathon Self-Assessment

Honest read of the project against the JAF 2026 rubric. Scores are self-rated /5. Evidence points to real files so a judge (or you) can verify in seconds.

---

## 1. Code Quality & Technical Execution

### 1.1 Code Structure & Organisation — **4/5**

**Evidence**

- Routes: file-based under `src/routes/` (`play.case-01.tsx` … `play.case-06.tsx`, `play.report.tsx`, `printables.*.tsx`, `api/chat/*`).
- Per-case UI isolated: `src/components/case01/` … `case06/` each own their SVGs, pickers, steppers, and `cases.ts` data.
- Shared UI factored out: `src/components/shared/` (`CaptionLine`, `DetectiveCallout`, `SuccessBanner`, `ChatPanel`, `VerdictButtons`, `WorkbookActivity`).
- Server logic separated by concern: RPC in `src/lib/report.functions.ts`, HTTP endpoints in `src/routes/api/chat/*`, Supabase glue in `src/integrations/supabase/*`.
- Hooks isolated (`useReportRecorder`, `useReportStore`, `useProgress`, `useSfx`).

**Gaps**

- `case01`–`case06` folders duplicate patterns (each has its own `CasePicker`, `cases.ts`). A shared `CaseShell` + data-driven config would remove ~30% of the code.
- `src/components/case01/` hosts primitives (`SpeakButton`, `MicButton`, `ZedBubble`) that are reused across all cases — misleading name.

**Quick win**: rename `case01` → `shared/case-primitives` for the reused pieces (no logic change).

---

### 1.2 Functionality & Completeness — **4.5/5**

**Evidence**

- 6 playable cases live end-to-end, each with Investigate → Detect → Repair → Explain loop.
- `/play/report` renders a real Cognitive Insights report (4 dimensions × 3 levels + evidence + rubric).
- `/printables` ships PDFs (`public/printables/*.pdf.asset.json`).
- Voice input (`MicButton`), TTS on every caption (`SpeakButton`), sound toggle, progress tracking.
- Server-side branded error page (`src/server.ts` → `renderErrorPage`) — catastrophic h3 500s are normalised.

**Gaps**

- No auth/save-across-devices: report lives in `localStorage` under `gd:report:v4`. Fine for a demo, weak for "a parent uses this".
- No automated tests.

**Quick win**: add one Playwright smoke test that plays Case 01 through to a report entry — cheap insurance.

---

### 1.3 Use of Version Control — **4/5**

**Evidence**

- Real, human-readable `README.md` at root: pitch, live URL, tech stack, setup steps, architecture overview, screenshots, AI output example, and rubric-relevant evidence table.
- `docs/ARCHITECTURE.md` — runtime topology, routing map, AI grading pipeline, data flow.
- `docs/CONTRIBUTING.md` — branching (`feat/`, `fix/`) and Conventional Commits standards.
- `docs/security-posture.md` — full threat model, input validation, AI safety, and privacy controls.
- `docs/demo-script.md` and `docs/rubric-self-assessment.md` show documentation is maintained as a first-class concern.

**Gaps**

- Commit history remains Lovable-managed turn commits, not human-authored feature milestones.
- No release tag / CHANGELOG yet.

**Quick win**: tag `v1.0-hackathon` on the current `main` and add a one-line `CHANGELOG.md`.

---

### 1.4 Code Readability & Documentation — **4.5/5**

**Evidence**

- Strict TypeScript (`tsconfig.json` `strict: true`), Zod validation on every server fn input.
- Purposeful comments and JSDoc headers on public boundaries: server entrypoints (`server.ts`, `start.ts`, `router.tsx`), hooks (`useReportStore`, `useReportRecorder`, `useProgress`), shared components, all 6 case routes, and case definition files.
- `eslint` now passes with **0 errors**; remaining warnings are only in auto-generated shadcn/ui primitives and pre-existing `useEffect` dependency hints.
- Server function contract is documented in `docs/ARCHITECTURE.md` and `docs/security-posture.md`.
- Input validation helper (`src/lib/chat-validation.ts`) is documented with its security bounds.

**Gaps**

- No inline architecture diagram (ASCII only).
- No auto-generated API docs.

**Quick win**: add a Mermaid diagram to `docs/ARCHITECTURE.md` if the platform supports rendering it.

---

## 2. AI Integration & Usage

### 2.1 Depth of AI Integration — **5/5**

**Evidence**

- AI is the **core loop**, not a garnish. ZED-4 (Gemini via Lovable AI Gateway) _is_ the antagonist: it produces the wrong answer the child must repair.
- The pedagogical payload — the Cognitive Insights report — is 100% AI-generated from the child's free-text explanation (`src/lib/report.functions.ts` → `gradeExplanation`).
- Per-case chat endpoints (`src/routes/api/chat/case-0N-*.ts`) let ZED-4 react to the child's reasoning in-scene.
- Without AI, the product collapses to a static worksheet. That is the definition of "relies on AI to deliver its value."

**Gaps**: none material for this rubric.

---

### 2.2 Quality of AI Outputs — **4/5**

**Evidence**

- Structured outputs via `Output.object({ schema })` with a strict Zod schema (`Schema` in `report.functions.ts`) covering verdict, understanding level, rubric (3–4 criteria), and exactly 4 cognitive dimensions.
- Robust normalisation (`normalize`, `normalizeInsights`, `normalizeRubric`) guarantees the UI never crashes on malformed AI output.
- Two-tier fallback: structured output → plain-JSON prompt → safe defaults with a child-friendly message.
- System prompt is opinionated and pedagogically specific ("does the child explain WHY, not just what", "≤22 words", "reference the child's actual words").

**Gaps**

- No eval set / no golden samples to prove quality to a judge.
- No streaming — the report appears all at once after a pause.

**Quick win**: drop 3 real anonymised report screenshots into `docs/samples/` and link from README. Judges believe pixels, not prose.

---

## 3. Product Viability & Design

### 3.1 User Experience & Interface — **4.5/5**

**Evidence**

- **Neurodivergent-inclusive by default**, not as a toggle: no timers, no red X punishments, calm palette (amber/emerald semantic tokens, no harsh red-on-white).
- **Multimodal**: every caption has an inline `SpeakButton` (TTS); every explanation step accepts voice (`MicButton`) _or_ text.
- **Cognitive load**: one glitch on screen at a time; big touch targets; DETECTIVE callout visually distinct from ZED-4 speech so the child never confuses "who said this".
- **Two-audience UI**: child-facing play surface + adult-facing `/play/report` in observational, non-judgmental language ("Emerging / Developing / Secure" + evidence line, not scores).
- **Screen ↔ paper parity**: `/printables` ships the same glitches as workbook pages; the demo script hinges on this loop.

**Gaps**

- No accessibility audit (contrast ratios, keyboard nav, screen-reader labels beyond TTS) documented.
- Mobile layout not explicitly tuned for < 375px.

**Quick win**: run axe on `/play/case-01` and paste the pass report into `docs/`.

---

## Overall self-score: **~30.5 / 35 (87%)**

Weighted toward the AI rows (where the product is strongest) and the UX + documentation rows (where the neurodivergent angle and security posture are genuine differentiators). Version control remains the only drag because the commit history is still Lovable-managed.

---

## Top 3 things to say out loud during judging

1. **"AI is the antagonist, not the assistant."** Pre-empts the "is this just a ChatGPT wrapper?" reflex. Point at `gradeExplanation` + the role-reversal loop.
2. **"The report is qualitative, not a score."** Show `/play/report` on a real explanation — the 4-dimension cognitive insight is the moat vs. any generic math app.
3. **"Privacy-first by design: no child accounts, no PII, all progress stays local."** Back it up with `docs/security-posture.md` and the input-validation helper.

## Top 3 quick wins before submission

1. **Tag `v1.0-hackathon`** and add a one-line `CHANGELOG.md` — the only remaining version-control gap.
2. **Run an accessibility pass** (axe / Lighthouse) on `/play/case-01` and paste the pass report into `docs/`.
3. **Capture a short demo video** (or 3–4 GIFs) of the Case → Explain → Report flow and embed in README.

## Out of scope for this doc

No code changes, no README rewrite, no commit history edits. Ask me to execute any of the quick wins and I'll do them as separate turns.
