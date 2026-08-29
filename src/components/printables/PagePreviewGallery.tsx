/**
 * Buyer-facing sample gallery for the printable workbook. Renders page
 * thumbnails and opens a keyboard-navigable lightbox on click.
 */
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { PREVIEW_PAGES } from "./collection";

const BLUE = "var(--color-brand-blue)";
const MUTED = "color-mix(in oklab, var(--color-brand-blue) 70%, transparent)";

export function PagePreviewGallery({
  pages,
}: {
  /** Page thumbnails to show; defaults to the fractions collection samples. */
  pages?: { n: number; src: string }[];
}) {
  const items = pages ?? PREVIEW_PAGES;
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback((dir: 1 | -1) => {
    setOpen((cur) => {
      if (cur === null) return cur;
      const next = cur + dir;
      if (next < 0 || next >= items.length) return cur;
      return next;
    });
  }, []);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, step]);

  return (
    <>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((p, i) => (
          <li key={p.n}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              className="group w-full text-left rounded-2xl overflow-hidden bg-white border border-black/10 shadow-sm hover:-translate-y-1 hover:shadow-md transition-transform"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-white">
                <img
                  src={p.src}
                  alt={`Workbook sample page ${p.n}`}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-contain"
                />
                <span
                  className="absolute top-3 left-3 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
                  style={{ background: "var(--color-brand-yellow)", color: BLUE }}
                >
                  Page {p.n}
                </span>
                <span
                  className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-hidden
                >
                  <ZoomIn className="w-4 h-4" style={{ color: BLUE }} />
                </span>
              </div>
            </button>
          </li>
        ))}
      </ul>

      {open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Workbook sample page ${items[open].n}`}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70"
          onClick={close}
        >
          <div
            className="relative max-w-3xl w-full max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={items[open].src}
              alt={`Workbook sample page ${items[open].n}`}
              className="w-full max-h-[85vh] object-contain rounded-xl bg-white"
            />
            <button
              type="button"
              onClick={close}
              aria-label="Close preview"
              className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-white shadow flex items-center justify-center"
            >
              <X className="w-5 h-5" style={{ color: BLUE }} />
            </button>
            <div className="mt-4 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => step(-1)}
                disabled={open === 0}
                aria-label="Previous page"
                className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center disabled:opacity-40"
              >
                <ChevronLeft className="w-5 h-5" style={{ color: BLUE }} />
              </button>
              <span className="text-sm font-semibold text-white">
                Page {items[open].n} of {items.length} samples
              </span>
              <button
                type="button"
                onClick={() => step(1)}
                disabled={open === items.length - 1}
                aria-label="Next page"
                className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center disabled:opacity-40"
              >
                <ChevronRight className="w-5 h-5" style={{ color: BLUE }} />
              </button>
            </div>
          </div>
        </div>
      )}
      <p className="sr-only" style={{ color: MUTED }}>
         Use the arrow keys to move between sample pages and Escape to close.
      </p>
    </>
  );
}
