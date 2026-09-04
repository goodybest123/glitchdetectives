/**
 * Case 01.03 — The Painted Canvas.
 *
 * Same detective rhythm as Case 01.01 (pizza) and 01.02 (chocolate), but a
 * different shape and a different number of people: one rectangle, two
 * shares. ZED-4 painted an off-centre strip and claims "one painted side and
 * one plain side" means half.
 *
 * Flow: CASE BRIEF → INVESTIGATE → DETECT (with evidence) → REPAIR
 *       → EXPLAIN → REAL-WORLD CHALLENGE → CASE CLOSED.
 */
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Check, GripVertical, Lightbulb, RotateCcw, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CaseStepper, type Stage } from "@/components/case01/CaseStepper";
import { MicButton } from "@/components/case01/MicButton";
import { SpeakButton } from "@/components/case01/SpeakButton";
import { ChatPanel } from "@/components/shared/ChatPanel";
import { CaseReflectionCard } from "@/components/shared/CaseReflectionCard";
import type { SubCaseDef } from "@/components/case01/cases";
import { useReportRecorder } from "@/hooks/useReportRecorder";
import { celebrate } from "@/lib/celebrate";
import { generateCaseReflection, useCaseResultRecorder, type CaseResult } from "@/lib/reasoning";

const SOLVED_TOKEN = "[[CASE_SOLVED]]";
type CanvasStage = "brief" | Stage;
type Point = { x: number; y: number };

/** ZED-4's split: the painted region is far bigger than the plain one. */
const PAINTED_SPLIT = 68;

const REGIONS = [
  { id: "painted", label: "Painted part", width: PAINTED_SPLIT, start: { x: 26, y: 34 } },
  { id: "plain", label: "Plain part", width: 100 - PAINTED_SPLIT, start: { x: 72, y: 62 } },
] as const;

const HINTS = [
  "ZED-4 made two parts. But are the two parts the same size?",
  "Slide the two parts next to each other and line up their left edges.",
  "Half means the two parts match exactly.",
];

const OBSERVATION_CHOICES = [
  "The canvas has two parts.",
  "One part is much wider than the other.",
  "The two parts are the same size.",
  "Only one part is painted.",
];

const DETECT_CHOICES = [
  "The canvas has too many parts.",
  "The two parts are not the same size.",
  "Painting is not allowed on a canvas.",
];

type Props = {
  definition: SubCaseDef;
  onSolved: () => void;
  onBackToPicker: () => void;
};

