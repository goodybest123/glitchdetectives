import type { VisualProps } from "./cases";

export function FuelTanksSVG({ dividersVisible }: VisualProps) {
  return (
    <div className="flex items-end justify-center gap-6 sm:gap-10">
      <Tank divisions={2} filled={1} label="1/2" />
      <div aria-hidden className="pb-12 text-sm font-bold tracking-wider text-neutral-300">
        TANKS
      </div>
      <Tank divisions={4} filled={2} label="2/4" dividersVisible={dividersVisible} />
    </div>
  );
}

function Tank({
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
  const W = 90;
  const H = 200;
  const fillRatio = filled / divisions;
  const fillHeight = H * fillRatio;
  // Visible label is fixed; only inner dividers fade.
  return (
    <div className="flex flex-col items-center gap-2">
      <svg viewBox={`0 0 ${W} ${H + 12}`} className="h-[220px] w-[100px]">
        <defs>
          <linearGradient id={`fuel-${divisions}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#93c5fd" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        {/* Tank outline */}
        <rect x={4} y={4} width={W - 8} height={H} rx={10} fill="#f8fafc" stroke="#cbd5e1" strokeWidth={2} />
        {/* Fuel */}
        <rect
          x={6}
          y={4 + (H - fillHeight)}
          width={W - 12}
          height={fillHeight - 2}
          rx={6}
          fill={`url(#fuel-${divisions})`}
        />
        {/* Dividers */}
        <g
          style={{
            opacity: dividersVisible ? 1 : 0,
            transition: "opacity 600ms ease",
          }}
        >
          {Array.from({ length: divisions - 1 }).map((_, i) => {
            const y = 4 + ((i + 1) * H) / divisions;
            return (
              <line
                key={i}
                x1={4}
                x2={W - 4}
                y1={y}
                y2={y}
                stroke="#94a3b8"
                strokeWidth={1.5}
                strokeDasharray="3 3"
              />
            );
          })}
        </g>
        {/* Cap */}
        <rect x={W / 2 - 10} y={0} width={20} height={6} rx={2} fill="#94a3b8" />
      </svg>
      <div className="text-2xl font-black text-neutral-900">{label}</div>
    </div>
  );
}
