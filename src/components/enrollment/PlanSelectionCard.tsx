import { DashboardCard } from "../dashboard/DashboardCard";
import Button from "../ui/Button";
import { cn } from "@/lib/utils";

interface PlanSelectionCardProps {
  planId: string;
  planName: string;
  description: string;
  matchInfo: string;
  benefits: string[];
  isRecommended?: boolean;
  fitPercentage?: number;
  isSelected?: boolean;
  onSelect: () => void;
}

/**
 * PlanSelectionCard - Best Fit: system recommendation treatment.
 * Other plans: de-emphasized secondary options.
 */
export const PlanSelectionCard = ({
  planId,
  planName,
  description,
  matchInfo,
  benefits,
  isRecommended = false,
  fitPercentage,
  isSelected = false,
  onSelect,
}: PlanSelectionCardProps) => {
  if (isRecommended) {
    return (
      <DashboardCard
        isSelected={isSelected}
        className="plan-selection-card--standard-wrapper border-2 bg-[var(--color-surface)] p-5 md:p-6"
        style={{ borderColor: "var(--color-accent, #00bba7)" }}
      >
        <div
          className="flex flex-col gap-4"
          role="option"
          aria-selected={isSelected}
          aria-label={`${planName}, Recommended`}
        >
          <div className="plan-selection-card__header">
            <div className="plan-selection-card__header-left">
              <div className="mb-2 flex items-center gap-3">
                {fitPercentage !== undefined && (
                  <span
                    className="inline-flex h-[30px] items-center rounded-full border px-[13px] text-[12px] font-semibold leading-4"
                    style={{
                      borderColor: "var(--color-success, #a4f4cf)",
                      backgroundColor: "var(--color-success, #16a34a)1a",
                      color: "var(--color-success, #007a55)",
                    }}
                  >
                    {fitPercentage}% Fit
                  </span>
                )}
                <span className="text-[12px] leading-4" style={{ color: "var(--color-text-secondary)" }}>Based on your input</span>
              </div>
              <h3 className="plan-selection-card__title">{planName}</h3>
              <p className="plan-selection-card__match-info">{matchInfo}</p>
            </div>
            <div className="plan-selection-card__header-action">
              {isSelected ? (
                <span className="plan-selection-card__button plan-selection-card__button--selected" aria-live="polite">
                  <svg
                    className="plan-selection-card__button-check"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M16 6l-8 8-4-4" />
                  </svg>
                  Selected
                </span>
              ) : (
                <Button
                  onClick={onSelect}
                  className="plan-selection-card__button plan-selection-card__button--secondary"
                  aria-label={`Select ${planName}`}
                >
                  Select Plan
                </Button>
              )}
            </div>
          </div>

          <p className="plan-selection-card__description">{description}</p>

          {benefits.length > 0 && (
            <div className="plan-selection-card__benefits">
              {benefits.map((benefit, index) => (
                <span key={index} className="plan-selection-card__benefit-chip">
                  {benefit}
                </span>
              ))}
            </div>
          )}
        </div>
      </DashboardCard>
    );
  }

  const cardContent = (
    <div
      className={`plan-selection-card ${isRecommended ? "plan-selection-card--recommended" : "plan-selection-card--standard"} ${isSelected ? "plan-selection-card--selected" : ""}`}
      role="option"
      aria-selected={isSelected}
      aria-label={`${planName}${isRecommended ? ", Recommended" : ""}`}
    >
      {!isRecommended && (
        <>
          <div className="plan-selection-card__header">
            <div className="plan-selection-card__header-left">
              <h3 className="plan-selection-card__title">{planName}</h3>
            </div>
            <div className="plan-selection-card__header-action">
              {isSelected ? (
                <span
                  className="plan-selection-card__button plan-selection-card__button--selected"
                  aria-live="polite"
                >
                  <svg
                    className="plan-selection-card__button-check"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M16 6l-8 8-4-4" />
                  </svg>
                  Selected
                </span>
              ) : (
                <Button
                  onClick={onSelect}
                  className="plan-selection-card__button plan-selection-card__button--secondary"
                  aria-label={`Select ${planName}`}
                >
                  Select Plan
                </Button>
              )}
            </div>
          </div>
          <p className="plan-selection-card__match-info">{matchInfo}</p>
          <p className="plan-selection-card__description">{description}</p>
          {benefits.length > 0 && (
            <div className="plan-selection-card__benefits">
              {benefits.map((benefit, index) => (
                <span
                  key={index}
                  className="plan-selection-card__benefit-chip"
                >
                  {benefit}
                </span>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );

  const standardWrapperClass = isSelected
    ? "plan-selection-card--standard-wrapper p-5 md:p-6"
    : "plan-selection-card--standard-wrapper border-[var(--color-border)] bg-[var(--color-surface)] p-5 md:p-6";

  return (
    <DashboardCard isSelected={isSelected} className={standardWrapperClass}>
      {cardContent}
    </DashboardCard>
  );
};
