import { cn } from "@/lib/utils";

export interface SearchPanelProps {
  id: string;
  trendingTitle: string;
  chips: readonly string[];
  onChipPick: (text: string) => void;
  className?: string;
}

/**
 * Expandable suggestions panel for hero-attached search (theme tokens only).
 */
export function SearchPanel({ id, trendingTitle, chips, onChipPick, className }: SearchPanelProps) {
  return (
    <div
      id={id}
      role="group"
      aria-label={trendingTitle}
      className={cn(
        "mt-2 rounded-xl border border-border bg-card p-4 shadow-md animate-hero-search-panel",
        className,
      )}
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {trendingTitle}
      </p>
      <div className="flex flex-wrap gap-2">
        {chips.map((label) => (
          <button
            key={label}
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              onChipPick(label);
            }}
            className="rounded-full border border-border bg-background-tertiary px-3 py-1 text-left text-sm text-muted transition-colors duration-200 hover:border-primary/30 hover:bg-primary/10 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
