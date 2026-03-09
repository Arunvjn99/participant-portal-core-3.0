/**
 * Contribution summary card: total rate, per year, breakdown (your contribution, employer match).
 * Figma parity: purple gradient block, then breakdown rows.
 */
import { useTranslation } from "react-i18next";
import { Percent } from "lucide-react";
import { ReviewSummaryCard } from "./ReviewSummaryCard";

export interface ContributionSummaryProps {
  /** Edit path (e.g. ENROLLMENT_V2_STEP_PATHS[1]) */
  editHref: string;
  /** Total contribution rate (e.g. 6) */
  totalRatePercent: number;
  /** Total annual amount (employee + employer) */
  totalAnnual: number;
  /** Your contribution % */
  yourPercent: number;
  /** Your contribution annual $ */
  yourAnnual: number;
  /** Employer match % */
  employerMatchPercent: number;
  /** Employer match annual $ */
  employerMatchAnnual: number;
  animationDelay?: number;
}

export function ContributionSummary({
  editHref,
  totalRatePercent,
  totalAnnual,
  yourPercent,
  yourAnnual,
  employerMatchPercent,
  employerMatchAnnual,
  animationDelay = 0.15,
}: ContributionSummaryProps) {
  const { t } = useTranslation();
  return (
    <ReviewSummaryCard
      title={t("enrollment.review.yourContributions", "Your Contributions")}
      editHref={editHref}
      editLabel="Edit"
      icon={<Percent className="w-5 h-5 text-[var(--color-primary)]" />}
      animationDelay={animationDelay}
      accentStrip="purple"
    >
      <div className="rounded-xl p-4 mb-4 border border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-[var(--color-text-secondary)] mb-1">
              Total Rate
            </div>
            <div className="text-4xl font-black text-[var(--color-text-primary)]">
              {totalRatePercent}%
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-[var(--color-text-secondary)] mb-1">
              Per Year
            </div>
            <div className="text-xl font-bold text-[var(--color-text-primary)]">
              ${Math.round(totalAnnual).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[var(--color-text-secondary)]">Your Contribution</span>
          <span className="font-bold text-[var(--color-text-primary)]">
            {yourPercent}% • ${Math.round(yourAnnual).toLocaleString()}/yr
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-[var(--color-text-secondary)]">Employer Match</span>
          <span className="font-bold text-[var(--color-success)]">
            {employerMatchPercent}% • ${Math.round(employerMatchAnnual).toLocaleString()}/yr
          </span>
        </div>
      </div>
    </ReviewSummaryCard>
  );
}
