import type { Operator } from "./cases";

type Props = {
  value: Operator;
  onChange: (op: Operator) => void;
  disabled?: boolean;
};

const OPTIONS: Operator[] = ["<", "=", ">"];

export function ComparatorToggle({ value, onChange, disabled = false }: Props) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">
        Pick the right symbol
      </div>
      <div className="inline-flex items-center gap-2 rounded-full bg-white p-1.5 ring-1 ring-neutral-200">
        {OPTIONS.map((op) => {
          const active = op === value;
          return (
            <button
              key={op}
              type="button"
              disabled={disabled}
              onClick={() => onChange(op)}
              className={`flex h-12 w-14 items-center justify-center rounded-full text-2xl font-black transition-colors ${
                active
                  ? "bg-[#1f2937] text-white shadow"
                  : "text-neutral-600 hover:bg-neutral-100"
              } disabled:opacity-50`}
              aria-pressed={active}
              aria-label={`Set comparator to ${op}`}
            >
              {op}
            </button>
          );
        })}
      </div>
    </div>
  );
}
