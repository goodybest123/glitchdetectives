import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Layers } from "lucide-react";
import type { CaseDef, FractionPair, SortCard } from "@/lib/level2/types";
import { MISSION_3_CARDS } from "@/lib/level2/missions";

type Bucket = "unit" | "non-unit";

function truthBucket(c: SortCard): Bucket {
  return c.numerator === 1 ? "unit" : "non-unit";
}

/**
 * Mission 3 — Unit Fraction Scanner.
 * 6 cards pre-sorted by ZED-4 (incorrectly). Child taps a card to flip it
 * into the other chamber. When every card is in the correct bucket, the
 * sort is "repaired".
 */
export function UnitFractionSorter({
  caseDef,
  onRepairComplete,
  onAttempt,
}: {
  caseDef: CaseDef;
  onRepairComplete: (truth: FractionPair) => void;
  onAttempt: () => void;
}) {
  const cards = MISSION_3_CARDS;
  const [placement, setPlacement] = useState<Record<string, Bucket>>(() => {
    const init: Record<string, Bucket> = {};
    for (const c of cards) init[c.id] = c.zedBucket;
    return init;
  });

  const allCorrect = useMemo(
    () => cards.every((c) => placement[c.id] === truthBucket(c)),
    [cards, placement],
  );

  const flip = (id: string) => {
    onAttempt();
    setPlacement((p) => ({
      ...p,
      [id]: p[id] === "unit" ? "non-unit" : "unit",
    }));
  };

  const submit = () => {
    if (!allCorrect) return;
    onRepairComplete({ numerator: 1, denominator: 1 }); // placeholder; not shown for sort
  };

  return (
    <div className="flex flex-col gap-5">
      <header>
        <p className="label-eyebrow text-cyan-300/80">
          Classification chamber · Sort fractions
        </p>
        <h3 className="text-xl font-bold text-cyan-50 mt-1">
          Move each card into the correct chamber.
        </h3>
        <p className="text-sm text-cyan-100/80 mt-1">
          Tap a card to send it to the other chamber.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <Chamber
          name="UNIT"
          subtitle="Numerator is 1"
          cards={cards.filter((c) => placement[c.id] === "unit")}
          onFlip={flip}
          tone="mint"
          truthCheck={(c) => truthBucket(c) === "unit"}
        />
        <Chamber
          name="NON-UNIT"
          subtitle="Numerator > 1"
          cards={cards.filter((c) => placement[c.id] === "non-unit")}
          onFlip={flip}
          tone="amber"
          truthCheck={(c) => truthBucket(c) === "non-unit"}
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <div
          className="inline-flex items-center gap-2 text-xs text-cyan-100/80 rounded-full px-3 py-1.5 border"
          style={{
            background: "rgba(95,208,255,0.08)",
            borderColor: "color-mix(in oklab, #5fd0ff 28%, transparent)",
          }}
        >
          <Layers className="w-3.5 h-3.5" />
          {cards.filter((c) => placement[c.id] === truthBucket(c)).length} / {cards.length}{" "}
          sorted correctly
        </div>
        <button
          type="button"
          disabled={!allCorrect}
          onClick={submit}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition"
          style={{
            background: "linear-gradient(135deg, #7df4c6, #2fb789)",
            color: "#04162e",
            boxShadow: allCorrect ? "0 0 20px rgba(125,244,198,0.4)" : undefined,
          }}
        >
          Confirm sort <CheckCircle2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function Chamber({
  name,
  subtitle,
  cards,
  onFlip,
  tone,
  truthCheck,
}: {
  name: string;
  subtitle: string;
  cards: SortCard[];
  onFlip: (id: string) => void;
  tone: "mint" | "amber";
  truthCheck: (c: SortCard) => boolean;
}) {
  const accent = tone === "mint" ? "#7df4c6" : "#ffe98a";
  return (
    <div
      className="rounded-2xl border p-3 min-h-[220px]"
      style={{
        background: "rgba(6,16,38,0.55)",
        borderColor: `color-mix(in oklab, ${accent} 35%, transparent)`,
        boxShadow: `inset 0 0 24px color-mix(in oklab, ${accent} 12%, transparent)`,
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="font-mono font-bold text-sm" style={{ color: accent }}>
            {name}
          </p>
          <p className="text-xs text-cyan-200/70">{subtitle}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {cards.map((c) => {
            const ok = truthCheck(c);
            return (
              <motion.button
                key={c.id}
                layout
                type="button"
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.85, opacity: 0 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => onFlip(c.id)}
                className="rounded-xl border px-3 py-2 font-mono font-bold text-lg flex items-center gap-1"
                style={{
                  background: ok
                    ? `color-mix(in oklab, ${accent} 18%, rgba(6,16,38,0.6))`
                    : "rgba(95,208,255,0.08)",
                  borderColor: ok
                    ? accent
                    : "color-mix(in oklab, #5fd0ff 35%, transparent)",
                  color: "#e6faff",
                  minHeight: 44,
                  minWidth: 64,
                }}
                aria-label={`${c.numerator} over ${c.denominator}, currently in ${name} chamber. Tap to move.`}
              >
                {c.numerator}/{c.denominator}
                {ok && (
                  <CheckCircle2 className="w-3.5 h-3.5" style={{ color: accent }} />
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>
        {cards.length === 0 && (
          <p className="text-xs text-cyan-200/50 italic">Empty chamber</p>
        )}
      </div>
    </div>
  );
}
