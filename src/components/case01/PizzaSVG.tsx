import { useMemo } from "react";

type PizzaSVGProps = {
  /** 0 = wildly unequal cuts, 1 = perfect quadrants */
  equalized: number;
  /** Called when a dividing line or unequal slice is clicked (only meaningful before detection) */
  onGlitchClick?: () => void;
  /** When true, slices/lines are clickable to trigger detection */
  interactive?: boolean;
  /** Pulse animation trigger key */
  pulseKey?: number;
};

const UNEQUAL_ANGLES = [0, 25, 50, 75]; // degrees
const EQUAL_ANGLES = [0, 90, 180, 270];

const CX = 200;
const CY = 200;
const R = 160;

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(startDeg: number, endDeg: number) {
  const start = polar(CX, CY, R, startDeg);
  const end = polar(CX, CY, R, endDeg);
  const sweep = endDeg - startDeg;
  const largeArc = sweep > 180 ? 1 : 0;
  return `M ${CX} ${CY} L ${start.x} ${start.y} A ${R} ${R} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
}

export function PizzaSVG({
  equalized,
  onGlitchClick,
  interactive = false,
  pulseKey = 0,
}: PizzaSVGProps) {
  const angles = useMemo(
    () => UNEQUAL_ANGLES.map((u, i) => u + (EQUAL_ANGLES[i] - u) * equalized),
    [equalized],
  );

  // 4 slices: angles[0]->angles[1], angles[1]->angles[2], angles[2]->angles[3], angles[3]->angles[0]+360
  const slices = [
    { start: angles[0], end: angles[1] },
    { start: angles[1], end: angles[2] },
    { start: angles[2], end: angles[3] },
    { start: angles[3], end: angles[0] + 360 },
  ];

  // Topping positions (fixed, relative to pizza)
  const toppings = [
    { x: 140, y: 130, r: 6 },
    { x: 250, y: 150, r: 5 },
    { x: 220, y: 230, r: 6 },
    { x: 160, y: 250, r: 5 },
    { x: 270, y: 200, r: 5 },
    { x: 130, y: 200, r: 5 },
    { x: 200, y: 280, r: 6 },
    { x: 200, y: 130, r: 5 },
  ];

  const handleClick = interactive ? onGlitchClick : undefined;
  const cursor = interactive ? "cursor-pointer" : "";

  return (
    <div className="flex items-center justify-center">
      <svg
        key={pulseKey}
        viewBox="0 0 400 400"
        className={`h-[320px] w-[320px] sm:h-[380px] sm:w-[380px] ${
          pulseKey > 0 ? "animate-[pulse-once_700ms_ease-out]" : ""
        }`}
      >
        <defs>
          <style>{`
            @keyframes pulse-once {
              0% { transform: scale(1); }
              40% { transform: scale(1.04); }
              100% { transform: scale(1); }
            }
          `}</style>
        </defs>
        {/* Crust */}
        <circle cx={CX} cy={CY} r={R + 12} fill="#f5e3c2" />
        {/* Pizza base */}
        <circle cx={CX} cy={CY} r={R} fill="#fde9b8" />
        {/* Slices */}
        {slices.map((s, i) => {
          const isHighlighted = i === 0; // the "claimed 1/4" sliver
          return (
            <path
              key={i}
              d={arcPath(s.start, s.end)}
              fill={isHighlighted ? "#ffe8a3" : "transparent"}
              stroke="transparent"
              onClick={handleClick}
              className={`${cursor} transition-all duration-300`}
              style={{ transition: "d 400ms ease" }}
            />
          );
        })}
        {/* Toppings */}
        {toppings.map((t, i) => (
          <circle
            key={i}
            cx={t.x}
            cy={t.y}
            r={t.r}
            fill="#e8a598"
            opacity={0.85}
            pointerEvents="none"
          />
        ))}
        {/* Dividing lines */}
        {angles.map((a, i) => {
          const p = polar(CX, CY, R, a);
          return (
            <line
              key={i}
              x1={CX}
              y1={CY}
              x2={p.x}
              y2={p.y}
              stroke="#7a5a2e"
              strokeWidth={3}
              strokeLinecap="round"
              onClick={handleClick}
              className={cursor}
              style={{ transition: "all 400ms ease" }}
            />
          );
        })}
        {/* Full-pizza click target (top-most), only when interactive */}
        {interactive && (
          <circle
            cx={CX}
            cy={CY}
            r={R + 12}
            fill="transparent"
            onClick={handleClick}
            className={cursor}
            style={{ pointerEvents: "all" }}
          />
        )}
      </svg>
    </div>
  );
}
