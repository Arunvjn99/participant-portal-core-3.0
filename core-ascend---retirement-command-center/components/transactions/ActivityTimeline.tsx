import React, { useState } from 'react';
import { Transaction, TransactionType } from '../../types';
import { Badge } from '../ui/Badge';
import { ChevronDown, ChevronUp, Download, FileText, ArrowUpRight, ArrowDownRight, CornerDownRight } from 'lucide-react';
import { Card } from '../ui/Card';

interface ActivityTimelineProps {
  transactions: Transaction[];
}

const TransactionRow: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
  const [expanded, setExpanded] = useState(false);
  const isNegative = transaction.amount < 0;

  const getIcon = (type: TransactionType) => {
    switch(type) {
      case TransactionType.CONTRIBUTION: return <ArrowUpRight className="w-4 h-4 text-emerald-600" />;
      case TransactionType.WITHDRAWAL: return <ArrowDownRight className="w-4 h-4 text-slate-600" />;
      case TransactionType.LOAN_PAYMENT: return <ArrowDownRight className="w-4 h-4 text-blue-600" />;
      default: return <FileText className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="border-b border-slate-100 last:border-0">
      <div 
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer group"
      >
        <div className="flex items-center gap-4">
          <div className={`p-2.5 rounded-full ${isNegative ? 'bg-slate-100' : 'bg-emerald-50'} group-hover:scale-110 transition-transform`}>
            {getIcon(transaction.type)}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">{transaction.description}</h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-slate-500">{new Date(transaction.date).toLocaleDateString()}</span>
              <span className="text-[10px] text-slate-300">•</span>
              <span className="text-xs text-slate-500">{transaction.type}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <Badge status={transaction.status} className="hidden md:inline-flex" />
          <div className="text-right">
            <span className={`block text-sm font-bold ${isNegative ? 'text-slate-900' : 'text-emerald-600'}`}>
              {isNegative ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}
            </span>
          </div>
          {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </div>

      {expanded && (
        <div className="bg-slate-50/50 p-4 pl-[4.5rem] animate-in slide-in-from-top-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Settlement Date</p>
              <p className="text-slate-700">{new Date(transaction.date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Tax Year Impact</p>
              <p className="text-slate-700">{transaction.impact?.taxYear || 'N/A'}</p>
            </div>
            <div>
               <p className="text-xs font-medium text-slate-500 mb-1">Reference ID</p>
               <p className="text-slate-700 font-mono text-xs">{transaction.id.toUpperCase()}</p>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-200 flex gap-3">
             <button className="text-xs font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1">
                <Download className="w-3 h-3" /> Download Confirmation
             </button>
             <button className="text-xs font-medium text-slate-500 hover:text-slate-700 flex items-center gap-1">
                <CornerDownRight className="w-3 h-3" /> View Plan Details
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ transactions }) => {
  return (
    <Card>
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 rounded-t-xl flex justify-between items-center">
        <h3 className="text-sm font-semibold text-slate-700">Recent Transactions</h3>
        <button className="text-xs font-medium text-brand-600 hover:text-brand-700">View All History</button>
      </div>
      <div>
        {transactions.map(t => <TransactionRow key={t.id} transaction={t} />)}
      </div>
    </Card>
  );
};