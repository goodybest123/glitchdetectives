type Props = {
  step: number; // 1..4
};
const STEPS = ["INVESTIGATE", "EXPLAIN", "REPAIR", "TEACH"];
export function StepIndicator({ step }: Props) {
  return (
    <div className="flex items-center gap-2">
      {STEPS.map((label, i) => {
        const n = i + 1;
        const active = n === step;
        const done = n < step;
        return (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`label-eyebrow px-3 py-1.5 rounded-full border transition ${
                active
                  ? "bg-primary text-primary-foreground border-primary"
                  : done
                    ? "bg-success/15 text-foreground border-success/40"
                    : "bg-card text-muted-foreground border-border"
              }`}
            >
              {String(n).padStart(2, "0")} / {label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
