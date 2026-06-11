# Make every repair hands-on + investor-demo polish

The Detect stage is already interactive across all 6 cases. The Repair stage is hands-on in Cases 01–05 (slider, steppers, toggles), but Case 06 cheats — a single button silently swaps the visual. This plan turns Case 06 into real tactile manipulations, and adds the polish layer investors and judges expect.

## 1. Case 06 — make all three repairs physical

Remove `RepairToolButton.tsx`. Replace each sub-case's repair with a direct gesture on the SVG. Pointer Events (`onPointerDown/Move/Up`) so it works equally on mouse, trackpad, touch, and pen — no extra libraries.

### Blueprint — Laser Slicer (drag to slice)
- Detective grabs a glowing "laser" handle above the 1/2 block and drags it down through the block.
- A dashed orange laser line follows the pointer Y. When it crosses the block's vertical midline (snap zone ±10px), the block visibly cleaves into two 1/4 pieces with a small spark/flash and a click-tick sound.
- Caption updates: "Drag the laser down through the middle of the big block."
- After cleave, the right output box morphs from 2/6 → 3/4 with a 400ms slot-fill animation.

### Paint Vats — Grid Calibrator (tap to add a grid line)
- The 1/3 vat shows two faint dashed "snap rails" at the 1/6 and 2/6 marks. Detective taps either rail (or both) to lay in real grid lines.
- Once the vat has the same 6-row grid as the right vat, the paint redistributes (1/3 → 2/6) with a liquid-fill ease, and the output vat fills from 2/9 → 3/6.
- Caption: "Tap the dotted line to add a matching grid line."

### Circuit Board — Segmenter Tool (tap each slice)
- The 1/2 power cell shows three faint horizontal "cut here" guides. Detective taps each guide in turn; each tap snaps a real segment line into place with a brief green pulse.
- After three taps the cell is 4 × 1/8. Then the bottom segment ejects (slides out + dims) to represent the −1/8 subtraction, and the output board fills from 0/6 → 3/8.
- Caption updates progressively: "Tap each cut line to slice the cell into eighths." → "Now eject one eighth to subtract."

### Shared support
- New `src/components/case06/RepairCanvas.tsx` wraps the SVG with pointer handlers, snap helpers, and a `onComplete()` callback.
- Replace `RepairToolButton` usage in `play.case-06.tsx` with the in-SVG gesture. `handleRepair` is called from `onComplete`.
- A11y: each gesture is also operable by keyboard — focusable handle + Arrow keys + Enter to slice/tap. Visible focus ring.
- Mobile: `touch-action: none` on the gesture surface, `pointer-events` only on handles, generous 44px hit targets.

## 2. Tighten Repair stages in Cases 01–05

Keep what works; raise the production value.

- Case 01 slider: add tick marks at the 1/N positions and a soft haptic-style snap when each slice becomes equal. The "EQUALIZER" handle gets a subtle glow when within snap distance.
- Case 02 stepper/swap: add a +1/−1 long-press to step quickly, and animate the visual fraction (bar fill, crate orientation flip, panel grid) with a 250ms spring whenever the number changes.
- Case 03 comparator toggle: animate the `<` / `>` / `=` symbol with a flip rotation when toggled; show a brief green check when the relation matches reality.
- Case 04 balance scale: tilt the scale beam to reflect the chosen comparator in real time, even before the answer is confirmed.
- Case 05 denominator stepper: each step morphs the conveyor/coolant/assembly grid so the child sees the bottom number physically reshape the world.

## 3. Investor-demo polish (applies to all cases)

- **Sound design (toggleable):** light UI ticks on tap, a soft "ding" on correct detect, a satisfying "snap" on repair completion, and a warm chime on Case Solved. Mute toggle in the header (persisted in `localStorage`). Single tiny `useSfx()` hook using `AudioContext` — no audio files needed for v1.
- **Confetti + screen flash on solved** using `canvas-confetti` (3KB). Triggers once per sub-case completion alongside the existing SuccessBanner.
- **Progress persistence:** `localStorage` key `gd:progress:v1` stores `{ [caseId]: { [subCaseId]: "solved" } }`. CasePickers already render a solved state — wire them to read/write this store so a judge can refresh the page without losing progress.
- **Demo Mode toggle** in the header: when on, auto-fills the AI Guide composer with a strong example explanation, lets the presenter ship it with one tap, and adds a "Reset Demo" button that clears progress. Useful on stage where typing is slow.
- **Micro-interactions everywhere:** hover lift on case-picker cards, focus rings on every interactive element, `prefers-reduced-motion` honored (skip springs, keep state changes), and a single shared `motion` helper so timings stay consistent.
- **Mobile pass:** verify every gesture in Cases 01–06 at 375px and 414px viewports; bump hit targets to ≥44px; ensure the chat panel collapses gracefully under the case file on small screens (already mostly true — confirm and fix any overflow).
- **Per-case meta polish:** unique `og:image` already TODO — add a simple gradient-card SVG-to-PNG for each case route's `head()` so social shares look intentional.
- **Empty/locked state messaging:** the "Unlocks after you repair the logic" line gets a small lock icon and a subtle pulse so judges instantly see chat is gated by mastery, not a bug.

## 4. Out of scope (call out explicitly)
- No backend changes, no AI prompt edits, no new routes, no auth.
- No new fraction concepts — same six cases, same math.
- Speech (TTS/mic) already exists and stays as-is.

## Technical notes
- New files: `src/components/case06/RepairCanvas.tsx`, `src/components/case06/BlueprintSlicer.tsx`, `src/components/case06/PaintCalibrator.tsx`, `src/components/case06/CircuitSegmenter.tsx`, `src/hooks/useSfx.ts`, `src/hooks/useProgress.ts`, `src/components/shared/DemoModeToggle.tsx`, `src/components/shared/SoundToggle.tsx`.
- Edited: all six `src/routes/play.case-0X.tsx` (wire progress + sound + confetti), `src/components/case06/cases.ts` (drop `toolLabel/toolHint`, add gesture metadata), each case's existing repair component for the polish pass, `src/styles.css` (snap-glow, segment-pulse keyframes).
- Deleted: `src/components/case06/RepairToolButton.tsx`.
- New dependency: `canvas-confetti` (and `@types/canvas-confetti`).
- No changes to `src/integrations/supabase/*`, no changes to `routeTree.gen.ts`.

## Estimated impact
~12 new files, ~10 edited files, one tiny dependency. Result: every case is end-to-end tactile, with the kind of feel-and-finish judges remember.
