import type { Frac, L4Theme } from "@/lib/level4/types";
import { FractionBar } from "./FractionBar";
import { ThemeBadge, themeAccent } from "./QuantityObject";

/**
 * Renders a compact "A op B = ?" visual evidence strip. Used inside
 * the persistent L4 case file so the original glitch + visual model
 * stay visible throughout the case.
 */
export function OperationStrip({
  a,
  b,
  op,
  zedResult,
  theme,
  width = 130,
}: {
  a: Frac;
  b?: Frac;
  op?: "+" | "-" | "=";
  zedResult?: Frac;
  theme: L4Theme;
  width?: number;
}) {
  const accent = themeAccent(theme);
  return (
    <div className="flex items-center gap-3 flex-wrap justify-center">
      <FractionBar
        total={a.d}
        filled={a.n}
        width={width}
        accent={accent}
        label={`${a.n}/${a.d}`}
      />
      {op && (
        <span
          className="text-3xl font-bold pb-5"
          style={{ color: "#ffd28a" }}
          aria-hidden
        >
          {op}
        </span>
      )}
      {b && (
        <FractionBar
          total={b.d}
          filled={b.n}
          width={width}
          accent={accent}
          label={`${b.n}/${b.d}`}
        />
      )}
      <span
        className="text-3xl font-bold pb-5"
        style={{ color: "#ffd28a" }}
        aria-hidden
      >
        =
      </span>
      {zedResult ? (
        <div className="flex flex-col items-center gap-1.5">
          <span className="label-eyebrow" style={{ color: "#ff8e8e" }}>
            ZED's answer
          </span>
          <div
            className="px-3 py-2 rounded-xl font-mono text-lg font-bold"
            style={{
              background: "rgba(255, 142, 142, 0.15)",
              border: "2px dashed #ff8e8e",
              color: "#ffd1d1",
            }}
          >
            {zedResult.n}/{zedResult.d}
          </div>
        </div>
      ) : (
        <span
          className="font-mono text-lg font-bold px-3 py-2 rounded-xl"
          style={{
            background: "rgba(255,184,107,0.1)",
            color: "#ffd28a",
            border: "1px dashed color-mix(in oklab, #ffb86b 50%, transparent)",
          }}
        >
          ?
        </span>
      )}
      <ThemeBadge theme={theme} />
    </div>
  );
}
