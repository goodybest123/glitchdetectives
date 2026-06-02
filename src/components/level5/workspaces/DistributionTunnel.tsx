import { useState } from "react";
import { useNarrate } from "@/lib/narrate";
import type { L5CaseDef } from "@/lib/level5/types";
import { EnergyCell } from "../visuals/EnergyCell";
import { WorkspaceHeader, NumberDial, LockButton, Feedback, HintLine } from "./shared";

/** Mission 5 — Distribution Tunnel (divide). */
export function DistributionTunnel({
  caseDef,
  onRepairComplete,
  onAttempt,
}: {
  caseDef: L5CaseDef;
  onRepairComplete: (label: string) => void;
  onAttempt: () => void;
}) {
  if (caseDef.l5.mission !== 5) return null;
  const spec = caseDef.l5.spec;

  const [num, setNum] = useState(0);
  const [denom, setDenom] = useState(1);
  const [locked, setLocked] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const narration =
    spec.kind === "unitByWhole"
      ? `Take ${spec.unit.n}/${spec.unit.d} and split it into ${spec.divisor} equal sub-packets. Each share is smaller.`
      : `${spec.whole} full packets are being sliced into ${spec.unit.n}/${spec.unit.d} pieces. Count how many pieces in total.`;
  useNarrate(narration, [caseDef.id]);

  const tryLock = () => {
    onAttempt();
    if (num !== spec.truth.n || denom !== spec.truth.d) {
      setFeedback("Not matching the share yet — adjust the dials.");
      return;
    }
    setLocked(true);
    setFeedback("Distribution restored — supplies flowing!");
    const op =
      spec.kind === "unitByWhole"
        ? `${spec.unit.n}/${spec.unit.d} ÷ ${spec.divisor}`
        : `${spec.whole} ÷ ${spec.unit.n}/${spec.unit.d}`;
    setTimeout(
      () => onRepairComplete(`${op} = ${spec.truth.n}/${spec.truth.d}`),
      700,
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <WorkspaceHeader
        eyebrow="Phase · Divide & distribute"
        title={
          spec.kind === "unitByWhole" ? (
            <>{spec.unit.n}/{spec.unit.d} ÷ {spec.divisor}</>
          ) : (
            <>{spec.whole} ÷ {spec.unit.n}/{spec.unit.d}</>
          )
        }
        narration={narration}
      />

      <div className="flex items-center justify-center gap-3 flex-wrap">
        {spec.kind === "unitByWhole" ? (
          <EnergyCell total={spec.unit.d} filled={spec.unit.n} width={220} label="Starting packet" />
        ) : (
          <div className="flex gap-2">
            {Array.from({ length: spec.whole }).map((_, i) => (
              <EnergyCell key={i} total={1} filled={1} width={90} height={32} />
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-around gap-3 flex-wrap">
        <NumberDial label="Top of share" value={num} min={0} max={24} onChange={setNum} disabled={locked} />
        <NumberDial label="Bottom of share" value={denom} min={1} max={24} onChange={setDenom} disabled={locked} />
        <div className="text-center">
          <span className="label-eyebrow text-cyan-200/80 block">Your share</span>
          <span className="font-mono text-xl text-cyan-50">{num}/{denom}</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <HintLine>
          {spec.kind === "unitByWhole"
            ? "Tip: splitting a tiny piece makes it even tinier — multiply the bottom."
            : "Tip: count how many tiny pieces fit inside each whole."}
        </HintLine>
        <LockButton onClick={tryLock} disabled={locked} label="Open tunnel" />
      </div>

      {feedback && <Feedback message={feedback} ok={locked} />}
    </div>
  );
}
