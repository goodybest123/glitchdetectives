# Architecture

A one-page tour of Glitch Detectives for another developer. If you're a judge, start with the [README](../README.md).

## Runtime topology

```text
┌──────────────┐    TanStack Router     ┌────────────────────────┐
│   Browser    │ ─────────────────────▶ │ Route component        │
│  (React 19)  │                        │  src/routes/play.*.tsx │
└──────┬───────┘                        └──────────┬─────────────┘
       │                                           │ useServerFn / fetch
       │                                           ▼
       │                             ┌────────────────────────────┐
       │                             │ Server function or API     │
       │                             │  src/lib/*.functions.ts    │
       │                             │  src/routes/api/chat/*.ts  │
       │                             └──────────┬─────────────────┘
       │                                        │ ai SDK (structured output)
       │                                        ▼
       │                             ┌────────────────────────────┐
       │                             │ Lovable AI Gateway         │
       │                             │  google/gemini-3-flash     │
       │                             └──────────┬─────────────────┘
       │                                        │ JSON (Zod-normalised)
       │                                        ▼
       │        gd:report:v4         ┌────────────────────────────┐
       └──────────────────────────── │ useReportStore (localStorage)│
                                     └──────────┬─────────────────┘
                                                ▼
                                     /play/report  (Cognitive Insights UI)
```

Everything server-side runs on Cloudflare Workers with `nodejs_compat`. There is no long-lived server process; every server function is a fresh Worker invocation.

## Routing map

Routes are file-based under `src/routes/`. The Vite plugin generates `routeTree.gen.ts` — never edit it by hand.

| Route | File | Purpose |
| --- | --- | --- |
| `/` | `routes/index.tsx` | Landing page (hero, sections, workbook CTA) |
| `/play` | `routes/play.tsx` + `play.index.tsx` | Case picker |
| `/play/case-0N` | `routes/play.case-0N.tsx` (N = 1–6) | The four-step loop for a specific case |
| `/play/report` | `routes/play.report.tsx` | Adult-facing Cognitive Insights report |
| `/printables` | `routes/printables.tsx` + `printables.fractions-l*.tsx` | Workbook download pages |
| `/api/chat/case-*` | `routes/api/chat/*.ts` | In-scene chat endpoints ZED-4 talks through |

## The 6 cases

Each case owns its own folder with SVG glitches, a case picker, a stepper, and a `cases.ts` data file that describes each sub-case (glitch summary, correct answer, concept).

| Case | Concept | Folder | Chat endpoints |
| --- | --- | --- | --- |
| 01 | Parts of a whole | `components/case01/` | `case-01.ts`, `case-01-canvas.ts`, `case-01-chocolate.ts` |
| 02 | Numerator vs denominator | `components/case02/` | `case-02-bar.ts`, `case-02-crate.ts`, `case-02-panels.ts` |
| 03 | Comparing fractions | `components/case03/` | `case-03-tanks.ts`, `case-03-garden.ts`, `case-03-disks.ts` |
| 04 | Equivalence | `components/case04/` | `case-04-beams.ts`, `case-04-coolant.ts`, `case-04-cargo.ts` |
| 05 | Common denominators | `components/case05/` | `case-05-assembly.ts`, `case-05-conveyor.ts`, `case-05-coolant.ts` |
| 06 | Multi-step reasoning | `components/case06/` | `case-06-blueprint.ts`, `case-06-circuit.ts`, `case-06-paint.ts` |

## AI grading pipeline

The pedagogical payload — the Cognitive Insights report — is 100% AI-generated. The pipeline is:

