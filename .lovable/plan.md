# Case 01: Story-led, hands-on Detective Worlds

## Goal
Rebuild all three Case 01 sub-cases — The Pizza, The Chocolate Bar, and The Painted Canvas — around the same experience:

```text
STORY → INVESTIGATE → DETECT → REPAIR → EXPLAIN → APPLY
```

The child should feel they are checking a confident robot colleague's work, not completing a maths quiz. The interface will remain calm, untimed, supportive, and usable with mouse, touch, keyboard, typing, or voice.

## Experience changes

1. **Story-first case opening**
   - Replace the current lesson-like opening with a short case brief for each sub-case.
   - Introduce ZED-4's confident solution, the people/objects involved, the mission, and the visible mismatch.
   - Make ZED-4 overconfident but friendly, never a villain; copy will reinforce that confident answers still need checking.
   - Add a clear “Not sure yet” path alongside Yes/No so children can pause and process before investigating.

2. **Investigate becomes a hands-on evidence board**
   - Pizza: pick up and move the four slices into comparison positions, with clear snap zones and a non-destructive reset.
   - Chocolate: move the three pieces beside one another or into comparison slots to notice the unequal widths.
   - Canvas: drag the dividing line and inspect the two regions without immediately marking the child right or wrong.
   - Use Pointer Events for mouse and touch, preserve keyboard-accessible alternatives, provide visible focus states, and avoid timers, flashing, or punitive error effects.
   - Add simple state feedback such as “evidence placed” and “look again,” without revealing the answer prematurely.

3. **Detect asks for an observation and evidence**
   - Adapt the existing choices so the child selects an observation such as “the pieces are not equal in size,” rather than guessing a quiz answer.
   - After selection, let the child demonstrate the evidence through the relevant comparison interaction before unlocking Repair.
   - Keep wrong choices recoverable and supportive; do not use giant red error states.

4. **Repair is a satisfying physical fix**
   - Pizza: equalize/cut the whole into four matching shares, then assign one share to each detective with drag-and-drop or an accessible equivalent.
   - Chocolate: reposition the cuts until all three pieces match, then confirm one piece per friend.
   - Canvas: drag the divider until both regions match.
   - Keep each repair control specific to the object rather than presenting a generic worksheet slider as the primary interaction.
   - Show the repaired object and a short confirmation only after the child submits a repair they choose.

5. **Explain supports multiple ways to show understanding**
   - Preserve ZED-4's AI conversation, typing, and microphone input.
   - Add selectable sentence-building prompts/words so a child can construct an explanation without needing to write a full sentence.
   - Include a gentle evidence recap before the child responds.
   - Update all three Case 01 prompts so ZED-4 asks one small question at a time, celebrates partial reasoning, and only closes after the child expresses the equal/same-size idea in their own words.
   - Keep the existing safe streaming, retry, validation, and solved-token behavior.

6. **Apply and detective clue**
   - After the explanation, show a small real-world transfer challenge for that sub-case: paper/objects for fair sharing, three comparable pieces for chocolate, or a paper shape and pencil for the canvas.
   - Add “Detective Skill Unlocked: You checked before you trusted” and evidence statements such as comparing quantities, testing an idea, repairing the model, and explaining reasoning.
   - Remove score-first language from the child-facing Case 01 completion experience. Preserve any internal report data needed by the parent report system, but make the visible celebration about reasoning skills rather than points.

## Hydration/runtime repair

- Fix `useCaseProgress` so the initial server and client render use the same deterministic unsolved map, then hydrate saved progress in an effect. This addresses the confirmed mismatch where solved badges change the CasePicker markup during hydration.
- Keep progress persistence and solved indicators working after hydration across all case pickers.

## Technical implementation

- Extend the Case 01 definitions with story, participant, investigation, evidence, repair, explain-option, and apply-challenge data so Pizza, Chocolate, and Canvas share one content contract.
- Add focused Case 01 interaction components for draggable comparison pieces, snap zones, accessible keyboard movement, and reset/submit states; keep the existing SVG artwork as the visual source while making its meaningful parts interactive.
- Refactor the Case 01 runner state machine to track investigation evidence, selected observation, repair state, explain mode, and apply completion without changing the route or access gate.
- Update the shared completion/report presentation with a Case 01 skill-unlock variant rather than changing the learning logic of Cases 02–06.
- Use existing semantic design tokens and the existing Button/control patterns for new actions; do not add new backend tables or external services.

## Verification

- Exercise all three sub-cases through every stage with mouse and touch-style pointer input.
- Verify keyboard alternatives, reset/retry paths, reduced-motion behavior, and the AI explanation/retry flow.
- Reproduce the Case 01 picker with saved progress and confirm there are no hydration errors or blank screens.
- Run the project typecheck/build and inspect the live Case 01 route at desktop and mobile widths.
