/**
 * `/articles` — index listing of published articles.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, Clock } from "lucide-react";
import { ARTICLES, formatArticleDate } from "@/content/articles";

const BLUE = "var(--color-brand-blue)";
const YELLOW = "var(--color-brand-yellow)";
const MINT = "var(--color-brand-mint)";

const TITLE = "Articles — Glitch Detectives";
const DESCRIPTION =
  "Essays on reasoning-first learning, neuroinclusive maths, and raising children who can question answers in the AI era.";

export const Route = createFileRoute("/articles/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://glitchdetectives.lovable.app/articles" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://glitchdetectives.lovable.app/articles" }],
  }),
  component: ArticlesIndex,
});

function ArticlesIndex() {
  return (
    <main className="min-h-screen bg-white">
      <section
        className="relative overflow-hidden dots-bg"
        style={{ backgroundColor: BLUE, color: "white" }}
      >
        <div
          className="pointer-events-none absolute -top-24 -right-16 w-[380px] h-[380px] rounded-full blur-3xl opacity-30"
          style={{ background: MINT }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-20 lg:py-24">
          <span
            className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
            style={{ background: YELLOW, color: BLUE }}
          >
            Articles
          </span>
          <h1 className="heading-black uppercase text-4xl sm:text-6xl mt-6">
            Thinking out loud about
            <br />
            <span style={{ color: YELLOW }}>learning in the AI era</span>
          </h1>
          <p className="mt-6 text-white/85 text-lg leading-relaxed max-w-2xl">
            Notes for parents and educators on reasoning-first maths, neuroinclusive learning, and
            raising children who question answers instead of just collecting them.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 lg:py-20">
        <ul className="space-y-6">
          {ARTICLES.map((a) => (
            <li key={a.slug}>
              <Link
                to="/articles/$slug"
                params={{ slug: a.slug }}
                className="block rounded-3xl border border-black/5 bg-[var(--color-bg-light)] p-6 sm:p-8 hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold uppercase tracking-wider text-[var(--color-brand-blue)]/60">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="w-3.5 h-3.5" /> {formatArticleDate(a.date)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> {a.readingTime}
                  </span>
                </div>
                <h2 className="mt-3 font-black text-2xl sm:text-3xl text-[var(--color-brand-blue)] leading-tight">
                  {a.title}
                </h2>
                <p className="mt-3 text-[var(--color-brand-blue)]/75 leading-relaxed">
                  {a.excerpt}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[var(--color-brand-blue)]">
                  Read article <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
