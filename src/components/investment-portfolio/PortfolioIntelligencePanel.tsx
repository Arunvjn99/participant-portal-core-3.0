import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import type { PortfolioData, Plan } from "../../types/investmentPortfolio";
import { getPerformanceIntelligence } from "../../services/investmentPortfolioAiService";
import { Sparkles, TrendingUp, Shield, Lightbulb } from "lucide-react";
import { DashboardCard } from "../dashboard/DashboardCard";
import { StatusBadge } from "../dashboard/shared/StatusBadge";

interface Props {
  data: PortfolioData;
  plans: Plan[];
}

type TabId = "performance" | "risk" | "optimization";

export const PortfolioIntelligencePanel: React.FC<Props> = ({ data, plans }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabId>("performance");
  const [insights, setInsights] = React.useState<{ explanation: string; optimization: string } | null>(null);

  React.useEffect(() => {
    getPerformanceIntelligence(data, plans).then(setInsights);
  }, [data, plans]);

  const tabs: { id: TabId; labelKey: string; icon: React.ElementType }[] = [
    { id: "performance", labelKey: "investmentPortfolio.performanceAttribution", icon: TrendingUp },
    { id: "risk", labelKey: "investmentPortfolio.riskAnalysis", icon: Shield },
    { id: "optimization", labelKey: "investmentPortfolio.optimizationSuggestions", icon: Lightbulb },
  ];

  return (
    <div
      className="rounded-2xl p-6 mb-8 overflow-hidden relative"
      style={{
        background: "var(--color-background-secondary)",
        border: "1px solid var(--color-border)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div
            className="rounded-lg border p-1.5"
            style={{
              backgroundColor: "rgba(var(--enroll-brand-rgb), 0.1)",
              borderColor: "rgba(var(--enroll-brand-rgb), 0.2)",
            }}
          >
            <Sparkles size={16} style={{ color: "var(--enroll-brand)" }} />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: "var(--enroll-text-primary)" }}>
            {t("investmentPortfolio.planIntelligence")}
          </h3>
        </div>

        <div
          className="flex flex-wrap gap-1 p-1 rounded-xl mb-6"
          style={{ backgroundColor: "var(--color-background)" }}
          role="tablist"
        >
          {tabs.map(({ id, labelKey, icon: Icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={activeTab === id}
              onClick={() => setActiveTab(id)}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all"
              style={{
                backgroundColor: activeTab === id ? "var(--color-background)" : "transparent",
                color: activeTab === id ? "var(--enroll-text-primary)" : "var(--enroll-text-secondary)",
                boxShadow: activeTab === id ? "var(--shadow-sm)" : "none",
              }}
            >
              <Icon size={14} style={{ color: activeTab === id ? "var(--enroll-brand)" : "var(--enroll-text-muted)" }} />
              {t(labelKey)}
            </button>
          ))}
        </div>

        {activeTab === "performance" && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <DashboardCard>
              <div className="space-y-2">
                <StatusBadge label={t("investmentPortfolio.performanceAttribution")} variant="primary" />
                <p className="text-sm leading-relaxed" style={{ color: "var(--enroll-text-secondary)" }}>
                  &quot;{insights?.explanation || t("investmentPortfolio.analyzingPortfolio")}&quot;
                </p>
                <button
                  type="button"
                  className="mt-2 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors"
                  style={{
                    backgroundColor: "rgba(var(--enroll-brand-rgb), 0.1)",
                    color: "var(--enroll-brand)",
                  }}
                >
                  {t("investmentPortfolio.simulateImpact")}
                </button>
              </div>
            </DashboardCard>
            <DashboardCard>
              <div className="space-y-2">
                <StatusBadge label={t("investmentPortfolio.actionableInsight")} variant="success" />
                <p className="text-sm leading-relaxed" style={{ color: "var(--enroll-text-secondary)" }}>
                  {t("investmentPortfolio.microcopyOutperforming")}
                </p>
                <button
                  type="button"
                  className="mt-2 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors"
                  style={{
                    backgroundColor: "rgba(var(--enroll-brand-rgb), 0.1)",
                    color: "var(--enroll-brand)",
                  }}
                >
                  {t("investmentPortfolio.simulateImpact")}
                </button>
              </div>
            </DashboardCard>
          </div>
        )}

        {activeTab === "risk" && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <DashboardCard>
              <div className="space-y-2">
                <StatusBadge label={t("investmentPortfolio.riskAnalysis")} variant="neutral" />
                <p className="text-sm leading-relaxed" style={{ color: "var(--enroll-text-secondary)" }}>
                  {t("investmentPortfolio.microcopyReduceEquity")}
                </p>
                <button
                  type="button"
                  className="mt-2 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors"
                  style={{
                    backgroundColor: "rgba(var(--enroll-brand-rgb), 0.1)",
                    color: "var(--enroll-brand)",
                  }}
                >
                  {t("investmentPortfolio.simulateImpact")}
                </button>
              </div>
            </DashboardCard>
            <DashboardCard>
              <div className="space-y-2">
                <StatusBadge label={t("investmentPortfolio.riskScore")} variant="warning" />
                <p className="text-sm leading-relaxed" style={{ color: "var(--enroll-text-secondary)" }}>
                  Portfolio risk score is {(data.riskScore ?? 50)}/100. Consider rebalancing if above 70.
                </p>
                <button
                  type="button"
                  className="mt-2 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors"
                  style={{
                    backgroundColor: "rgba(var(--enroll-brand-rgb), 0.1)",
                    color: "var(--enroll-brand)",
                  }}
                >
                  {t("investmentPortfolio.simulateImpact")}
                </button>
              </div>
            </DashboardCard>
          </div>
        )}

        {activeTab === "optimization" && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <DashboardCard>
              <div className="space-y-2">
                <StatusBadge label={t("investmentPortfolio.optimizationSuggestions")} variant="success" />
                <p className="text-sm leading-relaxed" style={{ color: "var(--enroll-text-secondary)" }}>
                  {insights?.optimization || t("investmentPortfolio.calculatingOptimization")}
                </p>
                <button
                  type="button"
                  className="mt-2 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors"
                  style={{
                    backgroundColor: "rgba(var(--enroll-brand-rgb), 0.1)",
                    color: "var(--enroll-brand)",
                  }}
                >
                  {t("investmentPortfolio.simulateImpact")}
                </button>
              </div>
            </DashboardCard>
            <DashboardCard>
              <div className="space-y-2">
                <StatusBadge label={t("investmentPortfolio.actionableInsight")} variant="primary" />
                <p className="text-sm leading-relaxed" style={{ color: "var(--enroll-text-secondary)" }}>
                  {t("investmentPortfolio.microcopyContributionAdds", { amount: "$42,000" })}
                </p>
                <button
                  type="button"
                  className="mt-2 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors"
                  style={{
                    backgroundColor: "rgba(var(--enroll-brand-rgb), 0.1)",
                    color: "var(--enroll-brand)",
                  }}
                >
                  {t("investmentPortfolio.simulateImpact")}
                </button>
              </div>
            </DashboardCard>
          </div>
        )}
      </div>
    </div>
  );
};
