import { useState } from "react";
import type { L6CaseDef } from "@/lib/level6/types";
import { useNarrate } from "@/lib/narrate";
import { MixedNumberCrate } from "../visuals/MixedNumberCrate";
import {
  WorkspaceHeader,
  NumberDial,
  LockButton,
  Feedback,
  HintLine,
} from "@/components/level5/workspaces/shared";

/** Mission 2 — Mixed Number Mechanics. Repair: set whole + n/d of the result. */
export function MixedNumberAssembler({
  caseDef,
  onRepairComplete,
  onAttempt,
}: {
  caseDef: L6CaseDef;
  onRepairComplete: (label: string) => void;
  onAttempt: () => void;
}) {
  if (caseDef.l6.mission !== 2) return null;
  const spec = caseDef.l6.spec;

  const [whole, setWhole] = useState(0);
  const [n, setN] = useState(0);
  const [d, setD] = useState(Math.max(spec.a.d, spec.b.d));
  const [locked, setLocked] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const narration = `Combine the cargo crates. First match the fraction units. Then regroup any complete crates from the leftover pieces.`;
  useNarrate(narration, [caseDef.id]);

  const tryLock = () => {
    onAttempt();
    if (d !== spec.truth.d) {
      setFeedback(`Match the fraction unit first — common denominator should be ${spec.truth.d}.`);
      return;
    }
    if (whole !== spec.truth.whole) {
      setFeedback(whole < spec.truth.whole ? "Don't forget to regroup full crates." : "Too many full crates.");
      return;
    }
    if (n !== spec.truth.n) {
      setFeedback("Adjust the remainder pieces to match.");
      return;
    }
    setLocked(true);
    setFeedback("Cargo transport stabilized!");
    setTimeout(
      () => onRepairComplete(`${spec.truth.whole} ${spec.truth.n}/${spec.truth.d} crates delivered`),
      700,
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <WorkspaceHeader
        eyebrow="Phase · Assemble the load"
        title={
          <>
            {spec.a.whole} {spec.a.n}/{spec.a.d} {spec.op === "add" ? "+" : "−"} {spec.b.whole} {spec.b.n}/{spec.b.d}
          </>
        }
        narration={narration}
      />

      <div className="flex flex-wrap items-center gap-4 justify-center">
        <MixedNumberCrate whole={spec.a.whole} n={spec.a.n} d={spec.a.d} label="Crate A" />
        <span className="text-2xl text-cyan-300" aria-hidden>{spec.op === "add" ? "+" : "−"}</span>
        <MixedNumberCrate whole={spec.b.whole} n={spec.b.n} d={spec.b.d} label="Crate B" />
      </div>

      <div className="rounded-2xl border p-4" style={{ borderColor: "color-mix(in oklab, #8db8ff 25%, transparent)", background: "rgba(141,184,255,0.05)" }}>
        <p className="label-eyebrow text-cyan-200 mb-3 text-center">Build the combined load</p>
        <div className="flex items-center justify-around gap-3 flex-wrap">
          <NumberDial label="Whole crates" value={whole} min={0} max={12} onChange={setWhole} disabled={locked} />
          <NumberDial label="Remainder n" value={n} min={0} max={20} onChange={setN} disabled={locked} />
          <NumberDial label="Remainder d" value={d} min={2} max={24} onChange={setD} disabled={locked} />
        </div>
        <div className="flex justify-center mt-4">
          <MixedNumberCrate whole={whole} n={n} d={d} label="Your load" />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <HintLine>Tip: convert remainders ≥ 1 whole into a new crate.</HintLine>
        <LockButton onClick={tryLock} disabled={locked} label="Lock cargo" />
      </div>

      {feedback && <Feedback message={feedback} ok={locked} />}
    </div>
  );
}
