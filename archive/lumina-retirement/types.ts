export interface PortfolioData {
  totalBalance: number;
  totalGain: number;
  totalGainPercent: number;
  alpha: number; // vs benchmark
  benchmarkName: string;
  benchmarkReturnPercent: number;
  // Extended fields
  onTrack?: boolean;
  ytdReturnPercent?: number;
  ytdReturn?: number;
  riskProfile?: string;
  diversificationScore?: number;
}

export interface Plan {
  id: string;
  name: string;
  type: string;
  balance: number;
  percentOfTotal: number;
  ytdReturn: number;
  riskLevel: 'Conservative' | 'Moderate' | 'Aggressive';
  contributionRate: number;
  status: 'Active' | 'Paused';
  trend: number[]; // Sparkline data
}

export interface ChartDataPoint {
  date: string;
  portfolioValue: number;
  benchmarkValue: number;
  portfolioReturn: number;
  benchmarkReturn: number;
  contribution?: boolean; // Marker for contribution
  // Extended fields
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

export interface Holding {
  id: string;
  name: string;
  ticker: string;
  category: string;
  allocation: number;
  expenseRatio: number;
  riskLevel: 'High' | 'Moderate' | 'Low';
  performanceYtd: number;
  return1M: number;
  returnYTD: number;
  return1Y: number;
  sparkline: number[];
}

export interface AdvancedMetrics {
  beta: number;
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
}
