import React from 'react';
import { ProgressBar } from '../ui/ProgressBar';
import { Clock, CheckCircle2, ArrowRightLeft } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/Card';

export const StatusTracker: React.FC = () => {
  return (
    <Card className="mb-6 sticky top-6">
      <CardHeader title="In Progress" className="py-4" />
      <CardContent className="space-y-6">
        
        {/* Item 1 */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-900">Rollover Verification</span>
            <span className="text-xs text-brand-600 font-bold">75%</span>
          </div>
          <ProgressBar progress={75} color="bg-brand-500" />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-slate-500 flex items-center gap-1">
               <Clock className="w-3 h-3" /> ETA: 3 Days
            </span>
            <span className="text-xs text-slate-400">Step 3 of 4</span>
          </div>
        </div>

        <div className="h-px bg-slate-100" />

        {/* Item 2 */}
        <div>
           <div className="flex justify-between items-start mb-2">
             <div>
                <span className="text-sm font-medium text-slate-900 block">Pending Withdrawal</span>
                <span className="text-xs text-slate-500">Hardship Request #W992</span>
             </div>
             <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 animate-pulse" />
           </div>
           <div className="bg-amber-50 text-amber-700 text-xs p-2 rounded-md border border-amber-100">
              Awaiting employer approval
           </div>
        </div>

        <div className="h-px bg-slate-100" />

        {/* New Rollover Item Mock */}
        <div className="opacity-80">
            <div className="flex justify-between items-center mb-2">
               <span className="text-sm font-medium text-slate-900 flex items-center gap-2">
                  <ArrowRightLeft className="w-3.5 h-3.5 text-slate-400" /> Transfer to IRA
               </span>
               <span className="text-xs text-slate-500">Initiated</span>
            </div>
            <ProgressBar progress={10} color="bg-slate-300" />
            <div className="mt-1 text-xs text-slate-400">Waiting for custodian...</div>
        </div>

        <div className="h-px bg-slate-100" />

        {/* Item 3 */}
        <div className="flex items-start gap-3 opacity-60">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            <div>
                <span className="text-sm font-medium text-slate-900 block line-through">Quarterly Rebalancing</span>
                <span className="text-xs text-slate-500">Completed Jan 1, 2025</span>
            </div>
        </div>

      </CardContent>
    </Card>
  );
};