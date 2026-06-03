import { useState } from "react";
import type { L6CaseDef } from "@/lib/level6/types";
import { useNarrate } from "@/lib/narrate";
import { EnergyCell } from "@/components/level5/visuals/EnergyCell";
import { HundredGrid } from "../visuals/HundredGrid";
import {
  WorkspaceHeader,
  NumberDial,
  LockButton,
  Feedback,
  HintLine,
} from "@/components/level5/workspaces/shared";

/** Mission 6 — Multi-System Operations Lab. Three locked steps. */
export function MultiSystemLab({
  caseDef,
  onRepairComplete,
  onAttempt,
}: {
  caseDef: L6CaseDef;
  onRepairComplete: (label: string) => void;
  onAttempt: () => void;
}) {
  if (caseDef.l6.mission !== 6) return null;
  const spec = caseDef.l6.spec;

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [sumN, setSumN] = useState(0);
  const [sumD, setSumD] = useState(spec.step1.truth.d);
  const [decimalFilled, setDecimalFilled] = useState(0);
  const [percent, setPercent] = useState(0);
  const [locked, setLocked] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const narration = `Three connected systems. Step one: combine the fractions. Step two: convert to a decimal. Step three: convert to a percent.`;
  useNarrate(narration, [caseDef.id]);

  const truthDecimalFilled = Math.round(spec.step2.truthDecimal * 100);

  const tryStep = () => {
    onAttempt();
    if (step === 1) {
      if (sumD !== spec.step1.truth.d || sumN !== spec.step1.truth.n) {
        setFeedback(`Step 1 mismatch — the sum should be ${spec.step1.truth.n}/${spec.step1.truth.d}.`);
        return;
      }
      setFeedback("Step 1 locked. Translate to a decimal.");
      setStep(2);
      return;
    }
    if (step === 2) {
      if (decimalFilled !== truthDecimalFilled) {
        setFeedback("Step 2 mismatch — shade the hundred grid to match the sum.");
        return;
      }
      setFeedback("Step 2 locked. Translate to a percent.");
      setStep(3);
      return;
    }
    if (percent !== spec.step3.truthPercent) {
      setFeedback("Step 3 mismatch — set the percent gauge.");
      return;
    }
    setLocked(true);
    setFeedback("All three systems online!");
    setTimeout(
      () =>
        onRepairComplete(
          `${spec.step1.truth.n}/${spec.step1.truth.d} = ${spec.step2.truthDecimal} = ${spec.step3.truthPercent}%`,
        ),
      700,
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <WorkspaceHeader
        eyebrow={`Phase · Step ${step} of 3`}
        title={
          step === 1
            ? <>Add {spec.step1.a.n}/{spec.step1.a.d} + {spec.step1.b.n}/{spec.step1.b.d}</>
            : step === 2
            ? <>Translate the sum into a decimal</>
            : <>Translate the decimal into a percent</>
        }
        narration={narration}
      />

      {step === 1 && (
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <EnergyCell total={spec.step1.a.d} filled={spec.step1.a.n} width={140} label={`${spec.step1.a.n}/${spec.step1.a.d}`} />
            <span className="text-2xl text-cyan-300" aria-hidden>+</span>
            <EnergyCell total={spec.step1.b.d} filled={spec.step1.b.n} width={140} label={`${spec.step1.b.n}/${spec.step1.b.d}`} />
          </div>
          <div className="flex justify-around gap-3 flex-wrap">
            <NumberDial label="Sum numerator" value={sumN} min={0} max={20} onChange={setSumN} />
            <NumberDial label="Sum denominator" value={sumD} min={2} max={20} onChange={setSumD} />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col items-center gap-3">
          <EnergyCell total={spec.step1.truth.d} filled={spec.step1.truth.n} width={200} label={`Sum = ${spec.step1.truth.n}/${spec.step1.truth.d}`} />
          <HundredGrid filled={decimalFilled} size={180} label={`0.${String(decimalFilled).padStart(2, "0")}`} />
          <NumberDial label="Squares shaded" value={decimalFilled} min={0} max={100} step={5} onChange={setDecimalFilled} />
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col items-center gap-3">
          <HundredGrid filled={percent} size={180} label={`${percent}%`} />
          <NumberDial label="Percent" value={percent} min={0} max={100} step={5} onChange={setPercent} />
        </div>
      )}

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <HintLine>Tip: every step describes the SAME quantity in a different language.</HintLine>
        <LockButton onClick={tryStep} disabled={locked} label={step === 3 ? "Activate all systems" : "Lock step"} />
      </div>

      {feedback && <Feedback message={feedback} ok={locked} />}
    </div>
  );
}
