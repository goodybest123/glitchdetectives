import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/play")({
  head: () => ({
    meta: [
      { title: "Fraction Factory" },
      { name: "description", content: "Fraction Factory — coming soon." },
    ],
  }),
  component: PlayPage,
});

function PlayPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="label-eyebrow text-cyan-300/80">Fraction Factory</p>
      <h1 className="text-3xl font-bold">Starting from scratch</h1>
      <p className="max-w-md text-muted-foreground">
        This world is empty. Tell Lovable what to build next.
      </p>
      <Link to="/" className="underline text-sm">Back home</Link>
    </main>
  );
}
