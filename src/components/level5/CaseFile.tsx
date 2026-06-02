import { FileSearch, Sparkles, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import type { L5CaseDef, L5Phase } from "@/lib/level5/types";
import { EnergyCell } from "./visuals/EnergyCell";
import { GridOverlay } from "./visuals/GridOverlay";

/** Persistent LEFT pane for Level 5. */
export function L5CaseFile({
  caseDef,
  phase,
  repaired,
  childExplanation,
}: {
  caseDef: L5CaseDef;
  phase: L5Phase;
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
          "linear-gradient(180deg, rgba(8,20,42,0.92) 0%, rgba(12,28,58,0.85) 100%)",
        borderColor: "color-mix(in oklab, #5fd0ff 30%, transparent)",
        boxShadow: "0 20px 60px -30px rgba(95,208,255,0.4)",
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(95,208,255,0.06) 0 1px, transparent 1px 4px)",
        }}
      />

      <header className="relative">
        <div className="flex items-center gap-2">
          <FileSearch className="w-4 h-4 text-cyan-300" />
          <span className="label-eyebrow text-cyan-300/90">{caseDef.caseNumber}</span>
        </div>
        <h2 className="mt-1 text-lg sm:text-xl font-bold text-cyan-50 leading-snug">
          City system out of sync
        </h2>
      </header>

      <section className="relative">
        <p className="label-eyebrow text-cyan-300/70 mb-2 inline-flex items-center gap-1.5">
          <AlertTriangle className="w-3 h-3" /> ZED-4's reasoning
        </p>
        <div
          className="rounded-xl border px-3 py-2 text-sm text-cyan-50"
          style={{
            background: "rgba(95,208,255,0.07)",
            borderColor: "color-mix(in oklab, #5fd0ff 25%, transparent)",
          }}
        >
          "{caseDef.zedBriefing}"
        </div>
      </section>

      <section className="relative flex flex-col items-center gap-3">
        <Evidence caseDef={caseDef} />
      </section>

      {showRepair && (
        <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="relative">
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
        <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="relative">
          <p className="label-eyebrow text-cyan-300/70 mb-1">Your reasoning</p>
          <blockquote
            className="rounded-xl border px-3 py-2 text-sm italic text-cyan-50"
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

function ZedGuess({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="label-eyebrow" style={{ color: "#ff8e8e" }}>{label}</span>
      <div
        className="px-3 py-2 rounded-xl font-mono text-lg font-bold"
        style={{
          background: "rgba(255, 142, 142, 0.15)",
          border: "2px dashed #ff8e8e",
          color: "#ffd1d1",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function Evidence({ caseDef }: { caseDef: L5CaseDef }) {
  const l5 = caseDef.l5;
  if (l5.mission === 1) {
    const s = l5.spec;
    return (
      <div className="flex items-center gap-3 flex-wrap justify-center">
        <EnergyCell total={s.a.d} filled={s.a.n} width={120} label={`${s.a.n}/${s.a.d}`} />
        <span className="text-2xl text-cyan-300 pb-5" aria-hidden>+</span>
        <EnergyCell total={s.b.d} filled={s.b.n} width={120} label={`${s.b.n}/${s.b.d}`} />
        <span className="text-2xl text-cyan-300 pb-5" aria-hidden>=?</span>
        <ZedGuess label="ZED says" value={`${s.zedResult.n}/${s.zedResult.d}`} />
      </div>
    );
  }
  if (l5.mission === 2) {
    const s = l5.spec;
    return (
      <div className="flex items-center gap-3 flex-wrap justify-center">
        <EnergyCell total={s.a.d} filled={s.a.n} width={120} label={`${s.a.n}/${s.a.d}`} />
        <span className="text-2xl text-cyan-300 pb-5" aria-hidden>−</span>
        <EnergyCell total={s.b.d} filled={s.b.n} width={120} label={`${s.b.n}/${s.b.d}`} />
        <span className="text-2xl text-cyan-300 pb-5" aria-hidden>=?</span>
        <ZedGuess label="ZED says" value={`${s.zedResult.n}/${s.zedResult.d}`} />
      </div>
    );
  }
  if (l5.mission === 3) {
    const s = l5.spec;
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="text-sm font-mono text-cyan-100">
          {s.a.n}/{s.a.d} × {s.b.n}/{s.b.d}
        </div>
        <GridOverlay rows={s.a.d} cols={s.b.d} rowsFilled={s.a.n} colsFilled={s.b.n} cell={22} />
        <ZedGuess label="ZED says" value={`${s.zedResult.n}/${s.zedResult.d}`} />
      </div>
    );
  }
  if (l5.mission === 4) {
    const s = l5.spec;
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="text-sm font-mono text-cyan-100">
          {s.whole} × {s.frac.n}/{s.frac.d}
        </div>
        <div className="flex items-center gap-1.5 flex-wrap justify-center">
          {Array.from({ length: s.whole }).map((_, i) => (
            <EnergyCell key={i} total={s.frac.d} filled={s.frac.n} width={70} height={28} />
          ))}
        </div>
        <ZedGuess label="ZED says" value={`${s.zedResult.n}/${s.zedResult.d}`} />
      </div>
    );
  }
  if (l5.mission === 5) {
    const s = l5.spec;
    if (s.kind === "unitByWhole") {
      return (
        <div className="flex flex-col items-center gap-2">
          <div className="text-sm font-mono text-cyan-100">
            {s.unit.n}/{s.unit.d} ÷ {s.divisor}
          </div>
          <EnergyCell total={s.unit.d} filled={s.unit.n} width={180} label="Starting packet" />
          <ZedGuess label="ZED says" value={`${s.zedResult.n}/${s.zedResult.d}`} />
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="text-sm font-mono text-cyan-100">
          {s.whole} ÷ {s.unit.n}/{s.unit.d}
        </div>
        <div className="flex gap-1.5">
          {Array.from({ length: s.whole }).map((_, i) => (
            <EnergyCell key={i} total={1} filled={1} width={80} height={28} />
          ))}
        </div>
        <p className="text-xs text-cyan-200/70">How many {s.unit.n}/{s.unit.d} packets fit?</p>
        <ZedGuess label="ZED says" value={`${s.zedResult.n}/${s.zedResult.d}`} />
      </div>
    );
  }
  // mission 6 — fractions as division
  const s = l5.spec;
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-3">
        <div
          className="px-4 py-2 rounded-xl font-mono text-2xl font-bold"
          style={{
            background: "rgba(95,208,255,0.15)",
            border: "1px solid color-mix(in oklab, #5fd0ff 50%, transparent)",
            color: "#cdf2ff",
          }}
        >
          {s.frac.n}/{s.frac.d}
        </div>
        <span className="text-cyan-300 text-xl">≟</span>
        <div
          className="px-4 py-2 rounded-xl font-mono text-xl"
          style={{
            background: "rgba(177,139,255,0.15)",
            border: "1px solid color-mix(in oklab, #b18bff 50%, transparent)",
            color: "#e2d4ff",
          }}
        >
          {s.frac.n} ÷ {s.frac.d}
        </div>
      </div>
      <EnergyCell total={s.frac.d} filled={s.frac.n} width={200} label="Whole split into equal shares" />
      <p className="text-xs text-rose-300/80 italic">ZED claims these are unrelated.</p>
    </div>
  );
}
