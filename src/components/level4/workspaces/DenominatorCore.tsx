import { useState } from "react";
import { motion } from "framer-motion";
import { Wrench, ArrowRight } from "lucide-react";
import type { L4CaseDef } from "@/lib/level4/types";
import { useNarrate } from "@/lib/narrate";
import { FractionBar } from "../visuals/FractionBar";
import { themeAccent, ThemeBadge } from "../visuals/QuantityObject";
import { ReplayInstructionsButton } from "../../level2/ReplayInstructionsButton";

/** Mission 3 — Denominator Stability Core. */
export function DenominatorCore({
  caseDef,
  onRepairComplete,
  onAttempt,
}: {
  caseDef: L4CaseDef;
  onRepairComplete: (label: string) => void;
  onAttempt: () => void;
}) {
  if (caseDef.l4.mission !== 3) return null;
  const spec = caseDef.l4.spec;
  const [pick, setPick] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const accent = themeAccent(spec.theme);

  const narration = `Look at the two fractions. Both are in ${spec.trueDenominator}ths — same equal parts. Choose the bottom number that keeps the partition stable.`;
  useNarrate(narration, [caseDef.id]);

  const choose = (v: number) => {
    if (locked) return;
    setPick(v);
    onAttempt();
    if (v === spec.trueDenominator) {
      setLocked(true);
      setFeedback("Core stable — partition holds!");
      setTimeout(
        () => onRepairComplete(`${spec.truth.n}/${spec.trueDenominator} — bottom held steady`),
        700,
      );
    } else {
      setFeedback(
        v > spec.trueDenominator
          ? "Too many parts — the whole was already cut into the right number."
          : "Too few parts — count again how the whole was cut.",
      );
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <header className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="label-eyebrow text-amber-300/80">Phase · Stabilise the core</p>
          <h3 className="text-2xl font-bold text-amber-50 mt-1">
            {spec.a.n}/{spec.a.d} {spec.op} {spec.b.n}/{spec.b.d}
          </h3>
        </div>
        <ReplayInstructionsButton text={narration} />
      </header>

      <div className="flex items-center gap-4 flex-wrap justify-center">
        <FractionBar
          total={spec.a.d}
          filled={spec.a.n}
          width={180}
          accent={accent}
          label={`${spec.a.n}/${spec.a.d}`}
        />
        <span className="text-3xl text-amber-300" aria-hidden>{spec.op}</span>
        <FractionBar
          total={spec.b.d}
          filled={spec.b.n}
          width={180}
          accent={accent}
          label={`${spec.b.n}/${spec.b.d}`}
        />
        <ThemeBadge theme={spec.theme} size={32} />
      </div>

      <div className="flex flex-col items-center gap-3 pt-2">
        <span className="label-eyebrow text-amber-200">
          Partition dial · choose the bottom number
        </span>
        <div className="flex items-center gap-3 flex-wrap justify-center">
          {spec.options.map((v) => {
            const isPick = pick === v;
            const isCorrect = locked && v === spec.trueDenominator;
            return (
              <motion.button
                key={v}
                whileTap={{ scale: 0.95 }}
                onClick={() => choose(v)}
                disabled={locked}
                className="px-5 py-3 rounded-2xl font-mono text-2xl font-bold border-2 transition"
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
                aria-label={`Set bottom number to ${v}`}
              >
                {v}
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-amber-300/70">
        <Wrench className="w-3.5 h-3.5" />
        Tip: both fractions are already in {spec.trueDenominator}ths — the pieces don't get smaller when we combine them.
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

      {locked && (
        <div className="flex justify-end">
          <ArrowRight className="w-5 h-5 text-emerald-300" />
        </div>
      )}
    </div>
  );
}
