import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { HeaderStepper } from "./HeaderStepper";

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

/**
 * Enrollment stepper bar — uses the old DealShip-style HeaderStepper (small circles, thin connectors, inline labels).
 * Rendered as `subHeader` in DashboardLayout. Supports 5- or 6-step flows via stepLabels.
 */
const DEFAULT_STEP_LABEL_KEYS_5 = [
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
  const stepLabels =
    stepLabelsProp ??
    DEFAULT_STEP_LABEL_KEYS_5.map((key) => t(key));
  const totalSteps = totalStepsProp ?? stepLabels.length;
  const labels = stepLabels.slice(0, totalSteps);

  return (
    <div className="bg-[var(--color-surface)] py-3 mb-0">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HeaderStepper
          activeStep={activeStep}
          compact={compact}
          stepLabels={labels}
        />
      </div>
    </div>
  );
}
