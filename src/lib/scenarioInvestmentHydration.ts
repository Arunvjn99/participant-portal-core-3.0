import type { Scenario } from "@/engine/scenarioEngine";
import type { AllocationItem, ChartDataPoint, PortfolioData } from "@/types/investmentPortfolio";
import { mockChartData } from "@/features/crp-investment-portfolio/mockData";

const ALLOC_COLORS = ["#6366f1", "#8b5cf6", "#06b6d4", "#f59e0b", "#10b981"];

function scaleChartToBalance(chart: ChartDataPoint[], targetEndBalance: number): ChartDataPoint[] {
  const last = chart[chart.length - 1]?.portfolioValue ?? targetEndBalance;
  if (last <= 0) return chart;
  const factor = targetEndBalance / last;
  return chart.map((p) => ({
    ...p,
    portfolioValue: Math.round(p.portfolioValue * factor),
    benchmarkValue: Math.round(p.benchmarkValue * factor),
  }));
}

/**
 * When demo scenario mode allows investments, map scenario holdings + balance into CRP portfolio client props.
 */
export function investmentDemoOverridesFromScenario(scenario: Scenario | null): {
  portfolioDataPartial: Partial<PortfolioData>;
  allocations: AllocationItem[];
  chartData: ChartDataPoint[];
} | null {
  if (!scenario?.permissions.canAccessInvestments || scenario.portfolio.length === 0) {
    return null;
  }
  const bal = scenario.financial.balance;
  const holdings = scenario.portfolio;
  const allocations: AllocationItem[] = holdings.map((h, i) => ({
    name: h.label,
    currentPercent: h.pct,
    targetPercent: h.pct,
    color: ALLOC_COLORS[i % ALLOC_COLORS.length],
    drift: 0,
  }));
  const risk = scenario.financial.riskScore;
  const diversificationScore = Math.min(95, Math.max(40, Math.round(55 + (risk - 55) * 0.35)));
  const portfolioDataPartial: Partial<PortfolioData> = {
    totalBalance: bal,
    totalGain: Math.round(bal * 0.11),
    totalGainPercent: 11,
    riskScore: risk,
    diversificationScore,
    confidence: scenario.stage === "at_risk" ? "conservative" : "onTrack",
  };
  return {
    portfolioDataPartial,
    allocations,
    chartData: scaleChartToBalance(mockChartData, bal),
  };
}
