import type { Fraction, Operator } from "./cases";

type ResultState = "idle" | "glitch" | "solved";

type Props = {
  left: Fraction;
  right: Fraction;
  operator: Operator;
  result: Fraction;
  resultState: ResultState;
  clickable: boolean;
  onResultClick?: () => void;
};

export function EquationDisplay({
  left,
  right,
  operator,
  result,
  resultState,
  clickable,
  onResultClick,
}: Props) {
  return (
    <div className="flex items-center justify-center gap-3 sm:gap-4">
      <FractionText n={left.n} d={left.d} />
      <Op>{operator}</Op>
      <FractionText n={right.n} d={right.d} />
      <Op>=</Op>
      <ResultFraction
        n={result.n}
        d={result.d}
        state={resultState}
        clickable={clickable}
        onClick={onResultClick}
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
  state: ResultState;
  clickable: boolean;
  onClick?: () => void;
}) {
  const bg =
    state === "glitch"
      ? "bg-[#fef3c7] ring-2 ring-[#f59e0b]"
      : state === "solved"
        ? "bg-[#dcfce7] ring-2 ring-[#10b981]"
        : "bg-transparent";

  const inner = (
    <div className="inline-flex flex-col items-center leading-none">
      <span className="text-3xl sm:text-4xl font-black text-neutral-900">{n}</span>
      <span className="my-1 h-[3px] w-9 rounded bg-neutral-900" />
      <span className="text-3xl sm:text-4xl font-black text-neutral-900">{d}</span>
    </div>
  );

  if (clickable) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label="Inspect the answer"
        className={`rounded-lg px-2 py-1 transition-colors hover:bg-[#fef3c7] ${bg}`}
      >
        {inner}
      </button>
    );
  }
  return <div className={`rounded-lg px-2 py-1 ${bg}`}>{inner}</div>;
}
