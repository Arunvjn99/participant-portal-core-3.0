/**
 * Auto-increase (ADI) summary: +X% per year, Y% cap, progress bar from current to cap.
 * Figma parity: amber/orange gradient block, two big numbers, then progress bar.
 */
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Target } from "lucide-react";
import { ReviewSummaryCard } from "./ReviewSummaryCard";

export interface AutoIncreaseSummaryProps {
  editHref: string;
  /** Whether auto-increase is enabled */
  enabled: boolean;
  /** Annual increase % (e.g. 1 or 2) */
  annualIncreasePercent: number;
  /** Cap % (e.g. 15) */
  maxPercent: number;
  /** Current contribution % (for progress bar start) */
  currentContributionPercent: number;
  animationDelay?: number;
}

export function AutoIncreaseSummary({
  editHref,
  enabled,
  annualIncreasePercent,
  maxPercent,
  currentContributionPercent,
  animationDelay = 0.2,
}: AutoIncreaseSummaryProps) {
  const yearsToCap = maxPercent > currentContributionPercent
    ? Math.ceil((maxPercent - currentContributionPercent) / annualIncreasePercent)
    : 0;
  const progressPercent = Math.min(100, (currentContributionPercent / maxPercent) * 100);
  const { t } = useTranslation();

  return (
    <ReviewSummaryCard
      title={t("enrollment.review.autoIncrease", "Auto-Increase (ADI)")}
      editHref={editHref}
      editLabel="Edit"
      icon={<Target className="w-5 h-5 text-[var(--color-warning)]" />}
      animationDelay={animationDelay}
      accentStrip="amber"
    >
      <div className="rounded-xl p-5 border border-[var(--color-border)] bg-[var(--color-surface)] mb-3">
        <div className="grid grid-cols-2 gap-6 pb-5 mb-5 border-b border-[var(--color-border)]">
          <div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-5xl font-black text-[var(--color-text-primary)]">
                {enabled ? `+${annualIncreasePercent}%` : "0%"}
              </span>
              <span className="text-base text-[var(--color-text-secondary)]">
                per year
              </span>
            </div>
            <div className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide">
              Annual Increase
            </div>
          </div>
          <div className="border-l border-[var(--color-border)] pl-6">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-5xl font-black text-[var(--color-text-primary)]">
                {maxPercent}%
              </span>
              <span className="text-base text-[var(--color-text-secondary)]">cap</span>
            </div>
            <div className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide">
              Maximum Limit
            </div>
          </div>
        </div>
        {enabled && (
          <div>
            <div className="flex items-center justify-between mb-2 text-sm text-[var(--color-text-secondary)]">
              <span>Starting at {currentContributionPercent}%</span>
              <span>
                Reaching {maxPercent}% in {yearsToCap} years
              </span>
            </div>
            <div className="relative h-2 rounded-full overflow-hidden bg-[var(--color-border)]">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-[var(--color-warning)]"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        )}
        {!enabled && (
          <p className="text-sm text-[var(--color-text-secondary)]">
            Auto-increase is off. You can enable it in the previous step.
          </p>
        )}
      </div>
    </ReviewSummaryCard>
  );
}
