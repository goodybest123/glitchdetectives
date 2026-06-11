## Goal

On `/play/report`, add a "Download PDF" button that generates and downloads the report as a real PDF file — no print dialog, no reliance on the preview page.

## Approach

Use client-side PDF generation so it works regardless of browser/extension blocking:

1. Add `jspdf` and `html2canvas-pro` (the `-pro` fork supports modern CSS colors like `oklch` used in the theme).
2. In `src/routes/play.report.tsx`:
   - Wrap the printable report content in a `ref`-tracked container.
   - Add a "Download PDF" button next to the existing Print button in the header (hidden via `print:hidden`).
   - On click: rasterize the container with `html2canvas-pro` at 2x scale, then slice into A4 pages with `jsPDF` and save as `glitch-detectives-report-<date>.pdf`.
   - Keep the existing Print button as a secondary option.
3. Show a small "Generating…" state on the button while the canvas renders so a long report doesn't feel frozen.

## Technical notes

- `html2canvas-pro` over `html2canvas` because the design tokens use `oklch()`; the original chokes on it.
- Multi-page handling: render once, then use `addImage` with negative Y offsets per A4 page height.
- No server work — fully client-side, so the blocked preview / ad blocker is irrelevant.

## Out of scope

- Changing the report layout/content.
- Server-side PDF rendering.
- Adding the button to other routes (only `/play/report` per request).
