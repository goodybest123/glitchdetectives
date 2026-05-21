## Plan: stop ZED-4 interrupting the child in Level 1

I’ll fix the actual chat/listening bug around the “Specimen / 2 PIZZA SLICES / Apprentice Robot” area, not redesign the screen.

### 1. Make speech recognition wait for the child to finish
- Update `useContinuousSpeech` in `src/lib/speech.ts` so it does not send the first tiny final transcript immediately.
- Add a short “quiet window” after the last speech result before calling ZED, so the child can finish a full sentence.
- Keep showing interim text while the child is still speaking.
- Do not clear the speech buffer just because the browser recognition restarts.

### 2. Stop ZED from restarting the mic too aggressively
- In `ReasoningBox` inside `src/components/FractionFactoryLevel1.tsx`, only resume listening after ZED’s spoken reply is fully finished.
- Increase the resume delay slightly so the mic does not catch the tail end of ZED’s voice or immediately cut into the child.
- Keep the mic paused while ZED is thinking/speaking.

### 3. Prevent duplicate/partial child messages
- Add a small guard so the same utterance is not sent twice if the browser emits duplicate final chunks.
- Avoid treating short partial speech as the child’s complete answer.

### 4. Keep ZED patient and learner-like
- Preserve the existing “gentle learner” prompt rules.
- The child stays in control: ZED only replies after the child pauses, and only advances when the explanation is actually accepted.