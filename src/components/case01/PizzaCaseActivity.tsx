/**
 * The Pizza case is intentionally separate from the later Case 01 sub-cases.
 * It is the reference investigation: a child sees a confident claim, gathers
 * evidence, makes a forgiving repair, explains the reasoning, and applies it.
 */
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Check, GripVertical, Lightbulb, RotateCcw, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CaseStepper, type Stage } from "@/components/case01/CaseStepper";
import { DiagnosticReport } from "@/components/case01/DiagnosticReport";
import { MicButton } from "@/components/case01/MicButton";
import { SpeakButton } from "@/components/case01/SpeakButton";
import { ChatPanel } from "@/components/shared/ChatPanel";
import type { SubCaseDef } from "@/components/case01/cases";
import { useReportRecorder } from "@/hooks/useReportRecorder";
import { celebrate } from "@/lib/celebrate";

const SOLVED_TOKEN = "[[CASE_SOLVED]]";
type PizzaStage = "brief" | Stage;
type Point = { x: number; y: number };
type Tool = "move" | "rotate" | "compare";
type Recipient = "Maya" | "Leo" | "Sam" | "ZED-4";

const RECIPIENTS: Recipient[] = ["Maya", "Leo", "Sam", "ZED-4"];
const PIECES = [
  { id: "A", size: "large", start: { x: 18, y: 52 } },
  { id: "B", size: "small", start: { x: 40, y: 28 } },
  { id: "C", size: "medium", start: { x: 64, y: 51 } },
  { id: "D", size: "mediumLarge", start: { x: 40, y: 77 } },
] as const;

const HINTS = [
  "Everyone has one piece. Is each piece the same size?",
  "Try putting two pieces beside each other.",
  "A fair share means each person receives the same amount.",
];

type Props = {
  definition: SubCaseDef;
  onSolved: () => void;
  onBackToPicker: () => void;
};

type ObservationLog = {
  detectedCorrectGlitch: boolean;
  usedComparison: boolean;
  repairedPizza: boolean;
  distributedEqualShares: boolean;
  explanationMethod: "sentence" | "speak" | "write" | null;
  hintsUsed: number;
  attemptCount: number;
  revisedAnswer: boolean;
};

const emptyLog: ObservationLog = {
  detectedCorrectGlitch: false,
  usedComparison: false,
  repairedPizza: false,
  distributedEqualShares: false,
  explanationMethod: null,
  hintsUsed: 0,
  attemptCount: 0,
  revisedAnswer: false,
};

function readLog(): ObservationLog {
  if (typeof window === "undefined") return emptyLog;
  try {
    const raw = window.localStorage.getItem("gd:case-01-01:observations:v1");
    return raw ? { ...emptyLog, ...(JSON.parse(raw) as Partial<ObservationLog>) } : emptyLog;
  } catch {
    return emptyLog;
  }
}

