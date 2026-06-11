type Tone = "primary" | "secondary" | "accent" | "muted";

const TONE: Record<Tone, { fill: string; stroke: string; empty: string }> = {
  primary: { fill: "#fb923c", stroke: "#c2410c", empty: "#fff7ed" },
  secondary: { fill: "#60a5fa", stroke: "#1d4ed8", empty: "#eff6ff" },
  accent: { fill: "#a78bfa", stroke: "#6d28d9", empty: "#f5f3ff" },
  muted: { fill: "#94a3b8", stroke: "#475569", empty: "#f8fafc" },
};

export type FractionIconProps = {
  numerator: number;
  denominator: number;
  variant?: "pizza" | "bar";
  size?: number; // pixel size (longest dim)
  tone?: Tone;
  ariaLabel?: string;
};

export function FractionIcon({
  numerator,
  denominator,
  variant = "pizza",
  size = 96,
  tone = "primary",
  ariaLabel,
}: FractionIconProps) {
  const colors = TONE[tone];
  const n = Math.max(0, Math.min(numerator, denominator));
  const d = Math.max(1, denominator);
  const label = ariaLabel ?? `${numerator} of ${denominator}`;

  if (variant === "pizza") {
    const r = 48;
    const cx = 50;
    const cy = 50;
    return (
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        role="img"
        aria-label={label}
      >
        <circle cx={cx} cy={cy} r={r} fill={colors.empty} stroke={colors.stroke} strokeWidth={2} />
        {d === 1 ? (
          n >= 1 && (
            <circle cx={cx} cy={cy} r={r} fill={colors.fill} stroke={colors.stroke} strokeWidth={2} />
          )
        ) : (
          Array.from({ length: d }).map((_, i) => {
            const a0 = (i / d) * Math.PI * 2 - Math.PI / 2;
            const a1 = ((i + 1) / d) * Math.PI * 2 - Math.PI / 2;
            const x0 = cx + r * Math.cos(a0);
            const y0 = cy + r * Math.sin(a0);
            const x1 = cx + r * Math.cos(a1);
            const y1 = cy + r * Math.sin(a1);
            const large = a1 - a0 > Math.PI ? 1 : 0;
            const path = `M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`;
            const filled = i < n;
            return (
              <path
                key={i}
                d={path}
                fill={filled ? colors.fill : "transparent"}
                stroke={colors.stroke}
                strokeWidth={1.5}
                strokeLinejoin="round"
              />
            );
          })
        )}
      </svg>
    );
  }

  // bar variant
  const cols = d > 6 ? Math.ceil(d / 2) : d;
  const rows = d > 6 ? 2 : 1;
  const W = 120;
  const H = (W / cols) * rows;
  const cellW = W / cols;
  const cellH = H / rows;
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={size}
      height={(size * H) / W}
      role="img"
      aria-label={label}
    >
      {Array.from({ length: d }).map((_, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const filled = i < n;
        return (
          <rect
            key={i}
            x={col * cellW + 1}
            y={row * cellH + 1}
            width={cellW - 2}
            height={cellH - 2}
            rx={3}
            fill={filled ? colors.fill : colors.empty}
            stroke={colors.stroke}
            strokeWidth={1.5}
          />
        );
      })}
    </svg>
  );
}
