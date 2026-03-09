/**
 * Review step — hero, plan overview, then grid of 5 cards (Readiness, Contributions, Final Confirmation, Auto Increase, Asset Allocation), footer with Back + Confirm.
 */
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { PlanSummary } from "../../../enrollment-v2/components/PlanSummary";
import { ReadinessSummary } from "../../../enrollment-v2/components/ReadinessSummary";
import { ContributionSummary } from "../../../enrollment-v2/components/ContributionSummary";
import { AutoIncreaseSummary } from "../../../enrollment-v2/components/AutoIncreaseSummary";
import { InvestmentSummary } from "../../../enrollment-v2/components/InvestmentSummary";
import { EnrollmentConfirmModal } from "../../../enrollment-v2/components/EnrollmentConfirmModal";
import Button from "../../../components/ui/Button";
import { ENROLLMENT_V2_STEP_PATHS } from "../config/stepConfig";

const [
  PATH_PLAN,
  PATH_CONTRIBUTION,
  PATH_AUTO_INCREASE,
  PATH_INVESTMENT,
  PATH_READINESS,
] = ENROLLMENT_V2_STEP_PATHS;

export interface ReviewLayoutV2Props {
  title: string;
  subtitle: string;
  /** Plan overview cells (Selected Plan, Projected by Age X, Annual Contribution) */
  planOverviewCells: Array<{ label: string; value: string }>;
  /** Optional flow: e.g. [{ label: "Annual Contribution", value: "$X" }, { label: "Growth ~7% APY", value: "—" }, { label: "Projected Value", value: "$Y" }] */
  planFlowSteps?: Array<{ label: string; value: string }>;
  planDisclaimer?: string;
  /** Readiness: score 0-100, label, years, projected value */
  readinessScore: number;
  readinessLabel?: string;
  yearsToRetirement?: number;
  projectedValue?: string;
  /** Contribution breakdown */
  contributionTotalRatePercent: number;
  contributionTotalAnnual: number;
  contributionYourPercent: number;
  contributionYourAnnual: number;
  contributionEmployerMatchPercent: number;
  contributionEmployerMatchAnnual: number;
  /** Auto-increase */
  autoIncreaseEnabled: boolean;
  autoIncreaseAnnualPercent: number;
  autoIncreaseMaxPercent: number;
  currentContributionPercent: number;
  /** Investment allocation (e.g. preTax, roth, afterTax or stocks, bonds, other) */
  allocationItems: Array<{ label: string; percent: number; color?: string }>;
  /** Terms */
  agreedToTerms: boolean;
  onTermsChange: (checked: boolean) => void;
  termsLabel: string;
  confirmLabel: string;
  onConfirm: () => void;
  confirmDisabled?: boolean;
  /** Success modal */
  showSuccessModal: boolean;
  selectedPlanName: string;
  successTitle?: string;
  successMessage?: string;
  /** Optional "What Happens Next" list for success modal */
  successNextSteps?: string[];
  onCloseSuccess: () => void;
  /** Path for Back button (e.g. previous step) */
  backHref: string;
}

export function ReviewLayoutV2({
  title,
  subtitle,
  planOverviewCells,
  planFlowSteps,
  planDisclaimer,
  readinessScore,
  readinessLabel,
  yearsToRetirement,
  projectedValue,
  contributionTotalRatePercent,
  contributionTotalAnnual,
  contributionYourPercent,
  contributionYourAnnual,
  contributionEmployerMatchPercent,
  contributionEmployerMatchAnnual,
  autoIncreaseEnabled,
  autoIncreaseAnnualPercent,
  autoIncreaseMaxPercent,
  currentContributionPercent,
  allocationItems,
  agreedToTerms,
  onTermsChange,
  termsLabel,
  confirmLabel,
  onConfirm,
  confirmDisabled,
  showSuccessModal,
  selectedPlanName,
  successTitle,
  successMessage,
  successNextSteps,
  onCloseSuccess,
  backHref,
}: ReviewLayoutV2Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <header className="mb-8">
        <h1 className="text-heading-lg text-[var(--color-text-primary)]">{title}</h1>
        <p className="text-body text-[var(--color-text-secondary)] mt-2">{subtitle}</p>
      </header>

      {/* Plan overview — full width, optional flow */}
      <PlanSummary cells={planOverviewCells} flowSteps={planFlowSteps} disclaimer={planDisclaimer} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ReadinessSummary
          editHref={PATH_READINESS}
              score={readinessScore}
          label={readinessLabel}
          yearsToRetirement={yearsToRetirement}
          projectedValue={projectedValue}
          animationDelay={0.1}
        />
        <ContributionSummary
          editHref={PATH_CONTRIBUTION}
              totalRatePercent={contributionTotalRatePercent}
          totalAnnual={contributionTotalAnnual}
          yourPercent={contributionYourPercent}
          yourAnnual={contributionYourAnnual}
          employerMatchPercent={contributionEmployerMatchPercent}
          employerMatchAnnual={contributionEmployerMatchAnnual}
          animationDelay={0.15}
        />
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="rounded-xl p-6 border min-w-0"
          style={{
            background: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          <h3 className="text-lg font-bold mb-2 text-[var(--color-text-primary)]">
            {t("enrollment.review.finalConfirmationTitle", "Final confirmation")}
          </h3>
          <p className="text-sm leading-relaxed text-[var(--color-text-secondary)] mb-4">
            {t("enrollment.review.finalConfirmationDesc", "Review your selections above, then confirm to complete enrollment.")}
          </p>
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="review-terms"
              checked={agreedToTerms}
              onChange={(e) => onTermsChange(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 border-[var(--color-border)]"
              style={{ accentColor: "var(--color-primary)" }}
              aria-describedby="review-terms-desc"
            />
            <label
              id="review-terms-desc"
              htmlFor="review-terms"
              className="text-sm leading-relaxed cursor-pointer text-[var(--color-text-secondary)]"
            >
              {termsLabel}
            </label>
          </div>
        </motion.div>
        <AutoIncreaseSummary
          editHref={PATH_AUTO_INCREASE}
          enabled={autoIncreaseEnabled}
          annualIncreasePercent={autoIncreaseAnnualPercent}
          maxPercent={autoIncreaseMaxPercent}
          currentContributionPercent={currentContributionPercent}
          animationDelay={0.25}
        />
        <InvestmentSummary
          editHref={PATH_INVESTMENT}
          items={allocationItems}
          title={t("enrollment.review.assetAllocation", "Asset Class Distribution")}
          animationDelay={0.3}
        />
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[var(--color-border)]">
        <Button variant="outline" onClick={() => navigate(backHref)} type="button">
          {t("enrollment.review.back", "Back")}
        </Button>
        <Button
          variant="primary"
          onClick={onConfirm}
          disabled={confirmDisabled}
          type="button"
        >
          {t("enrollment.review.submitEnrollment", "Confirm Enrollment")}
        </Button>
      </footer>

      <EnrollmentConfirmModal
        open={showSuccessModal}
        onClose={onCloseSuccess}
        selectedPlanName={selectedPlanName}
        successTitle={successTitle}
        successSubtitle="Enrollment Successful"
        message={successMessage}
        nextSteps={successNextSteps}
      />
    </div>
  );
}
