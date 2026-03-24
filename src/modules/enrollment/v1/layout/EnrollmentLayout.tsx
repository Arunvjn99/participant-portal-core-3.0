import { AnimatePresence, motion } from "framer-motion";
import { useLayoutEffect, useState } from "react";
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
  wizardStepIndexFromSegment,
} from "../flow/v1WizardPaths";
import { AutoIncrease } from "../screens/AutoIncrease";
import { ContributionSetup } from "../screens/ContributionSetup";
import { ContributionSource } from "../screens/ContributionSource";
import { InvestmentStrategy } from "../screens/InvestmentStrategy";
import { ChoosePlan } from "../screens/ChoosePlan";
import { RetirementReadiness } from "../screens/RetirementReadiness";
import { Review } from "../screens/Review";
import { useEnrollmentStore } from "../store/useEnrollmentStore";
import { SuccessEnrollmentModal } from "@/components/enrollment/SuccessEnrollmentModal";
import { EnrollmentContainer } from "./EnrollmentContainer";

const POST_ENROLLMENT_DASHBOARD_PATH = "/dashboard/overview";

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
  ChoosePlan,
  ContributionSetup,
  ContributionSource,
  AutoIncrease,
  InvestmentStrategy,
  RetirementReadiness,
  Review,
] as const;

/**
 * Enrollment V1 — compact column: stepper + scrollable step + sticky footer inside EnrollmentContainer.
 */
export function EnrollmentV1Layout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const state = useEnrollmentStore();
  const goToStep = useEnrollmentStore((s) => s.goToStep);
  const nextStep = useEnrollmentStore((s) => s.nextStep);
  const prevStep = useEnrollmentStore((s) => s.prevStep);

  const segment = pathname.replace(/^\/v1\/enrollment\/?/, "").split("/")[0];
  const pathStepIndex = wizardStepIndexFromSegment(segment);
  const stepIndex = pathStepIndex ?? 0;

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

  const StepScreen = SCREENS[stepIndex] ?? ChoosePlan;

  const stepValid = isEnrollmentStepValid(stepIndex, state);
  const isFirst = stepIndex <= 0;
  const isLast = stepIndex >= ENROLLMENT_STEP_COUNT - 1;

  const stepLabels = ENROLLMENT_V1_STEPPER_LABEL_KEYS.map((key) => t(key));

  const stepperActive = Math.min(
    Math.max(stepIndex, 0),
    ENROLLMENT_STEP_COUNT - 1,
  );

  const finishEnrollment = () => {
    setShowSuccessModal(false);
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
    >
      <div className="flex h-[calc(100dvh-3.5rem)] max-h-[calc(100dvh-3.5rem)] w-full min-h-0 flex-col">
        <EnrollmentContainer stepper={stepper} footer={stepFooter} className="min-h-0 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={ENROLLMENT_STEPS[stepIndex] ?? stepIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="flex flex-col gap-3"
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
