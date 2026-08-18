import { useRef, useState } from "react";
import { useSfx } from "@/hooks/useSfx";

type Props = { onComplete: () => void };

// Interactive Circuit repair: 3 tappable cut guides on the 1/2 power cell.
// Tap each one to slice. Then a final "EJECT 1/8" button removes the bottom
// segment (the −1/8 subtraction) and we're done.
export function CircuitSegmenter({ onComplete }: Props) {
  const W = 480;
  const H = 240;
  const cellX = 30,
    cellY = 40,
    cellW = 130,
    cellH = 160;
  const [cuts, setCuts] = useState<[boolean, boolean, boolean]>([false, false, false]);
  const [ejected, setEjected] = useState(false);
  const completedRef = useRef(false);
  const sfx = useSfx();

  const allCut = cuts.every(Boolean);

  const doCut = (i: 0 | 1 | 2) => {
    if (cuts[i]) return;
    setCuts((prev) => {
      const next = [...prev] as [boolean, boolean, boolean];
      next[i] = true;
      return next;
    });
    sfx("tick");
  };

  const doEject = () => {
    if (!allCut || ejected || completedRef.current) return;
    completedRef.current = true;
    setEjected(true);
    sfx("snap");
    setTimeout(() => onComplete(), 700);
  };

  // After all 3 cuts → cell is 4 × 1/8. Cut guides at y = cellY + cellH * k/4 for k=1,2,3.
  const cutY = (k: number) => cellY + (cellH * k) / 4;

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-[240px] w-full max-w-[500px] touch-none select-none"
      >
        <rect x={10} y={10} width={W - 20} height={H - 20} rx={14} fill="#0f172a" />
        <g stroke="#1e293b" strokeWidth={1} fill="none">
          <path d="M 20 60 L 200 60 L 200 200" />
          <path d="M 460 80 L 360 80 L 360 180" />
        </g>

        {/* LEFT: power cell */}
        <g>
          <rect
            x={cellX}
            y={cellY}
            width={cellW}
            height={cellH}
            rx={10}
            fill={allCut ? "none" : "#34d399"}
            stroke="#10b981"
            strokeWidth={2.5}
          />
          {!allCut && (
            <rect
              x={cellX + 6}
              y={cellY + 6}
              width={cellW - 12}
              height={10}
              rx={4}
              fill="#6ee7b7"
              opacity={0.8}
            />
          )}
          {!allCut && (
            <text
              x={cellX + cellW / 2}
              y={cellY + cellH / 2 + 8}
              textAnchor="middle"
              fontSize="24"
              fontWeight="900"
              fill="#064e3b"
            >
              1/2
            </text>
          )}

          {/* Once cut, render four segments (with bottom ejected after Eject) */}
          {allCut &&
            Array.from({ length: 4 }).map((_, i) => {
              const segH = cellH / 4;
              const sy = cellY + i * segH;
              const removed = ejected && i === 3;
              return (
                <g
                  key={i}
                  style={{
                    transition: "transform 500ms ease, opacity 500ms ease",
                    transform: removed ? `translate(60px,0)` : undefined,
                    opacity: removed ? 0.25 : 1,
                  }}
                >
                  <rect
                    x={cellX + 4}
                    y={sy + 3}
                    width={cellW - 8}
                    height={segH - 6}
                    rx={4}
                    fill={removed ? "#1e293b" : "#34d399"}
                    stroke={removed ? "#475569" : "#10b981"}
                    strokeWidth={1.5}
                    strokeDasharray={removed ? "4 3" : undefined}
                  />
                  <text
                    x={cellX + cellW / 2}
                    y={sy + segH / 2 + 5}
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="800"
                    fill={removed ? "#64748b" : "#064e3b"}
                  >
                    1/8
                  </text>
                </g>
              );
            })}
        </g>

        {/* Cut guides */}
        {!allCut &&
          ([0, 1, 2] as const).map((k) => {
            const isCut = cuts[k];
            const y = cutY(k + 1);
            return (
              <g key={k}>
                {isCut ? (
                  <line
                    x1={cellX + 4}
                    y1={y}
                    x2={cellX + cellW - 4}
                    y2={y}
                    stroke="#fbbf24"
                    strokeWidth={2}
                    style={{ animation: "tappable-pulse 500ms ease-out" }}
                  />
                ) : (
                  <g
                    role="button"
                    aria-label={`Cut line ${k + 1} of 3`}
                    tabIndex={0}
                    onPointerDown={(e) => {
                      e.preventDefault();
                      doCut(k);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        doCut(k);
                      }
                    }}
                    style={{ cursor: "pointer", outline: "none" }}
                  >
                    <rect
                      x={cellX - 4}
                      y={y - 12}
                      width={cellW + 8}
                      height={24}
                      fill="transparent"
                    />
                    <line
                      x1={cellX + 4}
                      y1={y}
                      x2={cellX + cellW - 4}
                      y2={y}
                      stroke="#fbbf24"
                      strokeWidth={1.5}
                      strokeDasharray="4 3"
                      style={{ animation: "tappable-pulse 1.4s ease-in-out infinite" }}
                    />
                    <circle
                      cx={cellX + cellW + 8}
                      cy={y}
                      r={5}
                      fill="#fbbf24"
                      stroke="#b45309"
                      strokeWidth={1}
                    />
                  </g>
                )}
              </g>
            );
          })}

        <text x={195} y={130} textAnchor="middle" fontSize="32" fontWeight="900" fill="#cbd5e1">
          −
        </text>

        {/* Chip */}
        <g>
          <rect
            x={220}
            y={108}
            width={56}
            height={44}
            rx={4}
            fill="#fde68a"
            stroke="#ca8a04"
            strokeWidth={2}
          />
          {Array.from({ length: 4 }).map((_, i) => (
            <line
              key={`t${i}`}
              x1={228 + i * 12}
              y1={102}
              x2={228 + i * 12}
              y2={108}
              stroke="#ca8a04"
              strokeWidth={1.5}
            />
          ))}
          {Array.from({ length: 4 }).map((_, i) => (
            <line
              key={`b${i}`}
              x1={228 + i * 12}
              y1={152}
              x2={228 + i * 12}
              y2={158}
              stroke="#ca8a04"
              strokeWidth={1.5}
            />
          ))}
          <text x={248} y={135} textAnchor="middle" fontSize="13" fontWeight="900" fill="#713f12">
            1/8
          </text>
        </g>

        <g>
          <line x1={300} y1={130} x2={326} y2={130} stroke="#64748b" strokeWidth={3} />
          <polygon points="326,123 336,130 326,137" fill="#64748b" />
        </g>

        {/* Output board */}
        {ejected ? (
          <OutputBoard x={350} y={40} slots={8} filled={3} label="3/8" tone="good" />
        ) : (
          <OutputBoard x={355} y={70} slots={6} filled={0} label="0/6" tone="bad" tiny />
        )}
      </svg>

      <div className="mt-2 flex flex-col items-center gap-2">
        <p className="text-center text-xs font-medium text-neutral-500">
          {ejected
            ? "Power is safe — 3/8 left!"
            : allCut
              ? "All sliced! Now eject one 1/8 to subtract."
              : `Tap each dotted line to slice the cell into eighths. (${cuts.filter(Boolean).length}/3)`}
        </p>
        {allCut && !ejected && (
          <button
            type="button"
            onClick={doEject}
            className="inline-flex items-center gap-2 rounded-full bg-[#ef4444] px-5 py-2 text-xs font-bold tracking-wider text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#dc2626]"
          >
            ⏏ EJECT 1/8
          </button>
        )}
      </div>
    </div>
  );
}

function OutputBoard({
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
  const w = tiny ? 80 : 110;
  const segH = tiny ? 14 : 160 / slots;
  const h = segH * slots;
  const border = tone === "good" ? "#10b981" : "#f97316";
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={8}
        fill="#0b1220"
        stroke={border}
        strokeWidth={2.5}
      />
      {Array.from({ length: slots }).map((_, i) => {
        const sy = y + i * segH;
        const isFilled = i >= slots - filled;
        return (
          <g key={i}>
            <line x1={x} y1={sy} x2={x + w} y2={sy} stroke="#1e293b" strokeWidth={1} />
            {isFilled && (
              <rect
                x={x + 3}
                y={sy + 2}
                width={w - 6}
                height={segH - 4}
                rx={2}
                fill="#34d399"
                stroke="#10b981"
                strokeWidth={1}
              />
            )}
          </g>
        );
      })}
      <text
        x={x + w / 2}
        y={y + h + 18}
        textAnchor="middle"
        fontSize="13"
        fontWeight="800"
        fill="#e2e8f0"
      >
        {label}
      </text>
    </g>
  );
}
