import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  BarChart2,
  FileCheck,
  LineChart,
  PiggyBank,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { EnrollmentHeaderWithStepper } from "@/components/enrollment/EnrollmentHeaderWithStepper";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { StepFooter } from "../components/StepFooter";
import { isEnrollmentStepValid } from "../flow/stepValidation";
import { ENROLLMENT_STEP_COUNT, ENROLLMENT_STEPS } from "../flow/steps";
import { ENROLLMENT_V1_STEPPER_LABEL_KEYS } from "../flow/v1StepperLabels";
import {
  pathForWizardStep,
  V1_ENROLLMENT_AUTO_INCREASE_DECISION_PATH,
  wizardStepIndexFromSegment,
} from "../flow/v1WizardPaths";
import AutoIncreaseScreen from "../screens/AutoIncreaseScreen";
import ChoosePlanScreen from "../screens/ChoosePlanScreen";
import ContributionScreen from "../screens/ContributionScreen";
import InvestmentScreen from "../screens/InvestmentScreen";
import ReadinessScreen from "../screens/ReadinessScreen";
import ReviewScreen from "../screens/ReviewScreen";
import SourceScreen from "../screens/SourceScreen";
import { useEnrollmentStore } from "../store/useEnrollmentStore";
import { SuccessEnrollmentModal } from "@/components/enrollment/SuccessEnrollmentModal";
import { useUser } from "@/context/UserContext";
import { markEnrollmentCompleted } from "@/services/enrollmentService";
import { EnrollmentContainer } from "./EnrollmentContainer";

const POST_ENROLLMENT_DASHBOARD_PATH = "/dashboard/post-enrollment";

const V1_STEP_ICONS = [
  Target,
  PiggyBank,
  Wallet,
  TrendingUp,
  BarChart2,
  LineChart,
  FileCheck,
] as const;

const SCREENS = [
  ChoosePlanScreen,
  ContributionScreen,
  SourceScreen,
  AutoIncreaseScreen,
  InvestmentScreen,
  ReadinessScreen,
  ReviewScreen,
] as const;

/**
 * Enrollment V1 — compact column: stepper + scrollable step + sticky footer inside EnrollmentContainer.
 */
export function EnrollmentV1Layout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { refreshEnrollment } = useUser();
  const state = useEnrollmentStore();
  const goToStep = useEnrollmentStore((s) => s.goToStep);
  const nextStep = useEnrollmentStore((s) => s.nextStep);
  const prevStep = useEnrollmentStore((s) => s.prevStep);

  const wizardRest = pathname.replace(/^\/v1\/enrollment\/?/, "").replace(/\/$/, "");
  const pathStepIndex = wizardStepIndexFromSegment(wizardRest);
  const stepIndex = pathStepIndex ?? 0;

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log("[Enrollment] modules EnrollmentV1Layout (v1 wizard steps — not pages/Versioned*)", {
        pathname,
        stepIndex,
      });
    }
  }, [pathname, stepIndex]);

  useLayoutEffect(() => {
    if (pathStepIndex == null) {
      navigate(pathForWizardStep(0), { replace: true });
      return;
    }
    const stored = useEnrollmentStore.getState().currentStep;
    if (pathStepIndex !== stored) {
      goToStep(pathStepIndex);
    }
  }, [pathname, pathStepIndex, goToStep, navigate]);

  const StepScreen = SCREENS[stepIndex] ?? ChoosePlanScreen;

  const stepValid = isEnrollmentStepValid(stepIndex, state);
  const isFirst = stepIndex <= 0;
  const isLast = stepIndex >= ENROLLMENT_STEP_COUNT - 1;

  const stepLabels = ENROLLMENT_V1_STEPPER_LABEL_KEYS.map((key) => t(key));

  const stepperActive = Math.min(
    Math.max(stepIndex, 0),
    ENROLLMENT_STEP_COUNT - 1,
  );

  const finishEnrollment = async () => {
    setShowSuccessModal(false);
    const { ok, error } = await markEnrollmentCompleted();
    if (import.meta.env.DEV && !ok) console.warn("[enrollment] markEnrollmentCompleted:", error);
    await refreshEnrollment();
    navigate(POST_ENROLLMENT_DASHBOARD_PATH);
  };

  const handleNext = () => {
    if (showSuccessModal) return;
    if (!stepValid) return;
    if (isLast) {
      setShowSuccessModal(true);
      return;
    }
    nextStep();
    navigate(pathForWizardStep(useEnrollmentStore.getState().currentStep));
  };

  const handleBack = () => {
    if (wizardRest === "auto-increase/skip") {
      navigate(V1_ENROLLMENT_AUTO_INCREASE_DECISION_PATH);
      return;
    }
    if (wizardRest === "auto-increase/config") {
      navigate(V1_ENROLLMENT_AUTO_INCREASE_DECISION_PATH);
      return;
    }
    if (isFirst) return;
    prevStep();
    navigate(pathForWizardStep(useEnrollmentStore.getState().currentStep));
  };

  const stepper = (
    <EnrollmentHeaderWithStepper
      activeStep={stepperActive}
      totalSteps={ENROLLMENT_STEP_COUNT}
      stepLabels={stepLabels}
      stepIcons={[...V1_STEP_ICONS]}
      dense
      innerClassName="w-full max-w-full px-0"
    />
  );

  const stepFooter = (
    <StepFooter
      onBack={handleBack}
      onNext={handleNext}
      backLabel={t("enrollment.footerBack")}
      nextLabel={t("enrollment.footerNext")}
      finishLabel={t("enrollment.footerFinish")}
      nextDisabled={!stepValid}
      isFirstStep={isFirst}
      isLastStep={isLast}
    />
  );

  return (
    <DashboardLayout
      header={<DashboardHeader />}
      transparentBackground
      fullWidthChildren
      hideFooter
      allowMainOverflowX
    >
      <div className="flex h-[calc(100dvh-3.5rem)] max-h-[calc(100dvh-3.5rem)] w-full min-h-0 min-w-0 flex-col">
        <EnrollmentContainer stepper={stepper} footer={stepFooter} className="min-h-0 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="flex min-w-0 flex-col"
            >
              <StepScreen />
            </motion.div>
          </AnimatePresence>
        </EnrollmentContainer>
      </div>
      <SuccessEnrollmentModal
        open={showSuccessModal}
        onClose={finishEnrollment}
        onViewPlanDetails={finishEnrollment}
      />
    </DashboardLayout>
  );
}
