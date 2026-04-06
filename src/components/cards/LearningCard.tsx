import type { KeyboardEvent, ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle2, Clock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export type LearningCardStatus = "not_started" | "in_progress" | "completed";

export type LearningCardProps = {
  className?: string;
  /** Category / topic pill (e.g. LEARNING, Basics) */
  topicLabel?: string;
  /** Single-line title */
  title?: string;
  /** Featured headline with highlighted segment */
  headline?: { before: string; highlight: string };
  description: string;
  readTimeLabel?: string;
  /** Shown next to read time (e.g. Featured learning) */
  featuredTag?: string;
  /** Violet AI-style insight (e.g. Recommended for you) */
  insightLabel?: string;
  actionLabel: string;
  onAction?: () => void;
  href?: string;
  secondaryAction?: { label: string; onClick: () => void };
  /** Replace default abstract visual (featured aside, etc.) */
  visual?: ReactNode;
  /** List layout: thumbnail inside visual panel */
  thumbnailUrl?: string;
  thumbnailAlt?: string;
  status?: LearningCardStatus;
  /** 0–100 when status is in_progress */
  progressPercent?: number;
  /** Label under progress bar (e.g. Based on your plan) */
  progressHint?: string;
  headingId?: string;
};

function activateTextCta(e: KeyboardEvent, action: () => void) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    action();
  }
}

function AbstractVisualDecor({ reduced }: { reduced: boolean }) {
  if (reduced) {
    return (
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="size-24 rounded-full border border-[var(--color-border)]/40" />
      </div>
    );
  }
  return (
    <>
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -left-10 -top-10 size-40 rounded-full bg-purple-300/35 blur-3xl dark:bg-purple-500/20" />
        <div className="absolute -right-10 top-10 size-40 rounded-full bg-blue-300/35 blur-3xl dark:bg-blue-500/20" />
        <div className="absolute bottom-[-2.5rem] left-10 size-40 rounded-full bg-emerald-300/30 blur-3xl dark:bg-emerald-500/15" />
      </div>
      <motion.div
        initial={false}
        animate={{ scale: 1, opacity: 1 }}
        className="pointer-events-none absolute size-48 rounded-full border-[0.5px] border-[var(--color-border)]"
      />
      <motion.div
        initial={false}
        animate={{ scale: 1.15, opacity: 0.85 }}
        className="pointer-events-none absolute size-48 rounded-full border-[0.5px] border-[var(--color-border)]"
      />
      <motion.div
        initial={false}
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute bottom-6 left-4 z-20 flex size-12 items-center justify-center rounded-full border border-white/20 bg-gradient-to-tr from-indigo-500 to-purple-400 shadow-[0_8px_16px_rgba(99,102,241,0.35)] dark:from-indigo-600 dark:to-purple-600"
      >
        <div className="size-4 rounded-full bg-white/90 shadow-inner dark:bg-white/80" />
      </motion.div>
    </>
  );
}

/**
 * Learning card from Google AI Studio / figma-dump (learning-card).
 * Horizontal layout: visual | content | CTA; stacks on small screens.
 */
