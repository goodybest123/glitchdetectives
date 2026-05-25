import { useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, Wrench, ArrowRight } from "lucide-react";
import type { L4CaseDef } from "@/lib/level4/types";
import { useNarrate } from "@/lib/narrate";
import { FractionBar } from "../visuals/FractionBar";
import { themeAccent, ThemeBadge } from "../visuals/QuantityObject";
import { ReplayInstructionsButton } from "../../level2/ReplayInstructionsButton";

/** Mission 1 — Supply Merge Station (add like fractions). */
export function SupplyMergeStation({
  caseDef,
  onRepairComplete,
  onAttempt,
}: {
  caseDef: L4CaseDef;
  onRepairComplete: (label: string) => void;
  onAttempt: () => void;
}) {
  if (caseDef.l4.mission !== 1) return null;
  const spec = caseDef.l4.spec;
  const d = spec.a.d;
  const truthN = spec.truth.n;
  const [n, setN] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const accent = themeAccent(spec.theme);

  const narration = `Combine ${spec.a.n} over ${d} and ${spec.b.n} over ${d}. The pieces are the same size, so the bottom number stays ${d}. Build the merged total.`;
  useNarrate(narration, [caseDef.id]);

  const tryLock = () => {
    onAttempt();
    if (n === truthN) {
      setLocked(true);
      setFeedback("Merge stable — supplies are flowing!");
      setTimeout(() => onRepairComplete(`${truthN}/${d} merged in the tank`), 700);
    } else if (n < truthN) {
      setFeedback("Almost — you need a few more pieces. Add more.");
    } else {
      setFeedback("Too many pieces — take some away.");
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <header className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="label-eyebrow text-amber-300/80">Phase · Merge supplies</p>
          <h3 className="text-2xl font-bold text-amber-50 mt-1">
            Combine {spec.a.n}/{d} + {spec.b.n}/{d}
          </h3>
        </div>
        <ReplayInstructionsButton text={narration} />
      </header>

      <div className="flex items-center gap-4 flex-wrap justify-center">
        <FractionBar
          total={d}
          filled={spec.a.n}
          width={180}
          accent={accent}
          label={`Tank A · ${spec.a.n}/${d}`}
        />
        <span className="text-3xl text-amber-300" aria-hidden>+</span>
        <FractionBar
          total={d}
          filled={spec.b.n}
          width={180}
          accent={accent}
          label={`Tank B · ${spec.b.n}/${d}`}
        />
      </div>

      <div className="flex flex-col items-center gap-3 pt-2">
        <ThemeBadge theme={spec.theme} size={36} />
        <span className="label-eyebrow text-amber-200">Merged tank</span>
        <FractionBar total={d} filled={n} width={360} accent={accent} />
        <div className="flex items-center gap-3 mt-1">
          <button
            type="button"
            onClick={() => !locked && setN((v) => Math.max(0, v - 1))}
            disabled={locked}
            className="w-10 h-10 rounded-full border flex items-center justify-center disabled:opacity-40"
            style={{
              borderColor: "color-mix(in oklab, #ffb86b 40%, transparent)",
              color: "#ffd28a",
              background: "rgba(255,184,107,0.08)",
            }}
            aria-label="Remove a piece"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span
            className="px-4 py-2 rounded-xl font-mono text-xl font-bold"
            style={{
              background: "rgba(255,184,107,0.12)",
              color: "#ffe6c6",
              border: "1px solid color-mix(in oklab, #ffb86b 40%, transparent)",
            }}
          >
            {n}/{d}
          </span>
          <button
            type="button"
            onClick={() => !locked && setN((v) => Math.min(d, v + 1))}
            disabled={locked}
            className="w-10 h-10 rounded-full border flex items-center justify-center disabled:opacity-40"
            style={{
              borderColor: "color-mix(in oklab, #ffb86b 40%, transparent)",
              color: "#ffd28a",
              background: "rgba(255,184,107,0.08)",
            }}
            aria-label="Add a piece"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-amber-300/70 italic mt-1">
          Bottom locked at {d} · equal-size pieces stay equal-size
        </p>
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-xs text-amber-300/70">
          <Wrench className="w-3.5 h-3.5" />
          Tip: just count how many pieces you have in total.
        </div>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={tryLock}
          disabled={locked}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold disabled:opacity-40"
          style={{
            background: "linear-gradient(135deg, #ffe98a, #f5c84a)",
            color: "#1c1408",
            boxShadow: "0 0 20px rgba(255,233,138,0.4)",
          }}
        >
          Lock merged total <ArrowRight className="w-4 h-4" />
        </motion.button>
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
