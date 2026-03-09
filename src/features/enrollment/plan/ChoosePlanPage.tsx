import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Shield, Sparkles, TrendingUp } from "lucide-react";
import { useEnrollment } from "../../../enrollment/context/EnrollmentContext";
import { loadEnrollmentDraft, saveEnrollmentDraft } from "../../../enrollment/enrollmentDraftStore";
import { useCoreAIModalOptional } from "../../../context/CoreAIModalContext";
import { EnrollmentPageContent } from "../../../components/enrollment/EnrollmentPageContent";
import { EnrollmentFooter } from "../../../components/enrollment/EnrollmentFooter";
import { HelpSectionCard } from "../../../components/ui/HelpSectionCard";
import { PlanCardV2 } from "./PlanCardV2";
import type { SelectedPlanId } from "../../../enrollment/context/EnrollmentContext";
import { ENROLLMENT_V2_STEP_PATHS } from "../config/stepConfig";

const ROTH_PLAN_ID: SelectedPlanId = "roth_401k";
const TRADITIONAL_PLAN_ID: SelectedPlanId = "traditional_401k";

const PLAN_ASK_AI_PROMPT = (planName: string) =>
  `Explain the ${planName} plan and how it works for me.`;

/** V2 Choose Plan — uses EnrollmentContext, draft store, existing i18n. */
export function ChoosePlanPage() {
  const { t } = useTranslation();
  const { state, setSelectedPlan } = useEnrollment();
  const coreAI = useCoreAIModalOptional();

  const selectedPlan = state.selectedPlan;
  const isRothSelected = selectedPlan === ROTH_PLAN_ID;
  const isTraditionalSelected = selectedPlan === TRADITIONAL_PLAN_ID;

  const saveDraftForNextStep = useCallback(() => {
    const draft = loadEnrollmentDraft();
    const base = draft ?? {
      currentAge: state.currentAge ?? 30,
      retirementAge: state.retirementAge ?? 65,
      yearsToRetire: Math.max(0, (state.retirementAge ?? 65) - (state.currentAge ?? 30)),
      annualSalary: state.salary || 0,
      retirementLocation: "",
    };
    saveEnrollmentDraft({
      ...base,
      selectedPlanId: state.selectedPlan,
      selectedPlanDbId: state.selectedPlanDbId ?? undefined,
    });
  }, [state.selectedPlan, state.selectedPlanDbId, state.currentAge, state.retirementAge, state.salary]);

  const getDraftSnapshot = useCallback(
    () => ({
      selectedPlanId: state.selectedPlan,
      selectedPlanDbId: state.selectedPlanDbId ?? undefined,
    }),
    [state.selectedPlan, state.selectedPlanDbId]
  );

  return (
    <EnrollmentPageContent
      title={t("enrollment.choosePlanTitle")}
      subtitle={t("enrollment.choosePlanSubtitleStrategy")}
    >
      <div className="relative flex flex-col gap-8 pb-12">
        <section className="relative flex flex-col gap-6" aria-label={t("enrollment.selectPlanTitle")}>
          <PlanCardV2
            id="roth_401k"
            planId={ROTH_PLAN_ID}
            title={t("enrollment.planRoth401kTitle")}
            description={t("enrollment.roth401kDescFigma")}
            benefits={[
              t("enrollment.roth401kBenefit1"),
              t("enrollment.roth401kBenefit2"),
              t("enrollment.roth401kBenefit3"),
              t("enrollment.roth401kBenefit4"),
            ]}
            isSelected={isRothSelected}
            onSelect={() => setSelectedPlan(isRothSelected ? null : ROTH_PLAN_ID)}
            onAskAI={coreAI ? () => coreAI.openWithPrompt(PLAN_ASK_AI_PROMPT(t("enrollment.planRoth401kTitle"))) : undefined}
            icon={<TrendingUp className="w-6 h-6" />}
          />
          <PlanCardV2
            id="traditional_401k"
            planId={TRADITIONAL_PLAN_ID}
            title={t("enrollment.planTraditional401kTitle")}
            description={t("enrollment.traditional401kDescFigma")}
            benefits={[
              t("enrollment.traditional401kBenefit1"),
              t("enrollment.traditional401kBenefit2"),
              t("enrollment.traditional401kBenefit3"),
              t("enrollment.traditional401kBenefit4"),
            ]}
            isSelected={isTraditionalSelected}
            onSelect={() => setSelectedPlan(isTraditionalSelected ? null : TRADITIONAL_PLAN_ID)}
            onAskAI={coreAI ? () => coreAI.openWithPrompt(PLAN_ASK_AI_PROMPT(t("enrollment.planTraditional401kTitle"))) : undefined}
            icon={<Shield className="w-6 h-6" />}
          />
        </section>

        <section aria-label={t("enrollment.needHelpDecidingTitle")}>
          <HelpSectionCard
            title={t("enrollment.needHelpDecidingTitle")}
            description={t("enrollment.needHelpDecidingDesc")}
            buttonLabel={t("enrollment.viewDetailedComparison")}
            onButtonClick={coreAI ? () => coreAI.openWithPrompt("Compare Roth 401(k) and Traditional 401(k): tax treatment, withdrawals, and when each is best.") : undefined}
            icon={<Sparkles className="h-6 w-6" style={{ color: "var(--brand-primary)" }} />}
            buttonIcon={<Shield className="h-4 w-4" />}
            className="border-[var(--border-subtle)] bg-[var(--surface-2)]"
          />
        </section>

        <EnrollmentFooter
          primaryLabel={t("enrollment.continueToContribution")}
          primaryDisabled={selectedPlan == null}
          onPrimary={saveDraftForNextStep}
          getDraftSnapshot={getDraftSnapshot}
          stepPaths={ENROLLMENT_V2_STEP_PATHS}
          inContent
        />
      </div>
    </EnrollmentPageContent>
  );
}
