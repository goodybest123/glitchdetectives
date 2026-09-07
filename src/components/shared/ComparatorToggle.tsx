/**
 * Three big buttons — <, = and > — the child uses to repair a comparison.
 */
import type { Operator } from "@/components/case04/cases";

const OPTIONS: { value: Operator; label: string }[] = [
  { value: "<", label: "is less than" },
  { value: "=", label: "is the same as" },
  { value: ">", label: "is greater than" },
];

export function ComparatorToggle({
  value,
  onChange,
}: {
  value: Operator;
  onChange: (next: Operator) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {OPTIONS.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={active}
            className={`flex min-h-16 min-w-16 flex-col items-center justify-center gap-1 rounded-2xl border-2 px-4 py-2 transition-all ${
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground hover:border-primary"
            }`}
          >
            <span className="text-3xl font-black leading-none">{option.value}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
