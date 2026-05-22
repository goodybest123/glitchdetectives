import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { L3CaseDef } from "@/lib/level3/types";
import { useNarrate } from "@/lib/narrate";
import { ReplayInstructionsButton } from "../../level2/ReplayInstructionsButton";
import { FractionNotation } from "../../level2/fractions/FractionNotation";

/** Mission 4 — Transformation Chamber workspace. */
export function TransformationChamber({
  caseDef,
  onRepairComplete,
  onAttempt,
}: {
  caseDef: L3CaseDef;
  onRepairComplete: (label: string) => void;
  onAttempt: () => void;
}) {
  if (caseDef.l3.mission !== 4) return null;
  const spec = caseDef.l3.spec;
  const [pick, setPick] = useState<{ n: number; d: number } | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);

  const options = useMemo(() => buildOptions(spec.truth, spec.zedClaim), [spec]);

  const choose = (o: { n: number; d: number }) => {
    setPick(o);
    onAttempt();
    if (o.n === spec.truth.n && o.d === spec.truth.d) {
      setLocked(true);
      setFeedback("Identity vault restored!");
      setTimeout(() => onRepairComplete(`${o.n}/${o.d} = ${spec.whole} whole`), 700);
    } else {
      setFeedback("Count every part. ALL the pieces filled = the bottom number.");
    }
  };

  const emoji = wholeEmoji(spec.object);
  const narration = `Pick the fraction card that matches ${spec.whole} whole ${spec.object}${spec.whole === 1 ? "" : "s"}.`;
  useNarrate(narration, [caseDef.id]);

  return (
    <div className="flex flex-col gap-5">
      <header className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="label-eyebrow text-cyan-300/80">Phase · Transform identity</p>
          <h3 className="text-2xl font-bold text-cyan-50 mt-1">
            Match the wholes to a fraction.
          </h3>
        </div>
        <ReplayInstructionsButton text={narration} />
      </header>

      <div className="flex items-center justify-center gap-4 flex-wrap py-4">
        <div
          className="rounded-2xl p-4"
          style={{
            background: "rgba(125,244,198,0.08)",
            border: "2px solid color-mix(in oklab, #7df4c6 35%, transparent)",
            boxShadow: "0 0 24px rgba(125,244,198,0.25)",
          }}
        >
          <p className="label-eyebrow text-emerald-200 mb-2 text-center">
            {spec.whole} whole {spec.object}
            {spec.whole === 1 ? "" : "s"}
          </p>
          <div className="text-5xl text-center">{emoji.repeat(spec.whole)}</div>
        </div>
        <span className="text-cyan-300 text-3xl font-mono">=</span>
        <FractionNotation
          numerator={pick?.n ?? "?"}
          denominator={pick?.d ?? "?"}
          state={locked ? "repaired" : "corrupted"}
          corruptedField="none"
          size="lg"
        />
      </div>

      <div>
        <p className="label-eyebrow text-cyan-300/80 mb-2">Pick a fraction card</p>
        <div className="flex flex-wrap gap-2">
          {options.map((o, i) => {
            const sel = pick && pick.n === o.n && pick.d === o.d;
            return (
              <motion.button
                key={i}
                whileTap={{ scale: 0.92 }}
                onClick={() => !locked && choose(o)}
                disabled={locked}
                className="px-4 py-3 rounded-xl font-mono font-bold text-lg"
                style={{
                  background: sel
                    ? "linear-gradient(135deg, #7df4c6, #2bb789)"
                    : "rgba(95,208,255,0.08)",
                  color: sel ? "#04162e" : "#e6faff",
                  border: "1px solid color-mix(in oklab, #5fd0ff 35%, transparent)",
                  boxShadow: sel ? "0 0 18px rgba(125,244,198,0.5)" : undefined,
                  minWidth: 80,
                }}
              >
                {o.n}/{o.d}
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

function buildOptions(
  truth: { n: number; d: number },
  zed: { n: number; d: number },
): { n: number; d: number }[] {
  const opts = [truth, zed, { n: truth.d, d: truth.n }, { n: 1, d: truth.n }];
  // dedupe
  const seen = new Set<string>();
  return opts.filter((o) => {
    const k = `${o.n}/${o.d}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

function wholeEmoji(obj: string) {
  if (obj === "pizza") return "🍕";
  if (obj === "battery") return "🔋";
  if (obj === "snackpack") return "🍱";
  return "🎁";
}
