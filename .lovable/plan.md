## Mission 2: Half Repair Station

Build a new self-contained mission focused on the concept of **halves = equal parts**, using a custom pointer-driven SVG slider (no `<input type="range">`).

### Files to create

**`src/components/Mission2HalfRepairStation.tsx`** — main component
- Props: `onExit: () => void`
- State: `currentIdx`, `splitPct` (0–100), `isDragging`, `isRepaired`, `dialogueKey`
- Manages the list of broken objects, ZED-4 dialogue per phase (intro → repairing → repaired), and progression with a "Next Object" button that fades in on success.

**`src/components/mission2/DragSlider.tsx`** — reusable pointer-based slider
- Props: `shape: "bar" | "disc" | "cell"`, `value: number`, `onChange(v)`, `isRepaired`, `locked`
- Uses `useRef` for the container, `getBoundingClientRect()` re-read on each pointer event (resilient to resize)
- `onPointerDown` → `setPointerCapture`, `onPointerMove` → compute pct from clientX/clientY relative to ref, `onPointerUp` → release
- Snapping: if `48 ≤ pct ≤ 52` on pointer up (and during move within ±1.5%), snap to 50, set `isRepaired=true`, fire `onChange(50)`
- Updates SVG geometry directly via state (single state var → cheap re-render)
- Thick draggable handle with `GripVertical` / `GripHorizontal` lucide icon, larger hit area, `touch-action: none`, `cursor-ew-resize`/`ns-resize`

**`src/components/mission2/shapes.tsx`** — three SVG render functions
- `EnergyBarShape({ pct, repaired })` — horizontal rectangle, vertical partition line
- `ReactorDiscShape({ pct, repaired })` — circle split into two arcs by a chord/wedge; pct controls wedge angle
- `PowerCellShape({ pct, repaired })` — vertical pill / battery, horizontal partition line
- Warning tint (soft amber) when `!repaired`, neon green/blue glow + pulse when `repaired`

**`src/components/mission2/ZedConsole.tsx`** — right-side dark console
- Dark blue panel, ZED-4 avatar (reuse a lucide `Bot` icon styled), status chip ("Error: Unequal Shares" → "Fixed: Equal Halves"), dialogue with a small typewriter effect (char-by-char via `useEffect` + interval, keyed by dialogue id)

### Files to edit

**`src/routes/play.tsx`**
- Mark Level 2 as `unlocked: true` and `done: 0`
- Add `Mission2HalfRepairStation` render branch: `if (activeLevel === 2) return <Mission2HalfRepairStation onExit={() => setActiveLevel(null)} />`

### Types

```ts
type BrokenItem = {
  id: string;
  name: string;            // "Energy Bar"
  shape: "bar" | "disc" | "cell";
  initialPct: number;      // e.g. 20 or 78
  intro: string;           // ZED's wrong claim
  repairHint: string;      // "Drag the thick line..."
  successLine: string;     // ZED's "aha" moment
};
```

4 items: Energy Bar (bar, 22), Reactor Core (disc, 78), Software Disk (disc, 30), Power Cell (cell, 70).

### Layout

```text
┌─────────────────────────────────────────────────────────┐
│ ← Map | Mission 2: Half Repair Station    Item 1 / 4    │
├──────────────────────────────┬──────────────────────────┤
│  WORKSHOP (white card,       │  ZED-4 CONSOLE           │
│  blueprint grid bg)          │  (dark blue panel)       │
│                              │                          │
│     [ SVG shape +            │   [avatar]               │
│       draggable line ]       │   status chip            │
│                              │   typewriter dialogue    │
│                              │   [Next Object →]        │
└──────────────────────────────┴──────────────────────────┘
```

- Blueprint grid: subtle CSS `background-image: linear-gradient(...)` in light blue on white
- Tailwind for layout, brand tokens from `src/styles.css` (`--color-brand-blue`, `--color-brand-yellow`, `--color-brand-mint`, `--color-bg-light`)
- Framer Motion for: shape entrance, status-chip flip, success glow pulse, Next button fade-in

### Drag behavior (technical details)

- `pointerdown` on handle → `e.currentTarget.setPointerCapture(e.pointerId)`, `setDragging(true)`
- `pointermove` while dragging → `rect = containerRef.current.getBoundingClientRect()`; for bar/disc-horizontal: `pct = clamp(((e.clientX - rect.left) / rect.width) * 100, 5, 95)`; for cell (vertical): use clientY/rect.height
- For disc: convert pct → wedge angle (`angle = (pct/100)*360`), render two SVG paths sharing a chord
- `pointerup` → release capture; if `Math.abs(pct - 50) <= 2`, snap to 50, set repaired, lock
- All updates flow through one `setSplitPct` call; no rAF needed (React batches and SVG repaint is cheap)

### Success flow per item

1. User snaps to 50 → glow pulse + status flips to "Fixed: Equal Halves" + dialogue swaps to `successLine`
2. After ~600ms, "Next Object" button fades in (motion `initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}`)
3. On final item, button becomes "Return to Map" → calls `onExit`

### Out of scope

- No backend / no `/api/evaluate*` calls (Mission 2 is pure manipulation; no free-text reasoning input)
- No changes to Mission 1 or shared `evaluate-core.ts`
- No new routes (rendered inside `/play` like Mission 1)