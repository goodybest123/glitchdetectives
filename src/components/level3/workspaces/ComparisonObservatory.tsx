import { useState } from "react";
import { motion } from "framer-motion";
import type { CompareOp, L3CaseDef } from "@/lib/level3/types";
import { useNarrate } from "@/lib/narrate";
import { ObjectMeter } from "../visuals/ObjectMeter";
import { ReplayInstructionsButton } from "../../level2/ReplayInstructionsButton";

/** Mission 3 — Comparison Observatory workspace. */
export function ComparisonObservatory({
  caseDef,
  onRepairComplete,
  onAttempt,
}: {
  caseDef: L3CaseDef;
  onRepairComplete: (label: string) => void;
  onAttempt: () => void;
}) {
  if (caseDef.l3.mission !== 3) return null;
  const spec = caseDef.l3.spec;
  const [pick, setPick] = useState<CompareOp | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);

  const choose = (op: CompareOp) => {
    setPick(op);
    onAttempt();
    if (op === spec.truth) {
      setLocked(true);
      setFeedback("Scanner repaired!");
      setTimeout(
        () => onRepairComplete(`${spec.a.n}/${spec.a.d} ${op} ${spec.b.n}/${spec.b.d}`),
        700,
      );
    } else {
      setFeedback("Look at the fill height — which meter holds more?");
    }
  };

  const narration = `Compare the two ${spec.object} meters. Pick the symbol that tells which is bigger.`;
  useNarrate(narration, [caseDef.id]);

  return (
    <div className="flex flex-col gap-5">
      <header className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="label-eyebrow text-cyan-300/80">Phase · Repair scanner</p>
          <h3 className="text-2xl font-bold text-cyan-50 mt-1">
            Pick the correct symbol.
          </h3>
        </div>
        <ReplayInstructionsButton text={narration} />
      </header>

      <div className="flex items-end justify-center gap-6 flex-wrap">
        <ObjectMeter
          numerator={spec.a.n}
          denominator={spec.a.d}
          object={spec.object}
          size={170}
          label="A"
        />
        <div
          className="font-mono text-5xl font-bold pb-12"
          style={{ color: locked ? "#7df4c6" : "#e6faff" }}
        >
          {pick ?? "?"}
        </div>
        <ObjectMeter
          numerator={spec.b.n}
          denominator={spec.b.d}
          object={spec.object}
          size={170}
          label="B"
        />
      </div>

      <div>
        <p className="label-eyebrow text-cyan-300/80 mb-2">Pick the symbol</p>
        <div className="flex gap-3">
          {(["<", "=", ">"] as CompareOp[]).map((op) => {
            const sel = pick === op;
            return (
              <motion.button
                key={op}
                whileTap={{ scale: 0.92 }}
                onClick={() => !locked && choose(op)}
                disabled={locked}
                className="flex-1 py-4 rounded-xl font-mono font-bold text-3xl"
                style={{
                  background: sel
                    ? "linear-gradient(135deg, #ffe98a, #f5c84a)"
                    : "rgba(95,208,255,0.08)",
                  color: sel ? "#04162e" : "#e6faff",
                  border: "1px solid color-mix(in oklab, #5fd0ff 35%, transparent)",
                  boxShadow: sel ? "0 0 18px rgba(255,233,138,0.5)" : undefined,
                }}
                aria-label={
                  op === "<" ? "less than" : op === ">" ? "greater than" : "equals"
                }
              >
                {op}
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
