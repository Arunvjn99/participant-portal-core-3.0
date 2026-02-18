import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import {
  PortfolioHeroSummary,
  PortfolioIntelligencePanel,
  PerformanceChart,
  SourceOfWealth,
  PlanBreakdownList,
  AllocationHealthSection,
  PortfolioScenarioSimulator,
  PortfolioActionZone,
} from "../../components/investment-portfolio";
import {
  mockPortfolioData,
  mockPlans,
  mockChartData,
  mockAllocations,
} from "../../data/investmentPortfolio";

/**
 * Investment Portfolio (Plan Performance) – premium, intelligent, engagement-driven.
 * Uses DashboardLayout, DashboardHeader; token-only styles; reusable DashboardCard, StatusBadge, AnimatedNumber, ProgressBar.
 */
export const InvestmentPortfolioPage = () => {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState("YTD");
  const [selectedPlanId, setSelectedPlanId] = useState<string | "all">("all");

  const displayData =
    selectedPlanId === "all"
      ? mockPortfolioData
      : {
          ...mockPortfolioData,
          totalBalance: mockPlans.find((p) => p.id === selectedPlanId)?.balance ?? 0,
          totalGainPercent: mockPlans.find((p) => p.id === selectedPlanId)?.ytdReturn ?? 0,
        };

  return (
    <DashboardLayout header={<DashboardHeader />}>
      <div className="investment-portfolio-page w-full min-h-screen font-sans">
        <div className="mx-auto max-w-7xl px-4 pt-8 md:px-8">
          <PortfolioHeroSummary data={displayData} chartData={mockChartData} />

          <div className="investment-portfolio-card mt-6 flex flex-wrap items-center gap-2 p-3">
            <div className="investment-portfolio-segment-group flex flex-wrap gap-1 p-1 rounded-xl">
              {["1M", "3M", "YTD", "1Y", "3Y", "5Y", "All"].map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setTimeRange(range)}
                  className="rounded-lg px-4 py-2 text-xs font-semibold transition-all"
                  style={{
                    backgroundColor: timeRange === range ? "var(--color-background)" : "transparent",
                    color: timeRange === range ? "var(--enroll-text-primary)" : "var(--enroll-text-secondary)",
                    boxShadow: timeRange === range ? "var(--shadow-sm)" : "none",
                  }}
                >
                  {range}
                </button>
              ))}
            </div>
            <span className="h-4 w-px shrink-0" style={{ backgroundColor: "var(--color-border)" }} />
            <button
              type="button"
              onClick={() => setSelectedPlanId("all")}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
                selectedPlanId === "all" ? "investment-portfolio-pill--primary" : ""
              }`}
              style={
                selectedPlanId !== "all"
                  ? {
                      backgroundColor: "var(--card-bg)",
                      color: "var(--enroll-text-secondary)",
                      borderColor: "var(--color-border)",
                    }
                  : undefined
              }
            >
              {t("investmentPortfolio.allAccounts")}
            </button>
            {mockPlans.map((plan) => (
              <button
                key={plan.id}
                type="button"
                onClick={() => setSelectedPlanId(plan.id)}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
                  selectedPlanId === plan.id ? "investment-portfolio-pill--primary" : ""
                }`}
                style={
                  selectedPlanId !== plan.id
                    ? {
                        backgroundColor: "var(--card-bg)",
                        color: "var(--enroll-text-secondary)",
                        borderColor: "var(--color-border)",
                      }
                    : undefined
                }
              >
                {plan.name}
              </button>
            ))}
          </div>

          <PortfolioIntelligencePanel data={displayData} plans={mockPlans} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 h-[420px]">
              <PerformanceChart data={mockChartData} timeRange={timeRange} />
            </div>
            <div className="lg:col-span-1 h-[420px]">
              <SourceOfWealth />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <AllocationHealthSection
              allocations={mockAllocations}
              diversificationScore={displayData.diversificationScore ?? 78}
              driftPercent={4.2}
            />
            <PortfolioScenarioSimulator baseChartData={mockChartData} />
          </div>

          <PlanBreakdownList plans={mockPlans} />

          <PortfolioActionZone />

          <footer className="investment-portfolio-footer">
            <p className="mb-2">{t("investmentPortfolio.footerDisclaimer")}</p>
            <p>{t("investmentPortfolio.footerCopyright", { year: new Date().getFullYear() })}</p>
          </footer>
        </div>
      </div>
    </DashboardLayout>
  );
};