function PizzaCaseExperience({ definition, onSolved, onBackToPicker }: Props) {
  const [stage, setStage] = useState<PizzaStage>("brief");
  const [tool, setTool] = useState<Tool>("move");
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null);
  const [piecePositions, setPiecePositions] = useState<Record<string, Point>>(() =>
    Object.fromEntries(PIECES.map((piece) => [piece.id, piece.start])),
  );
  const [pieceRotations, setPieceRotations] = useState<Record<string, number>>({});
  const [positionHistory, setPositionHistory] = useState<Record<string, Point>[]>([]);
  const [observations, setObservations] = useState<string[]>([]);
  const [detectSelection, setDetectSelection] = useState<string | null>(null);
  const [evidencePair, setEvidencePair] = useState<string[]>([]);
  const [evidenceChoice, setEvidenceChoice] = useState<"same" | "different" | null>(null);
  const [evidenceMessage, setEvidenceMessage] = useState("");
  const [cutDirections, setCutDirections] = useState<("vertical" | "horizontal")[]>([]);
  const [cutPosition, setCutPosition] = useState(50);
  const [assigned, setAssigned] = useState<Recipient[]>([]);
  const [fairness, setFairness] = useState<"yes" | "no" | null>(null);
  const [explanationAnswers, setExplanationAnswers] = useState<[string | null, string | null]>([
    null,
    null,
  ]);
  const [writtenExplanation, setWrittenExplanation] = useState("");
  const [explanationMethod, setExplanationMethod] =
    useState<ObservationLog["explanationMethod"]>(null);
  const [hintIndex, setHintIndex] = useState(0);
  const [log, setLog] = useState<ObservationLog>(emptyLog);
  const [applyComplete, setApplyComplete] = useState(false);
  const [reportRef, repairRef] = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
  const dragRef = useRef<{ id: string; board: HTMLElement } | null>(null);

  const welcomeMessage: UIMessage = useMemo(
    () => ({
      id: "pizza-welcome",
      role: "assistant",
      parts: [
        {
          type: "text",
          text: "Great detective work! You fixed my pizza. Can you tell me why my first try was not fair?",
        },
      ],
    }),
    [],
  );
  const transport = useRef(new DefaultChatTransport({ api: definition.chatEndpoint })).current;
  const { messages, sendMessage, regenerate, status, error } = useChat({
    id: "case-01-pizza",
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
    setLog(readLog());
  }, []);

  useEffect(() => {
    const nextLog = { ...log, explanationMethod, hintsUsed: hintIndex };
    window.localStorage.setItem("gd:case-01-01:observations:v1", JSON.stringify(nextLog));
  }, [explanationMethod, hintIndex, log]);

  useEffect(() => {
    if (stage === "repair") {
      const timer = window.setTimeout(
        () => repairRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }),
        120,
      );
      return () => window.clearTimeout(timer);
    }
  }, [stage, repairRef]);

  const updateLog = (change: Partial<ObservationLog>) =>
    setLog((current) => ({ ...current, ...change }));
  const repairReady = cutDirections.length === 2 && cutDirections[0] !== cutDirections[1];
  const distributed = assigned.length === RECIPIENTS.length;
  const fairnessReady = repairReady && distributed && fairness === "yes";
  const explanationReady = explanationAnswers.every(Boolean);
  const currentStage: Stage = stage === "brief" ? "investigate" : stage;
  const marks = {
    investigate: stage === "brief" ? 0 : 5,
    detect: log.detectedCorrectGlitch ? 5 : 0,
    repair: log.repairedPizza && log.distributedEqualShares ? 5 : 0,
    explain: stage === "solved" ? 5 : 0,
  };

  useReportRecorder({
    active: stage === "solved",
    caseId: "case-01",
    subId: "pizza",
    caseTitle: "Case 01.01 · The Pizza",
    subTitle: definition.title,
    emoji: definition.emoji,
    glitchSummary: definition.subtitle,
    conceptMastered: definition.conceptMastered,
    studentQuotes,
    marks,
  });

  const movePiece = (id: string, clientX: number, clientY: number, board: HTMLElement) => {
    const rect = board.getBoundingClientRect();
    setPiecePositions((current) => ({
      ...current,
      [id]: {
        x: Math.min(90, Math.max(10, ((clientX - rect.left) / rect.width) * 100)),
        y: Math.min(84, Math.max(16, ((clientY - rect.top) / rect.height) * 100)),
      },
    }));
    updateLog({ usedComparison: true });
  };

  const startDrag = (id: string, event: ReactPointerEvent<HTMLButtonElement>) => {
    if (tool !== "move") return;
    const board = event.currentTarget.closest<HTMLElement>("[data-pizza-board]");
    if (!board) return;
    setPositionHistory((history) => [...history.slice(-9), piecePositions]);
    setSelectedPiece(id);
    dragRef.current = { id, board };
    event.currentTarget.setPointerCapture(event.pointerId);
    movePiece(id, event.clientX, event.clientY, board);
  };

  const onDrag = (id: string, event: ReactPointerEvent<HTMLButtonElement>) => {
    if (dragRef.current?.id !== id) return;
    movePiece(id, event.clientX, event.clientY, dragRef.current.board);
  };

  const finishDrag = () => {
    dragRef.current = null;
  };

  const resetInvestigation = () => {
    setPiecePositions(Object.fromEntries(PIECES.map((piece) => [piece.id, piece.start])));
    setPieceRotations({});
    setPositionHistory([]);
    setSelectedPiece(null);
  };

  const chooseTool = (next: Tool) => {
    setTool(next);
    if (next === "rotate" && selectedPiece) {
      setPieceRotations((current) => ({
        ...current,
        [selectedPiece]: (current[selectedPiece] ?? 0) + 45,
      }));
    }
  };

  const submitExplanation = (text: string, method: ObservationLog["explanationMethod"]) => {
    if (!text.trim() || isSending) return;
    setExplanationMethod(method);
    updateLog({ explanationMethod: method });
    sendMessage({ text });
  };

  if (stage === "brief") {
    return (
      <div className="space-y-5">
        <PizzaProgress current="brief" />
        <section className="grid items-center gap-8 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="label-eyebrow text-muted-foreground">CASE 01.01 · LEVEL 01</span>
              <span className="rounded-full bg-energy px-3 py-1 text-[10px] font-black tracking-widest text-energy-foreground">
                NEW CASE
              </span>
            </div>
            <div>
              <p className="label-eyebrow text-primary">THE FAIR-SHARE GLITCH</p>
              <h2 className="mt-2 text-4xl font-black leading-tight text-foreground sm:text-5xl">
                The Pizza
              </h2>
              <p className="mt-4 max-w-lg text-lg leading-relaxed text-muted-foreground">
                ZED-4 tried to share a pizza fairly. He thinks he solved it. But something might be
                wrong...
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-secondary p-4">
              <p className="label-eyebrow text-muted-foreground">YOUR MISSION</p>
              <p className="mt-2 text-base font-bold text-foreground">
                Investigate ZED-4’s solution.
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Take your time. There are no timers or scores.
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
          <PizzaBriefScene />
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
        <span className="label-eyebrow text-muted-foreground">CASE 01.01 · THE PIZZA</span>
      </div>
      <CaseStepper stage={currentStage} />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          {stage === "investigate" && (
            <>
              <StageIntro
                eyebrow="INVESTIGATE"
                title="Look closely. Something may not be right."
                text="ZED-4 gave everyone one piece. Check the pieces before you trust his claim."
              />
              <InvestigationScene />
              <InvestigationBoard
                tool={tool}
                selectedPiece={selectedPiece}
                piecePositions={piecePositions}
                pieceRotations={pieceRotations}
                onTool={chooseTool}
                onSelect={setSelectedPiece}
                onStartDrag={startDrag}
                onDrag={onDrag}
                onFinishDrag={finishDrag}
                onUndo={() => {
                  const previous = positionHistory.at(-1);
                  if (!previous) return;
                  setPiecePositions(previous);
                  setPositionHistory((history) => history.slice(0, -1));
                }}
                onReset={resetInvestigation}
                observations={observations}
                onObservation={(observation) =>
                  setObservations((current) =>
                    current.includes(observation)
                      ? current.filter((item) => item !== observation)
                      : [...current, observation],
                  )
                }
              />
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-secondary p-3">
                <div className="flex items-start gap-2">
                  <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                  <p className="text-sm text-foreground">
                    {hintIndex > 0
                      ? HINTS[hintIndex - 1]
                      : "Need a clue? You can investigate first."}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setHintIndex((index) => Math.min(HINTS.length, index + 1))}
                  disabled={hintIndex >= HINTS.length}
                >
                  <Lightbulb className="h-4 w-4" aria-hidden /> NEED A CLUE?
                </Button>
              </div>
              <PrimaryNext onClick={() => setStage("detect")}>
                I’M READY TO DETECT <span aria-hidden>→</span>
              </PrimaryNext>
            </>
          )}

          {stage === "detect" && (
            <>
              <StageIntro
                eyebrow="DETECT THE GLITCH"
                title="What went wrong with ZED-4’s reasoning?"
                text="Choose an idea, then show the evidence that supports it."
              />
              <DetectPanel
                selected={detectSelection}
                onSelect={(choice) => {
                  setDetectSelection(choice);
                  if (choice !== "The pieces are different sizes.") {
                    updateLog({ attemptCount: log.attemptCount + 1, revisedAnswer: true });
                  }
                }}
                evidencePair={evidencePair}
                evidenceChoice={evidenceChoice}
                evidenceMessage={evidenceMessage}
                onPair={(piece) =>
                  setEvidencePair((current) =>
                    current.includes(piece)
                      ? current.filter((item) => item !== piece)
                      : current.length < 2
                        ? [...current, piece]
                        : current,
                  )
                }
                onEvidenceChoice={setEvidenceChoice}
                onConfirm={() => {
                  if (evidenceChoice === "different" && evidencePair.length === 2) {
                    updateLog({ detectedCorrectGlitch: true, usedComparison: true });
                    setStage("repair");
                  } else {
                    setEvidenceMessage(
                      "That evidence does not match your claim yet. Compare the two pieces again.",
                    );
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
                title="Can you fix ZED-4’s pizza?"
                text="Make four equal shares. The cut does not need to be perfect to show your idea."
              />
              <RepairPanel
                cutDirections={cutDirections}
                cutPosition={cutPosition}
                ready={repairReady}
                assigned={assigned}
                distributed={distributed}
                fairness={fairness}
                onCut={(direction) =>
                  setCutDirections((current) =>
                    current.length < 2 ? [...current, direction] : current,
                  )
                }
                onCutPosition={setCutPosition}
                onReset={() => {
                  setCutDirections([]);
                  setAssigned([]);
                  setFairness(null);
                  setCutPosition(50);
                }}
                onAssign={(recipient) =>
                  setAssigned((current) =>
                    current.includes(recipient)
                      ? current.filter((item) => item !== recipient)
                      : [...current, recipient],
                  )
                }
                onFairness={setFairness}
                onSubmit={() => {
                  if (!fairnessReady) return;
                  updateLog({ repairedPizza: true, distributedEqualShares: true });
                  setStage("explain");
                }}
              />
            </div>
          )}

          {stage === "explain" && (
            <ExplainPanel
              answers={explanationAnswers}
              written={writtenExplanation}
              onAnswer={(index, answer) =>
                setExplanationAnswers((current) => {
                  const next: [string | null, string | null] = [...current];
                  next[index] = answer;
                  return next;
                })
              }
              onWritten={setWrittenExplanation}
              onSpeak={(text) => submitExplanation(text, "speak")}
              onSubmit={() => {
                const sentence = `A fair share means everyone gets ${explanationAnswers[0]}. ZED-4's pizza was not fair because ${explanationAnswers[1]}.`;
                submitExplanation(sentence, "sentence");
              }}
              ready={explanationReady}
            />
          )}

          {stage === "solved" && (
            <div ref={reportRef} className="space-y-5">
              <section className="rounded-3xl border-2 border-success bg-card p-6 shadow-sm sm:p-8">
                <p className="label-eyebrow text-success">CASE REPAIRED</p>
                <h2 className="mt-2 text-3xl font-black text-foreground">
                  The Fair-Share Glitch is fixed.
                </h2>
                <div className="mt-5 rounded-2xl bg-secondary p-4">
                  <p className="label-eyebrow text-muted-foreground">DETECTIVE SKILL</p>
                  <p className="mt-2 text-xl font-black text-foreground">Check before you trust.</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    You looked at the evidence instead of simply trusting ZED-4’s answer.
                  </p>
                </div>
              </section>
              <ApplyChallenge complete={applyComplete} onComplete={() => setApplyComplete(true)} />
              <details className="rounded-2xl border border-border bg-card p-4">
                <summary className="cursor-pointer font-black text-foreground">FOR PARENTS</summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Your child investigated fair sharing by examining a flawed solution, identifying
                  the mismatch, repairing the model, and explaining the reasoning.
                </p>
                <ul className="mt-3 grid gap-2 text-sm text-foreground sm:grid-cols-2">
                  <li>✓ Compared pizza pieces</li>
                  <li>✓ Checked a confident claim</li>
                  <li>✓ Repaired the pizza</li>
                  <li>✓ Explained the evidence</li>
                </ul>
              </details>
              <DiagnosticReport
                studentQuotes={studentQuotes}
                turnCount={studentQuotes.length}
                marks={marks}
                caseTitle="Case 01.01 · The Pizza"
                conceptMastered="Fair sharing means equal amounts"
                onTryAnother={onBackToPicker}
                nextCaseLabel="Replay this case when you want another investigation."
                showMarks={false}
              />
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

function PizzaProgress({ current }: { current: PizzaStage }) {
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

function PizzaBriefScene() {
  return (
    <div className="relative flex min-h-[300px] items-center justify-center rounded-3xl border border-border bg-secondary p-5">
      <div className="absolute left-5 top-5 rounded-xl bg-card px-3 py-2 text-xs font-bold text-foreground shadow-sm">
        Maya · Leo · Sam
      </div>
      <div className="relative flex h-64 w-64 items-center justify-center rounded-full border-[18px] border-pizza-crust bg-pizza-base shadow-lg">
        <div className="absolute inset-3 rounded-full border-4 border-pizza-sauce/60" />
        <span className="z-10 text-8xl" aria-label="Pizza">
          🍕
        </span>
      </div>
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
          <p className="label-eyebrow text-muted-foreground">ZED-4’S COMPLETED SOLUTION</p>
          <h3 className="mt-1 text-lg font-black text-foreground">
            One piece each. Different amounts.
          </h3>
        </div>
        <SpeakButton text="ZED-4's completed solution. One piece each. Different amounts." />
      </div>
      <div className="mt-4 grid items-center gap-4 sm:grid-cols-[1fr_auto]">
        <UnequalPizza />
        <div className="rounded-2xl border border-border bg-secondary p-3">
          <p className="text-sm font-bold text-foreground">ZED-4 says:</p>
          <p className="mt-1 text-sm text-muted-foreground">
            “I made 4 pieces and gave everyone 1 piece. So everyone got a fair share!”
          </p>
          <p className="mt-3 text-xs font-black uppercase tracking-wider text-primary">
            CASE CLOSED! ✓
          </p>
        </div>
      </div>
    </section>
  );
}

function UnequalPizza() {
  return (
    <div className="mx-auto flex h-56 w-56 items-center justify-center rounded-full border-[16px] border-pizza-crust bg-pizza-base shadow-sm sm:h-64 sm:w-64">
      <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-pizza-sauce/60">
        <div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 rotate-[18deg] bg-primary/70" />
        <div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 rotate-[42deg] bg-primary/70" />
        <div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 rotate-[70deg] bg-primary/70" />
        <span className="absolute left-1/4 top-1/4 text-2xl">●</span>
        <span className="absolute right-1/4 top-1/3 text-2xl">●</span>
        <span className="absolute bottom-1/4 left-1/3 text-2xl">●</span>
        <span className="absolute bottom-1/4 right-1/4 text-2xl">●</span>
      </div>
    </div>
  );
}

type BoardProps = {
  tool: Tool;
  selectedPiece: string | null;
  piecePositions: Record<string, Point>;
  pieceRotations: Record<string, number>;
  onTool: (tool: Tool) => void;
  onSelect: (id: string) => void;
  onStartDrag: (id: string, event: ReactPointerEvent<HTMLButtonElement>) => void;
  onDrag: (id: string, event: ReactPointerEvent<HTMLButtonElement>) => void;
  onFinishDrag: () => void;
  onUndo: () => void;
  onReset: () => void;
  observations: string[];
  onObservation: (value: string) => void;
};
function InvestigationBoard(props: BoardProps) {
  const observations = [
    "The pieces are different sizes.",
    "Everyone has one piece.",
    "The pizza has four pieces.",
    "Some pieces are bigger than others.",
  ];
  return (
    <section className="rounded-2xl border-2 border-dashed border-border bg-background p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <p className="label-eyebrow text-muted-foreground">LOOK CLOSER</p>
          <h3 className="mt-1 text-lg font-black text-foreground">
            Move the pieces around. Compare them. What do you notice?
          </h3>
        </div>
        <SpeakButton text="Look closer. Move the pieces around. Compare them. What do you notice?" />
      </div>
      <div className="mt-4 flex flex-wrap gap-2" role="toolbar" aria-label="Investigation tools">
        {(
          [
            ["move", "✋ MOVE"],
            ["rotate", "↻ ROTATE"],
            ["compare", "↔ COMPARE"],
          ] as const
        ).map(([id, label]) => (
          <Button
            key={id}
            type="button"
            size="sm"
            variant={props.tool === id ? "default" : "outline"}
            onClick={() => props.onTool(id)}
          >
            {label}
          </Button>
        ))}
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={props.onUndo}
          disabled={!props.onUndo}
        >
          <Undo2 className="h-4 w-4" aria-hidden /> UNDO
        </Button>
      </div>
      <div
        data-pizza-board
        className="relative mt-4 min-h-64 overflow-hidden rounded-2xl border border-border bg-secondary/70 touch-none"
        aria-label="Pizza comparison board"
      >
        {PIECES.map((piece) => {
          const point = props.piecePositions[piece.id] ?? piece.start;
          const selected = props.selectedPiece === piece.id;
          return (
            <button
              key={piece.id}
              type="button"
              aria-label={`Move pizza piece ${piece.id}`}
              onClick={() => props.onSelect(piece.id)}
              onPointerDown={(event) => props.onStartDrag(piece.id, event)}
              onPointerMove={(event) => props.onDrag(piece.id, event)}
              onPointerUp={props.onFinishDrag}
              onPointerCancel={props.onFinishDrag}
              className={`absolute flex h-16 w-20 -translate-x-1/2 -translate-y-1/2 touch-none items-center justify-center rounded-xl border-2 bg-card text-2xl shadow-sm transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring ${selected ? "border-primary ring-4 ring-primary/20" : "border-border"}`}
              style={{
                left: `${point.x}%`,
                top: `${point.y}%`,
                transform: `translate(-50%, -50%) rotate(${props.pieceRotations[piece.id] ?? 0}deg)`,
              }}
            >
              <GripVertical className="absolute left-1 h-4 w-4 text-muted-foreground" aria-hidden />
              <span aria-hidden>🍕</span>
              <span className="sr-only">Piece {piece.id}</span>
            </button>
          );
        })}
        <div className="pointer-events-none absolute inset-x-6 top-1/2 border-t border-dashed border-primary/40" />
      </div>
      <div className="mt-4 rounded-xl border border-border bg-card p-3">
        <p className="text-sm font-black text-foreground">DETECTIVE NOTES</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Noticing is part of investigating. Select anything you observe.
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {observations.map((observation) => (
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
      <div className="mt-3 flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>
          {props.selectedPiece
            ? `Piece ${props.selectedPiece} selected.`
            : "Select a piece to move or rotate it."}
        </span>
        <Button type="button" variant="ghost" size="sm" onClick={props.onReset}>
          <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Reset
        </Button>
      </div>
    </section>
  );
}

type DetectPanelProps = {
  selected: string | null;
  onSelect: (choice: string) => void;
  evidencePair: string[];
  evidenceChoice: "same" | "different" | null;
  evidenceMessage: string;
  onPair: (piece: string) => void;
  onEvidenceChoice: (choice: "same" | "different") => void;
  onConfirm: () => void;
  onBack: () => void;
};
function DetectPanel(props: DetectPanelProps) {
  const choices = [
    "Everyone got a different number of pieces.",
    "The pieces are different sizes.",
    "There aren’t enough pieces.",
  ];
  return (
    <section className="rounded-2xl border-2 border-dashed border-border bg-background p-4 sm:p-5">
      <p className="label-eyebrow text-muted-foreground">DETECT THE GLITCH</p>
      <div className="mt-3 grid gap-2">
        {choices.map((choice, index) => (
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
      {props.selected === choices[1] && (
        <div className="mt-5 border-t border-dashed border-border pt-4">
          <p className="text-base font-black text-foreground">SHOW YOUR EVIDENCE</p>
          <p className="mt-1 text-sm text-muted-foreground">Choose two pieces to compare.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {PIECES.map((piece) => (
              <Button
                key={piece.id}
                type="button"
                variant={props.evidencePair.includes(piece.id) ? "default" : "outline"}
                onClick={() => props.onPair(piece.id)}
              >
                Piece {piece.id}
              </Button>
            ))}
          </div>
          {props.evidencePair.length === 2 && (
            <>
              <p className="mt-4 text-sm font-bold text-foreground">What do you notice?</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <Button
                  type="button"
                  variant={props.evidenceChoice === "same" ? "default" : "outline"}
                  onClick={() => props.onEvidenceChoice("same")}
                >
                  They are the same size.
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
      {props.selected && props.selected !== choices[1] && (
        <div className="mt-4 rounded-xl bg-secondary p-3">
          <p className="text-sm font-semibold text-foreground">
            Not quite. Let’s investigate that idea.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            ZED-4 gave everyone one piece. Look at the amount each person received.
          </p>
          <Button type="button" variant="outline" size="sm" onClick={props.onBack} className="mt-3">
            RETURN TO INVESTIGATION
          </Button>
        </div>
      )}
    </section>
  );
}

type RepairPanelProps = {
  cutDirections: ("vertical" | "horizontal")[];
  cutPosition: number;
  ready: boolean;
  assigned: Recipient[];
  distributed: boolean;
  fairness: "yes" | "no" | null;
  onCut: (direction: "vertical" | "horizontal") => void;
  onCutPosition: (position: number) => void;
  onReset: () => void;
  onAssign: (recipient: Recipient) => void;
  onFairness: (choice: "yes" | "no") => void;
  onSubmit: () => void;
};
function RepairPanel(props: RepairPanelProps) {
  const nextDirection =
    props.cutDirections.length === 0
      ? "first"
      : props.cutDirections.length === 1
        ? "second"
        : "done";
  return (
    <section className="rounded-2xl border-2 border-primary bg-card shadow-sm">
      <header className="border-b border-border bg-secondary px-4 py-3 sm:px-5">
        <p className="label-eyebrow text-muted-foreground">REPAIR THE GLITCH</p>
        <h3 className="mt-1 text-lg font-black text-foreground">Make four equal shares.</h3>
      </header>
      <div className="space-y-4 p-4 sm:p-5">
        <div className="relative mx-auto flex aspect-square max-w-sm items-center justify-center rounded-full border-[18px] border-pizza-crust bg-pizza-base">
          <div
            className={`absolute inset-0 ${props.cutDirections.length > 0 ? "border-r-4 border-primary" : ""}`}
          />
          {props.cutDirections.length > 1 && (
            <div className="absolute inset-0 border-b-4 border-primary" />
          )}
          <span className="z-10 text-7xl" aria-hidden>
            🍕
          </span>
        </div>
        <p className="text-center text-sm font-semibold text-muted-foreground">
          {nextDirection === "first"
            ? "Start with one cut across the whole pizza."
            : nextDirection === "second"
              ? "Now make one cut the other way."
              : "Four regions are ready to compare."}
        </p>
        {nextDirection !== "done" && (
          <div className="grid gap-2 sm:grid-cols-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => props.onCut("vertical")}
              disabled={props.cutDirections.includes("vertical")}
            >
              CUT VERTICALLY
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => props.onCut("horizontal")}
              disabled={props.cutDirections.includes("horizontal")}
            >
              CUT HORIZONTALLY
            </Button>
          </div>
        )}
        {props.cutDirections.length > 0 && (
          <div>
            <label htmlFor="pizza-cut-position" className="text-xs font-bold text-foreground">
              Move the cut gently if you want to compare.
            </label>
            <input
              id="pizza-cut-position"
              type="range"
              min="35"
              max="65"
              value={props.cutPosition}
              onChange={(event) => props.onCutPosition(Number(event.target.value))}
              className="mt-2 w-full accent-primary"
            />
          </div>
        )}
        {props.ready && (
          <div className="rounded-xl border border-success bg-secondary p-3 text-sm font-bold text-foreground">
            ✓ Four equal regions. Now give one share to each detective.
          </div>
        )}
        <div className="rounded-xl border border-border bg-background p-3">
          <p className="text-sm font-black text-foreground">GIVE ONE SHARE TO EACH DETECTIVE</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {RECIPIENTS.map((recipient) => (
              <Button
                key={recipient}
                type="button"
                variant={props.assigned.includes(recipient) ? "default" : "outline"}
                disabled={!props.ready}
                onClick={() => props.onAssign(recipient)}
                className="justify-start font-bold"
              >
                {props.assigned.includes(recipient) && <Check className="h-4 w-4" aria-hidden />}
                {recipient}
              </Button>
            ))}
          </div>
        </div>
        {props.distributed && (
          <div className="rounded-xl border border-border bg-secondary p-3">
            <p className="text-sm font-black text-foreground">IS IT FAIR?</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <Button
                type="button"
                variant={props.fairness === "yes" ? "default" : "outline"}
                onClick={() => props.onFairness("yes")}
              >
                YES, same amount
              </Button>
              <Button
                type="button"
                variant={props.fairness === "no" ? "default" : "outline"}
                onClick={() => props.onFairness("no")}
              >
                NO, someone has more
              </Button>
            </div>
            {props.fairness === "yes" && (
              <p className="mt-3 text-sm font-bold text-success">
                Exactly. Each detective has the same amount.
              </p>
            )}
            {props.fairness === "no" && (
              <p className="mt-3 text-sm font-semibold text-muted-foreground">
                Let’s look again. Each repaired share should match.
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
            disabled={!props.ready || !props.distributed || props.fairness !== "yes"}
            className="font-black"
          >
            CONTINUE TO EXPLAIN →
          </Button>
        </div>
      </div>
    </section>
  );
}

type ExplainPanelProps = {
  answers: [string | null, string | null];
  written: string;
  ready: boolean;
  onAnswer: (index: 0 | 1, answer: string) => void;
  onWritten: (value: string) => void;
  onSpeak: (text: string) => void;
  onSubmit: () => void;
};
function ExplainPanel(props: ExplainPanelProps) {
  const first = ["the same amount", "one piece", "the biggest piece", "a different amount"];
  const second = [
    "the pieces were different sizes",
    "there were too many people",
    "everyone got one piece",
    "pizza cannot be shared",
  ];
  return (
    <section className="space-y-5">
      <StageIntro
        eyebrow="EXPLAIN THE GLITCH"
        title="Tell ZED-4 what he got wrong."
        text="Build your answer, speak it, or write it. You do not need a blank page."
      />
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <p className="text-sm font-black text-foreground">1. A fair share means everyone gets…</p>
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
          2. ZED-4’s pizza was not fair because…
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
          <p className="text-sm font-black text-foreground">EXPLAIN IT TO ZED-4</p>
          <SpeakButton text="Explain it to ZED-4. You can speak your reasoning if you want." />
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
        <label htmlFor="pizza-explanation" className="mt-4 block text-sm font-bold text-foreground">
          WRITE IT (OPTIONAL)
        </label>
        <textarea
          id="pizza-explanation"
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
      <h2 className="mt-1 text-2xl font-black text-foreground">Now try it in your world.</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        You have one sandwich and two people. How could you make sure both people get a fair share?
      </p>
      <p className="mt-2 text-sm text-foreground">
        Try paper, playdough, a real sandwich, or another object nearby. This is optional.
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

export { PizzaCaseExperience };
