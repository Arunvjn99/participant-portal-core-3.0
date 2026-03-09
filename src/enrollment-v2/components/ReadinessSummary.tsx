/**
 * Retirement Readiness summary: circular score (0-100), label, years to retirement, projected value.
 * Figma parity: SVG circle with gradient stroke, score in center, "Needs Attention" / "On Track" / "Strong" badge.
 */
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ReviewSummaryCard } from "./ReviewSummaryCard";

export interface ReadinessSummaryProps {
  editHref: string;
  score: number;
  label?: string;
  yearsToRetirement?: number;
  projectedValue?: string;
  animationDelay?: number;
}

function getReadinessLabel(score: number): string {
  if (score < 50) return "Needs Attention";
  if (score < 80) return "On Track";
  return "Strong";
}

export function ReadinessSummary({
  editHref,
  score,
  label,
  yearsToRetirement,
  projectedValue,
  animationDelay = 0.1,
}: ReadinessSummaryProps) {
  const { t } = useTranslation();
  const displayLabel = label ?? getReadinessLabel(score);
  const clampedScore = Math.min(100, Math.max(0, Math.round(score)));
  const strokeDashoffset = 2 * Math.PI * 56 * (1 - clampedScore / 100);

  return (
    <ReviewSummaryCard
      title={t("enrollment.review.retirementReadiness", "Retirement Readiness")}
      editHref={editHref}
      editLabel="Edit"
      animationDelay={animationDelay}
      accentStrip="teal"
    >
      <div className="flex items-center gap-6">
        <div className="relative w-32 h-32 flex-shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <defs>
              <linearGradient id="reviewScoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--color-primary)" />
                <stop offset="100%" stopColor="var(--color-primary-light, var(--color-primary))" />
              </linearGradient>
            </defs>
            <circle
              cx="60"
              cy="60"
              r="56"
              fill="none"
              stroke="currentColor"
              strokeWidth="12"
              className="text-[var(--color-border)]"
            />
            <motion.circle
              cx="60"
              cy="60"
              r="56"
              fill="none"
              stroke="url(#reviewScoreGradient)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 56}
              initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 15 }}
              className="text-4xl font-black text-[var(--color-primary)]"
            >
              {clampedScore}
            </motion.div>
            <div className="text-[10px] font-medium text-[var(--color-text-secondary)]">
              out of 100
            </div>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-3 border border-[var(--color-border)]"
            style={{
              background: clampedScore < 50 ? "var(--color-warning-light)" : clampedScore < 80 ? "var(--color-surface)" : "var(--color-success-light)",
            }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: clampedScore < 50 ? "var(--color-warning)" : clampedScore < 80 ? "var(--color-primary)" : "var(--color-success)",
              }}
            />
            <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-text-primary)]">
              {displayLabel}
            </span>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-3">
            Your score is based on contributions, timeline, and projected growth.
          </p>
          <div className="space-y-1.5">
            {yearsToRetirement != null && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--color-text-secondary)]">Years to Retirement</span>
                <span className="font-bold text-[var(--color-text-primary)]">
                  {yearsToRetirement} years
                </span>
              </div>
            )}
            {projectedValue && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--color-text-secondary)]">Projected Value</span>
                <span className="font-bold text-[var(--color-text-primary)]">
                  {projectedValue}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </ReviewSummaryCard>
  );
}
