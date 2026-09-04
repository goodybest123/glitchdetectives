# Level 2: real photos, a clearer Cookie Tray, and a full play-through check

## What changes for the child

1. **Real photographs instead of coloured blocks.** In every Level 2 case the pieces the child taps become actual photos:
   - Cookie Tray — round baked cookies on a tray
   - Chocolate Squares — squares broken off a real chocolate bar
   - Painted Wall — painted and unpainted wall sections
   - Mystery Fraction — a paper strip cut into equal pieces

   A chosen piece looks clearly chosen (full colour, bright ring, small tick); a piece not chosen looks faded and greyed. Empty slots on the tray still show the tray/plate underneath so a child can see the whole is still there.

2. **The Cookie Tray case becomes easier to follow.** Right now ZED-4's claim jumps straight to "3 equal parts in the whole, 4 being shared", which is hard to hold in your head. It gets rewritten so the story is concrete:
   - Maya asks for **3 out of 4** cookies for her friends.
   - ZED-4's mistake is stated plainly: he gave away 4 and said the tray only had 3 parts.
   - The investigate step asks one question at a time: first *how many equal parts is the whole tray cut into?*, then *how many are we taking?*
   - Simpler wording on the hints, the repair instruction ("Make the tray show 3 cookies chosen out of 4"), and the explain sentence.
   - A small always-visible reminder under the tray: "bottom number = all the parts · top number = the ones we chose".

3. **Verified play-through.** All four cases are played start to finish in a real browser — brief, investigate, spot the glitch, evidence, repair, explain, close — until the Level Closed panel appears, then the Detective's Report is opened to confirm the four Level 2 entries show up. Anything that blocks or misreports along the way gets fixed in the same pass.

## Technical notes

- Generate four photographic assets into `src/assets/level02/` (cookie, chocolate square, wall section, strip piece), each a clean top-down shot on a plain background so it tiles well inside a small square.
- Extend `PartsBoard` with an optional per-shape image: render the photo as the tile background, keep the existing button semantics, sizes, aria labels and toggle logic untouched. Unselected = grayscale + reduced opacity; selected = full colour + primary ring. No change to `CaseDefinition` consumers other than an added optional field on `PartsModelConfig`.
- Cookie Tray copy edits are confined to the `tray` entry in `src/components/level02/cases.ts` plus the matching `whatHappened` line in `src/lib/reasoning/caseCatalog.ts` and the case brief in `src/routes/api/chat/case-02-tray.ts` so ZED-4's conversation matches the new wording.
- Walk-through via Playwright against the running preview, capturing screenshots at each stage and at the report.
