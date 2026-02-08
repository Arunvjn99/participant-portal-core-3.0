interface StepProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabel?: string;
  title?: string;
  subtitle?: string;
}

/**
 * Compact circular progress indicator matching Figma.
 * Shows "current / total" with a circular progress ring (green segment).
 * Left-aligned with page title.
 */
export const StepProgressIndicator = ({
  currentStep,
  totalSteps,
  stepLabel,
  title,
  subtitle,
}: StepProgressIndicatorProps) => {
  const percent = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;
  const circumference = 2 * Math.PI * 18;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div
      className="step-progress-indicator"
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      aria-label={`Step ${currentStep} of ${totalSteps}${stepLabel ? `: ${stepLabel}` : ""}`}
    >
      <div className="step-progress-indicator__ring-wrap">
        <svg
          className="step-progress-indicator__ring"
          viewBox="0 0 44 44"
          aria-hidden="true"
        >
          <circle
            className="step-progress-indicator__ring-bg"
            cx="22"
            cy="22"
            r="18"
            fill="none"
            strokeWidth="2"
          />
          <circle
            className="step-progress-indicator__ring-fill"
            cx="22"
            cy="22"
            r="18"
            fill="none"
            strokeWidth="2"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 22 22)"
          />
        </svg>
        <span className="step-progress-indicator__text">
          {currentStep}/{totalSteps}
        </span>
      </div>
      <div className="step-progress-indicator__label">
        {stepLabel && (
          <span className="step-progress-indicator__step-label">{stepLabel}</span>
        )}
        {title && (
          <h1 className="step-progress-indicator__title">{title}</h1>
        )}
        {subtitle && (
          <p className="step-progress-indicator__subtitle">{subtitle}</p>
        )}
      </div>
    </div>
  );
};
