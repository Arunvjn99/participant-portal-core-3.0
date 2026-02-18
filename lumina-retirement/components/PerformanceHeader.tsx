import React from 'react';
import { PortfolioData, Plan } from '../types';
import { ArrowUpRight, ArrowDownRight, Calendar, Filter } from 'lucide-react';

interface Props {
  data: PortfolioData;
  plans: Plan[];
  selectedPlanId: string | 'all';
  setSelectedPlanId: (id: string | 'all') => void;
  timeRange: string;
  setTimeRange: (range: string) => void;
}

const timeRanges = ['1M', '3M', 'YTD', '1Y', '3Y', '5Y', 'All'];

export const PerformanceHeader: React.FC<Props> = ({ 
  data, 
  plans, 
  selectedPlanId, 
  setSelectedPlanId,
  timeRange,
  setTimeRange 
}) => {
  const isPositive = data.totalGain >= 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 shadow-sm">
      <div className="flex flex-col gap-6">
        
        {/* Top Row: Metrics & Time */}
        <div className="flex flex-col lg:flex-row justify-between lg:items-start gap-6">
            <div>
                <p className="text-slate-500 text-sm font-medium mb-1">Total Portfolio Value</p>
                <div className="flex items-baseline gap-4">
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
                    ${data.totalBalance.toLocaleString()}
                    </h1>
                    <div className={`flex items-center gap-1.5 text-lg font-semibold ${isPositive ? 'text-indigo-600' : 'text-red-600'}`}>
                    {isPositive ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                    <span>{data.totalGainPercent}%</span>
                    </div>
                </div>
                <div className="flex items-center gap-3 mt-2 text-sm">
                    <span className="text-slate-500">
                        <span className={isPositive ? 'text-slate-900 font-medium' : ''}>${Math.abs(data.totalGain).toLocaleString()}</span> gain
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-medium text-xs border border-indigo-100">
                        {data.alpha > 0 ? '+' : ''}{data.alpha}% Alpha vs {data.benchmarkName}
                    </span>
                </div>
            </div>

            <div className="flex bg-slate-100 p-1 rounded-xl self-start">
                {timeRanges.map((range) => (
                    <button
                        key={range}
                        onClick={() => setTimeRange(range)}
                        className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                            timeRange === range 
                            ? 'bg-white text-slate-900 shadow-sm ring-1 ring-black/5' 
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        {range}
                    </button>
                ))}
            </div>
        </div>

        {/* Bottom Row: Plan Filters */}
        <div className="pt-6 border-t border-slate-100 flex items-center gap-3 overflow-x-auto pb-2 -mb-2 scrollbar-hide">
            <Filter size={16} className="text-slate-400 shrink-0" />
            <button
                onClick={() => setSelectedPlanId('all')}
                className={`px-4 py-2 rounded-full text-xs font-medium border transition-colors whitespace-nowrap ${
                    selectedPlanId === 'all'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
            >
                All Accounts
            </button>
            {plans.map(plan => (
                <button
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`px-4 py-2 rounded-full text-xs font-medium border transition-colors whitespace-nowrap ${
                        selectedPlanId === plan.id
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                >
                    {plan.name}
                </button>
            ))}
        </div>

      </div>
    </div>
  );
};
