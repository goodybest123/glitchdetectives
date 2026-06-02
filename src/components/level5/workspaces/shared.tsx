import { motion } from "framer-motion";
import { Minus, Plus, ArrowRight, Wrench } from "lucide-react";
import type { ReactNode } from "react";
import { ReplayInstructionsButton } from "../../level2/ReplayInstructionsButton";

const CYAN = "#5fd0ff";

/** Header used by every L5 workspace. */
export function WorkspaceHeader({
  eyebrow,
  title,
  narration,
}: {
  eyebrow: string;
  title: ReactNode;
  narration: string;
}) {
  return (
    <header className="flex items-start justify-between gap-3 flex-wrap">
      <div>
        <p className="label-eyebrow text-cyan-300/80">{eyebrow}</p>
        <h3 className="text-2xl font-bold text-cyan-50 mt-1">{title}</h3>
      </div>
      <ReplayInstructionsButton text={narration} />
    </header>
  );
}

/** Cyan-on-dark stepper used to set a numerator or denominator. */
export function NumberDial({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  disabled,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="label-eyebrow text-cyan-200/80">{label}</span>
      <div className="flex items-center gap-2">
        <DialBtn onClick={() => !disabled && onChange(Math.max(min, value - step))} ariaLabel={`Decrease ${label}`} disabled={disabled}>
          <Minus className="w-4 h-4" />
        </DialBtn>
        <span
          className="px-4 py-1.5 rounded-xl font-mono text-xl font-bold min-w-[3rem] text-center"
          style={{
            background: "rgba(95,208,255,0.12)",
            color: "#cdf2ff",
            border: `1px solid color-mix(in oklab, ${CYAN} 40%, transparent)`,
          }}
        >
          {value}
        </span>
        <DialBtn onClick={() => !disabled && onChange(Math.min(max, value + step))} ariaLabel={`Increase ${label}`} disabled={disabled}>
          <Plus className="w-4 h-4" />
        </DialBtn>
      </div>
    </div>
  );
}

function DialBtn({ children, onClick, ariaLabel, disabled }: { children: ReactNode; onClick: () => void; ariaLabel: string; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-10 h-10 rounded-full border flex items-center justify-center disabled:opacity-40"
      style={{
        borderColor: "color-mix(in oklab, #5fd0ff 40%, transparent)",
        color: "#cdf2ff",
        background: "rgba(95,208,255,0.08)",
      }}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}

/** Primary "Lock" CTA shared across L5 workspaces. */
export function LockButton({
  onClick,
  disabled,
  label,
}: {
  onClick: () => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold disabled:opacity-40"
      style={{
        background: "linear-gradient(135deg, #5fd0ff, #b18bff)",
        color: "#06122a",
        boxShadow: "0 0 20px rgba(95,208,255,0.4)",
      }}
    >
      {label} <ArrowRight className="w-4 h-4" />
    </motion.button>
  );
}

export function Feedback({ message, ok }: { message: string; ok: boolean }) {
  return (
    <motion.p
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      className={`text-sm ${ok ? "text-emerald-200" : "text-cyan-200"}`}
      role="status"
    >
      {message}
    </motion.p>
  );
}

export function HintLine({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-xs text-cyan-300/70">
      <Wrench className="w-3.5 h-3.5" />
      {children}
    </div>
  );
}
