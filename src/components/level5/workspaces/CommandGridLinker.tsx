import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNarrate } from "@/lib/narrate";
import type { Frac, L5CaseDef } from "@/lib/level5/types";
import { EnergyCell } from "../visuals/EnergyCell";
import { WorkspaceHeader, LockButton, Feedback, HintLine } from "./shared";

type Choice = { id: string; frac: Frac; isTruth: boolean };

/** Mission 6 — Central Command Grid (fractions as division). */
export function CommandGridLinker({
  caseDef,
  onRepairComplete,
  onAttempt,
}: {
  caseDef: L5CaseDef;
  onRepairComplete: (label: string) => void;
  onAttempt: () => void;
}) {
  if (caseDef.l5.mission !== 6) return null;
  const spec = caseDef.l5.spec;

  const choices = useMemo<Choice[]>(() => {
    const all: Choice[] = [
      { id: "truth", frac: spec.frac, isTruth: true },
      ...spec.decoys.map((f, i) => ({ id: `decoy-${i}`, frac: f, isTruth: false })),
    ];
    // simple deterministic shuffle by id hash
    return all.sort((a, b) => a.id.localeCompare(b.id));
  }, [spec]);

  const [picked, setPicked] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const narration = `${spec.frac.n} resources shared equally between ${spec.frac.d} stations. Pick the division statement that matches the fraction.`;
  useNarrate(narration, [caseDef.id]);

  const tryLock = () => {
    onAttempt();
    if (!picked) {
      setFeedback("Pick a division pathway to connect to the fraction.");
      return;
    }
    const choice = choices.find((c) => c.id === picked);
    if (!choice?.isTruth) {
      setFeedback("That pathway doesn't match. Re-check what the bottom number represents.");
      return;
    }
    setLocked(true);
    setFeedback("Command pathways reconnected — the city is online!");
    setTimeout(
      () => onRepairComplete(`${spec.frac.n}/${spec.frac.d} = ${spec.frac.n} ÷ ${spec.frac.d}`),
      700,
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <WorkspaceHeader
        eyebrow="Phase · Reconnect pathways"
        title={<>Match {spec.frac.n}/{spec.frac.d} to its hidden division</>}
        narration={narration}
      />

      <div className="flex flex-col items-center gap-3">
        <EnergyCell total={spec.frac.d} filled={spec.frac.n} width={300} label={`${spec.frac.n}/${spec.frac.d} of the whole`} />
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {choices.map((c) => {
          const active = picked === c.id;
          return (
            <motion.button
              key={c.id}
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => !locked && setPicked(c.id)}
              disabled={locked}
              className="rounded-2xl border px-4 py-3 text-left transition disabled:opacity-50"
              style={{
                background: active ? "rgba(177,139,255,0.18)" : "rgba(95,208,255,0.06)",
                borderColor: active
                  ? "color-mix(in oklab, #b18bff 70%, transparent)"
                  : "color-mix(in oklab, #5fd0ff 30%, transparent)",
                boxShadow: active ? "0 0 18px rgba(177,139,255,0.35)" : undefined,
              }}
            >
              <p className="label-eyebrow text-cyan-200/80">Division pathway</p>
              <p className="font-mono text-xl text-cyan-50 mt-1">
                {c.frac.n} ÷ {c.frac.d}
              </p>
            </motion.button>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <HintLine>Tip: a/b literally means "a shared between b".</HintLine>
        <LockButton onClick={tryLock} disabled={locked} label="Power the tower" />
      </div>

      {feedback && <Feedback message={feedback} ok={locked} />}
    </div>
  );
}
