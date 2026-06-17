## Goals

1. After the child picks the correct glitch option, the visual + repair tool should be in view immediately — no scrolling required.
2. The correct option must not always be "A". Spread it across A, B, C, D across sub-cases and (where possible) randomize per session.

## Changes

### 1. Scroll-to-repair on correct pick (all 6 cases)

Currently the repair tool only auto-scrolls when `stage` becomes `"repair"`, which happens after the child clicks the glitched object — one step after picking the correct multiple-choice option. On smaller laptops/Chromebooks/tablets the highlighted object often sits below the fold once the choices expand.

- In `src/components/shared/WorkbookActivity.tsx` (`WorkbookGlitchChoices`), add an `onCorrect` callback fired the moment the child picks the right option (in addition to the existing `onUnlock`).
- In each `src/routes/play.case-0{1..6}.tsx`, pass `onCorrect={() => repairRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })}` and also scroll once more when `stage === "detect"` becomes true with `glitchUnlocked`, so the highlighted visual is centered before the child clicks it.
- Tighten the visual+repair grid wrapper so on `detect` stage it already reserves space (no layout jump when repair appears).

### 2. Shuffle correct answer position (A/B/C/D)

`src/components/shared/glitchChoices.ts` currently returns each sub-case's choices with the correct one first. `WorkbookGlitchChoices` renders them in order and labels them A, B, C, D — so the correct answer is always A.

- Update `glitchChoices.ts`: each entry already marks `isCorrect`. Add a deterministic per-sub-case `correctIndex` (0–3) chosen to spread correct answers across positions (e.g. case-01 pizza→A, chocolate→C, canvas→B; case-02 bar→D, crate→A, panels→C; etc.). Reorder the `choices` array so the correct one sits at that index. This keeps it stable per sub-case (no re-render flicker, no hydration mismatch from SSR) while ensuring variety across the app.
- Verify `WorkbookGlitchChoices` reads `isCorrect` (not array index) when validating the click — if it currently assumes index 0, fix to use `choice.isCorrect`.

### Files touched

- `src/components/shared/WorkbookActivity.tsx` — add `onCorrect` prop, use `isCorrect` for validation.
- `src/components/shared/glitchChoices.ts` — reorder choices so correct index varies A/B/C/D across sub-cases.
- `src/routes/play.case-01.tsx` … `play.case-06.tsx` — wire `onCorrect` to `repairRef.scrollIntoView`.

No backend, AI, or content changes; only frontend layout + choice ordering.
