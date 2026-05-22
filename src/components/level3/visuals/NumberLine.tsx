import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import type { NumberLineSpec } from "@/lib/level3/types";

/**
 * Interactive horizontal number line — a glowing "pathway" with tick marks
 * at 0, 1/d, 2/d … 1 (or up to `max`). Renders a draggable vehicle that
 * snaps to the nearest tick. Used by both the persistent case file (read
 * only — `interactive={false}`) and the repair workspace.
 */

const ACCENT = "#5fd0ff";
const ACCENT_SOFT = "color-mix(in oklab, #5fd0ff 30%, transparent)";
const TRACK_BG = "color-mix(in oklab, #5fd0ff 12%, transparent)";

export function NumberLine({
  spec,
  /** Normalized (0..max) position of the live cart. */
  value,
  onChange,
  /** Optional ghost showing ZED's original drop. */
  ghostAt,
  interactive = true,
  width = 520,
}: {
  spec: NumberLineSpec;
  value: number;
  onChange?: (v: number) => void;
  ghostAt?: number;
  interactive?: boolean;
  width?: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const max = spec.max;
  const ticks = spec.ticks * max; // sub-tick count, e.g. 4 ticks on 0..1

  // Build tick labels: 0, 1/d, 2/d, …, d/d (and possibly past 1)
  const tickPositions = Array.from({ length: ticks + 1 }).map((_, i) => i / ticks);

  const norm = (px: number) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    const ratio = Math.max(0, Math.min(1, (px - rect.left) / rect.width));
    return ratio * max;
  };

  const handlePointer = (e: React.PointerEvent) => {
    if (!interactive || !onChange) return;
    onChange(norm(e.clientX));
  };

  useEffect(() => {
    if (!dragging) return;
    const move = (e: PointerEvent) => {
      if (!onChange) return;
      onChange(norm(e.clientX));
    };
    const up = () => setDragging(false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragging, onChange]);

  const valuePct = (value / max) * 100;
  const ghostPct = ghostAt != null ? (ghostAt / max) * 100 : null;

  const themeGlow =
    spec.theme === "bridge"
      ? "linear-gradient(90deg, #5fd0ff 0%, #2a8ec9 100%)"
      : spec.theme === "track"
        ? "linear-gradient(90deg, #ffe98a 0%, #f5824a 100%)"
        : "linear-gradient(90deg, #7df4c6 0%, #5fd0ff 100%)";

  return (
    <div className="w-full flex flex-col items-center gap-3" style={{ maxWidth: width }}>
      {/* Pathway label */}
      <p className="label-eyebrow text-cyan-300/80 self-start">
        {spec.theme === "bridge"
          ? "Delivery bridge"
          : spec.theme === "track"
            ? "Race track"
            : "Candy trail"}{" "}
        · 0 → {max}
      </p>

      {/* Rail */}
      <div
        ref={trackRef}
        onPointerDown={(e) => {
          if (!interactive) return;
          handlePointer(e);
          setDragging(true);
        }}
        className="relative w-full h-20 rounded-full select-none touch-none"
        style={{
          background: TRACK_BG,
          border: `2px solid ${ACCENT_SOFT}`,
          cursor: interactive ? "pointer" : "default",
          boxShadow: `0 0 24px ${ACCENT_SOFT}`,
        }}
        aria-label={`Number line from 0 to ${max} with ${ticks} equal segments.`}
        role={interactive ? "slider" : "img"}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={Number(value.toFixed(3))}
      >
        {/* Glowing inner track */}
        <div
          aria-hidden
          className="absolute inset-y-7 left-3 right-3 rounded-full opacity-50"
          style={{ background: themeGlow }}
        />

        {/* Tick marks */}
        {tickPositions.map((t, i) => {
          const pct = t * 100;
          const isWhole = i % spec.ticks === 0;
          return (
            <div
              key={i}
              className="absolute top-0 bottom-0 w-px"
              style={{
                left: `${pct}%`,
                background: isWhole ? ACCENT : ACCENT_SOFT,
              }}
              aria-hidden
            />
          );
        })}

        {/* Tick labels */}
        {tickPositions.map((t, i) => {
          const pct = t * 100;
          const wholeIdx = Math.floor(i / spec.ticks);
          const subIdx = i % spec.ticks;
          let label = "";
          if (subIdx === 0) label = String(wholeIdx);
          else label = `${subIdx}/${spec.ticks}`;
          // For max=2 cases, show 1+sub as e.g. 5/4
          if (max === 2 && i > spec.ticks && subIdx !== 0) {
            label = `${i}/${spec.ticks}`;
          }
          return (
            <span
              key={`lbl-${i}`}
              className="absolute -bottom-7 text-xs font-mono text-cyan-100/80 -translate-x-1/2"
              style={{ left: `${pct}%` }}
            >
              {label}
            </span>
          );
        })}

        {/* Ghost of ZED's drop */}
        {ghostPct != null && (
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
            style={{ left: `${ghostPct}%` }}
            aria-label="ZED's original guess"
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                background: "rgba(255, 142, 142, 0.18)",
                border: "2px dashed #ff8e8e",
                color: "#ffb8b8",
              }}
              title="ZED's guess"
            >
              ZED
            </div>
          </div>
        )}

        {/* Live cart */}
        <motion.div
          drag={interactive ? "x" : false}
          dragMomentum={false}
          dragConstraints={trackRef}
          onPointerDown={(e) => {
            if (!interactive) return;
            e.stopPropagation();
            setDragging(true);
          }}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
          style={{ left: `${valuePct}%` }}
          animate={{ scale: dragging ? 1.1 : 1 }}
        >
          <VehicleIcon kind={spec.vehicle} />
        </motion.div>
      </div>
    </div>
  );
}

function VehicleIcon({ kind }: { kind: NumberLineSpec["vehicle"] }) {
  const base =
    "w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-2xl select-none";
  const style = {
    background: "linear-gradient(135deg, #ffe98a 0%, #f5c84a 100%)",
    color: "#04162e",
    boxShadow: "0 0 24px rgba(255,233,138,0.6)",
    border: "2px solid #fff8c8",
  } as React.CSSProperties;
  if (kind === "racecar") return <div className={base} style={style}>🏎️</div>;
  if (kind === "drone") return <div className={base} style={style}>🛸</div>;
  if (kind === "treasure")
    return (
      <div className={base} style={style}>
        <Sparkles className="w-7 h-7" />
      </div>
    );
  return <div className={base} style={style}>🚚</div>;
}

/** Read-only mini rail used in the persistent case file. */
export function NumberLineMini({
  spec,
  ghostAt,
}: {
  spec: NumberLineSpec;
  ghostAt: number;
}) {
  return (
    <div className="flex flex-col items-center w-full">
      <NumberLine
        spec={spec}
        value={ghostAt}
        ghostAt={ghostAt}
        interactive={false}
        width={320}
      />
    </div>
  );
}
