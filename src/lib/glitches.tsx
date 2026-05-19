import type { ReactNode } from "react";

export type Glitch = {
  id: string;
  name: string;
  robotLabel: string;
  parts: number;
  robotBriefing: string;
  robotInvestigate: string;
  robotDetect: string;
  robotExplainWrong: string;
  robotExplain: string;
  robotRepair: string;
  robotSuccess: string;
  initialVals: number[]; // 0-100, divider positions
  target: number[]; // correct positions
  tolerance: number;
  render: (
    vals: number[],
    isRepaired: boolean,
  ) => ReactNode;
};

// Render helpers ------------------------------------------------------------

function PizzaShape({ vals, repaired }: { vals: number[]; repaired: boolean }) {
  const angle = (vals[0] / 100) * 360;
  const rad = (deg: number) => ((deg - 90) * Math.PI) / 180;
  const r = 88;
  const cx = 100, cy = 100;
  const p1 = { x: cx + r * Math.cos(rad(0)), y: cy + r * Math.sin(rad(0)) };
  const p2 = { x: cx + r * Math.cos(rad(angle)), y: cy + r * Math.sin(rad(angle)) };
  const largeArc1 = angle > 180 ? 1 : 0;
  const largeArc2 = angle > 180 ? 0 : 1;

  // Stable pepperoni positions (polar coords inside the cheese)
  const pepperoni = [
    { a: 25, d: 38 }, { a: 95, d: 50 }, { a: 160, d: 32 },
    { a: 210, d: 55 }, { a: 280, d: 40 }, { a: 330, d: 52 },
    { a: 60, d: 18 },
  ];

  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <defs>
        <radialGradient id="crustGrad" cx="50%" cy="50%" r="50%">
          <stop offset="85%" stopColor="#e2b27a" />
          <stop offset="100%" stopColor="#b8814a" />
        </radialGradient>
        <radialGradient id="cheeseGrad" cx="40%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#fde79a" />
          <stop offset="100%" stopColor="#e9c46a" />
        </radialGradient>
        {repaired && (
          <filter id="pizzaGlow"><feGaussianBlur stdDeviation="3" /></filter>
        )}
      </defs>
      {/* Crust */}
      <circle cx={cx} cy={cy} r={96} fill="url(#crustGrad)" stroke="#7a4f25" strokeWidth={2} />
      {/* Sauce */}
      <circle cx={cx} cy={cy} r={82} fill="#b9341f" />
      {/* Cheese with melted blob edge */}
      <circle cx={cx} cy={cy} r={76} fill="url(#cheeseGrad)" />
      {[15, 70, 130, 195, 250, 310].map((a, i) => {
        const x = cx + 76 * Math.cos(rad(a));
        const y = cy + 76 * Math.sin(rad(a));
        return <circle key={i} cx={x} cy={y} r={5} fill="url(#cheeseGrad)" />;
      })}
      {/* Pepperoni */}
      {pepperoni.map((p, i) => {
        const x = cx + p.d * Math.cos(rad(p.a));
        const y = cy + p.d * Math.sin(rad(p.a));
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={8} fill="#a82a1f" stroke="#6b1810" strokeWidth={0.6} />
            <circle cx={x - 2} cy={y - 2} r={1.2} fill="#6b1810" opacity={0.6} />
            <circle cx={x + 2} cy={y + 1} r={0.9} fill="#6b1810" opacity={0.5} />
          </g>
        );
      })}
      {/* Slice wedge highlights to show the two pieces */}
      <path d={`M${cx},${cy} L${p1.x},${p1.y} A${r},${r} 0 ${largeArc1} 1 ${p2.x},${p2.y} Z`}
        fill={repaired ? "#ffffff" : "#ffffff"} opacity={repaired ? 0.05 : 0.08} />
      {/* Cut lines */}
      <line x1={cx} y1={cy} x2={p1.x} y2={p1.y} stroke="#3a1a08" strokeWidth={3} strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={p2.x} y2={p2.y} stroke="#3a1a08" strokeWidth={3} strokeLinecap="round" />
      {repaired && (
        <circle cx={cx} cy={cy} r={96} fill="none" stroke="var(--color-success)" strokeWidth={3} opacity={0.6} filter="url(#pizzaGlow)" />
      )}
    </svg>
  );
}

