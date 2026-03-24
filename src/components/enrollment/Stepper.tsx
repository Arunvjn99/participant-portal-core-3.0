import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { DesktopStepper } from "./DesktopStepper";
import { MobileStepper } from "./MobileStepper";

export interface StepperProps {
  currentStepIndex: number;
  steps: readonly string[];
  onStepClick?: (index: number) => void;
  dense?: boolean;
  className?: string;
}

export function Stepper({
  currentStepIndex,
  steps,
  onStepClick,
  dense = false,
  className,
}: StepperProps) {
  const { t } = useTranslation();
  const n = steps.length;
  const safeIndex = n <= 0 ? 0 : Math.min(Math.max(currentStepIndex, 0), n - 1);
  const stepOfLabel =
    n > 0
      ? t("enrollment.stepperStepOf", { current: safeIndex + 1, total: n })
      : "";

  if (n === 0) return null;

  return (
    <div
      className={cn("w-full", className)}
      role="progressbar"
      aria-valuenow={safeIndex + 1}
      aria-valuemin={1}
      aria-valuemax={n}
      aria-label={stepOfLabel}
    >
      <div className="hidden md:block">
        <DesktopStepper
          currentStepIndex={currentStepIndex}
          steps={steps}
          onStepClick={onStepClick}
          dense={dense}
        />
      </div>
      <div className="md:hidden">
        <MobileStepper
          currentStepIndex={currentStepIndex}
          steps={steps}
          progressLabel={stepOfLabel}
        />
      </div>
    </div>
  );
}
