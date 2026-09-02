/**
 * Case 01 activity primitives.
 *
 * These controls keep the three fair-sharing sub-cases on one calm learning
 * path while giving each object a physical interaction: pieces can be moved,
 * the canvas divider can be dragged, and repaired shares can be assigned to
 * the people in the story.
 */
import { Check, GripVertical, RotateCcw } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Button } from "@/components/ui/button";
import { SpeakButton } from "@/components/case01/SpeakButton";
import type { SubCaseDef, SubCaseId } from "@/components/case01/cases";

type StoryProps = {
  caseId: SubCaseId;
  definition: SubCaseDef;
};

export function Case01StoryBrief({ definition }: StoryProps) {
  const story = definition.story;
  const readAloud = `${story.eyebrow}. ${story.intro} ${story.solution} Your mission: ${story.mission}`;

  return (
    <section className="mb-5 overflow-hidden rounded-2xl border-2 border-primary bg-card shadow-sm">
      <div className="border-b border-border bg-secondary px-4 py-3 sm:px-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="label-eyebrow text-muted-foreground">{story.eyebrow}</span>
          <span className="rounded-full bg-energy px-2.5 py-1 text-[10px] font-black tracking-widest text-energy-foreground">
            NEW CASE
          </span>
        </div>
        <div className="mt-2 flex items-start gap-2">
          <h2 className="flex-1 text-xl font-black text-card-foreground sm:text-2xl">
            {definition.title}
          </h2>
          <SpeakButton text={readAloud} size="md" />
        </div>
      </div>

      <div className="grid gap-4 p-4 sm:grid-cols-[1fr_auto] sm:p-5">
        <div className="space-y-3 text-sm leading-relaxed text-card-foreground">
          <p>{story.intro}</p>
          <p>
            <span className="font-black">ZED-4 says:</span> “{story.solution}”
          </p>
          <p className="font-bold text-primary">{story.confidence}</p>
        </div>
        <div className="rounded-xl border border-border bg-background p-3 sm:min-w-52">
          <p className="label-eyebrow text-muted-foreground">Your mission</p>
          <p className="mt-1 text-sm font-bold text-foreground">{story.mission}</p>
          <p className="mt-3 text-xs text-muted-foreground">{story.notice}</p>
        </div>
      </div>

      <div className="border-t border-dashed border-border px-4 py-3 text-xs font-semibold text-muted-foreground sm:px-5">
        <span className="font-black text-foreground">Detective rule:</span> A confident answer still
        needs checking.
      </div>
    </section>
  );
}

type VerdictProps = {
  onAgree: () => void;
  onGlitch: () => void;
  onUnsure: () => void;
  note?: string;
};

export function Case01Verdict({ onAgree, onGlitch, onUnsure, note }: VerdictProps) {
  return (
    <section className="mb-5 rounded-2xl border border-border bg-secondary/60 p-4 sm:p-5">
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <p className="label-eyebrow text-muted-foreground">Detective question</p>
          <h3 className="mt-1 text-base font-black text-foreground sm:text-lg">
            Do you agree with ZED-4?
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            You can investigate before you decide.
          </p>
        </div>
        <SpeakButton
          text="Detective question. Do you agree with ZED-4? You can investigate before you decide."
          size="md"
        />
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <Button
          type="button"
          variant="outline"
          onClick={onAgree}
          className="h-auto min-h-12 whitespace-normal px-3 py-3 text-left font-bold"
        >
          I agree — it looks fair.
        </Button>
        <Button
          type="button"
          onClick={onGlitch}
          className="h-auto min-h-12 whitespace-normal bg-energy px-3 py-3 text-left font-bold text-energy-foreground hover:bg-energy/80"
        >
          I see a glitch.
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onUnsure}
          className="h-auto min-h-12 whitespace-normal px-3 py-3 text-left font-bold"
        >
          I’m not sure yet.
        </Button>
      </div>
      {note && (
        <p
          className="mt-3 rounded-xl bg-background px-3 py-2 text-center text-xs font-semibold text-muted-foreground"
          aria-live="polite"
        >
          {note}
        </p>
      )}
    </section>
  );
}

type PiecePoint = { x: number; y: number };

