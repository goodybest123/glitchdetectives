type Props = {
  equalized: number;
  onGlitchClick?: () => void;
  interactive?: boolean;
  pulseKey?: number;
};

const UNEQUAL = [0.12, 0.88];
const EQUAL = [1 / 3, 2 / 3];

const W = 400;
const H = 160;
const PAD = 20;

export function ChocolateSVG({
  equalized,
  onGlitchClick,
  interactive = false,
  pulseKey = 0,
}: Props) {
  const dividers = UNEQUAL.map((u, i) => u + (EQUAL[i] - u) * equalized);
  const innerW = W - PAD * 2;
  const xs = [PAD, PAD + dividers[0] * innerW, PAD + dividers[1] * innerW, W - PAD];
  const handleClick = interactive ? onGlitchClick : undefined;
  const cursor = interactive ? "cursor-pointer" : "";

  return (
    <div className="flex items-center justify-center">
      <svg
        key={pulseKey}
        viewBox={`0 0 ${W} ${H + 60}`}
        className={`h-[260px] w-full max-w-[420px] ${
          pulseKey > 0 ? "animate-[pulse-once_700ms_ease-out]" : ""
        }`}
      >
        <defs>
          <linearGradient id="choc" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7b4a26" />
            <stop offset="100%" stopColor="#4b2a14" />
          </linearGradient>
          <style>{`
            @keyframes pulse-once {
              0% { transform: scale(1); }
              40% { transform: scale(1.03); }
              100% { transform: scale(1); }
            }
          `}</style>
        </defs>

        {/* Foil background */}
        <rect
          x={PAD - 8}
          y={PAD + 20 - 8}
          width={innerW + 16}
          height={H - 40 + 16}
          rx={10}
          fill="#e9eef5"
        />

        {/* Chocolate segments */}
        {[0, 1, 2].map((i) => (
          <g key={i} onClick={handleClick} className={cursor}>
            <rect
              x={xs[i]}
              y={PAD + 20}
              width={xs[i + 1] - xs[i]}
              height={H - 40}
              fill="url(#choc)"
              style={{ transition: "all 400ms ease" }}
            />
            {/* subtle highlight */}
            <rect
              x={xs[i] + 4}
              y={PAD + 24}
              width={Math.max(0, xs[i + 1] - xs[i] - 8)}
              height={6}
              fill="#a06a3f"
              opacity={0.5}
              style={{ transition: "all 400ms ease" }}
              pointerEvents="none"
            />
          </g>
        ))}

        {/* Divider snap lines */}
        {[xs[1], xs[2]].map((x, i) => (
          <line
            key={i}
            x1={x}
            y1={PAD + 14}
            x2={x}
            y2={H - 20 + PAD + 6}
            stroke="#1f2937"
            strokeWidth={3}
            strokeLinecap="round"
            onClick={handleClick}
            className={cursor}
            style={{ transition: "all 400ms ease" }}
          />
        ))}

        {/* Three friend icons under the bar */}
        {[
          xs[0] + (xs[1] - xs[0]) / 2,
          xs[1] + (xs[2] - xs[1]) / 2,
          xs[2] + (xs[3] - xs[2]) / 2,
        ].map((cx, i) => (
          <g key={i} style={{ transition: "all 400ms ease" }} pointerEvents="none">
            <rect x={cx - 8} y={H + 20} width={16} height={14} rx={3} fill="#64748b" />
            <circle cx={cx - 3} cy={H + 26} r={1.6} fill="#a5f3fc" />
            <circle cx={cx + 3} cy={H + 26} r={1.6} fill="#a5f3fc" />
          </g>
        ))}

        {interactive && (
          <rect
            x={0}
            y={0}
            width={W}
            height={H + 60}
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
