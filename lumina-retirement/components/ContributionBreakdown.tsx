import React from 'react';

export const ContributionBreakdown: React.FC = () => {
  // Static data for demo
  const data = {
    user: 85000,
    employer: 25000,
    growth: 42000,
    total: 152000
  };

  const getPct = (val: number) => (val / data.total) * 100;

  return (
    <div className="card p-6 h-full flex flex-col justify-center">
        <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wide">Source of Wealth</h3>
        
        <div className="flex h-12 w-full rounded-lg overflow-hidden mb-4 border border-slate-100">
            <div className="bg-slate-700 h-full flex items-center justify-center text-white text-[10px] font-bold" style={{ width: `${getPct(data.user)}%` }}>
                
            </div>
            <div className="bg-slate-400 h-full flex items-center justify-center text-white text-[10px] font-bold" style={{ width: `${getPct(data.employer)}%` }}>
                
            </div>
            <div className="bg-emerald-500 h-full flex items-center justify-center text-white text-[10px] font-bold" style={{ width: `${getPct(data.growth)}%` }}>
                
            </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
            <div>
                <div className="w-3 h-3 rounded-full bg-slate-700 mx-auto mb-1"></div>
                <span className="block text-xs text-slate-500">You</span>
                <span className="block text-sm font-bold text-slate-800">${(data.user/1000).toFixed(0)}k</span>
            </div>
            <div>
                <div className="w-3 h-3 rounded-full bg-slate-400 mx-auto mb-1"></div>
                <span className="block text-xs text-slate-500">Employer</span>
                <span className="block text-sm font-bold text-slate-800">${(data.employer/1000).toFixed(0)}k</span>
            </div>
            <div>
                <div className="w-3 h-3 rounded-full bg-emerald-500 mx-auto mb-1"></div>
                <span className="block text-xs text-slate-500">Market</span>
                <span className="block text-sm font-bold text-emerald-600">+${(data.growth/1000).toFixed(0)}k</span>
            </div>
        </div>
    </div>
  );
};
