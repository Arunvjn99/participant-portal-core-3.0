import React from 'react';

export const SourceOfWealth: React.FC = () => {
  // Static data for demo
  const data = {
    user: 85000,
    employer: 25000,
    growth: 42000,
    total: 152000
  };

  const getPct = (val: number) => (val / data.total) * 100;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm h-full flex flex-col justify-center">
        <h3 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-wide">Source of Wealth</h3>
        
        <div className="flex h-16 w-full rounded-xl overflow-hidden mb-6 ring-4 ring-slate-50">
            <div className="bg-slate-800 h-full flex items-center justify-center relative group" style={{ width: `${getPct(data.user)}%` }}>
                 <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div className="bg-slate-400 h-full flex items-center justify-center relative group" style={{ width: `${getPct(data.employer)}%` }}>
                 <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div className="bg-indigo-500 h-full flex items-center justify-center relative group" style={{ width: `${getPct(data.growth)}%` }}>
                 <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
        </div>

        <div className="space-y-4">
            <div className="flex items-center justify-between group cursor-default">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-slate-800"></div>
                    <span className="text-sm font-medium text-slate-600">Your Contributions</span>
                </div>
                <div className="text-right">
                    <span className="block text-sm font-bold text-slate-900">${(data.user/1000).toFixed(0)}k</span>
                    <span className="block text-[10px] text-slate-400">{getPct(data.user).toFixed(1)}%</span>
                </div>
            </div>
            <div className="flex items-center justify-between group cursor-default">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                    <span className="text-sm font-medium text-slate-600">Employer Match</span>
                </div>
                <div className="text-right">
                    <span className="block text-sm font-bold text-slate-900">${(data.employer/1000).toFixed(0)}k</span>
                    <span className="block text-[10px] text-slate-400">{getPct(data.employer).toFixed(1)}%</span>
                </div>
            </div>
            <div className="flex items-center justify-between group cursor-default">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                    <span className="text-sm font-medium text-slate-600">Market Growth</span>
                </div>
                <div className="text-right">
                    <span className="block text-sm font-bold text-indigo-600">+${(data.growth/1000).toFixed(0)}k</span>
                    <span className="block text-[10px] text-slate-400">{getPct(data.growth).toFixed(1)}%</span>
                </div>
            </div>
        </div>
    </div>
  );
};
