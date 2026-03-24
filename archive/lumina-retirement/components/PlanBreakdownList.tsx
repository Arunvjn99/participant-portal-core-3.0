import React from 'react';
import { Plan } from '../types';
import { ArrowUpRight, Shield, Zap } from 'lucide-react';

interface Props {
  plans: Plan[];
}

export const PlanBreakdownList: React.FC<Props> = ({ plans }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-1">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Enrolled Plans</h3>
        <button className="text-indigo-600 text-xs font-semibold hover:underline">Manage Enrollments</button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plans.map((plan) => (
            <div key={plan.id} className="group bg-white rounded-xl border border-slate-200 p-5 hover:border-indigo-200 hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${plan.type === '401k' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                            <Shield size={18} />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 text-sm leading-tight">{plan.name}</h4>
                            <span className="text-xs text-slate-500">{plan.type} • {plan.status}</span>
                        </div>
                    </div>
                    <span className="px-2 py-1 bg-slate-50 text-slate-600 text-[10px] font-bold uppercase rounded border border-slate-100">
                        {plan.riskLevel}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <p className="text-[10px] text-slate-400 uppercase font-semibold mb-0.5">Balance</p>
                        <p className="text-lg font-bold text-slate-900">${plan.balance.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-slate-400 uppercase font-semibold mb-0.5">YTD Return</p>
                        <p className={`text-lg font-bold ${plan.ytdReturn >= 0 ? 'text-indigo-600' : 'text-red-600'}`}>
                            {plan.ytdReturn > 0 ? '+' : ''}{plan.ytdReturn}%
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">Contribution: <span className="font-semibold text-slate-900">{plan.contributionRate}%</span></span>
                        {plan.contributionRate < 10 && (
                             <span className="text-[10px] text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                                <Zap size={10} /> Boost
                             </span>
                        )}
                    </div>
                    <div className="w-16 h-8">
                         {/* Simple SVG Sparkline */}
                         <svg width="100%" height="100%" viewBox="0 0 60 20" preserveAspectRatio="none">
                            <polyline
                                points={plan.trend.map((val, i) => `${i * (60 / (plan.trend.length - 1))},${20 - (val * 2)}`).join(' ')}
                                fill="none"
                                stroke={plan.ytdReturn >= 0 ? "#4f46e5" : "#ef4444"}
                                strokeWidth="2"
                                strokeLinecap="round"
                                vectorEffect="non-scaling-stroke"
                            />
                         </svg>
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};
