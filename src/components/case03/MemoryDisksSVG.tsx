import type { VisualProps } from "./cases";

export function MemoryDisksSVG({ dividersVisible, spinKey = 0, middleSlot }: VisualProps) {
  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-4">
      <Disk divisions={4} filled={3} label="3/4" dividersVisible={dividersVisible} spinKey={spinKey} />
      <div>{middleSlot}</div>
      <Disk divisions={8} filled={6} label="6/8" dividersVisible={dividersVisible} spinKey={spinKey} />
    </div>
  );
}

function Disk({
  divisions,
  filled,
  label,
  dividersVisible,
  spinKey,
}: {
  divisions: number;
  filled: number;
  label: string;
  dividersVisible: boolean;
  spinKey: number;
}) {
  const size = 170;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 8;
  const fillAngle = (filled / divisions) * 2 * Math.PI;
  const filledPath = pieSlice(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + fillAngle);

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        key={spinKey}
        className={spinKey > 0 ? "animate-[disk-spin_900ms_ease-in-out]" : ""}
        style={{ width: 180, height: 180 }}
      >
        <style>{`
          @keyframes disk-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
        <svg viewBox={`0 0 ${size} ${size}`} className="h-[180px] w-[180px]">
          <defs>
            <radialGradient id={`disk-${divisions}`}>
              <stop offset="0%" stopColor="#c4b5fd" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </radialGradient>
          </defs>
          <circle cx={cx} cy={cy} r={r} fill="#f1f5f9" stroke="#cbd5e1" strokeWidth={2} />
          <path d={filledPath} fill={`url(#disk-${divisions})`} />
          <g
            style={{
              opacity: dividersVisible ? 1 : 0,
              transition: "opacity 600ms ease",
            }}
          >
            {Array.from({ length: divisions }).map((_, i) => {
              const a = -Math.PI / 2 + (i / divisions) * 2 * Math.PI;
              const x = cx + r * Math.cos(a);
              const y = cy + r * Math.sin(a);
              return (
                <line
                  key={i}
                  x1={cx}
                  y1={cy}
                  x2={x}
                  y2={y}
                  stroke="#94a3b8"
                  strokeWidth={1.25}
                  strokeDasharray="2 3"
                />
              );
            })}
          </g>
          <circle cx={cx} cy={cy} r={8} fill="#475569" />
        </svg>
      </div>
      <div className="text-2xl font-black text-neutral-900">{label}</div>
    </div>
  );
}

function pieSlice(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const x1 = cx + r * Math.cos(startAngle);
  const y1 = cy + r * Math.sin(startAngle);
  const x2 = cx + r * Math.cos(endAngle);
  const y2 = cy + r * Math.sin(endAngle);
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
}
