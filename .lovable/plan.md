# Favicon + private access to the game worlds

## 1. Favicon

Create a brand favicon: a yellow circle with the blue magnifying glass from the navbar logo, matching the site's brand colours.

- Generate a square icon asset, downscale it to `public/favicon.png`.
- Point the root route at it (replacing the default Lovable icon) and delete `public/favicon.ico` so no stale icon is served.

## 2. Passcode-locked game worlds

Everything under `/play` (world picker, all six cases, the report) becomes gated behind a secret passcode that only you know.

How it behaves:

- A visitor going to `/play` (or any case link) sees a friendly locked screen: brand-styled "Detective HQ is in private testing" card with a passcode field.
- Entering the correct code unlocks the worlds and remembers it in that browser, so you never re-type it on your own devices.
- Wrong code shows a gentle error; no hint about the correct value.
- A small "lock again" link lets you clear access for demos.
- Public CTAs ("Try for Free", "Try Free", "Try the Game", footer/product links) stay exactly where they are and simply land on the locked screen.

## Technical details

- Add `src/lib/playAccess.ts`: reads/writes a `localStorage` flag, compares the entered code against `import.meta.env.VITE_PLAY_PASSCODE` (with a default fallback code if the env var is unset).
- Convert `src/routes/play.tsx` from a bare `<Outlet />` into the gate: render `<PlayLocked />` unless unlocked, otherwise `<Outlet />`. Gating at the layout route covers every nested play route automatically.
- Gate state is read in `useEffect` / after hydration to avoid SSR mismatch; render nothing (or a neutral shell) on the first paint.
- New component `src/components/play/PlayLocked.tsx` for the locked card, styled with existing brand tokens.
- Favicon: `generate_image` -> `magick` resize to 64x64 -> `public/favicon.png`; update `links` in `src/routes/__root.tsx`; `rm public/favicon.ico`.

Note on security: this is a client-side gate — good for keeping the worlds out of public sight when you share the .com link, but not a hardened auth wall (someone determined could inspect the bundle). If you later want it truly locked down, an account-based admin login is the upgrade path.

## Needed from you

The passcode you want to use — otherwise I'll set a placeholder you can change.
