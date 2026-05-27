## Plan: Fix Fractions Level 1 card + View Case File link

### 1. Update card meta in `src/components/printables/CategoryGrid.tsx`
- In `FRACTION_LEVELS`, change Level 1 `meta` from `["Grade 1", "12 pages"]` to `["Grade 1-2", "6 pages"]`.

### 2. Fix "View Case File" so it actually opens the PDF
Currently the button links to `/printables/fractions-l1` (the preview page). The user says clicking it does not lead to the PDF. Two changes:
- Change the Level 1 card's button from a `<Link to="/printables/fractions-l1">` to an `<a href="/printables/fractions-level-1-foundations.pdf" target="_blank" rel="noopener noreferrer">` so clicking immediately opens the workbook PDF in a new tab (the file already exists at `public/printables/fractions-level-1-foundations.pdf`).
- Keep the same blue pill styling and `View Case File` label + arrow icon — only the underlying element/target changes.

### 3. No other changes
- The `/printables/fractions-l1` route page stays as-is (still reachable directly if needed).
- No design tokens, routes, or backend changes.
