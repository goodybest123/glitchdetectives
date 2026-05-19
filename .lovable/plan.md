## Problem

Level 1, Mission 3 (Quarter Core Reactor) recycles only two shapes — `GridShape` (2x2 grid) and `BarShape` (horizontal strip) — across its four items, so Solar Array & Window look identical, and Chocolate Bar & Cargo Shelf look identical. Kids see the same visual twice in a row.

## Goal

Give Mission 3 four visually distinct quarter shapes, and also de-duplicate Mission 4's quarter items so nothing repeats within a mission.

## Approach

Add two new SVG shape components alongside the existing ones, then assign a unique render to each Mission 3 / Mission 4 item.

### New shapes (in `src/lib/glitches.tsx`)

1. **`PizzaQuartersShape`** — circular pizza with 4 wedges driven by 3 angle sliders (`vals` are 3 cut angles 0–100 mapped to 0–360°). Target `[25, 50, 75]`. Used for a pizza-style quarter item.
2. **`VerticalStackShape`** — tall rectangle split into 4 stacked horizontal bands (think "4-floor building" / stacked shelves) using 3 horizontal dividers. Target `[25, 50, 75]`.

Both follow the existing semantic-token styling (`var(--color-...)`) and accept `(vals, repaired)`.

### Mission 3 reassignment (`src/lib/glitches-extra.tsx`)

| Item | New visual | Mechanic |
|---|---|---|
| Solar Array | `GridShape` (2x2 panels) — keep | range, 2 sliders |
| Quarter Chocolate Bar | `BarShape` parts=4 — keep | range, 3 sliders |
| Window Quadrants | `PizzaQuartersShape` (rebranded as "Round Window") OR keep grid but rename → swap to new `VerticalStackShape` reframed as "Stained-Glass Tower Window" | range, 3 sliders |
| Cargo Shelf | `VerticalStackShape` (4 stacked shelves — natural fit) | range, 3 sliders |

Final mapping: Grid, Bar, Pizza-quarters, Vertical-stack — four distinct visuals.

We'll rename "Window Quadrants" → "Quarter Pie Sensor" (or similar) so the narrative matches the pizza-style wedge visual. Copy tweaks are minor and stay on-mission ("four equal quarters").

### Mission 4 cleanup

Mission 4 currently has `m4-solar-quarters` (GridShape) and `m4-chocolate-quarters` (BarShape parts=4). These are already distinct from each other and from the two halves items, so no shape changes needed — but we'll verify and adjust only if a duplicate sneaks in.

### Out of scope

- No changes to Mission 1, Mission 2, Level 2+, phase loop, AI endpoints, TTS, or repair mechanic logic.
- No design-system token changes.
- No new dependencies.

## Files touched

- `src/lib/glitches.tsx` — add `PizzaQuartersShape` + `VerticalStackShape` helpers (no changes to existing GLITCHES entries).
- `src/lib/glitches-extra.tsx` — update Mission 3 items to use the four distinct render functions; minor name/copy tweaks where the visual changes.