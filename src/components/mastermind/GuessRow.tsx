import { cn } from "@/lib/utils";
import type { Code, Feedback } from "@/lib/mastermind";
import { FeedbackPegs, Peg } from "./Peg";

export function GuessRow({
  index,
  code,
  feedback,
  active,
  onSlotClick,
  activeSlot,
}: {
  index: number;
  code: (Code[number] | null)[];
  feedback?: Feedback | undefined;
  active?: boolean | undefined;
  onSlotClick?: ((i: number) => void) | undefined;
  activeSlot?: number | null | undefined;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2",
        active ? "bg-board-slot/80 ring-1 ring-primary/50" : "bg-board-slot/40",
      )}
    >
      <span className="w-5 text-right text-xs tabular-nums text-muted-foreground">{index}</span>
      <div className="flex gap-2">
        {code.map((c, i) =>
          onSlotClick ? (
            <button
              key={i}
              type="button"
              onClick={() => onSlotClick(i)}
              aria-label={`Slot ${i + 1}`}
              className={cn(
                "rounded-full transition-transform hover:scale-105",
                activeSlot === i && "ring-2 ring-primary ring-offset-2 ring-offset-board",
              )}
            >
              <Peg color={c} />
            </button>
          ) : (
            <Peg key={i} color={c} />
          ),
        )}
      </div>
      <div className="ml-auto">
        {feedback ? (
          <FeedbackPegs exact={feedback.exact} partial={feedback.partial} />
        ) : (
          <div className="w-14" />
        )}
      </div>
    </div>
  );
}
