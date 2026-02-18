import React from "react";
import { useTranslation } from "react-i18next";
import {
  RefreshCcw,
  PieChart,
  DollarSign,
  Calculator,
} from "lucide-react";

export const ActionGrid: React.FC = () => {
  const { t } = useTranslation();
  const actions = [
    {
      icon: RefreshCcw,
      labelKey: "investmentPortfolio.rebalancePortfolio" as const,
      descKey: "investmentPortfolio.alignWithTargetMix" as const,
      iconBg: "rgba(var(--enroll-brand-rgb), 0.1)",
      iconColor: "var(--enroll-brand)",
    },
    {
      icon: PieChart,
      labelKey: "investmentPortfolio.adjustAllocations" as const,
      descKey: "investmentPortfolio.changeInvestmentMix" as const,
      iconBg: "rgba(var(--color-primary-rgb), 0.1)",
      iconColor: "var(--color-primary)",
    },
    {
      icon: DollarSign,
      labelKey: "investmentPortfolio.changeContributions" as const,
      descKey: "investmentPortfolio.boostYourSavings" as const,
      iconBg: "rgba(var(--color-success-rgb), 0.1)",
      iconColor: "var(--color-success)",
    },
    {
      icon: Calculator,
      labelKey: "investmentPortfolio.retirementProjection" as const,
      descKey: "investmentPortfolio.runNewSimulation" as const,
      iconBg: "rgba(var(--color-warning-rgb), 0.1)",
      iconColor: "var(--color-warning)",
    },
  ];

  return (
    <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
      {actions.map((action) => (
        <button
          key={action.labelKey}
          type="button"
          className="investment-portfolio-card group flex flex-col items-start rounded-xl p-5 text-left transition-all hover:shadow-md"
        >
          <div
            className="mb-3 rounded-lg p-3 transition-transform group-hover:scale-110 w-fit"
            style={{ backgroundColor: action.iconBg, color: action.iconColor }}
          >
            <action.icon size={20} />
          </div>
          <h4 className="mb-1 text-sm font-bold" style={{ color: "var(--enroll-text-primary)" }}>
            {t(action.labelKey)}
          </h4>
          <p className="text-xs" style={{ color: "var(--enroll-text-secondary)" }}>{t(action.descKey)}</p>
        </button>
      ))}
    </div>
  );
};
