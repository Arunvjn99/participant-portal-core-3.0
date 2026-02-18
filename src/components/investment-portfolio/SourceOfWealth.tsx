import React from "react";
import { useTranslation } from "react-i18next";

export const SourceOfWealth: React.FC = () => {
  const { t } = useTranslation();
  const data = {
    user: 85000,
    employer: 25000,
    growth: 42000,
    total: 152000,
  };

  const getPct = (val: number) => (val / data.total) * 100;

  return (
    <div className="investment-portfolio-card flex h-full flex-col justify-center">
      <h3 className="investment-portfolio-card__title mb-6 text-sm uppercase tracking-wide">
        {t("investmentPortfolio.sourceOfWealth")}
      </h3>

      <div
        className="mb-6 flex h-16 w-full overflow-hidden rounded-xl"
        style={{ boxShadow: "inset 0 0 0 4px var(--color-background-secondary)" }}
      >
        <div
          className="relative flex h-full items-center justify-center group"
          style={{
            width: `${getPct(data.user)}%`,
            backgroundColor: "var(--color-text)",
          }}
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
        <div
          className="relative flex h-full items-center justify-center group"
          style={{
            width: `${getPct(data.employer)}%`,
            backgroundColor: "var(--color-text-tertiary)",
          }}
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
        <div
          className="relative flex h-full items-center justify-center group"
          style={{
            width: `${getPct(data.growth)}%`,
            backgroundColor: "var(--color-primary)",
          }}
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="group flex cursor-default items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: "var(--color-text)" }}
            />
            <span className="text-sm font-medium text-muted-foreground">
              {t("investmentPortfolio.yourContributions")}
            </span>
          </div>
          <div className="text-right">
            <span className="block text-sm font-bold text-foreground">
              ${(data.user / 1000).toFixed(0)}k
            </span>
            <span className="block text-[10px] text-muted-foreground">
              {getPct(data.user).toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="group flex cursor-default items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: "var(--color-text-tertiary)" }}
            />
            <span className="text-sm font-medium text-muted-foreground">
              {t("investmentPortfolio.employerMatch")}
            </span>
          </div>
          <div className="text-right">
            <span className="block text-sm font-bold text-foreground">
              ${(data.employer / 1000).toFixed(0)}k
            </span>
            <span className="block text-[10px] text-muted-foreground">
              {getPct(data.employer).toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="group flex cursor-default items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: "var(--color-primary)" }}
            />
            <span className="text-sm font-medium text-muted-foreground">
              {t("investmentPortfolio.marketGrowth")}
            </span>
          </div>
          <div className="text-right">
            <span className="block text-sm font-bold text-primary">
              +${(data.growth / 1000).toFixed(0)}k
            </span>
            <span className="block text-[10px] text-muted-foreground">
              {getPct(data.growth).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
