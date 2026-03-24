import React, { useState, useEffect } from 'react';
import { AllocationItem } from '../types';
import { getAllocationDriftAnalysis } from '../services/geminiService';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  allocations: AllocationItem[];
}

export const AllocationAnalysis: React.FC<Props> = ({ allocations }) => {
  const [analysis, setAnalysis] = useState("");

  useEffect(() => {
    getAllocationDriftAnalysis(allocations).then(setAnalysis);
  }, [allocations]);

  const maxDrift = Math.max(...allocations.map(a => Math.abs(a.drift)));
  const hasWarning = maxDrift > 3;

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h3 className="text-lg font-bold text-slate-800">Target vs Current Allocation</h3>
            <p className="text-xs text-slate-500">Strategic Asset Allocation (SAA)</p>
        </div>
        {hasWarning && (
            <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded hover:bg-slate-700 transition-colors">
                <RefreshCw size={12} />
                Rebalance Portfolio
            </button>
        )}
      </div>

      <div className="space-y-5">
        {allocations.map((item) => (
            <div key={item.name} className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-3 text-sm font-medium text-slate-700">{item.name}</div>
                
                {/* Visual Bars */}
                <div className="col-span-6 flex flex-col gap-1">
                    {/* Current */}
                    <div className="flex items-center gap-2">
                        <div className="w-full bg-slate-100 rounded-sm h-2 overflow-hidden">
                            <div className="h-full rounded-sm" style={{ width: `${item.currentPercent}%`, backgroundColor: item.color }}></div>
                        </div>
                    </div>
                    {/* Target */}
                    <div className="flex items-center gap-2 relative">
                        <div className="w-full bg-transparent h-2 flex items-center">
                             {/* Target Marker */}
                             <div className="h-3 w-0.5 bg-slate-400 absolute" style={{ left: `${item.targetPercent}%` }}></div>
                             <div className="w-full border-t border-dashed border-slate-300 absolute top-1/2"></div>
                        </div>
                    </div>
                </div>

                {/* Metrics */}
                <div className="col-span-3 flex justify-end gap-4 text-xs">
                    <div className="text-right">
                        <span className="block text-slate-400">Curr</span>
                        <span className="font-semibold text-slate-900">{item.currentPercent}%</span>
                    </div>
                    <div className="text-right">
                        <span className="block text-slate-400">Tgt</span>
                        <span className="font-semibold text-slate-900">{item.targetPercent}%</span>
                    </div>
                    <div className="text-right w-12">
                        <span className="block text-slate-400">Drift</span>
                        <span className={`font-bold ${Math.abs(item.drift) > 2 ? 'text-red-600' : 'text-slate-600'}`}>
                            {item.drift > 0 ? '+' : ''}{item.drift}%
                        </span>
                    </div>
                </div>
            </div>
        ))}
      </div>

      {hasWarning && (
        <div className="mt-6 flex gap-3 p-3 bg-orange-50 border border-orange-100 rounded-lg">
            <AlertTriangle className="text-orange-500 shrink-0" size={16} />
            <p className="text-xs text-orange-800 font-medium leading-relaxed">
                {analysis || "Drift detected."}
            </p>
        </div>
      )}
    </div>
  );
};
