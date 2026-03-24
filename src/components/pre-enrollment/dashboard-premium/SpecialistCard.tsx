import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SpecialistCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  ctaLabel: string;
  onCta: () => void;
  className?: string;
}

export function SpecialistCard({
  icon: Icon,
  title,
  description,
  ctaLabel,
  onCta,
  className,
}: SpecialistCardProps) {
  return (
    <article
      className={cn(
        "group flex h-full flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-6 transition-all duration-200 ease-out hover:border-[color-mix(in_srgb,var(--color-primary)_24%,var(--color-border))] hover:shadow-md md:p-8",
        className,
      )}
    >
      <div
        className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-[rgb(var(--color-primary-rgb)/0.08)] text-primary"
        aria-hidden
      >
        <Icon className="size-5" strokeWidth={2} />
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <h3 className="text-base font-medium text-foreground">{title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>

      <span
        role="button"
        tabIndex={0}
        className="mt-auto inline-flex w-fit cursor-pointer items-center gap-1 text-sm font-medium text-primary transition-all duration-200 ease-out hover:gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
        onClick={onCta}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onCta();
          }
        }}
      >
        {ctaLabel}
        <span aria-hidden className="transition-transform duration-200 ease-out group-hover:translate-x-0.5">→</span>
      </span>
    </article>
  );
}
