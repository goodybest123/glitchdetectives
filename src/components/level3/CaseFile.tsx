import { FileSearch, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import type { L3CaseDef, L3Phase } from "@/lib/level3/types";
import { NumberLineMini } from "./visuals/NumberLine";
import { ObjectMeter } from "./visuals/ObjectMeter";
import { EquivalenceChamber } from "./visuals/EquivalenceChamber";
import { FractionNotation } from "../level2/fractions/FractionNotation";

/**
 * Persistent LEFT pane for Level 3. The original glitch (ZED's wrong
 * reasoning + visual evidence) stays visible at all times so children
 * can compare their repair to the original mistake.
 */
export function L3CaseFile({
  caseDef,
  phase,
  repaired,
  childExplanation,
}: {
  caseDef: L3CaseDef;
  phase: L3Phase;
  /** Display string describing the repair (e.g. "1/2 on the bridge"). */
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
          "linear-gradient(180deg, rgba(6,16,38,0.92) 0%, rgba(10,28,60,0.85) 100%)",
        borderColor: "color-mix(in oklab, #5fd0ff 30%, transparent)",
        boxShadow: "0 20px 60px -30px rgba(95,208,255,0.35)",
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(95,208,255,0.05) 0 1px, transparent 1px 4px)",
        }}
      />

      <header className="relative">
        <div className="flex items-center gap-2">
          <FileSearch className="w-4 h-4 text-cyan-300" />
          <span className="label-eyebrow text-cyan-300/90">{caseDef.caseNumber}</span>
        </div>
        <h2 className="mt-1 text-lg sm:text-xl font-bold text-cyan-50 leading-snug">
          ZED's mapping
        </h2>
      </header>

      <section className="relative">
        <p className="label-eyebrow text-cyan-300/70 mb-2">ZED-4 says</p>
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

      <section className="relative flex flex-col items-center gap-4">
        <Evidence caseDef={caseDef} />
      </section>

      {showRepair && (
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <p className="label-eyebrow text-cyan-300/70 mb-2 inline-flex items-center gap-1.5">
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

function Evidence({ caseDef }: { caseDef: L3CaseDef }) {
  const l3 = caseDef.l3;
  if (l3.mission === 1) {
    return <NumberLineMini spec={l3.spec} ghostAt={l3.spec.zedDropAt} />;
  }
  if (l3.mission === 2) {
    return (
      <div className="flex items-center gap-3 flex-wrap justify-center">
        <EquivalenceChamber
          numerator={l3.spec.left.n}
          denominator={l3.spec.left.d}
          kind={l3.spec.left.visual}
          size={120}
          label="Reactor A"
        />
        <span className="text-cyan-300 text-xl font-mono">=?</span>
        <EquivalenceChamber
          numerator={l3.spec.zedNumerator}
          denominator={l3.spec.rightDenominator}
          kind={l3.spec.rightVisual}
          size={120}
          label="ZED's guess"
        />
      </div>
    );
  }
  if (l3.mission === 3) {
    return (
      <div className="flex items-end gap-4 justify-center">
        <ObjectMeter
          numerator={l3.spec.a.n}
          denominator={l3.spec.a.d}
          object={l3.spec.object}
          size={130}
          label="A"
        />
        <div
          className="font-mono text-3xl font-bold pb-10"
          style={{ color: "#ff8e8e" }}
          aria-label={`ZED says ${l3.spec.zedClaim}`}
        >
          {l3.spec.zedClaim}
        </div>
        <ObjectMeter
          numerator={l3.spec.b.n}
          denominator={l3.spec.b.d}
          object={l3.spec.object}
          size={130}
          label="B"
        />
      </div>
    );
  }
  // mission 4
  return (
    <div className="flex items-center gap-4 flex-wrap justify-center">
      <div className="text-4xl">{wholeEmoji(l3.spec.object).repeat(l3.spec.whole)}</div>
      <span className="text-cyan-300/70 text-xl">→</span>
      <FractionNotation
        numerator={l3.spec.zedClaim.n}
        denominator={l3.spec.zedClaim.d}
        corruptedField="both"
        state="corrupted"
        size="md"
      />
    </div>
  );
}

function wholeEmoji(obj: string) {
  if (obj === "pizza") return "🍕";
  if (obj === "battery") return "🔋";
  if (obj === "snackpack") return "🍱";
  return "🎁";
}
