# Fix: Pizza pieces must be visibly unequal everywhere

## Problem (confirmed in code)

Two places in `PizzaCaseActivity.tsx` make the pizza look fairly divided:

1. **ZED-4's completed solution** (`UnequalPizza`): drawn as three full-diameter lines rotated 18°/42°/70° through the center. Full-diameter lines always split a circle into halves-looking regions, so the pizza reads as roughly quartered — not "one piece each, different amounts".
2. **Investigation/comparison pieces**: every draggable piece is the same fixed-size box (`h-16 w-20`) with the same 🍕 emoji. Pieces A–D have a `size` label (`large`, `small`, `medium`, `mediumLarge`) but it is never rendered — so when a child drags two pieces side-by-side to compare, they look identical, breaking the evidence step.

## Fix

Define the four shares as real wedge angles with clearly different sizes, used consistently in both places:

```text
Piece A (Maya)  = 150°  — very large
Piece B (Leo)   =  45°  — small sliver
Piece C (Sam)   =  90°  — medium quarter
Piece D (ZED-4) =  75°  — medium-small
```

### 1. Completed-solution pizza

- Replace the rotated-lines `UnequalPizza` with an SVG that draws four true arc wedges using the angles above (reusing the polar/arc technique already in `PizzaSVG.tsx`).
- Crust, cheese base, a few topping dots, and visible cut edges on each wedge.
- Result: at a glance, one huge piece, one sliver, two in-between — unmistakably "different amounts".

### 2. Draggable investigation pieces

- Replace the emoji box with an inline SVG wedge per piece, drawn with that piece's actual sweep angle (150°/45°/90°/75°), inside a transparent hit area.
- Piece size on the board scales with its angle, so a child dragging piece A next to piece B immediately sees one is much bigger.
- Keep all existing behavior: tap to select, pointer drag, rotate tool, keyboard access, selected outline, undo/reset.

### 3. Evidence step (Detect)

- The two pieces the child picks for side-by-side comparison render with the same true wedge shapes and sizes, so "They are the same size / different sizes" is a real visual judgment. The correct answer ("different sizes") stays as-is.

## Out of scope

- No changes to the repair cutting interaction (that stage intentionally produces equal quadrants).
- No changes to Chocolate/Canvas, other cases, gating, or AI chat.

## Verification

- TypeScript check + targeted lint on the edited file.
- Browser check of the Investigate and Detect screens: completed pizza visibly unequal; dragged pieces visibly different sizes; evidence comparison shows two different-sized wedges.
