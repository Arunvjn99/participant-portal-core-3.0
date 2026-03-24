import type { PerformancePoint } from "@/modules/investment/data/mockPortfolioDashboard";

export type PortfolioChartRow = {
  date: string;
  portfolio: number;
  benchmark: number;
};

/**
 * Normalize indexed performance curves to dollar balances assuming both series
 * started from the same contribution base (`totalInvested`).
 */
export function indexedPointsToDollarSeries(
  points: PerformancePoint[],
  totalInvested: number,
): PortfolioChartRow[] {
  if (points.length === 0 || totalInvested <= 0) return [];
  const p0 = points[0];
  return points.map((p) => ({
    date: p.date,
    portfolio: totalInvested * (p.portfolio / p0.portfolio),
    benchmark: totalInvested * (p.sp500 / p0.sp500),
  }));
}
