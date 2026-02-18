import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceDot,
} from "recharts";
import type { ChartDataPoint } from "../../types/investmentPortfolio";

interface Props {
  data: ChartDataPoint[];
  timeRange: string;
}

export const PerformanceChart: React.FC<Props> = ({ data, timeRange }) => {
  const { t } = useTranslation();
  const [metric, setMetric] = useState<"value" | "return">("return");

  const gridStroke = "var(--color-border)";
  const tickFill = "var(--color-text-tertiary)";
  const tooltipBorder = "var(--color-border)";
  const tooltipLabelColor = "var(--color-text-secondary)";
  const portfolioStroke = "var(--color-primary)";
  const benchmarkStroke = "var(--color-background-tertiary)";
  const contributionStroke = "var(--color-success)";

  return (
    <div className="investment-portfolio-card mb-6 flex h-full flex-col">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h3 className="investment-portfolio-card__title">
            {t("investmentPortfolio.portfolioGrowth")}
          </h3>
          <p className="investment-portfolio-card__subtitle mt-1">
            {t("investmentPortfolio.benchmarkedAgainst")}
          </p>
        </div>
        <div className="investment-portfolio-segment-group flex items-center gap-1 p-1">
          <button
            type="button"
            onClick={() => setMetric("return")}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${metric === "return" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            {t("investmentPortfolio.returnPercent")}
          </button>
          <button
            type="button"
            onClick={() => setMetric("value")}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${metric === "value" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            {t("investmentPortfolio.valueDollars")}
          </button>
        </div>
      </div>

      <div className="min-h-[300px] w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, bottom: 0, left: 0 }}
          >
            <CartesianGrid
              vertical={false}
              stroke={gridStroke}
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: tickFill, fontSize: 11, fontWeight: 500 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: tickFill, fontSize: 11, fontWeight: 500 }}
              tickFormatter={(val) =>
                metric === "return" ? `${val}%` : `$${val / 1000}k`
              }
            />
            <Tooltip
              contentStyle={{
                borderRadius: "var(--radius-xl)",
                border: `1px solid ${tooltipBorder}`,
                boxShadow: "var(--shadow-md)",
                padding: "var(--spacing-3)",
              }}
              itemStyle={{ fontSize: "12px", fontWeight: 600 }}
              labelStyle={{
                fontSize: "11px",
                color: tooltipLabelColor,
                marginBottom: "var(--spacing-2)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
              formatter={(value: number) => [
                metric === "return"
                  ? `${value}%`
                  : `$${value.toLocaleString()}`,
                "",
              ]}
            />
            <Legend
              wrapperStyle={{ fontSize: "12px", paddingTop: "var(--spacing-5)" }}
              iconType="circle"
            />

            <Line
              type="monotone"
              dataKey={
                metric === "return" ? "portfolioReturn" : "portfolioValue"
              }
              name={t("investmentPortfolio.yourPortfolio")}
              stroke={portfolioStroke}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0, fill: portfolioStroke }}
            />
            <Line
              type="monotone"
              dataKey={
                metric === "return" ? "benchmarkReturn" : "benchmarkValue"
              }
              name={t("investmentPortfolio.benchmark")}
              stroke={benchmarkStroke}
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
            />

            {data
              .filter((d) => d.contribution)
              .map((entry, index) => (
                <ReferenceDot
                  key={index}
                  x={entry.date}
                  y={
                    metric === "return"
                      ? entry.portfolioReturn
                      : entry.portfolioValue
                  }
                  r={4}
                  fill="var(--card-bg)"
                  stroke={contributionStroke}
                  strokeWidth={2}
                />
              ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex items-center justify-end gap-2">
        <div
          className="h-2 w-2 rounded-full border-2 bg-card"
          style={{ borderColor: "var(--color-success)" }}
        />
        <span className="text-[10px] font-medium text-muted-foreground">
          {t("investmentPortfolio.contributionMade")}
        </span>
      </div>
    </div>
  );
};
