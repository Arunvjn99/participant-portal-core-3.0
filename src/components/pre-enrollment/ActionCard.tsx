import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  ctaLabel: string;
  onCta: () => void;
  /** Visually distinct icon treatment (still token-based). */
  iconVariant?: "primary" | "neutral";
  className?: string;
}

/**
 * Base dashboard action tile — theme tokens only, hover lift + shadow.
 */
export function ActionCard({
  icon: Icon,
  title,
  description,
  ctaLabel,
  onCta,
  iconVariant = "neutral",
  className,
}: ActionCardProps) {
  const iconWrap =
    iconVariant === "primary"
      ? "bg-primary/10 text-primary"
      : "bg-muted/30 text-primary";

  return (
    <article
      className={cn(
        "group flex flex-col rounded-xl border border-border bg-card p-5 transition-all duration-200 ease-out sm:p-6",
        "hover:-translate-y-0.5 hover:shadow-md",
        "focus-within:-translate-y-0.5 focus-within:shadow-md",
        className,
      )}
    >
      <div
        className={cn(
          "mb-4 flex size-12 items-center justify-center rounded-lg transition-colors duration-200",
          iconWrap,
        )}
        aria-hidden
      >
        <Icon className="size-6" strokeWidth={2} />
      </div>

      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">{description}</p>

      <button
        type="button"
        onClick={onCta}
        className="mt-4 inline-flex w-fit items-center gap-1 text-left text-sm font-medium text-primary transition-colors hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {ctaLabel}
        <span aria-hidden>→</span>
      </button>
    </article>
  );
}
