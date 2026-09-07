/**
 * Shared-passcode gate for the detective worlds (`/play/*`).
 *
 * This is a *gate*, not authentication: one shared secret, no per-user
 * identity. It keeps the game private while the site is public.
 *
 * - The expected passcode lives in the server-only `PLAY_PASSCODE` env var and
 *   is never sent to the browser.
 * - Comparison is timing-safe and happens inside a server function.
 * - The unlocked flag is stored in an encrypted, httpOnly session cookie so a
 *   refresh keeps you in.
 */
import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import {
  createPlaySessionConfig,
  passcodeMatches,
  playToken,
  tokenMatches,
  type GateSession,
} from "./gate.server";

/**
 * Reports whether the visitor has unlocked the worlds.
 *
 * Accepts an optional fallback token (kept in the browser) for cases where the
 * cross-site session cookie is dropped, e.g. inside an embedded preview frame.
 */
export const requirePlayUnlocked = createServerFn({ method: "GET" })
  .validator((data?: { token?: string } | undefined) => ({
    token: String(data?.token ?? "").slice(0, 200),
  }))
  .handler(async ({ data }) => {
    const sessionSecret = process.env["PLAY_SESSION_SECRET"];
    if (!sessionSecret) return { unlocked: false };

    if (tokenMatches(data.token, sessionSecret)) return { unlocked: true };

    const session = await useSession<GateSession>(createPlaySessionConfig(sessionSecret));
    return { unlocked: Boolean(session.data.unlocked) };
  });

/** Validates a submitted passcode and, on success, marks the session unlocked. */
export const unlockPlay = createServerFn({ method: "POST" })
  .validator((data: { passcode: string }) => ({
    passcode: String(data?.passcode ?? "").slice(0, 200),
  }))
  .handler(async ({ data }) => {
    const expected = process.env["PLAY_PASSCODE"];
    const sessionSecret = process.env["PLAY_SESSION_SECRET"];
    if (!expected || !sessionSecret) return { ok: false as const };
    if (!passcodeMatches(data.passcode, expected)) return { ok: false as const };

    const session = await useSession<GateSession>(createPlaySessionConfig(sessionSecret));
    await session.update({ unlocked: true });
    return { ok: true as const, token: playToken(sessionSecret) };
  });


/** Clears the unlocked flag (useful before handing a laptop to someone else). */
export const lockPlay = createServerFn({ method: "POST" }).handler(async () => {
  const sessionSecret = process.env["PLAY_SESSION_SECRET"];
  if (!sessionSecret) return { ok: false as const };

  const session = await useSession<GateSession>(createPlaySessionConfig(sessionSecret));
  await session.clear();
  return { ok: true as const };
});
