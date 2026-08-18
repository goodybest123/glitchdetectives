# Contributing

Small project, small process. The point of this doc is that any contributor knows the rules before they open a PR.

## Branching

- `main` — always deployable. Protected. No direct pushes.
- `feat/<short-slug>` — new user-facing features (`feat/case-07-decimals`).
- `fix/<short-slug>` — bug fixes (`fix/report-empty-state`).
- `docs/<short-slug>` — docs-only changes.
- `chore/<short-slug>` — deps, tooling, refactors with no behaviour change.

One PR per branch. Rebase on `main` before merging; prefer squash-merge so `main` reads as one commit per feature.

## Commit messages (Conventional Commits)

```
feat: add case 07 decimals
fix(report): render empty state when no cases solved
docs(architecture): document AI grading fallback path
chore(deps): bump tanstack/react-router to 1.x
```

Types we use: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`. Keep the subject under 72 chars. Body optional; explain **why**, not what.

## PR checklist

Before you request review:

- [ ] `bun run typecheck` (or your local equivalent) passes
- [ ] The app builds (`bun run build`)
- [ ] For any UI change, a screenshot in the PR description
- [ ] Docs updated if you changed a public boundary (routes, server function shape, storage key)
- [ ] No secrets in the diff; env vars documented in the README

## Local development

```bash
bun install
bun dev            # http://localhost:8080
```

- Route files live in `src/routes/`. Adding a file regenerates `routeTree.gen.ts` automatically — do not edit that file by hand.
- Server functions must live in `*.functions.ts` (client-safe path) or `*.server.ts` (server-only). Never import a `*.server.ts` from a route file directly; load it inside the handler.
- The AI grader reads `LOVABLE_API_KEY` at handler time. Missing key = the grader throws; the UI degrades gracefully to "ZED-4 couldn't grade this right now."

## Testing a single case route

```
http://localhost:8080/play/case-03
```

To reset the on-device report while iterating:

```js
// paste in the browser console
localStorage.removeItem("gd:report:v4");
location.reload();
```

## When in doubt

Read `docs/ARCHITECTURE.md` first, then open an issue with the question. Small clarifying issues are welcome — they usually turn into doc PRs.
