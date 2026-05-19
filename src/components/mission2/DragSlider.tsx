import { useCallback, useRef, useState, type ReactNode } from "react";
import { GripHorizontal, GripVertical } from "lucide-react";
import { motion } from "framer-motion";

type Orientation = "horizontal" | "vertical";

export type DragSliderProps = {
  orientation: Orientation;
  value: number; // 0-100
  onChange: (v: number) => void;
  onSnap?: () => void;
  locked?: boolean;
  isRepaired?: boolean;
  children: ReactNode; // the SVG shape rendered behind the handle
};

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export function DragSlider({
  orientation,
  value,
  onChange,
  onSnap,
  locked = false,
  isRepaired = false,
  children,
}: DragSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const computePct = useCallback(
    (clientX: number, clientY: number) => {
      const el = containerRef.current;
      if (!el) return value;
      const rect = el.getBoundingClientRect();
      const raw =
        orientation === "horizontal"
          ? ((clientX - rect.left) / rect.width) * 100
          : ((clientY - rect.top) / rect.height) * 100;
      return clamp(raw, 5, 95);
    },
    [orientation, value],
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    if (locked) return;
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    setDragging(true);
    const pct = computePct(e.clientX, e.clientY);
    // Soft snap while dragging
    onChange(Math.abs(pct - 50) <= 1.5 ? 50 : pct);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging || locked) return;
    const pct = computePct(e.clientX, e.clientY);
    onChange(Math.abs(pct - 50) <= 1.5 ? 50 : pct);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragging) return;
    setDragging(false);
    try {
      (e.currentTarget as Element).releasePointerCapture(e.pointerId);
    } catch {
      /* noop */
    }
    const pct = computePct(e.clientX, e.clientY);
    if (Math.abs(pct - 50) <= 2) {
      onChange(50);
      onSnap?.();
    }
  };

  const handleStyle: React.CSSProperties =
    orientation === "horizontal"
      ? {
          left: `calc(${value}% - 18px)`,
          top: 0,
          bottom: 0,
          width: 36,
          cursor: locked ? "default" : "ew-resize",
        }
      : {
          top: `calc(${value}% - 18px)`,
          left: 0,
          right: 0,
          height: 36,
          cursor: locked ? "default" : "ns-resize",
        };

  const lineStyle: React.CSSProperties =
    orientation === "horizontal"
      ? {
          left: `calc(${value}% - 2px)`,
          top: 4,
          bottom: 4,
          width: 4,
        }
      : {
          top: `calc(${value}% - 2px)`,
          left: 4,
          right: 4,
          height: 4,
        };

  return (
    <div
      ref={containerRef}
      className="relative w-full select-none"
      style={{ touchAction: "none" }}
    >
      {children}

      {/* Partition line overlay */}
      <div
        aria-hidden
        className="absolute rounded-full pointer-events-none"
        style={{
          ...lineStyle,
          background: isRepaired ? "#16a34a" : "#1e293b",
          boxShadow: isRepaired
            ? "0 0 14px rgba(34,197,94,0.7)"
            : "0 1px 3px rgba(0,0,0,0.25)",
        }}
      />

      {/* Draggable handle */}
      <motion.div
        role="slider"
        aria-orientation={orientation}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(value)}
        tabIndex={locked ? -1 : 0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        whileTap={{ scale: locked ? 1 : 0.96 }}
        className="absolute flex items-center justify-center"
        style={handleStyle}
      >
        <div
          className="flex items-center justify-center rounded-xl border-2 shadow-lg"
          style={{
            background: isRepaired ? "#22c55e" : "#fde047",
            borderColor: "#1e293b",
            width: orientation === "horizontal" ? 28 : 56,
            height: orientation === "horizontal" ? 56 : 28,
            transition: "background 0.2s",
          }}
        >
          {orientation === "horizontal" ? (
            <GripVertical className="w-5 h-5" style={{ color: "#1e293b" }} />
          ) : (
            <GripHorizontal className="w-5 h-5" style={{ color: "#1e293b" }} />
          )}
        </div>
      </motion.div>
    </div>
  );
}
