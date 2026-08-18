import type { Fraction, Operator } from "./cases";

type DenominatorState = "idle" | "glitch" | "editing" | "solved";

type Props = {
  left: Fraction;
  right: Fraction;
  operator: Operator;
  resultNumerator: number;
  denominatorValue: number;
  denominatorState: DenominatorState;
  clickable: boolean;
  onDenominatorClick?: () => void;
};

export function EquationDisplay({
  left,
  right,
  operator,
  resultNumerator,
  denominatorValue,
  denominatorState,
  clickable,
  onDenominatorClick,
}: Props) {
  return (
    <div className="flex items-center justify-center gap-3 sm:gap-4">
      <FractionText n={left.n} d={left.d} />
      <Op>{operator}</Op>
      <FractionText n={right.n} d={right.d} />
      <Op>=</Op>
      <ResultFraction
        n={resultNumerator}
        d={denominatorValue}
        state={denominatorState}
        clickable={clickable}
        onClick={onDenominatorClick}
      />
    </div>
  );
}

function Op({ children }: { children: React.ReactNode }) {
  return <span className="text-3xl sm:text-4xl font-black text-neutral-700">{children}</span>;
}

function FractionText({ n, d }: { n: number; d: number }) {
  return (
    <div className="inline-flex flex-col items-center leading-none">
      <span className="text-3xl sm:text-4xl font-black text-neutral-900">{n}</span>
      <span className="my-1 h-[3px] w-9 rounded bg-neutral-900" />
      <span className="text-3xl sm:text-4xl font-black text-neutral-900">{d}</span>
    </div>
  );
}

function ResultFraction({
  n,
  d,
  state,
  clickable,
  onClick,
}: {
  n: number;
  d: number;
  state: DenominatorState;
  clickable: boolean;
  onClick?: () => void;
}) {
  const bg =
    state === "glitch" || state === "editing"
      ? "bg-[#fef3c7] ring-2 ring-[#f59e0b]"
      : state === "solved"
        ? "bg-[#dcfce7] ring-2 ring-[#10b981]"
        : "bg-transparent";

  return (
    <div className="inline-flex flex-col items-center leading-none">
      <span className="text-3xl sm:text-4xl font-black text-neutral-900">{n}</span>
      <span className="my-1 h-[3px] w-9 rounded bg-neutral-900" />
      {clickable ? (
        <button
          type="button"
          onClick={onClick}
          className={`rounded-lg px-2 py-0.5 text-3xl sm:text-4xl font-black text-neutral-900 transition-colors hover:bg-[#fef3c7] ${bg}`}
          aria-label="Inspect the bottom number"
        >
          {d}
        </button>
      ) : (
        <span
          className={`rounded-lg px-2 py-0.5 text-3xl sm:text-4xl font-black text-neutral-900 ${bg}`}
        >
          {d}
        </span>
      )}
    </div>
  );
}