const PIECE_STARTS: Record<"pizza" | "chocolate", PiecePoint[]> = {
  pizza: [
    { x: 14, y: 52 },
    { x: 38, y: 30 },
    { x: 64, y: 52 },
    { x: 38, y: 76 },
  ],
  chocolate: [
    { x: 18, y: 52 },
    { x: 48, y: 30 },
    { x: 76, y: 52 },
  ],
};

type EvidenceProps = {
  caseId: SubCaseId;
  stage: "investigate" | "detect";
  equalized: number;
  onEqualizedChange: (value: number) => void;
  moved: boolean;
  onMoved: () => void;
  onReset: () => void;
  resetKey?: number;
};

/** A pointer-based comparison tray; keyboard arrows move the focused piece too. */
export function Case01EvidenceBoard({
  caseId,
  stage,
  equalized,
  onEqualizedChange,
  moved,
  onMoved,
  onReset,
  resetKey = 0,
}: EvidenceProps) {
  if (caseId === "canvas") {
    return (
      <CanvasEvidenceBoard
        stage={stage}
        equalized={equalized}
        onEqualizedChange={onEqualizedChange}
        moved={moved}
        onMoved={onMoved}
        onReset={onReset}
      />
    );
  }

  return (
    <PiecesEvidenceBoard
      caseId={caseId}
      moved={moved}
      onMoved={onMoved}
      onReset={onReset}
      resetKey={resetKey ?? 0}
    />
  );
}

function CanvasEvidenceBoard({
  stage,
  equalized,
  onEqualizedChange,
  moved,
  onMoved,
  onReset,
}: Omit<EvidenceProps, "caseId">) {
  return (
    <section className="mb-5 rounded-2xl border-2 border-dashed border-border bg-background p-4 sm:p-5">
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <p className="label-eyebrow text-muted-foreground">Evidence board</p>
          <h3 className="mt-1 text-base font-black text-foreground">
            Drag the line. Compare both sides.
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            There is no rush. Move it, look, and decide what you notice.
          </p>
        </div>
        <SpeakButton
          text="Evidence board. Drag the line. Compare both sides. There is no rush."
          size="md"
        />
      </div>
      <label
        htmlFor="case-01-canvas-evidence"
        className="mt-4 block text-xs font-bold text-foreground"
      >
        Move the dividing line
      </label>
      <input
        id="case-01-canvas-evidence"
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={equalized}
        onChange={(event) => {
          onEqualizedChange(Number(event.target.value));
          onMoved();
        }}
        disabled={stage === "detect" && moved}
        className="mt-3 w-full accent-primary"
      />
      <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
        <span>Move left</span>
        <span>Move right</span>
      </div>
      {moved && (
        <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-center text-xs font-semibold text-muted-foreground">
          Evidence moved. Compare the two sides carefully.
        </p>
      )}
      <Button type="button" variant="ghost" size="sm" onClick={onReset} className="mt-2 gap-1.5">
        <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Reset line
      </Button>
    </section>
  );
}

