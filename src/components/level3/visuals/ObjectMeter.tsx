import { motion } from "framer-motion";
import { Battery, GlassWater, Fuel, Candy, Pizza } from "lucide-react";
import type { CompareObject } from "@/lib/level3/types";

/**
 * A meter that fills to a fraction of its height — used in the Comparison
 * Observatory and the persistent case file. Shows both the visual fill
 * and the numeric fraction so children reason from quantity, not symbols.
 */
export function ObjectMeter({
  numerator,
  denominator,
  object,
  size = 160,
  label,
}: {
  numerator: number;
  denominator: number;
  object: CompareObject;
  size?: number;
  label?: string;
}) {
  const ratio = Math.max(0, Math.min(1, numerator / denominator));
  const fillH = Math.round(size * 0.85 * ratio);

  const palette = OBJECT_PALETTE[object];
  const Icon = OBJECT_ICON[object];

  return (
    <div className="flex flex-col items-center gap-2">
      {label && (
        <p className="label-eyebrow text-cyan-300/80">{label}</p>
      )}
      <div
        className="relative rounded-2xl overflow-hidden flex flex-col-reverse"
        style={{
          width: Math.round(size * 0.55),
          height: size,
          background: "rgba(8,22,48,0.55)",
          border: `2px solid ${palette.border}`,
          boxShadow: `0 0 18px ${palette.glow}`,
        }}
        role="img"
        aria-label={`${object} filled to ${numerator} out of ${denominator}`}
      >
        {/* Fill */}
        <motion.div
          initial={false}
          animate={{ height: fillH }}
          transition={{ type: "spring", stiffness: 140, damping: 22 }}
          className="w-full"
          style={{
            background: palette.fill,
            boxShadow: `inset 0 -10px 20px ${palette.glow}`,
          }}
        />
        {/* Tick marks for every equal segment */}
        {Array.from({ length: denominator - 1 }).map((_, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 h-px"
            style={{
              bottom: `${((i + 1) / denominator) * 85 + 7.5}%`,
              background: "rgba(255,255,255,0.25)",
            }}
            aria-hidden
          />
        ))}
        {/* Object icon overlay (top) */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-cyan-50/80">
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className="font-mono text-sm text-cyan-50">
        <span className="font-bold">{numerator}</span>/
        <span className="font-bold">{denominator}</span>
      </div>
    </div>
  );
}

const OBJECT_PALETTE: Record<
  CompareObject,
  { fill: string; border: string; glow: string }
> = {
  juice: {
    fill: "linear-gradient(180deg, #ffb38a, #e85d3a)",
    border: "color-mix(in oklab, #ffb38a 60%, transparent)",
    glow: "rgba(232,93,58,0.35)",
  },
  battery: {
    fill: "linear-gradient(180deg, #7df4c6, #2bb789)",
    border: "color-mix(in oklab, #7df4c6 60%, transparent)",
    glow: "rgba(125,244,198,0.35)",
  },
  fueltank: {
    fill: "linear-gradient(180deg, #c9a0dc, #6c5ce7)",
    border: "color-mix(in oklab, #c9a0dc 60%, transparent)",
    glow: "rgba(108,92,231,0.35)",
  },
  candyjar: {
    fill: "linear-gradient(180deg, #ffe98a, #f5c84a)",
    border: "color-mix(in oklab, #ffe98a 60%, transparent)",
    glow: "rgba(255,233,138,0.35)",
  },
  pizza: {
    fill: "linear-gradient(180deg, #f3c97a, #c97e3a)",
    border: "color-mix(in oklab, #f3c97a 60%, transparent)",
    glow: "rgba(243,201,122,0.35)",
  },
};

const OBJECT_ICON: Record<CompareObject, typeof Battery> = {
  juice: GlassWater,
  battery: Battery,
  fueltank: Fuel,
  candyjar: Candy,
  pizza: Pizza,
};
