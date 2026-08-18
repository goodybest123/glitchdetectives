import type { VisualProps } from "./cases";
import { FractionDisplay } from "./FractionDisplay";

const PAINTED = 3;
const TOTAL_BLOCKS = 5;

export function FractionBarSVG({
  numerator,
  denominator,
  highlight,
  onClickPart,
  interactive = false,
  pulseKey = 0,
  glitchTarget,
}: VisualProps) {
  const W = 360;
  const H = 80;
  const gap = 6;
  const blockW = (W - gap * (TOTAL_BLOCKS - 1)) / TOTAL_BLOCKS;

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-10">
      <svg
        key={pulseKey}
        viewBox={`0 0 ${W} ${H}`}
        className={`h-[100px] w-full max-w-[420px] ${
          pulseKey > 0 ? "animate-[pulse-once_700ms_ease-out]" : ""
        }`}
      >
        <defs>
          <style>{`
            @keyframes pulse-once {
              0% { transform: scale(1); }
              40% { transform: scale(1.03); }
              100% { transform: scale(1); }
            }
          `}</style>
        </defs>
        {Array.from({ length: TOTAL_BLOCKS }).map((_, i) => {
          const x = i * (blockW + gap);
          const isPainted = i < PAINTED;
          return (
            <rect
              key={i}
              x={x}
              y={4}
              width={blockW}
              height={H - 8}
              rx={10}
              fill={isPainted ? "#bbf7d0" : "#ffffff"}
              stroke={isPainted ? "#86efac" : "#e5e7eb"}
              strokeWidth={2}
            />
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
