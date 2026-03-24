import { DashboardCard } from "../dashboard/DashboardCard";
import type { PlanRecommendation } from "@/types/enrollment";

interface WhyThisPlanProps {
  recommendation: PlanRecommendation;
  onReadFullAnalysis?: () => void;
}

/**
 * WhyThisPlan component - short fiduciary explanation for decision context
 */
export const WhyThisPlan = ({ recommendation, onReadFullAnalysis }: WhyThisPlanProps) => {
  // Generate short fiduciary explanation (2-3 lines)
  const fiduciaryExplanation = `Given your age of ${recommendation.profileSnapshot.age} and ${recommendation.profileSnapshot.retirementAge - recommendation.profileSnapshot.age} years until retirement, tax-free growth through a Roth 401(k) aligns with your long-term financial goals and may reduce your lifetime tax burden.`;

  return (
    <DashboardCard>
      <div className="why-this-plan">
        <h3 className="why-this-plan__title">Why this plan</h3>
        <p className="why-this-plan__explanation">{fiduciaryExplanation}</p>
        {onReadFullAnalysis && (
          <button
            type="button"
            onClick={onReadFullAnalysis}
            className="why-this-plan__link"
          >
            Read full analysis
          </button>
        )}
      </div>
    </DashboardCard>
  );
};
