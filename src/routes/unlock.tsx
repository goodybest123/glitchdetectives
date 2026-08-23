/**
 * `/unlock` — passcode screen shown to anyone who tries to open the detective
 * worlds while they're in private testing. On success the server sets an
 * encrypted session cookie and we navigate into `/play`.
 */
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Lock, ArrowRight, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { unlockPlay } from "@/lib/gate.functions";

export const Route = createFileRoute("/unlock")({
  head: () => ({
    meta: [
      { title: "Detective HQ — Private Testing | Glitch Detectives" },
      {
        name: "description",
        content:
          "The Glitch Detectives interactive worlds are in private testing. Enter your access passcode to continue, or explore our printable missions instead.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Detective HQ — Private Testing" },
      {
        property: "og:description",
        content:
          "The Glitch Detectives interactive worlds are in private testing. Printable missions are available now.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: UnlockPage,
});

function UnlockPage() {
  const router = useRouter();
  const unlock = useServerFn(unlockPlay);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(false);
    const passcode = String(new FormData(e.currentTarget).get("passcode") ?? "");
    try {
      const { ok } = await unlock({ data: { passcode } });
      if (ok) {
        await router.navigate({ to: "/play" });
        return;
      }
      setError(true);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-[70vh] bg-[var(--color-bg-light)] flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md rounded-3xl bg-white border border-black/5 shadow-sm p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-[var(--color-brand-yellow)] mx-auto flex items-center justify-center">
          <Lock className="w-6 h-6 text-[var(--color-brand-blue)]" strokeWidth={2.5} />
        </div>
        <h1 className="heading-black uppercase text-2xl sm:text-3xl text-[var(--color-brand-blue)] mt-5">
          Detective HQ is in private testing
        </h1>
        <p className="mt-3 text-sm text-[var(--color-brand-blue)]/70 leading-relaxed">
          The interactive worlds aren't open to the public yet. If you have an access
          passcode, enter it below.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-3 text-left">
          <label
            htmlFor="passcode"
            className="block text-xs font-bold uppercase tracking-widest text-[var(--color-brand-blue)]/70"
          >
            Access passcode
          </label>
          <input
            id="passcode"
            name="passcode"
            type="password"
            autoComplete="current-password"
            required
            className="w-full rounded-2xl border border-black/10 px-4 py-3 text-[var(--color-brand-blue)] outline-none focus:border-[var(--color-brand-blue)]"
            placeholder="••••••••"
          />
          {error && (
            <p className="text-sm text-red-600">
              That passcode didn't work. Please try again.
            </p>
          )}
          <button
            type="submit"
            disabled={busy}
            className="w-full px-6 py-3 rounded-full bg-[var(--color-brand-blue)] text-white font-bold uppercase tracking-wider text-sm inline-flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform disabled:opacity-60"
          >
            {busy ? "Checking…" : "Enter HQ"} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="mt-6 text-sm text-[var(--color-brand-blue)]/70">
          No passcode?{" "}
          <Link to="/printables" className="font-bold underline">
            Explore our printable missions
          </Link>
          .
        </p>

        <Link
          to="/"
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-full border border-black/10 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--color-brand-blue)] hover:bg-[var(--color-bg-light)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>

      </div>
    </main>
  );
}
