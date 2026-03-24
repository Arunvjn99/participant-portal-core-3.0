import { Target, PiggyBank, TrendingUp, BarChart2, FileCheck, type LucideIcon } from "lucide-react";
import { Stepper } from "./Stepper";

/** Default enrollment steps: Plan → Contribution → Auto Increase → Investment → Review */
export const ENROLLMENT_STEP_LABELS = [
  "Plan",
  "Contribution",
  "Auto Increase",
  "Investment",
  "Review",
] as const;

const DEFAULT_ICONS: LucideIcon[] = [
  Target,
  PiggyBank,
  TrendingUp,
  BarChart2,
  FileCheck,
];

export interface EnrollmentStepperProps {
  /** Current step index (0-based). Controlled externally. */
  currentStep: number;
  /** Total number of steps (default: from stepLabels length). */
  totalSteps?: number;
  /** Step labels (default: Plan, Contribution, Auto Increase, Investment, Review). */
  stepLabels?: readonly string[];
  /** Optional icons per step (kept for API compatibility; the unified stepper uses numbers + check). */
  stepIcons?: LucideIcon[];
  /** @deprecated Responsive layout is handled by Stepper (desktop md+, mobile below md). */
  compact?: boolean;
  /** Tighter circles and labels on desktop. */
  dense?: boolean;
  /** Optional class name for the container. */
  className?: string;
  /** Optional page title (unused; kept for API compatibility). */
  title?: string;
  /** Optional page subtitle (unused; kept for API compatibility). */
  subtitle?: string;
}

/**
 * Enrollment progress UI — delegates to {@link Stepper} (desktop horizontal + mobile summary bar).
 */
export function EnrollmentStepper({
  currentStep,
  totalSteps,
  stepLabels = ENROLLMENT_STEP_LABELS,
  compact: _compact = false,
  dense = false,
  className,
  stepIcons: _stepIcons = DEFAULT_ICONS,
  title: _title,
  subtitle: _subtitle,
}: EnrollmentStepperProps) {
  const labels = stepLabels as string[];
  const stepsCount = totalSteps ?? labels.length;
  const steps = labels.slice(0, stepsCount);

  return (
    <Stepper
      currentStepIndex={currentStep}
      steps={steps}
      dense={dense}
      className={className}
    />
  );
}
