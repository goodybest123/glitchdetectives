import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import type { L5CaseDef } from "@/lib/level5/types";
import { useNarrate } from "@/lib/narrate";
import { speakText } from "@/lib/speech";
import { ReplayInstructionsButton } from "../level2/ReplayInstructionsButton";

/** Level 5 Glitch Check — every case is a glitch, but children must investigate. */
export function L5GlitchCheckPanel({
  caseDef,
  onZedSpeak,
  onResolved,
}: {
  caseDef: L5CaseDef;
  onZedSpeak?: (line: string) => void;
  onResolved: () => void;
}) {
  const PROMPT =
    "Inspect ZED's reasoning in the case file. Is the system in sync, or is there a power-grid glitch?";

  const [nudge, setNudge] = useState<string | null>(null);
  useNarrate(PROMPT, [caseDef.id]);
  useEffect(() => {
    onZedSpeak?.(PROMPT);
  }, [caseDef.id, onZedSpeak]);

  const handleSayRight = () => {
    const line = "Are you sure, engineer? Look at the units one more time…";
    setNudge(line);
    onZedSpeak?.(line);
    speakText(line);
  };

  const handleSayGlitch = () => {
    const line = "Glitch detected — let's repair the grid together!";
    onZedSpeak?.(line);
    speakText(line, () => setTimeout(onResolved, 500));
  };

  return (
    <div className="flex flex-col gap-5">
      <header className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <p className="label-eyebrow text-cyan-300/80">Glitch check · Phase 0</p>
          <h3 className="text-2xl font-bold text-cyan-50 mt-1">
            In sync — or a power-grid glitch?
          </h3>
          <p className="text-base text-cyan-100/85 mt-2 leading-relaxed">{PROMPT}</p>
        </div>
        <ReplayInstructionsButton text={PROMPT} />
      </header>

      <div className="grid sm:grid-cols-2 gap-3">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSayRight}
          className="inline-flex items-center justify-center gap-2 px-4 py-4 rounded-2xl font-bold text-lg"
          style={{
            background: "linear-gradient(135deg, #7df4c6, #2bb789)",
            color: "#06122a",
            boxShadow: "0 0 20px rgba(125,244,198,0.35)",
          }}
        >
          <CheckCircle2 className="w-5 h-5" /> ZED is right
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSayGlitch}
          className="inline-flex items-center justify-center gap-2 px-4 py-4 rounded-2xl font-bold text-lg"
          style={{
            background: "linear-gradient(135deg, #ff8e8e, #c3375a)",
            color: "#0a0410",
            boxShadow: "0 0 20px rgba(255,142,142,0.4)",
          }}
        >
          <AlertTriangle className="w-5 h-5" /> Glitch detected!
        </motion.button>
      </div>

      {nudge && (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-cyan-200"
          role="status"
        >
          {nudge}
        </motion.p>
      )}
    </div>
  );
}
