import { useMemo, useState } from "react";
import type { L6CaseDef } from "@/lib/level6/types";
import { useNarrate } from "@/lib/narrate";
import { TranslationPortal } from "../visuals/TranslationPortal";
import { HundredGrid } from "../visuals/HundredGrid";
import {
  WorkspaceHeader,
  LockButton,
  Feedback,
  HintLine,
} from "@/components/level5/workspaces/shared";

type Card = { id: string; kind: "frac" | "dec" | "pct"; label: string; matchValue: number };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Mission 5 — Nexus Translator. Pick the 3 portals that share one quantity. */
export function NexusPortalLinker({
  caseDef,
  onRepairComplete,
  onAttempt,
}: {
  caseDef: L6CaseDef;
  onRepairComplete: (label: string) => void;
  onAttempt: () => void;
}) {
  if (caseDef.l6.mission !== 5) return null;
  const spec = caseDef.l6.spec;

  const cards = useMemo<Card[]>(() => {
    const all: { frac: { n: number; d: number }; decimal: number; percent: number }[] = [
      spec.truth,
      ...spec.decoys,
    ];
    const built: Card[] = [];
    all.forEach((q, idx) => {
      built.push({ id: `f-${idx}`, kind: "frac", label: `${q.frac.n}/${q.frac.d}`, matchValue: q.percent });
      built.push({ id: `d-${idx}`, kind: "dec", label: `${q.decimal}`, matchValue: q.percent });
      built.push({ id: `p-${idx}`, kind: "pct", label: `${q.percent}%`, matchValue: q.percent });
    });
    return shuffle(built);
  }, [caseDef.id]);

  const [selected, setSelected] = useState<string[]>([]);
  const [locked, setLocked] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const narration = `Three portals describe the same quantity. Pick one fraction, one decimal, and one percent that all match.`;
  useNarrate(narration, [caseDef.id]);

  const toggle = (id: string) => {
    if (locked) return;
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.length >= 3 ? s : [...s, id]));
  };

  const tryLock = () => {
    onAttempt();
    if (selected.length !== 3) {
      setFeedback("Select exactly three portals — one of each type.");
      return;
    }
    const picks = selected.map((id) => cards.find((c) => c.id === id)!);
    const kinds = new Set(picks.map((p) => p.kind));
    if (kinds.size !== 3) {
      setFeedback("Pick one fraction, one decimal, and one percent.");
      return;
    }
    const target = spec.truth.percent;
    if (!picks.every((p) => p.matchValue === target)) {
      setFeedback("These don't describe the same amount. Re-check the hundred grid.");
      return;
    }
    setLocked(true);
    setFeedback("Nexus portals connected!");
    setTimeout(
      () =>
        onRepairComplete(
          `${spec.truth.frac.n}/${spec.truth.frac.d} = ${spec.truth.decimal} = ${spec.truth.percent}%`,
        ),
      700,
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <WorkspaceHeader
        eyebrow="Phase · Translation portals"
        title="Connect the matching trio"
        narration={narration}
      />

      <div className="flex justify-center">
        <HundredGrid filled={spec.truth.percent} size={140} label="Target quantity" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        {cards.map((c) => (
          <TranslationPortal
            key={c.id}
            label={c.kind === "frac" ? "Fraction" : c.kind === "dec" ? "Decimal" : "Percent"}
            value={c.label}
            active={selected.includes(c.id)}
            linked={locked && selected.includes(c.id)}
            onClick={() => toggle(c.id)}
          />
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <HintLine>Tip: the same shaded quantity has one fraction, one decimal, one percent.</HintLine>
        <LockButton onClick={tryLock} disabled={locked} label="Link portals" />
      </div>

      {feedback && <Feedback message={feedback} ok={locked} />}
    </div>
  );
}
