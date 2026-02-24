import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocaleFormat } from "../hooks/useLocaleFormat";
import type { HubFinancialData } from "../data/mockHubData";

interface ImpactInsightPanelProps {
  data: HubFinancialData;
}

interface Insight {
  key: string;
  params: Record<string, string | number>;
  risk: "low" | "moderate" | "high";
  actionLabel?: string;
}

const RISK_STYLE: Record<string, { bg: string; text: string; border: string; icon: string }> = {
  high: {
    bg: "var(--color-danger-light, rgba(239,68,68,0.06))",
    text: "var(--color-danger)",
    border: "var(--color-danger-light, rgba(239,68,68,0.15))",
    icon: "⚡",
  },
  moderate: {
    bg: "var(--color-warning-light, rgba(202,138,4,0.06))",
    text: "var(--color-warning, #ca8a04)",
    border: "var(--color-warning-light, rgba(202,138,4,0.15))",
    icon: "⚠",
  },
  low: {
    bg: "var(--color-success-light, rgba(34,197,94,0.06))",
    text: "var(--color-success)",
    border: "var(--color-success-light, rgba(34,197,94,0.15))",
    icon: "✓",
  },
};

const RISK_ORDER: Array<"high" | "moderate" | "low"> = ["high", "moderate", "low"];

export function ImpactInsightPanel({ data }: ImpactInsightPanelProps) {
  const { t } = useTranslation();
  const fmt = useLocaleFormat();

  const insights = useMemo<Insight[]>(() => {
    const result: Insight[] = [];

    const loanCount = data.transactionHistory.filter((tx) => tx.type === "loan").length;
    if (loanCount >= 2) {
      result.push({
        key: "transactionHub.insights.loanFrequency",
        params: { count: loanCount, years: 3 },
        risk: loanCount >= 3 ? "high" : "moderate",
        actionLabel: t("transactionHub.contribution.title"),
      });
    }

    const withdrawals = data.transactionHistory.filter((tx) => tx.type === "withdrawal");
    if (withdrawals.length > 0) {
      const totalWithdrawn = withdrawals.reduce((s, tx) => s + tx.amount, 0);
      const matchImpact = totalWithdrawn * 0.06;
      result.push({
        key: "transactionHub.insights.withdrawalMatchImpact",
        params: { amount: fmt.currency(matchImpact) },
        risk: "high",
      });
    }

    if (loanCount > 0 && data.currentContributionRate > 6) {
      result.push({
        key: "transactionHub.insights.contributionSuggestion",
        params: {},
        risk: "moderate",
        actionLabel: t("transactionHub.actions.adjustContribution"),
      });
    }

    if (data.portfolioDriftPercent > 3) {
      result.push({
        key: "transactionHub.insights.rebalanceSuggestion",
        params: { percent: data.portfolioDriftPercent.toFixed(1) },
        risk: data.portfolioDriftPercent > 5 ? "high" : "moderate",
        actionLabel: t("transactionHub.actions.rebalancePortfolio"),
      });
    }

    if (result.length === 0) {
      result.push({
        key: "transactionHub.insights.strongPosition",
        params: {},
        risk: "low",
      });
    }

    return result;
  }, [data, fmt, t]);

  const grouped = useMemo(() => {
    const map: Record<string, Insight[]> = { high: [], moderate: [], low: [] };
    insights.forEach((i) => map[i.risk].push(i));
    return map;
  }, [insights]);

  return (
    <section
      className="rounded-xl border border-[var(--color-border)]"
      style={{ backgroundColor: "var(--color-surface)" }}
    >
      <div className="border-b border-[var(--color-border)] px-5 py-4">
        <h3 className="text-base font-semibold text-[var(--color-text)]">{t("transactionHub.insights.title")}</h3>
      </div>
      <div className="flex flex-col gap-3 p-5">
        {RISK_ORDER.map((risk) => {
          const items = grouped[risk];
          if (!items.length) return null;
          return items.map((insight, idx) => {
            const style = RISK_STYLE[insight.risk];
            return (
              <div
                key={`${risk}-${idx}`}
                className="flex items-start gap-3 rounded-lg border p-4 transition-all duration-200 hover:-translate-y-px hover:shadow-sm"
                style={{ backgroundColor: style.bg, borderColor: style.border }}
              >
                <span
                  className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                  style={{ backgroundColor: style.border, color: style.text }}
                  aria-hidden
                >
                  {style.icon}
                </span>
                <div className="flex flex-1 flex-col gap-2">
                  <p className="text-sm leading-relaxed" style={{ color: style.text }}>
                    {t(insight.key, insight.params)}
                  </p>
                  {insight.actionLabel && (
                    <button
                      type="button"
                      className="self-start rounded-md px-3 py-1 text-xs font-medium transition-colors duration-150"
                      style={{ color: style.text, backgroundColor: style.border }}
                    >
                      {insight.actionLabel} →
                    </button>
                  )}
                </div>
              </div>
            );
          });
        })}
      </div>
    </section>
  );
}
