import { useState } from "react";
import type { L6CaseDef } from "@/lib/level6/types";
import { useNarrate } from "@/lib/narrate";
import { HundredGrid } from "../visuals/HundredGrid";
import { EnergyCell } from "@/components/level5/visuals/EnergyCell";
import {
  WorkspaceHeader,
  NumberDial,
  LockButton,
  Feedback,
  HintLine,
} from "@/components/level5/workspaces/shared";

/** Mission 3 — Decimal Translator. Shade hundred grid until decimal matches. */
export function DecimalTranslator({
  caseDef,
  onRepairComplete,
  onAttempt,
}: {
  caseDef: L6CaseDef;
  onRepairComplete: (label: string) => void;
  onAttempt: () => void;
}) {
  if (caseDef.l6.mission !== 3) return null;
  const spec = caseDef.l6.spec;

  const truthFilled = Math.round(spec.truthDecimal * 100);
  const [filled, setFilled] = useState(0);
  const [locked, setLocked] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const narration = `Translate ${spec.frac.n}/${spec.frac.d} into a decimal. Shade the hundred grid until it equals the same quantity as the fraction.`;
  useNarrate(narration, [caseDef.id]);

  const tryLock = () => {
    onAttempt();
    if (filled !== truthFilled) {
      setFeedback(filled < truthFilled ? "Shade more squares." : "Too many shaded.");
      return;
    }
    setLocked(true);
    setFeedback(`Translation locked: ${spec.frac.n}/${spec.frac.d} = ${spec.truthDecimal}.`);
    setTimeout(
      () => onRepairComplete(`${spec.frac.n}/${spec.frac.d} = ${spec.truthDecimal} (${truthFilled}/100)`),
      800,
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <WorkspaceHeader
        eyebrow="Phase · Decimal translation"
        title={<>Convert {spec.frac.n}/{spec.frac.d} into a decimal</>}
        narration={narration}
      />

      <div className="flex flex-wrap items-center gap-6 justify-center">
        <EnergyCell total={spec.frac.d} filled={spec.frac.n} width={200} label={`${spec.frac.n}/${spec.frac.d}`} />
        <span className="text-3xl text-cyan-300" aria-hidden>=</span>
        <HundredGrid filled={filled} size={200} label="Hundred grid" />
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <NumberDial label="Squares shaded" value={filled} min={0} max={100} step={5} onChange={setFilled} disabled={locked} />
        <div className="font-mono text-xl text-cyan-50">
          0.{String(filled).padStart(2, "0")}
        </div>
        <LockButton onClick={tryLock} disabled={locked} label="Lock translation" />
      </div>

      <HintLine>Tip: think how many of every 100 the fraction would shade.</HintLine>
      {feedback && <Feedback message={feedback} ok={locked} />}
    </div>
  );
}
