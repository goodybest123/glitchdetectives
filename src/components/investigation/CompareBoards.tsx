/**
 * `CompareBoards` — two identical wholes shown side by side (Level 03).
 *
 * The point of the whole level is: compare the AMOUNT, not the numbers. So
 * the child can (a) line the two models up on top of each other to see the
 * shaded amounts match, and (b) press "split every piece" to watch one model
 * turn into its equivalent — the amount never moves, only the cuts.
 */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SpeakButton } from "@/components/case01/SpeakButton";
import { PartsBoard } from "./PartsBoard";
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
      return { total: model.total, selected: model.selected, fraction: model.fraction };
    }
    return {
      total: model.total * model.split.into,
      selected: model.selected * model.split.into,
      fraction: model.split.resultFraction,
    };
  };

  const left = shown(config.left, splitLeft);
  const right = shown(config.right, splitRight);

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

      <div
        className={
          aligned
            ? "mt-4 grid grid-cols-1 gap-3"
            : "mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2"
        }
      >
        {[
          { model: config.left, view: left, isSplit: splitLeft, setSplit: setSplitLeft },
          { model: config.right, view: right, isSplit: splitRight, setSplit: setSplitRight },
        ].map(({ model, view, isSplit, setSplit }) => (
          <div
            key={model.label}
            className="rounded-2xl border border-border bg-card p-3 transition-all"
          >
            <p className="text-center text-sm font-black text-foreground">{model.label}</p>
            <div className="mt-2">
              <PartsBoard
                shape={model.shape}
                total={view.total}
                selected={range(view.selected)}
                unitLabel={model.unitLabel}
                hideCounter
                label={`${model.label}: a whole cut into ${view.total} equal parts, ${view.selected} shaded.`}
              />
            </div>
            <p className="mt-2 text-center text-2xl font-black text-foreground">{view.fraction}</p>
            <p className="text-center text-xs font-semibold text-muted-foreground">
              {view.total} equal pieces · {view.selected} shaded
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

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <Button
          type="button"
          variant={aligned ? "secondary" : "default"}
          onClick={() => {
            onInteract();
            setAligned(!aligned);
          }}
          className="min-h-11 font-black"
        >
          {aligned ? "PUT THEM SIDE BY SIDE" : "LINE THEM UP"}
        </Button>
        {aligned && (
          <div className="flex flex-1 items-center gap-2">
            <p className="text-sm font-semibold text-foreground">{config.alignedText}</p>
            <SpeakButton text={config.alignedText} />
          </div>
        )}
      </div>
    </section>
  );
}
