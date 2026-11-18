import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  Download,
  Search,
  ShoppingBag,
  ShoppingCart,
  X,
} from "lucide-react";
import lifeSkillsCover from "@/assets/landing/print-realworld.jpg";
import fractionsCover from "@/assets/fractions-level-1-cover.png";
import { COLLECTION_PDF_URL, PREVIEW_PAGES } from "./collection";
import {
  FRACTIONS_BUNDLE_LAUNCH_PRICE,
  FRACTIONS_BUNDLE_TITLE,
  FRACTIONS_BUNDLE_URL,
  FRACTIONS_BUNDLE_PREVIEW_PAGES,
} from "./fractionBundle";
import { MINI_PACKS, packPages, type MiniPack } from "./miniPacks";

const BLUE = "var(--color-brand-blue)";
const YELLOW = "var(--color-brand-yellow)";
const MUTED = "color-mix(in oklab, var(--color-brand-blue) 70%, transparent)";

type ResourceCategory = "Life Skills" | "Mini Packs" | "Workbooks & Guides";

type Resource = {
  id: string;
  title: string;
  category: ResourceCategory;
  description: string;
  details: string[];
  included: string[];
  ageGrade?: string;
  pageCount?: number;
  price: number;
  priceLabel: string;
  downloadUrl?: string;
  checkoutUrl?: string;
  cover?: string;
  coverAlt?: string;
  coverIsTemporary?: boolean;
  previews: { src: string; label: string }[];
  miniPack?: MiniPack;
  featured?: boolean;
};

const PREVIEW_NOTICE = "These are authentic sample pages from this resource.";

function samplePreviews(pages: { n: number; src: string }[], title: string): Resource["previews"] {
  return pages.slice(0, 3).map((page) => ({
    src: page.src,
    label: `${title} sample page ${page.n}`,
  }));
}

const MINI_PACK_CATEGORIES: Record<string, ResourceCategory> = {
  "money-maths": "Mini Packs",
  "mixed-missions": "Mini Packs",
  "real-world-glitch-hunt": "Mini Packs",
  "7-day-math-without-worksheets-challenge": "Mini Packs",
  "my-first-money-mysteries": "Mini Packs",
  "math-planner": "Workbooks & Guides",
  "math-in-the-wild": "Workbooks & Guides",
};

const MINI_PACK_AGES: Record<string, string> = {
  "mixed-missions": "Grades 2–4",
  "my-first-money-mysteries": "Ages 5–12",
};

const miniPackResources: Resource[] = MINI_PACKS.map((pack) => {
  const pages = packPages(pack);
  const category = MINI_PACK_CATEGORIES[pack.slug];
  if (!category) {
    throw new Error(`Missing printable category mapping for ${pack.slug}`);
  }

  return {
    id: pack.slug,
    title: pack.title,
    category,
    description: pack.blurb,
    details: pack.description,
    included: pack.learn.map((item) => `${item.title}: ${item.body}`),
    ageGrade: MINI_PACK_AGES[pack.slug],
    pageCount: pack.pageCount,
    price: 0,
    priceLabel: "Free",
    downloadUrl: pack.downloadUrl,
    previews: samplePreviews(pages, pack.title),
    miniPack: pack,
    featured: pack.slug === "money-maths",
  };
});

