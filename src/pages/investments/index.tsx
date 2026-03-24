import { useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { useAuth } from "@/context/AuthContext";
import { PortfolioHeader } from "@/components/investments/PortfolioHeader";
import { PortfolioSummaryCard } from "@/components/investments/PortfolioSummaryCard";
import { PortfolioChart } from "@/components/investments/PortfolioChart";
import { TimeFilter } from "@/components/investments/TimeFilter";
import { PortfolioAllocationSection } from "@/components/investments/PortfolioAllocationSection";
import { PortfolioRetirementPlanning } from "@/components/investments/PortfolioRetirementPlanning";
import { PortfolioRecommendedActions } from "@/components/investments/PortfolioRecommendedActions";
import { AIInsightsPanel } from "@/components/investment-portfolio/AIInsightsPanel";
import type { PortfolioData, Plan } from "@/types/investmentPortfolio";
import {
  mockAllocation,
  mockPerformanceByRange,
  mockPortfolioSummary,
  type PerformanceTimeRange,
} from "@/modules/investment/data/mockPortfolioDashboard";
import { indexedPointsToDollarSeries } from "@/lib/portfolioChartSeries";

function firstNameFromUser(user: User | null): string {
  const meta = user?.user_metadata as Record<string, unknown> | undefined;
  const a = meta?.first_name;
  if (typeof a === "string" && a.trim()) return a.trim();
  const b = meta?.full_name;
  if (typeof b === "string" && b.trim()) return b.trim().split(/\s+/)[0] ?? "Sarah";
  const c = meta?.name;
  if (typeof c === "string" && c.trim()) return c.trim().split(/\s+/)[0] ?? "Sarah";
  return "Sarah";
}

function greetingLine(user: User | null): string {
  const h = new Date().getHours();
  const part = h < 12 ? "morning" : h < 17 ? "afternoon" : "evening";
  return `Good ${part}, ${firstNameFromUser(user)}`;
}

/**
 * Investment portfolio dashboard — data-bound summary, KPI grid, benchmark chart, time filter.
 * Mock data lives in `@/modules/investment/data/mockPortfolioDashboard`; swap for API hooks when ready.
 */
export function InvestmentPortfolioPage() {
  const { user } = useAuth();
  const [range, setRange] = useState<PerformanceTimeRange>("1Y");
  const chartData = useMemo(
    () => indexedPointsToDollarSeries(mockPerformanceByRange[range].data, mockPortfolioSummary.totalInvested),
    [range],
  );
  const lastUpdatedLabel = `Last updated · ${mockPortfolioSummary.asOfLabel.replace(/^As of\s+/i, "").trim()}`;

  const portfolioAiData: PortfolioData = useMemo(
    () => ({
      totalBalance: mockPortfolioSummary.totalBalance,
      totalGain: mockPortfolioSummary.totalGain,
      totalGainPercent: mockPortfolioSummary.gainPercentAllTime,
      alpha: mockPortfolioSummary.vsSp500Percent,
      benchmarkName: "S&P 500",
      benchmarkReturnPercent: mockPortfolioSummary.annualReturnPercent - mockPortfolioSummary.vsSp500Percent,
    }),
    [],
  );
  const portfolioAiPlans: Plan[] = useMemo(() => [], []);

  return (
    <DashboardLayout header={<DashboardHeader />}>
      <div className="inv-portfolio">
        <PortfolioHeader greetingLine={greetingLine(user)} title="Investment Portfolio" lastUpdatedLabel={lastUpdatedLabel} />
        <PortfolioSummaryCard summary={mockPortfolioSummary} />
        <section className="inv-portfolio-perf" aria-labelledby="inv-portfolio-perf-title">
          <div className="inv-portfolio-perf__head">
            <div className="inv-portfolio-perf__intro">
              <h2 id="inv-portfolio-perf-title" className="inv-portfolio-perf__title">
                Portfolio Performance
              </h2>
              <p className="inv-portfolio-perf__subtitle">Growth over time vs S&amp;P 500 benchmark</p>
            </div>
            <TimeFilter value={range} onChange={setRange} />
          </div>
          <div className="inv-portfolio-perf__chart-card">
            <PortfolioChart range={range} data={chartData} />
          </div>
        </section>

        <PortfolioAllocationSection groups={mockAllocation} />
        <AIInsightsPanel data={portfolioAiData} plans={portfolioAiPlans} />
        <PortfolioRetirementPlanning />
        <PortfolioRecommendedActions />

        <p className="inv-portfolio-footnote">
          Past performance does not guarantee future results. Illustrative data only; not investment advice.
        </p>
      </div>
    </DashboardLayout>
  );
}

export default InvestmentPortfolioPage;
