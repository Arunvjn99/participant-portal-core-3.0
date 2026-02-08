import { DashboardCard } from "../dashboard/DashboardCard";
import Button from "../ui/Button";

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
 * PlanSelectionCard - Figma-aligned plan option card
 * Best Fit badge, CTA at top-right. One plan selectable at a time.
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
  return (
    <DashboardCard isSelected={isSelected}>
      <div
        className={`plan-selection-card ${isRecommended ? "plan-selection-card--recommended" : "plan-selection-card--standard"} ${isSelected ? "plan-selection-card--selected" : ""}`}
        role="option"
        aria-selected={isSelected}
        aria-label={`${planName}${isRecommended ? ", Recommended" : ""}`}
      >
        <div className="plan-selection-card__header">
          <div className="plan-selection-card__header-left">
            <h3 className="plan-selection-card__title">{planName}</h3>
            {/* Badge: shown ONLY when recommended. NO visual highlight. */}
            {isRecommended && fitPercentage !== undefined && (
              <div className="plan-selection-card__badge" role="status" aria-label={`${fitPercentage}% fit, recommended`}>
                <span className="plan-selection-card__badge-fit">{fitPercentage}% Fit</span>
                <span className="plan-selection-card__badge-hint">Based on your input</span>
              </div>
            )}
          </div>
          <div className="plan-selection-card__header-action">
            {isSelected ? (
              <span className="plan-selection-card__button plan-selection-card__button--selected" aria-live="polite">
                <svg className="plan-selection-card__button-check" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M16 6l-8 8-4-4" />
                </svg>
                Selected
              </span>
            ) : (
              <Button
                onClick={onSelect}
                className="plan-selection-card__button plan-selection-card__button--primary"
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
              <span key={index} className="plan-selection-card__benefit-chip">
                {benefit}
              </span>
            ))}
          </div>
        )}
      </div>
    </DashboardCard>
  );
};
