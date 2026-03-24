import React, { useEffect, useState } from 'react';
import { PortfolioData, AllocationItem } from '../types';
import { getPortfolioInsights } from '../services/geminiService';
import { TrendingUp, ShieldCheck, Sparkles, Activity } from 'lucide-react';

interface Props {
  data: PortfolioData;
  allocations: AllocationItem[];
}

export const PortfolioHero: React.FC<Props> = ({ data, allocations }) => {
  const [insight, setInsight] = useState<string>("Analyzing your portfolio health...");

  useEffect(() => {
    // Debounce or just load once
    getPortfolioInsights(data, allocations).then(setInsight);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative overflow-hidden rounded-3xl glass-card-dark p-8 mb-8 text-white shadow-2xl">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-brand-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        
        {/* Main Balance Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase ${data.onTrack ? 'bg-green-500/20 text-green-200 border border-green-500/30' : 'bg-amber-500/20 text-amber-200 border border-amber-500/30'}`}>
              {data.onTrack ? 'On Track' : 'Needs Attention'}
            </span>
            <span className="text-blue-200/60 text-sm font-medium tracking-wide">401(k) • RETIREMENT 2045</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white">
            ${data.totalBalance.toLocaleString()}
          </h1>
          
          <div className="flex items-center gap-3 text-lg text-blue-100">
            <div className="flex items-center gap-1 text-green-300 font-semibold bg-green-500/10 px-2 py-0.5 rounded-lg border border-green-500/20">
              <TrendingUp size={18} />
              <span>+{data.ytdReturnPercent}%</span>
            </div>
            <span className="opacity-70">YTD Growth (${data.ytdReturn.toLocaleString()})</span>
          </div>
        </div>

        {/* Right Side Stats & AI Bubble */}
        <div className="flex flex-col gap-4 w-full md:w-auto">
             {/* AI Insight Bubble */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl max-w-sm self-start md:self-end animate-fade-in">
                <div className="flex items-start gap-3">
                <div className="p-2 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg shadow-lg">
                    <Sparkles size={18} className="text-white" />
                </div>
                <div>
                    <h3 className="text-xs font-bold text-indigo-200 uppercase tracking-wider mb-1">Portfolio Intelligence</h3>
                    <p className="text-sm text-white leading-relaxed font-medium">
                    "{insight}"
                    </p>
                </div>
                </div>
            </div>

            {/* Metrics */}
            <div className="flex gap-4 self-start md:self-end">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                    <ShieldCheck size={16} className="text-blue-300" />
                    <div className="flex flex-col">
                        <span className="text-[10px] text-blue-200 uppercase tracking-widest">Risk Profile</span>
                        <span className="text-sm font-semibold">{data.riskProfile}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                    <Activity size={16} className="text-purple-300" />
                    <div className="flex flex-col">
                        <span className="text-[10px] text-purple-200 uppercase tracking-widest">Health Score</span>
                        <span className="text-sm font-semibold">{data.diversificationScore}/100</span>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};
