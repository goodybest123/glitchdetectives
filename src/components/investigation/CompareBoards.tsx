/**
 * `CompareBoards` — two identical wholes shown side by side (Level 03).
 *
 * The point of the whole level is: compare the AMOUNT, not the numbers. So
 * the child can
 *  (a) bring the two models together so one sits exactly on top of the other
 *      — the outer edges match, the cut lines stay visible, and the shaded
 *      regions either coincide or they don't; and
 *  (b) press "split every piece" to watch one model turn into its
 *      equivalent, with the original partition left as a faint ghost so the
 *      shaded amount is visibly untouched.
 *
 * Both models are drawn by `FractionModel`, which guarantees the same outer
 * size and exactly equal partitions. That guarantee is the mathematics.
 */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SpeakButton } from "@/components/case01/SpeakButton";
import { FractionModel } from "./FractionModel";
import type { CompareConfig, CompareModel } from "./types";

const range = (n: number) => Array.from({ length: n }, (_, i) => i);

type Props = {
  config: CompareConfig;
  /** Called on every hands-on move so the report can record exploration. */
  onInteract: () => void;
};

export function CompareBoards({ config, onInteract }: Props) {
  const [aligned, setAligned] = useState(false);
  const [splitLeft, setSplitLeft] = useState(false);
  const [splitRight, setSplitRight] = useState(false);

  const shown = (model: CompareModel, isSplit: boolean) => {
    if (!isSplit || !model.split) {
      return { total: model.total, selected: model.selected, fraction: model.fraction, ghost: 0 };
    }
    return {
      total: model.total * model.split.into,
      selected: model.selected * model.split.into,
      fraction: model.split.resultFraction,
      ghost: model.total,
    };
  };

  const left = shown(config.left, splitLeft);
  const right = shown(config.right, splitRight);
  const overlayText = config.overlayText ?? config.alignedText;

  return (
    <section className="rounded-2xl border-2 border-dashed border-border bg-background p-4 sm:p-5">
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <p className="label-eyebrow text-muted-foreground">COMPARE THE AMOUNT</p>
          <h3 className="mt-1 text-base font-black text-foreground">{config.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{config.text}</p>
        </div>
        <SpeakButton text={`${config.title}. ${config.text}`} size="md" />
      </div>

      {aligned ? (
        /* ---------------- overlay: one model exactly on top of the other */
        <div className="mt-5">
          <div className="relative mx-auto w-full max-w-2xl">
            <FractionModel
              shape={config.left.shape}
              total={left.total}
              selected={range(left.selected)}
              unitLabel={config.left.unitLabel}
              ghostTotal={left.ghost || undefined}
              label={`${config.left.label}: ${left.fraction}`}
            />
            <div className="absolute inset-0">
              <FractionModel
                shape={config.right.shape}
                total={right.total}
                selected={range(right.selected)}
                unitLabel={config.right.unitLabel}
                overlay
                label={`${config.right.label}: ${right.fraction}, laid on top`}
              />
            </div>
          </div>
          <p className="mt-3 text-center text-2xl font-black text-foreground">
            {left.fraction} <span className="text-primary">=</span> {right.fraction}
          </p>
          <div className="mt-2 flex items-center justify-center gap-2">
            <p className="text-center text-sm font-bold text-foreground">{overlayText}</p>
            <SpeakButton text={overlayText} />
          </div>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            { model: config.left, view: left, isSplit: splitLeft, setSplit: setSplitLeft },
            { model: config.right, view: right, isSplit: splitRight, setSplit: setSplitRight },
          ].map(({ model, view, isSplit, setSplit }) => (
            <div key={model.label} className="rounded-2xl border border-border bg-card p-3">
              <p className="text-center text-sm font-black text-foreground">{model.label}</p>
              <div className="mt-2">
                <FractionModel
                  shape={model.shape}
                  total={view.total}
                  selected={range(view.selected)}
                  unitLabel={model.unitLabel}
                  ghostTotal={view.ghost || undefined}
                  label={`${model.label}: a whole cut into ${view.total} equal parts, ${view.selected} shaded.`}
                />
              </div>
              <p className="mt-2 text-center text-3xl font-black text-foreground">
                {view.fraction}
              </p>
              {model.split && (
                <div className="mt-3 text-center">
                  <Button
                    type="button"
                    variant={isSplit ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => {
                      onInteract();
                      setSplit(!isSplit);
                    }}
                    className="min-h-11 whitespace-normal text-xs font-black"
                  >
                    {isSplit ? "PUT THE PIECES BACK" : model.split.label}
                  </Button>
                  {isSplit && (
                    <p className="mt-2 text-xs font-semibold text-foreground">
                      {model.split.caption}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-5 text-center">
        <Button
          type="button"
          variant={aligned ? "secondary" : "default"}
          onClick={() => {
            onInteract();
            setAligned(!aligned);
          }}
          className="min-h-12 font-black"
        >
          {aligned
            ? "PUT THEM SIDE BY SIDE"
            : (config.overlayLabel ?? "BRING THEM TOGETHER")}
        </Button>
      </div>
    </section>
  );
}
