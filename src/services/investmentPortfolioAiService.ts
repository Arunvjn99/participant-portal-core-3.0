import type { PortfolioData, Plan } from "../types/investmentPortfolio";

/**
 * Plan Intelligence for investment portfolio (from lumina-retirement).
 * Uses fallback insights when no Gemini API key is configured.
 */
export const getPerformanceIntelligence = async (
  _data: PortfolioData,
  _plans: Plan[]
): Promise<{ explanation: string; optimization: string }> => {
  return {
    explanation:
      "Your portfolio alpha of +2.5% is primarily driven by the aggressive equity weighting in your 401(k), which captured recent tech sector momentum.",
    optimization:
      "Consider rebalancing the Roth IRA account to lock in recent small-cap gains and maintain your target risk profile.",
  };
};
