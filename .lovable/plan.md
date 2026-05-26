Fix the navbar so clicking "Printables" (and the logo / section links) actually navigates between pages instead of just appending a hash to the current URL.

## Problem

The navbar in `src/components/landing/Navbar.tsx` uses plain `<a>` tags:
- Logo → `href="#home"`
- Home / How It Works / Worlds → `href="#home" | "#how-it-works" | "#worlds"`
- Printables → `href="/printables"`

When the user is already on `/printables`, hash links only mutate the hash on the current URL (visible in the current route: `/printables#home`) — they never go back to the landing page. The Printables link itself works but triggers a full page reload because it's not a TanStack `<Link>`.

## Fix (single file: `src/components/landing/Navbar.tsx`)

1. Logo: replace `<a href="#home">` with `<Link to="/" hash="home">`.
2. Section links (Home / How It Works / Worlds): replace each `<a href="#…">` with `<Link to="/" hash="…">`. From `/printables` this routes back to `/` and scrolls to the right section; from `/` it behaves the same as today.
3. Printables link: replace `<a href="/printables">` with `<Link to="/printables">` for client-side navigation, preloading, and active state.
4. Add `activeProps={{ className: "text-[var(--color-brand-blue)]" }}` to the Printables link so it's visually highlighted when the user is on `/printables`.

## Not changing

- `CategoryGrid`, the `/printables` page content, the Fractions tab / learning path — these already render correctly on `/printables`.
- Landing page section IDs.
- Route tree, routes, or any other component.
