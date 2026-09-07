/**
 * The big <, = or > sign shown between two models.
 *
 * Used by Level 04, where the child scans the comparison ZED-4 wrote and
 * taps the symbol when it looks wrong.
 */
import type { Operator } from "@/components/case04/cases";

type Props = {
  operator: Operator;
  /** Draw attention to the symbol during the detect/repair stages. */
  highlight?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  /** Bump to replay the pulse animation. */
  pulseKey?: number;
};

export function ComparatorSymbol({
  operator,
  highlight = false,
  clickable = false,
  onClick,
  pulseKey = 0,
}: Props) {
  const classes = [
    "flex h-20 w-20 items-center justify-center rounded-2xl border-2 text-4xl font-black transition-all",
    highlight ? "border-primary bg-secondary text-foreground" : "border-border bg-card text-foreground",
    clickable ? "cursor-pointer hover:scale-105 animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]" : "",
  ].join(" ");

  if (!clickable) {
    return (
      <div key={pulseKey} className={classes} aria-label={`Comparison symbol ${operator}`}>
        {operator}
      </div>
    );
  }

  return (
    <button
      key={pulseKey}
      type="button"
      onClick={onClick}
      className={classes}
      aria-label={`Comparison symbol ${operator}. Tap if it looks wrong.`}
    >
      {operator}
    </button>
  );
}
