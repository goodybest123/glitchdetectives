import { motion } from "framer-motion";
import type { Glitch } from "@/lib/glitches";
import { EnergyBarShape, ReactorDiscShape } from "@/components/mission2/shapes";

export type Level2Glitch = Glitch & {
  mechanic: "snap" | "range";
  orientation?: "horizontal" | "vertical";
};

const WARN = "#fde68a";
const WARN_2 = "#fca5a5";
const WARN_3 = "#fdba74";
const WARN_4 = "#f9a8d4";
const OK = "#86efac";
const OK_2 = "#7dd3fc";
const OK_3 = "#a5f3fc";
const OK_4 = "#bef264";
const STROKE = "#1e293b";

/* ---- Multi-part shapes for range-slider mechanic ---- */

function SoftwareDiskShape({ vals, repaired }: { vals: number[]; repaired: boolean }) {
  // vals are 3 dividers in 0..100 → angles 0..360 splitting disc into 4 wedges
  const cx = 100, cy = 100, r = 82;
  const rad = (deg: number) => ((deg - 90) * Math.PI) / 180;
  const pal = repaired ? [OK, OK_2, OK_3, OK_4] : [WARN, WARN_2, WARN_3, WARN_4];
  const angles = [0, ...vals.map((v) => (v / 100) * 360), 360];

  const wedges: { d: string; fill: string }[] = [];
  for (let i = 0; i < 4; i++) {
    const a1 = angles[i];
    const a2 = angles[i + 1];
    const p1 = { x: cx + r * Math.cos(rad(a1)), y: cy + r * Math.sin(rad(a1)) };
    const p2 = { x: cx + r * Math.cos(rad(a2)), y: cy + r * Math.sin(rad(a2)) };
    const large = a2 - a1 > 180 ? 1 : 0;
    wedges.push({
      d: `M${cx},${cy} L${p1.x},${p1.y} A${r},${r} 0 ${large} 1 ${p2.x},${p2.y} Z`,
      fill: pal[i],
    });
  }

  return (
    <svg viewBox="0 0 200 200" className="w-full h-auto max-w-sm mx-auto">
      <defs>
        {repaired && <filter id="disk-glow"><feGaussianBlur stdDeviation="3" /></filter>}
      </defs>
      <circle cx={cx} cy={cy} r={r} fill="#0f172a" />
      {wedges.map((w, i) => (
        <path key={i} d={w.d} fill={w.fill} stroke={STROKE} strokeWidth={1.5} />
      ))}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={STROKE} strokeWidth={3} />
      <circle cx={cx} cy={cy} r={12} fill="#0f172a" stroke={STROKE} strokeWidth={2} />
      {repaired && (
        <motion.circle
          cx={cx} cy={cy} r={r} fill="none" stroke={OK_2} strokeWidth={4} filter="url(#disk-glow)"
          initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0.6] }} transition={{ duration: 0.9 }}
        />
      )}
    </svg>
  );
}

function PowerCellMultiShape({ vals, repaired }: { vals: number[]; repaired: boolean }) {
  // vals are 2 horizontal dividers in 0..100 of inner height 240
  const pal = repaired ? [OK, OK_2, OK_3] : [WARN, WARN_2, WARN_3];
  const y1 = 30 + (vals[0] / 100) * 240;
  const y2 = 30 + (vals[1] / 100) * 240;
  const top = Math.min(y1, y2);
  const bot = Math.max(y1, y2);
  return (
    <svg viewBox="0 0 200 320" className="w-full h-auto max-w-[220px] mx-auto">
      <defs>
        {repaired && <filter id="cell3-glow"><feGaussianBlur stdDeviation="3" /></filter>}
        <clipPath id="cell3-clip"><rect x={50} y={30} width={100} height={240} rx={20} /></clipPath>
      </defs>
      <rect x={80} y={15} width={40} height={18} rx={4} fill={STROKE} />
      <g clipPath="url(#cell3-clip)">
        <rect x={50} y={30} width={100} height={top - 30} fill={pal[0]} />
        <rect x={50} y={top} width={100} height={bot - top} fill={pal[1]} />
        <rect x={50} y={bot} width={100} height={270 - bot} fill={pal[2]} />
      </g>
      <rect x={50} y={30} width={100} height={240} rx={20} fill="none" stroke={STROKE} strokeWidth={3} />
      {repaired && (
        <motion.rect
          x={50} y={30} width={100} height={240} rx={20} fill="none"
          stroke={OK_2} strokeWidth={4} filter="url(#cell3-glow)"
          initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0.6] }} transition={{ duration: 0.9 }}
        />
      )}
    </svg>
  );
}

/* ---- Glitch entries ---- */

