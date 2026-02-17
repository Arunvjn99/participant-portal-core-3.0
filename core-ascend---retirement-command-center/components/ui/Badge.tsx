import React from 'react';
import { TransactionStatus } from '../../types';

interface BadgeProps {
  status: TransactionStatus | string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, className = '' }) => {
  let colorClass = 'bg-slate-100 text-slate-600';

  switch (status) {
    case TransactionStatus.COMPLETED:
      colorClass = 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      break;
    case TransactionStatus.PENDING:
    case TransactionStatus.PROCESSING:
      colorClass = 'bg-blue-50 text-blue-700 border border-blue-200';
      break;
    case TransactionStatus.SCHEDULED:
      colorClass = 'bg-purple-50 text-purple-700 border border-purple-200';
      break;
    case TransactionStatus.FAILED:
      colorClass = 'bg-red-50 text-red-700 border border-red-200';
      break;
    case 'Eligible':
      colorClass = 'bg-indigo-50 text-indigo-700 border border-indigo-200';
      break;
    default:
      break;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass} ${className}`}>
      {status}
    </span>
  );
};