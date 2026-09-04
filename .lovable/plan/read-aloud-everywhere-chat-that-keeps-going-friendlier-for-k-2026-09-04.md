# Read-aloud everywhere, chat that keeps going, friendlier for kids

## 1. Fix the chat stopping after the first reply

Likely cause (to confirm first): the safety check on incoming chat messages only accepts plain text pieces. After ZED-4's first reply, the conversation history also carries small non-text markers the AI helper adds automatically, so the second message is rejected before it ever reaches ZED-4 — the reply never arrives.

Fix:
- Accept and safely ignore non-text pieces in the history instead of rejecting the whole message; keep all existing length and count limits.
- Make a rejected message show a clear, kid-friendly note plus the existing retry button, instead of silence.
- Also check the second possible cause: if ZED-4 closes the case on its very first reply, the typing box locks. Allow the child to keep chatting after the case is closed, with the celebration still shown.
- Verify by sending three back-and-forth messages in a real case before calling it done.

## 2. Read-aloud on every piece of written text

Every world (all six), from the case introduction onward, gets a speaker button beside the text, using the device's built-in voice as today.

- Case introduction/brief: title, story text, ZED-4's claim, mission line.
- Investigation text, comparison labels, hints, evidence prompts, repair instructions, question prompts and every answer choice.
- Success messages, real-world challenge, case-closed summary and report text.
- Case picker cards on each world page.
- One "Read this page" button at the top of each stage that reads everything on screen in order, so a child who can't read yet can follow without hunting for buttons.
- Only one voice plays at a time: starting a new one stops the previous.

## 3. Friendlier for kids

- Bigger tap targets and larger, rounder text for prompts and choices.
- Warmer, shorter wording where copy is long; plain words instead of instructions written for adults.
- Clear "what do I do now?" line always visible at the top of each stage, with its own speaker.
- Gentle motion and a friendly sound on success; nothing punishing on a wrong try — always "have another look".
- Consistent, obvious next-step button at the bottom of each stage.
- Keep it calm and uncluttered: no timers, no scores, no leaderboards.

## Out of scope

No accounts, no new backend, no AI voice service, no change to case content or the passcode gate.

## Technical notes

- Widen `validateChatMessages` in `src/lib/chat-validation.ts` to skip unknown part types rather than 400; keep caps.
- Loosen the `chatEnabled` condition in `src/components/shared/ChatPanel.tsx` so `solved` still allows sending.
- Introduce a small shared `ReadAloud`/`SpeakButton` wrapper plus a `ReadPageButton` that concatenates the stage's text, reusing existing `SpeakButton` speech logic with a single global cancel.
- Apply across `src/components/case01..case06`, `src/routes/play.case-0*.tsx`, and shared components.
- Verify with typecheck, production build, and a browser pass through one case per world.
