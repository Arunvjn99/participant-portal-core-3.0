import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useEnrollment } from "../../../enrollment/context/EnrollmentContext";
import { loadEnrollmentDraft } from "../../../enrollment/enrollmentDraftStore";
import { EnrollmentPageContent } from "../../../components/enrollment/EnrollmentPageContent";
import { ReviewLayoutV2 } from "./ReviewLayoutV2";
import { ENROLLMENT_V2_STEP_PATHS } from "../config/stepConfig";

/** V2 Review — UI from ReviewLayoutV2; all data from useEnrollment. Edit links use ENROLLMENT_V2_STEP_PATHS. */
export function ReviewPage() {
  const { t } = useTranslation();
  const { state, monthlyContribution, estimatedRetirementBalance } = useEnrollment();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const planLabel =
    state.selectedPlan === "roth_401k"
      ? t("enrollment.planRoth401kTitle")
      : state.selectedPlan === "traditional_401k"
        ? t("enrollment.planTraditional401kTitle")
        : state.selectedPlan === "roth_ira"
          ? t("enrollment.planRothIraTitle", "Roth IRA")
          : "—";

  const retirementAge = state.retirementAge ?? 65;
  const yearsToRetirement = Math.max(0, retirementAge - (state.currentAge ?? 30));

  const planOverviewCells = useMemo(
    () => [
      { label: t("enrollment.selectedPlan", "Selected Plan"), value: planLabel },
      {
        label: t("enrollment.annualContribution", "Annual Contribution"),
        value: `$${Math.round(monthlyContribution.total * 12).toLocaleString()}`,
      },
      {
        label: t("enrollment.projectedBalance", "Projected by Age {{age}}", { age: retirementAge }),
        value: `$${estimatedRetirementBalance.toLocaleString()}`,
      },
    ],
    [planLabel, retirementAge, estimatedRetirementBalance, monthlyContribution.total, t]
  );

  const planFlowSteps = useMemo(
    () => [
      { label: t("enrollment.annualContribution", "Annual Contribution"), value: `$${Math.round(monthlyContribution.total * 12).toLocaleString()}` },
      { label: "Growth ~7% APY", value: "—" },
      { label: t("enrollment.projectedBalance", "Projected by Age {{age}}", { age: retirementAge }), value: `$${estimatedRetirementBalance.toLocaleString()}` },
    ],
    [monthlyContribution.total, retirementAge, estimatedRetirementBalance, t]
  );

  const successNextSteps = useMemo(
    () => [
      t("enrollment.successNextStep1", "You'll receive a confirmation email within 24 hours"),
      t("enrollment.successNextStep2", "Your first contribution starts next pay period"),
      t("enrollment.successNextStep3", "Track your progress anytime in your account dashboard"),
    ],
    [t]
  );

  const contributionType = state.contributionType ?? "percentage";
  const contributionAmount = state.contributionAmount ?? 0;
  const totalRatePercent =
    contributionType === "percentage"
      ? contributionAmount
      : state.salary > 0
        ? (contributionAmount * 26 * 12) / state.salary
        : 0;
  const yourAnnual = monthlyContribution.employee * 12;
  const employerMatchAnnual = monthlyContribution.employer * 12;
  const employerMatchCap = state.assumptions?.employerMatchCap ?? 6;

  const allocationItems = useMemo(() => {
    const { preTax, roth, afterTax } = state.sourceAllocation;
    return [
      { label: t("enrollment.preTax", "Pre-Tax"), percent: preTax, color: "var(--chart-1)" },
      { label: t("enrollment.roth", "Roth"), percent: roth, color: "var(--chart-2)" },
      { label: t("enrollment.afterTax", "After-Tax"), percent: afterTax, color: "var(--chart-3)" },
    ];
  }, [state.sourceAllocation, t]);

  const readinessScore = useMemo(() => {
    if (!state.salary || state.salary <= 0) return 0;
    return Math.min(100, Math.round((estimatedRetirementBalance / (state.salary * 20)) * 100));
  }, [state.salary, estimatedRetirementBalance]);

  const handleConfirm = useCallback(() => {
    if (!agreedToTerms) return;
    const draft = loadEnrollmentDraft();
    if (draft) {
      setShowSuccessModal(true);
    }
  }, [agreedToTerms]);

  const autoIncrease = state.autoIncrease ?? {
    enabled: false,
    percentage: 2,
    maxPercentage: 15,
    incrementCycle: "calendar_year" as const,
    preTaxIncrease: 2,
    rothIncrease: 2,
    afterTaxIncrease: 2,
  };

  return (
    <EnrollmentPageContent>
      <div className="flex flex-col gap-6 pb-12">
        <ReviewLayoutV2
          title={t("enrollment.review.title", "You're Almost Done!")}
          subtitle={t("enrollment.review.subtitle", "Review your enrollment summary and confirm to complete your retirement plan setup.")}
          planOverviewCells={planOverviewCells}
          planFlowSteps={planFlowSteps}
          planDisclaimer={t("enrollment.reviewDisclaimer", "Projected values are estimates assuming a 7% annual growth rate. Actual results may vary based on market conditions and investment performance.")}
          readinessScore={readinessScore}
          readinessLabel={readinessScore < 50 ? "Needs Attention" : readinessScore < 80 ? "On Track" : "Strong"}
          yearsToRetirement={yearsToRetirement}
          projectedValue={`$${estimatedRetirementBalance.toLocaleString()}`}
          contributionTotalRatePercent={Math.round(totalRatePercent * 10) / 10}
          contributionTotalAnnual={monthlyContribution.total * 12}
          contributionYourPercent={contributionType === "percentage" ? contributionAmount : totalRatePercent}
          contributionYourAnnual={yourAnnual}
          contributionEmployerMatchPercent={employerMatchCap}
          contributionEmployerMatchAnnual={employerMatchAnnual}
          autoIncreaseEnabled={autoIncrease.enabled}
          autoIncreaseAnnualPercent={autoIncrease.percentage ?? 2}
          autoIncreaseMaxPercent={autoIncrease.maxPercentage ?? 15}
          currentContributionPercent={contributionType === "percentage" ? contributionAmount : totalRatePercent}
          allocationItems={allocationItems}
          agreedToTerms={agreedToTerms}
          onTermsChange={setAgreedToTerms}
          termsLabel={t("enrollment.agreeToTerms", "I agree to the terms and conditions. By continuing, you agree to comply with federal retirement plan regulations. Investments involve market risk, and you may lose value.")}
          confirmLabel={t("enrollment.reviewSubmit", "Confirm Enrollment")}
          onConfirm={handleConfirm}
          confirmDisabled={!agreedToTerms}
          showSuccessModal={showSuccessModal}
          selectedPlanName={planLabel}
          successTitle={t("enrollment.enrollmentSuccess", "Congratulations!")}
          successMessage={t("enrollment.enrollmentSuccessMessage", "Your retirement plan has been successfully set up! Your contributions will begin with your next paycheck.")}
          successNextSteps={successNextSteps}
          onCloseSuccess={() => setShowSuccessModal(false)}
          backHref={ENROLLMENT_V2_STEP_PATHS[4]}
        />
      </div>
    </EnrollmentPageContent>
  );
}
