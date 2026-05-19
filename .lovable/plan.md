## Goals

1. After ZED-4's confident pizza briefing, explicitly invite the child to "click Start Scanner so we can share it together" — both in the spoken/displayed line and as a visible nudge next to the button.
2. Fix "ZED-4 does not respond to the child." Today the live conversation box only appears in `detect`/`explainWrong`/`teach`. During `briefing` and `investigate` (the moments where the child first speaks back: "no it's not equal!"), there is no mic, no transcript handler, and nothing is sent to `/api/evaluate` — so ZED‑4 stays silent.

## Plan

### 1. Briefing copy + visible CTA nudge

- `src/lib/glitches.tsx` — append a warm invitation to each Mission‑1 `robotBriefing`, e.g. pizza:
  > "Check it out! I sliced this pizza perfectly down the middle. Two equal halves — one for you, one for me. I totally nailed it! Click **Start Scanner** so we can share it together!"
- Add similar "Click Start Scanner so we can check it together!" tails for battery and fuelrod briefings.
- `FractionFactoryLevel1.tsx` `PhaseControls` (briefing branch):
  - Add a small caption above the Start Scanner button: "Tap Start Scanner so we can share it together." styled in sky-blue mono, with a soft pulse on the button (`animate={{ scale: [1, 1.02, 1] }}` loop) so it reads as the obvious next action.
  - Keep the existing `start scanner` voice command.

### 2. Make ZED‑4 actually respond during briefing + investigate

Root cause: `ReasoningBox` (which owns the mic + calls `/api/evaluate`) is only mounted for phases `detect`/`explainWrong`/`teach`. In `briefing` and `investigate` the child has nothing to talk to.

Changes in `FractionFactoryLevel1.tsx`:

- Extend `PhaseControls` so `investigate` also renders a compact `ReasoningBox` **below** the Yes/No buttons, in `mode: "wrong"` (child pushes back on ZED‑4's confident-wrong claim). When the box returns `isCorrect: true` (child clearly explained "not equal/fair"), auto-advance to `repair` (skip the redundant detect step) and skip the celebration toast that currently runs on detect — we just call `onCorrectDetect`.
- In `briefing`, render a tiny "Talk to ZED‑4" affordance (mic button only, no log) that, on first final transcript, advances to `investigate` and forwards the message into the conversation. Simpler alternative we'll take: keep briefing button-only, but auto-start the mic the moment we enter `investigate`.

Changes in `src/components/FractionFactoryLevel1.tsx` `ReasoningBox`:

- Add an `autoStart?: boolean` prop. When true and `supported`, call `start()` on mount (after a 400 ms delay so the auto-spoken robot line finishes first; `useContinuousSpeech` already pauses while TTS speaks).
- Seed the conversation with the current `robotLine` as a `zed` turn so the child sees what they're replying to (also gives the AI proper context via `history`).
- Pass `autoStart` from the `investigate` branch.

Changes in `src/lib/speech.ts` `useContinuousSpeech`:

- Bug: when TTS finishes the polling effect tries to restart, but `r.start()` throws if it's already started, and we never reset `finalBuffer` between sessions. Tighten the try/catch and guard against double-start by tracking an internal `started` flag. This prevents the recognizer from silently dying after the first robot utterance — which is the most likely reason "ZED‑4 doesn't respond" even when the box IS shown.
- Also: currently `finalBuffer` lives inside the effect closure and is shared across restarts — fine — but interim text isn't cleared on `stop()` in all browsers. Clear `finalBuffer = ""` inside `onend` as well.

### 3. Quick verification

- `mode` for investigate becomes `"wrong"`, which matches the existing prompt branch in `evaluate.ts` — no server change needed.
- Manually walk through: enter Mission 1 → hear pizza briefing with new CTA → click Start Scanner → mic auto-starts → say "the pieces aren't the same size" → ZED-4 thanks + reflects + asks a question, and on a clear equality answer auto-advances to repair.

## Files touched

- `src/lib/glitches.tsx` — append "Click Start Scanner so we can share it together!" tails to Mission‑1 briefings.
- `src/components/FractionFactoryLevel1.tsx` — pulsing Start Scanner CTA with caption; mount `ReasoningBox` in `investigate` (mode `"wrong"`, `autoStart`); add `autoStart` + seeded ZED turn to `ReasoningBox`.
- `src/lib/speech.ts` — harden `useContinuousSpeech` restart logic so the mic survives ZED-4's TTS replies.

## Out of scope

- Server prompt / model changes.
- Missions 2–4.
- Persisting conversation across phase transitions.
