import { Lightbulb, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

/**
 * Adaptive 3-step hint tray. Hints are pre-authored per case; this component
 * surfaces them progressively (1 → 2 → 3) as the child taps "Need a hint".
 */
export function HintTray({
  hints,
  onHintUsed,
}: {
  hints: [string, string, string];
  onHintUsed?: (level: number) => void;
}) {
  const [level, setLevel] = useState(0); // 0 = none, 1..3 = revealed
  const showNext = () => {
    const next = Math.min(level + 1, 3);
    setLevel(next);
    onHintUsed?.(next);
  };
  const clear = () => setLevel(0);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={showNext}
          disabled={level >= 3}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
          style={{
            color: "#ffe98a",
            borderColor: "color-mix(in oklab, #ffe98a 40%, transparent)",
          }}
        >
          <Lightbulb className="w-3.5 h-3.5" />
          {level === 0 ? "Need a hint?" : level >= 3 ? "All hints shown" : `Show hint ${level + 1}`}
        </button>
        {level > 0 && (
          <button
            type="button"
            onClick={clear}
            aria-label="Hide hints"
            className="w-7 h-7 inline-flex items-center justify-center rounded-full hover:bg-white/10 text-cyan-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <AnimatePresence initial={false}>
        {Array.from({ length: level }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border px-3 py-2 text-sm text-cyan-50"
            style={{
              background:
                "color-mix(in oklab, #ffe98a 8%, transparent)",
              borderColor:
                "color-mix(in oklab, #ffe98a 30%, transparent)",
            }}
          >
            <span className="label-eyebrow text-amber-200 mr-2">Hint {i + 1}</span>
            {hints[i]}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
