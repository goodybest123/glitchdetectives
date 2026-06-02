import { useState } from "react";
import { useNarrate } from "@/lib/narrate";
import type { L5CaseDef } from "@/lib/level5/types";
import { GridOverlay } from "../visuals/GridOverlay";
import { WorkspaceHeader, NumberDial, LockButton, Feedback, HintLine } from "./shared";

/** Mission 3 — Scaling Reactor (multiply fractions). */
export function ScalingReactorGrid({
  caseDef,
  onRepairComplete,
  onAttempt,
}: {
  caseDef: L5CaseDef;
  onRepairComplete: (label: string) => void;
  onAttempt: () => void;
}) {
  if (caseDef.l5.mission !== 3) return null;
  const spec = caseDef.l5.spec;
  const totalCells = spec.a.d * spec.b.d;
  const truthShaded = spec.a.n * spec.b.n;

  const [rowsFilled, setRowsFilled] = useState(0);
  const [colsFilled, setColsFilled] = useState(0);
  const [locked, setLocked] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const shaded = rowsFilled * colsFilled;

  const narration = `Stack one strip on top of the other. Shade ${spec.a.n} rows of ${spec.a.d}, then ${spec.b.n} columns of ${spec.b.d}. The overlap is the part of the part.`;
  useNarrate(narration, [caseDef.id]);

  const tryLock = () => {
    onAttempt();
    if (rowsFilled !== spec.a.n || colsFilled !== spec.b.n) {
      setFeedback("Match the row and column counts to the two fractions first.");
      return;
    }
    setLocked(true);
    setFeedback(`Reactor scaling restored — overlap = ${truthShaded}/${totalCells}!`);
    setTimeout(
      () => onRepairComplete(`${spec.a.n}/${spec.a.d} × ${spec.b.n}/${spec.b.d} = ${spec.truth.n}/${spec.truth.d}`),
      700,
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <WorkspaceHeader
        eyebrow="Phase · Scale reactor"
        title={<>{spec.a.n}/{spec.a.d} × {spec.b.n}/{spec.b.d}</>}
        narration={narration}
      />

      <div className="flex items-center justify-center">
        <GridOverlay rows={spec.a.d} cols={spec.b.d} rowsFilled={rowsFilled} colsFilled={colsFilled} cell={32} />
      </div>

      <div className="flex items-center justify-around gap-3 flex-wrap">
        <NumberDial label={`Rows of ${spec.a.d}`} value={rowsFilled} min={0} max={spec.a.d} onChange={setRowsFilled} disabled={locked} />
        <NumberDial label={`Cols of ${spec.b.d}`} value={colsFilled} min={0} max={spec.b.d} onChange={setColsFilled} disabled={locked} />
        <div className="text-center">
          <span className="label-eyebrow text-cyan-200/80 block">Overlap</span>
          <span className="font-mono text-xl text-cyan-50">{shaded}/{totalCells}</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <HintLine>Tip: total cells = bottom × bottom. Overlap = top × top.</HintLine>
        <LockButton onClick={tryLock} disabled={locked} label="Restart reactor" />
      </div>

      {feedback && <Feedback message={feedback} ok={locked} />}
    </div>
  );
}
