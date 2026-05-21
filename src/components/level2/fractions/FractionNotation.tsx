import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

type State = "corrupted" | "repaired" | "neutral";

/**
 * Holographic numerator/denominator chip. Highlights the corrupted field
 * with a soft red pulse; switches to mint when repaired.
 */
export function FractionNotation({
  numerator,
  denominator,
  corruptedField,
  state = "corrupted",
  size = "md",
}: {
  numerator: number | string;
  denominator: number | string;
  /** Which field is highlighted ("none" for neutral display). */
  corruptedField?: "numerator" | "denominator" | "both" | "none";
  state?: State;
  size?: "sm" | "md" | "lg";
}) {
  const num = corruptedField === "numerator" || corruptedField === "both";
  const den = corruptedField === "denominator" || corruptedField === "both";

  const dim =
    size === "lg"
      ? { font: "text-5xl sm:text-6xl", pad: "px-5 py-3", gap: "gap-1.5" }
      : size === "sm"
        ? { font: "text-xl", pad: "px-2 py-1", gap: "gap-1" }
        : { font: "text-3xl sm:text-4xl", pad: "px-4 py-2", gap: "gap-1.5" };

  const colorFor = (highlight: boolean) => {
    if (state === "repaired") return "#7df4c6";
    if (highlight && state === "corrupted") return "#ff8e8e";
    return "#e6faff";
  };

  return (
    <div className="inline-flex flex-col items-center" aria-live="polite">
      <div
        className={`relative inline-flex items-center justify-center rounded-2xl border font-mono font-bold ${dim.pad}`}
        style={{
          background: "rgba(6,16,38,0.65)",
          borderColor:
            state === "repaired"
              ? "color-mix(in oklab, #7df4c6 55%, transparent)"
              : "color-mix(in oklab, #5fd0ff 35%, transparent)",
          boxShadow:
            state === "repaired"
              ? "0 0 24px rgba(125, 244, 198, 0.35)"
              : "0 0 20px rgba(95, 208, 255, 0.18)",
        }}
      >
        <div className={`flex flex-col items-center ${dim.gap}`}>
          <motion.span
            className={dim.font}
            style={{ color: colorFor(num) }}
            animate={num && state === "corrupted" ? { opacity: [1, 0.55, 1] } : { opacity: 1 }}
            transition={{ repeat: Infinity, duration: 1.6 }}
          >
            {numerator}
          </motion.span>
          <span
            className="w-full h-px"
            style={{ background: "color-mix(in oklab, #5fd0ff 45%, transparent)" }}
          />
          <motion.span
            className={dim.font}
            style={{ color: colorFor(den) }}
            animate={den && state === "corrupted" ? { opacity: [1, 0.55, 1] } : { opacity: 1 }}
            transition={{ repeat: Infinity, duration: 1.6 }}
          >
            {denominator}
          </motion.span>
        </div>
        {state === "corrupted" && corruptedField && corruptedField !== "none" && (
          <span
            className="absolute -top-2 -right-2 inline-flex items-center justify-center w-5 h-5 rounded-full"
            style={{ background: "#ff8e8e", color: "#3a0e0e" }}
            aria-hidden
          >
            <AlertTriangle className="w-3 h-3" />
          </span>
        )}
        {state === "repaired" && (
          <span
            className="absolute -top-2 -right-2 inline-flex items-center justify-center w-5 h-5 rounded-full"
            style={{ background: "#7df4c6", color: "#0e3a2a" }}
            aria-hidden
          >
            <CheckCircle2 className="w-3 h-3" />
          </span>
        )}
      </div>
    </div>
  );
}
