# Keep world progress visible while scrolling

## Goal

Keep the **Investigate → Detect → Repair → Explain** progress tracker visible while a visitor scrolls through an active Detective World, without adding it to the public site or picker screens.

## Implementation

1. Update the shared `CaseStepper` used by Cases 01–06 so its progress area becomes a sticky, full-width strip within the active world content.
2. Give the strip an opaque background, stacking order, border/shadow treatment, and a safe top offset so the tracker remains readable as the case header scrolls away.
3. Preserve the current stage text, audio control, completed/active/upcoming states, responsive four-step layout, and solved-state behavior.
4. Check the active-world layout on narrow and wide viewports to ensure the sticky strip does not cover the puzzle, repair controls, chat, or report content.

## Technical details

- The change will be centralized in `src/components/case01/CaseStepper.tsx`; all six world routes already render this shared component.
- Use existing semantic styling tokens/utilities where possible and avoid changing the stage state machine or scroll-to-repair/report behavior.
- Verify that the tracker stays visible during ordinary page scrolling and remains correct as the child advances through each stage.