import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  ArrowRight,
  DollarSign,
  BarChart3,
  PieChart,
  Shield,
  Target,
  ChevronRight,
} from "lucide-react";

import {
  mockPortfolioData,
  mockPlans,
  mockChartData,
  mockAllocations,
  ACCOUNT_OVERVIEW,
} from "./mockData";
import type {
  AllocationItem,
  ChartDataPoint,
  PerformanceTimeRange,
  PortfolioData,
} from "@/types/investmentPortfolio";
import { PERFORMANCE_TIME_RANGES } from "@/types/investmentPortfolio";
import { cn } from "@/lib/utils";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

const RISK_LEVEL_COLORS: Record<string, string> = {
  Conservative: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  Moderate: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  Aggressive: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

function ScoreBar({ score, max = 100 }: { score: number; max?: number }) {
  const pct = Math.min((score / max) * 100, 100);
  const hue = (pct / 100) * 120;
  return (
    <div className="h-2 w-full rounded-full bg-muted/50">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: `hsl(${hue}, 65%, 50%)` }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  );
}

function MiniSparkline({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  return (
    <div className="flex h-6 items-end gap-[2px]">
      {data.map((v, i) => (
        <div
          key={i}
          className="w-1 rounded-full bg-primary"
          style={{ height: `${((v - min) / range) * 100}%`, minHeight: 2 }}
        />
      ))}
    </div>
  );
}

export type CrpInvestmentPortfolioClientProps = {
  /** Replaces static “Good morning, welcome back” when provided. */
  greetingLine?: string;
  /** Replaces static last-updated line when provided. */
  lastUpdatedLabel?: string;
  /** Deep-merge over mock KPI row (e.g. demo scenario balance / risk). */
  portfolioDataPartial?: Partial<PortfolioData>;
  /** Replace allocation strip + table (scenario holdings). */
  allocationsOverride?: AllocationItem[];
  /** Replace performance chart series (e.g. scaled to scenario balance). */
  chartDataOverride?: ChartDataPoint[];
};

export function CrpInvestmentPortfolioClient({
  greetingLine = "Good morning, welcome back",
  lastUpdatedLabel = "Last updated: Dec 15, 2024",
  portfolioDataPartial,
  allocationsOverride,
  chartDataOverride,
}: CrpInvestmentPortfolioClientProps = {}) {
  const [activeRange, setActiveRange] = useState<PerformanceTimeRange>("YTD");

  const portfolioData = { ...mockPortfolioData, ...portfolioDataPartial };
  const chartData = chartDataOverride ?? mockChartData;
  const allocations = allocationsOverride ?? mockAllocations;

  const chartMax = Math.max(
    ...chartData.map((d) => Math.max(d.portfolioValue, d.benchmarkValue)),
  );
  const chartMin = Math.min(
    ...chartData.map((d) => Math.min(d.portfolioValue, d.benchmarkValue)),
  );
  const chartRange = chartMax - chartMin || 1;

  return (
    <motion.div
      className="mx-auto max-w-7xl space-y-8 px-6 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.header variants={itemVariants}>
        <p className="text-sm text-muted-foreground">{greetingLine}</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">Investment Portfolio</h1>
        <p className="mt-1 text-sm text-muted-foreground">{lastUpdatedLabel}</p>
      </motion.header>

      <motion.div
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
      >
        <motion.div
          variants={itemVariants}
          className="rounded-xl border border-border bg-card p-5 shadow-sm"
        >
          <div className="mb-2 flex items-center gap-2 text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">Total Balance</span>
          </div>
          <p className="text-2xl font-bold tracking-tight">
            {formatCurrency(portfolioData.totalBalance)}
          </p>
          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
            <TrendingUp className="h-3 w-3" />+{portfolioData.totalGainPercent}%
          </span>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="rounded-xl border border-border bg-card p-5 shadow-sm"
        >
          <div className="mb-2 flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">Total Gain</span>
          </div>
          <p className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
            {formatCurrency(portfolioData.totalGain)}
          </p>
          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <ArrowRight className="h-3 w-3 text-emerald-500" />
            Since inception
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="rounded-xl border border-border bg-card p-5 shadow-sm"
        >
          <div className="mb-2 flex items-center gap-2 text-muted-foreground">
            <BarChart3 className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">YTD Contribution</span>
          </div>
          <p className="text-2xl font-bold tracking-tight">
            {formatCurrency(ACCOUNT_OVERVIEW.ytdContribution)}
          </p>
          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <ChevronRight className="h-3 w-3" />
            Year to date
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="rounded-xl border border-border bg-card p-5 shadow-sm"
        >
          <div className="mb-2 flex items-center gap-2 text-muted-foreground">
            <Target className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">Rate of Return</span>
          </div>
          <p className="text-2xl font-bold tracking-tight">{ACCOUNT_OVERVIEW.rateOfReturnPercent}%</p>
          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
            <TrendingUp className="h-3 w-3" />+{ACCOUNT_OVERVIEW.ytdPercent}% YTD
          </span>
        </motion.div>
      </motion.div>

      <motion.section
        variants={itemVariants}
        className="rounded-xl border border-border bg-card p-6 shadow-sm"
      >
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Performance</h2>
            <p className="text-sm text-muted-foreground">
              Portfolio vs {portfolioData.benchmarkName}
            </p>
          </div>
          <div className="flex gap-1 rounded-lg bg-muted/50 p-1">
            {PERFORMANCE_TIME_RANGES.map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setActiveRange(range)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  activeRange === range
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4 flex items-center gap-6 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-primary" />
            Portfolio
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
            {portfolioData.benchmarkName}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm bg-emerald-400/60" />
            Contribution
          </span>
        </div>

        <div className="flex h-48 items-end gap-2">
          {chartData.map((point) => {
            const portfolioHeight = ((point.portfolioValue - chartMin) / chartRange) * 100;
            const benchmarkHeight = ((point.benchmarkValue - chartMin) / chartRange) * 100;

            return (
              <div key={point.date} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex h-40 w-full items-end gap-[2px]">
                  <motion.div
                    className="flex-1 rounded-t-sm bg-primary"
                    initial={{ height: 0 }}
                    animate={{ height: `${portfolioHeight}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                  <motion.div
                    className="flex-1 rounded-t-sm bg-slate-300 dark:bg-slate-600"
                    initial={{ height: 0 }}
                    animate={{ height: `${benchmarkHeight}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </div>
                {point.contribution ? <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> : null}
                <span className="mt-0.5 text-[10px] text-muted-foreground">{point.date}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex justify-between border-t border-border pt-4 text-xs text-muted-foreground">
          <span>
            Portfolio Return:{" "}
            <strong className="text-emerald-600 dark:text-emerald-400">
              +{chartData[chartData.length - 1].portfolioReturn}%
            </strong>
          </span>
          <span>
            {portfolioData.benchmarkName}:{" "}
            <strong>+{chartData[chartData.length - 1].benchmarkReturn}%</strong>
          </span>
          <span>
            Alpha:{" "}
            <strong className="text-emerald-600 dark:text-emerald-400">+{portfolioData.alpha}%</strong>
          </span>
        </div>
      </motion.section>

      <motion.section variants={itemVariants}>
        <h2 className="mb-4 text-lg font-semibold">Plan Breakdown</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockPlans.map((plan) => (
            <motion.div
              key={plan.id}
              variants={itemVariants}
              className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold">{plan.name}</h3>
                  <span className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary">
                    {plan.type}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "h-2 w-2 rounded-full",
                      plan.status === "Active" ? "bg-emerald-500" : "bg-amber-400",
                    )}
                  />
                  <span className="text-[10px] text-muted-foreground">{plan.status}</span>
                </div>
              </div>

              <div>
                <p className="text-xl font-bold tracking-tight">{formatCurrency(plan.balance)}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{plan.percentOfTotal}% of total</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "flex items-center gap-0.5 text-xs font-medium",
                      plan.ytdReturn >= 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-600 dark:text-red-400",
                    )}
                  >
                    {plan.ytdReturn >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {plan.ytdReturn >= 0 ? "+" : ""}
                    {plan.ytdReturn}% YTD
                  </span>
                </div>
                <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium", RISK_LEVEL_COLORS[plan.riskLevel])}>
                  {plan.riskLevel}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-2">
                <MiniSparkline data={plan.trend} />
                {plan.contributionRate > 0 ? (
                  <span className="text-[10px] text-muted-foreground">{plan.contributionRate}% contrib.</span>
                ) : null}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section
        variants={itemVariants}
        className="rounded-xl border border-border bg-card p-6 shadow-sm"
      >
        <div className="mb-5 flex items-center gap-2">
          <PieChart className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Asset Allocation</h2>
        </div>

        <div className="mb-6 flex h-4 overflow-hidden rounded-full">
          {allocations.map((alloc) => (
            <motion.div
              key={alloc.name}
              className="h-full first:rounded-l-full last:rounded-r-full"
              style={{ backgroundColor: alloc.color }}
              initial={{ width: 0 }}
              animate={{ width: `${alloc.currentPercent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          ))}
        </div>

        <div className="space-y-3">
          {allocations.map((alloc) => (
            <div
              key={alloc.name}
              className="flex items-center justify-between border-b border-border py-2 last:border-0"
            >
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 shrink-0 rounded-sm" style={{ backgroundColor: alloc.color }} />
                <span className="text-sm font-medium">{alloc.name}</span>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <span className="tabular-nums">
                  <span className="mr-1 text-xs text-muted-foreground">Current</span>
                  <strong>{alloc.currentPercent}%</strong>
                </span>
                <span className="tabular-nums">
                  <span className="mr-1 text-xs text-muted-foreground">Target</span>
                  {alloc.targetPercent}%
                </span>
                <span
                  className={cn(
                    "min-w-[3rem] text-right text-xs font-medium tabular-nums",
                    alloc.drift > 0
                      ? "text-amber-600 dark:text-amber-400"
                      : alloc.drift < 0
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-muted-foreground",
                  )}
                >
                  {alloc.drift > 0 ? "+" : ""}
                  {alloc.drift === 0 ? "—" : `${alloc.drift}%`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section
        variants={itemVariants}
        className="rounded-xl border border-border bg-card p-6 shadow-sm"
      >
        <div className="mb-5 flex items-center gap-2">
          <Shield className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Portfolio Health</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Risk Score</span>
              <span className="font-semibold tabular-nums">{portfolioData.riskScore}/100</span>
            </div>
            <ScoreBar score={portfolioData.riskScore ?? 0} />
            <p className="text-[10px] text-muted-foreground">Moderate risk profile</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Diversification</span>
              <span className="font-semibold tabular-nums">{portfolioData.diversificationScore}/100</span>
            </div>
            <ScoreBar score={portfolioData.diversificationScore ?? 0} />
            <p className="text-[10px] text-muted-foreground">Well diversified</p>
          </div>

          <div className="space-y-2">
            <span className="text-sm text-muted-foreground">Alpha</span>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">+{portfolioData.alpha}%</p>
            <p className="text-[10px] text-muted-foreground">
              vs {portfolioData.benchmarkName} ({portfolioData.benchmarkReturnPercent}%)
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-sm text-muted-foreground">Confidence</span>
            <div className="mt-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                {ACCOUNT_OVERVIEW.onTrack.title}
              </span>
            </div>
            <p className="text-[10px] leading-relaxed text-muted-foreground">{ACCOUNT_OVERVIEW.onTrack.message}</p>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}

export default CrpInvestmentPortfolioClient;
