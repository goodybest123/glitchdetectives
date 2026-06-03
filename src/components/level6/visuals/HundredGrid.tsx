import { motion } from "framer-motion";

/** 10×10 hundred grid for decimal / percent shading. */
export function HundredGrid({
  filled,
  size = 200,
  accent = "#5fd0ff",
  label,
}: {
  filled: number; // 0-100
  size?: number;
  accent?: string;
  label?: string;
}) {
  const cellSize = size / 10;
  const cells = Array.from({ length: 100 });
  const f = Math.max(0, Math.min(100, Math.round(filled)));
  return (
    <div className="flex flex-col items-center gap-1.5">
      {label && (
        <span className="label-eyebrow text-cyan-100/80">{label}</span>
      )}
      <div
        className="relative rounded-lg border overflow-hidden"
        style={{
          width: size,
          height: size,
          background: "rgba(95,208,255,0.06)",
          borderColor: "color-mix(in oklab, #5fd0ff 35%, transparent)",
        }}
        role="img"
        aria-label={`${f} of 100 squares filled`}
      >
        {cells.map((_, i) => {
          const isFilled = i < f;
          const row = Math.floor(i / 10);
          const col = i % 10;
          return (
            <motion.div
              key={i}
              initial={false}
              animate={{ opacity: isFilled ? 1 : 0.15 }}
              transition={{ duration: 0.15, delay: i * 0.003 }}
              className="absolute"
              style={{
                left: col * cellSize,
                top: row * cellSize,
                width: cellSize - 0.5,
                height: cellSize - 0.5,
                background: isFilled
                  ? `linear-gradient(180deg, ${accent}, color-mix(in oklab, ${accent} 55%, #b18bff))`
                  : "rgba(95,208,255,0.08)",
                border: "0.5px solid color-mix(in oklab, #5fd0ff 25%, transparent)",
              }}
            />
          );
        })}
      </div>
      <span className="text-xs font-mono text-cyan-100/70">
        {f}/100
      </span>
    </div>
  );
}
