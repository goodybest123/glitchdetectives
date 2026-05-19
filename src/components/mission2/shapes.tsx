import { motion } from "framer-motion";

const WARN = "#fde68a";
const WARN_2 = "#fca5a5";
const OK = "#86efac";
const OK_2 = "#7dd3fc";
const STROKE = "#1e293b";

function tints(repaired: boolean) {
  return repaired ? [OK, OK_2] : [WARN, WARN_2];
}

export function EnergyBarShape({ pct, repaired }: { pct: number; repaired: boolean }) {
  const [a, b] = tints(repaired);
  const x = 20 + (pct / 100) * 360;
  return (
    <svg viewBox="0 0 400 160" className="w-full h-auto">
      <defs>
        {repaired && (
          <filter id="bar-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        )}
      </defs>
      <rect x={20} y={30} width={x - 20} height={100} rx={10} fill={a} />
      <rect x={x} y={30} width={380 - x} height={100} rx={10} fill={b} />
      <rect x={20} y={30} width={360} height={100} rx={10} fill="none" stroke={STROKE} strokeWidth={3} />
      {repaired && (
        <motion.rect
          x={20} y={30} width={360} height={100} rx={10}
          fill="none" stroke={OK_2} strokeWidth={4} filter="url(#bar-glow)"
          initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0.6] }} transition={{ duration: 0.9 }}
        />
      )}
    </svg>
  );
}

export function ReactorDiscShape({ pct, repaired }: { pct: number; repaired: boolean }) {
  const [a, b] = tints(repaired);
  const cx = 100, cy = 100, r = 80;
  const angle = (pct / 100) * 360;
  const rad = (deg: number) => ((deg - 90) * Math.PI) / 180;
  const p1 = { x: cx + r * Math.cos(rad(0)), y: cy + r * Math.sin(rad(0)) };
  const p2 = { x: cx + r * Math.cos(rad(angle)), y: cy + r * Math.sin(rad(angle)) };
  const large1 = angle > 180 ? 1 : 0;
  const large2 = angle > 180 ? 0 : 1;
  return (
    <svg viewBox="0 0 200 200" className="w-full h-auto max-w-sm mx-auto">
      <defs>
        {repaired && (
          <filter id="disc-glow"><feGaussianBlur stdDeviation="3" /></filter>
        )}
      </defs>
      <circle cx={cx} cy={cy} r={r} fill={b} stroke={STROKE} strokeWidth={3} />
      <path d={`M${cx},${cy} L${p1.x},${p1.y} A${r},${r} 0 ${large1} 1 ${p2.x},${p2.y} Z`} fill={a} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={STROKE} strokeWidth={3} />
      {repaired && (
        <motion.circle
          cx={cx} cy={cy} r={r} fill="none" stroke={OK_2} strokeWidth={4} filter="url(#disc-glow)"
          initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0.6] }} transition={{ duration: 0.9 }}
        />
      )}
    </svg>
  );
}

export function PowerCellShape({ pct, repaired }: { pct: number; repaired: boolean }) {
  const [a, b] = tints(repaired);
  const y = 30 + (pct / 100) * 240;
  return (
    <svg viewBox="0 0 200 320" className="w-full h-auto max-w-[220px] mx-auto">
      <defs>
        {repaired && (
          <filter id="cell-glow"><feGaussianBlur stdDeviation="3" /></filter>
        )}
        <clipPath id="cell-clip"><rect x={50} y={30} width={100} height={240} rx={20} /></clipPath>
      </defs>
      <rect x={80} y={15} width={40} height={18} rx={4} fill={STROKE} />
      <g clipPath="url(#cell-clip)">
        <rect x={50} y={30} width={100} height={y - 30} fill={a} />
        <rect x={50} y={y} width={100} height={270 - y} fill={b} />
      </g>
      <rect x={50} y={30} width={100} height={240} rx={20} fill="none" stroke={STROKE} strokeWidth={3} />
      {repaired && (
        <motion.rect
          x={50} y={30} width={100} height={240} rx={20} fill="none" stroke={OK_2} strokeWidth={4} filter="url(#cell-glow)"
          initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0.6] }} transition={{ duration: 0.9 }}
        />
      )}
    </svg>
  );
}