export function LearningCard({
  className,
  topicLabel = "Learning",
  title,
  headline,
  description,
  readTimeLabel,
  featuredTag,
  insightLabel,
  actionLabel,
  onAction,
  href,
  secondaryAction,
  visual,
  thumbnailUrl,
  thumbnailAlt = "",
  status = "not_started",
  progressPercent = 0,
  progressHint,
  headingId,
}: LearningCardProps) {
  const reduced = useReducedMotion();

  const primaryCta =
    href != null ? (
      <a
        href={href}
        className="group/cta inline-flex items-center gap-2 whitespace-nowrap text-base font-semibold text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-hover)] md:text-lg"
      >
        {actionLabel}
        <ArrowRight
          className="size-5 shrink-0 transition-transform group-hover/cta:translate-x-1"
          strokeWidth={2.5}
          aria-hidden
        />
      </a>
    ) : (
      <button
        type="button"
        onClick={onAction}
        className="group/cta inline-flex items-center gap-2 whitespace-nowrap text-base font-semibold text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-hover)] md:text-lg"
      >
        {actionLabel}
        <ArrowRight
          className="size-5 shrink-0 transition-transform group-hover/cta:translate-x-1"
          strokeWidth={2.5}
          aria-hidden
        />
      </button>
    );

  const titleBlock =
    headline != null ? (
      <h2
        id={headingId}
        className="text-2xl font-semibold tracking-tight text-[var(--color-text)] md:text-3xl"
      >
        {headline.before}{" "}
        <span className="text-[var(--color-primary)]">{headline.highlight}</span>
      </h2>
    ) : (
      <h3 className="text-2xl font-semibold tracking-tight text-[var(--color-text)] md:text-3xl">{title ?? ""}</h3>
    );

  const showProgress = status === "in_progress" && progressPercent > 0;
  const completed = status === "completed";

  return (
    <motion.article
      initial={reduced ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "learning-card-figma group w-full rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-background)] p-4 shadow-sm transition-shadow duration-200 md:p-6",
        "flex flex-col items-stretch gap-6 md:flex-row md:items-center md:gap-8 lg:gap-10",
        "hover:shadow-md",
        className,
      )}
    >
      {/* Visual */}
      <div
        className={cn(
          "relative flex w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[var(--color-background-secondary)] md:h-[200px] md:w-[280px]",
          "aspect-[4/3] md:aspect-auto",
        )}
        style={!reduced ? { perspective: "1000px" } : undefined}
      >
        {thumbnailUrl ? (
          <>
            <img src={thumbnailUrl} alt={thumbnailAlt} className="absolute inset-0 size-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
            <div className="pointer-events-none absolute inset-0 opacity-40">
              <div className="absolute -left-8 -top-8 size-32 rounded-full bg-purple-400/30 blur-2xl" />
              <div className="absolute -bottom-8 -right-8 size-32 rounded-full bg-blue-400/25 blur-2xl" />
            </div>
          </>
        ) : visual != null ? (
          <div className="pointer-events-none absolute inset-0 opacity-50">
            <div className="absolute -left-10 -top-10 size-40 rounded-full bg-purple-300/35 blur-3xl dark:bg-purple-500/20" />
            <div className="absolute -right-10 top-10 size-40 rounded-full bg-blue-300/35 blur-3xl dark:bg-blue-500/20" />
          </div>
        ) : (
          <AbstractVisualDecor reduced={!!reduced} />
        )}

        {visual != null ? (
          <div className="relative z-10 flex size-full items-center justify-center p-4">{visual}</div>
        ) : null}

        {completed ? (
          <div className="absolute right-3 top-3 z-20 flex items-center gap-1 rounded-full bg-emerald-500/95 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-md">
            <CheckCircle2 className="size-3.5 shrink-0" aria-hidden />
            Done
          </div>
        ) : null}
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-lg border border-[color-mix(in_srgb,var(--color-primary)_18%,var(--color-border))] bg-[color-mix(in_srgb,var(--color-primary)_8%,transparent)] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[var(--color-text)]">
            <span className="size-1.5 shrink-0 rounded-full bg-[var(--color-text)]" aria-hidden />
            {topicLabel}
          </span>
          {featuredTag != null ? (
            <span className="text-xs font-semibold text-[var(--color-textSecondary)]">{featuredTag}</span>
          ) : null}
          {readTimeLabel != null ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-textSecondary)]">
              <Clock className="size-3.5 shrink-0" aria-hidden />
              {readTimeLabel}
            </span>
          ) : null}
        </div>

        {insightLabel != null ? (
          <p className="inline-flex w-fit items-center gap-1.5 rounded-md border border-[color-mix(in_srgb,var(--ai-primary)_35%,var(--color-border))] bg-[color-mix(in_srgb,var(--ai-primary)_10%,transparent)] px-2.5 py-1 text-[11px] font-semibold text-[var(--ai-primary)]">
            <Sparkles className="size-3 shrink-0 opacity-90" aria-hidden />
            {insightLabel}
          </p>
        ) : null}

        {titleBlock}

        <p className="max-w-xl text-base leading-relaxed text-[var(--color-textSecondary)] md:text-lg">{description}</p>

        {showProgress ? (
          <div className="max-w-md space-y-1">
            <div
              className="h-1.5 overflow-hidden rounded-full bg-[var(--color-background-tertiary)]"
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-full bg-[var(--color-primary)] transition-[width] duration-300"
                style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
              />
            </div>
            <span className="text-[11px] font-medium text-[var(--color-textSecondary)]">
              {progressHint ?? "In progress"}
            </span>
          </div>
        ) : null}

        {secondaryAction != null ? (
          <span
            role="button"
            tabIndex={0}
            className="w-fit cursor-pointer text-xs text-[var(--color-textSecondary)] underline-offset-2 transition-colors hover:text-[var(--color-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--color-primary)_40%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)] sm:text-sm"
            onClick={secondaryAction.onClick}
            onKeyDown={(e) => activateTextCta(e, secondaryAction.onClick)}
          >
            {secondaryAction.label}
          </span>
        ) : null}
      </div>

      {/* CTA column */}
      <div className="flex w-full shrink-0 justify-start border-t border-[var(--color-border)] pt-4 md:w-auto md:border-t-0 md:pt-0 md:pl-4">
        {primaryCta}
      </div>
    </motion.article>
  );
}
