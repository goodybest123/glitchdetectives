# Fix verdict → detect → repair flow across all 6 cases

## What's wrong today

- After "THERE IS A GLITCH" the child stays on `investigate` (verdict just unlocks the result click). The stage label should move to **Detect**.
- The Detect caption still says "Click on the pizza where the sharing is not fair" — should be a short "Click on the glitch."
- Only the equation result is clickable. The visual (pizza slice, crate, beam, etc.) should also count.
- Clicking the glitch currently jumps straight to `detect`; it should move to **Repair** so the Repair tool button is the next step.

## New flow

```
INVESTIGATE (ZED-4 claim + Verdict buttons)
   └─ click "THERE IS A GLITCH" → stage = DETECT, caption = "Click on the glitch."
DETECT (visual + result are both clickable)
   └─ click either → stage = REPAIR, Repair tool button appears
REPAIR
   └─ tap repair tool → repaired = true → stage = EXPLAIN
EXPLAIN → SOLVED
```

## Changes

### 1. Route files (all 6: `src/routes/play.case-0X.tsx`)

- `handleVerdictGlitch`: also set `setStage("detect")` (not just `verdictPassed`).
- New `handleGlitchSpotClick` (or reuse existing detect-click): when `stage === "detect"`, advance to `"repair"` and pulse. Wire it to BOTH the visual click and the equation result click.
- Equation/visual `clickable` prop: true while `stage === "detect"` (was `investigate && verdictPassed`).
- Existing `handleRepair` already moves repair→explain; unchanged.
- Update `showDetective` / caption gating so the Detective callout + "Click on the glitch" caption show during `detect`, and the Repair-tool block shows only during `repair`.

### 2. Visuals — make them clickable in Detect

Each case's primary SVG/visual component gets an optional `onGlitchClick` (or wrapping `<button>` in the route). Cases:
- 01 Pizza, Chocolate, Canvas
- 02 Fraction bar, Crate, Panels
- 03 Tanks, Garden, Disks (these already may use a comparator click — keep that path, also accept a visual click)
- 04 Beams, Coolant, Cargo (balance scale)
- 05 Conveyor, Assembly, Coolant drain
- 06 Blueprint, Paint, Circuit

Simplest implementation: wrap the rendered visual in a `<button type="button" disabled={stage !== "detect"}>` inside the route file rather than editing each SVG component. Adds a soft hover ring when active.

### 3. Captions (`src/components/case0X/cases.ts`)

Change every `captions.detect` to a short generic line. Proposed copy (kid-friendly, with light per-world flavor — speakable via existing CaptionLine):

- Case 01: "Click on the glitch."
- Case 02: "Click on the glitch."
- Case 03: "Click on the glitch."
- Case 04: "Click on the glitch."
- Case 05: "Click on the glitch."
- Case 06: "Click on the glitch."

(If you'd like a tiny bit of theme flavor instead — e.g. "Tap the glitched slice." / "Tap the glitched crate." — say the word and I'll vary per sub-case. Default is the uniform "Click on the glitch.")

### 4. Scoring

No change to the rubric. `detect = 5` once stage advances past detect (already true once stage hits `repair`/`explain`/`solved`).

## Out of scope

- Verdict buttons UI (unchanged).
- ZED-4 bubble copy, Detective callout copy, SuccessBanner, AI chat routes, SVG internals beyond accepting a click.
- CaseStepper component (it already renders Detect/Repair as separate stages).

## Files touched

- `src/routes/play.case-01.tsx` … `play.case-06.tsx` (6 files): handlers + clickable wrappers + caption gating.
- `src/components/case01/cases.ts` … `case06/cases.ts` (6 files): `captions.detect` copy only.
