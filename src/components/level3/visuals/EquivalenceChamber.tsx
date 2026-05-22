import type { EquivalenceVisualKind } from "@/lib/level3/types";

/**
 * Reactor chamber visual — pizza, waffle, bar, or battery — shaded to
 * `n/d`. Always shows the full denominator so children can SEE equal
 * shaded area across two different denominators.
 */

const LIT = "#5fd0ff";
const LIT_BG = "color-mix(in oklab, #5fd0ff 65%, transparent)";
const DARK = "color-mix(in oklab, #5fd0ff 10%, transparent)";
const STROKE = "rgba(230,250,255,0.9)";

export function EquivalenceChamber({
  numerator,
  denominator,
  kind,
  size = 200,
  glow = false,
  empty = false,
  label,
}: {
  numerator: number;
  denominator: number;
  kind: EquivalenceVisualKind;
  size?: number;
  glow?: boolean;
  /** If true, show the empty chamber outline waiting to be filled. */
  empty?: boolean;
  label?: string;
}) {
  const shaded = empty ? 0 : numerator;
  return (
    <div className="flex flex-col items-center gap-2">
      {label && <p className="label-eyebrow text-cyan-300/80">{label}</p>}
      <div
        className="relative rounded-2xl p-3 flex items-center justify-center"
        style={{
          background: "rgba(8,22,48,0.55)",
          border: `2px solid color-mix(in oklab, ${LIT} ${glow ? 60 : 25}%, transparent)`,
          boxShadow: glow
            ? `0 0 28px rgba(95,208,255,0.55)`
            : `0 0 10px rgba(95,208,255,0.15)`,
          width: size + 24,
          height: size + 24,
        }}
        role="img"
        aria-label={
          empty
            ? `Empty ${kind} chamber waiting for ${denominator} parts`
            : `${kind} cut into ${denominator} equal parts, ${shaded} shaded`
        }
      >
        {kind === "pizza" ? (
          <Pizza n={shaded} d={denominator} size={size} empty={empty} />
        ) : kind === "waffle" ? (
          <Waffle n={shaded} d={denominator} size={size} empty={empty} />
        ) : kind === "battery" ? (
          <BatteryCell n={shaded} d={denominator} size={size} empty={empty} />
        ) : (
          <Bar n={shaded} d={denominator} size={size} empty={empty} />
        )}
      </div>
      {!empty && (
        <div className="font-mono text-base text-cyan-50">
          <span className="font-bold">{numerator}</span>/
          <span className="font-bold">{denominator}</span>
        </div>
      )}
    </div>
  );
}

function Bar({ n, d, size, empty }: { n: number; d: number; size: number; empty: boolean }) {
  const h = Math.round(size * 0.45);
  return (
    <div className="flex rounded-xl overflow-hidden" style={{ width: size, height: h, border: `2px solid ${STROKE}` }}>
      {Array.from({ length: d }).map((_, i) => (
        <div
          key={i}
          className="flex-1"
          style={{
            background: i < n ? LIT_BG : DARK,
            borderRight: i < d - 1 ? `1.5px solid ${STROKE}` : undefined,
            boxShadow: i < n ? `inset 0 0 14px ${LIT}` : undefined,
            opacity: empty ? 0.4 : 1,
          }}
        />
      ))}
    </div>
  );
}

function Waffle({ n, d, size, empty }: { n: number; d: number; size: number; empty: boolean }) {
  const cols = Math.ceil(Math.sqrt(d));
  const cellW = Math.floor(size / cols);
  return (
    <div
      className="grid rounded-xl overflow-hidden"
      style={{
        gridTemplateColumns: `repeat(${cols}, ${cellW}px)`,
        border: `2px solid ${STROKE}`,
      }}
    >
      {Array.from({ length: d }).map((_, i) => (
        <div
          key={i}
          className="aspect-square"
          style={{
            background: i < n ? LIT_BG : DARK,
            outline: `1px solid ${STROKE}`,
            boxShadow: i < n ? `inset 0 0 14px ${LIT}` : undefined,
            opacity: empty ? 0.4 : 1,
          }}
        />
      ))}
    </div>
  );
}

function Pizza({ n, d, size, empty }: { n: number; d: number; size: number; empty: boolean }) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 6;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="#c97e3a" stroke="#7a4519" strokeWidth={3} />
      {Array.from({ length: d }).map((_, i) => {
        const start = (i / d) * Math.PI * 2 - Math.PI / 2;
        const end = ((i + 1) / d) * Math.PI * 2 - Math.PI / 2;
        const inner = r - 6;
        const x1 = cx + inner * Math.cos(start);
        const y1 = cy + inner * Math.sin(start);
        const x2 = cx + inner * Math.cos(end);
        const y2 = cy + inner * Math.sin(end);
        const large = end - start > Math.PI ? 1 : 0;
        const d2 = `M ${cx} ${cy} L ${x1} ${y1} A ${inner} ${inner} 0 ${large} 1 ${x2} ${y2} Z`;
        const lit = i < n;
        return (
          <path
            key={i}
            d={d2}
            fill={lit ? "#f3c97a" : "#e8b56b"}
            stroke="#5a2b10"
            strokeWidth={3}
            opacity={empty ? 0.4 : 1}
          />
        );
      })}
    </svg>
  );
}

function BatteryCell({
  n,
  d,
  size,
  empty,
}: {
  n: number;
  d: number;
  size: number;
  empty: boolean;
}) {
  const w = Math.round(size * 0.55);
  const h = size;
  return (
    <div className="flex flex-col-reverse rounded-lg overflow-hidden" style={{ width: w, height: h, border: `3px solid ${STROKE}`, position: "relative" }}>
      {Array.from({ length: d }).map((_, i) => (
        <div
          key={i}
          className="flex-1"
          style={{
            background: i < n ? "linear-gradient(180deg, #7df4c6, #2bb789)" : DARK,
            borderTop: i > 0 ? `1.5px solid ${STROKE}` : undefined,
            opacity: empty ? 0.4 : 1,
          }}
        />
      ))}
      <div
        aria-hidden
        className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-t"
        style={{
          width: w * 0.3,
          height: 6,
          background: STROKE,
        }}
      />
    </div>
  );
}