1. **Trigger** — When a sub-case reaches the `solved` stage, `useReportRecorder` fires once (guarded by a `useRef` so re-renders never double-save).
2. **Local write** — A `ReportEntry` with `verdict: "pending"` is written to `localStorage` immediately so the report page is never empty.
3. **Server call** — `gradeExplanation` (in `src/lib/report.functions.ts`) is invoked via `useServerFn`. Inputs are Zod-validated.
4. **AI call** — Inside the Worker, the `ai` SDK calls Lovable AI Gateway with `Output.object({ schema })` to force a structured JSON response matching our Zod schema (verdict, understanding level 1–5, strengths, gaps, next step, rubric, and exactly 4 cognitive-dimension insights).
5. **Normalise** — Everything the AI returns is passed through `normalize()` / `normalizeInsights()` / `normalizeRubric()`. Missing dimensions are filled with "Not mentioned in explanation."; out-of-range numbers are clamped.
6. **Fallback** — If structured output fails, we retry with a plain-JSON prompt and regex-extract the first `{…}` block. If that also fails, we return safe defaults with a child-friendly message.
7. **Patch** — The server response is merged into the existing entry via `patchReportEntry`.

The system prompt is opinionated on purpose: it names the four dimensions, caps evidence at ~22 words, requires the AI to quote or paraphrase the child, and forbids generic praise.

## Report data model

Storage key: `gd:report:v4`. Bumping the version invalidates old shapes.

```ts
type ReportEntry = {
  caseId: string;      // "case-01"
  subId: string;       // "pizza"
  caseTitle: string;
  subTitle: string;
  emoji: string;
  glitchSummary: string;
  conceptMastered: string;
  explanation: string; // the child's own words
  marks: { investigate: number; detect: number; repair: number; explain: number };
  verdict: "correct" | "partial" | "review" | "pending";
  verdictNote: string;
  solvedAt: number;
  // AI-added on patch:
  understandingLevel?: number;    // 1–5
  strengths?: string[];
  gaps?: string[];
  nextStep?: string;
  rubric?: { criterion; score: "met"|"partial"|"missing"; evidence }[];
  insights?: { dimension; level: "Emerging"|"Developing"|"Secure"; evidence }[];
};
```

## Server runtime constraints

The Worker runtime is not a full Node.js host. Do not add packages that require native binaries (`sharp`, `canvas`, `puppeteer`), spawn subprocesses, or rely on `fs.watch`. Safe: `fs`, `path`, `crypto`, `Buffer`, `stream`, `url`, `events`, `net`, `http`, `https`, `zlib`. Prefer fetch-based clients and WASM builds intended for the edge. Anything imported from `.server.ts` files is stripped from the client bundle by import protection.

## Auth

Auth is wired but not required by the current play flow (the report lives in `localStorage` on-device). The Supabase integration is generated:

- `@/integrations/supabase/client` — browser client (publishable key, RLS applies)
- `@/integrations/supabase/auth-middleware` (`requireSupabaseAuth`) — server-fn middleware for authenticated routes
- `@/integrations/supabase/auth-attacher` (`attachSupabaseAuth`) — client-side function middleware that attaches the bearer token, registered in `src/start.ts`

When you add a route that needs a signed-in user, place it under `_authenticated/` and chain `.middleware([requireSupabaseAuth])` on the server function. Never call a protected server function from a public route's `loader` — SSR/prerender has no session and will 401 the build.

## Extending: add Case 07 in 5 steps

1. Create `src/components/case07/` with your SVG, `CasePicker`, sub-case components, and a `cases.ts` describing each glitch (id, title, glitch summary, correct answer, concept).
2. Add the route file `src/routes/play.case-07.tsx` following the pattern of `play.case-01.tsx`. Wire `useReportRecorder` with the case's ids, glitch summary, and concept.
3. Add per-sub-case chat endpoints under `src/routes/api/chat/case-07-*.ts` if ZED-4 needs to react in-scene.
4. Link the new case from `src/routes/play.index.tsx` (case picker).
5. Add the matching workbook PDF under `public/printables/` and a `printables.*.tsx` route, then run `bun dev`. The Vite plugin regenerates `routeTree.gen.ts` automatically.

Done — no schema changes required; the report store is case-agnostic.
