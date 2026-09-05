/**
 * `InvestigationCase` — the Glitch Detectives case engine.
 *
 * Drives one complete investigation from a `CaseDefinition`:
 *
 *   CASE BRIEF → INVESTIGATE → DETECT → REPAIR → EXPLAIN
 *   → REAL-WORLD CHALLENGE → CASE CLOSED
 *
 * Rules baked in here so no case can drift from them:
 *  - the child meets ZED-4's completed reasoning first; nothing is taught up front
 *  - detection needs evidence before the case moves on
 *  - hints are layered and optional, retries are unlimited and unpunished
 *  - changing your mind after looking at evidence is recorded as a strength
 *  - no timers, no scores, no lives
 *  - every completed case writes one structured `CaseResult` for the report
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CaseStepper, type Stage } from "@/components/case01/CaseStepper";
import { MicButton } from "@/components/case01/MicButton";
import { SpeakButton } from "@/components/case01/SpeakButton";
import { ChatPanel } from "@/components/shared/ChatPanel";
import { CaseReflectionCard } from "@/components/shared/CaseReflectionCard";
import { celebrate } from "@/lib/celebrate";
import { generateCaseReflection, useCaseResultRecorder, type CaseResult } from "@/lib/reasoning";
import { FractionReadout, PartsBoard } from "./PartsBoard";
import {
  ApplyChallenge,
  CaseClosedBanner,
  CaseProgress,
  HintBox,
  PrimaryNext,
  StageIntro,
  type CaseStep,
} from "./parts";
import type { CaseDefinition } from "./types";

const SOLVED_TOKEN = "[[CASE_SOLVED]]";

type Props = {
  definition: CaseDefinition;
  onSolved: () => void;
  onBackToPicker: () => void;
};

const range = (n: number) => Array.from({ length: n }, (_, i) => i);

export function InvestigationCase({ definition, onSolved, onBackToPicker }: Props) {
  const model = definition.model;

  const [stage, setStage] = useState<CaseStep>("brief");

  // Investigate
  const [explored, setExplored] = useState<number[]>([]);
  const [touched, setTouched] = useState(false);
  const [observations, setObservations] = useState<string[]>([]);
  const [hintIndex, setHintIndex] = useState(0);

  // Detect
  const [detection, setDetection] = useState<number | null>(null);
  const [detectAttempts, setDetectAttempts] = useState(0);
  const [changedMind, setChangedMind] = useState(false);
  const [evidencePlaced, setEvidencePlaced] = useState(false);
  const [evidenceChoice, setEvidenceChoice] = useState<number | null>(null);
  const [evidenceMessage, setEvidenceMessage] = useState("");

  // Repair
  const [repairTotal, setRepairTotal] = useState(
    model.repair.adjustableTotal ? model.totalParts : model.repair.targetTotal,
  );
  const [repairSelected, setRepairSelected] = useState<number[]>(() =>
    range(Math.min(model.selectedParts, model.repair.targetTotal)),
  );
  const [repairActions, setRepairActions] = useState(0);
  const [confirmed, setConfirmed] = useState<"yes" | "no" | null>(null);

  // Explain
  const [answers, setAnswers] = useState<(string | null)[]>(() =>
    definition.explain.slots.map(() => null),
  );
  const [written, setWritten] = useState("");
  const [explanationMethod, setExplanationMethod] = useState<CaseResult["explanation"]["method"]>(
    null,
  );
  const [applyComplete, setApplyComplete] = useState(false);

  const reportRef = useRef<HTMLDivElement>(null);
  const repairRef = useRef<HTMLDivElement>(null);

  const welcomeMessage: UIMessage = useMemo(
    () => ({
      id: `${definition.chatId}-welcome`,
      role: "assistant",
      parts: [{ type: "text", text: definition.welcomeText }],
    }),
    [definition.chatId, definition.welcomeText],
  );
  const transport = useRef(new DefaultChatTransport({ api: definition.chatEndpoint })).current;
  const { messages, sendMessage, regenerate, status, error } = useChat({
    id: definition.chatId,
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

  const repairReady =
    repairTotal === model.repair.targetTotal &&
    repairSelected.length === model.repair.targetSelected;
  const explanationReady = answers.every(Boolean);
  const detectCorrect = detection === definition.detect.correctIndex;
  const stepperStage: Stage = stage === "brief" ? "investigate" : (stage as Stage);

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

  /** Structured reasoning evidence — the only thing the report ever reads. */
  const buildResult = (): CaseResult => ({
    caseId: definition.caseId,
    levelId: definition.levelId,
    concept: definition.concept,
    completed: true,
    investigation: {
      interactedWithModel: true,
      manipulatedObjects: touched,
      comparedObjects: touched && evidencePlaced,
      exploredBeforeAnswering: touched,
    },
    detection: {
      selectedClaim: detection === null ? null : definition.detect.choices[detection],
      correctDetection: detectCorrect,
      attempts: Math.max(1, detectAttempts),
      identifiedRelevantEvidence:
        evidenceChoice !== null && !!definition.detect.evidence.choices[evidenceChoice]?.correct,
      evidenceType: definition.detect.evidence.type,
    },
    repair: {
      attempted: repairActions > 0,
      successful: repairReady,
      attempts: repairActions,
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
      changedAnswer: changedMind,
      revisedAfterEvidence: changedMind,
    },
    interaction: {
      attemptCount: detectAttempts + repairActions,
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

  const submitExplanation = (text: string, method: CaseResult["explanation"]["method"]) => {
    if (!text.trim() || isSending) return;
    setExplanationMethod(method);
    sendMessage({ text });
  };

  const toggleExplored = (index: number) => {
    setTouched(true);
    setExplored((current) =>
      current.includes(index) ? current.filter((item) => item !== index) : [...current, index],
    );
  };

  const toggleRepair = (index: number) => {
    setRepairActions((count) => count + 1);
    setRepairSelected((current) =>
      current.includes(index) ? current.filter((item) => item !== index) : [...current, index],
    );
  };

  const setTotal = (next: number) => {
    setRepairActions((count) => count + 1);
    setRepairTotal(next);
    setRepairSelected((current) => current.filter((index) => index < next));
  };

  /* ------------------------------------------------------------- brief */

  if (stage === "brief") {
    return (
      <div className="space-y-5">
        <CaseProgress current="brief" />
        <section className="grid items-center gap-8 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="label-eyebrow text-muted-foreground">
                CASE {definition.number} · LEVEL {definition.levelId.slice(-2)}
              </span>
              <span className="rounded-full bg-energy px-3 py-1 text-[10px] font-black tracking-widest text-energy-foreground">
                NEW CASE
              </span>
            </div>
            <div>
              <p className="label-eyebrow text-primary">{definition.missionTitle}</p>
              <div className="mt-2 flex items-start justify-between gap-3">
                <h2 className="text-4xl font-black leading-tight text-foreground sm:text-5xl">
                  {definition.title}
                </h2>
                <SpeakButton
                  text={`Case ${definition.number}. ${definition.title}. ${definition.story}`}
                  size="md"
                />
              </div>
              <p className="mt-4 max-w-lg text-lg leading-relaxed text-muted-foreground">
                {definition.story}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-secondary p-4">
              <p className="label-eyebrow text-muted-foreground">YOUR MISSION</p>
              <p className="mt-2 text-base font-bold text-foreground">
                Investigate ZED-4's solution.
              </p>
              <p className="mt-1 text-sm text-muted-foreground">Take your time. No timer. No score.</p>
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
          <div className="relative flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-3xl border border-border bg-secondary p-5">
            <PartsBoard
              shape={model.shape}
              total={model.totalParts}
              selected={range(model.selectedParts)}
              unitLabel={model.unitLabel}
            />
            <div className="rounded-2xl border border-primary bg-card p-3 text-center shadow-sm">
              <div className="text-3xl" aria-hidden>
                🤖
              </div>
              <p className="text-xs font-black text-foreground">ZED-4</p>
              <p className="text-[10px] text-muted-foreground">I think I've solved this one!</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  /* ------------------------------------------------------- main stages */

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <Button type="button" variant="ghost" size="sm" onClick={onBackToPicker}>
          ← Choose another case
        </Button>
        <span className="label-eyebrow text-muted-foreground">
          CASE {definition.number} · {definition.title.toUpperCase()}
        </span>
      </div>
      <CaseStepper stage={stepperStage} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          {stage === "investigate" && (
            <>
              <StageIntro
                eyebrow="INVESTIGATE"
                title={definition.investigate.title}
                text={definition.investigate.text}
              />

              <section className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="label-eyebrow text-muted-foreground">
                      ZED-4'S COMPLETED SOLUTION
                    </p>
                    <h3 className="mt-1 text-lg font-black text-foreground">
                      {definition.zedClaim.heading}
                    </h3>
                  </div>
                  <SpeakButton
                    text={`ZED-4's completed solution. ${definition.zedClaim.heading}. ZED-4 says. ${definition.zedClaim.lines.join(". ")}`}
                    size="md"
                  />
                </div>
                <div className="mt-4 grid items-center gap-4 sm:grid-cols-[1fr_auto]">
                  <PartsBoard
                    shape={model.shape}
                    total={model.totalParts}
                    selected={range(model.selectedParts)}
                    unitLabel={model.unitLabel}
                  />
                  <div className="rounded-2xl border border-border bg-secondary p-3 sm:max-w-xs">
                    <p className="text-sm font-bold text-foreground">ZED-4 says:</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {definition.zedClaim.lines.map((line) => (
                        <span key={line} className="block">
                          “{line}”
                        </span>
                      ))}
                    </p>
                    <p className="mt-3 text-xs font-black uppercase tracking-wider text-primary">
                      CASE CLOSED! ✓
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border-2 border-dashed border-border bg-background p-4 sm:p-5">
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <p className="label-eyebrow text-muted-foreground">LOOK CLOSER</p>
                    <h3 className="mt-1 text-base font-black text-foreground">
                      {definition.investigate.boardTitle}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {definition.investigate.boardText}
                    </p>
                  </div>
                  <SpeakButton
                    text={`${definition.investigate.boardTitle}. ${definition.investigate.boardText}`}
                    size="md"
                  />
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
                  <PartsBoard
                    shape={model.shape}
                    total={model.totalParts}
                    selected={explored}
                    interactive
                    onToggle={toggleExplored}
                    unitLabel={model.unitLabel}
                    reminder="bottom number = all the parts · top number = the ones we chose"
                  />

                  <FractionReadout
                    top={explored.length}
                    bottom={model.totalParts}
                    topLabel="parts you chose"
                    bottomLabel="equal parts in the whole"
                  />
                </div>
                <div className="mt-3 flex justify-end">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setExplored([])}>
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Clear
                  </Button>
                </div>

                <div className="mt-4 rounded-xl border border-border bg-card p-3">
                  <p className="text-sm font-black text-foreground">DETECTIVE NOTES</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Select anything you observe. Notes are not graded.
                  </p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {definition.investigate.observations.map((observation) => (
                      <Button
                        key={observation}
                        type="button"
                        variant={observations.includes(observation) ? "secondary" : "outline"}
                        onClick={() =>
                          setObservations((current) =>
                            current.includes(observation)
                              ? current.filter((item) => item !== observation)
                              : [...current, observation],
                          )
                        }
                        className="h-auto min-h-11 justify-start whitespace-normal text-left text-xs"
                      >
                        {observations.includes(observation) && (
                          <Check className="h-4 w-4 shrink-0" aria-hidden />
                        )}
                        {observation}
                      </Button>
                    ))}
                  </div>
                </div>
              </section>

              <HintBox
                hints={definition.hints}
                hintIndex={hintIndex}
                onHint={() => setHintIndex((index) => Math.min(definition.hints.length, index + 1))}
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
                title={definition.detect.question}
                text="Choose an idea, then show the evidence that supports it."
              />
              <section className="rounded-2xl border-2 border-dashed border-border bg-background p-4 sm:p-5">
                <div className="flex items-start justify-end">
                  <SpeakButton
                    text={`${definition.detect.question}. ${definition.detect.choices.join(". ")}`}
                    size="md"
                  />
                </div>
                <div className="mt-2 grid gap-2">
                  {definition.detect.choices.map((choice, index) => (
                    <Button
                      key={choice}
                      type="button"
                      variant={detection === index ? "default" : "outline"}
                      onClick={() => {
                        if (detection !== null && detection !== index) setChangedMind(true);
                        setDetection(index);
                        setDetectAttempts((count) => count + 1);
                      }}
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
                  {detection !== null && !detectCorrect
                    ? "Not quite. Let's investigate that idea."
                    : detection !== null
                      ? "Good observation. Now show your evidence."
                      : "Choose the observation that best matches what you noticed."}
                </p>

                {detection !== null && !detectCorrect && (
                  <div className="mt-4 rounded-xl bg-secondary p-3">
                    <p className="text-sm font-semibold text-foreground">{definition.detect.nudge}</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setStage("investigate")}
                      className="mt-3"
                    >
                      RETURN TO INVESTIGATION
                    </Button>
                  </div>
                )}

                {detectCorrect && (
                  <div className="mt-5 border-t border-dashed border-border pt-4">
                    <p className="text-base font-black text-foreground">SHOW YOUR EVIDENCE</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {definition.detect.evidence.prompt}
                    </p>
                    <Button
                      type="button"
                      variant={evidencePlaced ? "secondary" : "default"}
                      onClick={() => setEvidencePlaced(true)}
                      className="mt-3 font-black"
                    >
                      {evidencePlaced
                        ? definition.detect.evidence.doneLabel
                        : definition.detect.evidence.actionLabel}
                    </Button>

                    {evidencePlaced && (
                      <>
                        <div className="mt-4 rounded-2xl border border-dashed border-primary/40 bg-secondary/60 p-4">
                          <PartsBoard
                            shape={model.shape}
                            total={model.totalParts}
                            selected={range(model.selectedParts)}
                            unitLabel={model.unitLabel}
                          />
                        </div>
                        <p className="mt-4 text-sm font-bold text-foreground">
                          {definition.detect.evidence.question}
                        </p>
                        <div className="mt-2 grid gap-2 sm:grid-cols-2">
                          {definition.detect.evidence.choices.map((choice, index) => (
                            <Button
                              key={choice.label}
                              type="button"
                              variant={evidenceChoice === index ? "default" : "outline"}
                              onClick={() => setEvidenceChoice(index)}
                              className="h-auto min-h-12 whitespace-normal text-left"
                            >
                              {choice.label}
                            </Button>
                          ))}
                        </div>
                        <Button
                          type="button"
                          className="mt-4 font-black"
                          onClick={() => {
                            const choice =
                              evidenceChoice === null
                                ? undefined
                                : definition.detect.evidence.choices[evidenceChoice];
                            if (choice?.correct) {
                              setEvidenceMessage("");
                              setStage("repair");
                            } else {
                              setEvidenceMessage(definition.detect.evidence.retry);
                            }
                          }}
                        >
                          CONFIRM MY EVIDENCE →
                        </Button>
                      </>
                    )}
                  </div>
                )}

                {evidenceMessage && (
                  <p
                    className="mt-3 rounded-xl bg-secondary p-3 text-sm font-semibold text-foreground"
                    role="status"
                  >
                    {evidenceMessage}
                  </p>
                )}
              </section>
            </>
          )}

          {stage === "repair" && (
            <div ref={repairRef}>
              <StageIntro
                eyebrow="REPAIR THE GLITCH"
                title={definition.repair.title}
                text={definition.repair.text}
              />
              <section className="mt-4 rounded-2xl border-2 border-primary bg-card shadow-sm">
                <header className="border-b border-border bg-secondary px-4 py-3 sm:px-5">
                  <p className="label-eyebrow text-muted-foreground">REPAIR WORKSPACE</p>
                  <h3 className="mt-1 text-lg font-black text-foreground">
                    {model.repair.instruction}
                  </h3>
                </header>
                <div className="space-y-4 p-4 sm:p-5">
                  {model.repair.adjustableTotal && (
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-background p-3">
                      <p className="text-sm font-bold text-foreground">
                        How many equal parts make the whole?
                      </p>
                      <div className="flex items-center gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          aria-label="Fewer equal parts"
                          disabled={repairTotal <= model.repair.adjustableTotal.min}
                          onClick={() => setTotal(repairTotal - 1)}
                        >
                          −
                        </Button>
                        <span className="min-w-8 text-center text-2xl font-black text-foreground">
                          {repairTotal}
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          aria-label="More equal parts"
                          disabled={repairTotal >= model.repair.adjustableTotal.max}
                          onClick={() => setTotal(repairTotal + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
                    <PartsBoard
                      shape={model.shape}
                      total={repairTotal}
                      selected={repairSelected}
                      interactive
                      onToggle={toggleRepair}
                      unitLabel={model.unitLabel}
                      reminder="bottom number = all the parts · top number = the ones we chose"
                    />

                    <FractionReadout
                      top={repairSelected.length}
                      bottom={repairTotal}
                      topLabel="parts being considered"
                      bottomLabel="equal parts in the whole"
                    />
                  </div>

                  <p className="text-center text-xs font-bold text-muted-foreground" aria-live="polite">
                    {repairReady
                      ? definition.repair.successText
                      : "Keep building. Tap the parts, and set how many equal parts the whole has."}
                  </p>

                  {repairReady && (
                    <div className="rounded-xl border border-border bg-background p-3">
                      <p className="text-sm font-black text-foreground">
                        {definition.repair.confirm.question}
                      </p>
                      <div className="mt-2 grid gap-2 sm:grid-cols-2">
                        <Button
                          type="button"
                          variant={confirmed === "yes" ? "default" : "outline"}
                          onClick={() => setConfirmed("yes")}
                          className="h-auto min-h-12 whitespace-normal text-left"
                        >
                          {definition.repair.confirm.yes}
                        </Button>
                        <Button
                          type="button"
                          variant={confirmed === "no" ? "default" : "outline"}
                          onClick={() => setConfirmed("no")}
                          className="h-auto min-h-12 whitespace-normal text-left"
                        >
                          {definition.repair.confirm.no}
                        </Button>
                      </div>
                      {confirmed === "yes" && (
                        <p className="mt-3 text-sm font-bold text-success">
                          {definition.repair.confirm.yesReply}
                        </p>
                      )}
                      {confirmed === "no" && (
                        <p className="mt-3 text-sm font-semibold text-muted-foreground">
                          {definition.repair.confirm.noReply}
                        </p>
                      )}
                    </div>
                  )}

                  {repairReady && confirmed === "yes" && definition.vocabulary && (
                    <div className="rounded-xl border border-primary bg-secondary p-4">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-black text-foreground">
                          {definition.vocabulary.title}
                        </p>
                        <SpeakButton
                          text={`${definition.vocabulary.title}. ${definition.vocabulary.lines.join(". ")}`}
                        />
                      </div>
                      <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                        {definition.vocabulary.lines.map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex flex-wrap justify-between gap-2 border-t border-dashed border-border pt-3">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setRepairTotal(
                          model.repair.adjustableTotal ? model.totalParts : model.repair.targetTotal,
                        );
                        setRepairSelected(range(Math.min(model.selectedParts, model.totalParts)));
                        setConfirmed(null);
                      }}
                    >
                      <RotateCcw className="h-4 w-4" aria-hidden /> Start again
                    </Button>
                    <Button
                      type="button"
                      className="font-black"
                      disabled={!repairReady || confirmed !== "yes"}
                      onClick={() => setStage("explain")}
                    >
                      CONTINUE TO EXPLAIN →
                    </Button>
                  </div>
                </div>
              </section>
            </div>
          )}

          {stage === "explain" && (
            <section className="space-y-5">
              <StageIntro
                eyebrow="EXPLAIN THE GLITCH"
                title={definition.explain.title}
                text={definition.explain.text}
              />
              <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                {definition.explain.slots.map((slot, slotIndex) => (
                  <div key={slot.prompt} className={slotIndex > 0 ? "mt-5" : ""}>
                    <p className="text-sm font-black text-foreground">
                      {slotIndex + 1}. {slot.prompt}
                    </p>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {slot.options.map((option) => (
                        <Button
                          key={option}
                          type="button"
                          variant={answers[slotIndex] === option ? "default" : "outline"}
                          onClick={() =>
                            setAnswers((current) => {
                              const next = [...current];
                              next[slotIndex] = option;
                              return next;
                            })
                          }
                          className="h-auto min-h-12 justify-start whitespace-normal text-left"
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  className="mt-5 font-black"
                  disabled={!explanationReady}
                  onClick={() =>
                    submitExplanation(
                      definition.explain.sentence(answers.map((answer) => answer ?? "")),
                      "sentence",
                    )
                  }
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
                      if (isFinal) submitExplanation(text, "speak");
                    }}
                  />
                  <span className="text-xs text-muted-foreground">Speaking is optional.</span>
                </div>
                <label
                  htmlFor={`${definition.chatId}-written`}
                  className="mt-4 block text-sm font-bold text-foreground"
                >
                  ✏️ WRITE IT (OPTIONAL)
                </label>
                <textarea
                  id={`${definition.chatId}-written`}
                  value={written}
                  onChange={(event) => setWritten(event.target.value)}
                  rows={3}
                  placeholder="ZED-4 was wrong because…"
                  className="mt-2 w-full resize-none rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={!written.trim()}
                  onClick={() => submitExplanation(written, "write")}
                  className="mt-2"
                >
                  SEND MY WRITTEN IDEA
                </Button>
              </div>
            </section>
          )}

          {stage === "solved" && (
            <div ref={reportRef} className="space-y-5">
              <CaseClosedBanner
                zedWasCorrect={definition.zedClaim.isCorrect}
                skill={definition.detectiveSkill}
              />
              <CaseReflectionCard reflection={reflection} onTryAnother={onBackToPicker} />
              <ApplyChallenge
                text={definition.apply}
                complete={applyComplete}
                onComplete={() => setApplyComplete(true)}
              />
            </div>
          )}
        </div>

        <ChatPanel
          stage={stepperStage}
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
