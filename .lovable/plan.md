## Goal
Replace the `/play` placeholder with a clean, responsive "Fraction Factory: Active Cases" learning dashboard.

## What we're building

### Page: `/play`
- Clean white background with generous whitespace and the existing design system tokens.
- Bold sans-serif header: **"Fraction Factory: Active Cases"**.
- Responsive grid: **3 columns × 2 rows on desktop**, stacking to 1 column on mobile.

### Card 1 — Active Case
- Background: white with a soft drop shadow.
- Top-left badge: bright yellow pill (`#ffde59`-ish) with dark text reading **"ACTIVE CASE"**.
- Title: **"Case 01: Parts of a Whole"** (bold).
- Subtitle: **"Are the slices fair?"** (soft grey).
- Bottom action: bold dark text link **"INVESTIGATE ->"** (placeholder — no navigation yet).

### Cards 2–6 — Pending Cases
- Background: flat muted light grey (no shadow).
- Top-left badge: grey pill with white text reading **"CASE PENDING"**.
- Titles:
  - Case 02: Naming the Pieces
  - Case 03: The Shape Shifters
  - Case 04: The Scale Weigh-In
  - Case 05: Combining Matches
  - Case 06: The Mismatched Puzzle
- Visual center: clean white circle with a soft grey lock icon (Lucide `Lock`).
- No action buttons.
- Clicking reveals a "Coming soon" tooltip or toast.

### Design constraints
- Neuro-inclusive: no timers, no scores, no flashing elements.
- Calm, uncluttered layout.
- Use existing Tailwind v4 tokens and semantic colors from `src/styles.css` where possible.

## Technical details
- Single file: `src/routes/play.tsx` (update existing placeholder).
- No new npm dependencies needed (Lucide icons already available).
- No backend changes needed.
- No new routes needed.

## Out of scope
- Case detail pages.
- Actual game logic or mission content.
- Authentication or progress tracking.