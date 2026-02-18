import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { ChartDataPoint } from "../../types/investmentPortfolio";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  baseChartData: ChartDataPoint[];
}

export type ScenarioId = "none" | "marketDown10" | "marketUp10" | "contributionPlus2" | "rebalanceToday";

export const PortfolioScenarioSimulator: React.FC<Props> = ({ baseChartData }) => {
  const { t } = useTranslation();
  const [scenario, setScenario] = useState<ScenarioId>("none");

  const scenarioData = useMemo(() => {
    if (scenario === "none") return baseChartData;
    const mult =
      scenario === "marketDown10"
        ? 0.9
        : scenario === "marketUp10"
          ? 1.1
          : scenario === "contributionPlus2"
            ? 1.02
            : 1;
    return baseChartData.map((d, i) => ({
      ...d,
      portfolioValue: Math.round((d.portfolioValue ?? 0) * Math.pow(mult, i / baseChartData.length)),
      portfolioReturn: (d.portfolioReturn ?? 0) * (scenario === "marketDown10" ? 0.9 : scenario === "marketUp10" ? 1.1 : 1),
    }));
  }, [baseChartData, scenario]);

  const scenarios: { id: ScenarioId; labelKey: string }[] = [
    { id: "marketDown10", labelKey: "investmentPortfolio.scenarioMarketDown10" },
    { id: "marketUp10", labelKey: "investmentPortfolio.scenarioMarketUp10" },
    { id: "contributionPlus2", labelKey: "investmentPortfolio.scenarioContributionPlus2" },
    { id: "rebalanceToday", labelKey: "investmentPortfolio.scenarioRebalanceToday" },
  ];

  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: "var(--color-background)",
        border: "1px solid var(--color-border)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <h3 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: "var(--enroll-text-primary)" }}>
        {t("investmentPortfolio.retirementProjection")} — {t("investmentPortfolio.runNewSimulation")}
      </h3>
      <div
        className="flex flex-wrap gap-2 p-2 rounded-xl mb-6"
        style={{ backgroundColor: "var(--color-background-secondary)" }}
      >
        <button
          type="button"
          onClick={() => setScenario("none")}
          className="rounded-lg px-3 py-2 text-xs font-semibold transition-all"
          style={{
            backgroundColor: scenario === "none" ? "var(--color-background)" : "transparent",
            color: scenario === "none" ? "var(--enroll-text-primary)" : "var(--enroll-text-secondary)",
            boxShadow: scenario === "none" ? "var(--shadow-sm)" : "none",
          }}
        >
          Base
        </button>
        {scenarios.map(({ id, labelKey }) => (
          <button
            key={id}
            type="button"
            onClick={() => setScenario(id)}
            className="rounded-lg px-3 py-2 text-xs font-semibold transition-all"
            style={{
              backgroundColor: scenario === id ? "var(--color-background)" : "transparent",
              color: scenario === id ? "var(--enroll-text-primary)" : "var(--enroll-text-secondary)",
              boxShadow: scenario === id ? "var(--shadow-sm)" : "none",
            }}
          >
            {t(labelKey)}
          </button>
        ))}
      </div>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={scenarioData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--color-border)" strokeDasharray="3 3" />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "var(--color-text-tertiary)", fontSize: 11 }} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--color-text-tertiary)", fontSize: 11 }}
              tickFormatter={(v) => `$${v / 1000}k`}
              width={40}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border)",
                boxShadow: "var(--shadow-md)",
                padding: "var(--spacing-2)",
                fontSize: "12px",
              }}
              formatter={(value: number) => [`$${value?.toLocaleString() ?? 0}`, ""]}
            />
            <Line
              type="monotone"
              dataKey="portfolioValue"
              name={t("investmentPortfolio.yourPortfolio")}
              stroke="var(--enroll-brand)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5, fill: "var(--enroll-brand)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
