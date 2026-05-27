## Plan: Wire up Fractions Level 1 PDF

### 1. Add the PDF to the project
- Download the file from the provided Google Drive link (`1iKVxom5mfZ_qN1Zdyd7kT_eX7WwmMMUD`) and save it to `public/printables/fractions-level-1-foundations.pdf` so it's served from the app's own domain at `/printables/fractions-level-1-foundations.pdf`.

### 2. Update `src/routes/printables.fractions-l1.tsx`
- Replace the current "Workbook preview… arriving soon" placeholder card with:
  - An embedded PDF viewer using a native `<iframe>` / `<object>` pointing to `/printables/fractions-level-1-foundations.pdf`, sized responsively (e.g. ~`aspect-[8.5/11]` or `min-h-[80vh]`) with the brand styling already on the page.
  - A prominent **Download PDF** button (and a secondary "Open in new tab" link) above the viewer, using the existing `BLUE`/`YELLOW` brand tokens and a `Download` icon from `lucide-react`. The button uses an `<a href="…" download>` so the browser triggers a real download.
  - A graceful fallback message inside the `<object>` for browsers that can't render embedded PDFs ("Your browser can't preview PDFs — download it instead").
- Update the page `head()` description slightly to reflect that the workbook is now available.

### 3. No other changes
- `CategoryGrid.tsx` already links Level 1 → `/printables/fractions-l1` via "View Case File", so no routing changes are needed.
- No new packages, no backend, no design-system token changes.

### Technical notes
- Hosting from `public/` keeps the URL stable, works offline of Google Drive, and is cache-friendly.
- Using `<object data="…" type="application/pdf">` with an `<iframe>` fallback gives the broadest browser coverage for inline preview, while the explicit Download button guarantees the file is always retrievable even when inline preview is blocked (e.g. some mobile browsers).
