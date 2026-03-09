import * as React from "react";
import { useTranslation } from "react-i18next";
import { Check, Target, PiggyBank, TrendingUp, BarChart2, FileCheck, type LucideIcon } from "lucide-react";

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
  /** Optional icons per step (default: Target, PiggyBank, TrendingUp, BarChart2, FileCheck). */
  stepIcons?: LucideIcon[];
  /** When true, show compact "Step X of Y" on small screens. */
  compact?: boolean;
  /** Optional class name for the container. */
  className?: string;
  /** Optional page title (unused; kept for API compatibility). */
  title?: string;
  /** Optional page subtitle (unused; kept for API compatibility). */
  subtitle?: string;
}

/**
 * Reusable enrollment stepper – design from intelligent-plan-selector.
 * Completed = emerald + check; Current = indigo + icon + scale; Upcoming = grey outline.
 * Connector: completed = solid emerald; else dotted grey.
 */
export function EnrollmentStepper({
  currentStep,
  totalSteps,
  stepLabels = ENROLLMENT_STEP_LABELS,
  stepIcons = DEFAULT_ICONS,
  compact = false,
  className,
  title: _title,
  subtitle: _subtitle,
}: EnrollmentStepperProps) {
  const { t } = useTranslation();
  const labels = stepLabels as string[];
  const stepsCount = totalSteps ?? labels.length;
  const safeActive = Math.min(Math.max(currentStep, 0), stepsCount - 1);
  const stepOfLabel = t("enrollment.stepperStepOf", { current: safeActive + 1, total: stepsCount });

  if (compact) {
    return (
      <div
        className={className}
        role="progressbar"
        aria-valuenow={safeActive + 1}
        aria-valuemin={1}
        aria-valuemax={stepsCount}
        aria-label={stepOfLabel}
      >
        <span className="text-sm font-medium text-[var(--color-textSecondary)]">
          {stepOfLabel}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`w-full max-w-4xl mx-auto px-4 md:px-0 ${className ?? ""}`}
      role="progressbar"
      aria-valuenow={safeActive + 1}
      aria-valuemin={1}
      aria-valuemax={stepsCount}
      aria-label={stepOfLabel}
    >
      <div className="flex items-center justify-between w-full">
        {labels.slice(0, stepsCount).map((label, index) => {
          const isLast = index === stepsCount - 1;
          const isCompleted = index < safeActive;
          const isCurrent = index === safeActive;

          return (
            <React.Fragment key={`${label}-${index}`}>
              <div className="flex items-center gap-3 shrink-0">
                <div
                  className={`
                    flex items-center justify-center w-9 h-9 rounded-full text-sm font-semibold transition-all duration-500
                    ${
                      isCompleted
                        ? "text-white scale-100"
                        : isCurrent
                          ? "text-white scale-100"
                          : "text-white scale-100"
                    }
                  `}
                  style={{
                    backgroundColor: isCompleted || isCurrent ? "var(--enroll-brand)" : "var(--enroll-text-muted)",
                  }}
                >
                  {isCompleted ? (
                    <Check size={20} strokeWidth={3} />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span
                  className={`
                    text-base font-medium whitespace-nowrap transition-colors duration-300
                    ${isCurrent ? "font-medium" : isCompleted ? "hidden sm:block" : "hidden sm:block"}
                  `}
                  style={{
                    color: isCurrent || isCompleted ? "var(--enroll-text-primary)" : "var(--enroll-text-muted)",
                  }}
                >
                  {label}
                </span>
              </div>
              {!isLast && (
                <div className="flex-1 min-w-0 mx-3 h-px" style={{ backgroundColor: "var(--enroll-card-border)" }} aria-hidden />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
