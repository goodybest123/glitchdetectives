## Plan

1. **Add a short think-time state to glitch choices**
   - After a child selects an option, temporarily lock the choices and show a gentle “Let’s check…” indicator for about one second.
   - Reveal correct/incorrect feedback only after that pause.
   - Prevent repeated clicks during the check and keep read-aloud controls available.

2. **Improve workbook-style retry guidance**
   - For an incorrect choice, show a soft pencil-note hint beneath the options rather than immediate harsh error styling.
   - Keep the question open so the child can try again.
   - Continue using progressive guidance after repeated attempts without revealing the answer.

3. **Require explicit repair submission in all 18 activities**
   - Remove every automatic repair-to-explain transition across Cases 01–06.
   - Keep the repair tool visible after the child reaches a valid repaired state.
   - Add a clear workbook-style **Submit repaired logic** button, enabled only when the repair is ready.
   - Advance to Explain only when the child presses that button; incomplete repairs remain in the Repair stage with guidance.

4. **Handle each repair type consistently**
   - Sliders, number steppers, comparison dials, denominator tools, and Case 06 interactive calibrators will all use the same explicit submission pattern.
   - Preserve each case’s completion animation and repaired visual, but trigger the Explain stage only after submission.

5. **Verify the full learning flow**
   - Check an incorrect option, retry, correct option, visual glitch selection, repair, explicit submission, and Explain unlock in representative cases covering each repair control type.