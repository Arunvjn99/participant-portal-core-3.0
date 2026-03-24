import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Layers, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { safeT } from "@/lib/safeT";
import { LearningCard } from "@/components/dashboard/LearningCard";

const SAVE_KEY = "pe_dashboard_featured_saved";

function FeaturedLearningHeroAside() {
  const { t } = useTranslation();

  return (
    <div className="relative flex h-[5.25rem] w-[6.25rem] shrink-0 items-center justify-center sm:h-[5.75rem] sm:w-[6.75rem] md:h-[6rem] md:w-[7rem]">
      <div className="relative aspect-square w-full max-w-full origin-center scale-[0.52] sm:scale-[0.56] md:scale-[0.58]">
        <div className="absolute inset-0 m-auto size-[min(100%,5.5rem)] rounded-full bg-[rgb(var(--color-primary-rgb)/0.10)] blur-xl motion-safe:animate-pulse" />

        <div
          className={cn(
            "absolute left-0 top-[22%] w-[52%] rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-1.5 shadow-md md:-rotate-6 md:transition-transform md:duration-500 md:ease-out md:group-hover:rotate-0",
            "motion-safe:animate-float motion-reduce:animate-none [animation-delay:0s]",
          )}
        >
          <div className="flex h-9 items-end justify-center gap-1">
            <div className="h-[28%] w-1/4 rounded-t-sm bg-[rgb(var(--color-primary-rgb)/0.25)]" />
            <div className="h-[42%] w-1/4 rounded-t-sm bg-[rgb(var(--color-primary-rgb)/0.35)]" />
            <div className="h-[58%] w-1/4 rounded-t-sm bg-[rgb(var(--color-primary-rgb)/0.5)]" />
            <div className="h-[85%] w-1/4 rounded-t-sm bg-primary" />
          </div>
        </div>

        <div
          className={cn(
            "absolute bottom-[18%] right-0 w-[46%] rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-2 py-1.5 shadow-md md:rotate-3 md:transition-transform md:duration-500 md:ease-out md:group-hover:rotate-0",
            "motion-safe:animate-float motion-reduce:animate-none [animation-delay:1.25s]",
          )}
        >
          <span className="text-[8px] font-semibold uppercase tracking-wide text-muted-foreground">
            {safeT(t, "dashboard.learningStatLabel", "Growth")}
          </span>
          <div className="mt-0.5 flex items-baseline gap-0.5">
            <span className="text-xs font-semibold text-foreground">
              {safeT(t, "dashboard.learningStatValue", "+12%")}
            </span>
            <TrendingUp className="size-3 shrink-0 text-primary" strokeWidth={2} aria-hidden />
          </div>
        </div>

        <div
          className={cn(
            "absolute right-2 top-0 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-1.5 shadow-md",
            "motion-safe:animate-float motion-reduce:animate-none [animation-delay:0.65s]",
          )}
        >
          <Layers className="size-4 text-primary" strokeWidth={2} aria-hidden />
        </div>
      </div>
    </div>
  );
}

export function FeaturedLearningSurface({ className }: { className?: string }) {
  const { t } = useTranslation();
  const [saved, setSaved] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(SAVE_KEY) === "1";
  });

  const scrollToAssistance = useCallback(() => {
    document.getElementById("action-cards")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const toggleSaveForLater = useCallback(() => {
    setSaved((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        if (next) window.localStorage.setItem(SAVE_KEY, "1");
        else window.localStorage.removeItem(SAVE_KEY);
      }
      return next;
    });
  }, []);

  return (
    <section
      id="recommended-learning"
      className={cn("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", className)}
      aria-labelledby="premium-featured-learning-heading"
    >
      <LearningCard
        variant="hero"
        headingId="premium-featured-learning-heading"
        headline={{
          before: safeT(t, "dashboard.learningTitleBefore", "How much is"),
          highlight: safeT(t, "dashboard.learningTitleHighlight", "enough?"),
        }}
        description={safeT(
          t,
          "dashboard.learningDescription",
          "Finding the right contribution rate for your goals.",
        )}
        actionLabel={safeT(t, "dashboard.learningCtaPrimary", "Start learning")}
        onAction={scrollToAssistance}
        featuredTag={safeT(t, "dashboard.learningFeaturedTag", "Featured learning")}
        readTimeLabel={safeT(t, "dashboard.learningReadTime", "4 min read", { time: 4 })}
        progressHint={safeT(t, "dashboard.learningCardProgress", "Based on your plan")}
        secondaryAction={{
          label: saved
            ? safeT(t, "dashboard.learningCtaSaved", "Saved for later")
            : safeT(t, "dashboard.learningCtaSave", "Save for later"),
          onClick: toggleSaveForLater,
        }}
        heroAside={<FeaturedLearningHeroAside />}
      />
    </section>
  );
}
