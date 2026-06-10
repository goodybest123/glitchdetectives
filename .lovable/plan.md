
## Goal

Apply four consistent UX upgrades across every level (Cases 01–06) of the Fraction Factory MVP, without changing the underlying puzzle logic or AI tutoring behavior.

## Changes (apply to all 6 cases)

### 1. ZED-4 investigation lines — longer & more confidently wrong

Current `bubbles.investigate` strings are short (e.g. "I added the top parts and the bottom slots! We have 3/10!"). Rewrite each one as 2–3 sentences where ZED-4 sounds proud, certain, and shows his (wrong) reasoning. Examples of the new tone:

- Case 05 Conveyor: "Easy one! I lined up both crates and added the top parts together, then added the bottom slots together too. That gives us 3 parts inside a brand-new 10-slot mega-crate. I'm one hundred percent sure — case closed!"
- Case 04 Scale: "Look at the numbers — 8 is way bigger than 4, so 1/8 has to be the heavier block. Bigger number on the bottom means a heavier slice, every single time. I'd bet my circuits on it!"

Each level gets its own confident-but-wrong investigate paragraph; logic and final wrong answer stay identical.

### 2. The child detects the glitch (not ZED-4)

Today `bubbles.detect` is spoken by ZED-4 (e.g. "Glitch Detected! The big piece doesn't fit…"). Change the detect-stage UI so:

- ZED-4's bubble in the `detect` stage stays on his confident investigate line (or goes silent), and does NOT announce the glitch.
- A new on-screen prompt addressed to the child appears: "Detective — what looks wrong here? Tap the part of the answer that glitched." (per-case wording).
- When the child clicks the glitch hotspot (denominator / wrong fraction / wrong scale / etc.), show a child-voiced confirmation banner: "You spotted the glitch! 🔍" (no robot avatar, styled as the detective's own callout).

Rename the `bubbles.detect` field to `prompts.detect` (child-directed) and add `prompts.glitchFound` for the post-click child callout. ZED-4 no longer owns the detect message.

### 3. Speaker button on every on-screen text block

Reuse the existing `SpeakButton` from `src/components/case01/SpeakButton.tsx` (move it to `src/components/shared/SpeakButton.tsx` so all cases import from one place; keep a re-export in the case01 path to avoid breaking imports).

Attach a `<SpeakButton>` to every learner-facing text surface in each case page and shared components:

- ZED-4 bubble (already has it via `ZedBubble speakable`; enable `speakable` everywhere it's used).
- Stage caption ("Scan the equation. Click the answer that looks wrong.").
- Child detective prompt (new, from change #2).
- Repair instructions / tool hint.
- Success banner ("Logic Repaired!").
- AI welcome / Socratic chat messages (per-message speaker on assistant turns).
- Case title + subtitle on the CasePicker cards.
- DiagnosticReport "Concept Mastered" text.

Place the speaker as a small round icon-button next to (or inline-end of) the text. Keep current visual layout; do not introduce a global autoplay.

### 4. Generic "Logic Repaired!" banner

Replace every per-case `successBanner` string (which currently leaks the explanation, e.g. "Logic Repaired: The vats must use the same measurement grid.") with the single phrase:

> **Logic Repaired!**

Rendered as the existing green banner, with a speaker button. The explanation is now exclusively the child's job in the chat panel. Remove `successBanner` text content from `cases.ts` files (keep the field but set to `"Logic Repaired!"`), and delete any sub-headline that hints at the why.

### 5. ZED-4 sentence-style variety across levels

Give each level its own distinct ZED-4 "voice flavor" so the character feels like he's evolving (and so kids notice the change). Apply this flavor to that level's investigate bubble and to the assistant's opening welcome line in chat. Suggested flavors:

| Level | ZED-4 voice flavor |
|---|---|
| Case 01 — Slice | Childlike excitement, lots of exclamations: "Whoa! Look look look!" |
| Case 02 — Identify | Detective-wannabe, narrates like a report: "Observation log entry 47…" |
| Case 03 — Equivalent | Math-bragger, drops fake jargon: "Trivial. By the Law of Bigger Numbers…" |
| Case 04 — Compare | Sports-commentator energy: "And the winner, weighing in at a massive eight…!" |
| Case 05 — Like denominators | Game-show host: "Ding ding ding! Easy points!" |
| Case 06 — Unlike denominators | Overconfident engineer: "Standard procedure. I've run the simulation twice." |

Rewrite each `bubbles.investigate` and chat-route system prompt's "ZED-4 said" framing line in the matching flavor. (System prompts themselves stay otherwise identical — same Grade-1 voice for the AI Guide, same `[[CASE_SOLVED]]` rule.)

## Files to edit

- `src/components/case01/SpeakButton.tsx` → move to `src/components/shared/SpeakButton.tsx` (+ thin re-export).
- `src/components/case0{1..6}/cases.ts` — rewrite `bubbles.investigate`, restructure `bubbles.detect` → `prompts.detect` + `prompts.glitchFound`, set `successBanner = "Logic Repaired!"`, apply per-level voice flavor.
- `src/components/case0{1..6}/CasePicker.tsx` — add speaker on title/subtitle.
- `src/components/case01/ZedBubble.tsx` and any case-specific bubble components — ensure `speakable` is on by default.
- `src/components/case01/DiagnosticReport.tsx` — add speaker on concept-mastered line.
- `src/routes/play.case-0{1..6}.tsx` — render the new child detective prompt during `detect`, render child glitch-found callout after click, swap success-banner copy, add speakers to all captions and instructions, mount speaker on each assistant chat message.
- `src/routes/api/chat/case-0*-*.ts` (all chat routes) — update the "THE CASE" framing to match the new ZED-4 voice flavor; no other behavior changes.

## Out of scope

- No changes to puzzle math, repair mechanics, click targets, or AI tutoring rules.
- No new audio assets — uses existing Web Speech API via `SpeakButton`.
- No persistence, no scoring changes, no new routes.
- Case 01 chat route triplet stays intact; only the framing sentence is reworded.

## Technical notes

- `SpeakButton` already handles voice selection, stop/start, and SSR-safe `speechSynthesis` detection — no new dependency.
- For streamed chat messages, attach the speaker once `status !== "streaming"` for that message so it reads the final text.
- Use `aria-label` on every speaker for accessibility; keep existing focus rings.