function PiecesEvidenceBoard({
  caseId,
  moved,
  onMoved,
  onReset,
  resetKey = 0,
}: Pick<EvidenceProps, "caseId" | "moved" | "onMoved" | "onReset" | "resetKey"> & {
  caseId: "pizza" | "chocolate";
}) {
  const pieces = caseId === "pizza" ? ["Maya", "Leo", "Sam", "ZED-4"] : ["Ari", "Bo", "ZED-4"];
  const positions = usePiecePositions(caseId, moved, onMoved, resetKey);

  return (
    <section className="mb-5 rounded-2xl border-2 border-dashed border-border bg-background p-4 sm:p-5">
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <p className="label-eyebrow text-muted-foreground">Evidence board</p>
          <h3 className="mt-1 text-base font-black text-foreground">
            Move the pieces beside each other.
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Put them where you can compare them. What do you notice?
          </p>
        </div>
        <SpeakButton
          text="Evidence board. Move the pieces beside each other. Put them where you can compare them. What do you notice?"
          size="md"
        />
      </div>

      <div
        className="relative mt-4 min-h-48 touch-none overflow-hidden rounded-xl border border-border bg-secondary/50"
        aria-label={`Move the ${caseId === "pizza" ? "pizza slices" : "chocolate pieces"} to compare them`}
        data-case01-board
      >
        <div className="pointer-events-none absolute inset-x-4 top-1/2 border-t border-dashed border-border" />
        {pieces.map((person, index) => {
          const point = positions.points[index] ?? { x: 50, y: 50 };
          return (
            <button
              key={person}
              type="button"
              className={`absolute flex min-h-12 min-w-16 -translate-x-1/2 -translate-y-1/2 touch-none items-center justify-center gap-1 rounded-xl border-2 border-primary bg-card px-2 text-center text-xs font-black text-card-foreground shadow-sm transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${caseId === "chocolate" ? "min-w-20" : ""}`}
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
              onPointerDown={(event) => positions.start(index, event)}
              onPointerMove={(event) => positions.move(index, event)}
              onPointerUp={() => positions.end()}
              onPointerCancel={() => positions.end()}
              onKeyDown={(event) => positions.key(index, event)}
              aria-label={`Move ${person}'s ${caseId === "pizza" ? "slice" : "piece"}`}
            >
              <GripVertical className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
              <span aria-hidden>{caseId === "pizza" ? "🍕" : "🍫"}</span>
              <span className="sr-only">{person}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold text-muted-foreground" aria-live="polite">
          {moved ? "Evidence placed. Now compare the sizes." : "Pick up a piece and move it."}
        </p>
        <Button type="button" variant="ghost" size="sm" onClick={onReset} className="gap-1.5">
          <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Reset pieces
        </Button>
      </div>
    </section>
  );
}

function usePiecePositions(
  caseId: "pizza" | "chocolate",
  moved: boolean,
  onMoved: () => void,
  resetKey: number,
) {
  const [positions, setPositions] = useState<PiecePoint[]>(() => PIECE_STARTS[caseId]);
  const [dragging, setDragging] = useState<number | null>(null);
  const boardRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setPositions(PIECE_STARTS[caseId]);
    setDragging(null);
  }, [caseId, resetKey]);

  // Keep the hook self-contained and deterministic; the route resets the
  // board by remounting it when the child taps Reset.
  const update = (index: number, clientX: number, clientY: number, rect: DOMRect) => {
    setPositions((current) =>
      current.map((point, i) =>
        i === index
          ? {
              x: Math.min(92, Math.max(8, ((clientX - rect.left) / rect.width) * 100)),
              y: Math.min(82, Math.max(18, ((clientY - rect.top) / rect.height) * 100)),
            }
          : point,
      ),
    );
    if (!moved) onMoved();
  };

  return {
    ...positions,
    points: positions,
    start: (index: number, event: ReactPointerEvent<HTMLButtonElement>) => {
      const target = event.currentTarget.closest<HTMLElement>("[data-case01-board]");
      if (!target) return;
      boardRef.current = target;
      event.currentTarget.setPointerCapture(event.pointerId);
      setDragging(index);
      update(index, event.clientX, event.clientY, target.getBoundingClientRect());
    },
    move: (index: number, event: ReactPointerEvent<HTMLButtonElement>) => {
      if (dragging !== index || !boardRef.current) return;
      update(index, event.clientX, event.clientY, boardRef.current.getBoundingClientRect());
    },
    end: () => setDragging(null),
    key: (index: number, event: ReactKeyboardEvent<HTMLButtonElement>) => {
      const delta = event.shiftKey ? 10 : 5;
      let next: PiecePoint | null = null;
      if (event.key === "ArrowLeft")
        next = { x: Math.max(8, positions[index].x - delta), y: positions[index].y };
      if (event.key === "ArrowRight")
        next = { x: Math.min(92, positions[index].x + delta), y: positions[index].y };
      if (event.key === "ArrowUp")
        next = { x: positions[index].x, y: Math.max(18, positions[index].y - delta) };
      if (event.key === "ArrowDown")
        next = { x: positions[index].x, y: Math.min(82, positions[index].y + delta) };
      if (!next) return;
      event.preventDefault();
      setPositions((current) =>
        current.map((point, i) => (i === index ? (next as PiecePoint) : point)),
      );
      if (!moved) onMoved();
    },
  };
}

type DetectProps = {
  definition: SubCaseDef;
  selected: string | null;
  onSelect: (choice: string, correct: boolean) => void;
  evidenceReady: boolean;
  onConfirm: () => void;
};

export function Case01DetectPanel({
  definition,
  selected,
  onSelect,
  evidenceReady,
  onConfirm,
}: DetectProps) {
  return (
    <section className="mb-5 rounded-2xl border-2 border-dashed border-border bg-secondary/50 p-4 sm:p-5">
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <p className="label-eyebrow text-muted-foreground">Detect the glitch</p>
          <h3 className="mt-1 text-base font-black text-foreground">
            What did your evidence show?
          </h3>
        </div>
        <SpeakButton
          text={`Detect the glitch. What did your evidence show? ${definition.detectChoices.map((choice) => choice.label).join(". ")}`}
          size="md"
        />
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {definition.detectChoices.map((choice, index) => {
          const isSelected = selected === choice.label;
          return (
            <Button
              key={choice.label}
              type="button"
              variant={isSelected && choice.correct ? "default" : "outline"}
              onClick={() => onSelect(choice.label, choice.correct)}
              className={`h-auto min-h-12 justify-start whitespace-normal px-3 py-3 text-left font-bold ${isSelected && !choice.correct ? "border-energy bg-energy/15" : ""}`}
            >
              <span className="mr-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-black text-secondary-foreground">
                {String.fromCharCode(65 + index)}
              </span>
              {choice.label}
            </Button>
          );
        })}
      </div>
      <p
        className="mt-3 text-center text-xs font-semibold text-muted-foreground"
        aria-live="polite"
      >
        {selected && !definition.detectChoices.find((choice) => choice.label === selected)?.correct
          ? "That is an interesting idea. Compare the pieces once more."
          : selected
            ? "Good observation. Now show the evidence you used."
            : "Choose the observation that best matches what you noticed."}
      </p>
      {selected &&
        definition.detectChoices.find((choice) => choice.label === selected)?.correct && (
          <div className="mt-4 border-t border-dashed border-border pt-4">
            <p className="text-sm font-bold text-foreground">{definition.evidencePrompt}</p>
            <Button
              type="button"
              onClick={onConfirm}
              disabled={!evidenceReady}
              className="mt-3 w-full font-black sm:w-auto"
            >
              <Check className="mr-2 h-4 w-4" aria-hidden /> Confirm my evidence
            </Button>
            {!evidenceReady && (
              <p className="mt-2 text-xs text-muted-foreground">
                Move or adjust the object first, then confirm.
              </p>
            )}
          </div>
        )}
    </section>
  );
}

type RepairProps = {
  definition: SubCaseDef;
  equalized: number;
  onEqualizedChange: (value: number) => void;
  assigned: string[];
  onAssign: (person: string) => void;
  ready: boolean;
  onSubmit: () => void;
  onReset: () => void;
};

export function Case01RepairBoard({
  definition,
  equalized,
  onEqualizedChange,
  assigned,
  onAssign,
  ready,
  onSubmit,
  onReset,
}: RepairProps) {
  const isCanvas = definition.id === "canvas";
  return (
    <section className="mb-5 rounded-2xl border-2 border-primary bg-card shadow-sm">
      <header className="border-b border-border bg-secondary px-4 py-3 sm:px-5">
        <p className="label-eyebrow text-muted-foreground">Repair ZED-4’s solution</p>
        <h3 className="mt-1 text-lg font-black text-card-foreground">{definition.repairPrompt}</h3>
      </header>
      <div className="space-y-4 p-4 sm:p-5">
        <label htmlFor="case-01-repair-control" className="block text-sm font-bold text-foreground">
          {isCanvas
            ? "Move the line until both sides match."
            : "Move the control until every piece matches."}
        </label>
        <input
          id="case-01-repair-control"
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={equalized}
          onChange={(event) => onEqualizedChange(Number(event.target.value))}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-[11px] text-muted-foreground">
          <span>Still uneven</span>
          <span>Matching parts</span>
        </div>
        {isCanvas ? null : (
          <div className="rounded-xl border border-border bg-background p-3">
            <p className="text-sm font-bold text-foreground">
              Give one matching share to each detective.
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {definition.story.participants.map((person) => {
                const hasShare = assigned.includes(person);
                return (
                  <Button
                    key={person}
                    type="button"
                    variant={hasShare ? "default" : "outline"}
                    onClick={() => onAssign(person)}
                    disabled={equalized < definition.correctTarget - definition.targetTolerance}
                    className="justify-start font-bold"
                  >
                    {hasShare ? (
                      <Check className="mr-2 h-4 w-4" aria-hidden />
                    ) : (
                      <span className="mr-2 h-4 w-4 rounded border border-border" aria-hidden />
                    )}
                    {person}
                  </Button>
                );
              })}
            </div>
          </div>
        )}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-dashed border-border pt-3">
          <p className="text-xs font-semibold text-muted-foreground" aria-live="polite">
            {ready
              ? "Your repair is ready. Submit it when you are sure."
              : isCanvas
                ? "Keep checking until both sides match."
                : "Match the pieces, then give one to each detective."}
          </p>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={onReset} className="gap-1.5">
              <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Start again
            </Button>
            <Button type="button" onClick={onSubmit} disabled={!ready} className="font-black">
              Submit repair
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

type ExplainProps = {
  definition: SubCaseDef;
  onSend: (text: string) => void;
};

export function Case01ExplainPrompts({ definition, onSend }: ExplainProps) {
  return (
    <section className="mb-5 rounded-2xl border border-border bg-secondary/60 p-4 sm:p-5">
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <p className="label-eyebrow text-muted-foreground">Ways to explain</p>
          <h3 className="mt-1 text-base font-black text-foreground">
            Choose a sentence starter, or use your own words.
          </h3>
        </div>
        <SpeakButton
          text="Ways to explain. Choose a sentence starter, or use your own words."
          size="md"
        />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {definition.explainChoices.map((choice) => (
          <Button
            key={choice}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onSend(choice)}
            className="h-auto whitespace-normal py-2 text-left"
          >
            {choice}
          </Button>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        You can type, speak, or build your idea one piece at a time.
      </p>
    </section>
  );
}

type ApplyProps = {
  definition: SubCaseDef;
  completed: boolean;
  onComplete: () => void;
};

export function Case01ApplyChallenge({ definition, completed, onComplete }: ApplyProps) {
  return (
    <section className="mb-6 overflow-hidden rounded-2xl border-2 border-primary bg-card shadow-sm">
      <div className="border-b border-border bg-energy px-4 py-3 sm:px-5">
        <p className="label-eyebrow text-energy-foreground">Apply the clue</p>
        <h2 className="mt-1 text-xl font-black text-energy-foreground">{definition.apply.title}</h2>
      </div>
      <div className="p-4 sm:p-5">
        <p className="text-sm leading-relaxed text-card-foreground">{definition.apply.prompt}</p>
        <p className="mt-3 text-sm font-bold text-card-foreground">
          Grab: {definition.apply.grab.join(" · ")}
        </p>
        <Button type="button" onClick={onComplete} disabled={completed} className="mt-4 font-black">
          {completed ? (
            <>
              <Check className="mr-2 h-4 w-4" aria-hidden /> Challenge logged
            </>
          ) : (
            "I tried the real-world challenge"
          )}
        </Button>
      </div>
    </section>
  );
}

export function Case01SkillUnlock({ definition }: StoryProps) {
  return (
    <section className="mb-6 rounded-2xl border border-primary bg-secondary p-4 sm:p-5">
      <p className="label-eyebrow text-muted-foreground">Detective skill unlocked</p>
      <h2 className="mt-1 text-xl font-black text-foreground">You checked before you trusted.</h2>
      <p className="mt-2 text-sm text-muted-foreground">{definition.skillSummary}</p>
      <div className="mt-4 grid gap-2 text-sm font-semibold text-foreground sm:grid-cols-3">
        {definition.evidenceSkills.map((skill) => (
          <div key={skill} className="rounded-xl bg-background px-3 py-2">
            ✓ {skill}
          </div>
        ))}
      </div>
    </section>
  );
}
