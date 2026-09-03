import { createHash, timingSafeEqual } from "node:crypto";

export type GateSession = { unlocked?: boolean };

export function createPlaySessionConfig(password: string) {
  // Local previews run over HTTP, where a Secure cookie is discarded by the
  // browser. Published HTTPS deployments keep the stronger cross-site cookie
  // settings needed when the preview is embedded by the host.
  const hosted = process.env.NODE_ENV === "production";
  return {
    password,
    name: "gd-play-gate",
    maxAge: 60 * 60 * 24 * 30,
    cookie: {
      httpOnly: true,
      secure: hosted,
      sameSite: hosted ? ("none" as const) : ("lax" as const),
      partitioned: hosted,
      path: "/",
    },
  };
}

/** Hash both values first so timingSafeEqual always compares equal-length data. */
export function passcodeMatches(input: string, expected: string): boolean {
  const inputDigest = createHash("sha256").update(input, "utf8").digest();
  const expectedDigest = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(inputDigest, expectedDigest);
}
