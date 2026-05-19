# Plan: FractionFactoryLevel1 page

## Scope
Build a new `FractionFactoryLevel1` component used when the user clicks "Enter Level" on Level 1 from the Fraction Factory hub (`/play`). Three views in one component, state-machine driven, with TTS, voice input, and AI-graded reasoning.

## File changes
1. **New** `src/components/FractionFactoryLevel1.tsx` — the full component (intro → mission-select → mission-1 gameplay loop).
2. **Edit** `src/routes/play.tsx` — re-introduce a small piece of state so clicking "Enter Level" on Level 1 mounts `FractionFactoryLevel1` instead of doing nothing. Removes the empty `onStart={() => {}}` no-op. Back button inside the level returns to the Hub.
3. **Reuse existing infra** (no duplication):
   - `speakText` + `useSpeechToText` from `src/lib/speech.ts`.
   - `/api/evaluate` route (already wired to Lovable AI) for the two reasoning checks. Mode `detect` for "Why is it a glitch?" and mode `explain` for "Why did parts have to be equal?". No new endpoints (the brief mentions `/api/evaluate-detect-reasoning` and `/api/evaluate-reasoning`, but the project already has a single unified `/api/evaluate` doing exactly this — I'll use it. Flag below.)
   - Mission 1 shapes: reuse the first 3 entries of `GLITCHES` from `src/lib/glitches.tsx` (pizza halves, then battery halves, then fuel-rod halves — all halves-focused for Mission 1). Avoids rebuilding SVG shape components.

## View / state design
Top-level state: `currentView: 'intro' | 'mission-select' | 'mission-1-investigate'`.
Mission-1 sub-state: `phase: 'briefing' | 'investigate' | 'explainWrong' | 'detect' | 'repair' | 'teach' | 'shapeDone' | 'missionDone'` plus `shapeIdx` (0..2).

### Intro view
- Header: "Level 1: Fraction Foundations", back arrow → navigates to `/play` hub.
- Pulsing `AlertTriangle` in a yellow square + "System Failure Detected" label.
- Briefing card with the supplied copy + `Volume2` "Read Aloud" button calling `speakText`.
- Primary CTA `Access Mission Map` → `mission-select`.

### Mission select view
- 2×2 grid of 4 mission cards. Data:
  1. Broken Partition Scanner — Detect unequal parts — unlocked → starts mission-1.
  2. Half Repair Station — Understand halves — unlocked → starts mission-1 (same loop, scoped to halves shapes).
  3. Quarter Core Reactor — Understand fourths — locked.
  4. Share Builder Challenge — Apply concepts — locked.
- Locked cards: grayscale + `Lock` icon, no hover. Unlocked: hover lift, blue/yellow accents.
- Back arrow to intro.

### Mission 1 gameplay loop (split-screen, lg:grid-cols-2)
**Left panel** — shape canvas from `GLITCHES[shapeIdx].render(vals, repaired)`. In `repair` phase, render sliders from `MissionRunner`'s pattern (range inputs bound to `vals`, `Check Repair` button, tolerance check using existing `target`/`tolerance`).

**Right panel** — ZED-4 dialogue card (Bot icon, blue chip) + phase-specific controls:
- `briefing`: robot line + `Start Scanner` button → `investigate`.
- `investigate`: two buttons "Yes, the robot is right" (→ `explainWrong`) / "No, there is a glitch!" (→ `detect`).
- `detect` / `explainWrong` / `teach`: textarea + `Mic` button (uses `useSpeechToText`, falls back to a `MediaRecorder` POST to `/api/transcribe` if `SpeechRecognition` unsupported — see flag) + `Send`. On submit calls `/api/evaluate` with mode `detect` / `wrong` / `explain`. On `isCorrect: false` show feedback + `Try Again`. On `isCorrect: true` auto-advance.
- `repair`: sliders + `Check Repair`. If within tolerance → `teach`, else gentle nudge.
- `shapeDone`: success card with `Next Shape` or `Finish Mission` (last shape).
- `missionDone`: completion card with `Return to Hub`.

### Cross-cutting
- TTS auto-trigger on every phase change and every new robot line via `useAutoSpeak(robotLine, [phase, shapeIdx])`.
- Animations via `framer-motion` (`motion.div` fade + scale-in on phase change, AnimatePresence on dialogue swap, subtle bounce on success).
- Icons only from `lucide-react`: `ArrowLeft, AlertTriangle, Volume2, Lock, Bot, Mic, MicOff, Send, CheckCircle2, Wrench, Sparkles, RefreshCcw, ArrowRight, Factory`.

## Design tokens
Dark blue `--color-brand-blue`, sky blue tints via `color-mix`, yellow `--color-brand-yellow` accent only on CTAs/badges, white card surfaces on `--color-bg-light` page background. Generous spacing (`p-6`/`p-8`, `gap-6`), no gradients, no childish illustrations. Matches the existing `/play` hub language.

## Out of scope
- Missions 2-4 (locked).
- New AI endpoints (reuses `/api/evaluate`).
- Changes to `MissionRunner.tsx` (not used here; can be deleted later if you confirm).
- Backend `/api/transcribe` route (only used as fallback; will degrade gracefully if missing).

## Flags / decisions to confirm
1. **Endpoints**: brief lists `/api/evaluate-detect-reasoning` and `/api/evaluate-reasoning`. The project already has `/api/evaluate` covering both. I'll use that. Tell me if you want two separate routes instead.
2. **`/api/transcribe` fallback**: native `SpeechRecognition` covers Chrome/Edge/Safari. I'll keep the mic button working there and hide it gracefully where unsupported, rather than building a server transcription endpoint now (would need an AI provider with audio support). OK?
3. **Mission 1 shape set**: use 3 halves-focused shapes (`pizza`, `battery`, `fuelrod` from `GLITCHES`). OK, or do you want all 5?
4. **`MissionRunner.tsx`**: currently unused after this change — delete it, or leave as-is?
