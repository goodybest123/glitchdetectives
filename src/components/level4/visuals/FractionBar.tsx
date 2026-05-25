import { motion } from "framer-motion";

/**
 * Horizontal segmented bar showing `total` equal cells with `filled`
 * cells highlighted. Used by every L4 workspace and the case file.
 */
export function FractionBar({
  total,
  filled,
  width = 320,
  height = 44,
  accent = "#ffb86b",
  label,
  ghostFilled,
}: {
  total: number;
  filled: number;
  width?: number;
  height?: number;
  accent?: string;
  label?: string;
  /** Optional translucent overlay showing ZED's wrong fill. */
  ghostFilled?: number;
}) {
  const cellWidth = width / total;
  const cells = Array.from({ length: total });
  return (
    <div className="flex flex-col items-center gap-1.5">
      {label && (
        <span className="label-eyebrow text-amber-100/80 self-start">{label}</span>
      )}
      <div
        className="relative rounded-xl overflow-hidden border"
        style={{
          width,
          height,
          background: "rgba(255,184,107,0.08)",
          borderColor: "color-mix(in oklab, #ffb86b 35%, transparent)",
        }}
        role="img"
        aria-label={`${filled} out of ${total} parts filled`}
      >
        {cells.map((_, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0"
            style={{
              left: i * cellWidth,
              width: cellWidth,
              borderRight:
                i < total - 1
                  ? "1px solid color-mix(in oklab, #ffb86b 25%, transparent)"
                  : undefined,
            }}
          />
        ))}
        {cells.map((_, i) => {
          const isFilled = i < filled;
          const isGhost = ghostFilled != null && i < ghostFilled && i >= filled;
          return (
            <motion.div
              key={`fill-${i}`}
              initial={false}
              animate={{
                opacity: isFilled ? 1 : isGhost ? 0.35 : 0,
                scale: isFilled ? 1 : 0.98,
              }}
              transition={{ duration: 0.25, delay: i * 0.02 }}
              className="absolute top-0 bottom-0"
              style={{
                left: i * cellWidth + 2,
                width: cellWidth - 4,
                top: 4,
                bottom: 4,
                background: isFilled
                  ? `linear-gradient(180deg, ${accent} 0%, color-mix(in oklab, ${accent} 70%, #f5824a) 100%)`
                  : `repeating-linear-gradient(45deg, ${accent}33 0 4px, transparent 4px 8px)`,
                borderRadius: 6,
                boxShadow: isFilled
                  ? `0 0 12px color-mix(in oklab, ${accent} 50%, transparent)`
                  : undefined,
              }}
            />
          );
        })}
      </div>
      <span className="text-xs font-mono text-amber-100/70">
        {filled}/{total}
      </span>
    </div>
  );
}
