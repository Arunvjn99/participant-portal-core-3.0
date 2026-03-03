import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { EnrollmentStepper } from "./EnrollmentStepper";

export interface EnrollmentHeaderWithStepperProps {
  /** Current step index (0-based) within the resolved steps. */
  activeStep: number;
  /** Total number of steps (when using dynamic steps). When provided, stepLabels should match length. */
  totalSteps?: number;
  /** Labels for each step; when provided, used instead of default 5-step labels. */
  stepLabels?: string[];
}

function useCompactStepper() {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 600px)");
    const update = () => setCompact(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return compact;
}

function useDesktopStepper() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return desktop;
}

/**
 * Enrollment stepper bar — designed to be used as a `subHeader` slot in DashboardLayout.
 * The global DashboardHeader is rendered separately as the main `header`.
 * This component only renders the stepper progress bar.
 */
const DEFAULT_STEP_LABEL_KEYS = [
  "enrollment.stepperPlan",
  "enrollment.stepperContribution",
  "enrollment.stepperAutoIncrease",
  "enrollment.stepperInvestment",
  "enrollment.stepperReview",
] as const;

export function EnrollmentHeaderWithStepper({
  activeStep,
  totalSteps: totalStepsProp,
  stepLabels: stepLabelsProp,
}: EnrollmentHeaderWithStepperProps) {
  const { t } = useTranslation();
  const compact = useCompactStepper();
  const desktop = useDesktopStepper();
  const stepLabels =
    stepLabelsProp ??
    DEFAULT_STEP_LABEL_KEYS.map((key) => t(key));
  const totalSteps = totalStepsProp ?? stepLabels.length;

  return (
    <div className="bg-[var(--color-surface)] py-3 mb-0">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <EnrollmentStepper
          currentStep={activeStep}
          totalSteps={totalSteps}
          stepLabels={stepLabels}
          compact={!desktop && compact}
        />
      </div>
    </div>
  );
}