function BarShape({ vals, repaired, parts }: { vals: number[]; repaired: boolean; parts: number }) {
  const colors = ["var(--color-energy)", "var(--color-glitch)", "var(--color-primary)", "var(--color-success)"];
  const positions = [0, ...vals, 100];
  return (
    <svg viewBox="0 0 320 120" className="w-full h-full">
      <rect x={10} y={20} width={300} height={80} rx={12} fill="var(--color-card)" stroke="var(--color-primary)" strokeWidth={3} />
      {positions.slice(0, -1).map((p, i) => {
        const next = positions[i + 1];
        const x = 10 + (p / 100) * 300;
        const w = ((next - p) / 100) * 300;
        const fill = repaired ? (i % 2 === 0 ? "var(--color-success)" : "var(--color-energy)") : colors[i % colors.length];
        return <rect key={i} x={x} y={20} width={w} height={80} rx={4} fill={fill} opacity={0.85} />;
      })}
      {vals.map((v, i) => (
        <line key={i} x1={10 + (v / 100) * 300} y1={20} x2={10 + (v / 100) * 300} y2={100} stroke="var(--color-primary)" strokeWidth={3} />
      ))}
      <rect x={10} y={20} width={300} height={80} rx={12} fill="none" stroke="var(--color-primary)" strokeWidth={3} />
    </svg>
  );
}

function CylinderShape({ vals, repaired }: { vals: number[]; repaired: boolean }) {
  // vertical battery, vals[0] = fill split height
  const y = 20 + ((100 - vals[0]) / 100) * 200;
  const fillA = repaired ? "var(--color-success)" : "var(--color-glitch)";
  const fillB = "var(--color-energy)";
  return (
    <svg viewBox="0 0 200 260" className="w-full h-full">
      <rect x={70} y={10} width={60} height={15} rx={4} fill="var(--color-primary)" />
      <rect x={50} y={20} width={100} height={220} rx={20} fill="var(--color-card)" stroke="var(--color-primary)" strokeWidth={4} />
      <clipPath id="cylclip"><rect x={50} y={20} width={100} height={220} rx={20} /></clipPath>
      <g clipPath="url(#cylclip)">
        <rect x={50} y={20} width={100} height={y - 20} fill={fillB} opacity={0.85} />
        <rect x={50} y={y} width={100} height={240 - y} fill={fillA} opacity={0.85} />
      </g>
      <line x1={50} y1={y} x2={150} y2={y} stroke="var(--color-primary)" strokeWidth={3} />
      <rect x={50} y={20} width={100} height={220} rx={20} fill="none" stroke="var(--color-primary)" strokeWidth={4} />
    </svg>
  );
}

function GridShape({ vals, repaired }: { vals: number[]; repaired: boolean }) {
  // 4 panels - vals[0] = vertical split, vals[1] = horizontal split
  const vx = 20 + (vals[0] / 100) * 200;
  const hy = 20 + (vals[1] / 100) * 200;
  const colors = repaired
    ? ["var(--color-success)", "var(--color-energy)", "var(--color-energy)", "var(--color-success)"]
    : ["var(--color-glitch)", "var(--color-energy)", "var(--color-primary)", "var(--color-success)"];
  return (
    <svg viewBox="0 0 240 240" className="w-full h-full">
      <rect x={20} y={20} width={vx - 20} height={hy - 20} fill={colors[0]} opacity={0.85} />
      <rect x={vx} y={20} width={220 - vx} height={hy - 20} fill={colors[1]} opacity={0.85} />
      <rect x={20} y={hy} width={vx - 20} height={220 - hy} fill={colors[2]} opacity={0.85} />
      <rect x={vx} y={hy} width={220 - vx} height={220 - hy} fill={colors[3]} opacity={0.85} />
      <rect x={20} y={20} width={200} height={200} rx={8} fill="none" stroke="var(--color-primary)" strokeWidth={3} />
      <line x1={vx} y1={20} x2={vx} y2={220} stroke="var(--color-primary)" strokeWidth={3} />
      <line x1={20} y1={hy} x2={220} y2={hy} stroke="var(--color-primary)" strokeWidth={3} />
    </svg>
  );
}

function PillShape({ vals, repaired }: { vals: number[]; repaired: boolean }) {
  const x = 20 + (vals[0] / 100) * 260;
  const fillA = repaired ? "var(--color-success)" : "var(--color-glitch)";
  const fillB = "var(--color-energy)";
  return (
    <svg viewBox="0 0 300 100" className="w-full h-full">
      <clipPath id="pillclip"><rect x={20} y={20} width={260} height={60} rx={30} /></clipPath>
      <g clipPath="url(#pillclip)">
        <rect x={20} y={20} width={x - 20} height={60} fill={fillA} opacity={0.85} />
        <rect x={x} y={20} width={280 - x} height={60} fill={fillB} opacity={0.85} />
      </g>
      <line x1={x} y1={20} x2={x} y2={80} stroke="var(--color-primary)" strokeWidth={3} />
      <rect x={20} y={20} width={260} height={60} rx={30} fill="none" stroke="var(--color-primary)" strokeWidth={4} />
    </svg>
  );
}

