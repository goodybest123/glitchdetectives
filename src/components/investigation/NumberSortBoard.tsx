/**
 * `NumberSortBoard` — "give each number a job".
 *
 * The child takes each number written on the fraction and places it into one
 * of two evidence areas: the equal parts that make the whole, or the parts we
 * are considering. It is the concrete, tappable version of the question this
 * whole level is about — *what is this number counting?* — and it is used in
 * the INVESTIGATE stage before any answer is asked for.
 *
 * Tapping is used instead of dragging so it works on a touch screen, with a
 * keyboard, and for a child who finds dragging hard.
 */
import { useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SpeakButton } from "@/components/case01/SpeakButton";
import type { EvidenceSortConfig, SortArea } from "./types";

type Props = {
  config: EvidenceSortConfig;
  /** Called the first time every number sits in the right area. */
  onSolved?: () => void;
};

export function NumberSortBoard({ config, onSolved }: Props) {
  /** value -> the area the child put it in. */
  const [placed, setPlaced] = useState<Record<string, SortArea>>({});
  const [picked, setPicked] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [solved, setSolved] = useState(false);

  const unplaced = config.items.filter((item) => !placed[item.value]);

  const place = (area: SortArea) => {
    if (!picked) {
      setMessage("Choose a number first, then choose where it belongs.");
      return;
    }
    const item = config.items.find((entry) => entry.value === picked);
    if (!item) return;
    if (item.area !== area) {
      setMessage(config.retry);
      return;
    }
    const next = { ...placed, [item.value]: area };
    setPlaced(next);
    setPicked(null);
    setMessage("");
    if (config.items.every((entry) => next[entry.value])) {
      setSolved(true);
      onSolved?.();
    }
  };

  const inArea = (area: SortArea) =>
    config.items.filter((item) => placed[item.value] === area);

  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="label-eyebrow text-muted-foreground">EVIDENCE AREAS</p>
          <h3 className="mt-1 text-base font-black text-foreground">{config.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{config.text}</p>
        </div>
        <SpeakButton
          text={`${config.title}. ${config.text}. ${config.wholeLabel}. ${config.partLabel}.`}
          size="md"
        />
      </div>

      <div className="mt-4 rounded-xl border border-dashed border-border bg-background p-3">
        <p className="text-xs font-black uppercase tracking-wider text-muted-foreground">
          THE NUMBERS
        </p>
        <div className="mt-2 flex flex-wrap gap-3">
          {unplaced.length === 0 && (
            <p className="text-sm font-bold text-success">Both numbers have a job now.</p>
          )}
          {unplaced.map((item) => (
            <Button
              key={item.value}
              type="button"
              variant={picked === item.value ? "default" : "outline"}
              onClick={() => {
                setPicked(item.value);
                setMessage("");
              }}
              className="h-14 w-14 text-2xl font-black"
              aria-pressed={picked === item.value}
              aria-label={`Number ${item.value}`}
            >
              {item.value}
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {(
          [
            { area: "whole" as SortArea, label: config.wholeLabel },
            { area: "part" as SortArea, label: config.partLabel },
          ]
        ).map((zone) => (
          <button
            key={zone.area}
            type="button"
            onClick={() => place(zone.area)}
            className="min-h-28 rounded-2xl border-2 border-dashed border-border bg-secondary p-3 text-left transition-colors hover:border-primary"
          >
            <span className="block text-xs font-black uppercase tracking-wider text-muted-foreground">
              {zone.area === "whole" ? "THE WHOLE" : "THE PART WE'RE LOOKING AT"}
            </span>
            <span className="mt-1 block text-sm font-bold text-foreground">{zone.label}</span>
            <span className="mt-3 flex gap-2">
              {inArea(zone.area).map((item) => (
                <span
                  key={item.value}
                  className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-2xl font-black text-primary-foreground"
                >
                  {item.value}
                </span>
              ))}
            </span>
          </button>
        ))}
      </div>

      <p className="mt-3 text-sm font-semibold text-foreground" aria-live="polite">
        {solved ? config.doneText : message}
      </p>

      {Object.keys(placed).length > 0 && !solved && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mt-2"
          onClick={() => {
            setPlaced({});
            setPicked(null);
            setMessage("");
          }}
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Start again
        </Button>
      )}

      {solved && (
        <p className="mt-1 flex items-center gap-2 text-sm font-black text-success">
          <Check className="h-4 w-4" aria-hidden /> Evidence placed.
        </p>
      )}
    </section>
  );
}
