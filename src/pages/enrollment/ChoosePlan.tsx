import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useEnrollment } from "../../enrollment/context/EnrollmentContext";
import { loadEnrollmentDraft, saveEnrollmentDraft } from "../../enrollment/enrollmentDraftStore";
import { useCoreAIModalOptional } from "../../context/CoreAIModalContext";
import { EnrollmentPageContent } from "../../components/enrollment/EnrollmentPageContent";
import { PlanCard } from "../../components/enrollment/PlanCard";
import { EnrollmentFooter } from "../../components/enrollment/EnrollmentFooter";
import { HelpSectionCard } from "../../components/ui/HelpSectionCard";
import type { SelectedPlanId } from "../../enrollment/context/EnrollmentContext";
import { TrendingUp, Shield, Sparkles, Eye } from "lucide-react";

const PLAN_ASK_AI_PROMPT = (planName: string) =>
  `Explain the ${planName} plan and how it works for me.`;

const ROTH_PLAN_ID: SelectedPlanId = "roth_401k";
const TRADITIONAL_PLAN_ID: SelectedPlanId = "traditional_401k";

/** Step 1: Choose Plan - exact Figma layout. Persists selection in enrollment context. */
export const ChoosePlan = () => {
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
    <EnrollmentPageContent>
      {/* Reference layout: decorative bg, gradient header, plan cards, help section */}
      <div className="choose-plan-page__content relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8 pb-12">
        {/* Decorative background – theme-aware */}
        <div
          className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ background: "linear-gradient(to bottom right, var(--enroll-brand), var(--enroll-accent))" }}
        />
        <div
          className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20 translate-x-1/2 translate-y-1/2 pointer-events-none"
          style={{ background: "linear-gradient(to top left, var(--enroll-accent), var(--enroll-brand))" }}
        />
        <div
          className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full blur-2xl opacity-20 pointer-events-none"
          style={{ background: "linear-gradient(to bottom right, var(--enroll-brand), transparent)" }}
        />

        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative">
            <div
              className="absolute -left-4 top-0 w-1 h-16 rounded-full"
              style={{ background: "linear-gradient(to bottom, var(--enroll-brand), var(--enroll-accent))" }}
            />
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(to right, var(--enroll-brand), var(--enroll-accent))" }}
            >
              {t("enrollment.choosePlanTitle")}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg"
              style={{ color: "var(--enroll-text-secondary)" }}
            >
              {t("enrollment.choosePlanSubtitleStrategy")}
            </motion.p>
          </div>
        </motion.div>

        <section className="relative flex flex-col gap-6" aria-label={t("enrollment.selectPlanTitle")}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <PlanCard
              id="roth_401k"
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
            icon={<TrendingUp className="h-6 w-6 choose-plan-icon-roth" strokeWidth={2} aria-hidden />}
            askAriaLabel={t("enrollment.askAiAboutPlan")}
            selectedLabel={t("enrollment.selected")}
            selectPlanLabel={t("enrollment.selectPlanButton")}
            keyBenefitsLabel={t("enrollment.keyBenefits")}
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
            <PlanCard
              id="traditional_401k"
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
            icon={<Shield className="h-6 w-6 choose-plan-icon-traditional" strokeWidth={2} aria-hidden />}
            askAriaLabel={t("enrollment.askAiAboutPlan")}
            selectedLabel={t("enrollment.selected")}
            selectPlanLabel={t("enrollment.selectPlanButton")}
            keyBenefitsLabel={t("enrollment.keyBenefits")}
            />
          </motion.div>
        </section>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="relative"
        >
          <HelpSectionCard
            title={t("enrollment.needHelpDecidingTitle")}
            description={t("enrollment.needHelpDecidingDesc")}
            buttonLabel={t("enrollment.viewDetailedComparison")}
            onButtonClick={undefined}
            icon={<Sparkles className="h-6 w-6" aria-hidden />}
            buttonIcon={<Eye className="h-4 w-4" aria-hidden />}
            className="help-section-card--enroll border border-[var(--enroll-card-border)] bg-[var(--enroll-soft-bg)] p-6 sm:p-8"
          />
        </motion.div>

        <EnrollmentFooter
          primaryLabel={t("enrollment.continueToContribution")}
          primaryDisabled={selectedPlan == null}
          onPrimary={saveDraftForNextStep}
          getDraftSnapshot={getDraftSnapshot}
          inContent
        />
      </div>
    </EnrollmentPageContent>
  );
};
