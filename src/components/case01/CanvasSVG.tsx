type Props = {
  equalized: number;
  onGlitchClick?: () => void;
  interactive?: boolean;
  pulseKey?: number;
};

// Slider 0 → far-left, 0.5 → centered (correct), 1 → far-right
const LEFT = 0.15;
const CENTER = 0.5;
const RIGHT = 0.85;

const W = 400;
const H = 240;
const PAD = 24;

export function CanvasSVG({ equalized, onGlitchClick, interactive = false, pulseKey = 0 }: Props) {
  const pos =
    equalized <= 0.5
      ? LEFT + (CENTER - LEFT) * (equalized / 0.5)
      : CENTER + (RIGHT - CENTER) * ((equalized - 0.5) / 0.5);
  const innerW = W - PAD * 2;
  const innerH = H - PAD * 2;
  const dividerX = PAD + pos * innerW;
  const handleClick = interactive ? onGlitchClick : undefined;
  const cursor = interactive ? "cursor-pointer" : "";

  return (
    <div className="flex items-center justify-center">
      <svg
        key={pulseKey}
        viewBox={`0 0 ${W} ${H}`}
        className={`h-[280px] w-full max-w-[440px] ${
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

        {/* Wooden frame */}
        <rect x={8} y={8} width={W - 16} height={H - 16} rx={6} fill="#a67c52" />
        <rect x={14} y={14} width={W - 28} height={H - 28} rx={4} fill="#8b643d" />

        {/* Canvas */}
        <rect x={PAD} y={PAD} width={innerW} height={innerH} fill="#ffffff" />

        {/* Painted blue region (left) */}
        <rect
          x={PAD}
          y={PAD}
          width={Math.max(0, dividerX - PAD)}
          height={innerH}
          fill="#bcd8f5"
          style={{ transition: "all 400ms ease" }}
        />

        {/* Click overlays on each side */}
        <rect
          x={PAD}
          y={PAD}
          width={Math.max(0, dividerX - PAD)}
          height={innerH}
          fill="transparent"
          onClick={handleClick}
          className={cursor}
        />
        <rect
          x={dividerX}
          y={PAD}
          width={Math.max(0, W - PAD - dividerX)}
          height={innerH}
          fill="transparent"
          onClick={handleClick}
          className={cursor}
        />

        {/* Dividing line */}
        <line
          x1={dividerX}
          y1={PAD}
          x2={dividerX}
          y2={H - PAD}
          stroke="#1f2937"
          strokeWidth={3}
          strokeLinecap="round"
          onClick={handleClick}
          className={cursor}
          style={{ transition: "all 400ms ease" }}
        />

        {/* Easel pegs */}
        <circle cx={PAD - 4} cy={H / 2} r={3} fill="#4b2a14" pointerEvents="none" />
        <circle cx={W - PAD + 4} cy={H / 2} r={3} fill="#4b2a14" pointerEvents="none" />

        {interactive && (
          <rect
            x={0}
            y={0}
            width={W}
            height={H}
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
