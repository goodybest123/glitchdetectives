type Props = {
  label: string;
  hint?: string;
  onClick: () => void;
  disabled?: boolean;
};

export function RepairToolButton({ label, hint, onClick, disabled }: Props) {
  return (
    <div className="inline-flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="inline-flex items-center gap-2 rounded-full bg-[#1f2937] px-6 py-3 text-sm font-bold tracking-wider text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-black disabled:bg-neutral-300 disabled:hover:translate-y-0"
      >
        <span aria-hidden>⚡</span>
        {label.toUpperCase()}
      </button>
      {hint && <span className="text-xs text-neutral-500">{hint}</span>}
    </div>
  );
}
