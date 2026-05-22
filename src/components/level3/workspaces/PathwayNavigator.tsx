import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Wrench } from "lucide-react";
import type { L3CaseDef } from "@/lib/level3/types";
import { useNarrate } from "@/lib/narrate";
import { NumberLine } from "../visuals/NumberLine";
import { ReplayInstructionsButton } from "../../level2/ReplayInstructionsButton";

/** Mission 1 — Pathway Navigator workspace (number lines). */
export function PathwayNavigator({
  caseDef,
  onRepairComplete,
  onAttempt,
}: {
  caseDef: L3CaseDef;
  onRepairComplete: (label: string) => void;
  onAttempt: () => void;
}) {
  if (caseDef.l3.mission !== 1) return null;
  const spec = caseDef.l3.spec;
  const target = spec.target.n / spec.target.d;
  const [pos, setPos] = useState(spec.zedDropAt);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);

  const tolerance = 1 / (spec.ticks * spec.max) / 2; // half a sub-tick
  const onLand = pos / spec.max;
  void onLand;

  const tryLock = () => {
    onAttempt();
    if (Math.abs(pos - target) <= tolerance) {
      setLocked(true);
      setFeedback("Perfect — checkpoint locked!");
      setTimeout(
        () => onRepairComplete(`${spec.target.n}/${spec.target.d} on the ${spec.theme}`),
        700,
      );
    } else {
      setFeedback(
        pos < target
          ? "Closer than ZED — but a little too soon. Slide right."
          : "Closer than ZED — but a little past it. Slide left.",
      );
    }
  };

  const narration = `Repair the navigation. Drag the cart to where ${spec.target.n} over ${spec.target.d} really belongs on the path between 0 and ${spec.max}.`;
  useNarrate(narration, [caseDef.id]);

  return (
    <div className="flex flex-col gap-5">
      <header className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="label-eyebrow text-cyan-300/80">Phase · Repair pathway</p>
          <h3 className="text-2xl font-bold text-cyan-50 mt-1">
            Drag the cart to {spec.target.n}/{spec.target.d}.
          </h3>
        </div>
        <ReplayInstructionsButton text={narration} />
      </header>

      <div className="py-4">
        <NumberLine
          spec={spec}
          value={pos}
          onChange={(v) => !locked && setPos(v)}
          ghostAt={spec.zedDropAt}
        />
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-xs text-cyan-300/70">
          <Wrench className="w-3.5 h-3.5" />
          Tip: cut the path into {spec.target.d} equal steps, count {spec.target.n}.
        </div>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={tryLock}
          disabled={locked}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold disabled:opacity-40"
          style={{
            background: "linear-gradient(135deg, #ffe98a, #f5c84a)",
            color: "#04162e",
            boxShadow: "0 0 20px rgba(255,233,138,0.4)",
          }}
        >
          Lock checkpoint <ArrowRight className="w-4 h-4" />
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
