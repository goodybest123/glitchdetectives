/**
 * `PartsBoard` — the shared hands-on manipulative.
 *
 * One whole, cut into a number of equal parts, where some parts are being
 * considered (highlighted). The child taps parts to include or remove them.
 * Every case in Levels 02+ uses this same board so the interaction stays
 * predictable; only the shape, the number of parts and the goal change.
 */
import type { ModelShape } from "./types";
import cookieImg from "@/assets/level02/cookie.jpg";
import chocolateImg from "@/assets/level02/chocolate.jpg";
import wallImg from "@/assets/level02/wall.jpg";
import stripImg from "@/assets/level02/strip.jpg";

type Props = {
  shape: ModelShape;
  total: number;
  selected: number[];
  interactive?: boolean;
  onToggle?: (index: number) => void;
  unitLabel: string;
  /** Optional caption read by screen readers instead of the default. */
  label?: string;
  /** Extra reminder line under the board, e.g. what each number counts. */
  reminder?: string;
};

const SHAPE_CLASS: Record<ModelShape, string> = {
  tray: "rounded-full aspect-square",
  bar: "rounded-lg aspect-[3/2]",
  wall: "rounded-md aspect-[4/3]",
  strip: "rounded-md aspect-[1/2]",
};

/** Real photograph used for each part, so the model looks like the real thing. */
const SHAPE_IMAGE: Record<ModelShape, string> = {
  tray: cookieImg,
  bar: chocolateImg,
  wall: wallImg,
  strip: stripImg,
};

function columnsFor(shape: ModelShape, total: number) {
  if (shape === "tray") return Math.min(4, Math.max(2, Math.ceil(Math.sqrt(total))));
  if (shape === "wall") return Math.min(4, total);
  return total;
}

export function PartsBoard({
  shape,
  total,
  selected,
  interactive = false,
  onToggle,
  unitLabel,
  label,
  reminder,
}: Props) {
  const columns = columnsFor(shape, total);
  const isSelected = (index: number) => selected.includes(index);
  const photo = SHAPE_IMAGE[shape];

  return (
    <div
      className="rounded-2xl border-2 border-border bg-secondary/60 p-3 sm:p-4"
      role="group"
      aria-label={
        label ??
        `A whole cut into ${total} equal ${unitLabel} parts. ${selected.length} of them are chosen.`
      }
    >
      <div
        className="mx-auto grid w-full max-w-xl gap-2"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: total }, (_, index) => {
          const on = isSelected(index);
          const base = `${SHAPE_CLASS[shape]} relative w-full overflow-hidden border-2 bg-card transition-all`;
          const tone = on
            ? "border-primary ring-2 ring-primary"
            : "border-border opacity-60 grayscale";
          const inner = (
            <>
              <img
                src={photo}
                alt=""
                loading="lazy"
                width={512}
                height={512}
                className="h-full w-full object-cover"
              />
              {on && (
                <span
                  aria-hidden
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-black text-primary-foreground"
                >
                  ✓
                </span>
              )}
            </>
          );
          if (!interactive) {
            return (
              <div key={index} className={`${base} ${tone}`} aria-hidden>
                {inner}
              </div>
            );
          }
          return (
            <button
              key={index}
              type="button"
              onClick={() => onToggle?.(index)}
              aria-pressed={on}
              aria-label={`${unitLabel} ${index + 1} of ${total}${on ? ", chosen" : ""}`}
              className={`${base} ${tone} min-h-11 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
            >
              {inner}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-center text-xs font-bold text-muted-foreground" aria-live="polite">
        {total} equal parts in the whole · {selected.length} chosen
      </p>
      {reminder && (
        <p className="mt-1 text-center text-xs font-semibold text-muted-foreground">{reminder}</p>
      )}
    </div>
  );
}


/** Plain read-out of a fraction, used beside the board. */
export function FractionReadout({
  top,
  bottom,
  topLabel,
  bottomLabel,
}: {
  top: number;
  bottom: number;
  topLabel: string;
  bottomLabel: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
      <div className="text-center">
        <div className="text-3xl font-black leading-none text-foreground">{top}</div>
        <div className="my-1 h-0.5 w-8 bg-foreground" />
        <div className="text-3xl font-black leading-none text-foreground">{bottom}</div>
      </div>
      <div className="text-xs font-semibold text-muted-foreground">
        <p>
          <span className="font-black text-foreground">{top}</span> — {topLabel}
        </p>
        <p className="mt-1">
          <span className="font-black text-foreground">{bottom}</span> — {bottomLabel}
        </p>
      </div>
    </div>
  );
}
