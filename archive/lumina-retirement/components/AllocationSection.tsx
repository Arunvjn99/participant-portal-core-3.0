import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { AllocationItem } from '../types';
import { getAllocationInsight } from '../services/geminiService';
import { ArrowRight, RefreshCcw, Zap } from 'lucide-react';

interface Props {
  allocations: AllocationItem[];
  riskProfile: string;
}

export const AllocationSection: React.FC<Props> = ({ allocations, riskProfile }) => {
  const [insight, setInsight] = useState("Checking allocation health...");

  useEffect(() => {
    getAllocationInsight(allocations, riskProfile).then(setInsight);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
      {/* Chart Card */}
      <div className="glass-card bg-white/80 rounded-3xl p-8 col-span-2">
        <div className="flex justify-between items-start mb-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Allocation Intelligence</h2>
                <p className="text-slate-500 text-sm mt-1">Breakdown of your current investments</p>
            </div>
            <button className="flex items-center gap-2 text-sm font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 px-4 py-2 rounded-xl transition-colors">
                <RefreshCcw size={16} />
                Rebalance
            </button>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="h-64 w-64 flex-shrink-0 relative">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={allocations}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="currentPercent"
                            cornerRadius={6}
                        >
                            {allocations.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
                {/* Center Text */}
                <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                    <span className="text-3xl font-bold text-slate-800">100%</span>
                    <span className="text-xs text-slate-400 uppercase tracking-wide">Invested</span>
                </div>
            </div>

            <div className="flex-1 w-full space-y-4">
                {allocations.map((item) => (
                    <div key={item.name} className="group">
                        <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-slate-700 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                                {item.name}
                            </span>
                            <span className="font-semibold text-slate-900">{item.currentPercent}%</span>
                        </div>
                        {/* Comparison Bar */}
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden relative">
                            <div 
                                className="h-full rounded-full absolute top-0 left-0 transition-all duration-1000"
                                style={{ width: `${item.currentPercent}%`, backgroundColor: item.color }}
                            />
                            {/* Target Marker - subtle tick */}
                            <div 
                                className="h-full w-0.5 bg-black absolute top-0 z-10 opacity-20"
                                style={{ left: `${item.targetPercent}%` }}
                            />
                        </div>
                        <div className="flex justify-between mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                             <span className="text-[10px] text-slate-400">Target: {item.targetPercent}%</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Insight & Action Card */}
      <div className="flex flex-col gap-6">
        {/* AI Insight Card */}
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <Zap size={120} />
             </div>
             
             <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4 opacity-80">
                    <Zap size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">Smart Observation</span>
                </div>
                <p className="text-lg font-medium leading-snug mb-6">
                    "{insight}"
                </p>
                <div className="flex items-center gap-2 text-indigo-100 text-sm">
                    <div className="w-full bg-indigo-500/30 rounded-full h-1.5">
                        <div className="bg-indigo-300 h-1.5 rounded-full" style={{ width: '82%' }}></div>
                    </div>
                    <span className="whitespace-nowrap font-mono text-xs">82/100 Score</span>
                </div>
             </div>
        </div>

        {/* Quick Action */}
        <button className="flex-1 glass-card bg-white/60 hover:bg-white/90 rounded-3xl p-6 transition-all group flex flex-col justify-center items-start border-l-4 border-l-emerald-400">
            <h3 className="text-lg font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">Edit Strategy</h3>
            <p className="text-slate-500 text-sm mb-4">Adjust your contribution rate or change funds.</p>
            <div className="p-2 bg-emerald-100 rounded-full text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                <ArrowRight size={20} />
            </div>
        </button>
      </div>
    </div>
  );
};
