## Goal

Add filter tabs to the Printables Library. When "Fractions" is selected, the category grid swaps to a 3-column "sequential learning path" of fraction printables — Level 1 active, Levels 2 & 3 locked.

## Behavior

- Default tab: **All** → shows the existing 5-category pastel grid (unchanged).
- Tabs (left-aligned pill row, above the grid): `All`, `Fractions`, `Addition`, `Geometry`, `Decimals`, `Place Value`.
- Selecting `Fractions` → replaces grid contents with the **Fraction Learning Path** (3 cards).
- Selecting any other topic → same grid but pre-filtered to a single "Coming soon" card for that topic (keeps the page balanced rather than empty).
- State is local React state inside `CategoryGrid` (no URL sync yet — keeps scope tight; can be lifted to search params later).

## Fraction Learning Path (3-column grid)

```text
┌─────────────────┬─────────────────┬─────────────────┐
│  LEVEL 1        │  LEVEL 2        │  LEVEL 3        │
│  [color image]  │  [grayscale]    │  [grayscale]    │
│  Foundations    │  Classified     │  Classified     │
│  Investigate    │  Mission brief  │  Mission brief  │
│  sharing        │  is sealed.     │  is sealed.     │
│  mistakes…      │                 │                 │
│  [View Case     │  [Mission in    │  [Mission in    │
│   File →]       │   Progress]     │   Progress]     │
└─────────────────┴─────────────────┴─────────────────┘
```

**Level 1: Foundations** (active)
- Full-color illustrated tile (CSS-built placeholder: mint background, pie-chart icon, "F1" stamp, "GRADE 1" eyebrow — same visual language as the existing workbook cover).
- Description: "Investigate sharing mistakes — spot unequal halves, repair mis-cut shapes, and explain why fair means equal."
- Meta chips: `Grade 1` · `12 pages`.
- Primary CTA: `View Case File →` → links to `/printables/fractions-l1` (already exists).

**Level 2 & Level 3** (locked)
- Same tile structure, but the illustrated tile is rendered with `grayscale` + reduced opacity, a soft overlay, and a centered `Lock` icon.
- Description (L2): "Mission classified. Equivalence and number-line cases unlock soon."
- Description (L3): "Mission classified. Comparison and pathway cases unlock soon."
- Replace the button with a non-clickable badge: `Mission in Progress` (muted slate background, `Clock` icon).
- Whole card has `cursor-default`, no hover lift, `aria-disabled="true"`.

## Visual / accessibility

- Tabs: soft pill bar; active = solid `--color-brand-blue` on white text; idle = transparent with subtle border, `--color-brand-blue/70`. Keyboard-navigable via native `<button>` with `aria-pressed`.
- Cards keep the existing `rounded-3xl`, generous padding (`p-8`), border `black/5`, gap `8`.
- Locked cards use only neutral grays — no red — to stay calm and non-punitive.
- Single H2 above ("Choose a maths world") stays; when a filter is active, swap subtitle line to context-aware copy ("Follow the fraction case files in order.").
- Maintains the same vertical rhythm as the rest of the page (no layout jumps).

## Files

**Edited**
- `src/components/printables/CategoryGrid.tsx`
  - Add local `activeTab` state and `<FilterTabs />` row.
  - Extract existing card markup into a small inline `CategoryCard` component.
  - Add a new `FractionLearningPath` section rendered when `activeTab === "Fractions"`.
  - Render a single "Coming soon" card when another specific topic is selected.

**Not touched**
- Routes, hero, spotlight, benefits row, navbar.
- No new files — keeps the addition surgical and one-purpose.

## Out of scope

- URL persistence of the active tab (would need a `validateSearch` on `/printables`).
- Real images for the Level 1 tile (CSS placeholder matches existing brand language).
- Level 2 / Level 3 detail routes (locked state needs no destination).
