import React from 'react';
import { Badge } from '../ui/Badge';
import { TrendingUp, DollarSign, RefreshCw, Settings2, PieChart } from 'lucide-react';
import { Card } from '../ui/Card';

interface ActionTileProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  badge?: string;
  eligibilityText?: string;
  compact?: boolean;
  onClick?: () => void;
}

const ActionTile: React.FC<ActionTileProps> = ({ icon, title, subtitle, badge, eligibilityText, compact, onClick }) => (
  <Card 
    hoverEffect 
    onClick={onClick}
    className={`p-5 flex flex-col justify-between h-full group border-slate-200 hover:border-brand-200 ${compact ? 'bg-slate-50/50' : 'bg-white'}`}
  >
    <div className="flex justify-between items-start mb-3">
      <div className="p-2.5 rounded-lg bg-white shadow-sm border border-slate-100 text-slate-600 group-hover:text-brand-600 group-hover:border-brand-100 transition-colors">
        {icon}
      </div>
      {badge && <Badge status={badge} />}
    </div>
    
    <div>
      <h4 className="font-semibold text-slate-900 mb-1 group-hover:text-brand-700 transition-colors text-sm">{title}</h4>
      <p className="text-xs text-slate-500 mb-2">{subtitle}</p>
      {eligibilityText && (
        <p className="text-[10px] font-medium text-emerald-600 uppercase tracking-wide">
          {eligibilityText}
        </p>
      )}
    </div>
  </Card>
);

export const ActionHub: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="mb-8">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <ActionTile 
          icon={<TrendingUp className="w-4 h-4" />}
          title="Take Loan"
          subtitle="Borrow from 401(k)"
          badge="Eligible"
          onClick={() => onNavigate('loan')}
        />
        <ActionTile 
          icon={<DollarSign className="w-4 h-4" />}
          title="Withdrawal"
          subtitle="Hardship & Regular"
          eligibilityText="$32k Available"
          onClick={() => onNavigate('withdrawal')}
        />
        <ActionTile 
          icon={<PieChart className="w-4 h-4" />}
          title="Reallocate"
          subtitle="Transfer Funds"
          badge="Smart"
          onClick={() => onNavigate('transfer')}
        />
        <ActionTile 
          icon={<RefreshCw className="w-4 h-4" />}
          title="Start Rollover"
          subtitle="Consolidate accounts"
          onClick={() => onNavigate('rollover')}
        />
      </div>
    </div>
  );
};