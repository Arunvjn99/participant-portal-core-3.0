import React from 'react';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Line 
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, TrendingUp, Wallet, Target } from 'lucide-react';
import { Plan, ChartDataPoint } from '../../types';
import { Card, CardContent } from '../ui/Card';
import { CountUp } from '../ui/CountUp';

interface ActivityHeroProps {
  plan: Plan;
  data: ChartDataPoint[];
}

export const ActivityHero: React.FC<ActivityHeroProps> = ({ plan, data }) => {
  const currentBalance = plan.balance;
  const netFlow = data[data.length - 1].inflow - data[data.length - 1].outflow;
  const isPositive = netFlow >= 0;

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm p-4 border border-slate-100 shadow-xl rounded-xl">
          <p className="text-sm font-semibold text-slate-900 mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-xs text-brand-600 flex justify-between gap-4">
              <span>Balance:</span>
              <span className="font-medium">${payload[0].value.toLocaleString()}</span>
            </p>
            <p className="text-xs text-emerald-600 flex justify-between gap-4">
              <span>Inflow:</span>
              <span className="font-medium">+${payload[1].value.toLocaleString()}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="mb-8 border-none shadow-soft ring-1 ring-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-100 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-64 bg-brand-50/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 p-40 bg-emerald-50/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      <CardContent className="p-0 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[320px]">
          
          {/* Left: Financial Momentum Panel */}
          <div className="lg:col-span-5 p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-brand-100 text-brand-700">
                   Momentum
                </span>
                <span className="text-xs font-medium text-slate-500">Live Projection</span>
              </div>
              <h2 className="text-3xl font-light text-slate-900 leading-tight tracking-tight">
                Your wealth is <span className="font-semibold text-brand-700">compounding</span>.
              </h2>
              <p className="text-slate-500 text-sm mt-2 max-w-sm">
                Based on current activity, you are projected to hit your 2025 milestone 2 months early.
              </p>
            </div>

            <div className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Total Balance</p>
              <div className="flex items-baseline gap-2 mb-6">
                <CountUp 
                  end={currentBalance} 
                  decimals={2} 
                  prefix="$" 
                  className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight" 
                />
              </div>

              <div className="grid grid-cols-2 gap-6 border-t border-slate-200/60 pt-6">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <TrendingUp className={`w-3.5 h-3.5 ${isPositive ? 'text-emerald-500' : 'text-slate-400'}`} />
                    <p className="text-xs font-medium text-slate-500">Net Flow (Jan)</p>
                  </div>
                  <p className={`text-lg font-semibold ${isPositive ? 'text-emerald-700' : 'text-slate-700'}`}>
                    {isPositive ? '+' : '-'}${Math.abs(netFlow).toLocaleString()}
                  </p>
                </div>
                <div>
                   <div className="flex items-center gap-1.5 mb-1">
                    <Target className="w-3.5 h-3.5 text-brand-500" />
                    <p className="text-xs font-medium text-slate-500">12-Mo Impact</p>
                   </div>
                   <p className="text-lg font-semibold text-brand-700">+$18,450</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Visualization */}
          <div className="lg:col-span-7 bg-white/50 border-l border-slate-100 p-6 lg:p-8 flex flex-col justify-center relative">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                 <Wallet className="w-4 h-4 text-slate-400" />
                 Growth & Contribution Analysis
               </h3>
               <div className="flex gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-brand-500" />
                    <span className="text-xs text-slate-500">Balance</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-xs text-slate-500">Inflow</span>
                  </div>
               </div>
            </div>

            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                  
                  {/* Bars for Inflow */}
                  <Bar 
                    dataKey="inflow" 
                    barSize={12} 
                    fill="#10b981" 
                    radius={[4, 4, 0, 0]} 
                    fillOpacity={0.8}
                    animationDuration={1500}
                  />

                  {/* Area for Balance */}
                  <Area 
                    type="monotone" 
                    dataKey="balance" 
                    stroke="#0ea5e9" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorBalance)" 
                    activeDot={{ r: 6, strokeWidth: 4, stroke: '#fff', fill: '#0ea5e9' }}
                    animationDuration={2000}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};