export const LEVEL2_GLITCHES: Level2Glitch[] = [
  {
    id: "energy-bar",
    name: "Energy Bar",
    robotLabel: "Sharing Machine #A1 — Energy Bar",
    parts: 2,
    mechanic: "snap",
    orientation: "horizontal",
    robotBriefing:
      "Detective! Sharing Machine A-1 just sliced an energy bar in two. The machine says it made halves — tap Start Scanner so we can check it together.",
    robotInvestigate:
      "Look closely at the two pieces. One worker bot will get the left piece, the other the right. Are they really halves?",
    robotDetect:
      "I think you're right — the slice looks off. Tell me what you noticed. Why isn't this a true half?",
    robotExplainWrong:
      "Hmm, are you sure? Look again — one chunk is much bigger than the other. Tell me what makes them equal.",
    robotExplain:
      "We balanced it! Now teach me — why does sliding the laser to the middle make these into true halves?",
    robotRepair:
      "Drag the laser slider until both pieces are exactly the same size. It should snap when it's perfect.",
    robotSuccess:
      "Equal halves! That bar is fair to share now.",
    initialVals: [28],
    target: [50],
    tolerance: 2,
    render: (vals, repaired) => <EnergyBarShape pct={vals[0]} repaired={repaired} />,
  },
  {
    id: "reactor-core",
    name: "Reactor Core",
    robotLabel: "Sharing Machine #B2 — Reactor Core",
    parts: 2,
    mechanic: "snap",
    orientation: "horizontal",
    robotBriefing:
      "The reactor core just got split into two wedges to power two stations. The machine swears it's a perfect half. Tap Start Scanner.",
    robotInvestigate:
      "One station will run on the small wedge, the other on the giant wedge. Does that look like a true half to you?",
    robotDetect:
      "I see it too — the wedges aren't matching. Explain why two pieces don't always make halves.",
    robotExplainWrong:
      "Really? One wedge is tiny and the other huge. Halves should look identical. Tell me what makes them equal.",
    robotExplain:
      "Beautiful! Now teach me — why does cutting straight across the middle give us true halves?",
    robotRepair:
      "Slide the laser left or right until the two wedges look identical. It will snap when perfect.",
    robotSuccess:
      "Perfect halves! Both stations get equal power.",
    initialVals: [70],
    target: [50],
    tolerance: 2,
    render: (vals, repaired) => <ReactorDiscShape pct={vals[0]} repaired={repaired} />,
  },
  {
    id: "software-disk",
    name: "Software Disk",
    robotLabel: "Sharing Machine #C3 — Software Disk",
    parts: 4,
    mechanic: "range",
    robotBriefing:
      "This software disk has to be partitioned into four equal sectors for four worker bots. The cutter went haywire. Tap Start Scanner.",
    robotInvestigate:
      "Four bots, four sectors. Look at the wedges — does every bot get a fair share?",
    robotDetect:
      "Right — some wedges are huge, others tiny. Tell me what fair sharing into four parts should look like.",
    robotExplainWrong:
      "Hmm, look at that big wedge versus the slim one. If we want fair fourths, what should be true about every sector?",
    robotExplain:
      "All four sectors are equal! Teach me — why do equal sectors mean the disk is split fairly?",
    robotRepair:
      "Drag the three dividers until all four sectors look the same size, then tap Check Repair.",
    robotSuccess:
      "Four equal sectors! Every bot gets the same share.",
    initialVals: [10, 35, 60],
    target: [25, 50, 75],
    tolerance: 6,
    render: (vals, repaired) => <SoftwareDiskShape vals={vals} repaired={repaired} />,
  },
  {
    id: "power-cell",
    name: "Power Cell",
    robotLabel: "Sharing Machine #D4 — Power Cell",
    parts: 3,
    mechanic: "range",
    robotBriefing:
      "The power cell stores fuel in three stacked chambers. The machine split it badly — the middle is enormous. Tap Start Scanner.",
    robotInvestigate:
      "Three chambers, one giant middle. Is each chamber holding the same amount of fuel?",
    robotDetect:
      "Exactly — fair thirds should all look the same. Tell me why this isn't a true split into three equal parts.",
    robotExplainWrong:
      "Look again — the middle chamber dwarfs the others. What has to be true for the three chambers to be equal thirds?",
    robotExplain:
      "All three chambers match! Teach me — why do equal chambers mean each one holds a true third?",
    robotRepair:
      "Drag the two dividers until all three chambers are the same height, then tap Check Repair.",
    robotSuccess:
      "Three equal chambers! The power cell is balanced.",
    initialVals: [18, 78],
    target: [33.33, 66.67],
    tolerance: 5,
    render: (vals, repaired) => <PowerCellMultiShape vals={vals} repaired={repaired} />,
  },
];
