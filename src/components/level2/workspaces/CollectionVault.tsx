import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Lock, PackageCheck } from "lucide-react";
import type { CaseDef, FractionPair } from "@/lib/level2/types";
import { NumberWheel, TapToCountVisual } from "./shared";
import { FractionNotation } from "../fractions/FractionNotation";

/**
 * Mission 4 — Fraction Collection Vault.
 * Detect: tap every glowing object to confirm the active count.
 * Repair: dial in numerator + denominator on two number wheels, then lock.
 */
export function CollectionVault({
  caseDef,
  onRepairComplete,
  onAttempt,
}: {
  caseDef: CaseDef;
  onRepairComplete: (truth: FractionPair) => void;
  onAttempt: () => void;
}) {
  const litIndices = useMemo(() => [...caseDef.visual.selected], [caseDef.visual]);
  const litCount = caseDef.visual.selected.length;
  const total = caseDef.visual.total;

  const [step, setStep] = useState<"detect" | "repair">("detect");
  const [tapped, setTapped] = useState(0);
  const [num, setNum] = useState(1);
  const [den, setDen] = useState(2);
  const [feedback, setFeedback] = useState<string | null>(null);

  const submit = () => {
    onAttempt();
    if (num === caseDef.truth.numerator && den === caseDef.truth.denominator) {
      setFeedback(null);
      setTimeout(() => onRepairComplete(caseDef.truth), 400);
    } else if (num !== caseDef.truth.numerator && den === caseDef.truth.denominator) {
      setFeedback("The total is right. Recount the glowing items.");
    } else if (num === caseDef.truth.numerator && den !== caseDef.truth.denominator) {
      setFeedback("The active count is right. Recount the whole set.");
    } else {
      setFeedback("Both numbers are off. Recount the active and the total.");
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <header>
        <p className="label-eyebrow text-cyan-300/80">
          {step === "detect" ? "Phase 1 · Inventory glowing items" : "Phase 2 · Lock in the fraction"}
        </p>
        <h3 className="text-xl font-bold text-cyan-50 mt-1">
          {step === "detect"
            ? "Tap each glowing item to inventory it."
            : "Dial the numerator (active) and denominator (total)."}
        </h3>
      </header>

      {step === "detect" ? (
        <>
          <div className="flex justify-center">
            <TapToCountVisual
              spec={caseDef.visual}
              countableIndices={litIndices}
              onCountChange={setTapped}
              ariaLabel="Tap every glowing object to inventory it."
            />
          </div>
          <div
            className="rounded-xl border px-3 py-2 text-sm text-cyan-100 inline-flex items-center gap-2 self-start"
            style={{
              background: "rgba(95,208,255,0.08)",
              borderColor: "color-mix(in oklab, #5fd0ff 28%, transparent)",
            }}
          >
            <PackageCheck className="w-4 h-4 text-cyan-300" />
            Active inventory: <span className="font-mono font-bold ml-1">{tapped}</span>{" "}
            · Vault total: <span className="font-mono font-bold ml-1">{total}</span>
          </div>
          <button
            type="button"
            disabled={tapped !== litCount}
            onClick={() => setStep("repair")}
            className="self-end inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition"
            style={{
              background: "linear-gradient(135deg, #ffe98a, #f5c84a)",
              color: "#04162e",
              boxShadow: tapped === litCount ? "0 0 20px rgba(255,233,138,0.4)" : undefined,
            }}
          >
            Begin repair <ArrowRight className="w-4 h-4" />
          </button>
        </>
      ) : (
        <>
          <div className="flex items-center justify-center">
            <FractionNotation
              numerator={num}
              denominator={den}
              corruptedField="both"
              state={
                num === caseDef.truth.numerator && den === caseDef.truth.denominator
                  ? "repaired"
                  : "corrupted"
              }
              size="lg"
            />
          </div>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <NumberWheel
              label="Numerator (active)"
              value={num}
              min={0}
              max={total}
              onChange={setNum}
            />
            <NumberWheel
              label="Denominator (total)"
              value={den}
              min={1}
              max={Math.max(total + 2, 12)}
              onChange={setDen}
            />
          </div>
          {feedback && (
            <motion.p
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-sm text-amber-200 self-start"
              role="status"
            >
              {feedback}
            </motion.p>
          )}
          <button
            type="button"
            onClick={submit}
            className="self-end inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition"
            style={{
              background: "linear-gradient(135deg, #7df4c6, #2fb789)",
              color: "#04162e",
              boxShadow: "0 0 20px rgba(125,244,198,0.35)",
            }}
          >
            Lock fraction <Lock className="w-4 h-4" />
          </button>
        </>
      )}
    </div>
  );
}
