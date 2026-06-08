import type { VisualProps } from "./cases";

export function GardenBedsSVG({ dividersVisible, middleSlot }: VisualProps) {
  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-4">
      <Bed divisions={3} filled={1} label="1/3" dividersVisible={dividersVisible} />
      <div>{middleSlot}</div>
      <Bed divisions={6} filled={2} label="2/6" dividersVisible={dividersVisible} />
    </div>
  );
}

function Bed({
  divisions,
  filled,
  label,
  dividersVisible = true,
}: {
  divisions: number;
  filled: number;
  label: string;
  dividersVisible?: boolean;
}) {
  const W = 180;
  const H = 160;
  const rowH = H / divisions;
  const fillHeight = rowH * filled;
  return (
    <div className="flex flex-col items-center gap-2">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-[170px] w-[200px]">
        <defs>
          <linearGradient id={`bed-${divisions}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
        </defs>
        <rect x={2} y={2} width={W - 4} height={H - 4} rx={10} fill="#fef3c7" stroke="#d6c39a" strokeWidth={2} />
        <rect
          x={6}
          y={H - 4 - fillHeight}
          width={W - 12}
          height={fillHeight}
          rx={6}
          fill={`url(#bed-${divisions})`}
        />
        <g
          style={{
            opacity: dividersVisible ? 1 : 0,
            transition: "opacity 600ms ease",
          }}
        >
          {Array.from({ length: divisions - 1 }).map((_, i) => {
            const y = 2 + (i + 1) * rowH;
            return (
              <line
                key={i}
                x1={6}
                x2={W - 6}
                y1={y}
                y2={y}
                stroke="#a8895c"
                strokeWidth={1.5}
                strokeDasharray="3 3"
              />
            );
          })}
        </g>
      </svg>
      <div className="text-2xl font-black text-neutral-900">{label}</div>
    </div>
  );
}
