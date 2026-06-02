import { useState } from "react";
import { useNarrate } from "@/lib/narrate";
import type { L5CaseDef } from "@/lib/level5/types";
import { EnergyCell } from "../visuals/EnergyCell";
import { WorkspaceHeader, NumberDial, LockButton, Feedback, HintLine } from "./shared";

/** Mission 4 — Energy Booster Network (fraction × whole). */
export function BoosterTrainLine({
  caseDef,
  onRepairComplete,
  onAttempt,
}: {
  caseDef: L5CaseDef;
  onRepairComplete: (label: string) => void;
  onAttempt: () => void;
}) {
  if (caseDef.l5.mission !== 4) return null;
  const spec = caseDef.l5.spec;

  const [count, setCount] = useState(0);
  const [locked, setLocked] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const totalN = count * spec.frac.n;
  const narration = `Each booster delivers ${spec.frac.n}/${spec.frac.d}. Connect ${spec.whole} boosters to fill the train's power gauge.`;
  useNarrate(narration, [caseDef.id]);

  const tryLock = () => {
    onAttempt();
    if (count !== spec.whole) {
      setFeedback(count < spec.whole ? "Connect more boosters." : "Too many boosters — remove some.");
      return;
    }
    setLocked(true);
    setFeedback(`Transport online — total fuel = ${spec.truth.n}/${spec.truth.d}!`);
    setTimeout(
      () => onRepairComplete(`${spec.whole} × ${spec.frac.n}/${spec.frac.d} = ${spec.truth.n}/${spec.truth.d}`),
      700,
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <WorkspaceHeader
        eyebrow="Phase · Connect boosters"
        title={<>{spec.whole} × {spec.frac.n}/{spec.frac.d}</>}
        narration={narration}
      />

      <div className="flex flex-wrap items-center justify-center gap-2">
        {Array.from({ length: Math.max(count, 1) }).map((_, i) =>
          i < count ? (
            <EnergyCell key={i} total={spec.frac.d} filled={spec.frac.n} width={90} height={32} />
          ) : null,
        )}
        {count === 0 && <p className="text-sm text-cyan-200/70">No boosters connected yet.</p>}
      </div>

      <div className="flex items-center justify-around gap-3 flex-wrap">
        <NumberDial label="Boosters connected" value={count} min={0} max={Math.max(spec.whole, 6)} onChange={setCount} disabled={locked} />
        <div className="text-center">
          <span className="label-eyebrow text-cyan-200/80 block">Total fuel</span>
          <span className="font-mono text-xl text-cyan-50">{totalN}/{spec.frac.d}</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <HintLine>Tip: the bottom stays the same — only the top counts up.</HintLine>
        <LockButton onClick={tryLock} disabled={locked} label="Activate transport" />
      </div>

      {feedback && <Feedback message={feedback} ok={locked} />}
    </div>
  );
}
