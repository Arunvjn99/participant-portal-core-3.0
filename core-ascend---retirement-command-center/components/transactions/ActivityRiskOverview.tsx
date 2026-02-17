import React from 'react';
import { ProgressBar } from '../ui/ProgressBar';
import { Clock, CheckCircle2, AlertCircle, ShieldCheck, TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/Card';

export const ActivityRiskOverview: React.FC = () => {
  return (
    <div className="space-y-6">
        {/* Section 1: In Progress */}
        <Card className="sticky top-6">
        <CardHeader title="Activity & Status" className="py-4 border-slate-100" />
        <CardContent className="space-y-6">
            
            {/* Item 1 */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-900">Rollover Verification</span>
                    <span className="text-xs text-brand-600 font-bold bg-brand-50 px-1.5 py-0.5 rounded">In Progress</span>
                </div>
                <ProgressBar progress={75} color="bg-brand-500" />
                <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-slate-500 flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-slate-400" /> ETA: 3 Days
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Step 3 of 4</span>
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
                    <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                </div>
                <div className="bg-amber-50/50 text-amber-700 text-xs p-2 rounded-md border border-amber-100/50 mt-2 flex items-start gap-2">
                    <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <span>Awaiting employer approval. Documents submitted.</span>
                </div>
            </div>

            <div className="h-px bg-slate-100" />

            {/* Item 3 */}
            <div className="flex items-start gap-3 opacity-60 hover:opacity-100 transition-opacity cursor-default">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <div>
                    <span className="text-sm font-medium text-slate-900 block line-through">Quarterly Rebalancing</span>
                    <span className="text-xs text-slate-500">Completed Jan 1, 2025</span>
                </div>
            </div>

        </CardContent>
        </Card>

        {/* Section 2: Impact Analysis (Dark Mode Card) */}
        <Card className="bg-slate-900 border-slate-800 text-white overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-32 bg-brand-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-brand-500/20 transition-colors duration-700" />
            
            <CardHeader 
                title="Risk & Projection" 
                className="border-slate-800/50 relative z-10"
                action={<ShieldCheck className="w-5 h-5 text-emerald-500" />}
            />
            <CardContent className="space-y-5 relative z-10">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20">
                        <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-200">Growth Projection</p>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                            Recent contribution increase (+1%) adds an estimated <span className="text-emerald-400 font-bold">$18,400</span> to your balance by age 65.
                        </p>
                    </div>
                </div>

                <div className="h-px bg-slate-800/50" />

                <div className="flex items-start gap-3">
                    <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400 border border-amber-500/20">
                        <AlertCircle className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-200">Tax Awareness</p>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                            $500 loan repayment pending for 2025. Clear before Dec 31 to avoid taxable distribution.
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
  );
};