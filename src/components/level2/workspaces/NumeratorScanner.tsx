import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ScanLine, Wrench } from "lucide-react";
import type { CaseDef, FractionPair } from "@/lib/level2/types";
import { useNarrate } from "@/lib/narrate";
import { NumberTilePicker, TapToCountVisual } from "./shared";
import { FractionNotation } from "../fractions/FractionNotation";

/**
 * Mission 1 — Numerator Control Room workspace.
 * Detect: child taps each LIT part to register a numerator scan.
 * Repair: child picks the correct numerator tile.
 */
export function NumeratorScanner({
  caseDef,
  onRepairComplete,
  onAttempt,
}: {
  caseDef: CaseDef;
  onRepairComplete: (truth: FractionPair) => void;
  onAttempt: () => void;
}) {
  const litCount = caseDef.visual.selected.length;
  const litIndices = useMemo(() => [...caseDef.visual.selected], [caseDef.visual]);
  const [step, setStep] = useState<"detect" | "repair">("detect");
  const [tapped, setTapped] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const detectReady = tapped === litCount;

  const submit = (n: number) => {
    setPick(n);
    onAttempt();
    if (n === caseDef.truth.numerator) {
      setFeedback(null);
      setTimeout(() => onRepairComplete(caseDef.truth), 350);
    } else {
      setFeedback(
        n > litCount
          ? "Too high — only count the LIT parts."
          : "Not quite — recount the lit parts.",
      );
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <header>
        <p className="label-eyebrow text-cyan-300/80">
          {step === "detect" ? "Phase 1 · Scan selected parts" : "Phase 2 · Repair numerator"}
        </p>
        <h3 className="text-xl font-bold text-cyan-50 mt-1">
          {step === "detect"
            ? "Tap each LIT part to register a scan."
            : "Choose the correct numerator."}
        </h3>
      </header>

      {step === "detect" ? (
        <>
          <div className="flex justify-center">
            <TapToCountVisual
              spec={caseDef.visual}
              countableIndices={litIndices}
              onCountChange={setTapped}
              ariaLabel="Tap each lit part to count selected parts."
            />
          </div>
          <div
            className="rounded-xl border px-3 py-2 text-sm text-cyan-100 inline-flex items-center gap-2 self-start"
            style={{
              background: "rgba(95,208,255,0.08)",
              borderColor: "color-mix(in oklab, #5fd0ff 28%, transparent)",
            }}
          >
            <ScanLine className="w-4 h-4 text-cyan-300" />
            Selected scan count:{" "}
            <span className="font-mono font-bold ml-1">{tapped}</span>
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
          <div className="flex items-center justify-center gap-4">
            <FractionNotation
              numerator={pick ?? "?"}
              denominator={caseDef.truth.denominator}
              corruptedField="numerator"
              state={pick === caseDef.truth.numerator ? "repaired" : "corrupted"}
              size="lg"
            />
          </div>
          <NumberTilePicker
            label="Numerator candidates"
            max={Math.max(caseDef.truth.denominator, 6)}
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
            Tip: the numerator only counts the LIT parts in the case file.
          </div>
        </>
      )}
    </div>
  );
}
