# Add 7-Day Math Without Worksheets Homeschool Challenge mini pack

## User-facing changes

- Add a fifth free mini pack to the `/printables` Mini Packs section titled **The 7-Day Math Without Worksheets Homeschool Challenge**.
- Use the supplied Selar URL for the download action and add a preview page at `/printables/mini-packs/7-day-math-without-worksheets-challenge`.
- Present the supplied positioning: 7 days, 7 real-world investigations, 0 worksheets; five minutes a day; parent scripts and prompts; Detective ID Card; ZED-4 finale; certificate; and supportive parent guidance.
- Use only PDF pages 2, 7, and 11 as buyer-facing sample pages in the card and detail-page gallery. The preview will label them with their original page numbers.

## Implementation

- Extend the mini-pack data model so a pack can define selected sample page numbers separately from its full printable page count, while preserving the existing full-page behavior for the current packs.
- Download the supplied Google Drive PDF, render only pages 2, 7, and 11 into `public/printables/mini-packs/7-day-math-without-worksheets-challenge/`, and use page 2 as the library card cover.
- Add concise metadata, badges, long-form description paragraphs, and three learning outcomes to `src/components/printables/miniPacks.ts`, including the provided Selar link.
- Update the shared page preview helper/gallery copy so the selected samples show an accurate “sample pages” count and keep the existing lightbox navigation and accessibility behavior.
- Keep the existing `/printables/mini-packs/$slug` route and SEO pattern, adding unique metadata for the new pack rather than creating a new route shape.

## Validation

- Confirm the three rendered sample images exist and correspond to source pages 2, 7, and 11.
- Verify the new pack appears on `/printables`, its View pack link resolves, the Selar link opens externally, and the detail gallery contains exactly the three selected samples.
- Check the detail page at desktop and mobile widths for readable copy, intact card layout, and working lightbox controls.

## Technical details

- Likely files: `src/components/printables/miniPacks.ts`, `src/components/printables/PagePreviewGallery.tsx`, and `src/routes/printables.mini-packs.$slug.tsx`; add only the new public preview assets required by the supplied PDF.
- Use a stable slug such as `7-day-math-without-worksheets-challenge` and retain the current site visual language and existing route architecture.
