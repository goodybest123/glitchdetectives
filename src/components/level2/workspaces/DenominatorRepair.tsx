import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Grid3x3, Wrench } from "lucide-react";
import type { CaseDef, FractionPair } from "@/lib/level2/types";
import { useNarrate } from "@/lib/narrate";
import { NumberTilePicker, TapToCountVisual } from "./shared";
import { FractionNotation } from "../fractions/FractionNotation";
import { ReplayInstructionsButton } from "../ReplayInstructionsButton";

/**
 * Mission 2 — Denominator Repair Station.
 * Detect: tap every equal part (all cells) to count the whole.
 * Repair: choose the correct denominator tile.
 */
export function DenominatorRepair({
  caseDef,
  onRepairComplete,
  onAttempt,
}: {
  caseDef: CaseDef;
  onRepairComplete: (truth: FractionPair) => void;
  onAttempt: () => void;
}) {
  const total = caseDef.visual.total;
  const allIndices = useMemo(
    () => Array.from({ length: total }, (_, i) => i),
    [total],
  );
  const [step, setStep] = useState<"detect" | "repair">("detect");
  const [tapped, setTapped] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const detectReady = tapped === total;

  const submit = (n: number) => {
    setPick(n);
    onAttempt();
    if (n === caseDef.truth.denominator) {
      setFeedback(null);
      setTimeout(() => onRepairComplete(caseDef.truth), 350);
    } else {
      setFeedback(
        n < total
          ? "Too low — count every part of the whole, not just lit ones."
          : "Too high — recount the equal parts.",
      );
    }
  };

  const narration =
    step === "detect"
      ? "Phase 1. Inspect the whole. Tap every part, lit or dark, to map the whole."
      : "Phase 2. Repair denominator. Choose the correct denominator.";
  useNarrate(narration, [step, caseDef.id]);

  return (
    <div className="flex flex-col gap-5">
      <header>
        <p className="label-eyebrow text-cyan-300/80">
          {step === "detect" ? "Phase 1 · Inspect the whole" : "Phase 2 · Repair denominator"}
        </p>
        <h3 className="text-2xl font-bold text-cyan-50 mt-1">
          {step === "detect"
            ? "Tap EVERY part — lit or dark — to map the whole."
            : "Choose the correct denominator."}
        </h3>
      </header>

      {step === "detect" ? (
        <>
          <div className="flex justify-center">
            <TapToCountVisual
              spec={caseDef.visual}
              countableIndices={allIndices}
              onCountChange={setTapped}
              ariaLabel="Tap every equal part to count the whole."
            />
          </div>
          <div
            className="rounded-xl border px-3 py-2 text-sm text-cyan-100 inline-flex items-center gap-2 self-start"
            style={{
              background: "rgba(95,208,255,0.08)",
              borderColor: "color-mix(in oklab, #5fd0ff 28%, transparent)",
            }}
          >
            <Grid3x3 className="w-4 h-4 text-cyan-300" />
            Whole-part scan: <span className="font-mono font-bold ml-1">{tapped}</span> /{" "}
            {total}
          </div>
          <button
            type="button"
            disabled={!detectReady}
            onClick={() => setStep("repair")}
            className="self-end inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition"
            style={{
              background: "linear-gradient(135deg, #ffe98a, #f5c84a)",
              color: "#04162e",
              boxShadow: detectReady ? "0 0 20px rgba(255,233,138,0.4)" : undefined,
            }}
          >
            Begin repair <ArrowRight className="w-4 h-4" />
          </button>
        </>
      ) : (
        <>
          <div className="flex items-center justify-center">
            <FractionNotation
              numerator={caseDef.truth.numerator}
              denominator={pick ?? "?"}
              corruptedField="denominator"
              state={pick === caseDef.truth.denominator ? "repaired" : "corrupted"}
              size="lg"
            />
          </div>
          <NumberTilePicker
            label="Denominator candidates"
            max={Math.max(total, 8)}
            selected={pick}
            onPick={submit}
          />
          {feedback && (
            <motion.p
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-sm text-amber-200"
              role="status"
            >
              {feedback}
            </motion.p>
          )}
          <div className="flex items-center gap-2 text-xs text-cyan-300/70">
            <Wrench className="w-3.5 h-3.5" />
            Tip: the denominator counts ALL equal parts in the whole.
          </div>
        </>
      )}
    </div>
  );
}
