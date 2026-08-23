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
import { redirect } from "@tanstack/react-router";
import { createHash, timingSafeEqual } from "node:crypto";

type GateSession = { unlocked?: boolean };

function sessionConfig() {
  return {
    password: process.env["PLAY_SESSION_SECRET"]!,
    name: "gd-play-gate",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "lax" as const,
      path: "/",
    },
  };
}

/** Hash both sides so `timingSafeEqual` gets equal-length buffers. */
function passcodeMatches(input: string, expected: string): boolean {
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

/** Throws a redirect to `/unlock` unless the visitor has unlocked the worlds. */
export const requirePlayUnlocked = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useSession<GateSession>(sessionConfig());
  if (!session.data.unlocked) throw redirect({ to: "/unlock" });
  return { unlocked: true as const };
});

/** Validates a submitted passcode and, on success, marks the session unlocked. */
export const unlockPlay = createServerFn({ method: "POST" })
  .inputValidator((data: { passcode: string }) => ({
    passcode: String(data?.passcode ?? "").slice(0, 200),
  }))
  .handler(async ({ data }) => {
    const expected = process.env["PLAY_PASSCODE"];
    if (!expected) return { ok: false as const };
    if (!passcodeMatches(data.passcode, expected)) return { ok: false as const };

    const session = await useSession<GateSession>(sessionConfig());
    await session.update({ unlocked: true });
    return { ok: true as const };
  });

/** Clears the unlocked flag (useful before handing a laptop to someone else). */
export const lockPlay = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<GateSession>(sessionConfig());
  await session.clear();
  return { ok: true as const };
});
