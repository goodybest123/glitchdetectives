import type { Operator } from "./cases";

type Props = {
  operator: Operator;
  highlight: boolean;
  clickable: boolean;
  onClick?: () => void;
  pulseKey?: number;
};

export function ComparatorSymbol({ operator, highlight, clickable, onClick, pulseKey = 0 }: Props) {
  const bg = highlight ? "bg-[#fef9c3] ring-4 ring-[#fde68a]" : "bg-transparent";
  const cursor = clickable ? "cursor-pointer hover:bg-neutral-50" : "cursor-default";
  return (
    <button
      type="button"
      key={pulseKey}
      onClick={clickable ? onClick : undefined}
      disabled={!clickable}
      aria-label={`Comparator symbol ${operator}`}
      className={`flex h-20 w-20 items-center justify-center rounded-2xl text-5xl font-black text-neutral-900 transition-colors ${bg} ${cursor} ${
        pulseKey > 0 ? "animate-[pulse-once_700ms_ease-out]" : ""
      }`}
    >
      <style>{`
        @keyframes pulse-once {
          0% { transform: scale(1); }
          40% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
      `}</style>
      {operator}
    </button>
  );
}
