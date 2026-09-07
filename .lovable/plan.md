# Level 03 — let the model be the mathematics

Level 3 currently reuses the Level 2 photo-tile board (`PartsBoard`), so each "whole" is a row of separate photographs. That cannot show equivalence honestly: two wholes are not guaranteed the same outer size, the pieces are separate objects, and nothing can be overlaid. This rebuilds Level 3's visuals around one precise fraction-model engine used by all four cases.

## The engine: one FractionModel component

A single drawn (SVG) model with guaranteed properties:

- identical outer dimensions for every model on a screen, whatever the denominator
- exactly equal partitions, mathematically accurate shading
- bar (rectangle) and pizza (circle, radial slices) forms from the same component
- consistent orientation and interaction (tap a piece to shade)
- overlay mode: one model can sit directly on top of another, outer edges matching, dividing lines still visible
- transformation mode: split every piece into N, animated, with a faint outline of the original partition left behind
- optional ghost/original outline layer

Everything below uses only this component. No photo tiles, no emoji stand-ins, no differing shapes within a comparison.

## Screen hierarchy (all four cases)

```text
TOP     case number + one-line mission
CENTER  the fraction model(s), large
NEAR    fraction notation + the few controls
BOTTOM  one short detective instruction
```

Text blocks around the model are trimmed to what is needed; ZED-4 stays visible beside the model as the reasoning partner, not a decoration.

## Case by case

**03.01 SEE IT — 1/2 ↔ 2/4, chocolate bars.** Two bars, same size, same shape, same baseline; only the partitioning differs. A "bring them together" control slides bar B over bar A; the shaded regions coincide exactly while the internal cut lines stay visible, and a quiet line appears: "Same amount. Different pieces."

**03.02 FIND IT — 1/2 ↔ 3/6, pizzas.** Same engine in circle form, radial slices, two identical pizzas. The three shaded sixths can be laid over the half. The question shifts from "are these the same?" to "can you find another name for this amount?"

**03.03 BUILD IT — 2/3 → 4/6, the factory.** A machine action splits every third in two. The animation shows each shaded third becoming two shaded sixths, with the original thirds left as a faint outline behind the new sixths, so the shaded amount visibly never moves. Then the child runs it themselves.

**03.04 PROVE IT — 3/6 ↔ 2/4 + number line.** Laid out as an evidence board: ZED-4's claim at the top, the two models as evidence cards below, the 0–1 number line beneath them with both fractions landing on the same point. The number line appears only here, as a second, independent kind of proof.

## ZED-4

Present beside the model in every case, with three states — confident while claiming, surprised at the moment of evidence, thoughtful at case closed. He is shown making a reasoning error, never mocked.

## Kept as is

Flow (CASE BRIEF → INVESTIGATE → DETECT → REPAIR → EXPLAIN → CASE CLOSED), read-aloud on every line, evidence before feedback, gentle retries, no scores, no multiplying rule, no simplifying. Levels 1, 2 and 4–6 are untouched.

## Technical notes

- New `src/components/investigation/FractionModel.tsx` (SVG bar + circle, props: shape, total, selected, interactive, ghostTotal, overlay offset, split animation) plus a small `SplitAnimation` control.
- `CompareBoards.tsx` rewritten to use `FractionModel` with an overlay (stacked, aligned) mode instead of the current "line them up" grid change; `NumberLineBoard.tsx` restyled as the evidence-board line.
- `InvestigationCase.tsx`: Level 3 cases render the FractionModel path instead of `PartsBoard`, and the investigate/repair panels use the tighter hierarchy above. Gated by the presence of the Level 3 config so Level 2 rendering is unchanged.
- `types.ts`: add `overlay`, `ghost` and `split` options to the compare config; add a factory/transform config for 03.03.
- `src/components/level03/cases.ts` copy trimmed to the short mission + one instruction per screen.
- Verified in a browser across all four cases: overlay alignment is pixel-exact, split animation leaves the ghost outline, both fractions land on one number-line point, Level Closed and the report still record correctly.
