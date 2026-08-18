# Fractions Foundations Collection + buyer preview page

Consolidate the printables library into a single fractions product ("Foundations Collection", Levels 1 & 2 combined) and add a page where buyers can preview real workbook pages before downloading.

## 1. Remove Level 2

- Delete the Level 2 card from the fractions learning path in the printables library.
- Delete the standalone `/printables/fractions-l2` page and its link from the library.
- The path becomes: Level 1 (live) + Level 3 (classified/coming soon).

## 2. Rewrite the Level 1 card as the Foundations Collection

New copy on the card and on the `/printables/fractions-l1` detail page:

**Glitch Detectives: Fractions — Foundations Collection (Includes Levels 1 & 2 Missions)**

Badges: Grades 1–2 · Fractions · 21 Pages · Instant Digital Download · Free

Body sections:
- Intro: complete printable workbook combining Levels 1 and 2; children become Lead Detectives who investigate mistakes, repair misconceptions and explain their thinking.
- "Become the Lead Detective and Solve Fraction Mysteries" — the Sam narrative and the investigate / detect / repair / explain framing; reasoning-first rather than memorisation.
- "What's Inside":
  - Level 1 — Building Strong Foundations: equal and unequal parts, halves, quarters, fractions in everyday contexts, connecting pictures with fraction language, explaining mathematical thinking.
  - Level 2 — Deeper Fraction Investigations: numerators and denominators, fractions of a set, comparing unit fractions, equivalent fractions, fractions on a number line, adding and subtracting with the same denominator.

The download button keeps pointing to the existing Google Drive workbook link.

## 3. New preview page

New route `/printables/fractions-l1/preview` (linked from the card and from a "Preview pages" button on the detail page).

- Sample gallery of the first 5 pages of the workbook, rendered as images from the Level 1 PDF already in the project.
- Each page shown as a card with a page number; clicking opens a lightbox with a larger view and next/previous navigation, closable with Escape.
- After the samples, a "That's the sample — the full 21-page collection is free" panel with the download CTA and the What's Inside summary.
- Fully responsive: single column on mobile, two/three up on tablet and desktop; lazy-loaded images.

## Technical notes

- Page images are generated once from `public/printables/fractions-level-1-foundations.pdf` with `pdftoppm` at web resolution, written as compressed JPGs under `public/printables/preview/` and referenced by path (keeps the bundle small; the source PDF is ~21 MB).
- Copy for the collection lives in one shared module (e.g. `src/components/printables/collection.ts`) so the card, detail page and preview page stay in sync.
- Gallery + lightbox are a new client component `src/components/printables/PagePreviewGallery.tsx`; no backend changes.
- The new route gets its own `head()` with a unique title, description and og tags.
