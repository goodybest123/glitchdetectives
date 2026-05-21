import { Battery, Cog, Gem, Pill } from "lucide-react";
import type { FractionVisualSpec } from "@/lib/level2/types";

const LIT = "#5fd0ff";
const LIT_BG = "color-mix(in oklab, #5fd0ff 65%, transparent)";
const DARK = "color-mix(in oklab, #5fd0ff 12%, transparent)";
const STROKE = "rgba(230, 250, 255, 0.95)"; // bright white-cyan for high-contrast dividers
const STROKE_W = 4;

export function FractionVisual({
  spec,
  size = 220,
  emphasizeSelected = false,
}: {
  spec: FractionVisualSpec;
  size?: number;
  emphasizeSelected?: boolean;
}) {
  if (spec.kind === "bar") return <BarVisual spec={spec} size={size} emphasize={emphasizeSelected} />;
  if (spec.kind === "circle") return <CircleVisual spec={spec} size={size} emphasize={emphasizeSelected} />;
  if (spec.kind === "grid") return <GridVisual spec={spec} size={size} emphasize={emphasizeSelected} />;
  if (spec.kind === "pizza") return <PizzaVisual spec={spec} size={size} emphasize={emphasizeSelected} />;
  return <SetVisual spec={spec} size={size} emphasize={emphasizeSelected} />;
}

function isLit(spec: FractionVisualSpec, i: number) {
  return spec.selected.includes(i);
}

function BarVisual({ spec, size, emphasize }: { spec: FractionVisualSpec; size: number; emphasize: boolean }) {
  const h = Math.round(size * 0.45);
  return (
    <div
      className="relative rounded-2xl overflow-hidden flex"
      style={{
        width: size,
        height: h,
        border: `${STROKE_W}px solid ${STROKE}`,
        background: "rgba(8,22,48,0.5)",
        boxShadow: emphasize ? "0 0 30px rgba(95,208,255,0.4)" : undefined,
      }}
      role="img"
      aria-label={`Bar divided into ${spec.total} equal parts, ${spec.selected.length} selected.`}
    >
      {Array.from({ length: spec.total }).map((_, i) => (
        <div
          key={i}
          className="flex-1 transition-all"
          style={{
            background: isLit(spec, i) ? LIT_BG : DARK,
            borderRight: i < spec.total - 1 ? `${STROKE_W}px solid ${STROKE}` : undefined,
            boxShadow: isLit(spec, i) ? `inset 0 0 22px ${LIT}` : undefined,
          }}
        />
      ))}
    </div>
  );
}

function CircleVisual({ spec, size, emphasize }: { spec: FractionVisualSpec; size: number; emphasize: boolean }) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 8;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={`Circle divided into ${spec.total} equal slices, ${spec.selected.length} selected.`}
      style={{ filter: emphasize ? "drop-shadow(0 0 14px rgba(95,208,255,0.55))" : undefined }}
    >
      {Array.from({ length: spec.total }).map((_, i) => {
        const start = (i / spec.total) * Math.PI * 2 - Math.PI / 2;
        const end = ((i + 1) / spec.total) * Math.PI * 2 - Math.PI / 2;
        const x1 = cx + r * Math.cos(start);
        const y1 = cy + r * Math.sin(start);
        const x2 = cx + r * Math.cos(end);
        const y2 = cy + r * Math.sin(end);
        const large = end - start > Math.PI ? 1 : 0;
        const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
        const lit = isLit(spec, i);
        return (
          <path
            key={i}
            d={d}
            fill={lit ? LIT_BG : DARK}
            stroke={STROKE}
            strokeWidth={STROKE_W}
            strokeLinejoin="round"
          />
        );
      })}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={STROKE} strokeWidth={STROKE_W} />
    </svg>
  );
}

