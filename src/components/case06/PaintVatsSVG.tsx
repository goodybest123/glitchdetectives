import type { VisualProps } from "./cases";

// Paint Vats: 1/3 vat + 1/6 vat + output vat.
// repaired=false → 1/3 vat has 3 thick sections (1 filled), 1/6 vat has 6 thin (1 filled),
//                  output is a 9-section vat with 2 tiny puddles.
// repaired=true  → 1/3 vat gets a horizontal line → 6 sections (2 filled),
//                  output is a 6-section vat with 3 filled (half full).
export function PaintVatsSVG({ repaired, pulseKey }: VisualProps) {
  const W = 480;
  const H = 260;

  return (
    <div className="flex flex-col items-center">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-[260px] w-full max-w-[500px]">
        {/* LEFT vat (1/3 → 2/6) */}
        <g key={`left-${pulseKey ?? 0}-${repaired}`} style={{ transition: "opacity 500ms ease" }}>
          {repaired ? (
            <Vat x={30} y={40} sections={6} filled={2} label="2/6" cols={2} />
          ) : (
            <Vat x={30} y={40} sections={3} filled={1} label="1/3" />
          )}
        </g>

        <text x={170} y={150} textAnchor="middle" fontSize="32" fontWeight="900" fill="#334155">
          +
        </text>

        {/* RIGHT vat (1/6) */}
        <Vat x={195} y={40} sections={6} filled={1} label="1/6" />

        {/* Arrow */}
        <g>
          <line x1={300} y1={150} x2={326} y2={150} stroke="#94a3b8" strokeWidth={3} />
          <polygon points="326,143 336,150 326,157" fill="#94a3b8" />
        </g>

        {/* OUTPUT vat */}
        <g key={`out-${pulseKey ?? 0}-${repaired}`}>
          {repaired ? (
            <Vat x={345} y={40} sections={6} filled={3} label="3/6" tone="good" />
          ) : (
            <Vat x={345} y={40} sections={9} filled={2} label="2/9" tone="bad" puddle />
          )}
        </g>
      </svg>
    </div>
  );
}

function Vat({
  x,
  y,
  sections,
  filled,
  label,
  cols = 1,
  tone,
  puddle,
}: {
  x: number;
  y: number;
  sections: number;
  filled: number;
  label: string;
  cols?: number;
  tone?: "good" | "bad";
  puddle?: boolean;
}) {
  const w = 110;
  const h = 170;
  const border = tone === "good" ? "#10b981" : tone === "bad" ? "#f97316" : "#475569";
  const fillColor = "#fde68a";
  const fillStroke = "#f59e0b";

  // Sections: we fill from the BOTTOM up.
  const rows = sections / cols;
  const rowH = h / rows;
  const colW = w / cols;

  return (
    <g>
      {/* Vat outline */}
      <path
        d={`M ${x} ${y} L ${x} ${y + h} L ${x + w} ${y + h} L ${x + w} ${y} M ${x - 4} ${y} L ${x + w + 4} ${y}`}
        stroke={border}
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
      />
      <rect x={x} y={y} width={w} height={h} fill="#f8fafc" />

      {/* Grid lines */}
      {Array.from({ length: rows - 1 }).map((_, i) => (
        <line
          key={`r${i}`}
          x1={x}
          y1={y + (i + 1) * rowH}
          x2={x + w}
          y2={y + (i + 1) * rowH}
          stroke="#cbd5e1"
          strokeWidth={1}
        />
      ))}
      {cols > 1 &&
        Array.from({ length: cols - 1 }).map((_, i) => (
          <line
            key={`c${i}`}
            x1={x + (i + 1) * colW}
            y1={y}
            x2={x + (i + 1) * colW}
            y2={y + h}
            stroke="#cbd5e1"
            strokeWidth={1}
          />
        ))}

      {/* Fill */}
      {puddle
        ? // Tiny puddles at the bottom for the wrong-answer vat
          Array.from({ length: filled }).map((_, i) => (
            <ellipse
              key={i}
              cx={x + 25 + i * 30}
              cy={y + h - 8}
              rx={10}
              ry={3}
              fill={fillColor}
              stroke={fillStroke}
              strokeWidth={1.5}
            />
          ))
        : Array.from({ length: filled }).map((_, i) => {
            const col = i % cols;
            const rowFromBottom = Math.floor(i / cols);
            const sx = x + col * colW + 2;
            const sy = y + h - (rowFromBottom + 1) * rowH + 2;
            return (
              <rect
                key={i}
                x={sx}
                y={sy}
                width={colW - 4}
                height={rowH - 4}
                rx={2}
                fill={fillColor}
                stroke={fillStroke}
                strokeWidth={1.5}
              />
            );
          })}

      <text
        x={x + w / 2}
        y={y + h + 22}
        textAnchor="middle"
        fontSize="14"
        fontWeight="800"
        fill="#475569"
      >
        {label}
      </text>
    </g>
  );
}
