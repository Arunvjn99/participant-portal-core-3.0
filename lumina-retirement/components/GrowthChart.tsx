import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartDataPoint } from '../types';
import { Info } from 'lucide-react';

interface Props {
  data: ChartDataPoint[];
}

export const GrowthChart: React.FC<Props> = ({ data }) => {
  const [showBreakdown, setShowBreakdown] = useState(true);

  // Calculate total gain
  const latest = data[data.length - 1];
  const totalGrowth = latest.marketValue - latest.contributions;

  return (
    <div className="glass-card rounded-3xl p-8 mb-8 bg-white/80">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">Your Growth Story</h2>
            <p className="text-slate-500 mt-1 flex items-center gap-1 text-sm">
                Time in the market beats timing the market.
                <Info size={14} className="cursor-pointer hover:text-brand-500" />
            </p>
        </div>
        
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl self-start">
            <button 
                onClick={() => setShowBreakdown(false)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${!showBreakdown ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
                Total Value
            </button>
            <button 
                onClick={() => setShowBreakdown(true)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${showBreakdown ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
                Breakdown
            </button>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorContrib" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
                dataKey="year" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }} 
                dy={10}
            />
            <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickFormatter={(value) => `$${value / 1000}k`} 
            />
            <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
            />
            
            {showBreakdown ? (
                <>
                    <Area 
                        type="monotone" 
                        dataKey="marketValue" 
                        stackId="1" 
                        stroke="#3b82f6" 
                        fill="url(#colorValue)" 
                        strokeWidth={2}
                        name="Market Growth" 
                    />
                    <Area 
                        type="monotone" 
                        dataKey="contributions" 
                        stackId="2" // Separate stacks for overlay effect in this design, or same stack to stack them. Let's do overlay (no stackId) or just use logic. Actually standard practice is total = contributions + growth. So let's just plot 'marketValue' (which is total) and 'contributions'. Recharts Area draws order matters.
                        stroke="#94a3b8" 
                        fill="url(#colorContrib)" 
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        name="Your Contributions" 
                    />
                </>
            ) : (
                <Area 
                    type="monotone" 
                    dataKey="marketValue" 
                    stroke="#3b82f6" 
                    fill="url(#colorValue)" 
                    strokeWidth={3} 
                    name="Total Portfolio Value"
                />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 flex items-center justify-between p-4 bg-brand-50 rounded-2xl border border-brand-100">
        <div className="flex gap-4">
             <div>
                <span className="block text-xs text-brand-400 font-semibold uppercase tracking-wider">Net Market Gain</span>
                <span className="text-xl font-bold text-brand-700">+${totalGrowth.toLocaleString()}</span>
             </div>
        </div>
        <div className="text-right">
             <span className="text-sm text-brand-600 font-medium">Compound interest is working for you.</span>
        </div>
      </div>
    </div>
  );
};
