import React, { useEffect, useState } from 'react';
import { PortfolioData, Plan } from '../types';
import { getPerformanceIntelligence } from '../services/geminiService';
import { Sparkles, ChevronDown, ChevronUp, Lightbulb, TrendingUp } from 'lucide-react';

interface Props {
  data: PortfolioData;
  plans: Plan[];
}

export const AIInsightsPanel: React.FC<Props> = ({ data, plans }) => {
  const [insights, setInsights] = useState<{explanation: string, optimization: string} | null>(null);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    getPerformanceIntelligence(data, plans).then(setInsights);
  }, [data, plans]);

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-lg mb-8 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-overlay filter blur-[64px] opacity-20 -mr-10 -mt-10 pointer-events-none"></div>

      <div className="relative z-10">
        <div 
            className="flex justify-between items-center cursor-pointer mb-4"
            onClick={() => setExpanded(!expanded)}
        >
            <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
                    <Sparkles size={16} className="text-indigo-300" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wide text-indigo-100">Plan Intelligence</h3>
            </div>
            {expanded ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
        </div>

        {expanded && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        <TrendingUp size={14} />
                        Performance Attribution
                    </div>
                    <p className="text-lg font-medium leading-relaxed text-slate-100">
                        "{insights?.explanation || "Analyzing portfolio structure..."}"
                    </p>
                </div>

                <div className="space-y-3 relative">
                    <div className="absolute -left-4 top-0 bottom-0 w-px bg-slate-700 hidden md:block"></div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                        <Lightbulb size={14} />
                        Actionable Insight
                    </div>
                    <p className="text-base text-slate-300 leading-relaxed">
                        {insights?.optimization || "Calculating optimization opportunities..."}
                    </p>
                    <button className="text-xs font-semibold text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-md transition-colors mt-2">
                        View Details
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
