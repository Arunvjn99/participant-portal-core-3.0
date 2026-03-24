/**
 * Mock data for the investment portfolio dashboard.
 * Replace with API responses; shapes are stable for integration.
 */

export type PerformancePoint = {
  date: string;
  portfolio: number;
  sp500: number;
};

export type AllocationGroup = {
  id: string;
  label: string;
  percentage: number;
  /** Chart segment color (accent); white-label primary can be applied at render time if needed */
  color: string;
  holdings: string[];
};

export type HoldingRow = {
  id: string;
  fundName: string;
  ticker?: string;
  allocationPercent: number;
  /** YTD return, percent points e.g. 8.2 for +8.2% */
  performanceYtd: number;
};

export type InsightVariant = "recommendation" | "alert" | "ai";

export type InsightItem = {
  id: string;
  variant: InsightVariant;
  title: string;
  body: string;
  /** e.g. expected impact line */
  highlight?: string;
  ctaLabel?: string;
};

export type PortfolioSummary = {
  totalBalance: number;
  /** YTD return % */
  growthPercentYtd: number;
  asOfLabel: string;
  /** Snapshot date line under “Portfolio snapshot” */
  snapshotDateLabel: string;
  totalInvested: number;
  totalGain: number;
  gainPercentAllTime: number;
  /** Trailing 12-month return % (KPI) */
  annualReturnPercent: number;
  vsSp500Percent: number;
};

export const PERFORMANCE_TIME_RANGES = ["1M", "3M", "YTD", "1Y", "5Y"] as const;
export type PerformanceTimeRange = (typeof PERFORMANCE_TIME_RANGES)[number];

export const mockPerformanceByRange: Record<
  PerformanceTimeRange,
  { data: PerformancePoint[] }
> = {
  "1M": {
    data: [
      { date: "Feb 16", portfolio: 278.2, sp500: 276.8 },
      { date: "Feb 23", portfolio: 280.1, sp500: 278.3 },
      { date: "Mar 2", portfolio: 282.5, sp500: 279.9 },
      { date: "Mar 9", portfolio: 285.1, sp500: 282.4 },
      { date: "Mar 16", portfolio: 287.5, sp500: 284.1 },
    ],
  },
  "3M": {
    data: [
      { date: "Dec", portfolio: 265.3, sp500: 264.1 },
      { date: "Jan", portfolio: 272.8, sp500: 271.2 },
      { date: "Feb", portfolio: 278.2, sp500: 276.8 },
      { date: "Mar", portfolio: 287.5, sp500: 284.1 },
    ],
  },
  YTD: {
    data: [
      { date: "Jan", portfolio: 256.0, sp500: 255.2 },
      { date: "Feb", portfolio: 265.3, sp500: 264.1 },
      { date: "Mar", portfolio: 287.5, sp500: 284.1 },
    ],
  },
  "1Y": {
    data: [
      { date: "Mar '25", portfolio: 224.0, sp500: 226.3 },
      { date: "May", portfolio: 232.5, sp500: 233.8 },
      { date: "Jul", portfolio: 241.2, sp500: 240.5 },
      { date: "Sep", portfolio: 248.9, sp500: 247.2 },
      { date: "Nov", portfolio: 256.0, sp500: 253.8 },
      { date: "Jan '26", portfolio: 272.8, sp500: 271.2 },
      { date: "Mar", portfolio: 287.5, sp500: 284.1 },
    ],
  },
  "5Y": {
    data: [
      { date: "2021", portfolio: 118.0, sp500: 122.0 },
      { date: "2022", portfolio: 142.5, sp500: 138.0 },
      { date: "2023", portfolio: 178.0, sp500: 172.0 },
      { date: "2024", portfolio: 224.0, sp500: 226.3 },
      { date: "2025", portfolio: 256.0, sp500: 253.8 },
      { date: "2026", portfolio: 287.5, sp500: 284.1 },
    ],
  },
};

export const mockPortfolioSummary: PortfolioSummary = {
  totalBalance: 287_450.82,
  growthPercentYtd: 12.4,
  asOfLabel: "As of Mar 16, 2026",
  snapshotDateLabel: "March 16, 2026",
  totalInvested: 239_220,
  totalGain: 48_230.82,
  gainPercentAllTime: 20.2,
  annualReturnPercent: 12.4,
  vsSp500Percent: 1.2,
};

/** Retirement projection chart uses values in thousands (e.g. 1420 → $1.42M). */
export type RetirementProjectionPoint = { age: number; projected: number };

export type RetirementScenario = {
  projectedLabel: string;
  monthlyIncome: string;
  /** Line + ring accent (hex ok for chart; ring uses this stroke) */
  chartColor: string;
  description: string;
  score: number;
  data: RetirementProjectionPoint[];
};

export const RETIREMENT_SCENARIO_TABS = ["Base", "Market -10%", "Market +10%", "+2% Contribution"] as const;
export type RetirementScenarioTab = (typeof RETIREMENT_SCENARIO_TABS)[number];

