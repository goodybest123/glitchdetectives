type Props = {
  label: string;
  value: number;
  min: number;
  max: number;
  target: number;
  onChange: (next: number) => void;
};

export function NumberStepper({ label, value, min, max, target, onChange }: Props) {
  const locked = value === target;
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));

  return (
    <div className="flex items-center justify-center gap-4">
      <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
        {label}
      </span>
      <button
        type="button"
        onClick={dec}
        disabled={locked || value <= min}
        className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f1f5f9] text-2xl font-bold text-neutral-700 transition-colors hover:bg-[#e2e8f0] disabled:opacity-40"
        aria-label="Decrease"
      >
        −
      </button>
      <span className="min-w-[3rem] text-center text-3xl font-black tabular-nums text-neutral-900">
        {value}
      </span>
      <button
        type="button"
        onClick={inc}
        disabled={locked || value >= max}
        className="flex h-11 w-11 items-center justify-center rounded-full bg-[#dcfce7] text-2xl font-bold text-[#166534] transition-colors hover:bg-[#bbf7d0] disabled:opacity-40"
        aria-label="Increase"
      >
        +
      </button>
    </div>
  );
}
