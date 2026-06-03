import type { CaseDef } from "@/lib/level2/types";
import { ConversationPanel } from "./ConversationPanel";

/**
 * Explain phase wrapper. Shows the prompt + the conversational ZED chat.
 * No hints. ZED helps after 3 misses (see ConversationPanel).
 */
export function ExplainPanel({
  caseDef,
  onComplete,
}: {
  caseDef: CaseDef;
  onComplete: (stats: { reasoningScore: number; explanation: string }) => void;
  onHintUsed?: (level: number) => void;
  onZedSpeak?: (line: string) => void;
}) {
  const seed = `Thank you teacher! ${caseDef.explainPrompt}`;
  return (
    <div className="flex flex-col gap-4">
      <header>
        <p className="label-eyebrow text-cyan-300/80">Teach ZED-4</p>
        <h3 className="text-xl font-bold text-cyan-50 mt-1">
          {caseDef.explainPrompt}
        </h3>
      </header>
      <ConversationPanel
        key={caseDef.id}
        caseDef={caseDef}
        seedZedLine={seed}
        onComplete={onComplete}
        builderMode="explain"
      />

    </div>
  );
}
