import { useState } from "react";
import { motion } from "framer-motion";
import { Wrench, ArrowRight, CheckCircle2 } from "lucide-react";
import type { L4CaseDef, MixedStep } from "@/lib/level4/types";
import { useNarrate } from "@/lib/narrate";
import { FractionBar } from "../visuals/FractionBar";
import { themeAccent, ThemeBadge } from "../visuals/QuantityObject";
import { ReplayInstructionsButton } from "../../level2/ReplayInstructionsButton";

/** Mission 6 — Master Repair Station (multi-step). */
export function MasterRepairStation({
  caseDef,
  onRepairComplete,
  onAttempt,
}: {
  caseDef: L4CaseDef;
  onRepairComplete: (label: string) => void;
  onAttempt: () => void;
}) {
  if (caseDef.l4.mission !== 6) return null;
  const spec = caseDef.l4.spec;
  const [stepIdx, setStepIdx] = useState(0);
  const [results, setResults] = useState<Array<{ n: number; d: number } | null>>(
    spec.steps.map(() => null),
  );
  const [n, setN] = useState("");
  const [d, setD] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const accent = themeAccent(spec.theme);
  const allDone = results.every((r) => r != null);

  const narration = `${spec.description} Repair one step at a time. Type the correct top and bottom numbers for each step, then lock the final answer.`;
  useNarrate(narration, [caseDef.id]);

  const submit = () => {
    const step = spec.steps[stepIdx];
    const pn = parseInt(n, 10);
    const pd = parseInt(d, 10);
    if (!Number.isFinite(pn) || !Number.isFinite(pd)) {
      setFeedback("Type both the top and the bottom number.");
      return;
    }
    onAttempt();
    if (pn === step.truth.n && pd === step.truth.d) {
      const next = [...results];
      next[stepIdx] = { n: pn, d: pd };
      setResults(next);
      setFeedback(`Step ${stepIdx + 1} repaired!`);
      setN("");
      setD("");
      if (stepIdx + 1 < spec.steps.length) {
        setTimeout(() => {
          setStepIdx((i) => i + 1);
          setFeedback(null);
        }, 600);
      } else {
        setTimeout(
          () =>
            onRepairComplete(
              `Final answer: ${spec.finalTruth.n}/${spec.finalTruth.d}`,
            ),
          700,
        );
      }
    } else {
      setFeedback(stepHint(step));
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <header className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="label-eyebrow text-amber-300/80">Phase · Master repair pipeline</p>
          <h3 className="text-2xl font-bold text-amber-50 mt-1">
            Step {stepIdx + 1} of {spec.steps.length}
          </h3>
        </div>
        <ReplayInstructionsButton text={narration} />
      </header>

      <div className="flex flex-col gap-3">
        {spec.steps.map((st, i) => {
          const done = results[i] != null;
          const active = i === stepIdx;
          return (
            <div
              key={i}
              className="rounded-2xl border p-3 sm:p-4 transition"
              style={{
                background: active
                  ? "rgba(255,184,107,0.1)"
                  : done
                    ? "rgba(125,244,198,0.08)"
                    : "rgba(255,184,107,0.04)",
                borderColor: active
                  ? "color-mix(in oklab, #ffb86b 50%, transparent)"
                  : done
                    ? "color-mix(in oklab, #7df4c6 40%, transparent)"
                    : "color-mix(in oklab, #ffb86b 20%, transparent)",
                opacity: !active && !done ? 0.5 : 1,
              }}
            >
              <div className="flex items-center gap-2 flex-wrap">
                <span className="label-eyebrow text-amber-300/80">Step {i + 1}</span>
                <StepLine step={st} accent={accent} />
                {done && (
                  <span className="ml-auto inline-flex items-center gap-1 text-xs text-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    {results[i]!.n}/{results[i]!.d}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {!allDone && (
        <div className="flex flex-col items-center gap-3">
          <ThemeBadge theme={spec.theme} size={32} />
          <span className="label-eyebrow text-amber-200">
            Type the repaired result for step {stepIdx + 1}
          </span>
          <div className="flex items-center gap-2">
            <input
              value={n}
              onChange={(e) => setN(e.target.value.replace(/[^0-9]/g, ""))}
              inputMode="numeric"
              placeholder="top"
              className="w-20 px-3 py-2 rounded-xl font-mono text-xl text-center focus:outline-none focus:ring-2"
              style={{
                background: "rgba(255,184,107,0.08)",
                color: "#ffe6c6",
                border: "1px solid color-mix(in oklab, #ffb86b 40%, transparent)",
              }}
              aria-label="Numerator"
            />
            <span className="text-2xl text-amber-300 font-mono">/</span>
            <input
              value={d}
              onChange={(e) => setD(e.target.value.replace(/[^0-9]/g, ""))}
              inputMode="numeric"
              placeholder="bottom"
              className="w-20 px-3 py-2 rounded-xl font-mono text-xl text-center focus:outline-none focus:ring-2"
              style={{
                background: "rgba(255,184,107,0.08)",
                color: "#ffe6c6",
                border: "1px solid color-mix(in oklab, #ffb86b 40%, transparent)",
              }}
              aria-label="Denominator"
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={submit}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold ml-2"
              style={{
                background: "linear-gradient(135deg, #ffe98a, #f5c84a)",
                color: "#1c1408",
              }}
            >
              Lock <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 text-xs text-amber-300/70">
        <Wrench className="w-3.5 h-3.5" />
        Tip: keep the bottom the same when the pieces match, then simplify at the end.
      </div>

      {feedback && (
        <motion.p
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          className={`text-sm ${allDone ? "text-emerald-200" : "text-amber-200"}`}
          role="status"
        >
          {feedback}
        </motion.p>
      )}
    </div>
  );
}

function StepLine({ step, accent }: { step: MixedStep; accent: string }) {
  if (step.op === "simplify") {
    return (
      <div className="flex items-center gap-2 text-amber-100">
        <span className="font-mono text-sm">simplify</span>
        <FractionBar total={step.a.d} filled={step.a.n} width={120} height={28} accent={accent} />
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 text-amber-100 flex-wrap">
      <FractionBar total={step.a.d} filled={step.a.n} width={100} height={28} accent={accent} />
      <span className="text-xl text-amber-300" aria-hidden>{step.op}</span>
      <FractionBar total={step.b!.d} filled={step.b!.n} width={100} height={28} accent={accent} />
    </div>
  );
}

function stepHint(step: MixedStep): string {
  if (step.op === "simplify") {
    return `Try again — divide both top and bottom of ${step.a.n}/${step.a.d} by the same number.`;
  }
  return `Not quite — the bottom number names the size and stays at ${step.a.d}. Re-count the top.`;
}
