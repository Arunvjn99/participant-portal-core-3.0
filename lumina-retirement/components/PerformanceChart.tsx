import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceDot } from 'recharts';
import { ChartDataPoint } from '../types';

interface Props {
  data: ChartDataPoint[];
  timeRange: string;
}

export const PerformanceChart: React.FC<Props> = ({ data, timeRange }) => {
  const [metric, setMetric] = useState<'value' | 'return'>('return');

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-6 h-full flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <div>
            <h3 className="text-base font-bold text-slate-800">Portfolio Growth</h3>
            <p className="text-xs text-slate-500 mt-1">Benchmarked against S&P 500 TR</p>
        </div>
        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
            <button 
                onClick={() => setMetric('return')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${metric === 'return' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                Return %
            </button>
            <button 
                onClick={() => setMetric('value')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${metric === 'value' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                Value $
            </button>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke="#f1f5f9" strokeDasharray="3 3" />
            <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }} 
                dy={10}
            />
            <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
                tickFormatter={(val) => metric === 'return' ? `${val}%` : `$${val/1000}k`}
            />
            <Tooltip 
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', padding: '12px' }}
                itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                labelStyle={{ fontSize: '11px', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                formatter={(value: number) => [metric === 'return' ? `${value}%` : `$${value.toLocaleString()}`, '']}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} iconType="circle" />
            
            <Line 
                type="monotone" 
                dataKey={metric === 'return' ? 'portfolioReturn' : 'portfolioValue'} 
                name="Your Portfolio"
                stroke="#4f46e5" 
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5' }}
            />
            <Line 
                type="monotone" 
                dataKey={metric === 'return' ? 'benchmarkReturn' : 'benchmarkValue'} 
                name="Benchmark"
                stroke="#cbd5e1" 
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
            />
            
            {/* Contribution Markers */}
            {data.filter(d => d.contribution).map((entry, index) => (
                <ReferenceDot 
                    key={index} 
                    x={entry.date} 
                    y={metric === 'return' ? entry.portfolioReturn : entry.portfolioValue} 
                    r={4} 
                    fill="#fff" 
                    stroke="#10b981" 
                    strokeWidth={2} 
                />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex items-center justify-end gap-2">
         <div className="w-2 h-2 rounded-full border-2 border-emerald-500 bg-white"></div>
         <span className="text-[10px] text-slate-400 font-medium">Contribution made</span>
      </div>
    </div>
  );
};
