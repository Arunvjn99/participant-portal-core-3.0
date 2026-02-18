/**
 * Investment portfolio flow types (from lumina-retirement).
 */

export type ConfidenceLevel = "onTrack" | "slightlyAggressive" | "conservative";

export interface PortfolioData {
  totalBalance: number;
  totalGain: number;
  totalGainPercent: number;
  alpha: number;
  benchmarkName: string;
  benchmarkReturnPercent: number;
  onTrack?: boolean;
  ytdReturnPercent?: number;
  ytdReturn?: number;
  riskProfile?: string;
  riskScore?: number;
  diversificationScore?: number;
  confidence?: ConfidenceLevel;
}

export interface Plan {
  id: string;
  name: string;
  type: string;
  balance: number;
  percentOfTotal: number;
  ytdReturn: number;
  riskLevel: "Conservative" | "Moderate" | "Aggressive";
  contributionRate: number;
  status: "Active" | "Paused";
  trend: number[];
}

export interface ChartDataPoint {
  date: string;
  portfolioValue: number;
  benchmarkValue: number;
  portfolioReturn: number;
  benchmarkReturn: number;
  contribution?: boolean;
  marketValue?: number;
  contributions?: number;
  year?: string;
}

export interface AllocationItem {
  name: string;
  currentPercent: number;
  targetPercent: number;
  color: string;
  drift: number;
}
