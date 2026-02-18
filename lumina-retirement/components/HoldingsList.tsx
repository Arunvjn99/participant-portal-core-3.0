import React from 'react';
import { Holding } from '../types';
import { ArrowUpRight, TrendingUp, AlertCircle, Shield } from 'lucide-react';

interface Props {
  holdings: Holding[];
}

export const HoldingsList: React.FC<Props> = ({ holdings }) => {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6 px-2">
        <h2 className="text-2xl font-bold text-slate-800">Your Holdings</h2>
        <button className="text-brand-600 text-sm font-semibold hover:underline">View All Funds</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {holdings.map((fund) => (
          <div key={fund.id} className="group glass-card bg-white hover:bg-white/90 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-transparent hover:border-brand-200">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-brand-50 transition-colors">
                    {fund.riskLevel === 'High' ? <TrendingUp size={20} className="text-slate-600 group-hover:text-brand-600" /> : 
                     fund.riskLevel === 'Moderate' ? <Shield size={20} className="text-slate-600 group-hover:text-brand-600" /> :
                     <Shield size={20} className="text-green-600" />}
                </div>
                <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    fund.performanceYtd >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                    {fund.performanceYtd > 0 ? '+' : ''}{fund.performanceYtd}% YTD
                </div>
            </div>

            <h3 className="font-bold text-slate-800 text-lg leading-tight mb-1">{fund.name}</h3>
            <p className="text-xs text-slate-500 uppercase font-semibold tracking-wide mb-4">{fund.ticker} • {fund.category}</p>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div>
                    <span className="block text-xs text-slate-400 mb-0.5">Allocation</span>
                    <span className="block text-lg font-bold text-slate-700">{fund.allocation}%</span>
                </div>
                <div className="text-right">
                    <span className="block text-xs text-slate-400 mb-0.5">Exp Ratio</span>
                    <span className="block text-sm font-medium text-slate-600">{fund.expenseRatio}%</span>
                </div>
            </div>
            
            <div className="mt-4 flex items-center text-brand-500 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                View Details <ArrowUpRight size={16} className="ml-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
