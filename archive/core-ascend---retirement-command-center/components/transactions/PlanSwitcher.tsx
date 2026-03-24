import React, { useState } from 'react';
import { ChevronDown, Briefcase, Wallet, Building2 } from 'lucide-react';
import { Plan } from '../../types';

interface PlanSwitcherProps {
  plans: Plan[];
  selectedPlanId: string;
  onSelectPlan: (id: string) => void;
}

export const PlanSwitcher: React.FC<PlanSwitcherProps> = ({ plans, selectedPlanId, onSelectPlan }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedPlan = plans.find(p => p.id === selectedPlanId) || plans[0];

  const getIcon = (type: Plan['type']) => {
    switch(type) {
      case '401(k)': return <Briefcase className="w-4 h-4" />;
      case 'Roth 401(k)': return <Building2 className="w-4 h-4" />;
      case 'IRA': return <Wallet className="w-4 h-4" />;
      default: return <Briefcase className="w-4 h-4" />;
    }
  };

  return (
    <div className="relative mb-6 z-20">
      <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
        Viewing Activity For
      </label>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full md:w-96 bg-white border border-slate-200 hover:border-brand-500 rounded-lg px-4 py-3 shadow-sm transition-all text-left group"
      >
        <div className="flex items-center gap-3">
          <div className="bg-brand-50 p-2 rounded-md text-brand-600 group-hover:bg-brand-100 transition-colors">
            {getIcon(selectedPlan.type)}
          </div>
          <div>
            <div className="font-semibold text-slate-900">{selectedPlan.name}</div>
            <div className="text-xs text-slate-500">{selectedPlan.employer} • {selectedPlan.type}</div>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full md:w-96 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="py-1">
            {plans.map(plan => (
              <button
                key={plan.id}
                onClick={() => {
                  onSelectPlan(plan.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors ${selectedPlanId === plan.id ? 'bg-brand-50/50' : ''}`}
              >
                 <div className={`p-2 rounded-md ${selectedPlanId === plan.id ? 'text-brand-600' : 'text-slate-400'}`}>
                    {getIcon(plan.type)}
                  </div>
                  <div>
                    <div className={`font-medium ${selectedPlanId === plan.id ? 'text-brand-700' : 'text-slate-700'}`}>
                      {plan.name}
                    </div>
                    <div className="text-xs text-slate-500">{plan.employer}</div>
                  </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};