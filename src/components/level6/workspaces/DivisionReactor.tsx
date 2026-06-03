import { useState } from "react";
import type { L6CaseDef } from "@/lib/level6/types";
import { useNarrate } from "@/lib/narrate";
import { EnergyCell } from "@/components/level5/visuals/EnergyCell";
import {
  WorkspaceHeader,
  NumberDial,
  LockButton,
  Feedback,
  HintLine,
} from "@/components/level5/workspaces/shared";

/** Mission 1 — Fraction Division Reactor. */
export function DivisionReactor({
  caseDef,
  onRepairComplete,
  onAttempt,
}: {
  caseDef: L6CaseDef;
  onRepairComplete: (label: string) => void;
  onAttempt: () => void;
}) {
  if (caseDef.l6.mission !== 1) return null;
  const spec = caseDef.l6.spec;

  const [count, setCount] = useState(1);
  const [locked, setLocked] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const narration = `How many ${spec.b.n}/${spec.b.d} packets fit inside ${spec.a.n}/${spec.a.d}? Count the packets, then lock the answer.`;
  useNarrate(narration, [caseDef.id]);

  // Build a partition of the original supply at LCD = a.d*b.d (or just b.d aligned with a.d)
  const lcd = spec.a.d * spec.b.d;
  const packetSize = spec.a.d; // a 1/b.d packet shows as a.d slices when partition = lcd
  const totalCells = lcd;
  const supplyCells = (spec.a.n * lcd) / spec.a.d;

  const tryLock = () => {
    onAttempt();
    if (count !== spec.truth.n) {
      setFeedback(count < spec.truth.n ? "Keep counting — more packets fit." : "Too many. Recount the packets.");
      return;
    }
    setLocked(true);
    setFeedback("Reactor stabilized!");
    setTimeout(
      () => onRepairComplete(`${spec.a.n}/${spec.a.d} ÷ ${spec.b.n}/${spec.b.d} = ${spec.truth.n}`),
      700,
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <WorkspaceHeader
        eyebrow="Phase · Count the packets"
        title={<>How many {spec.b.n}/{spec.b.d} fit in {spec.a.n}/{spec.a.d}?</>}
        narration={narration}
      />

      <div className="flex flex-col items-center gap-3">
        <EnergyCell total={totalCells} filled={supplyCells} width={360} label="Reactor supply" />
        <p className="text-xs text-cyan-200/70">
          One packet of {spec.b.n}/{spec.b.d} = {packetSize} of these slices.
        </p>
        <div className="flex items-center gap-1.5 flex-wrap justify-center">
          {Array.from({ length: count }).map((_, i) => (
            <EnergyCell key={i} total={packetSize} filled={packetSize} width={80} height={28} />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <NumberDial label="Packet count" value={count} min={0} max={20} onChange={setCount} disabled={locked} />
        <LockButton onClick={tryLock} disabled={locked} label="Lock reactor" />
      </div>

      <HintLine>Tip: each packet fills part of the supply. Stop when they together equal {spec.a.n}/{spec.a.d}.</HintLine>
      {feedback && <Feedback message={feedback} ok={locked} />}
    </div>
  );
}
