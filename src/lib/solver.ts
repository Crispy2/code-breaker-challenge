import {
  allCodes,
  scoreGuess,
  type Code,
  type Feedback,
  type GuessGenerator,
} from "./mastermind";

/**
 * Default GuessGenerator: keeps the set of codes still consistent with all
 * feedback received, and guesses one of them.
 */
export class ConsistentSolver implements GuessGenerator {
  private candidates: Code[] = allCodes();
  private first = true;

  setResult(guess: Code, feedback: Feedback): void {
    this.candidates = this.candidates.filter((c) => {
      const s = scoreGuess(c, guess);
      return s.exact === feedback.exact && s.partial === feedback.partial;
    });
  }

  generateGuess(): Code {
    if (this.first) {
      this.first = false;
      return ["white", "white", "blue", "blue"];
    }
    if (this.candidates.length === 0) return ["white", "blue", "green", "yellow"];
    return this.candidates[Math.floor(Math.random() * this.candidates.length)];
  }

  get remaining(): number {
    return this.candidates.length;
  }
}