export function CanvasCaseExperience({ definition, onSolved, onBackToPicker }: Props) {
  const [stage, setStage] = useState<CanvasStage>("brief");
  const [positions, setPositions] = useState<Record<string, Point>>(() =>
    Object.fromEntries(REGIONS.map((region) => [region.id, region.start])),
  );
  const [history, setHistory] = useState<Record<string, Point>[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [observations, setObservations] = useState<string[]>([]);
  const [detection, setDetection] = useState<string | null>(null);
  const [detectAttempts, setDetectAttempts] = useState(0);
  const [evidencePlaced, setEvidencePlaced] = useState(false);
  const [evidenceChoice, setEvidenceChoice] = useState<"same" | "different" | null>(null);
  const [evidenceMessage, setEvidenceMessage] = useState("");
  const [divider, setDivider] = useState(PAINTED_SPLIT);
  const [dragging, setDragging] = useState(false);
  const [repairAttempts, setRepairAttempts] = useState(0);
  const [fairness, setFairness] = useState<"yes" | "no" | null>(null);
  const [answers, setAnswers] = useState<[string | null, string | null]>([null, null]);
  const [written, setWritten] = useState("");
  const [explanationMethod, setExplanationMethod] = useState<CaseResult["explanation"]["method"]>(
    null,
  );
  const [hintIndex, setHintIndex] = useState(0);
  const [applyComplete, setApplyComplete] = useState(false);

  const reportRef = useRef<HTMLDivElement>(null);
  const repairRef = useRef<HTMLDivElement>(null);
  const dividerBoardRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ id: string; board: HTMLElement } | null>(null);

  const welcomeMessage: UIMessage = useMemo(
    () => ({
      id: "canvas-welcome",
      role: "assistant",
      parts: [
        {
          type: "text",
          text: "You moved my line. Can you tell me why my first canvas was not halves?",
        },
      ],
    }),
    [],
  );
  const transport = useRef(new DefaultChatTransport({ api: definition.chatEndpoint })).current;
  const { messages, sendMessage, regenerate, status, error } = useChat({
    id: "case-01-canvas",
    messages: [welcomeMessage],
    transport,
  });
  const isSending = status === "submitted" || status === "streaming";

  const studentQuotes = useMemo(
    () =>
      messages
        .filter((message) => message.role === "user")
        .map((message) =>
          message.parts
            .map((part) => (part.type === "text" ? part.text : ""))
            .join("")
            .trim(),
        )
        .filter(Boolean),
    [messages],
  );

  const moved = history.length > 0;
  const repairReady = Math.abs(divider - 50) <= 6;
  const explanationReady = answers.every(Boolean);
  const currentStage: Stage = stage === "brief" ? "investigate" : stage;

  useEffect(() => {
    if (stage !== "explain") return;
    const solved = messages.some(
      (message) =>
        message.role === "assistant" &&
        message.parts.some((part) => part.type === "text" && part.text.includes(SOLVED_TOKEN)),
    );
    if (solved) {
      setStage("solved");
      onSolved();
      celebrate();
    }
  }, [messages, onSolved, stage]);

  useEffect(() => {
    if (stage !== "repair") return;
    const timer = window.setTimeout(
      () => repairRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }),
      120,
    );
    return () => window.clearTimeout(timer);
  }, [stage]);

  useEffect(() => {
    if (stage !== "solved") return;
    const timer = window.setTimeout(
      () => reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      180,
    );
    return () => window.clearTimeout(timer);
  }, [stage]);

  const marks = {
    investigate: moved ? 5 : 3,
    detect: detection === DETECT_CHOICES[1] ? (evidencePlaced ? 5 : 3) : 0,
    repair: repairReady ? 5 : 0,
    explain: stage === "solved" ? 5 : 0,
  };

  useReportRecorder({
    active: stage === "solved",
    caseId: "case-01",
    subId: "canvas",
    caseTitle: "Case 01.03 · The Painted Canvas",
    subTitle: definition.title,
    emoji: definition.emoji,
    glitchSummary: definition.subtitle,
    conceptMastered: "Halves are two equal parts of one whole",
    studentQuotes,
    marks,
  });

  /** Structured reasoning evidence for the Detective's Report. */
  const buildResult = (): CaseResult => ({
    caseId: "case-01.03",
    levelId: "level-01",
    concept: "Parts of a Whole",
    completed: true,
    investigation: {
      interactedWithModel: true,
      manipulatedObjects: moved,
      comparedObjects: moved && evidencePlaced,
      exploredBeforeAnswering: moved,
    },
    detection: {
      selectedClaim: detection,
      correctDetection: detection === DETECT_CHOICES[1],
      attempts: Math.max(1, detectAttempts),
      identifiedRelevantEvidence: evidenceChoice === "different",
      evidenceType: "size comparison",
    },
    repair: {
      attempted: repairAttempts > 0,
      successful: repairReady,
      attempts: repairAttempts,
      usedManipulation: true,
      requiredHint: hintIndex > 0,
    },
    explanation: {
      method: explanationMethod,
      response: studentQuotes.at(-1) ?? "",
      demonstratedUnderstanding: true,
    },
    support: {
      hintsUsed: hintIndex > 0,
      hintCount: hintIndex,
      retries: Math.max(0, detectAttempts - 1),
      changedAnswer: detectAttempts > 1,
      revisedAfterEvidence: detectAttempts > 1,
    },
    interaction: {
      attemptCount: detectAttempts + repairAttempts,
      completedWithoutAnswerReveal: true,
    },
    timestamp: Date.now(),
  });
  useCaseResultRecorder(stage === "solved", buildResult);
  const reflection = useMemo(
    () => generateCaseReflection(buildResult()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [stage],
  );

  /* ------------------------------------------------- investigation drags */

  const moveRegion = (id: string, clientX: number, clientY: number, board: HTMLElement) => {
    const rect = board.getBoundingClientRect();
    setPositions((current) => ({
      ...current,
      [id]: {
        x: Math.min(90, Math.max(10, ((clientX - rect.left) / rect.width) * 100)),
        y: Math.min(84, Math.max(16, ((clientY - rect.top) / rect.height) * 100)),
      },
    }));
  };

  const startDrag = (id: string, event: ReactPointerEvent<HTMLButtonElement>) => {
    const board = event.currentTarget.closest<HTMLElement>("[data-canvas-board]");
    if (!board) return;
    setHistory((current) => [...current.slice(-9), positions]);
    setSelectedRegion(id);
    dragRef.current = { id, board };
    event.currentTarget.setPointerCapture(event.pointerId);
    moveRegion(id, event.clientX, event.clientY, board);
  };

  const onDrag = (id: string, event: ReactPointerEvent<HTMLButtonElement>) => {
    if (dragRef.current?.id !== id) return;
    moveRegion(id, event.clientX, event.clientY, dragRef.current.board);
  };

  const keyMove = (id: string, event: ReactKeyboardEvent<HTMLButtonElement>) => {
    const delta = event.shiftKey ? 10 : 5;
    const current = positions[id] ?? { x: 50, y: 50 };
    let next: Point | null = null;
    if (event.key === "ArrowLeft") next = { x: Math.max(10, current.x - delta), y: current.y };
    if (event.key === "ArrowRight") next = { x: Math.min(90, current.x + delta), y: current.y };
    if (event.key === "ArrowUp") next = { x: current.x, y: Math.max(16, current.y - delta) };
    if (event.key === "ArrowDown") next = { x: current.x, y: Math.min(84, current.y + delta) };
    if (!next) return;
    event.preventDefault();
    setHistory((currentHistory) => [...currentHistory.slice(-9), positions]);
    setPositions((currentPositions) => ({ ...currentPositions, [id]: next }));
  };

  /* --------------------------------------------------------- repair line */

  const updateDivider = (clientX: number) => {
    const rect = dividerBoardRef.current?.getBoundingClientRect();
    if (!rect) return;
    setDivider(Math.min(92, Math.max(8, ((clientX - rect.left) / rect.width) * 100)));
  };

  const finishDivider = () => {
    setDivider((current) => (Math.abs(current - 50) <= 9 ? 50 : current));
    setDragging(false);
    setRepairAttempts((count) => count + 1);
  };

  const dividerKey = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    const delta = event.shiftKey ? 8 : 2;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setDivider(50);
      setRepairAttempts((count) => count + 1);
      return;
    }
    let next: number | null = null;
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") next = divider - delta;
    if (event.key === "ArrowRight" || event.key === "ArrowUp") next = divider + delta;
    if (event.key === "Home") next = 8;
    if (event.key === "End") next = 92;
    if (next === null) return;
    event.preventDefault();
    setDivider(Math.max(8, Math.min(92, next)));
  };

  const submitExplanation = (text: string, method: CaseResult["explanation"]["method"]) => {
    if (!text.trim() || isSending) return;
    setExplanationMethod(method);
    sendMessage({ text });
  };

  /* ------------------------------------------------------------- render */

  if (stage === "brief") {
    return (
      <div className="space-y-5">
        <CanvasProgress current="brief" />
        <section className="grid items-center gap-8 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="label-eyebrow text-muted-foreground">CASE 01.03 · LEVEL 01</span>
              <span className="rounded-full bg-energy px-3 py-1 text-[10px] font-black tracking-widest text-energy-foreground">
                NEW CASE
              </span>
            </div>
            <div>
              <p className="label-eyebrow text-primary">THE HALF-THAT-ISN'T GLITCH</p>
              <h2 className="mt-2 text-4xl font-black leading-tight text-foreground sm:text-5xl">
                The Painted Canvas
              </h2>
              <p className="mt-4 max-w-lg text-lg leading-relaxed text-muted-foreground">
                Nia asked ZED-4 to paint half of her canvas. ZED-4 drew one line, painted one side,
                and says the job is done. Something might be wrong…
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-secondary p-4">
              <p className="label-eyebrow text-muted-foreground">YOUR MISSION</p>
              <p className="mt-2 text-base font-bold text-foreground">
                Investigate ZED-4's canvas.
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Take your time. No timer. No score.
              </p>
            </div>
            <Button
              type="button"
              size="lg"
              onClick={() => setStage("investigate")}
              className="w-full font-black sm:w-auto"
            >
              START INVESTIGATION <span aria-hidden>→</span>
            </Button>
          </div>
          <BriefScene />
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <Button type="button" variant="ghost" size="sm" onClick={onBackToPicker}>
          ← Choose another case
        </Button>
        <span className="label-eyebrow text-muted-foreground">CASE 01.03 · THE PAINTED CANVAS</span>
      </div>
      <CaseStepper stage={currentStage} />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          {stage === "investigate" && (
            <>
              <StageIntro
                eyebrow="INVESTIGATE"
                title="Look closely. Check ZED-4's canvas."
                text="Move the two parts around. Put them side by side. What do you notice?"
              />
              <InvestigationScene />
              <ComparisonBoard
                positions={positions}
                selected={selectedRegion}
                observations={observations}
                onSelect={setSelectedRegion}
                onStartDrag={startDrag}
                onDrag={onDrag}
                onFinishDrag={() => {
                  dragRef.current = null;
                }}
                onKey={keyMove}
                onUndo={() => {
                  const previous = history.at(-1);
                  if (!previous) return;
                  setPositions(previous);
                  setHistory((current) => current.slice(0, -1));
                }}
                onReset={() => {
                  setPositions(Object.fromEntries(REGIONS.map((r) => [r.id, r.start])));
                  setSelectedRegion(null);
                }}
                onObservation={(observation) =>
                  setObservations((current) =>
                    current.includes(observation)
                      ? current.filter((item) => item !== observation)
                      : [...current, observation],
                  )
                }
              />
              <HintBox
                hintIndex={hintIndex}
                onHint={() => setHintIndex((index) => Math.min(HINTS.length, index + 1))}
              />
              <PrimaryNext onClick={() => setStage("detect")}>
                I'M READY TO DETECT <span aria-hidden>→</span>
              </PrimaryNext>
            </>
          )}

          {stage === "detect" && (
            <>
              <StageIntro
                eyebrow="DETECT THE GLITCH"
                title="What went wrong with ZED-4's canvas?"
                text="Choose an idea, then show the evidence that supports it."
              />
              <DetectPanel
                selected={detection}
                evidencePlaced={evidencePlaced}
                evidenceChoice={evidenceChoice}
                evidenceMessage={evidenceMessage}
                onSelect={(choice) => {
                  setDetection(choice);
                  setDetectAttempts((count) => count + 1);
                }}
                onPlaceEvidence={() => setEvidencePlaced(true)}
                onEvidenceChoice={setEvidenceChoice}
                onConfirm={() => {
                  if (evidencePlaced && evidenceChoice === "different") {
                    setEvidenceMessage("");
                    setStage("repair");
                  } else {
                    setEvidenceMessage("Let's look again. Line the two parts up and compare them.");
                  }
                }}
                onBack={() => setStage("investigate")}
              />
            </>
          )}

          {stage === "repair" && (
            <div ref={repairRef}>
              <StageIntro
                eyebrow="REPAIR THE GLITCH"
                title="Move the line until the canvas shows two halves."
                text="Drag the line. It will gently settle when both parts match."
              />
              <RepairPanel
                divider={divider}
                dragging={dragging}
                ready={repairReady}
                fairness={fairness}
                boardRef={dividerBoardRef}
                onDown={(event) => {
                  event.preventDefault();
                  setDragging(true);
                  updateDivider(event.clientX);
                }}
                onMove={(event) => {
                  if (dragging) updateDivider(event.clientX);
                }}
                onUp={() => {
                  if (dragging) finishDivider();
                }}
                onKey={dividerKey}
                onFairness={setFairness}
                onReset={() => {
                  setDivider(PAINTED_SPLIT);
                  setFairness(null);
                }}
                onSubmit={() => {
                  if (repairReady && fairness === "yes") setStage("explain");
                }}
              />
            </div>
          )}

          {stage === "explain" && (
            <ExplainPanel
              answers={answers}
              written={written}
              ready={explanationReady}
              onAnswer={(index, answer) =>
                setAnswers((current) => {
                  const next: [string | null, string | null] = [...current];
                  next[index] = answer;
                  return next;
                })
              }
              onWritten={setWritten}
              onSpeak={(text) => submitExplanation(text, "speak")}
              onSubmit={() =>
                submitExplanation(
                  `Half means ${answers[0]}. ZED-4's canvas was not half because ${answers[1]}.`,
                  "sentence",
                )
              }
            />
          )}

          {stage === "solved" && (
            <div ref={reportRef} className="space-y-5">
              <CaseReflectionCard reflection={reflection} onTryAnother={onBackToPicker} />
              <ApplyChallenge complete={applyComplete} onComplete={() => setApplyComplete(true)} />
            </div>
          )}
        </div>
        <ChatPanel
          stage={currentStage}
          messages={messages}
          isSending={isSending}
          error={error}
          onSend={(text) => submitExplanation(text, "write")}
          onRetry={() => void regenerate()}
          onViewReport={() =>
            reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
          }
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- pieces */

function CanvasProgress({ current }: { current: CanvasStage }) {
  const steps = ["brief", "investigate", "detect", "repair", "explain"] as const;
  const active = current === "solved" ? steps.length : steps.indexOf(current);
  return (
    <ol
      className="grid grid-cols-5 gap-1 rounded-2xl border border-border bg-card p-3 text-center"
      aria-label="Case progress"
    >
      {steps.map((step, index) => (
        <li
          key={step}
          className={`rounded-xl px-1 py-2 text-[10px] font-black uppercase tracking-wider ${index === active ? "bg-primary text-primary-foreground" : index < active ? "bg-secondary text-foreground" : "text-muted-foreground"}`}
        >
          {index < active ? "✓ " : ""}
          {step === "brief" ? "Brief" : step}
        </li>
      ))}
    </ol>
  );
}

function StageIntro({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <section className="flex items-start gap-3 border-b border-border pb-4">
      <div className="flex-1">
        <p className="label-eyebrow text-primary">{eyebrow}</p>
        <h2 className="mt-1 text-2xl font-black text-foreground sm:text-3xl">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{text}</p>
      </div>
      <SpeakButton text={`${eyebrow}. ${title}. ${text}`} size="md" />
    </section>
  );
}

/** The canvas artwork. `split` is the painted share as a percentage. */
function CanvasIllustration({ split, showLine = true }: { split: number; showLine?: boolean }) {
  const x = 30 + (split / 100) * 440;
  return (
    <svg
      viewBox="0 0 500 300"
      className="mx-auto h-auto w-full max-w-[500px]"
      role="img"
      aria-label={`A canvas with a dividing line. The painted part covers about ${Math.round(split)} percent of the canvas.`}
    >
      <rect x="14" y="14" width="472" height="272" rx="14" fill="var(--muted)" />
      <rect x="30" y="30" width="440" height="240" rx="6" fill="var(--card)" />
      <rect x="30" y="30" width={(split / 100) * 440} height="240" rx="4" fill="var(--primary)" />
      {showLine && (
        <line x1={x} y1="30" x2={x} y2="270" stroke="var(--energy)" strokeWidth="6" strokeLinecap="round" />
      )}
      <rect
        x="30"
        y="30"
        width="440"
        height="240"
        rx="6"
        fill="none"
        stroke="var(--border)"
        strokeWidth="4"
      />
    </svg>
  );
}

function BriefScene() {
  return (
    <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-3xl border border-border bg-secondary p-5">
      <div className="absolute left-5 top-5 rounded-xl bg-card px-3 py-2 text-xs font-bold text-foreground">
        Nia's canvas
      </div>
      <CanvasIllustration split={PAINTED_SPLIT} />
      <div className="absolute bottom-5 right-5 rounded-2xl border border-primary bg-card p-3 text-center shadow-sm">
        <div className="text-3xl" aria-hidden>
          🤖
        </div>
        <p className="text-xs font-black text-foreground">ZED-4</p>
        <p className="text-[10px] text-muted-foreground">Case closed! ✓</p>
      </div>
    </div>
  );
}

function InvestigationScene() {
  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="label-eyebrow text-muted-foreground">ZED-4'S COMPLETED SOLUTION</p>
          <h3 className="mt-1 text-lg font-black text-foreground">
            Two parts. One painted. Different sizes.
          </h3>
        </div>
        <SpeakButton text="ZED-4's completed solution. Two parts. One painted. Different sizes." />
      </div>
      <div className="mt-4 grid items-center gap-4 sm:grid-cols-[1fr_auto]">
        <CanvasIllustration split={PAINTED_SPLIT} />
        <div className="rounded-2xl border border-border bg-secondary p-3 sm:max-w-xs">
          <p className="text-sm font-bold text-foreground">ZED-4 says:</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            “I drew 1 line.”
            <br />
            “That makes 2 parts.”
            <br />
            “I painted 1 part.”
            <br />
            “So I painted half!”
          </p>
          <p className="mt-3 text-xs font-black uppercase tracking-wider text-primary">
            CASE CLOSED! ✓
          </p>
        </div>
      </div>
    </section>
  );
}

type ComparisonProps = {
  positions: Record<string, Point>;
  selected: string | null;
  observations: string[];
  onSelect: (id: string) => void;
  onStartDrag: (id: string, event: ReactPointerEvent<HTMLButtonElement>) => void;
  onDrag: (id: string, event: ReactPointerEvent<HTMLButtonElement>) => void;
  onFinishDrag: () => void;
  onKey: (id: string, event: ReactKeyboardEvent<HTMLButtonElement>) => void;
  onUndo: () => void;
  onReset: () => void;
  onObservation: (observation: string) => void;
};

function ComparisonBoard(props: ComparisonProps) {
  return (
    <section className="rounded-2xl border-2 border-dashed border-border bg-background p-4 sm:p-5">
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <p className="label-eyebrow text-muted-foreground">LOOK CLOSER</p>
          <h3 className="mt-1 text-base font-black text-foreground">
            Move the two parts of the canvas.
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Put them side by side. Compare them. What do you notice?
          </p>
        </div>
        <SpeakButton
          text="Look closer. Move the two parts of the canvas. Put them side by side. Compare them. What do you notice?"
          size="md"
        />
      </div>
      <div
        className="relative mt-4 min-h-56 touch-none overflow-hidden rounded-xl border border-border bg-secondary/50"
        data-canvas-board
        aria-label="Move the canvas parts to compare them"
      >
        <div className="pointer-events-none absolute inset-x-5 top-1/2 border-t border-dashed border-border" />
        {REGIONS.map((region) => {
          const point = props.positions[region.id] ?? region.start;
          return (
            <button
              key={region.id}
              type="button"
              className={`absolute flex min-h-14 -translate-x-1/2 -translate-y-1/2 touch-none items-center justify-center gap-2 rounded-xl border-2 px-2 text-[11px] font-black shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${region.id === "painted" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground"} ${props.selected === region.id ? "ring-4 ring-energy/60" : ""}`}
              style={{
                left: `${point.x}%`,
                top: `${point.y}%`,
                width: `${40 + region.width * 2.6}px`,
              }}
              onPointerDown={(event) => props.onStartDrag(region.id, event)}
              onPointerMove={(event) => props.onDrag(region.id, event)}
              onPointerUp={props.onFinishDrag}
              onPointerCancel={props.onFinishDrag}
              onKeyDown={(event) => props.onKey(region.id, event)}
              onClick={() => props.onSelect(region.id)}
              aria-label={`Move the ${region.label.toLowerCase()}`}
            >
              <GripVertical className="h-4 w-4 shrink-0" aria-hidden />
              <span className="truncate">{region.label}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold text-muted-foreground" aria-live="polite">
          {props.selected ? "Part selected. Move it with your finger or arrow keys." : "Pick up a part and move it."}
        </p>
        <div className="flex gap-1">
          <Button type="button" variant="ghost" size="sm" onClick={props.onUndo}>
            <Undo2 className="h-3.5 w-3.5" aria-hidden /> Undo
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={props.onReset}>
            <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Reset
          </Button>
        </div>
      </div>
      <div className="mt-4 rounded-xl border border-border bg-card p-3">
        <p className="text-sm font-black text-foreground">DETECTIVE NOTES</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Select anything you observe. Notes are not graded.
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {OBSERVATION_CHOICES.map((observation) => (
            <Button
              key={observation}
              type="button"
              variant={props.observations.includes(observation) ? "secondary" : "outline"}
              onClick={() => props.onObservation(observation)}
              className="h-auto min-h-11 justify-start whitespace-normal text-left text-xs"
            >
              {props.observations.includes(observation) && (
                <Check className="h-4 w-4 shrink-0" aria-hidden />
              )}
              {observation}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}

function HintBox({ hintIndex, onHint }: { hintIndex: number; onHint: () => void }) {
  const text = hintIndex > 0 ? HINTS[hintIndex - 1] : "Need a clue? You can investigate first.";
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-secondary p-3">
      <div className="flex items-start gap-2">
        <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
        <p className="text-sm text-foreground">{text}</p>
        <SpeakButton text={text} />
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onHint}
        disabled={hintIndex >= HINTS.length}
      >
        <Lightbulb className="h-4 w-4" aria-hidden /> NEED A CLUE?
      </Button>
    </div>
  );
}

type DetectProps = {
  selected: string | null;
  evidencePlaced: boolean;
  evidenceChoice: "same" | "different" | null;
  evidenceMessage: string;
  onSelect: (choice: string) => void;
  onPlaceEvidence: () => void;
  onEvidenceChoice: (choice: "same" | "different") => void;
  onConfirm: () => void;
  onBack: () => void;
};

function DetectPanel(props: DetectProps) {
  const correct = DETECT_CHOICES[1];
  return (
    <section className="rounded-2xl border-2 border-dashed border-border bg-background p-4 sm:p-5">
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <p className="label-eyebrow text-muted-foreground">DETECT THE GLITCH</p>
          <h3 className="mt-1 text-base font-black text-foreground">
            What went wrong with ZED-4's canvas?
          </h3>
        </div>
        <SpeakButton
          text={`Detect the glitch. What went wrong with ZED-4's canvas? ${DETECT_CHOICES.join(". ")}`}
          size="md"
        />
      </div>
      <div className="mt-4 grid gap-2">
        {DETECT_CHOICES.map((choice, index) => (
          <Button
            key={choice}
            type="button"
            variant={props.selected === choice ? "default" : "outline"}
            onClick={() => props.onSelect(choice)}
            className="h-auto min-h-14 justify-start whitespace-normal px-4 py-3 text-left font-bold"
          >
            <span className="mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-xs text-secondary-foreground">
              {String.fromCharCode(65 + index)}
            </span>
            {choice}
          </Button>
        ))}
      </div>
      <p className="mt-3 text-center text-xs font-semibold text-muted-foreground" aria-live="polite">
        {props.selected && props.selected !== correct
          ? "Not quite. Let's investigate that idea."
          : props.selected
            ? "Good observation. Now show your evidence."
            : "Choose the observation that best matches what you noticed."}
      </p>
      {props.selected && props.selected !== correct && (
        <div className="mt-4 rounded-xl bg-secondary p-3">
          <p className="text-sm font-semibold text-foreground">
            There are two parts. But does two parts always mean two halves?
          </p>
          <Button type="button" variant="outline" size="sm" onClick={props.onBack} className="mt-3">
            RETURN TO INVESTIGATION
          </Button>
        </div>
      )}
      {props.selected === correct && (
        <div className="mt-5 border-t border-dashed border-border pt-4">
          <p className="text-base font-black text-foreground">SHOW YOUR EVIDENCE</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Stack the two parts on top of each other and see whether they match.
          </p>
          <Button
            type="button"
            variant={props.evidencePlaced ? "secondary" : "default"}
            onClick={props.onPlaceEvidence}
            className="mt-3 font-black"
          >
            {props.evidencePlaced ? "PARTS STACKED ✓" : "STACK THE TWO PARTS"}
          </Button>
          {props.evidencePlaced && (
            <>
              <div className="mt-4 space-y-2 rounded-2xl border border-dashed border-primary/40 bg-secondary/60 p-4">
                {REGIONS.map((region) => (
                  <div key={region.id} className="flex items-center gap-3">
                    <div
                      className={`h-10 rounded-lg border-2 ${region.id === "painted" ? "border-primary bg-primary" : "border-border bg-card"}`}
                      style={{ width: `${30 + region.width * 3}px` }}
                    />
                    <span className="text-xs font-bold text-muted-foreground">{region.label}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm font-bold text-foreground">WHAT DO YOU NOTICE?</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <Button
                  type="button"
                  variant={props.evidenceChoice === "same" ? "default" : "outline"}
                  onClick={() => props.onEvidenceChoice("same")}
                >
                  They match exactly.
                </Button>
                <Button
                  type="button"
                  variant={props.evidenceChoice === "different" ? "default" : "outline"}
                  onClick={() => props.onEvidenceChoice("different")}
                >
                  They are different sizes.
                </Button>
              </div>
              <Button type="button" onClick={props.onConfirm} className="mt-4 font-black">
                CONFIRM MY EVIDENCE →
              </Button>
            </>
          )}
        </div>
      )}
      {props.evidenceMessage && (
        <p
          className="mt-3 rounded-xl bg-secondary p-3 text-sm font-semibold text-foreground"
          role="status"
        >
          {props.evidenceMessage}
        </p>
      )}
    </section>
  );
}

type RepairProps = {
  divider: number;
  dragging: boolean;
  ready: boolean;
  fairness: "yes" | "no" | null;
  boardRef: React.RefObject<HTMLDivElement | null>;
  onDown: (event: ReactPointerEvent<HTMLButtonElement>) => void;
  onMove: (event: ReactPointerEvent<HTMLDivElement>) => void;
  onUp: () => void;
  onKey: (event: ReactKeyboardEvent<HTMLButtonElement>) => void;
  onFairness: (choice: "yes" | "no") => void;
  onReset: () => void;
  onSubmit: () => void;
};

function RepairPanel(props: RepairProps) {
  return (
    <section className="rounded-2xl border-2 border-primary bg-card shadow-sm">
      <header className="border-b border-border bg-secondary px-4 py-3 sm:px-5">
        <p className="label-eyebrow text-muted-foreground">REPAIR THE GLITCH</p>
        <h3 className="mt-1 text-lg font-black text-foreground">Make two matching halves.</h3>
      </header>
      <div className="space-y-4 p-4 sm:p-5">
        <div
          ref={props.boardRef}
          className="relative mx-auto w-full max-w-2xl touch-none rounded-2xl border border-border bg-secondary/60 p-6"
          onPointerMove={props.onMove}
          onPointerUp={props.onUp}
          onPointerCancel={props.onUp}
        >
          <CanvasIllustration split={props.divider} />
          <div className="absolute inset-x-6 bottom-6 top-6">
            <button
              type="button"
              role="slider"
              aria-label="Canvas dividing line. Drag it until both parts match."
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(props.divider)}
              aria-valuetext={props.ready ? "Two matching halves" : "Parts do not match yet"}
              className={`absolute top-0 h-full w-10 -translate-x-1/2 cursor-ew-resize rounded-xl border-2 border-dashed outline-none focus-visible:ring-2 focus-visible:ring-ring ${props.dragging ? "border-success bg-success/15" : "border-energy bg-energy/10"}`}
              style={{ left: `${props.divider}%` }}
              onPointerDown={props.onDown}
              onKeyDown={props.onKey}
            >
              <span className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-energy text-energy-foreground shadow-sm">
                ↔
              </span>
            </button>
          </div>
        </div>
        <p className="text-center text-xs font-bold text-muted-foreground" aria-live="polite">
          {props.ready
            ? "Both parts match. That is one half painted."
            : "Drag the line. It settles gently when the two parts match."}
        </p>
        {props.ready && (
          <div className="rounded-xl border border-success bg-secondary p-3 text-sm font-bold text-foreground">
            ✓ Two equal parts. Nia's canvas is half painted.
          </div>
        )}
        {props.ready && (
          <div className="rounded-xl border border-border bg-background p-3">
            <p className="text-sm font-black text-foreground">IS THIS HALF?</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <Button
                type="button"
                variant={props.fairness === "yes" ? "default" : "outline"}
                onClick={() => props.onFairness("yes")}
              >
                YES — both parts are the same size.
              </Button>
              <Button
                type="button"
                variant={props.fairness === "no" ? "default" : "outline"}
                onClick={() => props.onFairness("no")}
              >
                NO — one part is bigger.
              </Button>
            </div>
            {props.fairness === "yes" && (
              <p className="mt-3 text-sm font-bold text-success">
                Exactly. Two equal parts make halves.
              </p>
            )}
            {props.fairness === "no" && (
              <p className="mt-3 text-sm font-semibold text-muted-foreground">
                Let's check the line one more time.
              </p>
            )}
          </div>
        )}
        <div className="flex flex-wrap justify-between gap-2 border-t border-dashed border-border pt-3">
          <Button type="button" variant="ghost" size="sm" onClick={props.onReset}>
            <RotateCcw className="h-4 w-4" aria-hidden /> Start again
          </Button>
          <Button
            type="button"
            onClick={props.onSubmit}
            disabled={!props.ready || props.fairness !== "yes"}
            className="font-black"
          >
            CONTINUE TO EXPLAIN →
          </Button>
        </div>
      </div>
    </section>
  );
}

type ExplainProps = {
  answers: [string | null, string | null];
  written: string;
  ready: boolean;
  onAnswer: (index: 0 | 1, answer: string) => void;
  onWritten: (value: string) => void;
  onSpeak: (text: string) => void;
  onSubmit: () => void;
};

function ExplainPanel(props: ExplainProps) {
  const first = ["two parts that match", "two parts", "the painted part", "the bigger part"];
  const second = [
    "one part was bigger than the other",
    "only one part was painted",
    "there was one line",
    "the canvas was too big",
  ];
  return (
    <section className="space-y-5">
      <StageIntro
        eyebrow="EXPLAIN THE GLITCH"
        title="Tell ZED-4 what he got wrong."
        text="Build your answer, speak it, or write it. You do not need a blank page."
      />
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <p className="text-sm font-black text-foreground">1. Half means…</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {first.map((answer) => (
            <Button
              key={answer}
              type="button"
              variant={props.answers[0] === answer ? "default" : "outline"}
              onClick={() => props.onAnswer(0, answer)}
              className="h-auto min-h-12 justify-start whitespace-normal text-left"
            >
              {answer}
            </Button>
          ))}
        </div>
        <p className="mt-5 text-sm font-black text-foreground">
          2. ZED-4's canvas was not half because…
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {second.map((answer) => (
            <Button
              key={answer}
              type="button"
              variant={props.answers[1] === answer ? "default" : "outline"}
              onClick={() => props.onAnswer(1, answer)}
              className="h-auto min-h-12 justify-start whitespace-normal text-left"
            >
              {answer}
            </Button>
          ))}
        </div>
        <Button
          type="button"
          onClick={props.onSubmit}
          disabled={!props.ready}
          className="mt-5 font-black"
        >
          SEND MY ANSWER TO ZED-4 →
        </Button>
      </div>
      <div className="rounded-2xl border border-border bg-secondary p-4">
        <div className="flex items-center gap-2">
          <p className="text-sm font-black text-foreground">🎙️ EXPLAIN IT TO ZED-4</p>
          <SpeakButton text="Explain it to ZED-4. Speaking is optional." />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <MicButton
            disabled={false}
            onTranscript={(text, isFinal) => {
              if (isFinal) props.onSpeak(text);
            }}
          />
          <span className="text-xs text-muted-foreground">Speaking is optional.</span>
        </div>
        <label htmlFor="canvas-explanation" className="mt-4 block text-sm font-bold text-foreground">
          ✏️ WRITE IT (OPTIONAL)
        </label>
        <textarea
          id="canvas-explanation"
          value={props.written}
          onChange={(event) => props.onWritten(event.target.value)}
          rows={3}
          placeholder="ZED-4 was wrong because…"
          className="mt-2 w-full resize-none rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <Button
          type="button"
          variant="outline"
          disabled={!props.written.trim()}
          onClick={() => props.onSpeak(props.written)}
          className="mt-2"
        >
          SEND MY WRITTEN IDEA
        </Button>
      </div>
    </section>
  );
}

function ApplyChallenge({ complete, onComplete }: { complete: boolean; onComplete: () => void }) {
  return (
    <section className="rounded-2xl border-2 border-primary bg-card p-5 shadow-sm sm:p-6">
      <p className="label-eyebrow text-muted-foreground">REAL-WORLD CHALLENGE</p>
      <h2 className="mt-1 text-2xl font-black text-foreground">DETECTIVE CHALLENGE</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Take a sheet of paper and a pencil. Colour exactly half of it. Then fold the paper to check:
        do the two parts land on top of each other? How did you know it was half?
      </p>
      <Button type="button" onClick={onComplete} disabled={complete} className="mt-4 font-black">
        {complete ? (
          <>
            <Check className="h-4 w-4" aria-hidden /> CHALLENGE LOGGED
          </>
        ) : (
          "I TRIED THE CHALLENGE"
        )}
      </Button>
    </section>
  );
}

function PrimaryNext({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <div className="flex justify-end">
      <Button type="button" onClick={onClick} size="lg" className="font-black">
        {children}
      </Button>
    </div>
  );
}
