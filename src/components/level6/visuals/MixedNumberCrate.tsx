import { EnergyCell } from "@/components/level5/visuals/EnergyCell";

/** Whole crates + remainder fraction strip for mixed-number visualization. */
export function MixedNumberCrate({
  whole,
  n,
  d,
  label,
}: {
  whole: number;
  n: number;
  d: number;
  label?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      {label && <span className="label-eyebrow text-cyan-100/80">{label}</span>}
      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        {Array.from({ length: whole }).map((_, i) => (
          <div
            key={i}
            className="w-8 h-8 rounded-md border flex items-center justify-center text-xs font-mono"
            style={{
              background: "linear-gradient(135deg, #5fd0ff, #b18bff)",
              borderColor: "color-mix(in oklab, #5fd0ff 40%, transparent)",
              color: "#06122a",
              boxShadow: "0 0 8px rgba(95,208,255,0.35)",
            }}
            aria-label="full crate"
          >
            1
          </div>
        ))}
        {n > 0 && d > 0 && (
          <EnergyCell total={d} filled={n} width={64} height={32} />
        )}
      </div>
      <span className="text-xs font-mono text-cyan-100/70">
        {whole} {n > 0 ? `+ ${n}/${d}` : ""}
      </span>
    </div>
  );
}
