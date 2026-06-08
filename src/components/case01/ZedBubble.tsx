type ZedBubbleProps = {
  message: string;
  tone?: "neutral" | "alert" | "happy";
};

export function ZedBubble({ message, tone = "neutral" }: ZedBubbleProps) {
  const bubbleBg =
    tone === "alert"
      ? "bg-[#fff4d6] border-[#f5d97a]"
      : tone === "happy"
      ? "bg-[#e6f7ec] border-[#a8d8b9]"
      : "bg-[#eaf2ff] border-[#c8d9f0]";

  return (
    <div className="flex items-start gap-3">
      {/* Robot avatar */}
      <div
        aria-hidden
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#dbeafe] shadow-inner"
      >
        <svg viewBox="0 0 40 40" className="h-9 w-9" fill="none">
          <rect x="8" y="12" width="24" height="20" rx="6" fill="#475569" />
          <rect x="13" y="18" width="5" height="5" rx="1.5" fill="#a5f3fc" />
          <rect x="22" y="18" width="5" height="5" rx="1.5" fill="#a5f3fc" />
          <rect x="17" y="27" width="6" height="2" rx="1" fill="#cbd5e1" />
          <rect x="18" y="6" width="4" height="6" rx="1.5" fill="#64748b" />
          <circle cx="20" cy="5" r="2" fill="#fcd34d" />
        </svg>
      </div>
      {/* Speech bubble */}
      <div
        className={`relative max-w-md rounded-2xl border px-4 py-3 text-sm sm:text-base text-neutral-800 shadow-sm ${bubbleBg}`}
      >
        <span className="font-semibold text-neutral-900">ZED-4: </span>
        {message}
      </div>
    </div>
  );
}
