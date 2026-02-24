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
          const Icon = stepIcons[index] ?? FileCheck;

          return (
            <React.Fragment key={`${label}-${index}`}>
              <div className="flex items-center gap-3 shrink-0">
                <div
                  className={`
                    flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all duration-500
                    ${
                      isCompleted
                        ? "bg-[var(--color-success)] text-white scale-100"
                        : isCurrent
                          ? "text-white scale-110"
                          : "bg-[var(--color-surface)] border-2 border-[var(--color-border)] text-[var(--color-textSecondary)] scale-100"
                    }
                  `}
                  style={isCurrent ? { backgroundColor: "var(--color-primary)" } : undefined}
                >
                  {isCompleted ? (
                    <Check size={14} strokeWidth={3} />
                  ) : (
                    <Icon size={14} strokeWidth={isCurrent ? 2.5 : 2} />
                  )}
                </div>
                <span
                  className={`
                    text-sm font-medium whitespace-nowrap transition-colors duration-300
                    ${
                      isCurrent
                        ? "text-[var(--color-text)] font-bold block"
                        : isCompleted
                          ? "text-[var(--color-text)] hidden sm:block"
                          : "text-[var(--color-textSecondary)] hidden sm:block"
                    }
                  `}
                >
                  {label}
                </span>
              </div>
              {!isLast && (
                <div
                  className={`
                    flex-1 mx-2 sm:mx-4 h-0 border-t-2 transition-all duration-500
                    ${
                      isCompleted
                        ? "border-[var(--color-success)] border-solid"
                        : "border-[var(--color-border)] border-dotted"
                    }
                  `}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
