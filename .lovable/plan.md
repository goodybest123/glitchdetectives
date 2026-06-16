# Add Fractions Level 2 Workbook

Mirror the Level 1 setup with a new downloadable PDF and detail page, and unlock the Level 2 card in the library.

## Steps

1. **Fetch the PDF from Google Drive** (`1oeicJkXs_tzCcE1mORAn0Fn_Sg6-3RpA`) using the direct-download endpoint (`https://drive.google.com/uc?export=download&id=...`, with confirm-token fallback for the virus-scan interstitial). Save to `public/printables/fractions-level-2-numerators-denominators.pdf` so it serves as a static asset (no auth, fully downloadable).

2. **Create `src/routes/printables.fractions-l2.tsx`** — duplicate the L1 route exactly (same hero, badge, Download PDF + Open in new tab buttons, inline `<object>`/`<iframe>` preview, same captions and copy structure). Only swap:
   - Route path → `/printables/fractions-l2`
   - Card label `F1` → `F2`, "Level 1" → "Level 2"
   - Title → "Fractions Level 2"
   - Lead paragraph → short Level 2 intro
   - PDF href → the new file
   - `<head>` meta (title, description, og:title, og:description) → Level 2 specific

3. **Update `src/components/printables/CategoryGrid.tsx`** — change the Level 2 entry in `FRACTION_LEVELS` from locked "Classified" to a live card:
   - `title: "Numerators & Denominators"`
   - `locked: false`, `href: "/printables/fractions-l2"`
   - `meta: ["Grade 3-5"]`
   - Description uses the same caption framing as Level 1 (Investigate/Detect/Repair/Explain, neuro-inclusive design, etc.), with **Workbook Details** updated to:
     - Focus: Numerators and Denominators
     - Understanding fractions within a set of items
     - Comparing unit fractions
     - Adding and subtracting fractions with the same denominator
     - Equivalent Fractions
     - Fractions on a number line
     - Best For: Grades 3–5
   - Card click routes via `<Link to="/printables/fractions-l2">` (extend `FractionLevelCard` to wrap in a Link when `href` is set and not locked, same pattern Level 1 already needs — confirm current code; if Level 1 also lacks it, add the Link wrapper for both).
   - Optional: reuse the L1 cover image styling; no new cover asset generated unless requested.

4. **Verify download isn't blocked.** The `<a download>` button already triggers a direct download since the file is served from `/public`. Confirm no Worker route, middleware, or CSP intercepts `/printables/*.pdf` (none currently exist). The Google Drive virus-scan interstitial is bypassed because we host the file ourselves.

5. **QA**: hit `/printables`, click the new Level 2 card → lands on detail page → Download PDF saves the file, Open in new tab renders inline preview.

## Notes
- No changes to backend, auth, or existing Level 1 assets.
- Level 3 card stays locked.
