import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import type { PortfolioData, ChartDataPoint } from "../../types/investmentPortfolio";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { AnimatedNumber } from "../dashboard/shared/AnimatedNumber";
import { StatusBadge } from "../dashboard/shared/StatusBadge";
import { ProgressBar } from "../dashboard/shared/ProgressBar";
import { DashboardCard } from "../dashboard/DashboardCard";
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
  data: PortfolioData;
  chartData: ChartDataPoint[];
}

const projectionMultipliers = {
  base: 1,
  optimized: 1.12,
  stress: 0.9,
};

export const PortfolioHeroSummary: React.FC<Props> = ({ data, chartData }) => {
  const { t } = useTranslation();
  const [projectionMode, setProjectionMode] = useState<"base" | "optimized" | "stress">("base");
  const isPositive = data.totalGain >= 0;
  const riskScore = data.riskScore ?? 50;
  const diversificationScore = data.diversificationScore ?? 70;

  const confidenceKey =
    data.confidence === "conservative"
      ? "investmentPortfolio.confidenceConservative"
      : data.confidence === "slightlyAggressive"
        ? "investmentPortfolio.confidenceSlightlyAggressive"
        : "investmentPortfolio.confidenceOnTrack";

  const projectedData = chartData.map((d) => ({
    ...d,
    portfolioValue: Math.round(d.portfolioValue * projectionMultipliers[projectionMode]),
  }));

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
      <div className="lg:col-span-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--enroll-text-primary)" }}>
            {t("investmentPortfolio.pageTitle")}
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--enroll-text-secondary)" }}>
            {t("investmentPortfolio.pageSubtitle")}
          </p>
        </div>

        <div className="investment-portfolio-card p-6">
          <p className="mb-1 text-sm font-medium" style={{ color: "var(--enroll-text-secondary)" }}>
            {t("investmentPortfolio.totalPortfolioValue")}
          </p>
          <div className="flex flex-wrap items-baseline gap-4">
            <span className="text-3xl font-bold tracking-tight" style={{ color: "var(--enroll-text-primary)" }}>
              $<AnimatedNumber value={data.totalBalance} format="currency" decimals={0} />
            </span>
            <div
              className="flex items-center gap-1.5 text-lg font-semibold"
              style={{ color: isPositive ? "var(--color-success)" : "var(--color-danger)" }}
            >
              {isPositive ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
              <span>{data.totalGainPercent}%</span>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm" style={{ color: "var(--enroll-text-secondary)" }}>
            <span>
              <span className={isPositive ? "font-medium" : ""} style={{ color: "var(--enroll-text-primary)" }}>
                ${Math.abs(data.totalGain).toLocaleString()}
              </span>{" "}
              {t("investmentPortfolio.gain")}
            </span>
            <span className="h-1 w-1 rounded-full" style={{ backgroundColor: "var(--color-border)" }} />
            <StatusBadge
              label={`${data.alpha > 0 ? "+" : ""}${data.alpha}% Alpha vs ${data.benchmarkName}`}
              variant="primary"
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium" style={{ color: "var(--enroll-text-muted)" }}>
                {t("investmentPortfolio.riskScoreLabel")}
              </span>
              <StatusBadge label={t(confidenceKey)} variant={data.confidence === "conservative" ? "neutral" : "success"} />
            </div>
            <div className="flex-1 min-w-[120px] max-w-[200px]">
              <div className="flex justify-between text-[10px] font-medium mb-1" style={{ color: "var(--enroll-text-muted)" }}>
                <span>{t("investmentPortfolio.riskScore")}</span>
                <span style={{ color: "var(--enroll-text-primary)" }}>{riskScore}/100</span>
              </div>
              <ProgressBar value={riskScore} max={100} height={6} barColor="var(--enroll-brand)" />
            </div>
            <div className="flex-1 min-w-[120px] max-w-[200px]">
              <div className="flex justify-between text-[10px] font-medium mb-1" style={{ color: "var(--enroll-text-muted)" }}>
                <span>{t("investmentPortfolio.diversificationHealth")}</span>
                <span style={{ color: "var(--enroll-text-primary)" }}>{diversificationScore}%</span>
              </div>
              <ProgressBar value={diversificationScore} max={100} height={6} barColor="var(--enroll-accent)" />
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-4">
        <DashboardCard
          title={t("investmentPortfolio.retirementProjection")}
          action={
            <div className="flex gap-1 p-1 rounded-lg" style={{ backgroundColor: "var(--color-background-secondary)" }}>
              {(["base", "optimized", "stress"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setProjectionMode(mode)}
                  className="rounded-md px-2 py-1 text-[10px] font-semibold transition-all"
                  style={{
                    backgroundColor: projectionMode === mode ? "var(--color-background)" : "transparent",
                    color: projectionMode === mode ? "var(--enroll-text-primary)" : "var(--enroll-text-muted)",
                    boxShadow: projectionMode === mode ? "var(--shadow-sm)" : "none",
                  }}
                >
                  {mode === "base"
                  ? t("investmentPortfolio.projectionBase")
                  : mode === "optimized"
                    ? t("investmentPortfolio.projectionOptimized")
                    : t("investmentPortfolio.projectionStress")}
                </button>
              ))}
            </div>
          }
        >
          <div className="h-[220px] w-full -mx-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={projectedData} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                <CartesianGrid vertical={false} stroke="var(--color-border)" strokeDasharray="3 3" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "var(--color-text-tertiary)", fontSize: 10 }} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--color-text-tertiary)", fontSize: 10 }}
                  tickFormatter={(v) => `$${v / 1000}k`}
                  width={36}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--color-border)",
                    boxShadow: "var(--shadow-md)",
                    padding: "var(--spacing-2)",
                    fontSize: "11px",
                  }}
                  formatter={(value: number) => [`$${value?.toLocaleString() ?? 0}`, ""]}
                />
                <Line
                  type="monotone"
                  dataKey="portfolioValue"
                  stroke="var(--enroll-brand)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "var(--enroll-brand)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};
