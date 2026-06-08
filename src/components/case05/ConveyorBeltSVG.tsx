import type { VisualProps } from "./cases";

// Conveyor Belt: two 5-slot crates pour into an output crate.
// solved=false  → output is a stretched 10-slot crate with 3 tiny blocks.
// solved=true   → output snaps back to a 5-slot crate with 3 normal blocks.
export function ConveyorBeltSVG({ solved, pulseKey }: VisualProps) {
  const W = 460;
  const H = 240;

  return (
    <div className="flex flex-col items-center">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-[240px] w-full max-w-[480px]">
        {/* Belt */}
        <rect x={20} y={H - 38} width={W - 40} height={14} rx={7} fill="#e2e8f0" />
        <rect x={20} y={H - 38} width={W - 40} height={4} rx={2} fill="#cbd5e1" />

        {/* Crate A (1/5) */}
        <Crate x={30} y={30} slots={5} filled={1} label="1/5" />
        {/* Crate B (2/5) */}
        <Crate x={150} y={30} slots={5} filled={2} label="2/5" />

        {/* Arrow */}
        <g>
          <line x1={272} y1={90} x2={295} y2={90} stroke="#94a3b8" strokeWidth={3} />
          <polygon points="295,84 305,90 295,96" fill="#94a3b8" />
        </g>

        {/* Output crate */}
        <g
          key={pulseKey}
          style={{
            transition: "transform 700ms cubic-bezier(0.34, 1.2, 0.64, 1)",
          }}
        >
          {solved ? (
            <Crate x={315} y={30} slots={5} filled={3} label="3/5" highlight />
          ) : (
            <Crate
              x={315}
              y={30}
              slots={10}
              filled={3}
              label="3/10"
              tiny
              wrongTint
            />
          )}
        </g>
      </svg>
    </div>
  );
}

function Crate({
  x,
  y,
  slots,
  filled,
  label,
  tiny,
  wrongTint,
  highlight,
}: {
  x: number;
  y: number;
  slots: number;
  filled: number;
  label: string;
  tiny?: boolean;
  wrongTint?: boolean;
  highlight?: boolean;
}) {
  const slotH = 24;
  const slotPad = 3;
  const innerW = tiny ? 110 : 110;
  const totalH = slots * (slotH + slotPad) - slotPad;
  const crateW = innerW + 16;
  const crateH = totalH + 16;
  const borderColor = wrongTint ? "#f97316" : highlight ? "#10b981" : "#475569";
  const blockFill = wrongTint ? "#fed7aa" : "#fdba74";
  const blockStroke = wrongTint ? "#fb923c" : "#ea580c";

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={crateW}
        height={crateH}
        rx={8}
        fill="#fafafa"
        stroke={borderColor}
        strokeWidth={2.5}
      />
      {Array.from({ length: slots }).map((_, i) => {
        const sy = y + 8 + i * (slotH + slotPad);
        const isFilled = i < filled;
        const blockH = tiny ? slotH - 8 : slotH - 4;
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
                x={x + 12}
                y={sy + (slotH - blockH) / 2}
                width={innerW - 8}
                height={blockH}
                rx={3}
                fill={blockFill}
                stroke={blockStroke}
                strokeWidth={1.5}
              />
            )}
          </g>
        );
      })}
      <text
        x={x + crateW / 2}
        y={y + crateH + 18}
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
