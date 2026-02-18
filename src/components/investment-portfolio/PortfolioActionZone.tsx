import React from "react";
import { useTranslation } from "react-i18next";
import { RefreshCcw, TrendingUp, Shield } from "lucide-react";
import { DashboardCard } from "../dashboard/DashboardCard";

const actions = [
  {
    id: "rebalance",
    icon: RefreshCcw,
    titleKey: "investmentPortfolio.rebalancePortfolio" as const,
    benefitKey: "investmentPortfolio.alignWithTargetMix" as const,
    improvement: "+2.1% potential",
  },
  {
    id: "contribution",
    icon: TrendingUp,
    titleKey: "investmentPortfolio.increaseContributionAction" as const,
    benefitKey: "investmentPortfolio.boostYourSavings" as const,
    improvement: "~$42k at retirement",
  },
  {
    id: "risk",
    icon: Shield,
    titleKey: "investmentPortfolio.reviewRiskLevel" as const,
    benefitKey: "investmentPortfolio.microcopyReduceEquity" as const,
    improvement: "Lower volatility",
  },
];

export const PortfolioActionZone: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--enroll-text-primary)" }}>
        {t("investmentPortfolio.recommendedActions")}
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {actions.map((action) => (
          <DashboardCard key={action.id}>
            <div className="flex flex-col h-full">
              <div
                className="rounded-lg p-3 mb-4 w-fit"
                style={{
                  backgroundColor: "rgba(var(--enroll-brand-rgb), 0.1)",
                  color: "var(--enroll-brand)",
                }}
              >
                <action.icon size={20} />
              </div>
              <h3 className="text-sm font-bold mb-1" style={{ color: "var(--enroll-text-primary)" }}>
                {t(action.titleKey)}
              </h3>
              <p className="text-xs mb-4 flex-1" style={{ color: "var(--enroll-text-secondary)" }}>
                {t(action.benefitKey)}
              </p>
              <p className="text-[10px] font-semibold mb-3 uppercase tracking-wider" style={{ color: "var(--enroll-text-muted)" }}>
                {t("investmentPortfolio.estimatedImprovement")}: {action.improvement}
              </p>
              <button
                type="button"
                className="w-full rounded-lg py-2.5 text-xs font-semibold transition-colors"
                style={{
                  backgroundColor: "var(--enroll-brand)",
                  color: "var(--color-text-on-primary)",
                }}
              >
                {t("investmentPortfolio.viewDetails")}
              </button>
            </div>
          </DashboardCard>
        ))}
      </div>
    </section>
  );
};
