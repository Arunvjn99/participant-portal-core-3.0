import React from "react";
import { useTranslation } from "react-i18next";
import type { PortfolioData, Plan } from "../../types/investmentPortfolio";
import { ArrowUpRight, ArrowDownRight, Filter } from "lucide-react";

interface Props {
  data: PortfolioData;
  plans: Plan[];
  selectedPlanId: string | "all";
  setSelectedPlanId: (id: string | "all") => void;
  timeRange: string;
  setTimeRange: (range: string) => void;
}

const timeRanges = ["1M", "3M", "YTD", "1Y", "3Y", "5Y", "All"];

export const PerformanceHeader: React.FC<Props> = ({
  data,
  plans,
  selectedPlanId,
  setSelectedPlanId,
  timeRange,
  setTimeRange,
}) => {
  const { t } = useTranslation();
  const isPositive = data.totalGain >= 0;

  return (
    <div className="investment-portfolio-card mb-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row justify-between lg:items-start gap-6">
          <div>
            <p className="mb-1 text-sm font-medium text-muted-foreground">
              {t("investmentPortfolio.totalPortfolioValue")}
            </p>
            <div className="flex items-baseline gap-4">
              <h1 className="text-4xl font-bold tracking-tight text-foreground">
                ${data.totalBalance.toLocaleString()}
              </h1>
              <div
                className={`flex items-center gap-1.5 text-lg font-semibold ${isPositive ? "text-primary" : "text-danger"}`}
              >
                {isPositive ? (
                  <ArrowUpRight size={20} />
                ) : (
                  <ArrowDownRight size={20} />
                )}
                <span>{data.totalGainPercent}%</span>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
              <span>
                <span className={isPositive ? "font-medium text-foreground" : ""}>
                  ${Math.abs(data.totalGain).toLocaleString()}
                </span>{" "}
                {t("investmentPortfolio.gain")}
              </span>
              <span className="h-1 w-1 rounded-full bg-border-muted" />
              <span
                className="flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium"
                style={{
                  backgroundColor: "rgba(var(--color-primary-rgb), 0.1)",
                  borderColor: "rgba(var(--color-primary-rgb), 0.2)",
                  color: "var(--color-primary)",
                }}
              >
                {data.alpha > 0 ? "+" : ""}
                {data.alpha}% Alpha vs {data.benchmarkName}
              </span>
            </div>
          </div>

          <div className="investment-portfolio-segment-group flex self-start p-1">
            {timeRanges.map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setTimeRange(range)}
                className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${
                  timeRange === range
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto border-t border-border pb-2 pt-6 -mb-2 scrollbar-hide">
          <Filter size={16} className="shrink-0 text-muted-foreground" />
          <button
            type="button"
            onClick={() => setSelectedPlanId("all")}
            className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
              selectedPlanId === "all"
                ? "investment-portfolio-pill--primary"
                : "bg-card text-muted-foreground border-border hover:border-border-muted"
            }`}
          >
            {t("investmentPortfolio.allAccounts")}
          </button>
          {plans.map((plan) => (
            <button
              key={plan.id}
              type="button"
              onClick={() => setSelectedPlanId(plan.id)}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
                selectedPlanId === plan.id
                  ? "investment-portfolio-pill--primary"
                  : "bg-card text-muted-foreground border-border hover:border-border-muted"
              }`}
            >
              {plan.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
