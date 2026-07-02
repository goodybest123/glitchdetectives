/**
 * SuccessBanner — celebratory green banner shown once the child reaches the
 * Explain/Solved stage. Announces the next step ("now explain why").
 */
import { SpeakButton } from "@/components/case01/SpeakButton";

/**
 * Generic "Logic Repaired!" banner. Never describes HOW the logic was
 * repaired — that explanation is the child's job in the chat panel.
 */
export function SuccessBanner() {
  return (
    <div className="mt-6 flex items-center justify-center gap-3 rounded-2xl bg-[#dcfce7] px-5 py-4 text-center text-base font-bold text-[#166534]">
      <span>Logic Repaired!</span>
      <SpeakButton text="Logic Repaired!" />
    </div>
  );
}
