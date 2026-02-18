import React from 'react';
import { Holding } from '../types';
import { ArrowUp, ArrowDown, Info } from 'lucide-react';

interface Props {
  holdings: Holding[];
}

export const HoldingsTable: React.FC<Props> = ({ holdings }) => {
  return (
    <div className="card overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800">Holdings Performance</h3>
        <button className="text-primary-600 text-xs font-semibold hover:underline">Download CSV</button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-3 border-b border-slate-200">Fund Name</th>
                    <th className="px-4 py-3 border-b border-slate-200 text-right">Alloc %</th>
                    <th className="px-4 py-3 border-b border-slate-200 text-right">1 Mo</th>
                    <th className="px-4 py-3 border-b border-slate-200 text-right">YTD</th>
                    <th className="px-4 py-3 border-b border-slate-200 text-right">1 Yr</th>
                    <th className="px-4 py-3 border-b border-slate-200 text-center">Exp Ratio</th>
                    <th className="px-4 py-3 border-b border-slate-200 text-center">Risk</th>
                    <th className="px-4 py-3 border-b border-slate-200 text-right">Trend (7d)</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
                {holdings.map((fund) => (
                    <tr key={fund.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                            <div className="font-semibold text-slate-800">{fund.name}</div>
                            <div className="text-xs text-slate-500">{fund.ticker} • {fund.category}</div>
                        </td>
                        <td className="px-4 py-4 text-right font-medium text-slate-700">
                            {fund.allocation}%
                        </td>
                        <td className={`px-4 py-4 text-right ${fund.return1M >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {fund.return1M > 0 ? '+' : ''}{fund.return1M}%
                        </td>
                        <td className={`px-4 py-4 text-right ${fund.returnYTD >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {fund.returnYTD > 0 ? '+' : ''}{fund.returnYTD}%
                        </td>
                        <td className={`px-4 py-4 text-right font-semibold ${fund.return1Y >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {fund.return1Y > 0 ? '+' : ''}{fund.return1Y}%
                        </td>
                        <td className="px-4 py-4 text-center text-slate-600">
                            {fund.expenseRatio}%
                        </td>
                        <td className="px-4 py-4 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                fund.riskLevel === 'High' ? 'bg-red-50 text-red-700 border border-red-100' :
                                fund.riskLevel === 'Moderate' ? 'bg-yellow-50 text-yellow-700 border border-yellow-100' :
                                'bg-green-50 text-green-700 border border-green-100'
                            }`}>
                                {fund.riskLevel}
                            </span>
                        </td>
                        <td className="px-4 py-4 flex justify-end">
                            {/* Simple Sparkline simulation using SVGs */}
                            <svg width="60" height="20" className="overflow-visible">
                                <polyline 
                                    points={fund.sparkline.map((val, i) => `${i * 10},${20 - (val * 2)}`).join(' ')} 
                                    fill="none" 
                                    stroke={fund.return1M >= 0 ? "#10b981" : "#ef4444"} 
                                    strokeWidth="1.5" 
                                />
                            </svg>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};
