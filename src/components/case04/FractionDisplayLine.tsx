import type { ReactNode } from "react";
import type { Fraction } from "./cases";

type Props = {
  left: Fraction;
  right: Fraction;
  middle: ReactNode;
};

export function FractionDisplayLine({ left, right, middle }: Props) {
  return (
    <div className="flex items-center justify-center gap-5 sm:gap-7">
      <FractionText f={left} />
      {middle}
      <FractionText f={right} />
    </div>
  );
}

function FractionText({ f }: { f: Fraction }) {
  return (
    <div className="inline-flex flex-col items-center leading-none">
      <span className="text-3xl font-black text-neutral-900">{f.n}</span>
      <span className="my-1 h-[3px] w-7 rounded bg-neutral-900" />
      <span className="text-3xl font-black text-neutral-900">{f.d}</span>
    </div>
  );
}
