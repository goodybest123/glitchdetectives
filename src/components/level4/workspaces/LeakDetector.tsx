import { useState } from "react";
import { motion } from "framer-motion";
import { Wrench, ArrowRight, Droplet } from "lucide-react";
import type { L4CaseDef } from "@/lib/level4/types";
import { useNarrate } from "@/lib/narrate";
import { FractionBar } from "../visuals/FractionBar";
import { themeAccent, ThemeBadge } from "../visuals/QuantityObject";
import { ReplayInstructionsButton } from "../../level2/ReplayInstructionsButton";

/** Mission 2 — Subtraction Leak Detector. */
export function LeakDetector({
  caseDef,
  onRepairComplete,
  onAttempt,
}: {
  caseDef: L4CaseDef;
  onRepairComplete: (label: string) => void;
  onAttempt: () => void;
}) {
  if (caseDef.l4.mission !== 2) return null;
  const spec = caseDef.l4.spec;
  const d = spec.a.d;
  const startN = spec.a.n;
  const truthN = spec.truth.n;
  const [drained, setDrained] = useState(0); // how many pieces drained so far
  const [feedback, setFeedback] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const accent = themeAccent(spec.theme);
  const remaining = startN - drained;

  const narration = `Start with ${startN} over ${d}. Drain ${spec.b.n} over ${d} from the tank by tapping the leaking pieces. The bottom number stays ${d}.`;
  useNarrate(narration, [caseDef.id]);

  const drain = (i: number) => {
    if (locked) return;
    // Only allow draining a currently-filled cell (the rightmost filled one).
    if (i >= remaining) return;
    setDrained((v) => Math.min(startN, v + 1));
  };

  const reset = () => {
    if (locked) return;
    setDrained(0);
  };

  const tryLock = () => {
    onAttempt();
    if (remaining === truthN) {
      setLocked(true);
      setFeedback("Leak sealed — tank stable!");
      setTimeout(() => onRepairComplete(`${truthN}/${d} remaining in the tank`), 700);
    } else if (drained < spec.b.n) {
      setFeedback("Not enough drained yet — drain more pieces.");
    } else {
      setFeedback("Too much drained — reset and try again.");
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <header className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="label-eyebrow text-amber-300/80">Phase · Repair the leak</p>
          <h3 className="text-2xl font-bold text-amber-50 mt-1">
            {startN}/{d} − {spec.b.n}/{d}
          </h3>
        </div>
        <ReplayInstructionsButton text={narration} />
      </header>

      <div className="flex flex-col items-center gap-3 pt-2">
        <ThemeBadge theme={spec.theme} size={36} />
        <span className="label-eyebrow text-amber-200">Tap a piece to drain it</span>
        <div className="relative">
          <FractionBar total={d} filled={remaining} width={420} height={56} accent={accent} />
          {/* Click overlays for each filled cell */}
          <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${d}, 1fr)` }}>
            {Array.from({ length: d }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => drain(i)}
                disabled={locked || i >= remaining}
                aria-label={`Drain piece ${i + 1}`}
                className="border-r last:border-r-0 hover:bg-rose-400/15 disabled:cursor-default transition"
                style={{
                  borderColor: "transparent",
                }}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm text-amber-100/80">
          <Droplet className="w-4 h-4 text-rose-300" /> Drained: {drained}/{spec.b.n}
        </div>
        <button
          type="button"
          onClick={reset}
          disabled={locked || drained === 0}
          className="text-xs text-amber-300/70 underline disabled:opacity-40"
        >
          Refill and try again
        </button>
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-xs text-amber-300/70">
          <Wrench className="w-3.5 h-3.5" />
          Tip: the bottom number names the slice size — it doesn't change.
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
          Lock readout <ArrowRight className="w-4 h-4" />
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
