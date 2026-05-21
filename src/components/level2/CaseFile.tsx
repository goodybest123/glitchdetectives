import { AlertTriangle, FileSearch, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import type { CaseDef, CasePhase, FractionPair } from "@/lib/level2/types";
import { FractionVisual } from "./fractions/FractionVisual";
import { FractionNotation } from "./fractions/FractionNotation";

/**
 * The persistent LEFT pane. NEVER unmounts during a case. Re-renders only
 * when the case changes or when the repair becomes available (so we can
 * show original ↔ repaired side-by-side after repair).
 */
export function CaseFile({
  caseDef,
  phase,
  /** When repair is locked in, pass the truth to render the "repaired" badge. */
  repairedNotation,
  /** Child's recorded reasoning, shown after repair as evidence. */
  childExplanation,
}: {
  caseDef: CaseDef;
  phase: CasePhase;
  repairedNotation?: FractionPair;
  childExplanation?: string;
}) {
  const repaired = phase === "explain" || phase === "feedback" || phase === "caseDone";
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
      {/* Decorative scan lines */}
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
          {capitalize(caseDef.conceptKey)} corruption detected
        </h2>
      </header>

      {/* ZED-4 claim */}
      <section className="relative">
        <p className="label-eyebrow text-cyan-300/70 mb-2">ZED-4 Claim</p>
        <div
          className="rounded-xl border px-3 py-2 text-sm text-cyan-50"
          style={{
            background: "rgba(95,208,255,0.07)",
            borderColor: "color-mix(in oklab, #5fd0ff 25%, transparent)",
          }}
        >
          “This is{" "}
          <span className="font-mono font-bold text-cyan-200">
            {caseDef.zedClaim.numerator}/{caseDef.zedClaim.denominator}
          </span>
          .” — {caseDef.zedBriefing}
        </div>
      </section>

      {/* Visual + glitched notation side-by-side */}
      <section className="relative flex flex-col items-center gap-4">
        <div className="flex items-center gap-6 flex-wrap justify-center">
          <FractionVisual spec={caseDef.visual} size={200} emphasizeSelected />
          <FractionNotation
            numerator={caseDef.zedClaim.numerator}
            denominator={caseDef.zedClaim.denominator}
            corruptedField={
              caseDef.corruptedField === "set"
                ? "both"
                : caseDef.corruptedField === "sort"
                  ? "none"
                  : caseDef.corruptedField
            }
            state="corrupted"
            size="md"
          />
        </div>

        {/* System warning */}
        <div
          className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs"
          style={{
            background: "color-mix(in oklab, #ff8e8e 18%, transparent)",
            color: "#ffd6d6",
            border: "1px solid color-mix(in oklab, #ff8e8e 35%, transparent)",
          }}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>{caseDef.warning}</span>
        </div>
      </section>

      {/* Repaired comparison appears after repair, never replacing the original */}
      {repaired && repairedNotation && caseDef.corruptedField !== "sort" && (
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <p className="label-eyebrow text-cyan-300/70 mb-2 inline-flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" /> Repaired
          </p>
          <div className="flex items-center justify-center gap-4">
            <span className="text-xs text-cyan-200/70 font-mono uppercase tracking-wider">
              Before
            </span>
            <FractionNotation
              numerator={caseDef.zedClaim.numerator}
              denominator={caseDef.zedClaim.denominator}
              corruptedField="none"
              state="corrupted"
              size="sm"
            />
            <span className="text-cyan-300/70">→</span>
            <FractionNotation
              numerator={repairedNotation.numerator}
              denominator={repairedNotation.denominator}
              state="repaired"
              corruptedField="none"
              size="sm"
            />
            <span className="text-xs text-emerald-200/80 font-mono uppercase tracking-wider">
              After
            </span>
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
              borderColor:
                "color-mix(in oklab, #7df4c6 30%, transparent)",
            }}
          >
            “{childExplanation}”
          </blockquote>
        </motion.section>
      )}
    </aside>
  );
}

function capitalize(c: string) {
  if (c === "unit-fraction") return "Unit-fraction";
  if (c === "fraction-of-set") return "Set-fraction";
  return c.charAt(0).toUpperCase() + c.slice(1);
}
