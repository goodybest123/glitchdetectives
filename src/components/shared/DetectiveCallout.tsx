import { SpeakButton } from "@/components/case01/SpeakButton";

type Props = {
  text: string;
};

/**
 * Child-voiced on-screen prompt shown after ZED-4's confident-but-wrong claim.
 * This is the DETECTIVE (the kid) noticing the glitch — never ZED-4.
 */
export function DetectiveCallout({ text }: Props) {
  return (
    <div className="mt-4 flex items-start gap-3 rounded-2xl border border-[#fcd34d] bg-[#fffbeb] px-4 py-3">
      <SpeakButton
        text={`Detective. ${text}`}
        size="md"
        className="shrink-0 border-[#fcd34d] bg-[#fde68a] text-[#78350f] hover:bg-[#fcd34d]"
      />
      <div className="flex flex-1 items-start gap-2">
        <p className="flex-1 text-sm text-[#78350f]">
          <span className="font-bold">DETECTIVE: </span>
          {text}
        </p>
      </div>
    </div>
  );
}
