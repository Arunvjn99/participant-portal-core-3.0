import React, { useState } from 'react';
import { AdvancedMetrics } from '../types';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface Props {
  metrics: AdvancedMetrics;
}

export const AdvancedAnalytics: React.FC<Props> = ({ metrics }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="card mb-6">
        <div 
            className="flex justify-between items-center px-6 py-4 cursor-pointer hover:bg-slate-50 transition-colors"
            onClick={() => setExpanded(!expanded)}
        >
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Risk & Volatility Metrics</h3>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] rounded font-semibold">3 Year Trailing</span>
            </div>
            {expanded ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
        </div>

        {expanded && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-200 border-t border-slate-200">
                <div className="bg-white p-6">
                    <div className="flex items-center gap-1 mb-1">
                        <span className="text-xs font-semibold text-slate-500">Beta</span>
                        <HelpCircle size={12} className="text-slate-300" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{metrics.beta}</div>
                    <p className="text-[10px] text-slate-400 mt-1">Slightly lower volatility than market</p>
                </div>
                <div className="bg-white p-6">
                    <div className="flex items-center gap-1 mb-1">
                        <span className="text-xs font-semibold text-slate-500">Std Deviation</span>
                        <HelpCircle size={12} className="text-slate-300" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{metrics.volatility}%</div>
                    <p className="text-[10px] text-slate-400 mt-1">Annualized volatility</p>
                </div>
                <div className="bg-white p-6">
                    <div className="flex items-center gap-1 mb-1">
                        <span className="text-xs font-semibold text-slate-500">Sharpe Ratio</span>
                        <HelpCircle size={12} className="text-slate-300" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{metrics.sharpeRatio}</div>
                    <p className="text-[10px] text-emerald-600 mt-1">Excellent risk-adjusted return</p>
                </div>
                <div className="bg-white p-6">
                    <div className="flex items-center gap-1 mb-1">
                        <span className="text-xs font-semibold text-slate-500">Max Drawdown</span>
                        <HelpCircle size={12} className="text-slate-300" />
                    </div>
                    <div className="text-2xl font-bold text-red-600">{metrics.maxDrawdown}%</div>
                    <p className="text-[10px] text-slate-400 mt-1">Peak to trough (Mar 2020)</p>
                </div>
            </div>
        )}
    </div>
  );
};
