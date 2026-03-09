import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useEnrollment } from "../../../enrollment/context/EnrollmentContext";
import { loadEnrollmentDraft, saveEnrollmentDraft } from "../../../enrollment/enrollmentDraftStore";
import { EnrollmentPageContent } from "../../../components/enrollment/EnrollmentPageContent";
import { EnrollmentFooter } from "../../../components/enrollment/EnrollmentFooter";
import { SectionHeadingWithAccent } from "../../../components/ui/SectionHeadingWithAccent";
import { ReadinessLayoutV2, type ReadinessImprovementCard } from "./ReadinessLayoutV2";
import { ENROLLMENT_V2_STEP_PATHS } from "../config/stepConfig";
import { Target } from "lucide-react";

/** V2 Readiness — UI from ReadinessLayoutV2; score from existing projection (estimatedRetirementBalance). */
export function ReadinessPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state, estimatedRetirementBalance } = useEnrollment();

  const salary = state.salary || 1;
  const incomeGoal = salary * 20;

  const score = useMemo(() => {
    return Math.min(100, Math.round((estimatedRetirementBalance / incomeGoal) * 100));
  }, [estimatedRetirementBalance, incomeGoal]);

  const fundingSummary = useMemo(() => ({
    incomeGoal,
    annualContributions: Math.round(salary * (state.contributionAmount / 100)),
    savingsGap: Math.max(0, Math.round(incomeGoal - estimatedRetirementBalance)),
  }), [incomeGoal, salary, state.contributionAmount, estimatedRetirementBalance]);

  const statusLabel =
    score < 40 ? "Needs Attention" : score < 70 ? "On Track" : "Strong";

  const understandingText = t(
    "enrollment.readinessUnderstanding",
    "Your score is based on contributions, timeline, and projected growth."
  );

  const improvements: ReadinessImprovementCard[] = useMemo(() => {
    const list: ReadinessImprovementCard[] = [];
    if (!state.autoIncrease?.enabled) {
      list.push({
        id: "enable_auto_increase",
        title: t("enrollment.improvementAutoIncrease", "Enable auto-increase"),
        description: t("enrollment.improvementAutoIncreaseDesc", "Automatically increase your contribution each year."),
        impactType: "Medium Impact",
        icon: <Target className="w-6 h-6" style={{ color: "var(--brand-primary)" }} />,
      });
    }
    if (state.contributionAmount < 10) {
      list.push({
        id: "increase_contribution",
        title: t("enrollment.improvementContribution", "Increase contribution"),
        description: t("enrollment.improvementContributionDesc", "Even a small increase can improve your readiness."),
        impactType: "High Impact",
        icon: <Target className="w-6 h-6" style={{ color: "var(--brand-primary)" }} />,
      });
    }
    return list;
  }, [state.autoIncrease?.enabled, state.contributionAmount, t]);

  const saveDraftForNextStep = useCallback(() => {
    const draft = loadEnrollmentDraft();
    if (!draft) return;
    saveEnrollmentDraft(draft);
  }, []);

  const onApplyRecommendation = useCallback((id: string) => {
    if (id === "increase_contribution") navigate(ENROLLMENT_V2_STEP_PATHS[1]);
    else if (id === "enable_auto_increase") navigate(ENROLLMENT_V2_STEP_PATHS[2]);
  }, [navigate]);

  return (
    <EnrollmentPageContent
      headerContent={
        <SectionHeadingWithAccent
          title={t("enrollment.readinessTitle", "Your Retirement Readiness Score")}
          subtitle={t("enrollment.readinessSubtitle", "See how you're tracking toward retirement.")}
          accentPosition="left"
        />
      }
    >
      <div className="flex flex-col gap-6 pb-12">
        <ReadinessLayoutV2
          title={t("enrollment.readinessTitle", "Your Retirement Readiness Score")}
          subtitle={t("enrollment.readinessSubtitle", "See how you're tracking toward retirement.")}
          score={score}
          statusLabel={statusLabel}
          understandingText={understandingText}
          fundingSummary={fundingSummary}
          improvements={improvements}
          onApplyRecommendation={onApplyRecommendation}
        >
          <EnrollmentFooter
            primaryLabel={t("enrollment.continueToReview", "Continue to Review")}
            onPrimary={saveDraftForNextStep}
            stepPaths={ENROLLMENT_V2_STEP_PATHS}
            inContent
          />
        </ReadinessLayoutV2>
      </div>
    </EnrollmentPageContent>
  );
}
