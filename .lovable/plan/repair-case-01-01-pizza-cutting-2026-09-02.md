# Repair Case 01.01 Pizza Cutting

## Goal

Make the Pizza repair stage visibly and functionally cut one whole pizza into four equal parts. Keep the existing investigation flow, accessibility, assignment step, AI dialogue, reports, and all other cases unchanged.

## Confirmed issue

- The repair visual currently uses a circular HTML container with `border-r` and `border-b` overlays plus an emoji pizza, so the cuts are not rendered as actual pizza divisions.
- The `cutPosition` slider changes state but is not connected to the rendered cut lines, so moving it does not change the pizza.
- The repair is considered ready from the two direction values alone; the UI does not clearly show four distinct equal regions as a result of the cuts.

## Implementation

1. Replace the repair pizza visual with a dedicated, responsive SVG model:
   - Render a whole pizza with semantic pizza tokens and a clipped circular boundary.
   - After the first cut, show one full diameter line in the selected direction.
   - After the second perpendicular cut, show the crossing diameter and four clearly separated quarter regions, with the cut edges reaching the crust.
   - Add an accessible SVG label describing the current state: whole pizza, two regions, or four equal regions.
2. Simplify the repair state so the visual and readiness use the same source of truth:
   - Accept one vertical and one horizontal cut in either order.
   - Keep the direction buttons keyboard- and touch-accessible, disabling a direction after it is used.
   - Remove the non-functional cut-position control rather than suggesting that an off-center line can still be equal.
   - Keep reset fully restoring the whole pizza, assignments, fairness selection, and readiness.
3. Preserve the learning flow:
   - Continue enabling share assignment only after both perpendicular cuts are present.
   - Keep the same calm feedback, equal-share confirmation, and continue-to-explain behavior.
   - Keep the repair interaction forgiving: the child may choose either direction first, with no precision requirement or punitive retry state.
4. Validate the repaired experience in the live preview at tablet, desktop, and mobile widths, including both cut orders, reset, keyboard activation, assignment, and continuation. Run targeted formatting/lint/type checks and confirm no new console errors.

## Technical details

- Scope is limited to `src/components/case01/PizzaCaseActivity.tsx` unless a small token-compatible style adjustment is required.
- Use the existing design-system `Button` component and semantic pizza color tokens; do not introduce hardcoded colors, gradients, or a new backend model.
- Keep the parent-compatible local observation logging and existing completion/report behavior intact.