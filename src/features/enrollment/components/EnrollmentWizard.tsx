import { useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEnrollmentStore, STEP_SEGMENTS, STEP_COUNT } from "../store/useEnrollmentStore";
import { isStepValid } from "../utils/validation";
import { StepIndicator } from "./StepIndicator";
import { WizardFooter } from "./WizardFooter";
import { PlanStep } from "../steps/PlanStep";
import { ContributionStep } from "../steps/ContributionStep";
import { SourceStep } from "../steps/SourceStep";
import { AutoIncreaseStep } from "../steps/AutoIncreaseStep";
import InvestmentScreen from "@/modules/enrollment/v1/screens/InvestmentScreen";
import { ReadinessStep } from "../steps/ReadinessStep";
import { ReviewStep } from "../steps/ReviewStep";

const SCREENS = [
  PlanStep,
  ContributionStep,
  SourceStep,
  AutoIncreaseStep,
  InvestmentScreen,
  ReadinessStep,
  ReviewStep,
] as const;

const STEP_LABELS = [
  "Plan", "Contribution", "Source", "Auto Increase",
  "Investment", "Readiness", "Review",
];

function segmentFromPath(pathname: string): string | null {
  const match = pathname.match(/\/enrollment\/([^/]+)/);
  return match?.[1] ?? null;
}

export function EnrollmentWizard() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const store = useEnrollmentStore();
  const { currentStep, nextStep, prevStep, goToStep } = store;

  const segment = segmentFromPath(pathname);
  const segmentIndex = segment ? STEP_SEGMENTS.indexOf(segment as typeof STEP_SEGMENTS[number]) : -1;

  if (segmentIndex >= 0 && segmentIndex !== currentStep) {
    goToStep(segmentIndex);
  }

  const stepValid = useMemo(() => isStepValid(currentStep, store), [currentStep, store]);
  const isLastStep = currentStep === STEP_COUNT - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = useCallback(() => {
    if (!stepValid) return;
    if (isLastStep) {
      navigate("/dashboard/post-enrollment");
      return;
    }
    nextStep();
    const nextIndex = Math.min(currentStep + 1, STEP_COUNT - 1);
    navigate(`/enrollment/${STEP_SEGMENTS[nextIndex]}`);
  }, [stepValid, isLastStep, nextStep, currentStep, navigate]);

  const handleBack = useCallback(() => {
    if (isFirstStep) return;
    prevStep();
    const prevIndex = Math.max(currentStep - 1, 0);
    navigate(`/enrollment/${STEP_SEGMENTS[prevIndex]}`);
  }, [isFirstStep, prevStep, currentStep, navigate]);

  const handleStepClick = useCallback((index: number) => {
    if (index < currentStep) {
      goToStep(index);
      navigate(`/enrollment/${STEP_SEGMENTS[index]}`);
    }
  }, [currentStep, goToStep, navigate]);

  const StepScreen = SCREENS[currentStep] ?? SCREENS[0];

  return (
    <div className="ew-shell">
      <div className="ew-header">
        <StepIndicator
          steps={STEP_LABELS}
          currentStep={currentStep}
          onStepClick={handleStepClick}
        />
      </div>

      <div className="ew-content">
        <StepScreen />
      </div>

      <WizardFooter
        onBack={handleBack}
        onNext={handleNext}
        backDisabled={isFirstStep}
        nextDisabled={!stepValid}
        nextLabel={isLastStep ? "Submit Enrollment" : "Continue"}
      />
    </div>
  );
}
