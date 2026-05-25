import { FileSearch, Sparkles, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import type { L4CaseDef, L4Phase } from "@/lib/level4/types";
import { OperationStrip } from "./visuals/OperationStrip";
import { FractionBar } from "./visuals/FractionBar";
import { ThemeBadge, themeAccent } from "./visuals/QuantityObject";

/**
 * Persistent LEFT pane for Level 4. Shows the broken calculation,
 * ZED's incorrect reasoning, the visual model, and a repair alert.
 * Stays mounted across phases so children can compare their repair
 * to the original glitch at all times.
 */
export function L4CaseFile({
  caseDef,
  phase,
  repaired,
  childExplanation,
}: {
  caseDef: L4CaseDef;
  phase: L4Phase;
  repaired?: string;
  childExplanation?: string;
}) {
  const showRepair =
    repaired && (phase === "explain" || phase === "feedback" || phase === "caseDone");
  return (
    <aside
      className="relative h-full rounded-3xl border overflow-hidden p-5 sm:p-6 flex flex-col gap-5"
      style={{
        background:
          "linear-gradient(180deg, rgba(28,16,8,0.92) 0%, rgba(40,22,8,0.85) 100%)",
        borderColor: "color-mix(in oklab, #ffb86b 30%, transparent)",
        boxShadow: "0 20px 60px -30px rgba(255,184,107,0.35)",
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,184,107,0.05) 0 1px, transparent 1px 4px)",
        }}
      />

      <header className="relative">
        <div className="flex items-center gap-2">
          <FileSearch className="w-4 h-4 text-amber-300" />
          <span className="label-eyebrow text-amber-300/90">{caseDef.caseNumber}</span>
        </div>
        <h2 className="mt-1 text-lg sm:text-xl font-bold text-amber-50 leading-snug">
          Broken arithmetic engine
        </h2>
      </header>

      <section className="relative">
        <p className="label-eyebrow text-amber-300/70 mb-2 inline-flex items-center gap-1.5">
          <AlertTriangle className="w-3 h-3" /> Repair alert
        </p>
        <div
          className="rounded-xl border px-3 py-2 text-sm text-amber-50"
          style={{
            background: "rgba(255,184,107,0.07)",
            borderColor: "color-mix(in oklab, #ffb86b 25%, transparent)",
          }}
        >
          "{caseDef.zedBriefing}"
        </div>
      </section>

      <section className="relative flex flex-col items-center gap-3">
        <Evidence caseDef={caseDef} />
      </section>

      {showRepair && (
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <p className="label-eyebrow text-emerald-200 mb-2 inline-flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" /> Your repair
          </p>
          <div
            className="rounded-xl border px-3 py-2 text-sm text-emerald-100 text-center"
            style={{
              background: "rgba(125,244,198,0.08)",
              borderColor: "color-mix(in oklab, #7df4c6 40%, transparent)",
            }}
          >
            {repaired}
          </div>
        </motion.section>
      )}

      {childExplanation && (phase === "feedback" || phase === "caseDone") && (
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <p className="label-eyebrow text-amber-300/70 mb-1">Your reasoning</p>
          <blockquote
            className="rounded-xl border px-3 py-2 text-sm italic text-amber-50"
            style={{
              background: "rgba(125,244,198,0.06)",
              borderColor: "color-mix(in oklab, #7df4c6 30%, transparent)",
            }}
          >
            "{childExplanation}"
          </blockquote>
        </motion.section>
      )}
    </aside>
  );
}

function Evidence({ caseDef }: { caseDef: L4CaseDef }) {
  const l4 = caseDef.l4;
  if (l4.mission === 1) {
    const s = l4.spec;
    return <OperationStrip a={s.a} b={s.b} op="+" zedResult={s.zedResult} theme={s.theme} />;
  }
  if (l4.mission === 2) {
    const s = l4.spec;
    return <OperationStrip a={s.a} b={s.b} op="-" zedResult={s.zedResult} theme={s.theme} />;
  }
  if (l4.mission === 3) {
    const s = l4.spec;
    return (
      <div className="flex flex-col items-center gap-2">
        <OperationStrip a={s.a} b={s.b} op={s.op} theme={s.theme} />
        <div className="text-xs text-amber-200/80">
          ZED wants to change the bottom to{" "}
          <span className="font-mono text-rose-300 font-bold">{s.zedDenominator}</span>
        </div>
      </div>
    );
  }
  if (l4.mission === 4) {
    const s = l4.spec;
    return (
      <div className="flex items-center gap-3 flex-wrap justify-center">
        <FractionBar
          total={s.source.d}
          filled={s.source.n}
          width={140}
          accent={themeAccent(s.theme)}
          label={`${s.source.n}/${s.source.d}`}
        />
        <span className="text-2xl font-bold text-amber-300 pb-5" aria-hidden>
          =?
        </span>
        <div className="flex flex-col items-center gap-1.5">
          <span className="label-eyebrow" style={{ color: "#ff8e8e" }}>
            ZED's guess
          </span>
          <div
            className="px-3 py-2 rounded-xl font-mono text-lg font-bold"
            style={{
              background: "rgba(255, 142, 142, 0.15)",
              border: "2px dashed #ff8e8e",
              color: "#ffd1d1",
            }}
          >
            {s.zedNumerator}/{s.targetDenominator}
          </div>
        </div>
        <ThemeBadge theme={s.theme} />
      </div>
    );
  }
  if (l4.mission === 5) {
    const s = l4.spec;
    return (
      <div className="flex items-center gap-3 flex-wrap justify-center">
        <FractionBar
          total={s.start.d}
          filled={s.start.n}
          width={160}
          accent={themeAccent(s.theme)}
          label={`${s.start.n}/${s.start.d}`}
        />
        <span className="text-2xl font-bold text-amber-300 pb-5" aria-hidden>
          →
        </span>
        <div className="flex flex-col items-center gap-1.5">
          <span className="label-eyebrow" style={{ color: "#ff8e8e" }}>
            ZED simplified to
          </span>
          <div
            className="px-3 py-2 rounded-xl font-mono text-lg font-bold"
            style={{
              background: "rgba(255, 142, 142, 0.15)",
              border: "2px dashed #ff8e8e",
              color: "#ffd1d1",
            }}
          >
            {s.zedResult.n}/{s.zedResult.d}
          </div>
        </div>
        <ThemeBadge theme={s.theme} />
      </div>
    );
  }
  // mission 6 — mixed
  const s = l4.spec;
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="label-eyebrow text-amber-300/80">{s.description}</p>
      {s.steps.map((st, i) => (
        <div key={i} className="flex items-center gap-2 text-xs font-mono text-amber-100">
          <span className="text-amber-300/70">Step {i + 1}:</span>
          {st.op === "simplify" ? (
            <>
              <span>simplify {st.a.n}/{st.a.d}</span>
              <span className="text-amber-300">→</span>
              <span className="text-rose-300">
                ZED: {st.zedResult.n}/{st.zedResult.d}
              </span>
            </>
          ) : (
            <>
              <span>
                {st.a.n}/{st.a.d} {st.op} {st.b?.n}/{st.b?.d}
              </span>
              <span className="text-amber-300">=</span>
              <span className="text-rose-300">
                ZED: {st.zedResult.n}/{st.zedResult.d}
              </span>
            </>
          )}
        </div>
      ))}
      <ThemeBadge theme={s.theme} />
    </div>
  );
}
