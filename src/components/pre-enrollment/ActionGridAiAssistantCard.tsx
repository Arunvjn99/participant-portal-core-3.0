import { cn } from "@/lib/utils";
import { CoreAiBrandMark } from "@/components/core-ai/CoreAiBrandMark";

export interface ActionGridAiAssistantCardProps {
  title: string;
  description: string;
  ctaLabel: string;
  onCta: () => void;
  className?: string;
}

/**
 * AI tile for the legacy 2-column action grid (enrollment dashboard).
 */
export function ActionGridAiAssistantCard({
  title,
  description,
  ctaLabel,
  onCta,
  className,
}: ActionGridAiAssistantCardProps) {
  return (
    <article
      className={cn(
        "group relative origin-center overflow-hidden rounded-xl border border-border bg-card p-5 transition-all duration-200 ease-out sm:p-6",
        "hover:scale-105 hover:shadow-lg",
        "focus-within:scale-105 focus-within:shadow-lg",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute -left-1/4 top-1/2 size-[min(120%,24rem)] -translate-y-1/2 rounded-full bg-primary/10 opacity-50 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-1/4 bottom-0 size-[min(100%,20rem)] translate-y-1/3 rounded-full bg-primary/15 opacity-60 blur-3xl"
        aria-hidden
      />

      <div className="relative z-10 flex flex-col">
        <div className="mb-4 flex items-center gap-3">
          <CoreAiBrandMark animated loading="lazy" />
          <h3 className="min-w-0 text-lg font-semibold leading-snug text-foreground transition-transform duration-200 ease-out group-hover:translate-y-px">
            {title}
          </h3>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">{description}</p>

        <button
          type="button"
          onClick={onCta}
          className="mt-4 inline-flex w-fit items-center gap-1 text-left text-sm font-medium text-primary transition-all duration-200 ease-out hover:underline group-hover:translate-y-px focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {ctaLabel}
          <span aria-hidden>→</span>
        </button>
      </div>
    </article>
  );
}
