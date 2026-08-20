export const PEG_COLORS = [
  "white",
  "blue",
  "green",
  "yellow",
  "orange",
  "silver",
  "red",
  "pink",
] as const;

export type PegColor = (typeof PEG_COLORS)[number];
export type Code = PegColor[];

export const CODE_LENGTH = 4;
export const MAX_ROUNDS = 10;

export interface Feedback {
  /** correct colour, correct position */
  exact: number;
  /** correct colour, wrong position */
  partial: number;
}

export function scoreGuess(secret: Code, guess: Code): Feedback {
  let exact = 0;
  const secretRest: PegColor[] = [];
  const guessRest: PegColor[] = [];

  for (let i = 0; i < secret.length; i++) {
    if (secret[i] === guess[i]) exact++;
    else {
      secretRest.push(secret[i]!);
      guessRest.push(guess[i]!);
    }
  }

  let partial = 0;
  const pool = [...secretRest];
  for (const g of guessRest) {
    const idx = pool.indexOf(g);
    if (idx !== -1) {
      partial++;
      pool.splice(idx, 1);
    }
  }

  return { exact, partial };
}

export function randomCode(): Code {
  return Array.from(
    { length: CODE_LENGTH },
    () => PEG_COLORS[Math.floor(Math.random() * PEG_COLORS.length)]!,
  );
}

export function allCodes(): Code[] {
  let codes: Code[] = [[]];
  for (let i = 0; i < CODE_LENGTH; i++) {
    const next: Code[] = [];
    for (const c of codes) for (const color of PEG_COLORS) next.push([...c, color]);
    codes = next;
  }
  return codes;
}

/**
 * Interface for a code-guessing engine. Plug in any implementation:
 *  - setResult(): report the feedback for the guess just made
 *  - generateGuess(): produce the next guess
 */
export interface GuessGenerator {
  setResult(guess: Code, feedback: Feedback): void;
  generateGuess(): Code;
}
