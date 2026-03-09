import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Shield, TrendingUp } from "lucide-react";
import { useEnrollment } from "../../enrollment/context/EnrollmentContext";
import { loadEnrollmentDraft, saveEnrollmentDraft } from "../../enrollment/enrollmentDraftStore";
import { useCoreAIModalOptional } from "../../context/CoreAIModalContext";
import { EnrollmentPageContent } from "../../components/enrollment/EnrollmentPageContent";
import { EnrollmentFooter } from "../../components/enrollment/EnrollmentFooter";
import { SectionHeadingWithAccent } from "../../components/ui/SectionHeadingWithAccent";
import { PlanCard } from "../components/PlanCard";
import { HelpDecisionCard } from "../components/HelpDecisionCard";
import type { SelectedPlanId } from "../../enrollment/context/EnrollmentContext";
import { ENROLLMENT_V2_STEP_PATHS } from "../../features/enrollment/config/stepConfig";

const ROTH_PLAN_ID: SelectedPlanId = "roth_401k";
const TRADITIONAL_PLAN_ID: SelectedPlanId = "traditional_401k";

const PLAN_ASK_AI_PROMPT = (planName: string) =>
  `Explain the ${planName} plan and how it works for me.`;

/** V2 Choose Plan — Figma parity: gradient heading, PlanCard, HelpDecisionCard, background, typography, footer arrow. */
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
      headerContent={
        <SectionHeadingWithAccent
          title={t("enrollment.choosePlanTitle")}
          subtitle={t("enrollment.choosePlanSubtitleStrategy")}
          accentPosition="left"
        />
      }
    >
      <div
        className="relative min-h-[70vh] rounded-2xl overflow-hidden shadow-sm border border-[var(--enroll-card-border)]"
        style={{ background: "var(--enroll-card-bg)" }}
      >
        <div className="relative flex flex-col gap-6 p-6 pb-12">
          <section
            className="grid gap-6 min-w-0"
            role="radiogroup"
            aria-label={t("enrollment.selectPlanTitle")}
          >
            <PlanCard
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
              icon={TrendingUp}
            />
            <PlanCard
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
              icon={Shield}
            />
          </section>

          <HelpDecisionCard
            title={t("enrollment.needHelpDecidingTitle")}
            description={t("enrollment.needHelpDecidingDesc")}
            buttonLabel={t("enrollment.viewDetailedComparison")}
            onButtonClick={
              coreAI
                ? () =>
                    coreAI.openWithPrompt(
                      "Compare Roth 401(k) and Traditional 401(k): tax treatment, withdrawals, and when each is best."
                    )
                : undefined
            }
          />

          <EnrollmentFooter
            primaryLabel={t("enrollment.continueToContribution")}
            primaryDisabled={selectedPlan == null}
            onPrimary={saveDraftForNextStep}
            getDraftSnapshot={getDraftSnapshot}
            stepPaths={ENROLLMENT_V2_STEP_PATHS}
            inContent
            primaryShowArrow
          />
        </div>
      </div>
    </EnrollmentPageContent>
  );
}
