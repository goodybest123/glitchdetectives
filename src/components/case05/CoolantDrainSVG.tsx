import type { VisualProps } from "./cases";

// Coolant Drain: 8-section tank. solved=false → tank outline missing,
// 3 floating puddles. solved=true → tank outline fades back in, 3 sections fill.
export function CoolantDrainSVG({ solved, pulseKey }: VisualProps) {
  const W = 460;
  const H = 260;
  const tankX = 130;
  const tankY = 24;
  const tankW = 200;
  const sectionH = 26;
  const tankH = sectionH * 8;
  const filledSections = 3;

  return (
    <div className="flex flex-col items-center">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-[260px] w-full max-w-[480px]">
        {/* Drain pipe (left) */}
        <rect x={40} y={tankY + tankH - 30} width={80} height={14} rx={4} fill="#cbd5e1" />
        <text x={80} y={tankY + tankH + 10} textAnchor="middle" fontSize="11" fontWeight="700" fill="#64748b">
          DRAIN
        </text>

        {/* Tank outline — fades in only when solved */}
        <rect
          key={`tank-${pulseKey}`}
          x={tankX}
          y={tankY}
          width={tankW}
          height={tankH}
          rx={10}
          fill="none"
          stroke="#475569"
          strokeWidth={3}
          style={{
            opacity: solved ? 1 : 0,
            transition: "opacity 800ms ease-out",
          }}
        />

        {/* Section dividers — fade in only when solved */}
        <g
          style={{
            opacity: solved ? 1 : 0,
            transition: "opacity 800ms ease-out",
          }}
        >
          {Array.from({ length: 7 }).map((_, i) => (
            <line
              key={i}
              x1={tankX + 4}
              y1={tankY + (i + 1) * sectionH}
              x2={tankX + tankW - 4}
              y2={tankY + (i + 1) * sectionH}
              stroke="#cbd5e1"
              strokeWidth={1.5}
              strokeDasharray="3,3"
            />
          ))}
        </g>

        {/* Coolant fluid — 3 sections at the bottom */}
        {Array.from({ length: filledSections }).map((_, i) => {
          // bottom-up positions
          const idx = 8 - 1 - i;
          const sy = tankY + idx * sectionH;
          if (solved) {
            return (
              <rect
                key={i}
                x={tankX + 4}
                y={sy + 2}
                width={tankW - 8}
                height={sectionH - 4}
                rx={3}
                fill="#7dd3fc"
                stroke="#0284c7"
                strokeWidth={1.5}
                style={{ transition: "all 700ms ease-out" }}
              />
            );
          }
          // unsolved: floating puddle, drifted slightly
          const driftX = (i - 1) * 14;
          const driftY = (i - 1) * 6;
          return (
            <ellipse
              key={i}
              cx={tankX + tankW / 2 + driftX}
              cy={sy + sectionH / 2 + driftY + 20}
              rx={(tankW - 30) / 2}
              ry={sectionH / 2 - 2}
              fill="#7dd3fc"
              stroke="#0284c7"
              strokeWidth={1.5}
              style={{ transition: "all 700ms ease-out" }}
            />
          );
        })}

        {/* Label */}
        <text
          x={tankX + tankW / 2}
          y={H - 12}
          textAnchor="middle"
          fontSize="13"
          fontWeight="800"
          fill="#475569"
        >
          COOLANT TANK
        </text>
      </svg>
    </div>
  );
}
