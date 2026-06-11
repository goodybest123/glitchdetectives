import type { VisualProps } from "./cases";
import { FractionDisplay } from "./FractionDisplay";

const TOTAL_SLOTS = 4;
const FILLED = 1;

export function EnergyCrateSVG({
  numerator,
  denominator,
  highlight,
  onClickPart,
  interactive = false,
  pulseKey = 0,
  glitchTarget,
}: VisualProps) {

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-10">
      <svg
        key={pulseKey}
        viewBox="0 0 260 140"
        className={`h-[160px] w-full max-w-[300px] ${
          pulseKey > 0 ? "animate-[pulse-once_700ms_ease-out]" : ""
        }`}
      >
        <defs>
          <linearGradient id="batt-glow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
          <style>{`
            @keyframes pulse-once {
              0% { transform: scale(1); }
              40% { transform: scale(1.03); }
              100% { transform: scale(1); }
            }
          `}</style>
        </defs>

        {/* Crate */}
        <rect x={6} y={10} width={248} height={120} rx={16} fill="#e2e8f0" />
        <rect x={14} y={18} width={232} height={104} rx={12} fill="#f8fafc" />

        {Array.from({ length: TOTAL_SLOTS }).map((_, i) => {
          const x = 28 + i * 54;
          const filled = i < FILLED;
          return (
            <g key={i}>
              {/* Battery body */}
              <rect
                x={x}
                y={36}
                width={40}
                height={68}
                rx={8}
                fill={filled ? "url(#batt-glow)" : "#ffffff"}
                stroke={filled ? "#16a34a" : "#cbd5e1"}
                strokeWidth={2}
              />
              {/* Battery cap */}
              <rect x={x + 12} y={28} width={16} height={8} rx={2} fill="#94a3b8" />
              {filled && (
                <circle cx={x + 20} cy={70} r={6} fill="#ffffff" opacity={0.5} />
              )}
            </g>
          );
        })}
      </svg>

      <FractionDisplay
        numerator={numerator}
        denominator={denominator}
        highlight={highlight}
        onClickPart={onClickPart}
        interactive={interactive}
        glitchTarget={glitchTarget}
      />

    </div>
  );
}
