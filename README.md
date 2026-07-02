# Glitch Detectives

> **Don't solve. Investigate. Detect. Repair.**
> An AI-era maths app where the AI makes the mistake — and the child becomes the detective who finds it, fixes it, and explains why.

**Live:** https://glitchdetectives.lovable.app

---

## Why it exists

In the AI era, kids can get any answer in one tap. The risk isn't that they won't solve maths — it's that they'll stop **thinking**. Glitch Detectives flips the classroom: ZED-4, our AI, confidently gets the problem wrong; the child investigates, repairs the logic, and explains their reasoning back in their own words. That single reversal turns maths from recall into reasoning — and gives parents and educators a **Cognitive Insights report** that reads the child's own explanation instead of tallying a score.

## Screenshots

> Capture instructions for each — replace the placeholder path when you have the PNG.

- `docs/samples/landing.png` — landing page hero ("Don't solve. Investigate. Detect. Repair.")
- `docs/samples/case-in-play.png` — `/play/case-01`, ZED-4 mid-glitch on the pizza
- `docs/samples/cognitive-insights.png` — `/play/report`, four-dimension insights with evidence lines
- `docs/samples/workbook.png` — a printed workbook page next to the matching digital case

## How it works

Every case runs the same four-step loop: **Investigate → Detect → Repair → Explain**. The child watches ZED-4 confidently produce a wrong answer, spots the glitch, picks the correct fraction, and then — the thinking step — speaks or types the reasoning back to ZED-4. There is no multiple choice for the explanation. That free-text explanation is what the AI grades into a qualitative Cognitive Insights report across four dimensions: Conceptual Understanding, Reasoning & Justification, Vocabulary & Precision, and Problem Decomposition.

## Tech stack

- **Framework:** [TanStack Start](https://tanstack.com/start) v1 (React 19, Vite 7, SSR on Cloudflare Workers)
- **Language:** TypeScript (`strict: true`)
- **Styling:** Tailwind CSS v4 (native `@import`, no config file), shadcn/ui primitives
- **Backend:** Lovable Cloud (managed Supabase) — Postgres, Auth, RLS
- **AI:** Lovable AI Gateway → Google Gemini (`google/gemini-3-flash-preview`) via `ai` SDK structured outputs
- **Runtime:** Cloudflare Workers with `nodejs_compat`
- **Validation:** Zod on every server-function boundary
- **Voice:** Web Speech API (TTS + speech recognition)

## Run locally

```bash
bun install
bun dev            # http://localhost:8080
```

Required env vars (auto-provisioned when you fork on Lovable):

- `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`
- `LOVABLE_API_KEY` — server-side, powers the AI grader

## Project structure

```
src/
  routes/            File-based routing (TanStack Start). Pages + /api/chat/* endpoints.
  components/
    case01/…case06/  Per-case UI, SVG glitches, pickers, and case data.
    shared/          Reusable primitives: CaptionLine, DetectiveCallout, SuccessBanner, ChatPanel.
    landing/         Landing page sections.
    printables/      Workbook printables page.
  hooks/             useReportStore, useReportRecorder, useProgress, useSfx.
  lib/               report.functions.ts (AI grading server fn), ai-gateway.ts.
  integrations/supabase/   Auto-generated Supabase client + auth middleware.
  server.ts / start.ts     Cloudflare Worker entry + middleware.
docs/                Demo script, architecture, rubric self-assessment.
public/printables/   Workbook PDFs.
```

## Docs

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — runtime topology, routing map, AI grading pipeline, extending with a new case
- [`docs/demo-script.md`](docs/demo-script.md) — 3-minute demo video script (founder VO + on-screen cues)
- [`docs/rubric-self-assessment.md`](docs/rubric-self-assessment.md) — honest score against the BuildVerse rubric
- [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md) — branching, commits, PR checklist

## License

MIT.
