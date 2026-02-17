import { useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEnrollment } from "../../enrollment/context/EnrollmentContext";
import { PlanRail } from "../../components/enrollment/PlanRail";
import { PlanDetailsPanel } from "../../components/enrollment/PlanDetailsPanel";
import { EnrollmentFooter } from "../../components/enrollment/EnrollmentFooter";
import { EnrollmentPageContent } from "../../components/enrollment/EnrollmentPageContent";
import { loadEnrollmentDraft, saveEnrollmentDraft } from "../../enrollment/enrollmentDraftStore";
import { getPlanRecommendation } from "../../enrollment/logic/planRecommendationLogic";
import type { PlanOption, PlanRecommendation } from "../../types/enrollment";
import type { SelectedPlanId } from "../../enrollment/context/EnrollmentContext";

const normalizePlanId = (planId: string): SelectedPlanId => {
  const mapping: Record<string, SelectedPlanId> = {
    "traditional-401k": "traditional_401k",
    "roth-401k": "roth_401k",
    "roth-ira": "roth_ira",
    "safe-harbor-401k": "roth_ira",
  };
  return mapping[planId] ?? null;
};

const planIdToRaw = (id: SelectedPlanId): string | null => {
  if (!id) return null;
  const mapping: Record<SelectedPlanId, string> = {
    traditional_401k: "traditional-401k",
    roth_401k: "roth-401k",
    roth_ira: "roth-ira",
  };
  return mapping[id];
};

/** Fallback when no enrollment state (e.g. direct nav). */
const FALLBACK_AGE = 30;
const FALLBACK_RETIREMENT_AGE = 65;
const FALLBACK_SALARY = 50000;

function buildPlansFromRecommendation(recommendation: PlanRecommendation, t: (key: string) => string): PlanOption[] {
  const base: PlanOption[] = [
    {
      id: "traditional-401k",
      title: t("enrollment.planTraditional401kTitle"),
      matchInfo: t("enrollment.planTraditional401kMatch"),
      description: t("enrollment.planTraditional401kDesc"),
      benefits: [
        t("enrollment.planTraditional401kBenefit1"),
        t("enrollment.planTraditional401kBenefit2"),
        t("enrollment.planTraditional401kBenefit3"),
      ],
      isRecommended: false,
      isEligible: true,
    },
    {
      id: "roth-401k",
      title: t("enrollment.planRoth401kTitle"),
      matchInfo: t("enrollment.planRoth401kMatch"),
      description: t("enrollment.planRoth401kDesc"),
      benefits: [
        t("enrollment.planRoth401kBenefit1"),
        t("enrollment.planRoth401kBenefit2"),
        t("enrollment.planRoth401kBenefit3"),
      ],
      isRecommended: true,
      fitScore: recommendation.fitScore,
      isEligible: true,
    },
    {
      id: "roth-ira",
      title: t("enrollment.planSafeHarborTitle"),
      matchInfo: t("enrollment.planSafeHarborMatch"),
      description: t("enrollment.planSafeHarborDesc"),
      benefits: [
        t("enrollment.planSafeHarborBenefit1"),
        t("enrollment.planSafeHarborBenefit2"),
        t("enrollment.planSafeHarborBenefit3"),
      ],
      isRecommended: false,
      isEligible: true,
    },
  ];
  const withRecommendation = base.map((p) => ({
    ...p,
    isRecommended: p.id === recommendation.recommendedPlanId,
    fitScore: p.id === recommendation.recommendedPlanId ? recommendation.fitScore : p.fitScore,
  }));
  return [...withRecommendation].sort((a, b) => (a.isRecommended ? -1 : b.isRecommended ? 1 : 0));
}

export const ChoosePlan = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state, setSelectedPlan } = useEnrollment();
  const draft = loadEnrollmentDraft();

  const recommendation: PlanRecommendation = getPlanRecommendation({
    currentAge: (state.currentAge || draft?.currentAge) ?? FALLBACK_AGE,
    retirementAge: (state.retirementAge || draft?.retirementAge) ?? FALLBACK_RETIREMENT_AGE,
    salary: (state.salary || draft?.annualSalary) ?? FALLBACK_SALARY,
    currentBalance: state.currentBalance ?? (draft?.otherSavings?.amount ?? 0),
  });

  const plans = useMemo(() => buildPlansFromRecommendation(recommendation, t), [recommendation, t]);
  const recommendedId = plans.find((p) => p.isRecommended)?.id ?? plans[0]?.id;
  const selectedPlanIdRaw = planIdToRaw(state.selectedPlan) ?? recommendedId;
  const selectedPlan = plans.find((p) => p.id === selectedPlanIdRaw) ?? plans[0];
  const selectedPlanId = selectedPlanIdRaw ?? recommendedId;

  useEffect(() => {
    if (state.selectedPlan != null || !recommendedId) return;
    setSelectedPlan(normalizePlanId(recommendedId));
  }, [state.selectedPlan, recommendedId, setSelectedPlan]);

  const handlePlanSelect = useCallback(
    (planId: string) => {
      const normalized = normalizePlanId(planId);
      setSelectedPlan(normalized);
      const draft = loadEnrollmentDraft();
      if (draft) {
        saveEnrollmentDraft({ ...draft, selectedPlanId: normalized });
      }
    },
    [setSelectedPlan]
  );

  const handleContinue = useCallback(() => {
    if (!state.selectedPlan) return;
    navigate("/enrollment/contribution");
  }, [state.selectedPlan, navigate]);

  const yearsToRetire = Math.max(0, recommendation.profileSnapshot.retirementAge - recommendation.profileSnapshot.age);
  const userSnapshot = {
    age: recommendation.profileSnapshot.age,
    retirementAge: recommendation.profileSnapshot.retirementAge,
    salary: recommendation.profileSnapshot.salary,
    yearsToRetire,
    retirementLocation: draft?.retirementLocation,
    otherSavings: state.currentBalance ?? draft?.otherSavings?.amount ?? undefined,
  };

  const canContinue = state.selectedPlan != null && (selectedPlan?.isEligible !== false);

  return (
    <EnrollmentPageContent
      title={t("enrollment.selectPlanTitle")}
      subtitle={t("enrollment.selectPlanSubtitle")}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-8">
          <PlanRail
            plans={plans}
            selectedId={selectedPlanId}
            onSelect={handlePlanSelect}
          />
          <div className="lg:hidden">
            <p className="text-sm" style={{ color: "var(--enroll-text-muted)" }}>
              {t("enrollment.needHelpDeciding")}{" "}
              <a href="#" className="underline" style={{ color: "var(--enroll-brand)" }} onClick={(e) => e.preventDefault()}>
                {t("enrollment.scheduleConsultation")}
              </a>
            </p>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="lg:sticky lg:top-24 transition-all duration-300">
            <PlanDetailsPanel plan={selectedPlan} user={userSnapshot} rationaleKey={recommendation.rationaleKey} rationale={recommendation.rationale} />
          </div>
        </div>
      </div>

      <EnrollmentFooter
        step={0}
        primaryLabel={t("enrollment.continueToContributions")}
        primaryDisabled={!canContinue}
        onPrimary={handleContinue}
        getDraftSnapshot={() => ({ selectedPlanId: state.selectedPlan ?? null })}
      />
    </EnrollmentPageContent>
  );
};