const RESOURCES: Resource[] = [
  {
    id: "life-skills-maths",
    title: "Life Skills Maths",
    category: "Life Skills",
    description:
      "A printable pack designed to help children learn maths through real-life experiences.",
    details: [
      "Four weeks of practical maths activities for budgeting, cooking, time planning, and shopping.",
      "Short, flexible activities designed to make maths feel calm, meaningful, and practical.",
    ],
    included: [
      "Week 1: Budgeting and money sense",
      "Week 2: Cooking and measurements",
      "Week 3: Time planning and daily routines",
      "Week 4: Shopping, comparisons, and choices",
    ],
    ageGrade: "Ages 5–8",
    price: 0,
    priceLabel: "Free",
    downloadUrl: "https://selar.com/lifeskillsmaths",
    cover: lifeSkillsCover,
    coverAlt: "Illustration of children learning maths through cooking",
    coverIsTemporary: true,
    previews: [],
    featured: true,
  },
  {
    id: "fractions-bundle",
    title: FRACTIONS_BUNDLE_TITLE,
    category: "Workbooks & Guides",
    description:
      "A two-resource bundle combining a practical parent guide with a mission-based fractions workbook.",
    details: [
      "Designed for parents and homeschoolers supporting children in Grades 1–3 as they build understanding of fractions.",
      "Children investigate fraction problems, detect mistakes, repair incorrect reasoning, and explain their thinking.",
    ],
    included: [
      "Fraction Parent Companion — 53 pages",
      "Glitch Detectives Workbook: Volume 1 — 80 pages",
      "Topics include equal parts, halves, quarters, equivalent fractions, comparing fractions, and fractions on a number line.",
    ],
    ageGrade: "Grades 1–3",
    pageCount: 133,
    price: 9.99,
    priceLabel: FRACTIONS_BUNDLE_LAUNCH_PRICE,
    checkoutUrl: FRACTIONS_BUNDLE_URL,
    cover: "/printables/fractions-bundle/cover.png",
    coverAlt: "Cover of the Glitch Detectives Fractions Bundle",
    previews: samplePreviews(FRACTIONS_BUNDLE_PREVIEW_PAGES, FRACTIONS_BUNDLE_TITLE),
    featured: true,
  },
  {
    id: "fractions-foundations",
    title: "Glitch Detectives: Fractions — Foundations Collection",
    category: "Workbooks & Guides",
    description:
      "A 21-page printable workbook combining Levels 1 and 2 fraction missions for children in Grades 1–2.",
    details: [
      "Children investigate mathematical mistakes, repair misconceptions, and explain their thinking while building a conceptual understanding of fractions.",
      "Includes missions on equal and unequal parts, halves, quarters, fractions of a set, comparing unit fractions, equivalent fractions, and number lines.",
    ],
    included: [
      "Level 1: Equal and unequal parts, halves, quarters, and fraction language",
      "Level 2: Numerators and denominators, fractions of a set, comparing and equivalent fractions",
      "Sample pages shown are from the existing workbook preview.",
    ],
    ageGrade: "Grades 1–2",
    pageCount: 21,
    price: 0,
    priceLabel: "Free",
    downloadUrl: COLLECTION_PDF_URL,
    cover: fractionsCover,
    coverAlt: "Cover of the Fractions Foundations Collection",
    previews: samplePreviews(PREVIEW_PAGES, "Fractions Foundations Collection"),
    featured: true,
  },
  ...miniPackResources,
];

const CATEGORIES: {
  name: ResourceCategory;
  intro: string;
  detail: string;
  icon: typeof BookOpen;
  tone: string;
  slug: string;
}[] = [
  {
    name: "Life Skills",
    intro: "Maths for everyday moments",
    detail: "Budgeting, cooking, planning, and practical choices.",
    icon: ShoppingBag,
    tone: "#fff2c2",
    slug: "life-skills",
  },
  {
    name: "Mini Packs",
    intro: "Short investigations, ready to print",
    detail: "Focused activities for a quick, low-prep learning session.",
    icon: Search,
    tone: "#e8f9f5",
    slug: "mini-packs",
  },
  {
    name: "Workbooks & Guides",
    intro: "Go deeper, at your own pace",
    detail: "Longer resources and helpful guides for learners and adults.",
    icon: BookOpen,
    tone: "#edf1e9",
    slug: "workbooks-guides",
  },
];

