# Fraction Factory — Level Select Hub

## Goal
Clicking "Fraction Factory" from the landing Worlds section opens a new Level Select hub (instead of the current Intro/MissionMap screen). Also clean up the Worlds list copy by removing grade prefixes.

## Changes

### 1. `src/components/landing/sections.tsx` — Worlds copy
Strip the leading "Grade X — " from each `WORLDS` entry's `subtitle`. Example: `"Grade 1 — Repair mis-cut shapes…"` → `"Repair mis-cut shapes and teach ZED-4 about equal parts."` Apply to all 6 worlds. No layout changes.

### 2. `src/routes/play.tsx` — replace Intro with Level Select hub
Remove the existing `Intro` view and the 4-card `MissionMap`. New `/play` default view = `LevelSelect`. Clicking the unlocked Level 1 card transitions to the existing `MissionRunner` (preserve that wiring + the "Back to Map" returning to Level Select). Keep imports of `MissionRunner` and `speakText`; drop `Bot`, `Cpu`, etc. unused after refactor.

### 3. New component: `LevelSelect` (inside `play.tsx`, or split into `src/components/play/LevelSelect.tsx`)

**Layout**
- Page wrapper: `min-h-screen` with `background: var(--color-bg-light)`.
- Hero header band: dark blue (`--color-brand-blue`), white text, rounded-b-3xl, padded.
  - Top row: "← Return to Map" link (to `/#worlds`) on the left; "Detective Access Granted" pill badge (yellow bg, blue text, Shield icon) on the right.
  - Center: tilted yellow square (`rotate-6`, `--color-brand-yellow` bg, rounded-2xl, shadow) containing a `Factory` lucide icon in brand blue. Subtle float animation (framer-motion `y: [0,-6,0]` loop).
  - Headline: `Fraction Factory` (heading-black, uppercase, large).
  - Subhead: `Central Control Hub` (label-eyebrow, mint color).

**Timeline**
- Container `max-w-5xl mx-auto px-4 py-16 relative`.
- Vertical track: absolutely-positioned `div` — `left-4 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-px bg-[color-mix(in_oklab,var(--color-brand-blue)_15%,transparent)]`.
- Levels rendered as a `space-y-16` list. Each item is a `flex` row; on `md+`, even-indexed items get `md:flex-row-reverse`. On mobile all items align left of the track.
- Center node per level: small circular badge on the track (`w-5 h-5 rounded-full`), brand-blue if unlocked, gray-300 if locked, with white ring. Positioned absolutely at the track's x.

**Level card** (each item)
- `relative w-full md:w-[46%] bg-white rounded-2xl shadow-md p-6 overflow-hidden border`.
- Unlocked: `border-[var(--color-brand-yellow)] hover:-translate-y-1 hover:shadow-xl transition`; locked: `border-gray-200 opacity-60 pointer-events-none`.
- Decorative blurred circle: absolutely positioned top-right, `w-40 h-40 rounded-full blur-3xl opacity-30`, mint for unlocked, gray for locked.
- Top row: colored square level icon (rounded-xl, 48px, brand-blue bg with yellow icon for unlocked / gray for locked) + status pill (`In Progress` yellow / `Locked` gray with `Lock` icon) + `0/N missions completed` tag (mono small).
- Body: eyebrow `LEVEL X • GRADE Y` (mono uppercase), bold title (text-2xl), gray description in a `bg-gray-50 rounded-lg p-3` box, then `Focus Areas:` label + value line.
- Bottom button: unlocked → "Enter Level" (brand-blue bg, white, ArrowRight) that triggers `onStart()` (only Level 1 wired to mission). Locked → disabled "Level Locked" (gray bg, Lock icon).

**Level data** (constant array)
```
1  Fraction Foundations           Grade 1  Equal parts, halves            unlocked, 0/4 missions
2  Fraction Discovery Zone        Grade 2  Thirds, fourths, naming        locked,  0/5
3  Number Line & Equivalence …    Grade 3  Equivalence on a number line   locked,  0/5
4  Fraction Repair Systems        Grade 4  Add/subtract like fractions    locked,  0/6
5  Advanced Fraction Operations   Grade 5  Multiply, divide, mixed        locked,  0/6
6  Fraction Mastery Lab           Grade 6  Ratios, proportional reasoning locked,  0/6
```
Each level also has a descriptive sentence used in the gray description box.

### 4. Routing
Worlds card for Fraction Factory already links to `/play`, so no route changes needed. `MissionRunner`'s `onExit` now returns to the Level Select view instead of the old map.

## Out of scope
- No changes to `MissionRunner`, AI eval, or other landing sections.
- No grade label removed from the level cards themselves — grades only removed from the landing Worlds copy.
