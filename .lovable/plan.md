# Plan: Neutral Detect targets + taller chat panel

## 1. Stop pre-highlighting the glitch in Detect stage

Today, when the child enters Detect, the glitch part already glows yellow — so they don't have to think. Change to: **all clickable targets share the same neutral "tap me" affordance** (soft ring + subtle pulse), and only the *correct* click triggers the confirming highlight before advancing.

### Behavior across all 6 cases
- During Detect, every candidate part is interactive and visually equal (e.g. Case 02: numerator AND denominator both pulse softly; Case 03/04: both fractions; Case 01: all slices/squares; Case 05/06: both operand positions).
- Click the **correct** glitch → brief confirm pulse → advance to Repair.
- Click a **wrong** part → gentle shake on that part + ZED says "Look again, Detective…" (reuse existing `DetectiveCallout` hint). No score penalty, no reveal. Child keeps trying.

### Files to change
- `src/components/case02/FractionDisplay.tsx` — replace `highlight` prop logic so that during `interactive` mode both number buttons get the neutral "tappable" style; only show yellow confirm highlight on the part matching `confirmedPart` (new prop).
- `src/components/case02/EnergyCrateSVG.tsx`, `FractionBarSVG.tsx`, `SolarPanelsSVG.tsx` — pass-through unchanged (they already wrap `FractionDisplay`).
- `src/components/case01/PizzaSVG.tsx`, `ChocolateSVG.tsx`, `CanvasSVG.tsx` — remove the pre-Detect glitch tinting; add a uniform "tappable" affordance to every slice/square/region while `interactive`; shake the clicked-wrong element.
- `src/components/case03/*SVG.tsx`, `ComparatorToggle.tsx` — both sides equally clickable during Detect; no pre-highlight on the wrong fraction.
- `src/components/case04/*SVG.tsx` — same: both sides neutral-clickable.
- `src/components/case05/*SVG.tsx`, `EquationDisplay.tsx` and `src/components/case06/*SVG.tsx`, `EquationDisplay.tsx` — both operand positions equally clickable; remove early highlight.
- `src/routes/play.case-0{1..6}.tsx` — change the `highlight` value passed to the visual during Detect from "the glitch part" to `"none"`. Add a `wrongClickKey` state that bumps on wrong clicks to drive the shake, and surface the existing "Look again, Detective…" hint via `DetectiveCallout` (it already shows during Detect/Repair). Only set the confirming highlight in the brief window between correct click and stage transition.

### Wrong-click handler (shared pattern)
```ts
const onPartClick = (part) => {
  if (stage !== "detect") return;
  if (part === c.glitchTarget) {
    setConfirmedPart(part);          // brief yellow pulse
    setTimeout(() => setStage("repair"), 400);
  } else {
    setWrongClickKey(k => k + 1);    // triggers shake on that part
  }
};
```
Visual components receive `wrongPart` + `wrongKey` and apply `animate-[shake_300ms]` to the matching element. Add a `shake` keyframe to `src/styles.css` (small ±4px translateX, 3 cycles).

## 2. Chat panel matches case-file card height

Currently `h-[600px]` forces scroll quickly. Make the chat aside stretch to the same height as the left case-file card so the two columns visually balance and the transcript has more room before scrolling.

### Files to change
- `src/routes/play.case-0{1..6}.tsx`:
  - On the chat wrapper, replace `h-[600px]` with `h-full min-h-[600px]` and add `lg:h-full` to the `<aside>` so it stretches.
  - Ensure the parent `grid` row stretches: add `lg:items-stretch` (default `stretch` already, but make explicit) and keep the aside as `lg:sticky lg:top-8 lg:self-stretch` (change `self-start` → `self-stretch`) so on tall left content the chat grows with it.
  - The internal `flex-1 overflow-y-auto` messages area already grows; only the outer container needed fixing.

Result: on desktop the chat card is exactly as tall as the case-file card. On mobile (stacked), it keeps `min-h-[600px]` so it's still usable.

## Out of scope
- No changes to chat logic, AI prompts, scoring rubric, or stage transitions.
- No changes to TTS / SpeakButton wiring.
- No new dependencies.
