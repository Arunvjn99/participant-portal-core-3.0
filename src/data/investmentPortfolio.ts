import type { PortfolioData, Plan, ChartDataPoint, AllocationItem } from "../types/investmentPortfolio";

export const mockPortfolioData: PortfolioData = {
  totalBalance: 242850.45,
  totalGain: 42210.2,
  totalGainPercent: 18.4,
  alpha: 2.1,
  benchmarkName: "S&P 500",
  benchmarkReturnPercent: 16.3,
  riskScore: 62,
  diversificationScore: 78,
  confidence: "onTrack",
};

export const mockPlans: Plan[] = [
  {
    id: "1",
    name: "401(k) Plan",
    type: "401k",
    balance: 185400,
    percentOfTotal: 76,
    ytdReturn: 19.2,
    riskLevel: "Aggressive",
    contributionRate: 12,
    status: "Active",
    trend: [10, 12, 11, 14, 15, 18, 19],
  },
  {
    id: "2",
    name: "Health Savings Account",
    type: "HSA",
    balance: 12450,
    percentOfTotal: 5,
    ytdReturn: 4.5,
    riskLevel: "Conservative",
    contributionRate: 0,
    status: "Active",
    trend: [4, 4, 4, 5, 5, 4, 5],
  },
  {
    id: "3",
    name: "Roth IRA Rollover",
    type: "Roth IRA",
    balance: 45000,
    percentOfTotal: 19,
    ytdReturn: 16.8,
    riskLevel: "Moderate",
    contributionRate: 0,
    status: "Paused",
    trend: [10, 11, 12, 13, 15, 16, 17],
  },
];

export const mockChartData: ChartDataPoint[] = [
  { date: "Jan", portfolioValue: 200000, benchmarkValue: 200000, portfolioReturn: 0, benchmarkReturn: 0, contribution: true },
  { date: "Feb", portfolioValue: 205000, benchmarkValue: 202000, portfolioReturn: 2.5, benchmarkReturn: 1.0 },
  { date: "Mar", portfolioValue: 203000, benchmarkValue: 201000, portfolioReturn: 1.5, benchmarkReturn: 0.5 },
  { date: "Apr", portfolioValue: 210000, benchmarkValue: 206000, portfolioReturn: 5.0, benchmarkReturn: 3.0, contribution: true },
  { date: "May", portfolioValue: 215000, benchmarkValue: 210000, portfolioReturn: 7.5, benchmarkReturn: 5.0 },
  { date: "Jun", portfolioValue: 222000, benchmarkValue: 215000, portfolioReturn: 11.0, benchmarkReturn: 7.5 },
  { date: "Jul", portfolioValue: 228000, benchmarkValue: 220000, portfolioReturn: 14.0, benchmarkReturn: 10.0, contribution: true },
  { date: "Aug", portfolioValue: 226000, benchmarkValue: 219000, portfolioReturn: 13.0, benchmarkReturn: 9.5 },
  { date: "Sep", portfolioValue: 232000, benchmarkValue: 224000, portfolioReturn: 16.0, benchmarkReturn: 12.0 },
  { date: "Oct", portfolioValue: 235000, benchmarkValue: 228000, portfolioReturn: 17.5, benchmarkReturn: 14.0, contribution: true },
  { date: "Nov", portfolioValue: 239000, benchmarkValue: 231000, portfolioReturn: 19.5, benchmarkReturn: 15.5 },
  { date: "Dec", portfolioValue: 242850, benchmarkValue: 232600, portfolioReturn: 21.4, benchmarkReturn: 16.3 },
];

export const mockAllocations: AllocationItem[] = [
  { name: "US Large Cap", currentPercent: 45, targetPercent: 40, color: "var(--color-primary)", drift: 5 },
  { name: "International", currentPercent: 18, targetPercent: 20, color: "var(--chart-2)", drift: -2 },
  { name: "Bonds", currentPercent: 22, targetPercent: 25, color: "var(--chart-3)", drift: -3 },
  { name: "Small Cap", currentPercent: 15, targetPercent: 15, color: "var(--chart-5)", drift: 0 },
];
