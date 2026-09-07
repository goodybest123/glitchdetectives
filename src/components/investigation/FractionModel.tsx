/**
 * `FractionModel` — the drawn fraction engine for Level 03.
 *
 * Level 02 shows a whole as a row of photographs, which is fine when the
 * question is "what is each number counting?". Equivalence needs something
 * stricter: two wholes must be *guaranteed* the same outer size and shape so
 * the only difference the child can see is the partitioning.
 *
 * So this component draws the whole itself:
 *  - identical outer dimensions whatever the denominator
 *  - exactly equal partitions, mathematically accurate shading
 *  - a bar (rectangle) form and a pizza (radial) form from one component
 *  - an optional ghost layer: the *previous* partition drawn faintly behind
 *    the new one, so a split visibly keeps the shaded amount in place
 *  - overlay-safe: two models stack pixel-for-pixel because the geometry is
 *    identical
 *
 * Nothing here is decorative. The picture is the mathematics.
 */
import type { ModelShape } from "./types";
import { PartsBoard } from "./PartsBoard";

/** Circle shapes are drawn radially; everything else is drawn as a bar. */
export function isRadial(shape: ModelShape) {
  return shape === "pizza" || shape === "tray";
}

const W = 600;
const H = 200;
const CX = 300;
const CY = 100;
const R = 92;

function wedgePath(index: number, total: number) {
  const a0 = (index / total) * Math.PI * 2 - Math.PI / 2;
  const a1 = ((index + 1) / total) * Math.PI * 2 - Math.PI / 2;
  const x0 = CX + R * Math.cos(a0);
  const y0 = CY + R * Math.sin(a0);
  const x1 = CX + R * Math.cos(a1);
  const y1 = CY + R * Math.sin(a1);
  const large = a1 - a0 > Math.PI ? 1 : 0;
  if (total === 1) {
    return `M ${CX - R} ${CY} A ${R} ${R} 0 1 1 ${CX + R} ${CY} A ${R} ${R} 0 1 1 ${CX - R} ${CY} Z`;
  }
  return `M ${CX} ${CY} L ${x0} ${y0} A ${R} ${R} 0 ${large} 1 ${x1} ${y1} Z`;
}

type Props = {
  shape: ModelShape;
  total: number;
  selected: number[];
  interactive?: boolean;
  onToggle?: (index: number) => void;
  unitLabel: string;
  /**
   * The partition the whole had *before* a split, drawn as faint dashed
   * lines behind the current pieces.
   */
  ghostTotal?: number;
  /** Screen-reader description of the model. */
  label?: string;
  /** Drawn semi-transparent so it can sit on top of another model. */
  overlay?: boolean;
};

export function FractionModel({
  shape,
  total,
  selected,
  interactive = false,
  onToggle,
  unitLabel,
  ghostTotal,
  label,
  overlay = false,
}: Props) {
  const radial = isRadial(shape);
  const on = (index: number) => selected.includes(index);
  const pieces = Array.from({ length: total }, (_, i) => i);

  const piece = (index: number) => {
    const shaded = on(index);
    const common = {
      className: `${shaded ? "fill-primary stroke-background" : "fill-card stroke-foreground"} transition-[fill] duration-300 ${
        interactive ? "cursor-pointer hover:opacity-90" : ""
      }`,
      strokeWidth: 2,
      onClick: interactive ? () => onToggle?.(index) : undefined,
      role: interactive ? "button" : undefined,
      tabIndex: interactive ? 0 : undefined,
      "aria-label": interactive
        ? `${unitLabel} ${index + 1} of ${total}${shaded ? ", shaded" : ""}`
        : undefined,
      onKeyDown: interactive
        ? (event: React.KeyboardEvent) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onToggle?.(index);
            }
          }
        : undefined,
    };
    if (radial) return <path key={index} d={wedgePath(index, total)} {...common} />;
    const w = (W - 8) / total;
    return <rect key={index} x={4 + index * w} y={4} width={w} height={H - 8} {...common} />;
  };

  const ghost =
    ghostTotal && ghostTotal !== total ? (
      <g className="stroke-background" strokeWidth={5} strokeDasharray="12 8" fill="none" opacity={0.9}>
        {radial ? (
          Array.from({ length: ghostTotal }, (_, i) => {
            const a = (i / ghostTotal) * Math.PI * 2 - Math.PI / 2;
            return (
              <line
                key={i}
                x1={CX}
                y1={CY}
                x2={CX + R * Math.cos(a)}
                y2={CY + R * Math.sin(a)}
              />
            );
          })
        ) : (
          Array.from({ length: ghostTotal - 1 }, (_, i) => {
            const x = 4 + ((W - 8) / ghostTotal) * (i + 1);
            return <line key={i} x1={x} y1={4} x2={x} y2={H - 4} />;
          })
        )}
      </g>
    ) : null;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={`h-auto w-full ${overlay ? "opacity-70" : ""}`}
      role="img"
      aria-label={
        label ??
        `One whole cut into ${total} equal ${unitLabel} pieces, ${selected.length} shaded.`
      }
    >
      {radial && (
        <circle
          cx={CX}
          cy={CY}
          r={R + 5}
          className="fill-secondary stroke-foreground"
          strokeWidth={3}
        />
      )}
      {!radial && (
        <rect
          x={1}
          y={1}
          width={W - 2}
          height={H - 2}
          rx={10}
          className="fill-secondary stroke-foreground"
          strokeWidth={3}
        />
      )}
      {pieces.map(piece)}
      {ghost}
    </svg>
  );
}

/**
 * `CaseBoard` — one entry point for the shared case UI.
 *
 * Levels 01–02 keep the photographic tiles (`PartsBoard`); Level 03 sets
 * `render: "model"` on its case definition and gets the drawn engine, with
 * the same counter and reminder text underneath so the surrounding screens
 * do not change.
 */
export function CaseBoard({
  render = "photo",
  reminder,
  hideCounter = false,
  ...props
}: Props & { render?: "photo" | "model"; reminder?: string; hideCounter?: boolean }) {
  if (render !== "model") {
    return <PartsBoard {...props} reminder={reminder} hideCounter={hideCounter} />;
  }
  return (
    <div className="rounded-2xl border-2 border-border bg-secondary/60 p-3 sm:p-4">
      <div className="mx-auto w-full max-w-2xl">
        <FractionModel {...props} />
      </div>
      {!hideCounter && (
        <p className="mt-3 text-center text-xs font-bold text-muted-foreground" aria-live="polite">
          {props.total} equal parts in the whole · {props.selected.length} chosen
        </p>
      )}
      {reminder && (
        <p className="mt-1 text-center text-xs font-semibold text-muted-foreground">{reminder}</p>
      )}
    </div>
  );
}
