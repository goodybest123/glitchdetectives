import { useState } from "react";
import { motion } from "framer-motion";
import { Battery, CheckCircle2, Cog, Gem, Minus, Pill, Plus } from "lucide-react";
import type { FractionVisualSpec } from "@/lib/level2/types";

const LIT = "#5fd0ff";
const LIT_BG = "color-mix(in oklab, #5fd0ff 55%, transparent)";
const DARK = "color-mix(in oklab, #5fd0ff 12%, transparent)";
const STROKE = "color-mix(in oklab, #5fd0ff 45%, transparent)";

/**
 * Tap-to-count visual. Renders the same shape as the persistent left pane,
 * but on the right workspace each cell/object can be tapped to register a
 * "scan". Used for M1, M2, M4 detect phase.
 */
export function TapToCountVisual({
  spec,
  /** Which indices are valid taps for counting (e.g. only lit cells, or all cells). */
  countableIndices,
  onCountChange,
  size = 220,
  ariaLabel,
}: {
  spec: FractionVisualSpec;
  countableIndices: number[];
  onCountChange?: (count: number) => void;
  size?: number;
  ariaLabel?: string;
}) {
  const [tapped, setTapped] = useState<Set<number>>(new Set());

  const tap = (i: number) => {
    if (!countableIndices.includes(i)) return;
    const next = new Set(tapped);
    if (next.has(i)) next.delete(i);
    else next.add(i);
    setTapped(next);
    onCountChange?.(next.size);
  };

  const isLit = (i: number) => spec.selected.includes(i);
  const isTapped = (i: number) => tapped.has(i);

  const cellStyle = (i: number) => {
    const lit = isLit(i);
    const tappedNow = isTapped(i);
    return {
      background: lit ? LIT_BG : DARK,
      boxShadow: tappedNow ? `inset 0 0 18px ${LIT}, 0 0 12px ${LIT}` : undefined,
      outline: tappedNow ? `2px solid ${LIT}` : `1px solid ${STROKE}`,
      cursor: countableIndices.includes(i) ? "pointer" : "not-allowed",
    } as React.CSSProperties;
  };

  if (spec.kind === "bar") {
    const h = Math.round(size * 0.45);
    return (
      <div
        className="rounded-2xl overflow-hidden flex"
        style={{ width: size, height: h }}
        role="group"
        aria-label={ariaLabel}
      >
        {Array.from({ length: spec.total }).map((_, i) => (
          <motion.button
            key={i}
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={() => tap(i)}
            aria-label={`Part ${i + 1}${isLit(i) ? ", lit" : ""}${
              isTapped(i) ? ", counted" : ""
            }`}
            className="flex-1 transition-all min-w-11 min-h-11 relative"
            style={cellStyle(i)}
          >
            {isTapped(i) && (
              <CheckCircle2 className="absolute inset-0 m-auto w-5 h-5 text-cyan-100" />
            )}
          </motion.button>
        ))}
      </div>
    );
  }

  if (spec.kind === "grid") {
    const cols = spec.cols ?? 4;
    const cellW = Math.floor(size / cols);
    return (
      <div
        className="grid rounded-2xl overflow-hidden"
        style={{
          gridTemplateColumns: `repeat(${cols}, ${cellW}px)`,
          gap: 2,
        }}
        role="group"
        aria-label={ariaLabel}
      >
        {Array.from({ length: spec.total }).map((_, i) => (
          <motion.button
            key={i}
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={() => tap(i)}
            className="aspect-square rounded-md min-w-11 min-h-11 relative"
            style={cellStyle(i)}
            aria-label={`Cell ${i + 1}${isLit(i) ? ", lit" : ""}${
              isTapped(i) ? ", counted" : ""
            }`}
          >
            {isTapped(i) && (
              <CheckCircle2 className="absolute inset-0 m-auto w-4 h-4 text-cyan-100" />
            )}
          </motion.button>
        ))}
      </div>
    );
  }

  if (spec.kind === "circle") {
    // Simple tap row of badges below a static svg-like rendering;
    // for circle we render as labeled buttons in a wheel layout (kept compact).
    return (
      <div
        className="flex flex-wrap items-center justify-center gap-2 max-w-[260px]"
        role="group"
        aria-label={ariaLabel}
      >
        {Array.from({ length: spec.total }).map((_, i) => (
          <motion.button
            key={i}
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={() => tap(i)}
            className="w-12 h-12 rounded-full font-mono text-sm font-bold relative"
            style={cellStyle(i)}
            aria-label={`Slice ${i + 1}${isLit(i) ? ", lit" : ""}${
              isTapped(i) ? ", counted" : ""
            }`}
          >
            {i + 1}
            {isTapped(i) && (
              <CheckCircle2 className="absolute -top-1 -right-1 w-4 h-4 text-cyan-100" />
            )}
          </motion.button>
        ))}
      </div>
    );
  }

  // set
  const cols = spec.cols ?? Math.min(5, Math.ceil(Math.sqrt(spec.total) + 1));
  const cellW = Math.floor(size / cols);
  return (
    <div
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${cols}, ${cellW}px)` }}
      role="group"
      aria-label={ariaLabel}
    >
      {Array.from({ length: spec.total }).map((_, i) => {
        const lit = isLit(i);
        const tappedNow = isTapped(i);
        return (
          <motion.button
            key={i}
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={() => tap(i)}
            className="aspect-square rounded-xl flex items-center justify-center relative min-w-11 min-h-11"
            style={cellStyle(i)}
            aria-label={`Object ${i + 1}${lit ? ", glowing" : ""}${
              tappedNow ? ", counted" : ""
            }`}
          >
            <SetIcon kind={spec.setIcon ?? "crystal"} />
            {tappedNow && (
              <CheckCircle2 className="absolute -top-1 -right-1 w-4 h-4 text-cyan-100" />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

function SetIcon({ kind }: { kind: "crystal" | "gear" | "battery" | "capsule" }) {
  const cls = "w-6 h-6 text-cyan-50";
  if (kind === "gear") return <Cog className={cls} />;
  if (kind === "battery") return <Battery className={cls} />;
  if (kind === "capsule") return <Pill className={cls} />;
  return <Gem className={cls} />;
}

/* -------------------------- Number Tile Picker --------------------------- */

export function NumberTilePicker({
  max,
  selected,
  onPick,
  disabled,
  label,
}: {
  max: number;
  selected: number | null;
  onPick: (n: number) => void;
  disabled?: boolean;
  label?: string;
}) {
  return (
    <div className="space-y-2">
      {label && <p className="label-eyebrow text-cyan-300/80">{label}</p>}
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: max }).map((_, i) => {
          const n = i + 1;
          const isSel = selected === n;
          return (
            <motion.button
              key={n}
              type="button"
              whileTap={{ scale: 0.92 }}
              disabled={disabled}
              onClick={() => onPick(n)}
              aria-pressed={isSel}
              className="w-12 h-12 rounded-xl font-mono font-bold text-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
              style={{
                background: isSel
                  ? "linear-gradient(135deg, #5fd0ff, #2a8ec9)"
                  : "rgba(95,208,255,0.08)",
                color: isSel ? "#04162e" : "#e6faff",
                border: `1px solid ${isSel ? "#5fd0ff" : STROKE}`,
                boxShadow: isSel ? `0 0 18px ${LIT}` : undefined,
              }}
            >
              {n}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------ Number Wheel ----------------------------- */

export function NumberWheel({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="label-eyebrow text-cyan-300/80">{label}</p>
      <div
        className="flex items-center rounded-2xl border"
        style={{
          background: "rgba(6,16,38,0.6)",
          borderColor: STROKE,
        }}
      >
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-11 h-11 inline-flex items-center justify-center text-cyan-100 hover:bg-white/10 rounded-l-2xl"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="px-4 min-w-12 text-center font-mono text-2xl font-bold text-cyan-50">
          {value}
        </span>
        <button
          type="button"
          aria-label={`Increase ${label}`}
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-11 h-11 inline-flex items-center justify-center text-cyan-100 hover:bg-white/10 rounded-r-2xl"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
