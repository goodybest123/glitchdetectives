/**
 * `/printables/mini-packs/$slug` — detail + page preview for a free
 * Glitch Detectives mini pack. Copy comes from `miniPacks.ts`; page images
 * are rendered from each pack's PDF into `/printables/mini-packs/<slug>/`.
 */
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Download } from "lucide-react";
import { PagePreviewGallery } from "@/components/printables/PagePreviewGallery";
import { getMiniPack, packPages } from "@/components/printables/miniPacks";

const BLUE = "var(--color-brand-blue)";
const YELLOW = "var(--color-brand-yellow)";
const MINT = "var(--color-bg-mint)";
const MUTED = "color-mix(in oklab, var(--color-brand-blue) 72%, transparent)";

export const Route = createFileRoute("/printables/mini-packs/$slug")({
  loader: ({ params }) => {
    const pack = getMiniPack(params.slug);
    if (!pack) throw notFound();
    return { pack };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Mini pack not found — Glitch Detectives" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { pack } = loaderData;
    const title = `${pack.title} — Free Printable | Glitch Detectives`;
    return {
      meta: [
        { title },
        { name: "description", content: pack.blurb },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { property: "og:title", content: pack.title },
        { property: "og:description", content: pack.blurb },
      ],
    };
  },
  notFoundComponent: MiniPackNotFound,
  component: MiniPackPage,
});

function MiniPackNotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="heading-black uppercase text-3xl" style={{ color: BLUE }}>
          Mini pack not found
        </h1>
        <Link
          to="/printables"
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold"
          style={{ color: BLUE }}
        >
          <ArrowLeft className="w-4 h-4" /> Back to printables
        </Link>
      </div>
    </div>
  );
}

function MiniPackPage() {
  const { pack } = Route.useLoaderData();
  const pages = packPages(pack);

  return (
    <div className="min-h-screen bg-white">
      <main>
        <section style={{ background: MINT }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 lg:py-20">
            <Link
              to="/printables"
              className="flex w-fit items-center gap-2 text-sm font-semibold mb-8 hover:opacity-80"
              style={{ color: BLUE }}
            >
              <ArrowLeft className="w-4 h-4" /> Back to printables
            </Link>

            <span
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
              style={{ background: YELLOW, color: BLUE }}
            >
              Free mini pack
            </span>
            <h1
              className="heading-black uppercase text-3xl sm:text-4xl lg:text-5xl mt-5"
              style={{ color: BLUE }}
            >
              {pack.title}
            </h1>

            <div className="mt-5 flex flex-wrap gap-2">
              {pack.badges.map((b) => (
                <span
                  key={b}
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-white"
                  style={{ color: BLUE }}
                >
                  {b}
                </span>
              ))}
            </div>

            <div className="mt-6 max-w-3xl space-y-4">
              {pack.description.map((p) => (
                <p
                  key={p.slice(0, 24)}
                  className="text-base leading-relaxed"
                  style={{ color: MUTED }}
                >
                  {p}
                </p>
              ))}
            </div>

            {pack.downloadUrl && (
              <a
                href={pack.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 px-6 py-4 rounded-full font-bold uppercase tracking-wider text-sm hover:scale-105 transition-transform"
                style={{ background: BLUE, color: "white" }}
              >
                <Download className="w-4 h-4" /> Download the free pack
              </a>
            )}

            <div className="mt-12">
              <h2 className="heading-black uppercase text-2xl sm:text-3xl" style={{ color: BLUE }}>
                Page preview
              </h2>
              <p className="mt-3 text-sm" style={{ color: MUTED }}>
                {pages.length} sample pages from the {pack.pageCount}-page pack. Tap any page to zoom in.
              </p>
              <div className="mt-8">
                <PagePreviewGallery pages={pages} />
              </div>
            </div>

            <div className="mt-12 rounded-3xl bg-white border border-black/5 p-7 sm:p-10 shadow-sm">
              <h2 className="heading-black uppercase text-2xl sm:text-3xl" style={{ color: BLUE }}>
                What they will actually learn
              </h2>
              <div className="mt-6 grid sm:grid-cols-3 gap-8">
                {pack.learn.map((block) => (
                  <div key={block.title}>
                    <h3
                      className="text-base font-black uppercase tracking-tight"
                      style={{ color: BLUE }}
                    >
                      {block.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed" style={{ color: MUTED }}>
                      {block.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
