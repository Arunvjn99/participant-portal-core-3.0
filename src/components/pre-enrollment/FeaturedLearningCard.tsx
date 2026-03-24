import { useCallback, useEffect, useId, useState, type KeyboardEvent } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FeaturedLearningSlide {
  id: string;
  tag: string;
  meta: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface FeaturedLearningCardProps {
  slides: FeaturedLearningSlide[];
  ctaLabel: string;
  onCta?: () => void;
  className?: string;
}

/**
 * Featured learning carousel — layout uses semantic surface + border tokens only.
 */
export function FeaturedLearningCard({ slides, ctaLabel, onCta, className }: FeaturedLearningCardProps) {
  const [index, setIndex] = useState(0);
  const regionId = useId();
  const safeSlides = slides.length > 0 ? slides : [];
  const active = safeSlides[index] ?? safeSlides[0];

  const go = useCallback(
    (next: number) => {
      if (safeSlides.length === 0) return;
      const i = ((next % safeSlides.length) + safeSlides.length) % safeSlides.length;
      setIndex(i);
    },
    [safeSlides.length],
  );

  useEffect(() => {
    if (index >= safeSlides.length) setIndex(0);
  }, [index, safeSlides.length]);

  const onKeyDown = (e: KeyboardEvent) => {
    if (safeSlides.length <= 1) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(index + 1);
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(index - 1);
    }
  };

  if (!active) return null;

  const Icon = active.icon;

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8",
        className,
      )}
    >
      <div
        id={regionId}
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured learning"
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
            <div
              className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-muted/25 text-primary"
              aria-hidden
            >
              <Icon className="size-6" strokeWidth={2} />
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{active.tag}</p>
              <p className="text-sm text-muted-foreground">{active.meta}</p>
            </div>
          </div>

          <div className="min-w-0 flex-1 lg:px-4">
            <h3 className="text-lg font-semibold text-foreground md:text-xl">{active.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">{active.description}</p>
          </div>

          <div className="flex shrink-0 flex-col items-start gap-4 lg:items-end">
            <button
              type="button"
              onClick={() => onCta?.()}
              className="text-sm font-medium text-primary transition-colors hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background md:text-base"
            >
              {ctaLabel}
              <span aria-hidden> →</span>
            </button>
          </div>
        </div>
      </div>

      {safeSlides.length > 1 && (
        <div
          className="mt-6 flex justify-center gap-2 lg:mt-8"
          role="tablist"
          aria-label="Choose featured resource"
        >
          {safeSlides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-controls={regionId}
              tabIndex={i === index ? 0 : -1}
              onClick={() => setIndex(i)}
              className={cn(
                "size-2 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                i === index ? "bg-primary" : "bg-muted/50 hover:bg-muted",
              )}
            >
              <span className="sr-only">
                {slide.title}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
