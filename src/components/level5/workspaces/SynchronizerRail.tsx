import { useMemo, useState } from "react";
import { useNarrate } from "@/lib/narrate";
import type { L5CaseDef } from "@/lib/level5/types";
import { EnergyCell } from "../visuals/EnergyCell";
import { WorkspaceHeader, NumberDial, LockButton, Feedback, HintLine } from "./shared";

/** Mission 1 — Power Grid Synchronizer (add unlike). */
export function SynchronizerRail({
  caseDef,
  onRepairComplete,
  onAttempt,
}: {
  caseDef: L5CaseDef;
  onRepairComplete: (label: string) => void;
  onAttempt: () => void;
}) {
  if (caseDef.l5.mission !== 1) return null;
  const spec = caseDef.l5.spec;

  const [denom, setDenom] = useState(Math.max(spec.a.d, spec.b.d));
  const [n, setN] = useState(0);
  const [locked, setLocked] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const aEquiv = useMemo(() => (denom % spec.a.d === 0 ? (spec.a.n * denom) / spec.a.d : null), [denom, spec.a]);
  const bEquiv = useMemo(() => (denom % spec.b.d === 0 ? (spec.b.n * denom) / spec.b.d : null), [denom, spec.b]);

  const narration = `Synchronize the rails. Set the partition grid so both stations share the same unit. Then add the matched parts to charge the merged cell.`;
  useNarrate(narration, [caseDef.id]);

  const tryLock = () => {
    onAttempt();
    if (denom !== spec.lcd) {
      setFeedback(`Units still mismatched. Try a common partition like ${spec.lcd}.`);
      return;
    }
    if (n !== spec.truth.n) {
      setFeedback(n < spec.truth.n ? "Add more matched parts." : "Too many parts — remove some.");
      return;
    }
    setLocked(true);
    setFeedback("Rails synchronized — the city lights are stable!");
    setTimeout(() => onRepairComplete(`${spec.truth.n}/${spec.truth.d} charged across the grid`), 700);
  };

  return (
    <div className="flex flex-col gap-5">
      <WorkspaceHeader
        eyebrow="Phase · Synchronize rails"
        title={<>Combine {spec.a.n}/{spec.a.d} + {spec.b.n}/{spec.b.d}</>}
        narration={narration}
      />

      <div className="flex items-center gap-4 flex-wrap justify-center">
        <EnergyCell total={spec.a.d} filled={spec.a.n} width={150} label={`Station A · ${spec.a.n}/${spec.a.d}`} />
        <span className="text-3xl text-cyan-300" aria-hidden>+</span>
        <EnergyCell total={spec.b.d} filled={spec.b.n} width={150} label={`Station B · ${spec.b.n}/${spec.b.d}`} />
      </div>

      <div className="rounded-2xl border p-4" style={{ borderColor: "color-mix(in oklab, #5fd0ff 25%, transparent)", background: "rgba(95,208,255,0.04)" }}>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <NumberDial label="Common partition" value={denom} min={2} max={24} onChange={setDenom} disabled={locked} />
          <div className="text-xs text-cyan-200/80 font-mono">
            {aEquiv != null ? `${spec.a.n}/${spec.a.d} = ${aEquiv}/${denom}` : `${spec.a.n}/${spec.a.d} doesn't fit`}<br />
            {bEquiv != null ? `${spec.b.n}/${spec.b.d} = ${bEquiv}/${denom}` : `${spec.b.n}/${spec.b.d} doesn't fit`}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 pt-1">
        <span className="label-eyebrow text-cyan-200">Merged power cell</span>
        <EnergyCell total={denom} filled={n} width={360} />
        <NumberDial label="Charged parts" value={n} min={0} max={denom} onChange={setN} disabled={locked} />
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <HintLine>Tip: pick a partition both denominators divide into evenly.</HintLine>
        <LockButton onClick={tryLock} disabled={locked} label="Lock synced total" />
      </div>

      {feedback && <Feedback message={feedback} ok={locked} />}
    </div>
  );
}
