## Problem

On `/play/case-01`, the "Submit Evidence" button is already in the code but it stays disabled until the `explain` stage. To reach `explain` you must:
1. Click the pizza to trigger **detect**
2. Drag the equalizer slider to 1 → **repair** → **explain**

Step 1 is broken: the pizza's clickable areas are 4 thin dividing lines plus mostly-transparent slice paths, so most clicks on the pizza body miss. The session replay shows repeated clicks around the pizza that never advance the state.

## Fix

### 1. Make the whole pizza clickable in INVESTIGATE state (`src/components/case01/PizzaSVG.tsx`)
- Add an invisible full-pizza hit circle (radius `R`, `fill="transparent"`, `pointer-events: all`) rendered on top of the slices/lines, wired to `onGlitchClick` only when `interactive` is true.
- Keep the existing slice/line click handlers (they still work for precise clicks).
- Add `cursor-pointer` to the hit circle when interactive.

### 2. Confirm Submit Evidence wiring (`src/routes/play.case-01.tsx`)
The button exists and submits via AI SDK `sendMessage({ text })` to `/api/chat/case-01`. No code change needed there — just verify after the fix:
- Click pizza → ZED-4 says "Glitch Detected" and slider appears.
- Drag slider to right → green "Logic Repaired" banner shows, chat panel un-greys.
- Type reasoning, click SUBMIT EVIDENCE → user bubble appears, "AI Guide is thinking…", streamed ZED-4 reply appears.

### 3. Small UX polish (same file)
- In the INVESTIGATE prompt, change copy to make clear the whole pizza is clickable: *"Scan ZED-4's logic. Tap the pizza where the logic breaks."* (already says "Click on the pizza" — keep, just ensure prompt cursor hint).

## Files touched
- **edit** `src/components/case01/PizzaSVG.tsx` — add full-area transparent hit circle on top, gated by `interactive`.
- *(no change needed)* `src/routes/play.case-01.tsx` — Submit Evidence button and chat already wired correctly.
- *(no change needed)* `src/routes/api/chat/case-01.ts` — already streams via Lovable AI Gateway.

## Out of scope
- Restricting the glitch click to only the unequal sliver (the spec says "where the logic breaks" — accepting any pizza click is calmer for a K-12 audience and matches the neuro-inclusive design intent; we can tighten later if you want).
- Persisting chat history / progress.
