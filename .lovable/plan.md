## Mission 2: Voice, TTS & ZED-4 Evaluation

Bring Mission 2 up to parity with Mission 1 by adding spoken dialogue, an explain-your-reasoning input, and ZED-4 evaluation — while keeping the existing repair-slider mechanic intact.

### 1. Auto Text-to-Speech for ZED-4

In `src/components/Mission2HalfRepairStation.tsx`:
- Use `useAutoSpeak(dialogue, [dialogueKey])` so every ZED-4 line (intro + success) plays automatically when it changes.
- Use `useAutoSpeak(item.repairHint, [item.id])` when not yet repaired, so the hint is read aloud on each new object.
- Replace the current local typewriter-only `ZedConsole` with one that also exposes a "Read Aloud" button (Volume2 icon) calling `speakText(dialogue)`, mirroring Level 1.
- Add a global mute toggle in the top bar (Volume2/VolumeX) that calls `window.speechSynthesis?.cancel()` and short-circuits future speaks (track `muted` state, pass into a thin wrapper or guard the `useAutoSpeak` text with `muted ? "" : dialogue`).

### 2. Explain Input + ZED-4 Evaluation

Reuse the existing `src/components/ExplainInput.tsx` (text area + mic STT + Send button) inside the right-hand console column, shown ONLY after the slider snaps to 50% (`repaired === true`) and BEFORE the "Next Object" button.

Flow per object:
1. Child drags slider → snaps to equal halves → `repaired = true`.
2. ZED-4 success line speaks. A new prompt appears: *"Tell ZED-4 — why are these two pieces equal halves?"*
3. `ExplainInput` collects text or voice; on submit, POST to `/api/evaluate` (the existing route used by Level 1).
4. Show a loading state, then render ZED-4's reply in the console (also auto-spoken). Reply includes `isCorrect` + short feedback per the existing `evaluate-core` contract.
5. If `isCorrect`: enable the "Next Object" / "Return to Map" button.
6. If not: keep the input open, ZED-4 asks one short follow-up question; the child can retry.

Add new local state:
- `explainPhase: "idle" | "asking" | "thinking" | "done"`
- `zedReply: string | null`
- `attempts: number`

The evaluation request mirrors Level 1's payload (item context: "two halves of a [name] — equal split"). Keep it client-side fetch; no new server route needed.

### 3. Voice Commands (Level 1 parity)

- Add the same floating `VoiceCommandToggle` component (radio button bottom-right) and `useVoiceCommands` hook from Level 1.
- Commands for Mission 2:
  - "next object" / "next item" → `nextItem()` (only when `repaired && isCorrect`)
  - "return to map" / "back to map" → `onExit()`
  - "replay" / "restart" → `restart()`
  - "read again" → re-speak current dialogue
- Voice toggle state lives in `Mission2HalfRepairStation` (or lifted into `play.tsx` if cleaner).

### 4. Small polish carried from Level 1

- Per-item "Read Aloud" button on the repair hint paragraph.
- Status chip on console shows "Listening…" while STT is active (already handled by `ExplainInput`).
- When advancing to a new object, cancel any in-flight speech (`window.speechSynthesis.cancel()`).

### Files

- **Edit** `src/components/Mission2HalfRepairStation.tsx` — wire `useAutoSpeak`, mute toggle, explain phase, evaluation fetch, voice commands, gate Next button on `isCorrect`.
- **Edit** `src/components/mission2/ZedConsole.tsx` — add Read-Aloud button + slot for child content (explain input + reply).
- **No new routes** — reuse `/api/evaluate` and `src/components/ExplainInput.tsx` as-is.
- **No changes** to slider, shapes, Mission 1, or `evaluate-core.ts`.

### Out of scope

- New evaluation prompts/tuning (use existing behavior).
- Backend changes, new DB tables, or new server functions.
- Mission 3/4 work.
