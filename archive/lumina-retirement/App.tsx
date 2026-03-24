import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { PerformanceHeader } from './components/PerformanceHeader';
import { PerformanceChart } from './components/PerformanceChart';
import { SourceOfWealth } from './components/SourceOfWealth';
import { PlanBreakdownList } from './components/PlanBreakdownList';
import { AIInsightsPanel } from './components/AIInsightsPanel';
import { ActionGrid } from './components/ActionGrid';
import { PortfolioData, ChartDataPoint, Plan } from './types';

// --- MOCK DATA ---

const mockPortfolioData: PortfolioData = {
  totalBalance: 242850.45,
  totalGain: 42210.20,
  totalGainPercent: 18.4,
  alpha: 2.1,
  benchmarkName: "S&P 500",
  benchmarkReturnPercent: 16.3,
};

const mockPlans: Plan[] = [
    { 
        id: '1', name: 'Lumina 401(k) Plan', type: '401k', balance: 185400, percentOfTotal: 76, ytdReturn: 19.2, 
        riskLevel: 'Aggressive', contributionRate: 12, status: 'Active', trend: [10, 12, 11, 14, 15, 18, 19] 
    },
    { 
        id: '2', name: 'Health Savings Account', type: 'HSA', balance: 12450, percentOfTotal: 5, ytdReturn: 4.5, 
        riskLevel: 'Conservative', contributionRate: 0, status: 'Active', trend: [4, 4, 4, 5, 5, 4, 5] 
    },
    { 
        id: '3', name: 'Roth IRA Rollover', type: 'Roth IRA', balance: 45000, percentOfTotal: 19, ytdReturn: 16.8, 
        riskLevel: 'Moderate', contributionRate: 0, status: 'Paused', trend: [10, 11, 12, 13, 15, 16, 17] 
    },
];

const mockChartData: ChartDataPoint[] = [
  { date: 'Jan', portfolioValue: 200000, benchmarkValue: 200000, portfolioReturn: 0, benchmarkReturn: 0, contribution: true },
  { date: 'Feb', portfolioValue: 205000, benchmarkValue: 202000, portfolioReturn: 2.5, benchmarkReturn: 1.0 },
  { date: 'Mar', portfolioValue: 203000, benchmarkValue: 201000, portfolioReturn: 1.5, benchmarkReturn: 0.5 },
  { date: 'Apr', portfolioValue: 210000, benchmarkValue: 206000, portfolioReturn: 5.0, benchmarkReturn: 3.0, contribution: true },
  { date: 'May', portfolioValue: 215000, benchmarkValue: 210000, portfolioReturn: 7.5, benchmarkReturn: 5.0 },
  { date: 'Jun', portfolioValue: 222000, benchmarkValue: 215000, portfolioReturn: 11.0, benchmarkReturn: 7.5 },
  { date: 'Jul', portfolioValue: 228000, benchmarkValue: 220000, portfolioReturn: 14.0, benchmarkReturn: 10.0, contribution: true },
  { date: 'Aug', portfolioValue: 226000, benchmarkValue: 219000, portfolioReturn: 13.0, benchmarkReturn: 9.5 },
  { date: 'Sep', portfolioValue: 232000, benchmarkValue: 224000, portfolioReturn: 16.0, benchmarkReturn: 12.0 },
  { date: 'Oct', portfolioValue: 235000, benchmarkValue: 228000, portfolioReturn: 17.5, benchmarkReturn: 14.0, contribution: true },
  { date: 'Nov', portfolioValue: 239000, benchmarkValue: 231000, portfolioReturn: 19.5, benchmarkReturn: 15.5 },
  { date: 'Dec', portfolioValue: 242850, benchmarkValue: 232600, portfolioReturn: 21.4, benchmarkReturn: 16.3 },
];

const App: React.FC = () => {
  const [timeRange, setTimeRange] = useState('YTD');
  const [selectedPlanId, setSelectedPlanId] = useState<string | 'all'>('all');

  // Filter logic (mock)
  const displayData = selectedPlanId === 'all' 
    ? mockPortfolioData 
    : { ...mockPortfolioData, totalBalance: mockPlans.find(p => p.id === selectedPlanId)?.balance || 0, totalGainPercent: mockPlans.find(p => p.id === selectedPlanId)?.ytdReturn || 0 };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-20 font-sans">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-8">
        <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Plan Performance</h2>
            <p className="text-sm text-slate-500">Comprehensive analysis of your retirement investments.</p>
        </div>

        <PerformanceHeader 
          data={displayData} 
          plans={mockPlans}
          selectedPlanId={selectedPlanId}
          setSelectedPlanId={setSelectedPlanId}
          timeRange={timeRange}
          setTimeRange={setTimeRange}
        />

        <AIInsightsPanel data={displayData} plans={mockPlans} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 h-[420px]">
                <PerformanceChart data={mockChartData} timeRange={timeRange} />
            </div>
            <div className="lg:col-span-1 h-[420px]">
                <SourceOfWealth />
            </div>
        </div>

        <PlanBreakdownList plans={mockPlans} />

        <ActionGrid />

        <footer className="mt-12 text-center text-xs text-slate-400 py-8 border-t border-slate-200">
            <p className="mb-2">Performance data as of Market Close. Returns are time-weighted.</p>
            <p>&copy; 2024 Lumina Retirement Solutions.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
