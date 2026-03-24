import React from 'react';
import { RefreshCcw, PieChart, DollarSign, Calculator } from 'lucide-react';

export const ActionGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
      {[
        { icon: RefreshCcw, label: 'Rebalance Portfolio', desc: 'Align with target mix', color: 'text-blue-600', bg: 'bg-blue-50' },
        { icon: PieChart, label: 'Adjust Allocations', desc: 'Change investment mix', color: 'text-purple-600', bg: 'bg-purple-50' },
        { icon: DollarSign, label: 'Change Contributions', desc: 'Boost your savings', color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { icon: Calculator, label: 'Retirement Projection', desc: 'Run new simulation', color: 'text-orange-600', bg: 'bg-orange-50' },
      ].map((action) => (
        <button key={action.label} className="flex flex-col items-start p-5 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all group text-left">
            <div className={`p-3 rounded-lg ${action.bg} ${action.color} mb-3 group-hover:scale-110 transition-transform`}>
                <action.icon size={20} />
            </div>
            <h4 className="font-bold text-slate-800 text-sm mb-1">{action.label}</h4>
            <p className="text-xs text-slate-500">{action.desc}</p>
        </button>
      ))}
    </div>
  );
};
