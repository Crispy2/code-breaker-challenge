import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ColorPalette, Peg } from "@/components/mastermind/Peg";
import { GuessRow } from "@/components/mastermind/GuessRow";
import {
  CODE_LENGTH,
  MAX_ROUNDS,
  randomCode,
  scoreGuess,
  type Code,
  type Feedback,
  type PegColor,
} from "@/lib/mastermind";

export const Route = createFileRoute("/codebreaker")({
  head: () => ({
    meta: [
      { title: "Codebreaker — Crack the Secret Code | Mastermind" },
      {
        name: "description",
        content:
          "Guess the hidden 4-peg colour code in 10 rounds. Feedback after every guess tells you how close you are.",
      },
      { property: "og:title", content: "Codebreaker — Crack the Secret Code" },
      {
        property: "og:description",
        content: "Guess the hidden 4-peg colour code in 10 rounds of Mastermind.",
      },
    ],
  }),
  component: Codebreaker,
});

type Row = { guess: Code; feedback: Feedback };

function Codebreaker() {
  const [secret, setSecret] = useState<Code | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [current, setCurrent] = useState<(PegColor | null)[]>(Array(CODE_LENGTH).fill(null));
  const [slot, setSlot] = useState(0);
  const [status, setStatus] = useState<"playing" | "won" | "lost">("playing");

  const reset = useCallback(() => {
    setSecret(randomCode());
    setRows([]);
    setCurrent(Array(CODE_LENGTH).fill(null));
    setSlot(0);
    setStatus("playing");
  }, []);

  useEffect(() => {
    reset();
  }, [reset]);

  const pick = (c: PegColor) => {
    if (status !== "playing") return;
    setCurrent((prev) => prev.map((p, i) => (i === slot ? c : p)));
    setSlot((s) => (s + 1) % CODE_LENGTH);
  };

  const submit = () => {
    if (!secret || status !== "playing") return;
    if (current.some((c) => c === null)) return;
    const guess = current as Code;
    const feedback = scoreGuess(secret, guess);
    const next = [...rows, { guess, feedback }];
    setRows(next);
    setCurrent(Array(CODE_LENGTH).fill(null));
    setSlot(0);
    if (feedback.exact === CODE_LENGTH) setStatus("won");
    else if (next.length >= MAX_ROUNDS) setStatus("lost");
  };

  const ready = current.every((c) => c !== null);

  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Codebreaker</h1>
          <p className="text-sm text-muted-foreground">
            Round {Math.min(rows.length + 1, MAX_ROUNDS)} of {MAX_ROUNDS}
          </p>
        </div>
        <Link to="/" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
          ← Menu
        </Link>
      </header>

      <section className="rounded-2xl bg-board p-4 shadow-lg">
        <div className="mb-3 flex items-center justify-between rounded-xl bg-board-slot/60 px-3 py-2">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            Secret code
          </span>
          <div className="flex gap-2">
            {status === "playing" || !secret
              ? Array.from({ length: CODE_LENGTH }, (_, i) => (
                  <span
                    key={i}
                    className="grid size-9 place-items-center rounded-full bg-board-slot text-muted-foreground ring-1 ring-inset ring-border"
                  >
                    ?
                  </span>
                ))
              : secret.map((c, i) => <Peg key={i} color={c} />)}
          </div>
        </div>

        <div className="space-y-2">
          {rows.map((r, i) => (
            <GuessRow key={i} index={i + 1} code={r.guess} feedback={r.feedback} />
          ))}
          {status === "playing" && rows.length < MAX_ROUNDS && (
            <GuessRow
              index={rows.length + 1}
              code={current}
              active
              onSlotClick={setSlot}
              activeSlot={slot}
            />
          )}
        </div>
      </section>

      {status === "playing" ? (
        <div className="mt-6 space-y-4">
          <ColorPalette onPick={pick} />
          <div className="flex justify-center gap-3">
            <Button variant="secondary" onClick={() => setCurrent(Array(CODE_LENGTH).fill(null))}>
              Clear
            </Button>
            <Button onClick={submit} disabled={!ready}>
              Submit guess
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-border bg-card p-6 text-center">
          <h2 className="text-2xl font-bold">
            {status === "won" ? "You cracked it! 🎉" : "Out of rounds"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {status === "won"
              ? `Solved in ${rows.length} ${rows.length === 1 ? "round" : "rounds"}.`
              : "The codemaker wins this one — the secret is revealed above."}
          </p>
          <Button className="mt-4" onClick={reset}>
            Play again
          </Button>
        </div>
      )}
    </main>
  );
}
