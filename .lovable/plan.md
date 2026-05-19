## Goal
Add two non-halves shapes to Mission 1 so kids practice repairing thirds and quarters (not only halves).

## Current state
Mission 1's lineup is halves-only: pizza, battery, fuelrod. The `GLITCHES` library already defines two non-halves shapes with full render + briefing/detect/repair copy:
- `chocolate` — chocolate bar split into thirds (2 dividers, target 33.33 / 66.66)
- `solar` — solar panel split into quarters (2 dividers, target 50 / 50 on a grid)

## Change
Add both to Mission 1's shape rotation in `src/components/FractionFactoryLevel1.tsx`:

```ts
const MISSION_1_SHAPES: Glitch[] = [
  GLITCHES.find((g) => g.id === "pizza")!,
  GLITCHES.find((g) => g.id === "chocolate")!,   // new — thirds
  GLITCHES.find((g) => g.id === "battery")!,
  GLITCHES.find((g) => g.id === "solar")!,       // new — quarters
  GLITCHES.find((g) => g.id === "fuelrod")!,
];
```

Ordering interleaves halves and non-halves so difficulty escalates gently (half → thirds → half → quarters → half).

## Why this works without other code changes
- The mission runner already iterates `MISSION_1_SHAPES` generically and reads `parts`, `initialVals`, `target`, `tolerance`, and `render` from each glitch.
- The repair slider UI already supports multi-divider shapes (`chocolate` uses 2 sliders, `solar` uses 2 sliders) since `initialVals.length` drives the slider count.
- All ZED dialogue lines (briefing / investigate / detect / explainWrong / repair / success) already exist on both glitches.
- The "0/N Missions Completed" / per-mission progress counter reads from `MISSION_1_SHAPES.length`, so it updates automatically (3 → 5).

## Files
- `src/components/FractionFactoryLevel1.tsx` — extend `MISSION_1_SHAPES` array (one edit).

No backend, no styling, no new components.
