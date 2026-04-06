import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { safeT } from "@/lib/safeT";

const LEARNING_IMAGE =
  "https://pmmvggrzowobvbebjzdo.supabase.co/storage/v1/object/public/company-logos/Learningbanner.png";

export function FeaturedLearningSurface({ className }: { className?: string }) {
  const { t } = useTranslation();

  const title = safeT(t, "dashboard.learningSimpleTitle", "How much is enough for retirement?");
  const description = safeT(
    t,
    "dashboard.learningDescription",
    "Finding the right contribution rate for your goals.",
  );
  const knowMore = safeT(t, "dashboard.learningKnowMore", "Know more");

  return (
    <section
      id="recommended-learning"
      className={cn("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", className)}
      aria-labelledby="premium-featured-learning-title"
    >
      <a
        href="https://enrich.org/"
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "flex flex-col gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4 transition-shadow",
          "sm:flex-row sm:items-center sm:gap-5 sm:p-5",
          "hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]",
        )}
      >
        <div className="w-full shrink-0 sm:w-[40%]">
          <div className="rounded-xl bg-white p-2 ring-1 ring-black/[0.06] dark:bg-zinc-100 dark:shadow-[0_2px_10px_rgba(0,0,0,0.3)] dark:ring-white/12">
            <img
              src={LEARNING_IMAGE}
              alt={title}
              className="h-auto w-full rounded-lg object-contain"
            />
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5 sm:w-[60%] sm:gap-2">
          <h2
            id="premium-featured-learning-title"
            className="text-base font-semibold leading-snug text-[var(--text-primary)] sm:text-lg"
          >
            {title}
          </h2>
          <p className="text-sm leading-snug text-[var(--text-muted)]">{description}</p>
          <span className="inline-flex items-center gap-1 font-medium text-[var(--primary)]">
            {knowMore}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </span>
        </div>
      </a>
    </section>
  );
}
