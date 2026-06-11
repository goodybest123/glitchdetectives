import { useRef, useState } from "react";
import { useSfx } from "@/hooks/useSfx";

type Props = { onComplete: () => void };

// Interactive Blueprint repair: drag the laser handle down through the
// big 1/2 block. When the laser crosses the midline (snap zone),
// the block cleaves into two 1/4 pieces and we call onComplete.
export function BlueprintSlicer({ onComplete }: Props) {
  const W = 480;
  const H = 240;
  const blockX = 30;
  const blockY = 50;
  const blockW = 148;
  const blockH = 150;
  const midY = blockY + blockH / 2;
  const snap = 12;

  const svgRef = useRef<SVGSVGElement>(null);
  const [laserY, setLaserY] = useState<number>(blockY - 20);
  const [sliced, setSliced] = useState(false);
  const [dragging, setDragging] = useState(false);
  const completedRef = useRef(false);
  const sfx = useSfx();

  const toSvgY = (clientY: number) => {
    const el = svgRef.current;
    if (!el) return laserY;
    const rect = el.getBoundingClientRect();
    const rel = (clientY - rect.top) / rect.height;
    return Math.max(blockY - 20, Math.min(blockY + blockH + 20, rel * H));
  };

  const tryComplete = (y: number) => {
    if (completedRef.current) return;
    if (Math.abs(y - midY) <= snap) {
      completedRef.current = true;
      setSliced(true);
      setLaserY(midY);
      sfx("snap");
      setTimeout(() => onComplete(), 650);
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (sliced) return;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    setDragging(true);
    const y = toSvgY(e.clientY);
    setLaserY(y);
    sfx("tick");
    tryComplete(y);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging || sliced) return;
    const y = toSvgY(e.clientY);
    setLaserY(y);
    tryComplete(y);
  };
  const onPointerUp = () => setDragging(false);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (sliced) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const delta = e.key === "ArrowDown" ? 8 : -8;
      setLaserY((y) => {
        const ny = Math.max(blockY - 20, Math.min(blockY + blockH + 20, y + delta));
        tryComplete(ny);
        return ny;
      });
      sfx("tick");
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setLaserY(midY);
      tryComplete(midY);
    }
  };

  const nearSnap = !sliced && Math.abs(laserY - midY) <= snap * 2;

  return (
    <div className="flex flex-col items-center">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="h-[240px] w-full max-w-[500px] touch-none select-none"
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <rect x={10} y={10} width={W - 20} height={H - 20} rx={14} fill="#f8fafc" stroke="#e2e8f0" strokeWidth={1.5} strokeDasharray="6 4" />

        {/* Snap rail indicator */}
        {!sliced && (
          <line
            x1={blockX - 6}
            y1={midY}
            x2={blockX + blockW + 6}
            y2={midY}
            stroke="#fb923c"
            strokeWidth={1}
            strokeDasharray="2 4"
            opacity={nearSnap ? 0.9 : 0.35}
          />
        )}

        {/* The 1/2 block (sliced or solid) */}
        {sliced ? (
          <g style={{ animation: "tappable-pulse 600ms ease-out" }}>
            <Block x={blockX} y={blockY} w={blockW} h={blockH / 2 - 2} label="1/4" />
            <Block x={blockX} y={blockY + blockH / 2 + 2} w={blockW} h={blockH / 2 - 2} label="1/4" />
            <line x1={blockX - 4} y1={midY} x2={blockX + blockW + 4} y2={midY} stroke="#f97316" strokeWidth={1.5} strokeDasharray="4 3" />
          </g>
        ) : (
          <Block x={blockX} y={blockY} w={blockW} h={blockH} label="1/2" big />
        )}

        {/* Laser beam */}
        {!sliced && (
          <line
            x1={blockX - 12}
            y1={laserY}
            x2={blockX + blockW + 12}
            y2={laserY}
            stroke="#ef4444"
            strokeWidth={nearSnap ? 2.5 : 1.5}
            opacity={0.85}
            style={{ filter: nearSnap ? "drop-shadow(0 0 6px #f97316)" : undefined }}
          />
        )}

        {/* Plus + right side + output (mirrors BlueprintSVG, non-interactive) */}
        <text x={205} y={130} textAnchor="middle" fontSize="34" fontWeight="900" fill="#334155">+</text>
        <Block x={228} y={92} w={72} h={70} label="1/4" />
        <g>
          <line x1={312} y1={130} x2={338} y2={130} stroke="#94a3b8" strokeWidth={3} />
          <polygon points="338,123 348,130 338,137" fill="#94a3b8" />
        </g>
        {sliced ? (
          <OutputBox x={358} y={60} slots={4} filled={3} label="3/4" tone="good" />
        ) : (
          <OutputBox x={378} y={92} slots={6} filled={2} label="2/6" tone="bad" tiny />
        )}

        {/* Drag handle (above block) */}
        {!sliced && (
          <g
            role="slider"
            aria-label="Laser slicer — drag down to the middle of the block"
            aria-valuemin={blockY - 20}
            aria-valuemax={blockY + blockH + 20}
            aria-valuenow={Math.round(laserY)}
            tabIndex={0}
            onPointerDown={onPointerDown}
            onKeyDown={onKeyDown}
            style={{ cursor: dragging ? "grabbing" : "grab", outline: "none" }}
          >
            <circle
              cx={blockX - 18}
              cy={laserY}
              r={14}
              fill="#fff"
              stroke="#ef4444"
              strokeWidth={2.5}
              style={{ filter: nearSnap ? "drop-shadow(0 0 8px #f97316)" : "drop-shadow(0 1px 3px rgba(0,0,0,.25))" }}
            />
            <text x={blockX - 18} y={laserY + 4} textAnchor="middle" fontSize="12" fontWeight="900" fill="#ef4444">⚡</text>
          </g>
        )}
      </svg>
      <p className="mt-2 text-center text-xs font-medium text-neutral-500">
        {sliced ? "Sliced! Pieces are the same size now." : "Drag the ⚡ laser down through the middle of the big block."}
      </p>
    </div>
  );
}

