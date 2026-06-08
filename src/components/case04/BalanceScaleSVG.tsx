import type { VisualProps } from "./cases";

// Cargo Blocks: 1/8 (left) vs 1/4 (right). When unsolved, scale is tilted
// LEFT (wrong). When solved, it tilts RIGHT to reflect the heavier 1/4 block.
export function BalanceScaleSVG({ solved, middleSlot }: VisualProps) {
  // Negative = left side down, positive = right side down.
  const tilt = solved ? 14 : -14;
  const W = 420;
  const H = 280;
  const cx = W / 2;
  const beamY = 90;
  const beamLen = 280;

  // Block sizes derived from fraction value: 1/4 visibly 2x area of 1/8.
  const smallSize = 38; // 1/8
  const bigSize = 54; // 1/4

  const rad = (tilt * Math.PI) / 180;
  const leftPanX = cx - (beamLen / 2) * Math.cos(rad);
  const leftPanY = beamY + (beamLen / 2) * Math.sin(rad);
  const rightPanX = cx + (beamLen / 2) * Math.cos(rad);
  const rightPanY = beamY - (beamLen / 2) * Math.sin(rad);

  return (
    <div className="flex flex-col items-center">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-[280px] w-full max-w-[460px]">
        {/* Base */}
        <rect x={cx - 60} y={H - 24} width={120} height={16} rx={6} fill="#cbd5e1" />
        <rect x={cx - 8} y={beamY} width={16} height={H - 32 - beamY} fill="#94a3b8" />
        {/* Fulcrum pivot */}
        <circle cx={cx} cy={beamY} r={8} fill="#475569" />

        {/* Beam (rotates) */}
        <g
          style={{
            transform: `rotate(${tilt}deg)`,
            transformOrigin: `${cx}px ${beamY}px`,
            transition: "transform 900ms cubic-bezier(0.34, 1.2, 0.64, 1)",
          }}
        >
          <rect
            x={cx - beamLen / 2}
            y={beamY - 5}
            width={beamLen}
            height={10}
            rx={5}
            fill="#64748b"
          />
        </g>

        {/* Left pan + block (1/8) */}
        <g
          style={{
            transition: "transform 900ms cubic-bezier(0.34, 1.2, 0.64, 1)",
            transform: `translate(${leftPanX - cx}px, ${leftPanY - beamY}px)`,
          }}
        >
          {/* hanger */}
          <line x1={cx} y1={beamY} x2={cx} y2={beamY + 30} stroke="#94a3b8" strokeWidth={2} />
          {/* pan */}
          <path
            d={`M ${cx - 48} ${beamY + 32} Q ${cx} ${beamY + 56} ${cx + 48} ${beamY + 32}`}
            stroke="#64748b"
            strokeWidth={3}
            fill="#f8fafc"
          />
          {/* block 1/8 */}
          <rect
            x={cx - smallSize / 2}
            y={beamY + 32 - smallSize}
            width={smallSize}
            height={smallSize}
            rx={6}
            fill="#fed7aa"
            stroke="#fb923c"
            strokeWidth={2}
          />
          <text
            x={cx}
            y={beamY + 32 - smallSize / 2 + 4}
            textAnchor="middle"
            fontSize="11"
            fontWeight="800"
            fill="#9a3412"
          >
            1/8
          </text>
        </g>

        {/* Right pan + block (1/4) */}
        <g
          style={{
            transition: "transform 900ms cubic-bezier(0.34, 1.2, 0.64, 1)",
            transform: `translate(${rightPanX - cx}px, ${rightPanY - beamY}px)`,
          }}
        >
          <line x1={cx} y1={beamY} x2={cx} y2={beamY + 30} stroke="#94a3b8" strokeWidth={2} />
          <path
            d={`M ${cx - 56} ${beamY + 32} Q ${cx} ${beamY + 58} ${cx + 56} ${beamY + 32}`}
            stroke="#64748b"
            strokeWidth={3}
            fill="#f8fafc"
          />
          <rect
            x={cx - bigSize / 2}
            y={beamY + 32 - bigSize}
            width={bigSize}
            height={bigSize}
            rx={8}
            fill="#fdba74"
            stroke="#ea580c"
            strokeWidth={2}
          />
          <text
            x={cx}
            y={beamY + 32 - bigSize / 2 + 5}
            textAnchor="middle"
            fontSize="14"
            fontWeight="800"
            fill="#7c2d12"
          >
            1/4
          </text>
        </g>
      </svg>

      <div className="mt-4 w-full max-w-[460px]">{middleSlot}</div>
    </div>
  );
}
