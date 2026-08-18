import type { VisualProps } from "./cases";
import { FractionDisplay } from "./FractionDisplay";

const TOTAL = 6;
const ACTIVE = 4;

export function SolarPanelsSVG({
  numerator,
  denominator,
  highlight,
  onClickPart,
  interactive = false,
  pulseKey = 0,
  glitchTarget,
}: VisualProps) {
  const W = 380;
  const H = 110;
  const gap = 8;
  const panelW = (W - gap * (TOTAL - 1)) / TOTAL;

  return (
    <div className="flex flex-col items-center gap-6">
      <svg
        key={pulseKey}
        viewBox={`0 0 ${W} ${H}`}
        className={`h-[120px] w-full max-w-[440px] ${
          pulseKey > 0 ? "animate-[pulse-once_700ms_ease-out]" : ""
        }`}
      >
        <defs>
          <linearGradient id="panel-glow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#facc15" />
          </linearGradient>
          <style>{`
            @keyframes pulse-once {
              0% { transform: scale(1); }
              40% { transform: scale(1.03); }
              100% { transform: scale(1); }
            }
          `}</style>
        </defs>
        {Array.from({ length: TOTAL }).map((_, i) => {
          const x = i * (panelW + gap);
          const active = i < ACTIVE;
          return (
            <g key={i}>
              <rect
                x={x}
                y={6}
                width={panelW}
                height={H - 12}
                rx={8}
                fill={active ? "url(#panel-glow)" : "#475569"}
                stroke={active ? "#eab308" : "#334155"}
                strokeWidth={2}
              />
              {/* grid lines */}
              <line
                x1={x + panelW / 2}
                y1={10}
                x2={x + panelW / 2}
                y2={H - 10}
                stroke={active ? "#ca8a04" : "#1e293b"}
                strokeWidth={1}
                opacity={0.5}
              />
              <line
                x1={x + 4}
                y1={H / 2}
                x2={x + panelW - 4}
                y2={H / 2}
                stroke={active ? "#ca8a04" : "#1e293b"}
                strokeWidth={1}
                opacity={0.5}
              />
            </g>
          );
        })}
      </svg>

      <div className="flex items-center gap-5 rounded-2xl bg-[#1f2937] px-5 py-3">
        <span className="text-xs font-bold tracking-wider text-[#fde68a]">ACTIVE SOLAR POWER</span>
        <FractionDisplay
          numerator={numerator}
          denominator={denominator}
          highlight={highlight}
          onClickPart={onClickPart}
          interactive={interactive}
          size="md"
          glitchTarget={glitchTarget}
        />
      </div>
    </div>
  );
}