function Block({ x, y, w, h, label, big }: { x: number; y: number; w: number; h: number; label: string; big?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill="#bfdbfe" stroke="#3b82f6" strokeWidth={2.5} />
      <rect x={x + 4} y={y + 4} width={w - 8} height={6} rx={3} fill="#93c5fd" opacity={0.7} />
      <text x={x + w / 2} y={y + h / 2 + 6} textAnchor="middle" fontSize={big ? "22" : "16"} fontWeight="900" fill="#1e3a8a">
        {label}
      </text>
    </g>
  );
}

function OutputBox({ x, y, slots, filled, label, tone, tiny }: { x: number; y: number; slots: number; filled: number; label: string; tone: "good" | "bad"; tiny?: boolean }) {
  const slotH = tiny ? 12 : 28;
  const slotPad = tiny ? 2 : 4;
  const innerW = tiny ? 60 : 92;
  const totalH = slots * (slotH + slotPad) - slotPad;
  const boxW = innerW + 16;
  const boxH = totalH + 16;
  const border = tone === "good" ? "#10b981" : "#f97316";
  return (
    <g>
      <rect x={x} y={y} width={boxW} height={boxH} rx={8} fill="#fafafa" stroke={border} strokeWidth={2.5} />
      {Array.from({ length: slots }).map((_, i) => {
        const sy = y + 8 + i * (slotH + slotPad);
        const isFilled = i < filled;
        return (
          <g key={i}>
            <rect x={x + 8} y={sy} width={innerW} height={slotH} rx={3} fill="none" stroke="#e5e7eb" strokeWidth={1} />
            {isFilled && <rect x={x + 10} y={sy + 2} width={innerW - 4} height={slotH - 4} rx={3} fill="#bfdbfe" stroke="#3b82f6" strokeWidth={1.5} />}
          </g>
        );
      })}
      <text x={x + boxW / 2} y={y + boxH + 18} textAnchor="middle" fontSize="13" fontWeight="800" fill="#475569">{label}</text>
    </g>
  );
}
