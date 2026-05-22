import { useState } from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import type { L3CaseDef } from "@/lib/level3/types";
import { useNarrate } from "@/lib/narrate";
import { EquivalenceChamber } from "../visuals/EquivalenceChamber";
import { ReplayInstructionsButton } from "../../level2/ReplayInstructionsButton";

/** Mission 2 — Equivalence Reactor workspace. */
export function EquivalenceReactor({
  caseDef,
  onRepairComplete,
  onAttempt,
}: {
  caseDef: L3CaseDef;
  onRepairComplete: (label: string) => void;
  onAttempt: () => void;
}) {
  if (caseDef.l3.mission !== 2) return null;
  const spec = caseDef.l3.spec;
  const [pick, setPick] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);

  const choose = (n: number) => {
    setPick(n);
    onAttempt();
    if (n === spec.correctNumerator) {
      setLocked(true);
      setFeedback("Beam locked — same amount, different slicing!");
      setTimeout(
        () =>
          onRepairComplete(
            `${spec.left.n}/${spec.left.d} = ${spec.correctNumerator}/${spec.rightDenominator}`,
          ),
        700,
      );
    } else {
      setFeedback("Beam stayed dark. Look at the shaded area — it should match.");
    }
  };

  const narration = `Pick the card that makes the right reactor show the SAME shaded amount as the left.`;
  useNarrate(narration, [caseDef.id]);

  return (
    <div className="flex flex-col gap-5">
      <header className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="label-eyebrow text-cyan-300/80">Phase · Synchronize reactors</p>
          <h3 className="text-2xl font-bold text-cyan-50 mt-1">
            Find the equivalent fraction.
          </h3>
        </div>
        <ReplayInstructionsButton text={narration} />
      </header>

      <div className="flex items-center justify-center gap-3 flex-wrap">
        <EquivalenceChamber
          numerator={spec.left.n}
          denominator={spec.left.d}
          kind={spec.left.visual}
          size={140}
          glow
          label="Reactor A"
        />
        <motion.div
          animate={{ opacity: locked ? [0.4, 1, 0.4] : 0.3 }}
          transition={{ repeat: locked ? Infinity : 0, duration: 1.4 }}
          className="px-3 py-2 rounded-xl"
          style={{
            background: locked ? "rgba(125,244,198,0.2)" : "rgba(95,208,255,0.1)",
            border: `2px solid color-mix(in oklab, ${locked ? "#7df4c6" : "#5fd0ff"} 50%, transparent)`,
          }}
        >
          <Zap
            className="w-7 h-7"
            style={{ color: locked ? "#7df4c6" : "#5fd0ff" }}
          />
        </motion.div>
        <EquivalenceChamber
          numerator={pick ?? 0}
          denominator={spec.rightDenominator}
          kind={spec.rightVisual}
          size={140}
          glow={locked}
          empty={pick === null}
          label="Reactor B"
        />
      </div>

      <div>
        <p className="label-eyebrow text-cyan-300/80 mb-2">Pick a numerator</p>
        <div className="flex flex-wrap gap-2">
          {spec.pool.map((n) => {
            const sel = pick === n;
            return (
              <motion.button
                key={n}
                whileTap={{ scale: 0.92 }}
                onClick={() => !locked && choose(n)}
                disabled={locked}
                className="px-4 py-3 rounded-xl font-mono font-bold text-lg"
                style={{
                  background: sel
                    ? "linear-gradient(135deg, #5fd0ff, #2a8ec9)"
                    : "rgba(95,208,255,0.08)",
                  color: sel ? "#04162e" : "#e6faff",
                  border: "1px solid color-mix(in oklab, #5fd0ff 35%, transparent)",
                  boxShadow: sel ? "0 0 18px #5fd0ff" : undefined,
                  minWidth: 80,
                }}
              >
                {n}/{spec.rightDenominator}
              </motion.button>
            );
          })}
        </div>
      </div>

      {feedback && (
        <motion.p
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          className={`text-sm ${locked ? "text-emerald-200" : "text-amber-200"}`}
          role="status"
        >
          {feedback}
        </motion.p>
      )}
    </div>
  );
}
