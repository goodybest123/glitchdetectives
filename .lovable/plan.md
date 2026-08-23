# Glitch Detectives Mini Packs on /printables

Add a free "Mini Packs" section to the printables library, below the topic grid, with its own preview pages built from the PDFs you upload.

## What gets built

**1. New section on `/printables`: "Glitch Detectives Mini Packs"**
- Sits directly below the "Choose a maths world" topic grid, above the benefits row.
- Short intro line: quick, free, low-prep detective missions.
- A card per mini pack showing: cover image (page 1 of the PDF), title, page count, topic badges, a "Free" badge, plus two buttons — "Download pack" (Selar/asset link) and "Preview pages".

**2. Per-pack preview pages**
- Route: `/printables/mini-packs/$slug` (e.g. `/printables/mini-packs/money-maths`).
- Reuses the existing lightbox gallery from the fractions preview, showing every page of the mini pack as an image.
- Full product copy (description, "what they'll learn"), badges, and the download button.

**3. Content source**
- Each uploaded PDF is rendered to page images (same pipeline used for the fractions samples) and stored under `public/printables/mini-packs/<slug>/`.
- All copy lives in one data file so packs are easy to add or edit later.

## Packs

1. **Glitch Detectives — Money Maths** (4 pages) — Pantry Restock Mission + Toy Store Takeover; auditing receipts, Quantity × Unit Price checks, fixing subtotals; Investigate / Detect / Repair / Explain / Result framework.
2. **Glitch Detectives Mini Pack** (6 pages, Grades 2–4) — addition, fractions, multiplication, measurement missions plus a parent guide.
3. **Third combined-topic pack** — placeholder slot; I'll add title, copy and pages when you send it.

All three are marked **Free**.

## Technical notes

- New `src/components/printables/miniPacks.ts` data module (title, slug, blurb, long copy, page count, badges, download URL, page image paths).
- New `MiniPacksSection.tsx` rendered from `printables.index.tsx`.
- New route `src/routes/printables.mini-packs.$slug.tsx` with per-pack `head()` metadata (unique title/description/og tags).
- `PagePreviewGallery` generalised to take a pages array prop instead of importing `PREVIEW_PAGES` directly; fractions preview keeps current behaviour.
- Page images generated with `pdftoppm` at web-friendly resolution and JPEG-compressed.

## What I need from you

- The 3 PDFs (upload in your next message).
- The download link per pack (Selar link, or I host the PDF directly if you prefer).
- Title + description for the third pack.
