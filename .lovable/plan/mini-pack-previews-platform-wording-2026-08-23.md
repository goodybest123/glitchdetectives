# Mini pack previews + "platform" wording

## 1. Mini pack page previews

Two Google Drive PDFs were provided:

- Second mini pack (existing "Glitch Detectives Mini Pack", slug `mixed-missions`) — 6 pages
- Third mini pack — new

Steps:
- Download both PDFs and render each page to `public/printables/mini-packs/<slug>/page-N.jpg` (same approach already used for Money Maths).
- Confirm page counts match the metadata.

## 2. Add the third mini pack

New entry in `src/components/printables/miniPacks.ts`:

- Title: Real-World Math Glitch Hunt - Mini Pack
- Slug: `real-world-glitch-hunt`
- Pages: 6
- Download link: http://selar.com/mini_glitch_detectives_hunt
- Badges: Real-World, 6 Pages, Free
- Description: the ZED-4 glitch-hunt copy (investigate, detect, repair, explain — pizza, toys, balloons)
- Three "what they will actually learn" blocks drawn from that copy

It appears automatically in the mini packs grid on `/printables` and at
`/printables/mini-packs/real-world-glitch-hunt`.

## 3. Replace "company" with "platform"

Update copy in:

- `src/routes/index.tsx` (hero eyebrow + meta description)
- `src/routes/__root.tsx` (site meta descriptions)
- `src/routes/about.tsx` (intro copy)
- `src/components/landing/Navbar.tsx` (code comment)

No layout or logic changes — text only.
