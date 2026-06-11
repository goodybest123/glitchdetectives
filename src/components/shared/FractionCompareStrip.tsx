import { FractionIcon } from "./FractionIcon";

export type FractionLike = { n: number; d: number };

type Item = {
  fraction: FractionLike;
  tone?: "primary" | "secondary" | "accent" | "muted";
  label?: string;
};

export type FractionCompareStripProps = {
  items: Item[];
  /** Symbols between items, length = items.length - 1. Examples: ["<"], ["+", "="], [">"] */
  operators?: string[];
  variant?: "pizza" | "bar";
  /** Optional caption rendered above the strip */
  caption?: string;
  iconSize?: number;
};

export function FractionCompareStrip({
  items,
  operators = [],
  variant = "pizza",
  caption,
  iconSize = 88,
}: FractionCompareStripProps) {
  return (
    <div className="mt-6 rounded-2xl bg-gradient-to-b from-[#fafafa] to-white p-4 ring-1 ring-neutral-100">
      {caption && (
        <div className="mb-3 text-center text-[11px] font-bold tracking-[0.18em] text-neutral-500">
          {caption}
        </div>
      )}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
        {items.map((it, i) => (
          <div key={i} className="contents">
            <div className="flex flex-col items-center gap-2">
              <FractionIcon
                numerator={it.fraction.n}
                denominator={it.fraction.d}
                variant={variant}
                size={iconSize}
                tone={it.tone ?? (i === 0 ? "primary" : i === 1 ? "secondary" : "accent")}
              />
              <div className="flex items-baseline gap-1 leading-none">
                <span className="text-2xl font-black text-neutral-900">{it.fraction.n}</span>
                <span className="text-xl font-bold text-neutral-400">/</span>
                <span className="text-2xl font-black text-neutral-900">{it.fraction.d}</span>
              </div>
              {it.label && (
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  {it.label}
                </div>
              )}
            </div>
            {i < items.length - 1 && (
              <div className="flex h-full items-center">
                <span className="text-3xl font-black text-neutral-500 sm:text-4xl">
                  {operators[i] ?? ""}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
