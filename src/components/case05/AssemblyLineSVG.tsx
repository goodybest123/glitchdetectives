import type { VisualProps } from "./cases";

// Assembly Line: motherboard with N chip slots. solved=false → bizarre
// 12-slot board (mutant). solved=true → snaps back to 6-slot board with
// 5 chips perfectly seated.
export function AssemblyLineSVG({ solved, pulseKey }: VisualProps) {
  const W = 460;
  const H = 260;
  const cx = W / 2;
  const cy = H / 2;
  const slots = solved ? 6 : 12;
  const filled = 5;
  const radius = solved ? 90 : 110;
  const chipR = solved ? 22 : 14;
  const boardColor = solved ? "#10b981" : "#f97316";

  // Build polygon points
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < slots; i++) {
    const a = (i / slots) * Math.PI * 2 - Math.PI / 2;
    pts.push({ x: cx + Math.cos(a) * radius, y: cy + Math.sin(a) * radius });
  }
  const polyD =
    pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  return (
    <div className="flex flex-col items-center">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-[260px] w-full max-w-[480px]">
        {/* Board polygon */}
        <path
          key={`board-${pulseKey}`}
          d={polyD}
          fill="#f1f5f9"
          stroke={boardColor}
          strokeWidth={3}
          style={{ transition: "all 700ms ease-out" }}
        />

        {/* Chip slots at each vertex */}
        {pts.map((p, i) => {
          const isFilled = i < filled;
          return (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r={chipR}
                fill={isFilled ? "#fdba74" : "#ffffff"}
                stroke={isFilled ? "#ea580c" : "#cbd5e1"}
                strokeWidth={2}
                style={{ transition: "all 700ms ease-out" }}
              />
              {isFilled && (
                <text
                  x={p.x}
                  y={p.y + 4}
                  textAnchor="middle"
                  fontSize={solved ? 11 : 8}
                  fontWeight="800"
                  fill="#7c2d12"
                >
                  CHIP
                </text>
              )}
            </g>
          );
        })}

        <text
          x={cx}
          y={H - 12}
          textAnchor="middle"
          fontSize="13"
          fontWeight="800"
          fill="#475569"
        >
          MOTHERBOARD ({slots} SIDES)
        </text>
      </svg>
    </div>
  );
}
