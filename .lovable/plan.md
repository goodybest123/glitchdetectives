## Goal

Create a dedicated **/printables** route — "The Glitch Detective Printables Library" — designed with calm whitespace, soft pastels, and neuro-inclusive typography. It links into existing nav, and a follow-up detail route for the Fractions Level 1 workbook is stubbed.

## Design language

- **Palette**: anchor on existing brand tokens (`--color-bg-mint` `#e8f9f5`, `--color-brand-blue` `#1e293b`, `--color-brand-yellow`, `--color-brand-mint`) plus per-category soft pastels (mint, peach, lavender, sky, butter, blush). All low-saturation, high-contrast text.
- **Type**: existing Space Grotesk display, generous line-height, no italics, max line-length ~64ch.
- **Spacing**: roomy `py-24`, `gap-8`, rounded-3xl cards, subtle borders (`border-black/5`), soft shadows only.
- **No motion overload**: gentle hover lift (translate-y / scale 1.02 max), no parallax or autoplay.

## Page structure (`src/routes/printables.tsx`)

```text
┌──────────────────────────────────────────────────┐
│ <Navbar /> (existing landing navbar, reused)     │
├──────────────────────────────────────────────────┤
│ HERO  (soft mint bg)                             │
│   eyebrow: "Printables Library"                  │
│   H1: The Glitch Detective Printables Library    │
│   subtitle: hands-on, off-screen reasoning…      │
│   small trust row: low-screen · printable · K-6  │
├──────────────────────────────────────────────────┤
│ SPOTLIGHT  (wide banner, white card on mint)     │
│   ◤ NEW RELEASE ◢ pill                            │
│   left: workbook-cover placeholder (3:4, yellow  │
│         frame, magnifier + "F1" mark)            │
│   right: "Fractions Level 1" title + 2-line      │
│         description + meta chips (Grade 1 · 12   │
│         pages · PDF) + primary CTA:              │
│         [ Investigate Now → ]  -> /printables/   │
│                                   fractions-l1   │
├──────────────────────────────────────────────────┤
│ CATEGORY GRID (3 cols on lg, 2 on sm, 1 mobile)  │
│   5 cards: Fractions, Addition, Geometry,        │
│            Decimals, Place Value                 │
│   each: soft pastel bg, minimalist lucide icon   │
│         in a rounded square, bold title,         │
│         one-line descriptor, count chip          │
│         ("8 printables")                         │
├──────────────────────────────────────────────────┤
│ BENEFITS ROW (3 cols, white bg)                  │
│   ☼ Low Cognitive Load                            │
│   ☻ Sparks Conversation                           │
│   ✦ Builds Confidence                             │
│   icon in pastel circle, title, short line       │
├──────────────────────────────────────────────────┤
│ <Footer /> (reused from landing sections)        │
└──────────────────────────────────────────────────┘
```

## Files

**New**
- `src/routes/printables.tsx` — TanStack route with full `head()` meta (title, description, og:title, og:description), composes the sections below.
- `src/components/printables/Hero.tsx`
- `src/components/printables/SpotlightBanner.tsx` — placeholder workbook cover built with CSS (no image gen): yellow frame, magnifier icon, "FRACTIONS · LEVEL 1" stamp, "F1" mono mark.
- `src/components/printables/CategoryGrid.tsx` — typed `Category[]` array with 5 entries.
- `src/components/printables/BenefitsRow.tsx`
- `src/routes/printables.fractions-l1.tsx` — minimal stub detail page so the spotlight CTA resolves (TanStack requires the route file to exist before `<Link to>`). Has its own head() meta and a "Coming soon — preview PDF" placeholder block.

**Edited**
- `src/components/landing/Navbar.tsx` — change the "Printables" nav link from `#printables` hash to a `<Link to="/printables">` so the library is discoverable. Keep all other links as hash anchors.

**Not touched**
- `src/components/landing/sections.tsx` Printables section stays (acts as a teaser); no copy changes.
- `src/routeTree.gen.ts` (auto-regenerated).

## Categories (final list)

| key | icon (lucide) | pastel bg |
|---|---|---|
| Fractions | `PieChart` | mint `#e8f9f5` |
| Addition | `Plus` | butter `#fff4d6` |
| Geometry | `Shapes` | lavender `#ece8ff` |
| Decimals | `CircleDot` | sky `#e3f1ff` |
| Place Value | `Layers` | blush `#ffe8ee` |

Cards are clickable but currently route to a soft "Coming soon" state via in-page disabled styling (cursor-default, "Coming soon" chip) — only the Fractions card links through to the spotlight detail page to keep one live path.

## Benefits row

| icon | title | line |
|---|---|---|
| `Brain` | Low Cognitive Load | Calm layouts, one task per page, no distractions. |
| `MessageCircle` | Sparks Conversation | Each sheet ends with a "talk it through" prompt. |
| `Sparkles` | Builds Confidence | Small wins, visible progress, no red pens. |

## Out of scope

- Actual PDF assets / downloads.
- Filtering, search, pagination.
- Backend / progress tracking.
- Workbook detail page content beyond a polite stub.
