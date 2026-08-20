import { cn } from "@/lib/utils";
import { PEG_COLORS, type PegColor } from "@/lib/mastermind";

const PEG_BG: Record<PegColor, string> = {
  white: "bg-peg-white",
  blue: "bg-peg-blue",
  green: "bg-peg-green",
  yellow: "bg-peg-yellow",
  orange: "bg-peg-orange",
  silver: "bg-peg-silver",
  red: "bg-peg-red",
  pink: "bg-peg-pink",
};

export function Peg({
  color,
  size = "md",
  className,
}: {
  color?: PegColor | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = { sm: "size-5", md: "size-9", lg: "size-11" };
  return (
    <span
      aria-label={color ?? "empty slot"}
      className={cn(
        "inline-block rounded-full",
        sizes[size],
        color
          ? cn(PEG_BG[color], "peg-shadow")
          : "bg-board-slot ring-1 ring-inset ring-border shadow-inner",
        className,
      )}
    />
  );
}

export function ColorPalette({
  onPick,
  disabled,
  selected,
}: {
  onPick: (c: PegColor) => void;
  disabled?: boolean;
  selected?: PegColor | null;
}) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {PEG_COLORS.map((c) => (
        <button
          key={c}
          type="button"
          disabled={disabled}
          onClick={() => onPick(c)}
          title={c}
          aria-label={`Choose ${c}`}
          className={cn(
            "rounded-full p-1 transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-40 disabled:hover:scale-100",
            selected === c && "ring-2 ring-primary",
          )}
        >
          <Peg color={c} size="lg" />
        </button>
      ))}
    </div>
  );
}

export function FeedbackPegs({ exact, partial }: { exact: number; partial: number }) {
  const total = 4;
  const items = [
    ...Array.from({ length: exact }, () => "exact" as const),
    ...Array.from({ length: partial }, () => "partial" as const),
  ];
  return (
    <div className="grid w-14 grid-cols-2 gap-1">
      {Array.from({ length: total }, (_, i) => {
        const kind = items[i];
        return (
          <span
            key={i}
            className={cn(
              "size-4 rounded-full ring-1 ring-inset ring-border",
              kind === "exact" && "bg-foreground",
              kind === "partial" && "bg-transparent ring-2 ring-foreground",
              !kind && "bg-board-slot",
            )}
          />
        );
      })}
    </div>
  );
}
