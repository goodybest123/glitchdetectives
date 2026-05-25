import { useState } from "react";
import { motion } from "framer-motion";
import { Wrench, ArrowRight, Zap } from "lucide-react";
import type { L4CaseDef } from "@/lib/level4/types";
import { useNarrate } from "@/lib/narrate";
import { FractionBar } from "../visuals/FractionBar";
import { themeAccent, ThemeBadge } from "../visuals/QuantityObject";
import { ReplayInstructionsButton } from "../../level2/ReplayInstructionsButton";

/** Mission 4 — Equivalence Booster. */
export function EquivalenceBooster({
  caseDef,
  onRepairComplete,
  onAttempt,
}: {
  caseDef: L4CaseDef;
  onRepairComplete: (label: string) => void;
  onAttempt: () => void;
}) {
  if (caseDef.l4.mission !== 4) return null;
  const spec = caseDef.l4.spec;
  const [pick, setPick] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const accent = themeAccent(spec.theme);

  const narration = `${spec.source.n} over ${spec.source.d} needs to become ${spec.targetDenominator}ths. Split each piece into ${spec.multiplier} smaller pieces. Pick the matching top number.`;
  useNarrate(narration, [caseDef.id]);

  const choose = (v: number) => {
    if (locked) return;
    setPick(v);
    onAttempt();
    if (v === spec.correctNumerator) {
      setLocked(true);
      setFeedback("Booster online — same amount, more pieces!");
      setTimeout(
        () =>
          onRepairComplete(
            `${spec.source.n}/${spec.source.d} = ${spec.correctNumerator}/${spec.targetDenominator}`,
          ),
        700,
      );
    } else {
      setFeedback(
        v < spec.correctNumerator
          ? "Not enough pieces — splitting also multiplies the top number."
          : "Too many pieces — count one more time.",
      );
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <header className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="label-eyebrow text-amber-300/80">Phase · Fire the booster</p>
          <h3 className="text-2xl font-bold text-amber-50 mt-1">
            Rewrite {spec.source.n}/{spec.source.d} as ?/{spec.targetDenominator}
          </h3>
        </div>
        <ReplayInstructionsButton text={narration} />
      </header>

      <div className="flex items-center gap-4 flex-wrap justify-center">
        <div className="flex flex-col items-center gap-1.5">
          <span className="label-eyebrow text-amber-200">Source</span>
          <FractionBar
            total={spec.source.d}
            filled={spec.source.n}
            width={220}
            accent={accent}
            label={`${spec.source.n}/${spec.source.d}`}
          />
        </div>
        <div className="flex flex-col items-center gap-1 text-amber-300">
          <Zap className="w-6 h-6" />
          <span className="text-xs font-mono">×{spec.multiplier}</span>
          <ArrowRight className="w-5 h-5" />
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <span className="label-eyebrow text-amber-200">Target ({spec.targetDenominator}ths)</span>
          <FractionBar
            total={spec.targetDenominator}
            filled={pick ?? 0}
            width={220}
            accent={accent}
            label={pick != null ? `${pick}/${spec.targetDenominator}` : `?/${spec.targetDenominator}`}
          />
        </div>
        <ThemeBadge theme={spec.theme} size={32} />
      </div>

      <div className="flex flex-col items-center gap-3 pt-2">
        <span className="label-eyebrow text-amber-200">Numerator chips</span>
        <div className="flex items-center gap-3 flex-wrap justify-center">
          {spec.pool.map((v) => {
            const isPick = pick === v;
            const isCorrect = locked && v === spec.correctNumerator;
            return (
              <motion.button
                key={v}
                whileTap={{ scale: 0.95 }}
                onClick={() => choose(v)}
                disabled={locked}
                className="px-5 py-3 rounded-2xl font-mono text-xl font-bold border-2 transition"
                style={{
                  background: isCorrect
                    ? "rgba(125,244,198,0.18)"
                    : isPick
                      ? "rgba(255,142,142,0.18)"
                      : "rgba(255,184,107,0.08)",
                  borderColor: isCorrect
                    ? "#7df4c6"
                    : isPick
                      ? "#ff8e8e"
                      : "color-mix(in oklab, #ffb86b 40%, transparent)",
                  color: "#ffe6c6",
                }}
              >
                {v}/{spec.targetDenominator}
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-amber-300/70">
        <Wrench className="w-3.5 h-3.5" />
        Tip: if each piece splits into {spec.multiplier}, the top number multiplies by {spec.multiplier} too.
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
