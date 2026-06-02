import { motion } from "framer-motion";

const CYAN = "#5fd0ff";

/**
 * Power-grid themed segmented fraction bar (cyan/violet glow).
 * Drop-in replacement for L4's FractionBar within Level 5.
 */
export function EnergyCell({
  total,
  filled,
  width = 320,
  height = 44,
  accent = CYAN,
  label,
  ariaLabel,
}: {
  total: number;
  filled: number;
  width?: number;
  height?: number;
  accent?: string;
  label?: string;
  ariaLabel?: string;
}) {
  const safeTotal = Math.max(1, total);
  const cellWidth = width / safeTotal;
  const cells = Array.from({ length: safeTotal });
  return (
    <div className="flex flex-col items-center gap-1.5">
      {label && (
        <span className="label-eyebrow text-cyan-100/80 self-start">{label}</span>
      )}
      <div
        className="relative rounded-xl overflow-hidden border"
        style={{
          width,
          height,
          background: "rgba(95,208,255,0.06)",
          borderColor: "color-mix(in oklab, #5fd0ff 35%, transparent)",
        }}
        role="img"
        aria-label={ariaLabel ?? `${filled} out of ${safeTotal} parts charged`}
      >
        {cells.map((_, i) => (
          <div
            key={`grid-${i}`}
            className="absolute top-0 bottom-0"
            style={{
              left: i * cellWidth,
              width: cellWidth,
              borderRight:
                i < safeTotal - 1
                  ? "1px solid color-mix(in oklab, #5fd0ff 25%, transparent)"
                  : undefined,
            }}
          />
        ))}
        {cells.map((_, i) => {
          const isFilled = i < filled;
          return (
            <motion.div
              key={`fill-${i}`}
              initial={false}
              animate={{ opacity: isFilled ? 1 : 0, scale: isFilled ? 1 : 0.96 }}
              transition={{ duration: 0.2, delay: i * 0.02 }}
              className="absolute"
              style={{
                left: i * cellWidth + 2,
                width: cellWidth - 4,
                top: 4,
                bottom: 4,
                background: `linear-gradient(180deg, ${accent} 0%, color-mix(in oklab, ${accent} 60%, #b18bff) 100%)`,
                borderRadius: 6,
                boxShadow: isFilled
                  ? `0 0 14px color-mix(in oklab, ${accent} 60%, transparent)`
                  : undefined,
              }}
            />
          );
        })}
      </div>
      <span className="text-xs font-mono text-cyan-100/70">
        {filled}/{safeTotal}
      </span>
    </div>
  );
}
