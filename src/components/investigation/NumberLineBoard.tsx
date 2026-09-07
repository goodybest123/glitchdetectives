/**
 * `NumberLineBoard` — a 0-to-1 line the child places fractions on.
 *
 * Area models are not the only way to see equivalence. When two fractions
 * land on the SAME point of the line, that is a second, independent piece of
 * evidence — which is exactly what Case 03.04 asks the child to produce.
 *
 * Nothing here is scored: a wrong tap simply says "not quite" and invites
 * another try.
 */
import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SpeakButton } from "@/components/case01/SpeakButton";
import type { NumberLineConfig } from "./types";

type Props = {
  config: NumberLineConfig;
  onSolved: () => void;
};

export function NumberLineBoard({ config, onSolved }: Props) {
  const [active, setActive] = useState<string | null>(config.marks[0]?.label ?? null);
  const [placed, setPlaced] = useState<Record<string, number>>({});
  const [missed, setMissed] = useState(false);

  const ticks = Array.from({ length: config.steps + 1 }, (_, i) => i);
  const allPlaced = config.marks.every((m) => placed[m.label] !== undefined);

  const place = (tick: number) => {
    const mark = config.marks.find((m) => m.label === active);
    if (!mark) return;
    const target = Math.round((mark.numerator / mark.denominator) * config.steps);
    if (tick !== target) {
      setMissed(true);
      return;
    }
    setMissed(false);
    const next = { ...placed, [mark.label]: tick };
    setPlaced(next);
    const remaining = config.marks.find((m) => next[m.label] === undefined);
    setActive(remaining?.label ?? null);
    if (!remaining) onSolved();
  };

  return (
    <section className="rounded-2xl border-2 border-dashed border-border bg-background p-4 sm:p-5">
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <p className="label-eyebrow text-muted-foreground">NUMBER LINE EVIDENCE</p>
          <h3 className="mt-1 text-base font-black text-foreground">{config.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{config.text}</p>
        </div>
        <SpeakButton text={`${config.title}. ${config.text}`} size="md" />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {config.marks.map((mark) => {
          const done = placed[mark.label] !== undefined;
          return (
            <Button
              key={mark.label}
              type="button"
              variant={active === mark.label ? "default" : done ? "secondary" : "outline"}
              onClick={() => setActive(mark.label)}
              disabled={done}
              className="min-h-11 font-black"
            >
              {done && <Check className="h-4 w-4" aria-hidden />} {mark.label}
            </Button>
          );
        })}
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-4">
        <div className="relative">
          <div className="h-1.5 w-full rounded bg-foreground" />
          <div className="mt-1 flex w-full justify-between">
            {ticks.map((tick) => {
              const here = config.marks.filter((m) => placed[m.label] === tick);
              return (
                <button
                  key={tick}
                  type="button"
                  onClick={() => place(tick)}
                  aria-label={`Place at ${tick} out of ${config.steps}`}
                  className="flex min-h-11 w-10 flex-col items-center gap-1 rounded-lg py-1 hover:bg-secondary"
                >
                  <span className="h-3 w-0.5 bg-foreground" aria-hidden />
                  <span className="text-[10px] font-bold text-muted-foreground">
                    {tick === 0 ? "0" : tick === config.steps ? "1" : ""}
                  </span>
                  {here.map((m) => (
                    <span
                      key={m.label}
                      className="rounded-full bg-success px-1.5 py-0.5 text-[10px] font-black text-background"
                    >
                      {m.label}
                    </span>
                  ))}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {allPlaced && (
        <p className="mt-4 rounded-xl border-2 border-success bg-card p-3 text-center text-base font-black text-foreground">
          Both fractions land on the SAME point.
        </p>
      )}

      <p className="mt-3 text-sm font-semibold text-foreground" aria-live="polite">
        {allPlaced ? config.doneText : missed ? config.retry : "Pick a fraction, then tap where it belongs."}
      </p>
    </section>
  );
}
