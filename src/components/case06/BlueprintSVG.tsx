import type { VisualProps } from "./cases";

// Blueprint: large 1/2 block + small 1/4 block on a factory mat + output box.
// repaired=false → giant 1/2 block, small 1/4 block, mismatched 6-slot output (too tiny).
// repaired=true  → 1/2 sliced into two 1/4 blocks; 4-slot output with 3 slots filled.
export function BlueprintSVG({ repaired, pulseKey }: VisualProps) {
  const W = 480;
  const H = 240;

  return (
    <div className="flex flex-col items-center">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-[240px] w-full max-w-[500px]">
        {/* Factory mat */}
        <rect
          x={10}
          y={10}
          width={W - 20}
          height={H - 20}
          rx={14}
          fill="#f8fafc"
          stroke="#e2e8f0"
          strokeWidth={1.5}
          strokeDasharray="6 4"
        />

        {/* LEFT: the big 1/2 block, sliced when repaired */}
        <g key={`left-${pulseKey ?? 0}-${repaired}`} style={{ transition: "transform 600ms ease" }}>
          {repaired ? (
            <>
              <Block x={30} y={70} w={70} h={110} label="1/4" />
              <Block x={108} y={70} w={70} h={110} label="1/4" />
              {/* Laser line memory */}
              <line
                x1={104}
                y1={62}
                x2={104}
                y2={188}
                stroke="#f97316"
                strokeWidth={1}
                strokeDasharray="3 3"
                opacity={0.7}
              />
            </>
          ) : (
            <Block x={30} y={50} w={148} h={150} label="1/2" big />
          )}
        </g>

        {/* PLUS / MINUS sign */}
        <text x={205} y={130} textAnchor="middle" fontSize="34" fontWeight="900" fill="#334155">
          +
        </text>

        {/* RIGHT: small 1/4 block */}
        <Block x={228} y={92} w={72} h={70} label="1/4" />

        {/* Arrow */}
        <g>
          <line x1={312} y1={130} x2={338} y2={130} stroke="#94a3b8" strokeWidth={3} />
          <polygon points="338,123 348,130 338,137" fill="#94a3b8" />
        </g>

        {/* OUTPUT box */}
        <g key={`out-${pulseKey ?? 0}-${repaired}`} style={{ transition: "transform 600ms ease" }}>
          {repaired ? (
            <OutputBox x={358} y={60} slots={4} filled={3} label="3/4" tone="good" />
          ) : (
            <OutputBox x={378} y={92} slots={6} filled={2} label="2/6" tone="bad" tiny />
          )}
        </g>
      </svg>
    </div>
  );
}

function Block({
  x,
  y,
  w,
  h,
  label,
  big,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  big?: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={8}
        fill="#bfdbfe"
        stroke="#3b82f6"
        strokeWidth={2.5}
      />
      <rect x={x + 4} y={y + 4} width={w - 8} height={6} rx={3} fill="#93c5fd" opacity={0.7} />
      <text
        x={x + w / 2}
        y={y + h / 2 + 6}
        textAnchor="middle"
        fontSize={big ? "22" : "16"}
        fontWeight="900"
        fill="#1e3a8a"
      >
        {label}
      </text>
    </g>
  );
}

function OutputBox({
  x,
  y,
  slots,
  filled,
  label,
  tone,
  tiny,
}: {
  x: number;
  y: number;
  slots: number;
  filled: number;
  label: string;
  tone: "good" | "bad";
  tiny?: boolean;
}) {
  const slotH = tiny ? 12 : 28;
  const slotPad = tiny ? 2 : 4;
  const innerW = tiny ? 60 : 92;
  const totalH = slots * (slotH + slotPad) - slotPad;
  const boxW = innerW + 16;
  const boxH = totalH + 16;
  const border = tone === "good" ? "#10b981" : "#f97316";
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={boxW}
        height={boxH}
        rx={8}
        fill="#fafafa"
        stroke={border}
        strokeWidth={2.5}
      />
      {Array.from({ length: slots }).map((_, i) => {
        const sy = y + 8 + i * (slotH + slotPad);
        const isFilled = i < filled;
        return (
          <g key={i}>
            <rect
              x={x + 8}
              y={sy}
              width={innerW}
              height={slotH}
              rx={3}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth={1}
            />
            {isFilled && (
              <rect
                x={x + 10}
                y={sy + 2}
                width={innerW - 4}
                height={slotH - 4}
                rx={3}
                fill="#bfdbfe"
                stroke="#3b82f6"
                strokeWidth={1.5}
              />
            )}
          </g>
        );
      })}
      <text
        x={x + boxW / 2}
        y={y + boxH + 18}
        textAnchor="middle"
        fontSize="13"
        fontWeight="800"
        fill="#475569"
      >
        {label}
      </text>
    </g>
  );
}
