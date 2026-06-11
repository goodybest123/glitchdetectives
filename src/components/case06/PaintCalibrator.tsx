import { useRef, useState } from "react";
import { useSfx } from "@/hooks/useSfx";

type Props = { onComplete: () => void };

// Interactive Paint Vats repair: 1/3 vat starts with 3 rows. Two dashed
// snap-rails sit at the 1/6 and 3/6 marks. Tap (or Enter) each rail to
// add a real grid line. Once both are added → 6 rows total = 2/6.
export function PaintCalibrator({ onComplete }: Props) {
  const W = 480;
  const H = 260;
  const [addedTop, setAddedTop] = useState(false);
  const [addedBottom, setAddedBottom] = useState(false);
  const completedRef = useRef(false);
  const sfx = useSfx();

  const done = addedTop && addedBottom;

  const tryComplete = (nextTop: boolean, nextBot: boolean) => {
    if (completedRef.current) return;
    if (nextTop && nextBot) {
      completedRef.current = true;
      sfx("snap");
      setTimeout(() => onComplete(), 600);
    }
  };

  const onTapTop = () => {
    if (addedTop) return;
    setAddedTop(true);
    sfx("tick");
    tryComplete(true, addedBottom);
  };
  const onTapBottom = () => {
    if (addedBottom) return;
    setAddedBottom(true);
    sfx("tick");
    tryComplete(addedTop, true);
  };

  // Left vat geometry (matches PaintVatsSVG)
  const lx = 30, ly = 40, lw = 110, lh = 170;
  // Three 1/3 sections initially → row heights 56.67. Snap rails at midpoints.
  const railY1 = ly + lh * (1 / 6); // upper rail
  const railY2 = ly + lh * (3 / 6); // middle rail (within section 2)
  // Wait, to convert from 3 rows to 6 rows we need to halve each of 3 rows → 3 new rails.
  // Two rails simplification: we'll add rails at lh*(1/6) and lh*(5/6). But for 6 rows, we need rails at every 1/6 except those already present (1/3, 2/3).
  // To keep visual simple, show 2 snap-rails at midpoints of upper and lower thirds (1/6, 5/6).
  // The middle third already gets visually split as paint redistributes after both taps.
  // Existing rails are at 1/3 and 2/3.
  const upperRailY = ly + lh * (1 / 6);
  const lowerRailY = ly + lh * (5 / 6);

  return (
    <div className="flex flex-col items-center">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-[260px] w-full max-w-[500px] touch-none select-none">
        {/* LEFT vat */}
        <g>
          {done ? (
            <Vat x={lx} y={ly} sections={6} filled={2} label="2/6" />
          ) : (
            <Vat x={lx} y={ly} sections={3} filled={1} label="1/3" />
          )}
        </g>

        {/* Snap rails (only while not done) */}
        {!done && (
          <g>
            {!addedTop && (
              <SnapRail x={lx} y={upperRailY} w={lw} onTap={onTapTop} ariaLabel="Add upper grid line" />
            )}
            {addedTop && <RealLine x={lx} y={upperRailY} w={lw} />}
            {!addedBottom && (
              <SnapRail x={lx} y={lowerRailY} w={lw} onTap={onTapBottom} ariaLabel="Add lower grid line" />
            )}
            {addedBottom && <RealLine x={lx} y={lowerRailY} w={lw} />}
          </g>
        )}

        <text x={170} y={150} textAnchor="middle" fontSize="32" fontWeight="900" fill="#334155">+</text>

        {/* RIGHT vat (1/6) */}
        <Vat x={195} y={40} sections={6} filled={1} label="1/6" />

        {/* Arrow */}
        <g>
          <line x1={300} y1={150} x2={326} y2={150} stroke="#94a3b8" strokeWidth={3} />
          <polygon points="326,143 336,150 326,157" fill="#94a3b8" />
        </g>

        {/* Output vat */}
        {done ? (
          <Vat x={345} y={40} sections={6} filled={3} label="3/6" tone="good" />
        ) : (
          <Vat x={345} y={40} sections={9} filled={2} label="2/9" tone="bad" puddle />
        )}
      </svg>
      <p className="mt-2 text-center text-xs font-medium text-neutral-500">
        {done ? "Grids match! Now both vats measure the same way." : `Tap the dotted line${addedTop || addedBottom ? "" : "s"} to add a matching grid line.`}
      </p>
    </div>
  );
}

function SnapRail({ x, y, w, onTap, ariaLabel }: { x: number; y: number; w: number; onTap: () => void; ariaLabel: string }) {
  return (
    <g
      role="button"
      aria-label={ariaLabel}
      tabIndex={0}
      onPointerDown={(e) => {
        e.preventDefault();
        onTap();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onTap();
        }
      }}
      style={{ cursor: "pointer", outline: "none" }}
    >
      {/* Big hit area */}
      <rect x={x - 4} y={y - 12} width={w + 8} height={24} fill="transparent" />
      <line x1={x - 4} y1={y} x2={x + w + 4} y2={y} stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 3" style={{ animation: "tappable-pulse 1.6s ease-in-out infinite" }} />
      <circle cx={x + w + 12} cy={y} r={6} fill="#fbbf24" stroke="#b45309" strokeWidth={1.5} />
    </g>
  );
}

function RealLine({ x, y, w }: { x: number; y: number; w: number }) {
  return <line x1={x} y1={y} x2={x + w} y2={y} stroke="#475569" strokeWidth={1.5} style={{ animation: "tappable-pulse 600ms ease-out" }} />;
}

function Vat({ x, y, sections, filled, label, tone, puddle }: { x: number; y: number; sections: number; filled: number; label: string; tone?: "good" | "bad"; puddle?: boolean }) {
  const w = 110;
  const h = 170;
  const border = tone === "good" ? "#10b981" : tone === "bad" ? "#f97316" : "#475569";
  const fillColor = "#fde68a";
  const fillStroke = "#f59e0b";
  const rowH = h / sections;
  return (
    <g>
      <path d={`M ${x} ${y} L ${x} ${y + h} L ${x + w} ${y + h} L ${x + w} ${y} M ${x - 4} ${y} L ${x + w + 4} ${y}`} stroke={border} strokeWidth={3} fill="none" strokeLinecap="round" />
      <rect x={x} y={y} width={w} height={h} fill="#f8fafc" />
      {Array.from({ length: sections - 1 }).map((_, i) => (
        <line key={`r${i}`} x1={x} y1={y + (i + 1) * rowH} x2={x + w} y2={y + (i + 1) * rowH} stroke="#cbd5e1" strokeWidth={1} />
      ))}
      {puddle
        ? Array.from({ length: filled }).map((_, i) => (
            <ellipse key={i} cx={x + 25 + i * 30} cy={y + h - 8} rx={10} ry={3} fill={fillColor} stroke={fillStroke} strokeWidth={1.5} />
          ))
        : Array.from({ length: filled }).map((_, i) => {
            const sy = y + h - (i + 1) * rowH + 2;
            return <rect key={i} x={x + 2} y={sy} width={w - 4} height={rowH - 4} rx={2} fill={fillColor} stroke={fillStroke} strokeWidth={1.5} />;
          })}
      <text x={x + w / 2} y={y + h + 22} textAnchor="middle" fontSize="14" fontWeight="800" fill="#475569">{label}</text>
    </g>
  );
}
