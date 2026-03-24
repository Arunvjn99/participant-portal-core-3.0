import type { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Stepper } from "./Stepper";

export interface EnrollmentHeaderWithStepperProps {
  /** Current step index (0-based) within the resolved steps. */
  activeStep: number;
  /** Total number of steps (when using dynamic steps). When provided, stepLabels should match length. */
  totalSteps?: number;
  /** Labels for each step; when provided, used instead of default 5-step labels. */
  stepLabels?: string[];
  /** Optional icon per step (kept for API compatibility; not shown in the unified stepper). */
  stepIcons?: LucideIcon[];
  /** Tighter subheader + stepper (less vertical padding, smaller step nodes). */
  dense?: boolean;
  /** Override inner width/padding (e.g. `max-w-full px-0` when nested in a narrow column). */
  innerClassName?: string;
}

const DEFAULT_STEP_LABEL_KEYS = [
  "enrollment.stepperPlan",
  "enrollment.stepperContribution",
  "enrollment.stepperAutoIncrease",
  "enrollment.stepperInvestment",
  "enrollment.stepperReview",
] as const;

/**
 * Enrollment stepper bar — designed to be used as a `subHeader` slot in DashboardLayout.
 * The global DashboardHeader is rendered separately as the main `header`.
 * This component only renders the stepper progress bar.
 */
export function EnrollmentHeaderWithStepper({
  activeStep,
  totalSteps: totalStepsProp,
  stepLabels: stepLabelsProp,
  stepIcons: _stepIcons,
  dense = false,
  innerClassName,
}: EnrollmentHeaderWithStepperProps) {
  const { t } = useTranslation();
  const stepLabels =
    stepLabelsProp ?? DEFAULT_STEP_LABEL_KEYS.map((key) => t(key));
  const totalSteps = totalStepsProp ?? stepLabels.length;
  const steps = stepLabels.slice(0, totalSteps);

  return (
    <div className={`bg-transparent ${dense ? "mb-3 py-3" : "mb-4 py-4"}`}>
      <div
        className={
          innerClassName ??
          "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"
        }
      >
        <Stepper currentStepIndex={activeStep} steps={steps} dense={dense} />
      </div>
    </div>
  );
}
