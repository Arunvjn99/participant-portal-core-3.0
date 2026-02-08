import { DashboardCard } from "../dashboard/DashboardCard";
import type { PlanRecommendation } from "../../types/enrollment";

interface RecommendationInsightCardProps {
  recommendation: PlanRecommendation;
  onReadFullAnalysis?: () => void;
}

/**
 * RecommendationInsightCard - Reusable component for displaying recommendation explanation
 */
export const RecommendationInsightCard = ({ recommendation, onReadFullAnalysis }: RecommendationInsightCardProps) => {
  // Use existing copy from recommendation rationale
  const fiduciaryExplanation = recommendation.rationale;

  return (
    <DashboardCard>
      <div className="recommendation-insight-card">
        <h3 className="recommendation-insight-card__title">
          <svg className="recommendation-insight-card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
            <path d="M9 18h6" />
            <path d="M10 22h4" />
          </svg>
          Why we recommend Roth
        </h3>
        <p className="recommendation-insight-card__explanation">{fiduciaryExplanation}</p>
        {onReadFullAnalysis && (
          <button
            type="button"
            onClick={onReadFullAnalysis}
            className="recommendation-insight-card__link"
          >
            Read full analysis →
          </button>
        )}
      </div>
    </DashboardCard>
  );
};
