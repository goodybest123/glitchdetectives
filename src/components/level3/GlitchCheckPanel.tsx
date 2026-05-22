import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import type { L3CaseDef } from "@/lib/level3/types";
import { useNarrate } from "@/lib/narrate";
import { speakText } from "@/lib/speech";
import { ReplayInstructionsButton } from "../level2/ReplayInstructionsButton";

/**
 * Level 3 Glitch Check — phase 0 of every case. Child reads ZED's claim
 * and decides "ZED is right" vs "It's a glitch!" before unlocking the
 * repair workspace. Same emotional cadence as the L2 panel but agnostic
 * to the visual evidence (which lives in the persistent left case file).
 */
export function L3GlitchCheckPanel({
  caseDef,
  onZedSpeak,
  onResolved,
}: {
  caseDef: L3CaseDef;
  onZedSpeak?: (line: string) => void;
  onResolved: () => void;
}) {
  const isActuallyCorrupted = useMemo(() => isGlitch(caseDef), [caseDef]);
  const PROMPT =
    "Look at ZED's mapping in the case file. Is ZED right, or is there a glitch? Take your time, navigator.";

  const [nudge, setNudge] = useState<string | null>(null);
  useNarrate(PROMPT, [caseDef.id]);
  useEffect(() => {
    onZedSpeak?.(PROMPT);
  }, [caseDef.id, onZedSpeak]);

  const handleSayRight = () => {
    if (isActuallyCorrupted) {
      const line = "Hmm, are you sure, teacher? Let's look one more time…";
      setNudge(line);
      onZedSpeak?.(line);
      speakText(line);
      return;
    }
    const line = "Yay! Thank you teacher — I got this one right!";
    onZedSpeak?.(line);
    speakText(line, () => setTimeout(onResolved, 700));
  };

  const handleSayGlitch = () => {
    if (!isActuallyCorrupted) {
      const line = "Hmm, I think I got this one right. Look once more, teacher.";
      setNudge(line);
      onZedSpeak?.(line);
      speakText(line);
      return;
    }
    const line = "Oh no — let's fix it together, teacher!";
    onZedSpeak?.(line);
    speakText(line, () => setTimeout(onResolved, 500));
  };

  return (
    <div className="flex flex-col gap-5">
      <header className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <p className="label-eyebrow text-cyan-300/80">Glitch check · Phase 0</p>
          <h3 className="text-2xl font-bold text-cyan-50 mt-1">
            Is ZED right, or is there a glitch?
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
            color: "#04162e",
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
            background: "linear-gradient(135deg, #ffb38a, #e85d3a)",
            color: "#04162e",
            boxShadow: "0 0 20px rgba(232,93,58,0.35)",
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

function isGlitch(c: L3CaseDef): boolean {
  const l3 = c.l3;
  if (l3.mission === 1) {
    return Math.abs(l3.spec.zedDropAt - l3.spec.target.n / l3.spec.target.d) > 0.05;
  }
  if (l3.mission === 2) {
    return l3.spec.zedNumerator !== l3.spec.correctNumerator;
  }
  if (l3.mission === 3) {
    return l3.spec.zedClaim !== l3.spec.truth;
  }
  return l3.spec.zedClaim.n !== l3.spec.truth.n || l3.spec.zedClaim.d !== l3.spec.truth.d;
}
