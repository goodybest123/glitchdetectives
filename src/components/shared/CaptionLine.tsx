import { SpeakButton } from "@/components/case01/SpeakButton";

type Props = {
  text: string;
};

/**
 * Stage caption with an inline speaker so every on-screen instruction
 * can be heard by young learners.
 */
export function CaptionLine({ text }: Props) {
  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      <p className="text-center text-neutral-600">{text}</p>
      <SpeakButton text={text} />
    </div>
  );
}
