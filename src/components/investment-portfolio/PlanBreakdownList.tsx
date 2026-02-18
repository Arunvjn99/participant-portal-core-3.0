import React from "react";
import { useTranslation } from "react-i18next";
import type { Plan } from "../../types/investmentPortfolio";
import { Shield, Zap } from "lucide-react";

interface Props {
  plans: Plan[];
}

export const PlanBreakdownList: React.FC<Props> = ({ plans }) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="investment-portfolio-card__title text-sm uppercase tracking-wide">
          {t("investmentPortfolio.enrolledPlans")}
        </h3>
        <button
          type="button"
          className="text-xs font-semibold text-primary hover:underline"
        >
          {t("investmentPortfolio.manageEnrollments")}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="investment-portfolio-card group rounded-xl p-5 transition-all hover:shadow-md"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="rounded-lg p-2"
                  style={{
                    backgroundColor: plan.type === "401k" ? "rgba(var(--color-primary-rgb), 0.1)" : "rgba(var(--enroll-brand-rgb), 0.1)",
                    color: plan.type === "401k" ? "var(--color-primary)" : "var(--enroll-brand)",
                  }}
                >
                  <Shield size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold leading-tight text-foreground">
                    {plan.name}
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    {plan.type} • {plan.status}
                  </span>
                </div>
              </div>
              <span
                className="rounded border px-2 py-1 text-[10px] font-bold uppercase"
                style={{
                  backgroundColor: "var(--color-background-secondary)",
                  color: "var(--color-text-secondary)",
                  borderColor: "var(--color-border)",
                }}
              >
                {plan.riskLevel}
              </span>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <p className="investment-portfolio-card__subtitle mb-0.5 font-semibold uppercase">
                  {t("investmentPortfolio.balance")}
                </p>
                <p className="text-lg font-bold text-foreground">
                  ${plan.balance.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="investment-portfolio-card__subtitle mb-0.5 font-semibold uppercase">
                  {t("investmentPortfolio.ytdReturn")}
                </p>
                <p
                  className={`text-lg font-bold ${plan.ytdReturn >= 0 ? "text-primary" : "text-danger"}`}
                >
                  {plan.ytdReturn > 0 ? "+" : ""}
                  {plan.ytdReturn}%
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-border pt-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {t("investmentPortfolio.contribution")}:{" "}
                  <span className="font-semibold text-foreground">
                    {plan.contributionRate}%
                  </span>
                </span>
                {plan.contributionRate < 10 && (
                  <span
                    className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium"
                    style={{ backgroundColor: "var(--color-warning-light)", color: "var(--color-warning)" }}
                  >
                    <Zap size={10} /> {t("investmentPortfolio.boost")}
                  </span>
                )}
              </div>
              <div className="h-8 w-16">
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 60 20"
                  preserveAspectRatio="none"
                >
                  <polyline
                    points={plan.trend
                      .map((val, i) => `${i * (60 / (plan.trend.length - 1))},${20 - val * 2}`)
                      .join(" ")}
                    fill="none"
                    stroke={
                      plan.ytdReturn >= 0
                        ? "var(--color-primary)"
                        : "var(--color-danger)"
                    }
                    strokeWidth="2"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
