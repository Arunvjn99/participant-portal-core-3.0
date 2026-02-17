import React from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { TrendingUp, AlertCircle } from 'lucide-react';

export const ImpactPanel: React.FC = () => {
  return (
    <Card className="bg-slate-900 border-slate-800 text-white">
      <CardHeader 
        title="Financial Impact Summary" 
        className="border-slate-800"
      />
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                <TrendingUp className="w-5 h-5" />
            </div>
            <div>
                <p className="text-sm font-medium text-slate-200">Growth Projection</p>
                <p className="text-xs text-slate-400 mt-1">
                    Your recent increase in contribution rate (9%) adds an estimated <span className="text-white font-bold">$18,400</span> to your balance by age 65.
                </p>
            </div>
        </div>

        <div className="h-px bg-slate-800" />

        <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
                <AlertCircle className="w-5 h-5" />
            </div>
            <div>
                <p className="text-sm font-medium text-slate-200">Tax Awareness</p>
                <p className="text-xs text-slate-400 mt-1">
                    You have $500 in loan repayments pending for 2025. Ensure these are cleared to avoid taxable events.
                </p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
};