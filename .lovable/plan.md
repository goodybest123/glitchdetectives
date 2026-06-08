# Case 02: Naming the Pieces (Numerator & Denominator)

Mirror Case 01's architecture: a case picker with 3 sub-cases sharing one Investigate → Detect → Repair → Explain loop, an AI Socratic chat that unlocks after Repair, per-step marks, and a diagnostic report.

## Sub-cases

1. **Fraction Bar** — bar of 5 blocks (3 green, 2 white), displays `3/2`. Click denominator → highlight. Repair: `−/+` toggle, raise to 5 → `3/5`.
2. **Energy Crate** — 4 battery slots, 1 filled, displays `4/1`. Click fraction → pulse. Repair: circular Swap button flips to `1/4`.
3. **Solar Panels** — row of 6 panels, 4 active, sign reads `2/6`. Click numerator → highlight. Repair: `−/+` toggle, raise to 4 → `4/6`.

All three glitch on a number, not a shape. The Equalizer slider from Case 01 is replaced by a small inline number-control widget per sub-case.

## Files

**New**
- `src/components/case02/cases.ts` — sub-case registry: `id`, `title`, `subtitle`, `emoji`, `chatEndpoint`, `welcomeText`, `bubbles`, `captions`, `conceptMastered`, `Visual` component, `Repair` component, plus `initial` / `target` numbers and a `glitchTarget` ("denominator" | "fraction" | "numerator") to drive Detect highlighting.
- `src/components/case02/CasePicker.tsx` — 3 cards, solved checkmarks (mirrors Case 01 picker, restyled headers to "CASE 02.0X").
- `src/components/case02/FractionBarSVG.tsx` — 5 rounded blocks (3 pastel green, 2 white), big `numerator/denominator` next to it. Props: `{ numerator, denominator, highlight: "none" | "numerator" | "denominator" | "fraction", onClickPart(part), interactive }`.
- `src/components/case02/EnergyCrateSVG.tsx` — 4 battery slots in a rounded crate, glowing-green battery in 1 slot, large digital `top/bottom` display. Same prop shape; `highlight="fraction"` pulses both numbers.
- `src/components/case02/SolarPanelsSVG.tsx` — 6 panels (4 yellow glow, 2 grey), "Active Solar Power: top/bottom" sign.
- `src/components/case02/NumberStepper.tsx` — soft `[ − ] [ value ] [ + ]` control, bounded by `min`/`max`, disabled at target. Used by Fraction Bar and Solar Panels.
- `src/components/case02/SwapControl.tsx` — circular swap button used by Energy Crate; single click flips numerator/denominator with a 400ms transition.
- `src/components/case02/DiagnosticReport.tsx` — Case-02 variant (or reuse Case 01's by passing it through). Keeping a thin Case-02 wrapper is cleaner; same marks shape `{investigate, detect, repair, explain}` totalling /20.
- `src/routes/api/chat/case-02-bar.ts` — Socratic prompt focused on "the bottom number counts ALL the pieces".
- `src/routes/api/chat/case-02-crate.ts` — Socratic prompt on "the total goes on the bottom, the filled goes on top".
- `src/routes/api/chat/case-02-panels.ts` — Socratic prompt on "the top number counts the active pieces you were asked about".
- `src/routes/play.case-02.tsx` — page mirroring `play.case-01.tsx`: picker → `SubCaseRunner` keyed by sub-case id. Manages stage, the current number value (or swap state), AI chat, per-case marks, and the report.

**Edited**
- `src/routes/play.index.tsx` — promote Case 02 to a second ACTIVE CASE card (`/play/case-02`); remove it from `PENDING_CASES`.

## State & flow (per sub-case)

```
stage: "investigate" | "detect" | "repair" | "explain" | "solved"
value: number          // current denominator OR numerator (depending on sub-case)
swapped: boolean       // crate only
```

- INVESTIGATE: Visual is interactive; clicking the wrong number(s) → `setStage("detect")` + brief pulse.
- DETECT: target number highlights soft pastel yellow; ZED-4 bubble updates; stepper or swap control appears.
- REPAIR: each step adjusts `value` (or toggles `swapped`). When `value === target` (or `swapped === true`), success animation + green banner "Logic Repaired: …" and `setStage("explain")`.
- EXPLAIN: chat unlocks with the case's `welcomeText`. Detect `[[CASE_SOLVED]]` token from assistant → `setStage("solved")`, mark sub-case solved, scroll to report.

## Marks rubric (per sub-case, total /20)

- investigate: 5 once they leave Investigate.
- detect: 5 once a stepper/swap interaction begins.
- repair: 5 if reached target in minimum steps (bar: 3 clicks, crate: 1 swap, panels: 2 clicks); 4 if within +1 extra; 3 otherwise.
- explain: same heuristic as Case 01 (turns + longest message word count).

## Design notes (matches Case 01)

- White background, generous whitespace, rounded-3xl card with soft shadow.
- Reuse `CaseStepper`, `ZedBubble`, `SpeakButton`, `MicButton` from `case01/`.
- Pastel green `#bbf7d0`, soft yellow highlight `#fef9c3`, success banner `#dcfce7` / `#166534`.
- No timers, no scoreboards, no harsh red.

## Out of scope

- No persistence between sessions.
- No changes to Case 01 or shared chat components.
- No new audio/voice features.
