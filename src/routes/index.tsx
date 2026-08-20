import { createFileRoute, Link } from "@tanstack/react-router";
import { Peg } from "@/components/mastermind/Peg";
import { PEG_COLORS } from "@/lib/mastermind";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mastermind — Crack the Code or Set It" },
      {
        name: "description",
        content:
          "Play Mastermind online: break a secret 4-peg code in 10 rounds, or set a code and watch the solver hunt it down.",
      },
      { property: "og:title", content: "Mastermind — Crack the Code or Set It" },
      {
        property: "og:description",
        content:
          "Play Mastermind online: break a secret 4-peg code in 10 rounds, or set a code and watch the solver hunt it down.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-10 px-6 py-16 text-center">
      <div className="flex gap-2">
        {PEG_COLORS.map((c) => (
          <Peg key={c} color={c} size="md" />
        ))}
      </div>
      <div className="space-y-4">
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">Mastermind</h1>
        <p className="mx-auto max-w-lg text-muted-foreground">
          Four slots, eight colours, repeats allowed, ten rounds. Break the code — or set one and
          see if the machine can break yours.
        </p>
      </div>
      <div className="grid w-full gap-4 sm:grid-cols-2">
        <Link
          to="/codebreaker"
          className="group rounded-2xl border border-border bg-card p-6 text-left transition-colors hover:border-primary"
        >
          <h2 className="text-xl font-semibold">Play as Codebreaker</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The computer hides a secret code. You get 10 guesses and feedback after each one.
          </p>
          <span className="mt-4 inline-block text-sm font-medium text-primary">Start guessing →</span>
        </Link>
        <Link
          to="/codemaker"
          className="group rounded-2xl border border-border bg-card p-6 text-left transition-colors hover:border-primary"
        >
          <h2 className="text-xl font-semibold">Play as Codemaker</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            You set the secret code. The solver has 10 rounds to deduce it.
          </p>
          <span className="mt-4 inline-block text-sm font-medium text-primary">Set a code →</span>
        </Link>
      </div>
      <section className="w-full rounded-2xl bg-board p-6 text-left text-sm text-muted-foreground">
        <h3 className="mb-2 font-semibold text-foreground">Feedback key</h3>
        <p>
          <span className="mr-2 inline-block size-3 rounded-full bg-foreground align-middle" /> right
          colour, right position ·{" "}
          <span className="mx-2 inline-block size-3 rounded-full ring-2 ring-inset ring-foreground align-middle" />{" "}
          right colour, wrong position
        </p>
      </section>
    </main>
  );
}
