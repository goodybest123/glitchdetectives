type Props = {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
};

export function DenominatorStepper({ value, min, max, onChange }: Props) {
  const canDec = value > min;
  const canInc = value < max;
  return (
    <div className="inline-flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-neutral-200">
      <button
        type="button"
        disabled={!canDec}
        onClick={() => canDec && onChange(value - 1)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#1f2937] text-2xl font-black text-white transition-colors hover:bg-black disabled:bg-neutral-300"
        aria-label="Decrease denominator"
      >
        −
      </button>
      <div className="min-w-[3rem] text-center text-3xl font-black text-neutral-900 tabular-nums">
        {value}
      </div>
      <button
        type="button"
        disabled={!canInc}
        onClick={() => canInc && onChange(value + 1)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#1f2937] text-2xl font-black text-white transition-colors hover:bg-black disabled:bg-neutral-300"
        aria-label="Increase denominator"
      >
        +
      </button>
    </div>
  );
}