function PizzaVisual({ spec, size, emphasize }: { spec: FractionVisualSpec; size: number; emphasize: boolean }) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 10;
  const CRUST = "#c97e3a";
  const CRUST_STROKE = "#7a4519";
  const SAUCE = "#e8b56b";
  const SAUCE_LIT = "#f3c97a";
  const TOPPING = "#a8323e";
  const DIVIDER = "#5a2b10";

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={`Pizza cut into ${spec.total} equal slices, ${spec.selected.length} taken.`}
      style={{ filter: emphasize ? "drop-shadow(0 6px 16px rgba(0,0,0,0.35))" : "drop-shadow(0 4px 10px rgba(0,0,0,0.3))" }}
    >
      {/* crust */}
      <circle cx={cx} cy={cy} r={r} fill={CRUST} stroke={CRUST_STROKE} strokeWidth={3} />
      {/* slices */}
      {Array.from({ length: spec.total }).map((_, i) => {
        const start = (i / spec.total) * Math.PI * 2 - Math.PI / 2;
        const end = ((i + 1) / spec.total) * Math.PI * 2 - Math.PI / 2;
        const inner = r - 8;
        const x1 = cx + inner * Math.cos(start);
        const y1 = cy + inner * Math.sin(start);
        const x2 = cx + inner * Math.cos(end);
        const y2 = cy + inner * Math.sin(end);
        const large = end - start > Math.PI ? 1 : 0;
        const d = `M ${cx} ${cy} L ${x1} ${y1} A ${inner} ${inner} 0 ${large} 1 ${x2} ${y2} Z`;
        const lit = isLit(spec, i);
        // a couple of toppings per lit slice
        const mid = (start + end) / 2;
        const tx = cx + inner * 0.55 * Math.cos(mid);
        const ty = cy + inner * 0.55 * Math.sin(mid);
        return (
          <g key={i}>
            <path d={d} fill={lit ? SAUCE_LIT : SAUCE} stroke={DIVIDER} strokeWidth={STROKE_W} strokeLinejoin="round" />
            {lit && (
              <>
                <circle cx={tx} cy={ty} r={Math.max(4, r * 0.07)} fill={TOPPING} />
                <circle cx={tx + r * 0.12} cy={ty - r * 0.06} r={Math.max(3, r * 0.05)} fill={TOPPING} />
              </>
            )}
          </g>
        );
      })}
      {/* crust ring on top so dividers don't cross it */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={CRUST_STROKE} strokeWidth={3} />
    </svg>
  );
}

function GridVisual({ spec, size, emphasize }: { spec: FractionVisualSpec; size: number; emphasize: boolean }) {
  const cols = spec.cols ?? 4;
  const rows = Math.ceil(spec.total / cols);
  const cellW = Math.floor(size / cols);
  const cellH = cellW;
  return (
    <div
      className="grid rounded-2xl overflow-hidden"
      style={{
        width: cols * cellW,
        height: rows * cellH,
        gridTemplateColumns: `repeat(${cols}, ${cellW}px)`,
        gap: 0,
        border: `${STROKE_W}px solid ${STROKE}`,
        background: "rgba(8,22,48,0.5)",
        boxShadow: emphasize ? "0 0 30px rgba(95,208,255,0.4)" : undefined,
      }}
      role="img"
      aria-label={`Grid of ${spec.total} equal cells, ${spec.selected.length} lit.`}
    >
      {Array.from({ length: spec.total }).map((_, i) => (
        <div
          key={i}
          style={{
            background: isLit(spec, i) ? LIT_BG : DARK,
            outline: `${STROKE_W / 2}px solid ${STROKE}`,
            boxShadow: isLit(spec, i) ? `inset 0 0 16px ${LIT}` : undefined,
          }}
        />
      ))}
    </div>
  );
}

function SetIcon({ kind }: { kind: "crystal" | "gear" | "battery" | "capsule" }) {
  const props = { className: "w-7 h-7", strokeWidth: 1.6 };
  if (kind === "gear") return <Cog {...props} />;
  if (kind === "battery") return <Battery {...props} />;
  if (kind === "capsule") return <Pill {...props} />;
  return <Gem {...props} />;
}

function SetVisual({ spec, size, emphasize }: { spec: FractionVisualSpec; size: number; emphasize: boolean }) {
  const cols = spec.cols ?? Math.min(5, Math.ceil(Math.sqrt(spec.total) + 1));
  const cellW = Math.floor(size / cols);
  return (
    <div
      className="grid gap-2 p-2 rounded-2xl border"
      style={{
        gridTemplateColumns: `repeat(${cols}, ${cellW}px)`,
        borderColor: STROKE,
        background: "rgba(8,22,48,0.45)",
        boxShadow: emphasize ? "0 0 30px rgba(95,208,255,0.4)" : undefined,
      }}
      role="img"
      aria-label={`A set of ${spec.total} ${spec.setIcon ?? "object"}s, ${spec.selected.length} glowing.`}
    >
      {Array.from({ length: spec.total }).map((_, i) => {
        const lit = isLit(spec, i);
        return (
          <div
            key={i}
            className="aspect-square rounded-xl flex items-center justify-center transition-all"
            style={{
              background: lit ? LIT_BG : DARK,
              color: lit ? "#e6faff" : "color-mix(in oklab, #5fd0ff 35%, white)",
              boxShadow: lit ? `0 0 16px ${LIT}` : undefined,
              borderRadius: 12,
            }}
          >
            <SetIcon kind={spec.setIcon ?? "crystal"} />
          </div>
        );
      })}
    </div>
  );
}
