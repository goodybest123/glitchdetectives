import type { VisualProps } from "./cases";

// Circuit Board: power cell + chip + output board.
// repaired=false → solid 1/2 power cell, tiny 1/8 chip, output board EMPTY (0/6).
// repaired=true  → 1/2 cell sliced into 4 eighths; 1 segment removed; output shows 3/8 glowing.
export function CircuitBoardSVG({ repaired, pulseKey }: VisualProps) {
  const W = 480;
  const H = 240;

  return (
    <div className="flex flex-col items-center">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-[240px] w-full max-w-[500px]">
        {/* Board background */}
        <rect x={10} y={10} width={W - 20} height={H - 20} rx={14} fill="#0f172a" />
        {/* Subtle circuit traces */}
        <g stroke="#1e293b" strokeWidth={1} fill="none">
          <path d="M 20 60 L 200 60 L 200 200" />
          <path d="M 460 80 L 360 80 L 360 180" />
        </g>

        {/* LEFT: 1/2 power cell, segmented when repaired */}
        <g key={`cell-${pulseKey ?? 0}-${repaired}`}>
          {repaired ? <PowerCellSegmented x={30} y={40} /> : <PowerCellSolid x={30} y={40} />}
        </g>

        <text x={195} y={130} textAnchor="middle" fontSize="32" fontWeight="900" fill="#cbd5e1">−</text>

        {/* RIGHT: 1/8 microchip */}
        <Chip x={220} y={108} />

        {/* Arrow */}
        <g>
          <line x1={300} y1={130} x2={326} y2={130} stroke="#64748b" strokeWidth={3} />
          <polygon points="326,123 336,130 326,137" fill="#64748b" />
        </g>

        {/* OUTPUT board */}
        <g key={`out-${pulseKey ?? 0}-${repaired}`}>
          {repaired ? (
            <OutputBoard x={350} y={40} slots={8} filled={3} label="3/8" tone="good" />
          ) : (
            <OutputBoard x={355} y={70} slots={6} filled={0} label="0/6" tone="bad" tiny />
          )}
        </g>
      </svg>
    </div>
  );
}

function PowerCellSolid({ x, y }: { x: number; y: number }) {
  const w = 130;
  const h = 160;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={10} fill="#34d399" stroke="#10b981" strokeWidth={2.5} />
      <rect x={x + 6} y={y + 6} width={w - 12} height={10} rx={4} fill="#6ee7b7" opacity={0.8} />
      <text x={x + w / 2} y={y + h / 2 + 8} textAnchor="middle" fontSize="24" fontWeight="900" fill="#064e3b">
        1/2
      </text>
    </g>
  );
}

function PowerCellSegmented({ x, y }: { x: number; y: number }) {
  const w = 130;
  const h = 160;
  const segH = h / 4;
  // Segments 0..3 from top. We "pop out" segment index 3 (bottom one) to show subtraction.
  const removedIdx = 3;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={10} fill="none" stroke="#10b981" strokeWidth={2.5} />
      {Array.from({ length: 4 }).map((_, i) => {
        const sy = y + i * segH;
        const removed = i === removedIdx;
        return (
          <g key={i} style={{ transition: "transform 500ms ease" }}>
            <rect
              x={x + 4}
              y={sy + 3}
              width={w - 8}
              height={segH - 6}
              rx={4}
              fill={removed ? "#1e293b" : "#34d399"}
              stroke={removed ? "#475569" : "#10b981"}
              strokeWidth={1.5}
              strokeDasharray={removed ? "4 3" : undefined}
            />
            <text
              x={x + w / 2}
              y={sy + segH / 2 + 5}
              textAnchor="middle"
              fontSize="12"
              fontWeight="800"
              fill={removed ? "#64748b" : "#064e3b"}
            >
              1/8
            </text>
          </g>
        );
      })}
    </g>
  );
}

function Chip({ x, y }: { x: number; y: number }) {
  const w = 56;
  const h = 44;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={4} fill="#fde68a" stroke="#ca8a04" strokeWidth={2} />
      {Array.from({ length: 4 }).map((_, i) => (
        <line key={`t${i}`} x1={x + 8 + i * 12} y1={y - 6} x2={x + 8 + i * 12} y2={y} stroke="#ca8a04" strokeWidth={1.5} />
      ))}
      {Array.from({ length: 4 }).map((_, i) => (
        <line key={`b${i}`} x1={x + 8 + i * 12} y1={y + h} x2={x + 8 + i * 12} y2={y + h + 6} stroke="#ca8a04" strokeWidth={1.5} />
      ))}
      <text x={x + w / 2} y={y + h / 2 + 5} textAnchor="middle" fontSize="13" fontWeight="900" fill="#713f12">
        1/8
      </text>
    </g>
  );
}

function OutputBoard({
  x,
  y,
  slots,
  filled,
  label,
  tone,
  tiny,
}: {
  x: number;
  y: number;
  slots: number;
  filled: number;
  label: string;
  tone: "good" | "bad";
  tiny?: boolean;
}) {
  const w = tiny ? 80 : 110;
  const segH = tiny ? 14 : (160 / slots);
  const h = segH * slots;
  const border = tone === "good" ? "#10b981" : "#f97316";
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill="#0b1220" stroke={border} strokeWidth={2.5} />
      {Array.from({ length: slots }).map((_, i) => {
        const sy = y + i * segH;
        const isFilled = i >= slots - filled; // fill from bottom
        return (
          <g key={i}>
            <line x1={x} y1={sy} x2={x + w} y2={sy} stroke="#1e293b" strokeWidth={1} />
            {isFilled && (
              <rect
                x={x + 3}
                y={sy + 2}
                width={w - 6}
                height={segH - 4}
                rx={2}
                fill="#34d399"
                stroke="#10b981"
                strokeWidth={1}
              />
            )}
          </g>
        );
      })}
      <text x={x + w / 2} y={y + h + 18} textAnchor="middle" fontSize="13" fontWeight="800" fill="#e2e8f0">
        {label}
      </text>
    </g>
  );
}
