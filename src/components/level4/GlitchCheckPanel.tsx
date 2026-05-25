import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import type { L4CaseDef } from "@/lib/level4/types";
import { useNarrate } from "@/lib/narrate";
import { speakText } from "@/lib/speech";
import { ReplayInstructionsButton } from "../level2/ReplayInstructionsButton";

/**
 * Level 4 Glitch Check — phase 0 of every case. Every L4 case is a
 * glitch (ZED is always wrong), but we still ask the child to detect
 * it so they investigate before repairing.
 */
export function L4GlitchCheckPanel({
  caseDef,
  onZedSpeak,
  onResolved,
}: {
  caseDef: L4CaseDef;
  onZedSpeak?: (line: string) => void;
  onResolved: () => void;
}) {
  const PROMPT =
    "Look at ZED's broken calculation in the case file. Is the answer right, or is there a glitch? Take your time, engineer.";

  const [nudge, setNudge] = useState<string | null>(null);
  useNarrate(PROMPT, [caseDef.id]);
  useEffect(() => {
    onZedSpeak?.(PROMPT);
  }, [caseDef.id, onZedSpeak]);

  const handleSayRight = () => {
    const line = "Hmm, are you sure, teacher? Look at the parts one more time…";
    setNudge(line);
    onZedSpeak?.(line);
    speakText(line);
  };

  const handleSayGlitch = () => {
    const line = "Oh no — let's repair it together, teacher!";
    onZedSpeak?.(line);
    speakText(line, () => setTimeout(onResolved, 500));
  };

  return (
    <div className="flex flex-col gap-5">
      <header className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <p className="label-eyebrow text-amber-300/80">Glitch check · Phase 0</p>
          <h3 className="text-2xl font-bold text-amber-50 mt-1">
            Is the calculation right, or is there a glitch?
          </h3>
          <p className="text-base text-amber-100/85 mt-2 leading-relaxed">{PROMPT}</p>
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
            color: "#1c1408",
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
            background: "linear-gradient(135deg, #ffb86b, #e85d3a)",
            color: "#1c1408",
            boxShadow: "0 0 20px rgba(232,93,58,0.4)",
          }}
        >
          <AlertTriangle className="w-5 h-5" /> It's a glitch!
        </motion.button>
      </div>

      {nudge && (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-amber-200"
          role="status"
        >
          {nudge}
        </motion.p>
      )}
    </div>
  );
}
