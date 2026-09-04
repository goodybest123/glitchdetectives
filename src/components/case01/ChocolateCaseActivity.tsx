/**
 * Case 01.02 — The Chocolate Bar.
 *
 * This is a Chocolate-specific version of the hands-on Case 01.01 pattern.
 * The story and maths change, but the detective rhythm stays predictable:
 * investigate, detect with evidence, repair, explain, then apply the idea.
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
import { DiagnosticReport } from "@/components/case01/DiagnosticReport";
import { MicButton } from "@/components/case01/MicButton";
import { SpeakButton } from "@/components/case01/SpeakButton";
import { ChatPanel } from "@/components/shared/ChatPanel";
import type { SubCaseDef } from "@/components/case01/cases";
import { useReportRecorder } from "@/hooks/useReportRecorder";
import { useCaseResultRecorder } from "@/lib/reasoning";
import { celebrate } from "@/lib/celebrate";

const SOLVED_TOKEN = "[[CASE_SOLVED]]";
const CASE_ID = "case-01-02";
const OBSERVATION_KEY = "gd:case-01-02:observations:v1";
type ChocolateStage = "brief" | Stage;
type Point = { x: number; y: number };
type Recipient = "Maya" | "Leo" | "Sam";

const RECIPIENTS: Recipient[] = ["Maya", "Leo", "Sam"];
const PIECES = [
  { id: "A", recipient: "Maya" as Recipient, width: 220, start: { x: 18, y: 52 } },
  { id: "B", recipient: "Leo" as Recipient, width: 140, start: { x: 50, y: 30 } },
  { id: "C", recipient: "Sam" as Recipient, width: 76, start: { x: 80, y: 52 } },
] as const;

const HINTS = [
  "ZED-4 gave everyone one piece. But did everyone get the same amount?",
  "Put two chocolate pieces beside each other.",
  "Look at the size of each person's piece.",
];

type ObservationLog = {
  caseId: string;
  currentStep: ChocolateStage;
  selectedDetection: string | null;
  evidenceAttempt: number;
  repairAttempt: number;
  repairSuccess: boolean;
  explanationMethod: "sentence" | "speak" | "write" | null;
  explanationResponse: string;
  hintsUsed: number;
  attemptCount: number;
  completed: boolean;
  detectedUnequalPieces: boolean;
  comparedPieces: boolean;
  usedEvidence: boolean;
  distributedShares: boolean;
  revisedResponse: boolean;
};

const emptyLog: ObservationLog = {
  caseId: CASE_ID,
  currentStep: "brief",
  selectedDetection: null,
  evidenceAttempt: 0,
  repairAttempt: 0,
  repairSuccess: false,
  explanationMethod: null,
  explanationResponse: "",
  hintsUsed: 0,
  attemptCount: 0,
  completed: false,
  detectedUnequalPieces: false,
  comparedPieces: false,
  usedEvidence: false,
  distributedShares: false,
  revisedResponse: false,
};

function readLog(): ObservationLog {
  if (typeof window === "undefined") return emptyLog;
  try {
    const raw = window.localStorage.getItem(OBSERVATION_KEY);
    return raw ? { ...emptyLog, ...(JSON.parse(raw) as Partial<ObservationLog>) } : emptyLog;
  } catch {
    return emptyLog;
  }
}

type Props = {
  definition: SubCaseDef;
  onSolved: () => void;
  onBackToPicker: () => void;
};

export function ChocolateCaseExperience({ definition, onSolved, onBackToPicker }: Props) {
  const [stage, setStage] = useState<ChocolateStage>("brief");
  const [piecePositions, setPiecePositions] = useState<Record<string, Point>>(() =>
    Object.fromEntries(PIECES.map((piece) => [piece.id, piece.start])),
  );
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null);
  const [positionHistory, setPositionHistory] = useState<Record<string, Point>[]>([]);
  const [observations, setObservations] = useState<string[]>([]);
  const [detection, setDetection] = useState<string | null>(null);
  const [evidencePair, setEvidencePair] = useState<string[]>([]);
  const [evidenceChoice, setEvidenceChoice] = useState<"same" | "different" | null>(null);
  const [evidenceMessage, setEvidenceMessage] = useState("");
  const [dividers, setDividers] = useState<[number, number]>([0, 100]);
  const [draggingDivider, setDraggingDivider] = useState<0 | 1 | null>(null);
  const [selectedShare, setSelectedShare] = useState<number | null>(null);
  const [assignments, setAssignments] = useState<Record<Recipient, number | null>>({
    Maya: null,
    Leo: null,
    Sam: null,
  });
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
  const reportRef = useRef<HTMLDivElement>(null);
  const repairRef = useRef<HTMLDivElement>(null);
  const dividerBoardRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ id: string; board: HTMLElement } | null>(null);

  const welcomeMessage: UIMessage = useMemo(
    () => ({
      id: "chocolate-welcome",
      role: "assistant",
      parts: [
        {
          type: "text",
          text: "You fixed my chocolate share. Can you tell me why my first try was not fair?",
        },
      ],
    }),
    [],
  );
  const transport = useRef(new DefaultChatTransport({ api: definition.chatEndpoint })).current;
  const { messages, sendMessage, regenerate, status, error } = useChat({
    id: "case-01-chocolate",
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
    setLog(readLog());
  }, []);

  useEffect(() => {
    const next = {
      ...log,
      currentStep: stage,
      explanationMethod,
      explanationResponse: studentQuotes.at(-1) ?? log.explanationResponse,
      hintsUsed: hintIndex,
      completed: stage === "solved",
    };
    window.localStorage.setItem(OBSERVATION_KEY, JSON.stringify(next));
  }, [explanationMethod, hintIndex, log, stage, studentQuotes]);

  useEffect(() => {
    if (stage !== "explain") return;
    const solved = messages.some(
      (message) =>
        message.role === "assistant" &&
        message.parts.some((part) => part.type === "text" && part.text.includes(SOLVED_TOKEN)),
    );
    if (solved) {
      setStage("solved");
      setLog((current) => ({ ...current, completed: true }));
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

  const updateLog = (change: Partial<ObservationLog>) =>
    setLog((current) => ({ ...current, ...change }));
  const sortedDividers = [...dividers].sort((a, b) => a - b);
  const repairReady =
    Math.abs(sortedDividers[0] - 33.33) <= 12 && Math.abs(sortedDividers[1] - 66.67) <= 12;
  const distributed = RECIPIENTS.every((recipient) => assignments[recipient] !== null);
  const fairnessReady = repairReady && distributed && fairness === "yes";
  const explanationReady = explanationAnswers.every(Boolean);
  const currentStage: Stage = stage === "brief" ? "investigate" : stage;
  const marks = {
    investigate: log.comparedPieces ? 5 : stage === "brief" ? 0 : 3,
    detect: log.detectedUnequalPieces && log.usedEvidence ? 5 : log.detectedUnequalPieces ? 3 : 0,
    repair: log.repairSuccess && log.distributedShares ? 5 : log.repairSuccess ? 3 : 0,
    explain: stage === "solved" ? 5 : 0,
  };

  useReportRecorder({
    active: stage === "solved",
    caseId: "case-01",
    subId: "chocolate",
    caseTitle: "Case 01.02 · The Chocolate Bar",
    subTitle: definition.title,
    emoji: definition.emoji,
    glitchSummary: definition.subtitle,
    conceptMastered: "Fair sharing means everyone receives the same amount",
    studentQuotes,
    marks,
  });

  // Structured reasoning evidence for the Detective's Report.
  useCaseResultRecorder(stage === "solved", () => ({
    caseId: "case-01.02",
    levelId: "level-01",
    concept: "Parts of a Whole",
    completed: true,
    investigation: {
      interactedWithModel: true,
      manipulatedObjects: log.comparedPieces,
      comparedObjects: log.comparedPieces,
      exploredBeforeAnswering: log.comparedPieces,
    },
    detection: {
      selectedClaim: log.selectedDetection,
      correctDetection: log.detectedUnequalPieces,
      attempts: Math.max(1, log.attemptCount),
      identifiedRelevantEvidence: log.usedEvidence,
      evidenceType: "size comparison",
    },
    repair: {
      attempted: log.repairAttempt > 0,
      successful: log.repairSuccess,
      attempts: log.repairAttempt,
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
      retries: Math.max(0, log.attemptCount - 1),
      changedAnswer: log.revisedResponse,
      revisedAfterEvidence: log.revisedResponse,
    },
    interaction: { attemptCount: log.attemptCount, completedWithoutAnswerReveal: true },
    timestamp: Date.now(),
  }));

  const movePiece = (id: string, clientX: number, clientY: number, board: HTMLElement) => {
    const rect = board.getBoundingClientRect();
    setPiecePositions((current) => ({
      ...current,
      [id]: {
        x: Math.min(90, Math.max(10, ((clientX - rect.left) / rect.width) * 100)),
        y: Math.min(84, Math.max(16, ((clientY - rect.top) / rect.height) * 100)),
      },
    }));
    updateLog({ comparedPieces: true });
  };

  const startPieceDrag = (id: string, event: ReactPointerEvent<HTMLButtonElement>) => {
    const board = event.currentTarget.closest<HTMLElement>("[data-chocolate-board]");
    if (!board) return;
    setPositionHistory((history) => [...history.slice(-9), piecePositions]);
    setSelectedPiece(id);
    dragRef.current = { id, board };
    event.currentTarget.setPointerCapture(event.pointerId);
    movePiece(id, event.clientX, event.clientY, board);
  };

  const moveDraggedPiece = (id: string, event: ReactPointerEvent<HTMLButtonElement>) => {
    if (dragRef.current?.id !== id) return;
    movePiece(id, event.clientX, event.clientY, dragRef.current.board);
  };

  const finishPieceDrag = () => {
    dragRef.current = null;
  };

  const movePieceWithKeyboard = (id: string, event: ReactKeyboardEvent<HTMLButtonElement>) => {
    const delta = event.shiftKey ? 10 : 5;
    const current = piecePositions[id] ?? { x: 50, y: 50 };
    let next: Point | null = null;
    if (event.key === "ArrowLeft") next = { x: Math.max(10, current.x - delta), y: current.y };
    if (event.key === "ArrowRight") next = { x: Math.min(90, current.x + delta), y: current.y };
    if (event.key === "ArrowUp") next = { x: current.x, y: Math.max(16, current.y - delta) };
    if (event.key === "ArrowDown") next = { x: current.x, y: Math.min(84, current.y + delta) };
    if (!next) return;
    event.preventDefault();
    setPositionHistory((history) => [...history.slice(-9), piecePositions]);
    setPiecePositions((currentPositions) => ({ ...currentPositions, [id]: next }));
    updateLog({ comparedPieces: true });
  };

  const resetInvestigation = () => {
    setPiecePositions(Object.fromEntries(PIECES.map((piece) => [piece.id, piece.start])));
    setPositionHistory([]);
    setSelectedPiece(null);
  };

  const updateDivider = (index: 0 | 1, clientX: number) => {
    const rect = dividerBoardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const raw = Math.min(96, Math.max(4, ((clientX - rect.left) / rect.width) * 100));
    setDividers((current) => {
      const next: [number, number] = [...current];
      next[index] = raw;
      if (index === 0) next[0] = Math.min(next[0], next[1] - 5);
      else next[1] = Math.max(next[1], next[0] + 5);
      return next;
    });
  };

  const finishDivider = (index: 0 | 1) => {
    setDividers((current) => {
      const target = index === 0 ? 33.33 : 66.67;
      const next: [number, number] = [...current];
      if (Math.abs(next[index] - target) <= 18) next[index] = target;
      return next;
    });
    setDraggingDivider(null);
    updateLog({ repairAttempt: log.repairAttempt + 1 });
  };

  const handleDividerPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (draggingDivider !== null) updateDivider(draggingDivider, event.clientX);
  };

  const handleDividerKey = (index: 0 | 1, event: ReactKeyboardEvent<HTMLButtonElement>) => {
    const delta = event.shiftKey ? 10 : 3;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setDividers((current) => {
        const next: [number, number] = [...current];
        next[index] = index === 0 ? 33.33 : 66.67;
        return next;
      });
      updateLog({ repairAttempt: log.repairAttempt + 1 });
      return;
    }
    let next: number | null = null;
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") next = dividers[index] - delta;
    if (event.key === "ArrowRight" || event.key === "ArrowUp") next = dividers[index] + delta;
    if (event.key === "Home") next = 4;
    if (event.key === "End") next = 96;
    if (next === null) return;
    event.preventDefault();
    setDividers((current) => {
      const updated: [number, number] = [...current];
      updated[index] = Math.max(4, Math.min(96, next));
      if (index === 0) updated[0] = Math.min(updated[0], updated[1] - 5);
      else updated[1] = Math.max(updated[1], updated[0] + 5);
      return updated;
    });
  };

  const resetRepair = () => {
    setDividers([0, 100]);
    setAssignments({ Maya: null, Leo: null, Sam: null });
    setSelectedShare(null);
    setFairness(null);
  };

  const assignShare = (recipient: Recipient, share: number) => {
    setAssignments((current) => {
      const next = { ...current };
      Object.keys(next).forEach((key) => {
        const person = key as Recipient;
        if (next[person] === share) next[person] = null;
      });
      next[recipient] = share;
      return next;
    });
    setSelectedShare(null);
  };

  const submitExplanation = (text: string, method: ObservationLog["explanationMethod"]) => {
    if (!text.trim() || isSending) return;
    setExplanationMethod(method);
    updateLog({ explanationMethod: method, explanationResponse: text });
    sendMessage({ text });
  };

  if (stage === "brief") {
    return (
      <div className="space-y-5">
        <ChocolateProgress current="brief" />
        <section className="grid items-center gap-8 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="label-eyebrow text-muted-foreground">CASE 01.02 · LEVEL 01</span>
              <span className="rounded-full bg-energy px-3 py-1 text-[10px] font-black tracking-widest text-energy-foreground">
                NEW CASE
              </span>
            </div>
            <div>
              <p className="label-eyebrow text-primary">THE MISSING FAIR-SHARE GLITCH</p>
              <h2 className="mt-2 text-4xl font-black leading-tight text-foreground sm:text-5xl">
                The Chocolate Bar
              </h2>
              <p className="mt-4 max-w-lg text-lg leading-relaxed text-muted-foreground">
                ZED-4 is sharing chocolate with three detectives. He says everyone got a fair share.
                But something might be wrong...
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-secondary p-4">
              <p className="label-eyebrow text-muted-foreground">YOUR MISSION</p>
              <p className="mt-2 text-base font-bold text-foreground">
                Investigate ZED-4’s solution.
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
          <ChocolateBriefScene />
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
        <span className="label-eyebrow text-muted-foreground">CASE 01.02 · THE CHOCOLATE BAR</span>
      </div>
      <CaseStepper stage={currentStage} />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          {stage === "investigate" && (
            <>
              <StageIntro
                eyebrow="INVESTIGATE"
                title="Look closely. Check ZED-4’s solution."
                text="Move the pieces around. Compare them. What do you notice?"
              />
              <InvestigationScene />
              <ComparisonBoard
                positions={piecePositions}
                selectedPiece={selectedPiece}
                observations={observations}
                onSelect={setSelectedPiece}
                onStartDrag={startPieceDrag}
                onDrag={moveDraggedPiece}
                onFinishDrag={finishPieceDrag}
                onKey={movePieceWithKeyboard}
                onUndo={() => {
                  const previous = positionHistory.at(-1);
                  if (!previous) return;
                  setPiecePositions(previous);
                  setPositionHistory((history) => history.slice(0, -1));
                }}
                onReset={resetInvestigation}
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
                selected={detection}
                evidencePair={evidencePair}
                evidenceChoice={evidenceChoice}
                evidenceMessage={evidenceMessage}
                onSelect={(choice, correct) => {
                  setDetection(choice);
                  updateLog({
                    selectedDetection: choice,
                    attemptCount: correct ? log.attemptCount : log.attemptCount + 1,
                    revisedResponse: !correct || log.revisedResponse,
                  });
                }}
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
                  updateLog({ evidenceAttempt: log.evidenceAttempt + 1 });
                  if (evidencePair.length === 2 && evidenceChoice === "different") {
                    updateLog({
                      detectedUnequalPieces: true,
                      comparedPieces: true,
                      usedEvidence: true,
                    });
                    setStage("repair");
                  } else {
                    setEvidenceMessage(
                      "Let’s investigate that idea. Compare the two pieces again.",
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
                title="Can you share the chocolate fairly?"
                text="Drag both dividers until the three sections match. A few pixels do not matter."
              />
              <RepairPanel
                dividers={dividers}
                draggingDivider={draggingDivider}
                repairReady={repairReady}
                assignments={assignments}
                selectedShare={selectedShare}
                distributed={distributed}
                fairness={fairness}
                boardRef={dividerBoardRef}
                onDividerDown={(index, event) => {
                  event.preventDefault();
                  setDraggingDivider(index);
                  updateDivider(index, event.clientX);
                }}
                onDividerMove={handleDividerPointerMove}
                onDividerUp={() => {
                  if (draggingDivider !== null) finishDivider(draggingDivider);
                }}
                onDividerKey={handleDividerKey}
                onSelectShare={setSelectedShare}
                onAssign={assignShare}
                onFairness={(choice) => setFairness(choice)}
                onReset={resetRepair}
                onSubmit={() => {
                  if (!fairnessReady) return;
                  updateLog({ repairSuccess: true, distributedShares: true });
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
                const sentence = `A fair share means everyone gets ${explanationAnswers[0]}. ZED-4's chocolate was not fair because ${explanationAnswers[1]}.`;
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
                  The Chocolate Bar Glitch is fixed.
                </h2>
                <div className="mt-5 rounded-2xl bg-secondary p-4">
                  <p className="label-eyebrow text-muted-foreground">DETECTIVE SKILL</p>
                  <p className="mt-2 text-xl font-black text-foreground">
                    Compare before you decide.
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    You checked the amount instead of simply counting the pieces.
                  </p>
                </div>
              </section>
              <ApplyChallenge complete={applyComplete} onComplete={() => setApplyComplete(true)} />
              <details className="rounded-2xl border border-border bg-card p-4">
                <summary className="cursor-pointer font-black text-foreground">FOR PARENTS</summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Your child investigated the idea that fair sharing requires equal amounts. They
                  compared unequal pieces, found the flaw, created equal shares, and explained the
                  reasoning.
                </p>
                <ul className="mt-3 grid gap-2 text-sm text-foreground sm:grid-cols-2">
                  <li>✓ Detected unequal pieces</li>
                  <li>✓ Compared pieces with evidence</li>
                  <li>✓ Created three equal parts</li>
                  <li>✓ Distributed one share to each person</li>
                  <li>✓ Explained equal amounts</li>
                  <li>
                    ✓ Used {hintIndex} hint{hintIndex === 1 ? "" : "s"}
                  </li>
                </ul>
              </details>
              <DiagnosticReport
                studentQuotes={studentQuotes}
                turnCount={studentQuotes.length}
                marks={marks}
                caseTitle="Case 01.02 · The Chocolate Bar"
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

function ChocolateProgress({ current }: { current: ChocolateStage }) {
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

function ChocolateBriefScene() {
  return (
    <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-3xl border border-border bg-secondary p-5">
      <div className="absolute left-5 top-5 rounded-xl bg-card px-3 py-2 text-xs font-bold text-foreground">
        Maya · Leo · Sam
      </div>
      <ChocolateBarIllustration unequal />
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
        <div>
          <ChocolateBarIllustration unequal />
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs font-bold text-muted-foreground">
            {RECIPIENTS.map((person) => (
              <div key={person}>
                {person}
                <span className="mt-1 block text-[10px] font-normal">one piece</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-secondary p-3 sm:max-w-xs">
          <p className="text-sm font-bold text-foreground">ZED-4 says:</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            “I made 3 pieces.”
            <br />
            “There are 3 people.”
            <br />
            “Everyone gets 1 piece!”
            <br />
            “So it’s fair!”
          </p>
          <p className="mt-3 text-xs font-black uppercase tracking-wider text-primary">
            CASE CLOSED! ✓
          </p>
        </div>
      </div>
    </section>
  );
}

function ChocolateBarIllustration({
  unequal = false,
  dividers,
}: {
  unequal?: boolean;
  dividers?: [number, number];
}) {
  const parts = unequal
    ? [52, 33, 15]
    : dividers
      ? [dividers[0], dividers[1] - dividers[0], 100 - dividers[1]]
      : [100];
  let cursor = 0;
  return (
    <svg
      viewBox="0 0 520 150"
      className="mx-auto h-auto w-full max-w-[520px]"
      role="img"
      aria-label={
        unequal
          ? "A chocolate bar split into three visibly different sizes"
          : "A chocolate bar split into sections"
      }
    >
      <rect x="22" y="25" width="476" height="82" rx="12" fill="var(--chocolate-foil)" />
      {parts.map((part, index) => {
        const x = 34 + cursor * 4.52;
        const width = part * 4.52;
        cursor += part;
        return (
          <g key={index}>
            <rect
              x={x}
              y="37"
              width={Math.max(0, width - 3)}
              height="58"
              rx="5"
              fill="var(--chocolate-base)"
              stroke="var(--chocolate-dark)"
              strokeWidth="3"
            />
            <path
              d={`M ${x + 8} 48 H ${x + Math.max(9, width - 16)}`}
              stroke="var(--chocolate-highlight)"
              strokeWidth="5"
              strokeLinecap="round"
              opacity="0.7"
            />
          </g>
        );
      })}
      <path
        d="M 28 25 H 492"
        stroke="var(--chocolate-highlight)"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.8"
      />
      {unequal && (
        <g fill="var(--chocolate-highlight)" opacity="0.7">
          <circle cx="110" cy="70" r="6" />
          <circle cx="160" cy="60" r="5" />
          <circle cx="315" cy="72" r="5" />
          <circle cx="420" cy="66" r="4" />
        </g>
      )}
    </svg>
  );
}

type ComparisonProps = {
  positions: Record<string, Point>;
  selectedPiece: string | null;
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
  const observationChoices = [
    "Everyone has one piece.",
    "The chocolate has three pieces.",
    "The pieces are different sizes.",
    "The pieces are the same size.",
  ];
  return (
    <section className="rounded-2xl border-2 border-dashed border-border bg-background p-4 sm:p-5">
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <p className="label-eyebrow text-muted-foreground">LOOK CLOSER</p>
          <h3 className="mt-1 text-base font-black text-foreground">
            Move the chocolate pieces around.
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Put them beside each other. Compare them. What do you notice?
          </p>
        </div>
        <SpeakButton
          text="Look closer. Move the chocolate pieces around. Put them beside each other. Compare them. What do you notice?"
          size="md"
        />
      </div>
      <div
        className="relative mt-4 min-h-56 touch-none overflow-hidden rounded-xl border border-border bg-secondary/50"
        data-chocolate-board
        aria-label="Move the chocolate pieces to compare them"
      >
        <div className="pointer-events-none absolute inset-x-5 top-1/2 border-t border-dashed border-border" />
        {PIECES.map((piece) => {
          const point = props.positions[piece.id] ?? piece.start;
          return (
            <button
              key={piece.id}
              type="button"
              className={`absolute flex min-h-14 -translate-x-1/2 -translate-y-1/2 touch-none items-center justify-center gap-2 rounded-xl border-2 border-chocolate-dark bg-chocolate-base px-3 text-xs font-black text-primary-foreground shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${props.selectedPiece === piece.id ? "ring-4 ring-energy/60" : ""}`}
              style={{
                left: `${point.x}%`,
                top: `${point.y}%`,
                width: `${52 + piece.width * 0.35}px`,
              }}
              onPointerDown={(event) => props.onStartDrag(piece.id, event)}
              onPointerMove={(event) => props.onDrag(piece.id, event)}
              onPointerUp={props.onFinishDrag}
              onPointerCancel={props.onFinishDrag}
              onKeyDown={(event) => props.onKey(piece.id, event)}
              onClick={() => props.onSelect(piece.id)}
              aria-label={`Move ${piece.recipient}'s chocolate piece`}
            >
              <GripVertical className="h-4 w-4" aria-hidden />
              <span>{piece.recipient}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold text-muted-foreground" aria-live="polite">
          {props.selectedPiece
            ? `Piece ${props.selectedPiece} selected.`
            : "Pick up a piece and move it."}
        </p>
        <div className="flex gap-1">
          <Button type="button" variant="ghost" size="sm" onClick={props.onUndo} disabled={false}>
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
          {observationChoices.map((observation) => (
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
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-secondary p-3">
      <div className="flex items-start gap-2">
        <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
        <p className="text-sm text-foreground">
          {hintIndex > 0 ? HINTS[hintIndex - 1] : "Need a clue? You can investigate first."}
        </p>
        <SpeakButton
          text={hintIndex > 0 ? HINTS[hintIndex - 1] : "Need a clue? You can investigate first."}
        />
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
  evidencePair: string[];
  evidenceChoice: "same" | "different" | null;
  evidenceMessage: string;
  onSelect: (choice: string, correct: boolean) => void;
  onPair: (piece: string) => void;
  onEvidenceChoice: (choice: "same" | "different") => void;
  onConfirm: () => void;
  onBack: () => void;
};
function DetectPanel(props: DetectProps) {
  const choices = [
    "Everyone got a different number of pieces.",
    "The pieces are different sizes.",
    "There are too many people.",
  ];
  return (
    <section className="rounded-2xl border-2 border-dashed border-border bg-background p-4 sm:p-5">
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <p className="label-eyebrow text-muted-foreground">DETECT THE GLITCH</p>
          <h3 className="mt-1 text-base font-black text-foreground">
            What went wrong with ZED-4’s reasoning?
          </h3>
        </div>
        <SpeakButton
          text={`Detect the glitch. What went wrong with ZED-4's reasoning? ${choices.join(". ")}`}
          size="md"
        />
      </div>
      <div className="mt-4 grid gap-2">
        {choices.map((choice, index) => (
          <Button
            key={choice}
            type="button"
            variant={props.selected === choice ? "default" : "outline"}
            onClick={() => props.onSelect(choice, choice === choices[1])}
            className="h-auto min-h-14 justify-start whitespace-normal px-4 py-3 text-left font-bold"
          >
            <span className="mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-xs text-secondary-foreground">
              {String.fromCharCode(65 + index)}
            </span>
            {choice}
          </Button>
        ))}
      </div>
      <p
        className="mt-3 text-center text-xs font-semibold text-muted-foreground"
        aria-live="polite"
      >
        {props.selected && props.selected !== choices[1]
          ? "Not quite. Let’s investigate that idea."
          : props.selected
            ? "Good observation. Now show your evidence."
            : "Choose the observation that best matches what you noticed."}
      </p>
      {props.selected && props.selected !== choices[1] && (
        <div className="mt-4 rounded-xl bg-secondary p-3">
          <p className="text-sm font-semibold text-foreground">
            Everyone has one piece. But does one piece always mean the same amount?
          </p>
          <Button type="button" variant="outline" size="sm" onClick={props.onBack} className="mt-3">
            RETURN TO INVESTIGATION
          </Button>
        </div>
      )}
      {props.selected === choices[1] && (
        <div className="mt-5 border-t border-dashed border-border pt-4">
          <p className="text-base font-black text-foreground">SHOW YOUR EVIDENCE</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Put two pieces beside each other and compare them.
          </p>
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
              <div className="mt-4 flex items-end justify-center gap-6 rounded-2xl border border-dashed border-primary/40 bg-secondary/60 p-4">
                {props.evidencePair.map((id) => {
                  const piece = PIECES.find((item) => item.id === id) ?? PIECES[0];
                  return (
                    <div key={id} className="flex flex-col items-center gap-1">
                      <div
                        className="h-14 rounded-lg border-2 border-chocolate-dark bg-chocolate-base"
                        style={{ width: `${48 + piece.width * 0.35}px` }}
                      />
                      <span className="text-xs font-bold text-muted-foreground">
                        Piece {piece.id}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 text-sm font-bold text-foreground">WHAT DO YOU NOTICE?</p>
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
    </section>
  );
}

type RepairProps = {
  dividers: [number, number];
  draggingDivider: 0 | 1 | null;
  repairReady: boolean;
  assignments: Record<Recipient, number | null>;
  selectedShare: number | null;
  distributed: boolean;
  fairness: "yes" | "no" | null;
  boardRef: React.RefObject<HTMLDivElement | null>;
  onDividerDown: (index: 0 | 1, event: ReactPointerEvent<HTMLButtonElement>) => void;
  onDividerMove: (event: ReactPointerEvent<HTMLDivElement>) => void;
  onDividerUp: () => void;
  onDividerKey: (index: 0 | 1, event: ReactKeyboardEvent<HTMLButtonElement>) => void;
  onSelectShare: (share: number | null) => void;
  onAssign: (recipient: Recipient, share: number) => void;
  onFairness: (choice: "yes" | "no") => void;
  onReset: () => void;
  onSubmit: () => void;
};
function RepairPanel(props: RepairProps) {
  const sorted = [...props.dividers].sort((a, b) => a - b) as [number, number];
  const shares = [0, 1, 2];
  const assignedShare = (share: number) => Object.values(props.assignments).includes(share);
  const handleDrop = (recipient: Recipient, event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const raw = event.dataTransfer.getData("text/plain");
    const share = Number(raw);
    if (Number.isInteger(share)) props.onAssign(recipient, share);
  };
  return (
    <section className="rounded-2xl border-2 border-primary bg-card shadow-sm">
      <header className="border-b border-border bg-secondary px-4 py-3 sm:px-5">
        <p className="label-eyebrow text-muted-foreground">REPAIR THE GLITCH</p>
        <h3 className="mt-1 text-lg font-black text-foreground">Make three equal shares.</h3>
      </header>
      <div className="space-y-4 p-4 sm:p-5">
        <div
          ref={props.boardRef}
          className="relative mx-auto w-full max-w-2xl touch-none rounded-2xl border border-border bg-secondary/60 p-6"
          onPointerMove={props.onDividerMove}
          onPointerUp={props.onDividerUp}
          onPointerCancel={props.onDividerUp}
        >
          <ChocolateBarIllustration dividers={sorted} />
          <div className="absolute inset-x-6 bottom-6 top-6">
            {([0, 1] as const).map((index) => (
              <button
                key={index}
                type="button"
                role="slider"
                aria-label={`Chocolate divider ${index + 1}. Drag toward the ${index === 0 ? "first" : "second"} equal share position.`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(props.dividers[index])}
                aria-valuetext={
                  props.repairReady
                    ? "Three matching sections"
                    : "Move toward an equal share position"
                }
                className={`absolute top-0 h-full w-10 -translate-x-1/2 cursor-ew-resize rounded-xl border-2 border-dashed outline-none focus-visible:ring-2 focus-visible:ring-ring ${props.draggingDivider === index ? "border-success bg-success/15" : "border-energy bg-energy/10"}`}
                style={{ left: `${props.dividers[index]}%` }}
                onPointerDown={(event) => props.onDividerDown(index, event)}
                onKeyDown={(event) => props.onDividerKey(index, event)}
              >
                <span className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-energy text-energy-foreground shadow-sm">
                  ↔
                </span>
              </button>
            ))}
          </div>
        </div>
        <p className="text-center text-xs font-bold text-muted-foreground" aria-live="polite">
          {props.repairReady
            ? "Three matching sections. Now share one with each detective."
            : "Drag each divider. It will gently snap near an equal share position."}
        </p>
        {props.repairReady && (
          <div className="rounded-xl border border-success bg-secondary p-3 text-sm font-bold text-foreground">
            ✓ Three equal sections are ready to share.
          </div>
        )}
        <div className="rounded-xl border border-border bg-background p-3">
          <p className="text-sm font-black text-foreground">NOW SHARE IT</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Drag a share to a detective, or select a share and then select a person.
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {shares.map((share) => (
              <button
                key={share}
                type="button"
                draggable={props.repairReady}
                onDragStart={(event) => event.dataTransfer.setData("text/plain", String(share))}
                onClick={() => props.onSelectShare(props.selectedShare === share ? null : share)}
                disabled={!props.repairReady || assignedShare(share)}
                className={`flex min-h-16 items-center justify-center rounded-xl border-2 border-chocolate-dark bg-chocolate-base px-3 text-xs font-black text-primary-foreground transition-opacity disabled:opacity-40 ${props.selectedShare === share ? "ring-4 ring-energy/60" : ""}`}
              >
                Share {share + 1}
              </button>
            ))}
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {RECIPIENTS.map((recipient) => {
              const share = props.assignments[recipient];
              return (
                <button
                  key={recipient}
                  type="button"
                  onClick={() => {
                    if (props.selectedShare !== null)
                      props.onAssign(recipient, props.selectedShare);
                  }}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => handleDrop(recipient, event)}
                  disabled={!props.repairReady}
                  className="min-h-16 rounded-xl border-2 border-dashed border-primary bg-card px-3 py-2 text-sm font-black text-foreground"
                >
                  <span>{recipient}</span>
                  <span className="mt-1 block text-xs font-normal text-muted-foreground">
                    {share === null ? "Drop one share here" : `Has share ${share + 1}`}
                  </span>
                </button>
              );
            })}
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
                YES — everyone has the same amount.
              </Button>
              <Button
                type="button"
                variant={props.fairness === "no" ? "default" : "outline"}
                onClick={() => props.onFairness("no")}
              >
                NO — someone has more.
              </Button>
            </div>
            {props.fairness === "yes" && (
              <p className="mt-3 text-sm font-bold text-success">
                Exactly. Each detective has the same amount.
              </p>
            )}
            {props.fairness === "no" && (
              <p className="mt-3 text-sm font-semibold text-muted-foreground">
                Let’s check the matching sections again.
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
            disabled={!props.repairReady || !props.distributed || props.fairness !== "yes"}
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
  const first = ["the same amount", "one piece", "the biggest piece", "a different amount"];
  const second = [
    "the pieces were different sizes",
    "everyone got one piece",
    "there were three people",
    "chocolate cannot be shared",
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
          2. ZED-4’s chocolate share was not fair because…
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
        <label
          htmlFor="chocolate-explanation"
          className="mt-4 block text-sm font-bold text-foreground"
        >
          ✏️ WRITE IT (OPTIONAL)
        </label>
        <textarea
          id="chocolate-explanation"
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
        Take a piece of paper and imagine it is a chocolate bar. Can you divide it fairly between 3
        people? Fold it, draw lines, cut it, use playdough, or use a real food item if appropriate.
        How did you check that the shares were fair?
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
