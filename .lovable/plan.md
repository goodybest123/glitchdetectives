# Plan: Visual fraction representations across all cases

## Goal
Replace tiny "1/8" / "1/4" text chips with real fraction visuals (sliced pizzas or shaded bars), and add a side-by-side comparison strip below each scene so kids *see* the fraction, not just read it.

## Visual rules (smart pick per case)
- **Pizza (sliced circle)** when denominator ≤ 8 AND the case theme is whole-object sharing/comparing: Case 01 (already partly visual), Case 03 fuel/disks, Case 04 balance/beams/coolant.
- **Bar (row of shaded squares)** when denominator > 8 OR the case is industrial/measurement: Case 02 energy/panels/bar, Case 05 conveyor/assembly/coolant, Case 06 blueprint/circuit/paint.
- Same color tokens already used (orange family for primary chip, blue for secondary). Numerator slices/cells filled; remainder muted with thin stroke.

## New shared components
`src/components/shared/FractionIcon.tsx`
- Props: `{ numerator, denominator, variant: "pizza" | "bar", size: "chip" | "lg", label?: boolean }`
- `chip` = ~44px (replaces tiny labels on scenes). `lg` = ~120px (used in comparison strip).
- Renders SVG. Pizza: circle divided into `denominator` wedges, first `numerator` filled. Bar: 1×denominator (or 2-row for >8) grid of squares, first `numerator` filled.

`src/components/shared/FractionCompareStrip.tsx`
- Props: `{ left: {n,d}, right: {n,d}, variant, relation?: "<"|">"|"=" }`
- Shows: large FractionIcon · big fraction numerals · comparator symbol · big fraction numerals · large FractionIcon.
- Sits directly below the scene SVG inside the case card.

## Per-case integration
For each of the 6 case files (18 sub-cases), edit the scene SVG component to:
1. Swap the small text label rect (e.g. the "1/8" / "1/4" chips on `BalanceScaleSVG`, the chips on `FuelTanksSVG`, `MetalBeamsSVG`, `CoolantTubesSVG`, `EnergyCrateSVG`, `SolarPanelsSVG`, `FractionBarSVG`, `MemoryDisksSVG`, `GardenBedsSVG`, `ConveyorBeltSVG`, `AssemblyLineSVG`, `CoolantDrainSVG`, `BlueprintSVG`, `CircuitBoardSVG`, `PaintVatsSVG`) for a `<FractionIcon variant=... size="chip" />` rendered via `<foreignObject>` (or inline SVG group).
2. Below each scene, render `<FractionCompareStrip />` showing both fractions side-by-side with the correct relation pulled from `cases.ts` metadata (already present as concept/answer).

Where a sub-case has a single fraction (no compare), the strip shows just one large icon + numeral.

## Files
- New: `src/components/shared/FractionIcon.tsx`, `src/components/shared/FractionCompareStrip.tsx`
- Edited: all 15 scene SVG components listed above + `src/components/case04/FractionDisplayLine.tsx`, `src/components/case05/EquationDisplay.tsx`, `src/components/case06/EquationDisplay.tsx` (use FractionIcon inline next to numerals).
- No changes to chat APIs, scoring, routing, or report.

## Out of scope
No animation overhaul, no new sounds, no copy changes, no logic changes to scoring/AI/report. Pure visual augmentation.
