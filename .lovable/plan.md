# Verdict Buttons: "Is there a glitch?" gating across all 6 cases

## New flow (replaces current investigate → detect)

```
INVESTIGATE  →  VERDICT       →  DETECT             →  REPAIR → EXPLAIN → SOLVED
ZED-4 claim     2 buttons:       Click the actual      (existing)
                · There IS a     glitch spot on the
                  glitch         visual (existing
                · No glitch      click-the-thing
                                 interaction)
```

- Tapping **"There IS a glitch"** advances to the existing DETECT stage where the visual becomes interactive and the child clicks the glitchy area (pizza slice, equation result, mismatched piece, etc.) → this then unlocks REPAIR exactly as today.
- Tapping **"No glitch"** is wrong: the buttons row shakes, a small penalty is recorded (investigate score drops by 1, min 3), the child can try again. ZED-4 stays silent.

## New shared component

`src/components/shared/VerdictButtons.tsx` — two large, kid-friendly buttons under the visual with a small prompt ("Your verdict, Detective?") and a speaker. Props: `onGlitch()`, `onNoGlitch()`, `shakeKey` (number that triggers a shake animation when bumped), `disabled`.

## Per-route changes (cases 01–06)

Each `play.case-0X.tsx` needs:

1. Add `"verdict"` as an intermediate UI sub-state. Implementation: keep `Stage` as-is and use a local `verdictPassed` boolean. Initial state: stage = `investigate`, `verdictPassed = false`.
2. ZED-4's confident-wrong claim remains visible during INVESTIGATE. **The visual is NOT yet interactive** until the verdict is given correctly.
3. Render `<VerdictButtons>` directly under the visual whenever `stage === "investigate" && !verdictPassed`.
4. On "There IS a glitch":
   - set `verdictPassed = true`
   - advance to DETECT (`setStage("detect")`)
   - the existing visual click-to-detect handler (`onGlitchClick`, `onResultClick`, etc.) is then enabled exactly as today.
5. On "No glitch":
   - bump `wrongVerdictCount` (cap at 2 for scoring)
   - bump `shakeKey` so the buttons shake
   - stay in INVESTIGATE
6. Move the existing `DetectiveCallout` ("Click the pizza slice that's unfair…") so it appears only during DETECT (i.e. after the verdict passes), not during INVESTIGATE. The callout stays — it's now the prompt for *where* to click.
7. Scoring: in the `marks` memo, deduct from `investigate` based on `wrongVerdictCount` (5 if zero wrong, 4 if one wrong, 3 if two+).

Cases that currently use `handleResultClick` on the equation result (cases 05, 06) and cases that use `onGlitchClick` on the SVG (cases 01–04) all follow the same pattern — only the handler name differs.

## CaptionLine copy tweak

Update each `cases.ts` `captions.investigate` to ask the verdict question instead of telling the child to click the visual, e.g.:
- Case 01 pizza: "Scan ZED-4's logic. Do you spot a glitch — or is this fair?"
- Case 05 conveyor: "Scan the equation. Is ZED-4's math glitched, or is it correct?"
- Etc. for all 18 sub-cases (3 per case × 6 cases).

The existing `captions.detect` already says "click the …" so it works unchanged for the new DETECT step.

## Out of scope (not changing)

- Repair mechanics, SVGs, AI chat routes, diagnostic report layout, SuccessBanner, audio.
- The stepper component (`CaseStepper`) keeps the same 5 stages; the verdict is a sub-step inside INVESTIGATE, not a new stage chip.

## Files touched

- New: `src/components/shared/VerdictButtons.tsx`
- Edited: `src/routes/play.case-01.tsx` … `play.case-06.tsx` (6 files)
- Edited: `src/components/case0{1..6}/cases.ts` (6 files — caption.investigate copy only)
