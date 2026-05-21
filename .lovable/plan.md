## Apply the gentle/patient chat behavior everywhere

The earlier fixes (gentle "learner" ZED persona, quiet-window mic, longer pause before advancing, looser echo guard) were applied to Level 1's `ReasoningBox`. Level 2's `ConversationPanel` still uses the old aggressive settings, so it interrupts and rushes the child the same way Level 1 used to.

Good news: most of the work is already shared:
- **System prompt (`src/lib/evaluate-core.ts`)** — "gentle learner" rules already power every chat: Level 1 detect, Level 1 wrong-reasoning, Level 1 explain (all 3 `/api/evaluate-*` endpoints), and Level 2's `/api/evaluate`. No change needed.
- **Mic engine (`src/lib/speech.ts` → `useContinuousSpeech`)** — 1.4s quiet window + de-dup + TTS pause is shared by both panels. No change needed.

What's still missing is the **per-panel patience** in Level 2.

### Change 1 — `src/components/level2/ConversationPanel.tsx`

Bring it to parity with Level 1's `ReasoningBox`:

1. **Soften the echo guard.** Replace the current 24-char prefix check (which drops anything that starts like ZED's last line, including kids re-using ZED's vocabulary) with the same ~90% character-overlap rule used in Level 1.
2. **Pause longer before advancing on isCorrect.** `setTimeout(..., 600)` → `1200ms`, so the child fully hears the appreciation.
3. **Delay mic resume.** After ZED finishes a non-correct reply, wait `900ms` (not `250ms`) before reopening the mic, matching Level 1. This stops ZED's tail end from being heard as the child's next answer.
4. **Stop the mic at the start of `sendToZed`** the same way Level 1 does (already present, keep it).

### Change 2 — no other files

- Level 1 missions (Mission 1–4, all phases: detect, explainWrong, teach, label) already share `ReasoningBox`, so the earlier fixes already apply to every Level 1 question.
- Level 2 missions (Mission 1–4, every case) all funnel through `ExplainPanel` → `ConversationPanel`, so fixing it once covers every Level 2 question.

### Technical details

File: `src/components/level2/ConversationPanel.tsx`
- In `sendToZed` (isCorrect branch): change `setTimeout(..., 600)` → `1200`.
- In `sendToZed` (non-correct branch, inside the `speakText(reply, () => {...})` callback): change `setTimeout(..., 250)` → `900`.
- In `handleFinal`: replace the prefix-based echo guard with the 90%-overlap version from Level 1.

No prompt, mic, or API changes are needed — those are already shared.