/** Goal line on chart ($1.3M → 1300 on Y axis in $k). */
export const mockRetirementGoalK = 1300;

export const mockRetirementScenarios: Record<RetirementScenarioTab, RetirementScenario> = {
  Base: {
    projectedLabel: "$1,420,000",
    monthlyIncome: "$4,820",
    chartColor: "#3b82f6",
    description: "Current trajectory at 8% contribution",
    score: 74,
    data: [
      { age: 35, projected: 287 },
      { age: 40, projected: 420 },
      { age: 45, projected: 580 },
      { age: 50, projected: 780 },
      { age: 55, projected: 1020 },
      { age: 60, projected: 1220 },
      { age: 65, projected: 1420 },
    ],
  },
  "Market -10%": {
    projectedLabel: "$1,120,000",
    monthlyIncome: "$3,800",
    chartColor: "#ef4444",
    description: "Stress test with 10% market decline",
    score: 58,
    data: [
      { age: 35, projected: 287 },
      { age: 40, projected: 370 },
      { age: 45, projected: 470 },
      { age: 50, projected: 610 },
      { age: 55, projected: 790 },
      { age: 60, projected: 950 },
      { age: 65, projected: 1120 },
    ],
  },
  "Market +10%": {
    projectedLabel: "$1,780,000",
    monthlyIncome: "$6,040",
    chartColor: "#10b981",
    description: "Optimistic scenario with market growth",
    score: 92,
    data: [
      { age: 35, projected: 287 },
      { age: 40, projected: 480 },
      { age: 45, projected: 710 },
      { age: 50, projected: 990 },
      { age: 55, projected: 1300 },
      { age: 60, projected: 1540 },
      { age: 65, projected: 1780 },
    ],
  },
  "+2% Contribution": {
    projectedLabel: "$1,610,000",
    monthlyIncome: "$5,460",
    chartColor: "#8b5cf6",
    description: "Increase contribution from 8% to 10%",
    score: 84,
    data: [
      { age: 35, projected: 287 },
      { age: 40, projected: 460 },
      { age: 45, projected: 660 },
      { age: 50, projected: 900 },
      { age: 55, projected: 1180 },
      { age: 60, projected: 1400 },
      { age: 65, projected: 1610 },
    ],
  },
};

export const mockAllocation: AllocationGroup[] = [
  {
    id: "growth",
    label: "Growth Assets",
    percentage: 55,
    color: "#3b82f6",
    holdings: ["US Large Cap (35%)", "Int'l Stocks (12%)", "Small Cap (8%)"],
  },
  {
    id: "income",
    label: "Income Assets",
    percentage: 30,
    color: "#8b5cf6",
    holdings: ["Investment Grade Bonds (18%)", "TIPS (7%)", "High Yield (5%)"],
  },
  {
    id: "defensive",
    label: "Defensive Assets",
    percentage: 15,
    color: "#06b6d4",
    holdings: ["Money Market (8%)", "Stable Value (5%)", "Cash (2%)"],
  },
];

export const mockHoldings: HoldingRow[] = [
  {
    id: "1",
    fundName: "Vanguard 500 Index Admiral",
    ticker: "VFIAX",
    allocationPercent: 28,
    performanceYtd: 11.2,
  },
  {
    id: "2",
    fundName: "International Growth Fund",
    ticker: "IGF",
    allocationPercent: 14,
    performanceYtd: 9.4,
  },
  {
    id: "3",
    fundName: "Core Bond Fund",
    ticker: "CBF",
    allocationPercent: 18,
    performanceYtd: 3.1,
  },
  {
    id: "4",
    fundName: "Target Retirement 2055",
    ticker: "TR2055",
    allocationPercent: 22,
    performanceYtd: 10.8,
  },
  {
    id: "5",
    fundName: "Stable Value Fund",
    ticker: "SVF",
    allocationPercent: 12,
    performanceYtd: 4.2,
  },
  {
    id: "6",
    fundName: "Company Stock Fund",
    ticker: "CSF",
    allocationPercent: 6,
    performanceYtd: -2.4,
  },
];

export const mockInsights: InsightItem[] = [
  {
    id: "i1",
    variant: "recommendation",
    title: "Rebalance portfolio",
    body: "Your allocation has drifted about 5% from target. Rebalancing can reduce risk and align with your plan.",
    highlight: "+0.8% expected annual return (illustrative)",
    ctaLabel: "Review allocation",
  },
  {
    id: "i2",
    variant: "alert",
    title: "Contribution opportunity",
    body: "Increasing deferral from 8% to 10% could add meaningful savings by retirement, based on typical assumptions.",
    highlight: "High impact on long-term balance",
    ctaLabel: "Adjust contribution",
  },
  {
    id: "i3",
    variant: "ai",
    title: "AI suggestion",
    body: "Given your time horizon, a modest tilt toward diversified equities may improve expected outcomes. Confirm with your advisor.",
    highlight: "Personalized to your profile (demo)",
    ctaLabel: "Ask assistant",
  },
];
