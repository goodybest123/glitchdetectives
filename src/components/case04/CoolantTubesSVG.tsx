import type { VisualProps } from "./cases";

export function CoolantTubesSVG({ solved, pulseKey = 0, middleSlot }: VisualProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-end justify-center gap-10 sm:gap-14">
        <Tube label="2/3" ratio={2 / 3} pulse={solved} pulseKey={pulseKey} />
        <Tube label="2/5" ratio={2 / 5} pulse={solved} pulseKey={pulseKey} />
      </div>
      <div className="mt-6 w-full max-w-[460px]">{middleSlot}</div>
    </div>
  );
}

function Tube({
  label,
  ratio,
  pulse,
  pulseKey,
}: {
  label: string;
  ratio: number;
  pulse: boolean;
  pulseKey: number;
}) {
  const W = 70;
  const H = 220;
  const fillH = H * ratio;
  return (
    <div className="flex flex-col items-center gap-2">
      <svg viewBox={`0 0 ${W} ${H + 14}`} className="h-[230px] w-[80px]">
        <defs>
          <linearGradient id={`coolant-${label}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="100%" stopColor="#0891b2" />
          </linearGradient>
        </defs>
        {/* Tube body */}
        <rect
          x={6}
          y={8}
          width={W - 12}
          height={H}
          rx={W / 2 - 6}
          fill="#f8fafc"
          stroke="#cbd5e1"
          strokeWidth={2}
        />
        {/* Fluid */}
        <g
          key={pulseKey}
          style={{
            transformOrigin: `${W / 2}px ${8 + H}px`,
            animation: pulse && pulseKey > 0 ? "coolant-pulse 1400ms ease-in-out" : "none",
          }}
        >
          <rect
            x={8}
            y={8 + (H - fillH)}
            width={W - 16}
            height={fillH - 2}
            rx={6}
            fill={`url(#coolant-${label})`}
          />
        </g>
        {/* Cap */}
        <rect x={W / 2 - 12} y={2} width={24} height={8} rx={2} fill="#94a3b8" />
        <style>{`
          @keyframes coolant-pulse {
            0%, 100% { opacity: 1; transform: scaleY(1); }
            50% { opacity: 0.75; transform: scaleY(1.04); }
          }
        `}</style>
      </svg>
      <div className="text-2xl font-black text-neutral-900">{label}</div>
    </div>
  );
}
