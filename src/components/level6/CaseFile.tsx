import { FileSearch, Sparkles, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import type { L6CaseDef, L6Phase } from "@/lib/level6/types";
import { EnergyCell } from "../level5/visuals/EnergyCell";
import { HundredGrid } from "./visuals/HundredGrid";
import { MixedNumberCrate } from "./visuals/MixedNumberCrate";

/** Persistent LEFT pane for Level 6. */
export function L6CaseFile({
  caseDef,
  phase,
  repaired,
  childExplanation,
}: {
  caseDef: L6CaseDef;
  phase: L6Phase;
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
          "linear-gradient(180deg, rgba(8,20,52,0.92) 0%, rgba(20,18,68,0.85) 100%)",
        borderColor: "color-mix(in oklab, #8db8ff 32%, transparent)",
        boxShadow: "0 20px 60px -30px rgba(141,184,255,0.45)",
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(141,184,255,0.06) 0 1px, transparent 1px 6px)",
        }}
      />

      <header className="relative">
        <div className="flex items-center gap-2">
          <FileSearch className="w-4 h-4 text-cyan-200" />
          <span className="label-eyebrow text-cyan-200/90">{caseDef.caseNumber}</span>
        </div>
        <h2 className="mt-1 text-lg sm:text-xl font-bold text-cyan-50 leading-snug">
          Translation network desynchronized
        </h2>
      </header>

      <section className="relative">
        <p className="label-eyebrow text-cyan-200/80 mb-2 inline-flex items-center gap-1.5">
          <AlertTriangle className="w-3 h-3" /> ZED-4's reasoning
        </p>
        <div
          className="rounded-xl border px-3 py-2 text-sm text-cyan-50"
          style={{
            background: "rgba(141,184,255,0.08)",
            borderColor: "color-mix(in oklab, #8db8ff 28%, transparent)",
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
          <p className="label-eyebrow text-cyan-200/80 mb-1">Your reasoning</p>
          <blockquote
            className="rounded-xl border px-3 py-2 text-sm italic text-cyan-50"
            style={{
              background: "rgba(125,244,198,0.06)",
              borderColor: "color-mix(in oklab, #7df4c6 28%, transparent)",
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

function Evidence({ caseDef }: { caseDef: L6CaseDef }) {
  const l6 = caseDef.l6;
  if (l6.mission === 1) {
    const s = l6.spec;
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="text-sm font-mono text-cyan-100">
          {s.a.n}/{s.a.d} ÷ {s.b.n}/{s.b.d}
        </div>
        <EnergyCell total={s.a.d} filled={s.a.n} width={200} label="Energy supply" />
        <p className="text-xs text-cyan-200/70">How many {s.b.n}/{s.b.d} packets fit inside?</p>
        <ZedGuess label="ZED says" value={`${s.zedResult.n}/${s.zedResult.d}`} />
      </div>
    );
  }
  if (l6.mission === 2) {
    const s = l6.spec;
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="text-sm font-mono text-cyan-100">
          {s.a.whole} {s.a.n}/{s.a.d} {s.op === "add" ? "+" : "−"} {s.b.whole} {s.b.n}/{s.b.d}
        </div>
        <MixedNumberCrate whole={s.a.whole} n={s.a.n} d={s.a.d} label="Crate A" />
        <MixedNumberCrate whole={s.b.whole} n={s.b.n} d={s.b.d} label="Crate B" />
        <ZedGuess label="ZED says" value={`${s.zedResult.whole} ${s.zedResult.n}/${s.zedResult.d}`} />
      </div>
    );
  }
  if (l6.mission === 3) {
    const s = l6.spec;
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="text-sm font-mono text-cyan-100">
          {s.frac.n}/{s.frac.d} = ?
        </div>
        <EnergyCell total={s.frac.d} filled={s.frac.n} width={200} label={`${s.frac.n}/${s.frac.d}`} />
        <ZedGuess label="ZED says" value={`${s.zedDecimal}`} />
      </div>
    );
  }
  if (l6.mission === 4) {
    const s = l6.spec;
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="text-sm font-mono text-cyan-100">
          {s.frac.n}/{s.frac.d} = ? %
        </div>
        <EnergyCell total={s.frac.d} filled={s.frac.n} width={200} label={`${s.frac.n}/${s.frac.d}`} />
        <ZedGuess label="ZED says" value={`${s.zedPercent}%`} />
      </div>
    );
  }
  if (l6.mission === 5) {
    const s = l6.spec;
    return (
      <div className="flex flex-col items-center gap-2">
        <p className="text-xs text-cyan-200/80">Find the three forms of the same quantity.</p>
        <HundredGrid filled={s.truth.percent} size={150} label="Hidden quantity" />
        <p className="text-xs text-rose-300/80 italic">ZED says the digits should match.</p>
      </div>
    );
  }
  if (l6.mission === 6) {
    const s = l6.spec;
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="text-sm font-mono text-cyan-100">
          {s.step1.a.n}/{s.step1.a.d} + {s.step1.b.n}/{s.step1.b.d} → decimal → %
        </div>
        <EnergyCell total={s.step1.truth.d} filled={s.step1.truth.n} width={200} label="Combined supply" />
        <p className="text-xs text-cyan-200/70">Repair every system in the chain.</p>
      </div>
    );
  }
  // mission 7 — boss
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <p className="text-sm text-cyan-100/90">
        Every translation portal is dark. Repair all six systems in sequence to restart the Nexus.
      </p>
    </div>
  );
}
