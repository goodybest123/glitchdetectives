
## Goal

Make the Logic Auditing loop (Investigate → Detect → Repair → Explain) a first-class, always-visible UI element on Case 01, and make the experience accessible/neuro-inclusive by adding:
- **Read-aloud** for ZED-4's prompts and the AI Guide's replies (so non-readers / early readers / dyslexic learners can hear the case)
- **Microphone voice input** in the chat composer (so K–6 students can *speak* their explanation instead of typing — this is the core "Explain" step)

All work is scoped to `src/routes/play.case-01.tsx` and two small new components. No backend, schema, or chat API changes.

---

## 1. Four-step progress tracker (always visible)

New component: `src/components/case01/CaseStepper.tsx`

- Horizontal stepper at the top of the case file card (under the back-nav header, above the ZED-4 bubble).
- Four steps with number + label + one-line description:
  1. **Investigate** — "Scan the completed solution."
  2. **Detect** — "Find where the logic broke."
  3. **Repair** — "Fix the mistake."
  4. **Explain** — "Teach ZED-4 why it was wrong."
- Visual states driven by existing `Stage` union (`investigate | detect | repair | explain`):
  - **completed** — filled circle, checkmark, muted label
  - **active** — bold ring + brand accent, pulsing dot
  - **upcoming** — outlined circle, dimmed label
- Connector lines between steps fill in as progress advances.
- Responsive: full labels on `sm+`, numbers + active label only on mobile.
- Reuses existing palette tokens (`brand-blue`, `brand-yellow`, `brand-mint`, `success`) — no new colors.

The existing one-line "Scan ZED-4's logic…" helper text under the pizza stays — it becomes the per-stage *micro-instruction*; the stepper is the *map*.

---

## 2. Read-aloud feature

New tiny component: `src/components/case01/SpeakButton.tsx`

- Uses the browser-native **Web Speech API** (`window.speechSynthesis` + `SpeechSynthesisUtterance`) — no API key, no extra deps, works offline.
- Renders a small round icon button (speaker icon from `lucide-react`, already in the project).
- Click toggles play / stop. While speaking, icon swaps to a "stop" square and button gets a subtle pulse.
- Picks a calm English voice when available (prefers `en-GB`/`en-US` female if present; falls back to default).
- Rate slightly slowed (`0.95`) for K–6 comprehension; pitch neutral.
- Gracefully hides itself if `speechSynthesis` is unavailable.
- `aria-label` reflects state ("Read aloud" / "Stop reading").

Wire-up:
- **ZED-4 bubble** (`ZedBubble.tsx`) — add an optional `speakable` prop; when true, render `<SpeakButton text={message} />` in the top-right corner of the bubble. Enable on the Case 01 ZED-4 bubble so every line ZED-4 says ("I served exactly 1/4…", "Glitch Detected!", "Logic repaired.") is readable aloud.
- **AI Guide assistant messages** — in the chat transcript, render a small `SpeakButton` under each assistant bubble (not user bubbles). Lets the child re-hear the Guide's question.
- **Auto-read toggle** (optional, low-risk): a small "🔊 Auto-read" switch in the AI Guide header. When ON, newly arrived assistant messages auto-speak once after streaming finishes (`status` transitions back to `ready`). Default OFF to avoid surprising users.

---

## 3. Microphone / voice input in chat composer

Use the browser-native **Web Speech API** (`SpeechRecognition` / `webkitSpeechRecognition`) — same rationale as read-aloud: no key, no dep, instant.

New tiny component: `src/components/case01/MicButton.tsx`

- Circular mic icon button placed **inside the textarea row** (right side, before SUBMIT EVIDENCE), only rendered when `chatEnabled`.
- Idle state: outlined mic icon.
- Recording state: filled red mic icon + soft pulsing ring + live "Listening…" hint under the textarea.
- Click to start, click again (or auto-stop on silence) to stop.
- On each `result` event, **appends** the interim/final transcript into the existing `input` state (does not replace what the child already typed).
- `lang = "en-US"` by default; `interimResults = true` so the child sees words appear as they speak.
- Permissions: first click triggers the browser's mic permission prompt. If denied or unsupported, show a one-line inline message ("Voice input isn't available in this browser") and hide the mic button on subsequent renders.
- Errors (`no-speech`, `aborted`, `not-allowed`) are caught and surface as a small toast/inline note — never crash the chat.

Submit flow is unchanged: child can speak → review the transcribed text in the textarea → edit if needed → press SUBMIT EVIDENCE (or Enter). This keeps the "Explain" step deliberate and reviewable rather than auto-sending.

---

## 4. Out of scope

- No changes to the chat API route, system prompt, model, or AI SDK transport.
- No changes to the pizza component or the equalizer logic.
- No changes to routing, auth, database, or other pages (printables, landing, `/play` dashboard).
- No third-party TTS/STT services — browser-native only. (If the user later wants higher-quality voices or non-English support, we can swap in a cloud provider behind the same `SpeakButton` / `MicButton` interfaces.)

---

## Files touched

- **new** `src/components/case01/CaseStepper.tsx` — 4-step progress tracker
- **new** `src/components/case01/SpeakButton.tsx` — read-aloud icon button (Web Speech API)
- **new** `src/components/case01/MicButton.tsx` — voice-input icon button (Web Speech API)
- **edit** `src/components/case01/ZedBubble.tsx` — optional `speakable` prop → render `SpeakButton`
- **edit** `src/routes/play.case-01.tsx`:
  - mount `<CaseStepper stage={stage} />` at top of the case file card
  - pass `speakable` to `<ZedBubble />`
  - render `<SpeakButton />` under each assistant message in the transcript
  - add optional "Auto-read" toggle in AI Guide header
  - mount `<MicButton />` inside the composer, wired to append into `input`

## Technical notes

- Web Speech API types live in `lib.dom.d.ts` (no extra `@types` install needed). `SpeechRecognition` is webkit-prefixed in Safari/Chromium — we'll feature-detect `window.SpeechRecognition ?? window.webkitSpeechRecognition`.
- Both speech features are wrapped in `typeof window !== "undefined"` guards so SSR/prerender doesn't break.
- Voices load asynchronously in some browsers; `SpeakButton` listens for `voiceschanged` once before picking a voice.
- All new buttons are keyboard-accessible (real `<button>`, focus ring, `aria-label`, `aria-pressed` where appropriate).
