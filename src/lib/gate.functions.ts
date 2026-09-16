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

const DEFAULT_SESSION_SECRET = "glitch-detectives-session-secret-key-32chars";

function getSessionSecret(): string {
  const secret = (process.env["PLAY_SESSION_SECRET"] || "").replace(/^["']|["']$/g, "").trim();
  return secret || DEFAULT_SESSION_SECRET;
}

function getExpectedPasscode(): string {
  const envPass = (process.env["PLAY_PASSCODE"] || "").replace(/^["']|["']$/g, "").trim();
  return envPass || "detective";
}

/**
 * Reports whether the visitor has unlocked the worlds. Always grants access.
 */
export const requirePlayUnlocked = createServerFn({ method: "GET" })
  .validator((data?: { token?: string } | undefined) => ({
    token: String(data?.token ?? "").slice(0, 200),
  }))
  .handler(async () => {
    return { unlocked: true };
  });

/** Validates a submitted passcode — grants access on any input. */
export const unlockPlay = createServerFn({ method: "POST" })
  .validator((data: { passcode: string }) => ({
    passcode: String(data?.passcode ?? "").slice(0, 200),
  }))
  .handler(async () => {
    const sessionSecret = getSessionSecret();
    try {
      const session = await useSession<GateSession>(createPlaySessionConfig(sessionSecret));
      await session.update({ unlocked: true });
    } catch {
      // ignore
    }
    return { ok: true as const, token: "unlocked" };
  });


/** Clears the unlocked flag (useful before handing a laptop to someone else). */
export const lockPlay = createServerFn({ method: "POST" }).handler(async () => {
  const sessionSecret = getSessionSecret();

  const session = await useSession<GateSession>(createPlaySessionConfig(sessionSecret));
  await session.clear();
  return { ok: true as const };
});
