import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import type { CaseDef } from "@/lib/level2/types";
import { useNarrate } from "@/lib/narrate";
import { speakText } from "@/lib/speech";
import { FractionVisual } from "./fractions/FractionVisual";
import { FractionNotation } from "./fractions/FractionNotation";
import { ConversationPanel } from "./ConversationPanel";

/**
 * Glitch Check — sits between the case briefing and the repair workspace.
 * The child decides whether ZED's reading is right or has a glitch, then
 * (when they spot the glitch) explains it to ZED via the gentle chat.
 * Only after ZED accepts the explanation does the case advance to repair.
 */
export function GlitchCheckPanel({
  caseDef,
  onResolved,
  onZedSpeak,
}: {
  caseDef: CaseDef;
  onResolved: () => void;
  onZedSpeak?: (line: string) => void;
}) {
  const isActuallyCorrupted = useMemo(
    () =>
      caseDef.zedClaim.numerator !== caseDef.truth.numerator ||
      caseDef.zedClaim.denominator !== caseDef.truth.denominator,
    [caseDef],
  );

  const PROMPT =
    "Look at ZED's reading. Is ZED right, or is there a glitch? Take your time, teacher.";

  const [stage, setStage] = useState<"choose" | "explain">("choose");
  const [nudge, setNudge] = useState<string | null>(null);

  useNarrate(PROMPT, [caseDef.id]);
  useEffect(() => {
    if (stage === "choose") onZedSpeak?.(PROMPT);
  }, [stage, onZedSpeak]);

  const handleSayRight = () => {
    if (isActuallyCorrupted) {
      const line =
        "Hmm, are you sure, teacher? Let's look one more time… count with me.";
      setNudge(line);
      onZedSpeak?.(line);
      speakText(line);
      return;
    }
    const line = "Yay! Thank you teacher — my reading was good this time!";
    onZedSpeak?.(line);
    speakText(line, () => setTimeout(onResolved, 800));
  };

  const handleSayGlitch = () => {
    if (!isActuallyCorrupted) {
      const line =
        "Hmm, I think I got this one right. Look once more, teacher — what do you see?";
      setNudge(line);
      onZedSpeak?.(line);
      speakText(line);
      return;
    }
    setNudge(null);
    setStage("explain");
  };

  if (stage === "explain") {
    const seed =
      "Oh no — what did I get wrong, teacher? Tell me about the glitch you found.";
    return (
      <div className="flex flex-col gap-4">
        <header>
          <p className="label-eyebrow text-cyan-300/80">
            Glitch report · Tell ZED what's wrong
          </p>
          <h3 className="text-2xl font-bold text-cyan-50 mt-1">
            Explain the glitch to ZED-4
          </h3>
        </header>
        <ConversationPanel
          key={`glitch-${caseDef.id}`}
          caseDef={caseDef}
          seedZedLine={seed}
          onComplete={() => onResolved()}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <header>
        <p className="label-eyebrow text-cyan-300/80">
          Glitch check · Phase 0
        </p>
        <h3 className="text-2xl font-bold text-cyan-50 mt-1">
          Is ZED right, or is there a glitch?
        </h3>
        <p className="text-base text-cyan-100/85 mt-2 leading-relaxed">
          {PROMPT}
        </p>
      </header>

      <div className="flex items-center justify-center gap-6 flex-wrap">
        <FractionVisual spec={caseDef.visual} size={200} emphasizeSelected />
        <FractionNotation
          numerator={caseDef.zedClaim.numerator}
          denominator={caseDef.zedClaim.denominator}
          corruptedField="none"
          state="corrupted"
          size="md"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSayRight}
          className="inline-flex items-center justify-center gap-2 px-4 py-4 rounded-2xl font-bold text-base"
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
          className="inline-flex items-center justify-center gap-2 px-4 py-4 rounded-2xl font-bold text-base"
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
