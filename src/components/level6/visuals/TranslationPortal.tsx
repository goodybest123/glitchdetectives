import { motion } from "framer-motion";
import type { ReactNode } from "react";

/** Holographic portal node used in the Nexus Translator workspace. */
export function TranslationPortal({
  label,
  value,
  active,
  linked,
  onClick,
  ariaLabel,
}: {
  label: string;
  value: ReactNode;
  active?: boolean;
  linked?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={onClick ? { scale: 1.03 } : undefined}
      whileTap={onClick ? { scale: 0.97 } : undefined}
      aria-label={ariaLabel ?? label}
      aria-pressed={!!active}
      className="relative flex flex-col items-center gap-2 px-5 py-4 rounded-2xl border min-w-[120px]"
      style={{
        background: linked
          ? "linear-gradient(135deg, rgba(125,244,198,0.18), rgba(95,208,255,0.12))"
          : active
          ? "linear-gradient(135deg, rgba(177,139,255,0.22), rgba(95,208,255,0.16))"
          : "rgba(95,208,255,0.08)",
        borderColor: linked
          ? "color-mix(in oklab, #7df4c6 60%, transparent)"
          : active
          ? "color-mix(in oklab, #b18bff 60%, transparent)"
          : "color-mix(in oklab, #5fd0ff 30%, transparent)",
        boxShadow: linked
          ? "0 0 24px rgba(125,244,198,0.35)"
          : active
          ? "0 0 22px rgba(177,139,255,0.4)"
          : undefined,
      }}
    >
      <span className="label-eyebrow text-cyan-200/80">{label}</span>
      <span className="font-mono text-2xl font-bold text-cyan-50">{value}</span>
    </motion.button>
  );
}
