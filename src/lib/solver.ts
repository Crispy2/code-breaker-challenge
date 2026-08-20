import {
  allCodes,
  scoreGuess,
  CODE_LENGTH,
  PEG_COLORS,
  type Code,
  type Feedback,
  type GuessGenerator,
} from "./mastermind";

const COLOR_INDEX = new Map(PEG_COLORS.map((c, i) => [c, i] as const));
const NUM_COLORS = PEG_COLORS.length;
/** exact * (CODE_LENGTH + 1) + partial, so scores fit a small dense range */
const SCORE_SLOTS = (CODE_LENGTH + 1) * (CODE_LENGTH + 1);

function encode(code: Code): Uint8Array {
  const out = new Uint8Array(CODE_LENGTH);
  for (let i = 0; i < CODE_LENGTH; i++) out[i] = COLOR_INDEX.get(code[i]!)!;
  return out;
}

/** Fast integer feedback key for two encoded codes. */
function scoreKey(a: Uint8Array, b: Uint8Array): number {
  let exact = 0;
  const aCount = new Uint8Array(NUM_COLORS);
  const bCount = new Uint8Array(NUM_COLORS);
  for (let i = 0; i < CODE_LENGTH; i++) {
    const x = a[i]!;
    const y = b[i]!;
    if (x === y) exact++;
    else {
      aCount[x]!++;
      bCount[y]!++;
    }
  }
  let partial = 0;
  for (let c = 0; c < NUM_COLORS; c++) {
    partial += Math.min(aCount[c]!, bCount[c]!);
  }
  return exact * (CODE_LENGTH + 1) + partial;
}

/**
 * Information-maximising GuessGenerator.
 *
 * Keeps the pool of codes still consistent with every piece of feedback, then
 * picks the guess whose feedback partitions that pool most informatively
 * (maximum Shannon entropy over the feedback distribution). Ties are broken in
 * favour of guesses that could themselves be the secret, and then by the
 * smallest worst-case partition (minimax), so the pool shrinks as fast as
 * possible each round.
 */
export class ConsistentSolver implements GuessGenerator {
  private candidates: Code[] = allCodes();
  private encodedCandidates: Uint8Array[] = this.candidates.map(encode);
  private readonly universe: Code[] = allCodes();
  private readonly encodedUniverse: Uint8Array[] = this.universe.map(encode);
  private first = true;

  setResult(guess: Code, feedback: Feedback): void {
    const kept: Code[] = [];
    const keptEnc: Uint8Array[] = [];
    const g = encode(guess);
    const target = feedback.exact * (CODE_LENGTH + 1) + feedback.partial;
    for (let i = 0; i < this.candidates.length; i++) {
      if (scoreKey(this.encodedCandidates[i]!, g) === target) {
        kept.push(this.candidates[i]!);
        keptEnc.push(this.encodedCandidates[i]!);
      }
    }
    this.candidates = kept;
    this.encodedCandidates = keptEnc;
  }

  generateGuess(): Code {
    // Canonical strong opener: exhaustive search on the full 4096-code pool
    // gives no better information than a two-colour split on round one.
    if (this.first) {
      this.first = false;
      return ["white", "white", "blue", "blue"];
    }

    const n = this.encodedCandidates.length;
    if (n === 0) return ["white", "blue", "green", "yellow"];
    if (n <= 2) return this.candidates[0]!;

    // Once the pool is small, any consistent guess wins on the next turn.
    const candidateSet = new Set(this.candidates.map((c) => c.join("|")));

    // Search the whole code space while it is cheap enough; otherwise limit
    // the search to codes that are still possible secrets.
    const useFullSpace = n * this.encodedUniverse.length <= 3_000_000;
    const pool = useFullSpace ? this.encodedUniverse : this.encodedCandidates;
    const poolCodes = useFullSpace ? this.universe : this.candidates;

    const buckets = new Int32Array(SCORE_SLOTS);
    let bestIdx = 0;
    let bestEntropy = -1;
    let bestWorst = Infinity;
    let bestIsCandidate = false;

    for (let g = 0; g < pool.length; g++) {
      buckets.fill(0);
      const guess = pool[g]!;
      for (let i = 0; i < n; i++) {
        buckets[scoreKey(this.encodedCandidates[i]!, guess)]!++;
      }

      let entropy = 0;
      let worst = 0;
      for (let s = 0; s < SCORE_SLOTS; s++) {
        const count = buckets[s]!;
        if (count === 0) continue;
        if (count > worst) worst = count;
        const p = count / n;
        entropy -= p * Math.log2(p);
      }

      const isCandidate = candidateSet.has(poolCodes[g]!.join("|"));
      const better =
        entropy > bestEntropy + 1e-9 ||
        (Math.abs(entropy - bestEntropy) <= 1e-9 &&
          (worst < bestWorst ||
            (worst === bestWorst && isCandidate && !bestIsCandidate)));

      if (better) {
        bestEntropy = entropy;
        bestWorst = worst;
        bestIdx = g;
        bestIsCandidate = isCandidate;
      }
    }

    return poolCodes[bestIdx]!;
  }

  get remaining(): number {
    return this.candidates.length;
  }
}

/** Exposed for tests/debugging: consistency check against the reference scorer. */
export function referenceScore(secret: Code, guess: Code): Feedback {
  return scoreGuess(secret, guess);
}
