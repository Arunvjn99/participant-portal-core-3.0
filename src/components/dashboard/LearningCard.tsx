import type { KeyboardEvent, ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowRight, GraduationCap, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export type LearningCardProps = {
  /** Default `tile` — constrained height for Need Assistance row. `hero` — full-width featured learning. */
  variant?: "tile" | "hero";
  /** Tile heading */
  title?: string;
  /** Hero heading split (replaces title when variant is hero) */
  headline?: { before: string; highlight: string };
  description: string;
  actionLabel: string;
  /** Primary CTA */
  onAction?: () => void;
  href?: string;
  /** Hero: text link under primary actions (e.g. Save for later) */
  secondaryAction?: { label: string; onClick: () => void };
  /** Hero meta line (e.g. “4 min read”) */
  readTimeLabel?: string;
  /** Hero: first meta label (defaults to topic-style chip when omitted) */
  featuredTag?: string;
  topicLabel?: string;
  recommendLabel?: string;
  progressHint?: string;
  icon?: ReactNode;
  className?: string;
  /** Hero right column (charts / decorative) */
  heroAside?: ReactNode;
  /** `id` on hero h2 for section aria-labelledby */
  headingId?: string;
};

function activateTextCta(e: KeyboardEvent, action: () => void) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    action();
  }
}

/**
 * Light “Financial Wellness / Learning” card — visual language from figma-dump/zip (2).
 * Tile: max ~220px for the 7-column assistance slot. Hero: unconstrained top featured surface.
 */
export function LearningCard({
  variant = "tile",
  title = "",
  headline,
  description,
  actionLabel,
  onAction,
  href,
  secondaryAction,
  readTimeLabel,
  featuredTag,
  topicLabel = "Learning",
  recommendLabel = "Recommended for you",
  progressHint = "Based on your plan",
  icon,
  className,
  heroAside,
  headingId,
}: LearningCardProps) {
  const isHero = variant === "hero";

  const primaryCta =
    href && !isHero ? (
      <a href={href} className="dash-learning-card__cta">
        {actionLabel}
        <ArrowRight className="dash-learning-card__cta-arrow h-4 w-4" aria-hidden />
      </a>
    ) : (
      <button type="button" className="dash-learning-card__cta" onClick={onAction}>
        {actionLabel}
        <ArrowRight className="dash-learning-card__cta-arrow h-4 w-4" aria-hidden />
      </button>
    );

  const metaRow = isHero ? (
    <div className="dash-learning-card__meta">
      <span className="dash-learning-card__chip">
        <GraduationCap className="h-3 w-3" aria-hidden />
        {featuredTag ?? topicLabel}
      </span>
      {readTimeLabel ? (
        <span className="text-xs font-medium text-[var(--color-text-secondary)]">{readTimeLabel}</span>
      ) : null}
    </div>
  ) : (
    <div className="dash-learning-card__meta">
      <span className="dash-learning-card__chip">
        <GraduationCap className="h-3 w-3" aria-hidden />
        {topicLabel}
      </span>
      <span className="dash-learning-card__chip dash-learning-card__chip--muted">
        <Sparkles className="h-3 w-3 opacity-70" aria-hidden />
        {recommendLabel}
      </span>
    </div>
  );

  const titleBlock = isHero && headline ? (
    <h2
      id={headingId}
      className="dash-learning-card__title dash-learning-card__title--hero"
    >
      {headline.before}{" "}
      <span className="text-[var(--color-primary)]">{headline.highlight}</span>
    </h2>
  ) : (
    <h3 className="dash-learning-card__title">{title}</h3>
  );

  const body = (
    <div className="dash-learning-card__body">
      {metaRow}
      {titleBlock}
      <p className={cn("dash-learning-card__desc", isHero && "dash-learning-card__desc--hero")}>
        {description}
      </p>
      <div className="dash-learning-card__progress" aria-hidden>
        <div className="dash-learning-card__progress-track">
          <div className="dash-learning-card__progress-fill" />
        </div>
        <span className="dash-learning-card__progress-label">{progressHint}</span>
      </div>
    </div>
  );

  if (isHero) {
    return (
      <motion.div
        className={cn("dash-learning-card dash-learning-card--hero group", className)}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="dash-learning-card__inner dash-learning-card__inner--hero">
          <div className="dash-learning-card__hero-left">
            <div className="dash-learning-card__body dash-learning-card__body--hero">
              {metaRow}
              {titleBlock}
              <p className={cn("dash-learning-card__desc", "dash-learning-card__desc--hero")}>
                {description}
              </p>
              <div className="dash-learning-card__progress" aria-hidden>
                <div className="dash-learning-card__progress-track">
                  <div className="dash-learning-card__progress-fill" />
                </div>
                <span className="dash-learning-card__progress-label">{progressHint}</span>
              </div>
            </div>
            {secondaryAction ? (
              <span
                role="button"
                tabIndex={0}
                className="inline-flex w-fit cursor-pointer text-xs text-[var(--color-text-secondary)] transition-colors duration-200 ease-out hover:text-[var(--color-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--color-primary)_40%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--card-bg)] sm:text-sm"
                onClick={secondaryAction.onClick}
                onKeyDown={(e) => activateTextCta(e, secondaryAction.onClick)}
              >
                {secondaryAction.label}
              </span>
            ) : null}
          </div>

          {heroAside ? (
            <div className="dash-learning-card__hero-right dash-learning-card__hero-right--cluster">
              <div className="dash-learning-card__hero-right-visual">{heroAside}</div>
              <div className="dash-learning-card__hero-right-cta">{primaryCta}</div>
            </div>
          ) : (
            <div className="dash-learning-card__hero-right dash-learning-card__hero-right--cluster dash-learning-card__hero-right--cta-only">
              <div className="dash-learning-card__hero-right-cta">{primaryCta}</div>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  const tileContent = (
    <>
      <div className="dash-learning-card__icon" aria-hidden>
        <motion.div
          className="dash-learning-card__icon-inner"
          animate={{ y: [-2, 2, -2] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        >
          {icon ?? <GraduationCap className="h-6 w-6 text-[var(--color-primary)]" strokeWidth={2} />}
        </motion.div>
      </div>
      {body}
      <div className="dash-learning-card__cta-wrap">{primaryCta}</div>
    </>
  );

  return (
    <motion.div
      className={cn("dash-learning-card group", className)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="dash-learning-card__inner">{tileContent}</div>
    </motion.div>
  );
}
