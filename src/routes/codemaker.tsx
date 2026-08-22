import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ColorPalette } from "@/components/mastermind/Peg";
import { GuessRow } from "@/components/mastermind/GuessRow";
import {
  CODE_LENGTH,
  MAX_ROUNDS,
  scoreGuess,
  type Code,
  type Feedback,
  type GuessGenerator,
  type PegColor,
} from "@/lib/mastermind";
import { ConsistentSolver } from "@/lib/solver";

export const Route = createFileRoute("/codemaker")({
  head: () => ({
    meta: [
      { title: "Codemaker — Set a Code for the Solver | Mastermind" },
      {
        name: "description",
        content:
          "Set a secret 4-peg code and watch the Mastermind solver try to deduce it within 10 rounds.",
      },
      { property: "og:title", content: "Codemaker — Set a Code for the Solver" },
      {
        property: "og:description",
        content: "Set a secret 4-peg code and see if the solver can crack it in 10 rounds.",
      },
    ],
  }),
  component: Codemaker,
});

type Row = { guess: Code; feedback: Feedback };

function Codemaker() {
  const [secret, setSecret] = useState<(PegColor | null)[]>(Array(CODE_LENGTH).fill(null));
  const [slot, setSlot] = useState(0);
  const [phase, setPhase] = useState<"setup" | "playing" | "won" | "lost">("setup");
  const [rows, setRows] = useState<Row[]>([]);
  const solverRef = useRef<GuessGenerator | null>(null);

  const pick = (c: PegColor) => {
    if (phase !== "setup") return;
    setSecret((prev) => prev.map((p, i) => (i === slot ? c : p)));
    setSlot((s) => (s + 1) % CODE_LENGTH);
  };

  const start = () => {
    if (secret.some((c) => c === null)) return;
    solverRef.current = new ConsistentSolver();
    setRows([]);
    setPhase("playing");
  };

  const reset = () => {
    solverRef.current = null;
    setSecret(Array(CODE_LENGTH).fill(null));
    setSlot(0);
    setRows([]);
    setPhase("setup");
  };

  // Drive the solver: one guess per tick while the game is live.
  useEffect(() => {
    if (phase !== "playing") return;
    const solver = solverRef.current;
    if (!solver) return;
    const timer = setTimeout(() => {
      const guess = solver.generateGuess();
      const feedback = scoreGuess(secret as Code, guess);
      solver.setResult(guess, feedback);
      setRows((prev) => {
        const next = [...prev, { guess, feedback }];
        if (feedback.exact === CODE_LENGTH) setPhase("won");
        else if (next.length >= MAX_ROUNDS) setPhase("lost");
        return next;
      });
    }, 850);
    return () => clearTimeout(timer);
  }, [phase, rows, secret]);

  const ready = secret.every((c) => c !== null);

  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Codemaker</h1>
          <p className="text-sm text-muted-foreground">
            {phase === "setup"
              ? "Set your secret code"
              : `Round ${Math.min(rows.length + (phase === "playing" ? 1 : 0), MAX_ROUNDS)} of ${MAX_ROUNDS}`}
          </p>
        </div>
        <Link to="/" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
          ← Menu
        </Link>
      </header>

      <section className="rounded-2xl bg-board p-4 shadow-lg">
        <div className="mb-3">
          <p className="mb-2 px-3 text-xs uppercase tracking-widest text-muted-foreground">
            Your secret code
          </p>
          <GuessRow
            index={0}
            code={secret}
            active={phase === "setup"}
            onSlotClick={phase === "setup" ? setSlot : undefined}
            activeSlot={slot}
          />
        </div>

        <div className="space-y-2">
          {rows.length === 0 && phase !== "setup" && (
            <p className="px-3 py-4 text-center text-sm text-muted-foreground">Thinking…</p>
          )}
          {rows.map((r, i) => (
            <GuessRow key={i} index={i + 1} code={r.guess} feedback={r.feedback} />
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-board p-4 text-sm text-muted-foreground">
        <h3 className="mb-2 font-semibold text-foreground">Feedback key</h3>
        <p>
          <span className="mr-2 inline-block size-3 rounded-full bg-foreground align-middle" /> right
          colour, right position ·{" "}
          <span className="mx-2 inline-block size-3 rounded-full ring-2 ring-inset ring-foreground align-middle" />{" "}
          right colour, wrong position
        </p>
      </section>

      {phase === "setup" && (
        <div className="mt-6 space-y-4">
          <ColorPalette onPick={pick} />
          <div className="flex justify-center gap-3">
            <Button variant="secondary" onClick={() => setSecret(Array(CODE_LENGTH).fill(null))}>
              Clear
            </Button>
            <Button onClick={start} disabled={!ready}>
              Challenge the solver
            </Button>
          </div>
        </div>
      )}

      {(phase === "won" || phase === "lost") && (
        <div className="mt-6 rounded-2xl border border-border bg-card p-6 text-center">
          <h2 className="text-2xl font-bold">
            {phase === "won" ? "The solver cracked your code" : "Your code survived! 🎉"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {phase === "won"
              ? `It needed ${rows.length} ${rows.length === 1 ? "round" : "rounds"}.`
              : `10 rounds gone and it never found the code — you win.`}
          </p>
          <Button className="mt-4" onClick={reset}>
            New code
          </Button>
        </div>
      )}
    </main>
  );
}
