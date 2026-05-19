
## Goal

Bring Mission 1 in line with the State A–E spec. Most of the scaffolding already exists in `src/components/FractionFactoryLevel1.tsx` — this plan focuses on the deltas, not a rewrite.

## What stays as-is

- Split-screen layout (shape left, ZED dialogue right)
- States `briefing`, `repair`, `teach`, `shapeDone`, `missionDone`
- Sliders + `Check Repair` math
- TTS on every robot line, framer-motion transitions, lucide icons
- Continuous mic + echo-filter + auto-resume in `ReasoningBox`
- Voice command map

## Deltas

### State A — Briefing
No change. `Start Scanner` button already advances to `investigate`.

### State B — Investigate (clean up)
Currently the investigate phase renders **both** the Yes/No buttons **and** a `ReasoningBox`. Per spec, this state is buttons-only.

- Remove the `<ReasoningBox …mode="wrong" />` from the `investigate` branch in `PhaseControls`.
- Keep: `Yes, the robot is right.` → `explainWrong`; `No, there is a glitch!` → `detect`.
- Add a soft helper line under the buttons: "Look closely — are the parts really equal?"

### State C — Detect (Explain the Glitch)
Already routes to `ReasoningBox` with `mode="detect"`. Add the two spec details:

- **Try Again button**: when ZED returns feedback marking the answer not-yet-correct, show a `Try Again` chip that clears the last child+zed turn pair so the child can retry without losing the seeded prompt. (Pure UI; no endpoint change.)
- **Transcription fallback**: if `SpeechRecognition` is unsupported, surface a `MediaRecorder`-based fallback that POSTs the blob to a new `/api/transcribe` route (Lovable AI Gateway, Gemini audio). Text input remains as the simpler fallback.

### State D — Repair
No change.

### State E — Teach
No change.

### Explain Wrong (the "Yes, robot is right" branch)
Keep as a short rethink loop using `ReasoningBox` `mode="wrong"`, including the existing "after 2 turns concede and advance to Repair" behavior.

## Endpoint split (spec naming)

Currently one route `/api/evaluate` handles all modes. Split into:

- `src/routes/api/evaluate-detect-reasoning.ts` — used for `mode: "detect"` and `mode: "wrong"` (both are "is this a glitch?" reasoning).
- `src/routes/api/evaluate-reasoning.ts` — used for `mode: "explain"` (teach phase: deep conceptual understanding).
- `src/routes/api/transcribe.ts` — POST audio blob → `{ text }` using Lovable AI Gateway (`google/gemini-2.5-flash` audio input).

Both evaluate routes reuse the existing system prompt + `ResultSchema` + lenient JSON parsing + 429/402 error handling from today's `evaluate.ts`. The teach route gets a slightly stricter rubric (reasoningScore ≥ 2 required for `isCorrect`).

The current `/api/evaluate` stays for one release as a thin shim that forwards to the correct new route, so nothing breaks mid-deploy.

`ReasoningBox` picks the endpoint based on `mode`.

## Files touched

- `src/components/FractionFactoryLevel1.tsx` — investigate cleanup, Detect `Try Again` chip, endpoint routing, optional `MediaRecorder` fallback hook-up.
- `src/routes/api/evaluate-detect-reasoning.ts` — new.
- `src/routes/api/evaluate-reasoning.ts` — new (stricter teach rubric).
- `src/routes/api/transcribe.ts` — new.
- `src/routes/api/evaluate.ts` — becomes a thin forwarder (kept for safety).

## Out of scope

- Missions 2–4 unlocks, persona/prompt rewrites, the intro/mission-select screens.
