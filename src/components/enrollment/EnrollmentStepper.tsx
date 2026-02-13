import * as React from "react";
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
  const labels = stepLabels as string[];
  const stepsCount = totalSteps ?? labels.length;
  const safeActive = Math.min(Math.max(currentStep, 0), stepsCount - 1);

  if (compact) {
    return (
      <div
        className={className}
        role="progressbar"
        aria-valuenow={safeActive + 1}
        aria-valuemin={1}
        aria-valuemax={stepsCount}
        aria-label={`Step ${safeActive + 1} of ${stepsCount}`}
      >
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
          Step {safeActive + 1} of {stepsCount}
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
      aria-label={`Step ${safeActive + 1} of ${stepsCount}`}
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
                        ? "bg-emerald-500 text-white scale-100"
                        : isCurrent
                          ? "bg-indigo-600 text-white shadow-[0_0_0_4px_rgba(99,102,241,0.1)] scale-110 dark:bg-indigo-500"
                          : "bg-white border-2 border-slate-200 text-slate-400 scale-100 dark:bg-slate-800 dark:border-slate-600"
                    }
                  `}
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
                        ? "text-slate-900 font-bold block dark:text-slate-100"
                        : isCompleted
                          ? "text-slate-700 hidden sm:block dark:text-slate-300"
                          : "text-slate-400 hidden sm:block dark:text-slate-500"
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
                        ? "border-emerald-500 border-solid"
                        : "border-slate-200 border-dotted dark:border-slate-600"
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
