# Fix Level 2 right-side voice narration

## Root cause

The right side (workspace) *does* call `useNarrate(...)`, but the speech is being silently cancelled before it ever plays:

1. **`speakText()` always calls `speechSynthesis.cancel()`** then immediately `speak()`. In Chrome (and most desktop browsers) this cancel→speak race drops the new utterance ~50% of the time, especially right after a phase transition.
2. **Multiple `useNarrate` / `useAutoSpeak` fire in the same tick.** `BriefingPanel` calls both `useAutoSpeak(zedBriefing, 150ms)` and `useNarrate(instructions, 200ms)` — the second cancels the first. When the user clicks "Begin investigation", `GlitchCheckPanel` mounts and narrates, cancelling again. When they advance to repair, the workspace's `useNarrate` fires, but the still-queued speech from glitch-check (or the dock state update) cancels it.
3. **Only one global narrator** with no queue → whichever component mounts last "wins", and if the browser drops it, nothing plays at all.

End result: the workspace heading ("Phase 1 · Scan selected parts. Tap each lit part…") is requested but never spoken.

## Fix (all UI / frontend only)

### 1. Make speech reliable — `src/lib/speech.ts`
Replace the immediate `cancel()` + `speak()` with a serialized queue:
- Keep a module-level `queue: string[]` and `speaking` flag.
- `speakText(text)` pushes onto the queue and starts the runner if idle.
- The runner: `cancel()` → `setTimeout(50ms)` → `new SpeechSynthesisUtterance` → on `end`/`error` shift queue and run next. The 50ms gap avoids the Chrome cancel→speak race.
- `speakText(text, onEnd, { force: true })` still bypasses the autoSpeak gate but goes through the queue.
- Add `speakText(text, onEnd, { interrupt: true })` for the ZED conversation flows that need to cut in.

### 2. Stagger Briefing narration — `src/components/FractionFactoryLevel2.tsx`
In `BriefingPanel`, remove the duplicate `useAutoSpeak` + `useNarrate`. Compose a single combined narration string ("`{zedBriefing}` … Help ZED-4 read this fraction. Listen, look, and tap when you spot a glitch.") and call `useNarrate` once. With the queue in place this single string will reliably play.

### 3. Re-narrate on every phase entry — workspaces
The 4 workspaces already use `useNarrate(narration, [step, caseDef.id])`. With the queue, those calls will actually play. No change needed beyond verifying the dep arrays. Also bump the initial delay in `useNarrate` from 200ms → 350ms so the workspace mount has time to settle after the phase swap.

### 4. Add a big "🔊 Read this aloud" button on every workspace header
Kids should never be stuck waiting for autoplay. In each of `NumeratorScanner`, `DenominatorRepair`, `UnitFractionSorter`, `CollectionVault`, and `GlitchCheckPanel`, add a prominent `ReplayInstructionsButton` next to the `h3`, reading the same narration string that `useNarrate` uses. Use the non-compact (larger) variant so it's tap-friendly for kids.

### 5. CaseDonePanel
It already uses `useNarrate`; just confirm it's queued (no code change beyond what step 1 enables).

## Files touched

- `src/lib/speech.ts` — add queue runner; small refactor of `speakText`.
- `src/lib/narrate.ts` — bump delay 200 → 350ms.
- `src/components/FractionFactoryLevel2.tsx` — collapse Briefing's two narration hooks into one.
- `src/components/level2/workspaces/NumeratorScanner.tsx` — add visible read-aloud button.
- `src/components/level2/workspaces/DenominatorRepair.tsx` — add visible read-aloud button.
- `src/components/level2/workspaces/UnitFractionSorter.tsx` — add visible read-aloud button.
- `src/components/level2/workspaces/CollectionVault.tsx` — add visible read-aloud button.
- `src/components/level2/GlitchCheckPanel.tsx` — add visible read-aloud button on both stages.

## Out of scope

- No backend, no Lovable AI calls — browser `speechSynthesis` only.
- No changes to mission content, glitch-check logic, or font sizes (those are already in place).
- Level 1 voice is unchanged.

After approval I'll implement and verify by walking through Mission 1 in the preview: confirm the briefing speaks, the glitch-check speaks, and the workspace heading speaks on entering the repair phase.
