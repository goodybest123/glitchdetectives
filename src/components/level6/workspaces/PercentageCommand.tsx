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

/** Mission 4 — Percentage Command Center. */
export function PercentageCommand({
  caseDef,
  onRepairComplete,
  onAttempt,
}: {
  caseDef: L6CaseDef;
  onRepairComplete: (label: string) => void;
  onAttempt: () => void;
}) {
  if (caseDef.l6.mission !== 4) return null;
  const spec = caseDef.l6.spec;

  const [percent, setPercent] = useState(0);
  const [locked, setLocked] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const narration = `Translate ${spec.frac.n}/${spec.frac.d} into a percent. 'Percent' means 'per hundred'. Slide the gauge until the visuals match.`;
  useNarrate(narration, [caseDef.id]);

  const tryLock = () => {
    onAttempt();
    if (percent !== spec.truthPercent) {
      setFeedback(percent < spec.truthPercent ? "Raise the gauge." : "Lower the gauge.");
      return;
    }
    setLocked(true);
    setFeedback("Command center reporting accurately!");
    setTimeout(
      () => onRepairComplete(`${spec.frac.n}/${spec.frac.d} = ${spec.truthPercent}%`),
      700,
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <WorkspaceHeader
        eyebrow="Phase · Performance gauge"
        title={<>Convert {spec.frac.n}/{spec.frac.d} into a percent</>}
        narration={narration}
      />

      <div className="flex flex-wrap items-center gap-6 justify-center">
        <EnergyCell total={spec.frac.d} filled={spec.frac.n} width={200} label={`${spec.frac.n}/${spec.frac.d}`} />
        <span className="text-3xl text-cyan-300" aria-hidden>=</span>
        <HundredGrid filled={percent} size={180} label={`${percent}%`} />
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <NumberDial label="Percent" value={percent} min={0} max={100} step={5} onChange={setPercent} disabled={locked} />
        <LockButton onClick={tryLock} disabled={locked} label="Lock report" />
      </div>

      <HintLine>Tip: 100% = the whole. How many of every 100 would the fraction shade?</HintLine>
      {feedback && <Feedback message={feedback} ok={locked} />}
    </div>
  );
}