// Glitches ------------------------------------------------------------------

export const GLITCHES: Glitch[] = [
  {
    id: "pizza",
    name: "Level 1 Pizza",
    robotLabel: "2 PIZZA SLICES",
    parts: 2,
    robotBriefing: "Look! I sliced this pizza for us. We both have a slice, so it's fair halves!",
    robotInvestigate: "What do you notice about this pizza? Did I cut it right?",
    robotDetect: "Why is this a glitch? Explain it so I can learn!",
    robotExplainWrong: "Oh okay! Tell me why you think I cut it right. What makes it a fraction?",
    robotExplain: "Wait... why did the pieces have to change? Tell me why!",
    robotRepair: "Help! Drag the slider to fix my pizza so it's actually halves.",
    robotSuccess: "Whoa! Now both slices look the same. You're a pizza genius!",
    initialVals: [25],
    target: [50],
    tolerance: 4,
    render: (vals, repaired) => <PizzaShape vals={vals} repaired={repaired} />,
  },
  {
    id: "chocolate",
    name: "Chocolate Bar",
    robotLabel: "3 CANDY PIECES",
    parts: 3,
    robotBriefing: "Here is my chocolate bar! I broke it into thirds for three friends!",
    robotInvestigate: "Are these really thirds? Look closely!",
    robotDetect: "Tell me why this isn't really thirds!",
    robotExplainWrong: "Hmm okay! Why do you think these are thirds?",
    robotExplain: "Why did I have to move BOTH lines? Tell me!",
    robotRepair: "Move the two lines so all three pieces are the same.",
    robotSuccess: "Three matching pieces! Now it's really thirds!",
    initialVals: [20, 55],
    target: [33.33, 66.66],
    tolerance: 5,
    render: (vals, repaired) => <BarShape vals={vals} repaired={repaired} parts={3} />,
  },
  {
    id: "battery",
    name: "Power Battery",
    robotLabel: "BATTERY HALVES",
    parts: 2,
    robotBriefing: "This battery is split in half! Top half is charge, bottom half is empty!",
    robotInvestigate: "Is the top really HALF of the battery?",
    robotDetect: "Why is this not really halves?",
    robotExplainWrong: "Okay! Why is this halves?",
    robotExplain: "Why did the line need to be in the middle?",
    robotRepair: "Slide the line to make two equal halves.",
    robotSuccess: "Perfect halves! The battery is balanced now.",
    initialVals: [78],
    target: [50],
    tolerance: 4,
    render: (vals, repaired) => <CylinderShape vals={vals} repaired={repaired} />,
  },
  {
    id: "solar",
    name: "Solar Panel",
    robotLabel: "4 SOLAR QUARTERS",
    parts: 4,
    robotBriefing: "I built a solar panel with four quarters! All four parts catch the sun!",
    robotInvestigate: "Are all four parts really QUARTERS?",
    robotDetect: "Why are these not real quarters?",
    robotExplainWrong: "Tell me why these are quarters!",
    robotExplain: "Why did both lines need to be in the middle?",
    robotRepair: "Move both sliders so all four quarters match.",
    robotSuccess: "Four matching quarters! Now my solar panel works!",
    initialVals: [30, 70],
    target: [50, 50],
    tolerance: 5,
    render: (vals, repaired) => <GridShape vals={vals} repaired={repaired} />,
  },
  {
    id: "fuelrod",
    name: "Fuel Rod",
    robotLabel: "FUEL ROD HALVES",
    parts: 2,
    robotBriefing: "My fuel rod is split into two halves of energy! Easy peasy!",
    robotInvestigate: "Hmm... are those two parts the same size?",
    robotDetect: "Why is this not really halves?",
    robotExplainWrong: "Cool! Why do you think it's halves?",
    robotExplain: "Why did the split have to be in the middle?",
    robotRepair: "Drag the divider to the middle to make true halves.",
    robotSuccess: "Two equal halves! Power restored!",
    initialVals: [70],
    target: [50],
    tolerance: 4,
    render: (vals, repaired) => <PillShape vals={vals} repaired={repaired} />,
  },
];