function money(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

function getCategoryFromHash(hash: string): ResourceCategory | null {
  return CATEGORIES.find((item) => item.slug === hash.slice(1))?.name ?? null;
}

export function PrintablesLibrary() {
  const [category, setCategory] = useState<ResourceCategory | "All">("All");
  const [search, setSearch] = useState("");
  const [ageGrade, setAgeGrade] = useState("All");
  const [priceFilter, setPriceFilter] = useState<"All" | "Free" | "Paid">("All");
  const [sort, setSort] = useState<"featured" | "price-low" | "price-high">("featured");
  const [selected, setSelected] = useState<Resource | null>(null);
  const [cart, setCart] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const ages = [
    ...new Set(RESOURCES.map((resource) => resource.ageGrade).filter(Boolean)),
  ] as string[];
  const visibleResources = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = RESOURCES.filter((resource) => {
      const matchesCategory = category === "All" || resource.category === category;
      const matchesAge = ageGrade === "All" || resource.ageGrade === ageGrade;
      const matchesPrice =
        priceFilter === "All" ||
        (priceFilter === "Free" ? resource.price === 0 : resource.price > 0);
      const searchable =
        `${resource.title} ${resource.category} ${resource.description} ${resource.details.join(" ")}`.toLowerCase();
      return (
        matchesCategory && matchesAge && matchesPrice && (!query || searchable.includes(query))
      );
    });

    return filtered.sort((a, b) => {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    });
  }, [ageGrade, category, priceFilter, search, sort]);

  const cartResources = RESOURCES.filter((resource) => cart.includes(resource.id));
  const subtotal = cartResources.reduce((total, resource) => total + resource.price, 0);

  useEffect(() => {
    const syncCategoryFromHash = () => {
      const linkedCategory = getCategoryFromHash(window.location.hash);
      if (!linkedCategory) return;
      setCategory(linkedCategory);
      window.requestAnimationFrame(() => {
        document.getElementById("browse-resources")?.scrollIntoView({ behavior: "smooth" });
      });
    };

    syncCategoryFromHash();
    window.addEventListener("hashchange", syncCategoryFromHash);
    return () => window.removeEventListener("hashchange", syncCategoryFromHash);
  }, []);

  const addToCart = (resource: Resource) => {
    if (!resource.checkoutUrl) return;
    setCart((items) => (items.includes(resource.id) ? items : [...items, resource.id]));
    setCartOpen(true);
  };

  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden" style={{ background: "#edf1e9" }}>
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pb-24">
          <div className="flex items-center justify-between gap-4">
            <a href="/" className="text-sm font-bold hover:underline" style={{ color: BLUE }}>
              ← Back to Glitch Detectives
            </a>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative inline-flex min-h-11 items-center gap-2 rounded-full border border-black/10 bg-white px-4 text-sm font-bold shadow-sm transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ color: BLUE }}
              aria-label={`Open shopping cart, ${cart.length} items`}
            >
              <ShoppingCart className="h-4 w-4" />
              Cart
              {cart.length > 0 && (
                <span
                  className="flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-xs"
                  style={{ background: YELLOW, color: BLUE }}
                >
                  {cart.length}
                </span>
              )}
            </button>
          </div>

          <div className="mx-auto mt-14 max-w-3xl text-center">
            <span className="label-eyebrow inline-flex items-center gap-2" style={{ color: BLUE }}>
              <BookOpen className="h-4 w-4" /> The resource library
            </span>
            <h1
              className="heading-black mt-5 text-4xl uppercase leading-tight sm:text-5xl lg:text-6xl"
              style={{ color: BLUE }}
            >
              Print, explore,
              <br />
              and think it through.
            </h1>
            <p
              className="mx-auto mt-6 max-w-2xl text-base leading-relaxed sm:text-lg"
              style={{ color: MUTED }}
            >
              Find calm, practical maths printables for curious children and the grown-ups learning
              alongside them. Preview the real pages, then choose a free download or a resource to
              buy.
            </p>
            <a
              href="#browse-resources"
              className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ background: BLUE }}
            >
              Browse all resources <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="categories-heading"
        className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20"
      >
        <div className="mb-8 text-center">
          <p className="label-eyebrow" style={{ color: BLUE }}>
            Find your starting point
          </p>
          <h2
            id="categories-heading"
            className="heading-black mt-3 text-3xl uppercase sm:text-4xl"
            style={{ color: BLUE }}
          >
            Browse by collection
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {CATEGORIES.map(({ name, intro, detail, icon: Icon, tone, slug }) => (
            <a
              key={name}
              href={`/printables#${slug}`}
              className="group rounded-3xl border border-black/5 p-6 text-left transition hover:-translate-y-1 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:p-7"
              style={{ background: tone }}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80">
                <Icon className="h-6 w-6" style={{ color: BLUE }} />
              </span>
              <span className="mt-5 block text-xl font-black uppercase" style={{ color: BLUE }}>
                {name}
              </span>
              <span className="mt-2 block text-sm font-bold" style={{ color: BLUE }}>
                {intro}
              </span>
              <span className="mt-2 block text-sm leading-relaxed" style={{ color: MUTED }}>
                {detail}
              </span>
              <span
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold"
                style={{ color: BLUE }}
              >
                Explore collection{" "}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="bg-white py-14 sm:py-16" aria-labelledby="featured-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="label-eyebrow" style={{ color: BLUE }}>
                A few places to begin
              </p>
              <h2
                id="featured-heading"
                className="heading-black mt-3 text-3xl uppercase sm:text-4xl"
                style={{ color: BLUE }}
              >
                Featured resources
              </h2>
            </div>
            <button
              type="button"
              onClick={() =>
                document.getElementById("browse-resources")?.scrollIntoView({ behavior: "smooth" })
              }
              className="inline-flex items-center gap-2 text-sm font-bold underline underline-offset-4"
              style={{ color: BLUE }}
            >
              See everything <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {RESOURCES.filter((resource) => resource.featured).map((resource) => (
              <li key={resource.id}>
                <ResourceCard
                  resource={resource}
                  onPreview={setSelected}
                  onAdd={addToCart}
                  inCart={cart.includes(resource.id)}
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="browse-resources"
        className="scroll-mt-8 py-14 sm:py-20"
        style={{ background: "#f7f8f5" }}
        aria-labelledby="browse-heading"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="label-eyebrow" style={{ color: BLUE }}>
              The complete collection
            </p>
            <h2
              id="browse-heading"
              className="heading-black mt-3 text-3xl uppercase sm:text-4xl"
              style={{ color: BLUE }}
            >
              Browse all resources
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed" style={{ color: MUTED }}>
              Search by title or topic, then narrow the collection to the age range or resource type
              that suits you.
            </p>
          </div>

          <div className="mb-8 grid gap-3 rounded-3xl border border-black/5 bg-white p-4 sm:grid-cols-2 lg:grid-cols-5 lg:p-5">
            <label className="relative sm:col-span-2 lg:col-span-2">
              <span className="sr-only">Search resources by title or topic</span>
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2"
                style={{ color: MUTED }}
              />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search title or topic"
                className="min-h-11 w-full rounded-xl border border-black/10 bg-white pl-11 pr-4 text-sm outline-none focus:border-[#1e293b] focus:ring-2 focus:ring-[#1e293b]/15"
              />
            </label>
            <label>
              <span className="sr-only">Filter by category</span>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value as ResourceCategory | "All")}
                className="min-h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm font-semibold text-[#1e293b] focus:outline focus:outline-2 focus:outline-offset-2"
              >
                <option value="All">All categories</option>
                {CATEGORIES.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="sr-only">Filter by age range or grade</span>
              <select
                value={ageGrade}
                onChange={(event) => setAgeGrade(event.target.value)}
                className="min-h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm font-semibold text-[#1e293b] focus:outline focus:outline-2 focus:outline-offset-2"
              >
                <option value="All">All ages / grades</option>
                {ages.map((age) => (
                  <option key={age} value={age}>
                    {age}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label>
                <span className="sr-only">Filter by price</span>
                <select
                  value={priceFilter}
                  onChange={(event) => setPriceFilter(event.target.value as typeof priceFilter)}
                  className="min-h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm font-semibold text-[#1e293b] focus:outline focus:outline-2 focus:outline-offset-2"
                >
                  <option value="All">Free + paid</option>
                  <option value="Free">Free only</option>
                  <option value="Paid">Paid only</option>
                </select>
              </label>
              <label>
                <span className="sr-only">Sort resources</span>
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value as typeof sort)}
                  className="min-h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm font-semibold text-[#1e293b] focus:outline focus:outline-2 focus:outline-offset-2"
                >
                  <option value="featured">Featured order</option>
                  <option value="price-low">Price: low to high</option>
                  <option value="price-high">Price: high to low</option>
                  <option disabled>Newest (dates unavailable)</option>
                </select>
              </label>
            </div>
          </div>
          <p className="mb-5 text-sm" style={{ color: MUTED }}>
            {visibleResources.length} {visibleResources.length === 1 ? "resource" : "resources"}{" "}
            shown
            {sort === "featured" && " · No publication dates are available to sort by newest."}
          </p>
          {visibleResources.length > 0 ? (
            <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {visibleResources.map((resource) => (
                <li key={resource.id}>
                  <ResourceCard
                    resource={resource}
                    onPreview={setSelected}
                    onAdd={addToCart}
                    inCart={cart.includes(resource.id)}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-3xl border border-dashed border-black/15 bg-white px-5 py-14 text-center">
              <p className="text-lg font-bold" style={{ color: BLUE }}>
                No resources match those filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                  setAgeGrade("All");
                  setPriceFilter("All");
                }}
                className="mt-3 text-sm font-bold underline underline-offset-4"
                style={{ color: BLUE }}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      <CartDrawer
        open={cartOpen}
        resources={cartResources}
        subtotal={subtotal}
        onClose={() => setCartOpen(false)}
        onRemove={(id) => setCart((items) => items.filter((item) => item !== id))}
      />
      <ResourceDialog
        resource={selected}
        onClose={() => setSelected(null)}
        onAdd={addToCart}
        inCart={selected ? cart.includes(selected.id) : false}
      />
    </main>
  );
}

function ResourceCard({
  resource,
  onPreview,
  onAdd,
  inCart,
}: {
  resource: Resource;
  onPreview: (resource: Resource) => void;
  onAdd: (resource: Resource) => void;
  inCart: boolean;
}) {
  const coverPage = resource.miniPack ? packPages(resource.miniPack)[0] : undefined;
  const actualCover = Boolean(resource.cover && !resource.coverIsTemporary);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-[#edf1e9]">
        {resource.cover ? (
          <img
            src={resource.cover}
            alt={resource.coverAlt ?? `${resource.title} cover`}
            className="absolute inset-0 h-full w-full object-contain p-4"
            loading="lazy"
          />
        ) : coverPage ? (
          <>
            <img
              src={coverPage.src}
              alt={`${resource.title} sample page ${coverPage.n}`}
              className="absolute inset-0 h-full w-full object-cover object-top"
              loading="lazy"
            />
            <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-[#1e293b]">
              Sample page · cover coming soon
            </span>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 p-6 text-center">
            <BookOpen className="h-10 w-10" style={{ color: BLUE }} />
            <span className="text-sm font-bold" style={{ color: BLUE }}>
              Cover image coming soon
            </span>
          </div>
        )}
        {resource.coverIsTemporary && (
          <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-[#1e293b]">
            Temporary cover image
          </span>
        )}
        <span
          className="absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-extrabold"
          style={{ background: resource.price > 0 ? YELLOW : "#fff", color: BLUE }}
        >
          {resource.priceLabel}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
          <span className="rounded-full px-3 py-1" style={{ background: "#edf1e9", color: BLUE }}>
            {resource.category}
          </span>
          {resource.ageGrade && <span style={{ color: MUTED }}>{resource.ageGrade}</span>}
        </div>
        <h3 className="mt-4 text-xl font-black leading-snug" style={{ color: BLUE }}>
          {resource.title}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed" style={{ color: MUTED }}>
          {resource.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs" style={{ color: MUTED }}>
          {resource.pageCount && <span>{resource.pageCount} pages</span>}
          {resource.pageCount && resource.previews.length > 0 && <span aria-hidden="true">·</span>}
          {resource.previews.length > 0 && (
            <span>
              {resource.previews.length} real sample{" "}
              {resource.previews.length === 1 ? "page" : "pages"}
            </span>
          )}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onPreview(resource)}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#1e293b]/20 px-3 text-sm font-bold transition hover:bg-[#edf1e9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ color: BLUE }}
          >
            Preview
          </button>
          {resource.checkoutUrl ? (
            <button
              type="button"
              onClick={() => onAdd(resource)}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-3 text-sm font-bold text-white transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ background: BLUE }}
            >
              {inCart ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
              {inCart ? "In cart" : "Add to cart"}
            </button>
          ) : resource.downloadUrl ? (
            <a
              href={resource.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-3 text-sm font-bold text-white transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ background: BLUE }}
            >
              <Download className="h-4 w-4" /> Download
            </a>
          ) : (
            <span
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#edf1e9] px-3 text-sm font-bold"
              style={{ color: BLUE }}
            >
              Coming soon
            </span>
          )}
        </div>
        {resource.cover && !actualCover && !resource.coverIsTemporary && (
          <p className="mt-3 text-xs" style={{ color: MUTED }}>
            Using the current resource artwork.
          </p>
        )}
      </div>
    </article>
  );
}

function ResourceDialog({
  resource,
  onClose,
  onAdd,
  inCart,
}: {
  resource: Resource | null;
  onClose: () => void;
  onAdd: (resource: Resource) => void;
  inCart: boolean;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (resource && dialog && !dialog.open) dialog.showModal();
    if (!resource && dialog?.open) dialog.close();
  }, [resource]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current?.close();
      }}
      className="max-h-[90vh] w-[min(100%-2rem,64rem)] overflow-y-auto rounded-3xl border-0 bg-white p-0 text-[#1e293b] shadow-2xl backdrop:bg-[#1e293b]/60"
      aria-labelledby="resource-dialog-title"
    >
      {resource && (
        <div>
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-black/5 bg-white/95 px-5 py-4 backdrop-blur sm:px-8">
            <span className="label-eyebrow" style={{ color: BLUE }}>
              Resource preview
            </span>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#edf1e9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              aria-label="Close preview"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-5 sm:p-8">
            <div className="grid gap-7 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
              <div className="overflow-hidden rounded-2xl bg-[#edf1e9]">
                {resource.cover ? (
                  <img
                    src={resource.cover}
                    alt={resource.coverAlt ?? `${resource.title} cover`}
                    className="max-h-[28rem] w-full object-contain p-5"
                  />
                ) : resource.previews[0] ? (
                  <img
                    src={resource.previews[0].src}
                    alt={resource.previews[0].label}
                    className="max-h-[28rem] w-full object-contain p-3"
                  />
                ) : (
                  <div
                    className="flex min-h-72 items-center justify-center p-8 text-center text-sm font-bold"
                    style={{ color: BLUE }}
                  >
                    Cover artwork coming soon
                  </div>
                )}
                {resource.coverIsTemporary && (
                  <p className="px-4 pb-4 text-xs font-semibold" style={{ color: MUTED }}>
                    Temporary cover illustration. Final product cover to be supplied.
                  </p>
                )}
              </div>
              <div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#edf1e9] px-3 py-1 text-xs font-bold">
                    {resource.category}
                  </span>
                  {resource.ageGrade && (
                    <span className="rounded-full bg-[#edf1e9] px-3 py-1 text-xs font-bold">
                      {resource.ageGrade}
                    </span>
                  )}
                  <span
                    className="rounded-full px-3 py-1 text-xs font-extrabold"
                    style={{ background: YELLOW }}
                  >
                    {resource.priceLabel}
                  </span>
                </div>
                <h2
                  id="resource-dialog-title"
                  className="mt-4 text-2xl font-black leading-tight sm:text-3xl"
                >
                  {resource.title}
                </h2>
                {resource.details.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="mt-4 text-sm leading-relaxed"
                    style={{ color: MUTED }}
                  >
                    {paragraph}
                  </p>
                ))}
                {(resource.pageCount || resource.ageGrade) && (
                  <p className="mt-4 text-sm font-bold" style={{ color: BLUE }}>
                    {[resource.pageCount ? `${resource.pageCount} pages` : null, resource.ageGrade]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                )}
                <div className="mt-6">
                  <h3 className="text-sm font-black uppercase tracking-wide">What’s included</h3>
                  <ul className="mt-3 space-y-2">
                    {resource.included.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2 text-sm leading-relaxed"
                        style={{ color: MUTED }}
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: BLUE }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <span className="text-xl font-black">
                    {resource.price === 0 ? "Free" : money(resource.price)}
                  </span>
                  {resource.checkoutUrl ? (
                    <button
                      type="button"
                      onClick={() => onAdd(resource)}
                      className="inline-flex min-h-11 items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white"
                      style={{ background: BLUE }}
                    >
                      <ShoppingCart className="h-4 w-4" /> {inCart ? "In cart" : "Add to cart"}
                    </button>
                  ) : resource.downloadUrl ? (
                    <a
                      href={resource.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white"
                      style={{ background: BLUE }}
                    >
                      <Download className="h-4 w-4" /> Download free resource
                    </a>
                  ) : (
                    <span className="text-sm font-bold">Coming soon</span>
                  )}
                </div>
              </div>
            </div>

            <section
              className="mt-10 border-t border-black/5 pt-7"
              aria-labelledby="preview-pages-heading"
            >
              <h3 id="preview-pages-heading" className="text-lg font-black">
                Sample pages
              </h3>
              {resource.previews.length > 0 ? (
                <>
                  <p className="mt-2 text-sm" style={{ color: MUTED }}>
                    {PREVIEW_NOTICE}
                  </p>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {resource.previews.map((preview) => (
                      <figure
                        key={preview.src}
                        className="overflow-hidden rounded-2xl border border-black/5 bg-[#f7f8f5]"
                      >
                        <img
                          src={preview.src}
                          alt={preview.label}
                          loading="lazy"
                          className="h-64 w-full object-contain p-2"
                        />
                        <figcaption
                          className="px-3 pb-3 text-xs font-semibold"
                          style={{ color: MUTED }}
                        >
                          {preview.label}
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </>
              ) : (
                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  {[1, 2, 3].map((number) => (
                    <div
                      key={number}
                      className="flex aspect-[4/3] flex-col items-center justify-center rounded-2xl border border-dashed border-[#1e293b]/25 bg-[#f7f8f5] p-5 text-center"
                    >
                      <BookOpen className="h-7 w-7" style={{ color: BLUE }} />
                      <span className="mt-3 text-sm font-bold" style={{ color: BLUE }}>
                        Sample preview {number}
                      </span>
                      <span className="mt-1 text-xs" style={{ color: MUTED }}>
                        Coming soon · original page pending
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      )}
    </dialog>
  );
}

function CartDrawer({
  open,
  resources,
  subtotal,
  onClose,
  onRemove,
}: {
  open: boolean;
  resources: Resource[];
  subtotal: number;
  onClose: () => void;
  onRemove: (id: string) => void;
}) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#1e293b]/50"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <aside
        className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
        aria-label="Shopping cart"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
      >
        <div className="flex items-center justify-between border-b border-black/5 px-5 py-5">
          <div>
            <p className="label-eyebrow" style={{ color: BLUE }}>
              Your selection
            </p>
            <h2 id="cart-title" className="mt-1 text-2xl font-black">
              Shopping cart
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#edf1e9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {resources.length === 0 ? (
            <div className="py-12 text-center">
              <ShoppingBag className="mx-auto h-10 w-10" style={{ color: BLUE }} />
              <p className="mt-4 font-bold">Your cart is empty</p>
              <p className="mt-2 text-sm" style={{ color: MUTED }}>
                Add a paid resource to keep it here while you browse.
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {resources.map((resource) => (
                <li key={resource.id} className="rounded-2xl border border-black/10 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold leading-snug">{resource.title}</h3>
                      <p className="mt-1 text-xs" style={{ color: MUTED }}>
                        Digital resource · quantity not applicable
                      </p>
                    </div>
                    <span className="shrink-0 font-black">{money(resource.price)}</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => onRemove(resource.id)}
                      className="inline-flex items-center gap-1 text-sm font-semibold underline underline-offset-2"
                      style={{ color: BLUE }}
                    >
                      <X className="h-3.5 w-3.5" /> Remove
                    </button>
                    <a
                      href={resource.checkoutUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-bold text-white"
                      style={{ background: BLUE }}
                    >
                      Continue to checkout <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="border-t border-black/5 p-5">
          <div className="flex items-center justify-between text-base font-bold">
            <span>Subtotal</span>
            <span>{money(subtotal)}</span>
          </div>
          <p className="mt-3 text-xs leading-relaxed" style={{ color: MUTED }}>
            Checkout is completed on each resource’s existing external payment page. Items are not
            combined into one payment.
          </p>
        </div>
      </aside>
    </div>
  );
}
