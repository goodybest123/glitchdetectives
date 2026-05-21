import { ArrowLeft, Settings2, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";

/**
 * Persistent top bar across all Level 2 screens.
 * Shows mission progress, audio mute, settings, and a back button.
 * The 🔊 "replay instructions" lives inside DialogueDock and the right
 * workspace so it stays near the active prompt.
 */
export function L2TopBar({
  title,
  subtitle,
  caseIndex,
  totalCases,
  onBack,
  backLabel = "Map",
  rightSlot,
}: {
  title: string;
  subtitle?: string;
  caseIndex?: number;
  totalCases?: number;
  onBack: () => void;
  backLabel?: string;
  rightSlot?: React.ReactNode;
}) {
  const [muted, setMuted] = useState(false);
  return (
    <header
      className="border-b"
      style={{
        background:
          "linear-gradient(180deg, rgba(6,16,38,0.95) 0%, rgba(8,22,48,0.85) 100%)",
        borderColor: "color-mix(in oklab, #5fd0ff 18%, transparent)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium text-cyan-100 hover:bg-white/10 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
        >
          <ArrowLeft className="w-4 h-4" /> {backLabel}
        </button>

        <div className="flex-1 text-center min-w-0">
          <p className="label-eyebrow text-cyan-300/80 truncate">{subtitle}</p>
          <h1 className="text-sm sm:text-base font-mono uppercase tracking-widest text-cyan-50 truncate">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {typeof caseIndex === "number" && typeof totalCases === "number" && (
            <span
              className="hidden sm:inline-flex items-center gap-1.5 label-eyebrow px-2.5 py-1 rounded-full"
              style={{
                background: "color-mix(in oklab, #ffe98a 20%, transparent)",
                color: "#ffe98a",
              }}
            >
              Case {caseIndex + 1}/{totalCases}
            </span>
          )}
          {rightSlot}
          <button
            type="button"
            onClick={() => {
              setMuted((m) => !m);
              if (!muted) window.speechSynthesis?.cancel();
            }}
            aria-label={muted ? "Unmute audio" : "Mute audio"}
            className="w-9 h-9 inline-flex items-center justify-center rounded-full text-cyan-100 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            type="button"
            aria-label="Settings"
            className="w-9 h-9 inline-flex items-center justify-center rounded-full text-cyan-100 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
          >
            <Settings2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
