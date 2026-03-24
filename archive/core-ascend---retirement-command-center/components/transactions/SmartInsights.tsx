import React from 'react';
import { Sparkles, ArrowRight, AlertTriangle, TrendingUp, Clock, Info } from 'lucide-react';
import { Insight } from '../../types';
import { Card } from '../ui/Card';

interface SmartInsightsProps {
  insights: Insight[];
}

export const SmartInsights: React.FC<SmartInsightsProps> = ({ insights }) => {
  
  const getImpactStyles = (type: Insight['impactType']) => {
    switch(type) {
      case 'Growth':
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-100',
          iconBg: 'bg-emerald-100',
          iconColor: 'text-emerald-600',
          badge: 'bg-emerald-100 text-emerald-700',
          icon: <TrendingUp className="w-5 h-5" />
        };
      case 'Risk':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-100',
          iconBg: 'bg-amber-100',
          iconColor: 'text-amber-600',
          badge: 'bg-amber-100 text-amber-800',
          icon: <AlertTriangle className="w-5 h-5" />
        };
      case 'Pending':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-100',
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          badge: 'bg-blue-100 text-blue-700',
          icon: <Clock className="w-5 h-5" />
        };
      default:
        return {
          bg: 'bg-slate-50',
          border: 'border-slate-100',
          iconBg: 'bg-slate-100',
          iconColor: 'text-slate-600',
          badge: 'bg-slate-100 text-slate-700',
          icon: <Info className="w-5 h-5" />
        };
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-600" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Smart Priority Insights</h3>
        </div>
        <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
            AI Generated • Today
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {insights.map((insight) => {
          const styles = getImpactStyles(insight.impactType);
          
          return (
            <div 
              key={insight.id}
              className={`
                relative p-5 bg-white border rounded-xl shadow-sm transition-all duration-300
                hover:shadow-lg hover:-translate-y-1 group cursor-pointer flex flex-col justify-between
                ${styles.border}
              `}
            >
              {/* Top Row */}
              <div className="flex justify-between items-start mb-3">
                <div className={`p-2 rounded-lg ${styles.iconBg} ${styles.iconColor}`}>
                   {styles.icon}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full ${styles.badge}`}>
                   {insight.impactType} Impact
                </span>
              </div>

              {/* Content */}
              <div>
                <h4 className="font-semibold text-slate-900 leading-snug mb-2 group-hover:text-brand-700 transition-colors">
                  {insight.title}
                </h4>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">
                  {insight.description}
                </p>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-slate-50 mt-auto flex items-center justify-between">
                 {insight.value && (
                    <span className={`text-xs font-bold ${insight.impactType === 'Growth' ? 'text-emerald-600' : 'text-slate-700'}`}>
                        {insight.value}
                    </span>
                 )}
                 {insight.actionLabel && (
                    <button className="text-xs font-semibold text-brand-600 hover:text-brand-800 flex items-center gap-1 group/btn">
                        {insight.actionLabel}
                        <ArrowRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                 )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};