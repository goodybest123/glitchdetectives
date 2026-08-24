/**
 * `/articles/$slug` — a single published article. Bodies come from the
 * in-code registry in `src/content/articles.ts`.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CalendarDays, Clock, FileText } from "lucide-react";
import { getArticle, formatArticleDate } from "@/content/articles";

const BLUE = "var(--color-brand-blue)";
const YELLOW = "var(--color-brand-yellow)";
const MINT = "var(--color-brand-mint)";
const SITE = "https://glitchdetectives.lovable.app";

export const Route = createFileRoute("/articles/$slug")({
  head: ({ params }) => {
    const article = getArticle(params.slug);
    if (!article) {
      return {
        meta: [{ title: "Article not found — Glitch Detectives" }, { name: "robots", content: "noindex" }],
      };
    }
    const url = `${SITE}/articles/${article.slug}`;
    return {
      meta: [
        { title: `${article.title} — Glitch Detectives` },
        { name: "description", content: article.excerpt },
        { property: "og:title", content: article.title },
        { property: "og:description", content: article.excerpt },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description: article.excerpt,
            datePublished: article.date,
            mainEntityOfPage: url,
            publisher: { "@type": "Organization", name: "Glitch Detectives" },
          }),
        },
      ],
    };
  },
  component: ArticlePage,
});

function ArticlePage() {
  const { slug } = Route.useParams();
  const article = getArticle(slug);

  if (!article) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center bg-white px-4">
        <div className="text-center max-w-md">
          <h1 className="heading-black uppercase text-3xl text-[var(--color-brand-blue)]">
            Article not found
          </h1>
          <p className="mt-3 text-[var(--color-brand-blue)]/70">
            This article doesn't exist, or it may have moved.
          </p>
          <Link
            to="/articles"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--color-brand-blue)] text-white text-sm font-bold uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" /> All articles
          </Link>
        </div>
      </main>
    );
  }

  const { Body } = article;

  return (
    <main className="min-h-screen bg-white">
      <section
        className="relative overflow-hidden dots-bg"
        style={{ backgroundColor: BLUE, color: "white" }}
      >
        <div
          className="pointer-events-none absolute -bottom-24 -left-16 w-[380px] h-[380px] rounded-full blur-3xl opacity-25"
          style={{ background: MINT }}
        />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-16 lg:py-20">
          <Link
            to="/articles"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/70 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" /> All articles
          </Link>
          <h1 className="heading-black uppercase text-3xl sm:text-5xl mt-6 leading-tight">
            {article.title}
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-semibold uppercase tracking-wider text-white/70">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5" /> {formatArticleDate(article.date)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> {article.readingTime}
            </span>
          </div>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-14 lg:py-20 article-prose">
        <Body />
      </article>

      <section style={{ backgroundColor: YELLOW }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h2 className="heading-black uppercase text-2xl sm:text-4xl text-[var(--color-brand-blue)]">
            See the idea in practice
          </h2>
          <p className="mt-4 text-[var(--color-brand-blue)]/80 max-w-xl mx-auto">
            Detective Worlds and printable missions that start with a mistake to find, not a blank
            page to fill.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/play"
              className="px-6 py-3 rounded-full bg-[var(--color-brand-blue)] text-white text-sm font-bold uppercase tracking-wider inline-flex items-center gap-2 hover:scale-105 transition-transform"
            >
              Explore Worlds <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/printables"
              className="px-6 py-3 rounded-full bg-white text-[var(--color-brand-blue)] text-sm font-bold uppercase tracking-wider inline-flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <FileText className="w-4 h-4" /> Explore Printables
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
