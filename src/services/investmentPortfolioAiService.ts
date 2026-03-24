import type { PortfolioData, Plan } from "../types/investmentPortfolio";

export type PerformanceIntelligence = {
  explanation: string;
  optimization: string;
  /** True when copy is static demo text (not a live model). */
  isSample: boolean;
};

/**
 * Portfolio narrative for the investment portfolio UI.
 * Returns deterministic sample text until a real model/API is wired.
 */
export const getPerformanceIntelligence = async (
  _data: PortfolioData,
  _plans: Plan[]
): Promise<PerformanceIntelligence> => {
  return {
    explanation:
      "Sample insight: illustrative attribution narrative for demo — not personalized to your holdings.",
    optimization:
      "Sample insight: illustrative rebalancing idea for demo — confirm any changes with your plan materials or advisor.",
    isSample: true,
  };
};
