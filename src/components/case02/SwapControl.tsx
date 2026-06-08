type Props = {
  onSwap: () => void;
  disabled?: boolean;
};

export function SwapControl({ onSwap, disabled }: Props) {
  return (
    <div className="flex items-center justify-center">
      <button
        type="button"
        onClick={onSwap}
        disabled={disabled}
        className="flex items-center gap-2 rounded-full bg-[#1f2937] px-5 py-3 text-sm font-bold tracking-wider text-white transition-transform hover:scale-105 disabled:opacity-40"
        aria-label="Swap numerator and denominator"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M7 7h11M7 7l3-3M7 7l3 3M17 17H6m11 0l-3 3m3-3l-3-3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        SWAP
      </button>
    </div>
  );
}
