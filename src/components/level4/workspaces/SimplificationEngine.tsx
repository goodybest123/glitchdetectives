import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Wrench, ArrowRight, Scissors } from "lucide-react";
import type { L4CaseDef } from "@/lib/level4/types";
import { useNarrate } from "@/lib/narrate";
import { FractionBar } from "../visuals/FractionBar";
import { themeAccent, ThemeBadge } from "../visuals/QuantityObject";
import { ReplayInstructionsButton } from "../../level2/ReplayInstructionsButton";

function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

/** Mission 5 — Fraction Simplification Engine. */
export function SimplificationEngine({
  caseDef,
  onRepairComplete,
  onAttempt,
}: {
  caseDef: L4CaseDef;
  onRepairComplete: (label: string) => void;
  onAttempt: () => void;
}) {
  if (caseDef.l4.mission !== 5) return null;
  const spec = caseDef.l4.spec;
  const correctDivisor = useMemo(() => gcd(spec.start.n, spec.start.d), [spec.start.n, spec.start.d]);
  const [pick, setPick] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const accent = themeAccent(spec.theme);

  const showN = pick != null && spec.start.n % pick === 0 && spec.start.d % pick === 0 ? spec.start.n / pick : null;
  const showD = pick != null && spec.start.n % pick === 0 && spec.start.d % pick === 0 ? spec.start.d / pick : null;

  const narration = `Group the equal pieces of ${spec.start.n} over ${spec.start.d} into bigger chunks. Pick the divisor that reduces it to the simplest form.`;
  useNarrate(narration, [caseDef.id]);

  const choose = (v: number) => {
    if (locked) return;
    setPick(v);
    onAttempt();
    if (spec.start.n % v !== 0 || spec.start.d % v !== 0) {
      setFeedback(`${v} doesn't divide both ${spec.start.n} and ${spec.start.d} evenly — try another divisor.`);
      return;
    }
    if (v === correctDivisor) {
      setLocked(true);
      setFeedback("Engine humming — simplest form locked!");
      setTimeout(
        () => onRepairComplete(`${spec.start.n}/${spec.start.d} = ${spec.simplest.n}/${spec.simplest.d}`),
        700,
      );
    } else {
      setFeedback("It divides evenly, but you can group even bigger. Try a larger divisor.");
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <header className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="label-eyebrow text-amber-300/80">Phase · Reduce to simplest form</p>
          <h3 className="text-2xl font-bold text-amber-50 mt-1">
            Simplify {spec.start.n}/{spec.start.d}
          </h3>
        </div>
        <ReplayInstructionsButton text={narration} />
      </header>

      <div className="flex items-center gap-4 flex-wrap justify-center">
        <div className="flex flex-col items-center gap-1.5">
          <span className="label-eyebrow text-amber-200">Start</span>
          <FractionBar
            total={spec.start.d}
            filled={spec.start.n}
            width={260}
            accent={accent}
            label={`${spec.start.n}/${spec.start.d}`}
          />
        </div>
        <div className="flex flex-col items-center gap-1 text-amber-300">
          <Scissors className="w-6 h-6" />
          <span className="text-xs font-mono">÷{pick ?? "?"}</span>
          <ArrowRight className="w-5 h-5" />
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <span className="label-eyebrow text-amber-200">Simplified</span>
          {showN != null && showD != null ? (
            <FractionBar
              total={showD}
              filled={showN}
              width={Math.min(260, 40 * showD)}
              accent={accent}
              label={`${showN}/${showD}`}
            />
          ) : (
            <div
              className="rounded-xl border-2 border-dashed flex items-center justify-center text-amber-300/60 font-mono"
              style={{ width: 180, height: 44, borderColor: "color-mix(in oklab, #ffb86b 40%, transparent)" }}
            >
              ?/?
            </div>
          )}
        </div>
        <ThemeBadge theme={spec.theme} size={32} />
      </div>

      <div className="flex flex-col items-center gap-3 pt-2">
        <span className="label-eyebrow text-amber-200">Divisor chips</span>
        <div className="flex items-center gap-3 flex-wrap justify-center">
          {spec.divisors.map((v) => {
            const isPick = pick === v;
            const isCorrect = locked && v === correctDivisor;
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
                aria-label={`Divide by ${v}`}
              >
                ÷{v}
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-amber-300/70">
        <Wrench className="w-3.5 h-3.5" />
        Tip: divide BOTH the top and the bottom by the same number — same amount, fewer parts.
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
