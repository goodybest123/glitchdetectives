import { Volume2 } from "lucide-react";
import { speakText } from "@/lib/speech";

/**
 * "🔊 Read Instructions Again" button — calm, always-on-demand voice.
 * Never auto-plays. Replays the active case's instruction text.
 */
export function ReplayInstructionsButton({
  text,
  label = "Read instructions again",
  compact = false,
}: {
  text: string;
  label?: string;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => speakText(text)}
      aria-label={label}
      className={`inline-flex items-center gap-2 rounded-full border font-semibold transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${
        compact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"
      }`}
      style={{
        color: "#a8e9ff",
        borderColor: "color-mix(in oklab, #a8e9ff 35%, transparent)",
      }}
    >
      <Volume2 className={compact ? "w-3.5 h-3.5" : "w-4 h-4"} />
      {compact ? "Replay" : "Read instructions again"}
    </button>
  );
}
