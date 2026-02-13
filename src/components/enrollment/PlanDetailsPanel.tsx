import * as React from "react";
import { Check, X, TrendingUp, ShieldCheck, Unlock, Activity, Lock, User, Briefcase, Calendar, MapPin, PiggyBank, Clock } from "lucide-react";
import type { PlanOption } from "../../types/enrollment";

export interface PlanDetailsUserSnapshot {
  age: number;
  retirementAge: number;
  salary: number;
  /** Years until retirement (from personalize wizard). */
  yearsToRetire?: number;
  /** Retirement location (from personalize wizard). */
  retirementLocation?: string;
  /** Other savings amount (from personalize wizard). */
  otherSavings?: number;
}

export interface PlanDetailsPanelProps {
  plan: PlanOption | null;
  user: PlanDetailsUserSnapshot;
  /** Recommendation rationale (from personalize wizard logic). Shown in Plan Overview when provided. */
  rationale?: string;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

/** Live analysis panel for selected plan: match score, metrics, pros/cons. */
export function PlanDetailsPanel({ plan, user, rationale }: PlanDetailsPanelProps) {
  if (!plan) {
    return (
      <div className="animate-fade-in rounded-2xl bg-white/50 border border-slate-200 shadow-sm flex flex-col items-center justify-center min-h-[320px] p-8 text-center dark:bg-slate-800/50 dark:border-slate-700">
        <p className="text-sm text-slate-500 dark:text-slate-400">Select a plan to see details.</p>
      </div>
    );
  }

  if (plan.isEligible === false) {
    return (
      <div className="animate-fade-in h-full">
        <div className="p-6 rounded-2xl bg-white/50 border border-slate-200 shadow-sm flex flex-col items-center text-center h-full justify-center min-h-[400px] dark:bg-slate-800/50 dark:border-slate-700">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 mb-4">
            <Lock size={24} />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">Plan Unavailable</h3>
          <p className="text-xs text-slate-500 leading-relaxed max-w-[200px] dark:text-slate-400">
            {plan.ineligibilityReason ?? "This plan is not available for your current profile."}
          </p>
        </div>
      </div>
    );
  }

  const confidenceScore = plan.fitScore ?? 0;

  return (
    <div className="animate-fade-in space-y-6">
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] dark:bg-slate-800 dark:border-slate-700">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2 dark:text-slate-500">
          <User size={12} /> Your Details
        </h4>
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100/50 dark:border-slate-600 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 mb-1">
              <User size={10} className="text-slate-400" />
              <span className="text-[10px] text-slate-400 font-medium dark:text-slate-500">Age</span>
            </div>
            <div className="text-sm font-bold text-slate-700 dark:text-slate-200">{user.age}</div>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100/50 dark:border-slate-600 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 mb-1">
              <Calendar size={10} className="text-slate-400" />
              <span className="text-[10px] text-slate-400 font-medium dark:text-slate-500">Retiring At</span>
            </div>
            <div className="text-sm font-bold text-slate-700 dark:text-slate-200">{user.retirementAge}</div>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100/50 dark:border-slate-600 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 mb-1">
              <Briefcase size={10} className="text-slate-400" />
              <span className="text-[10px] text-slate-400 font-medium dark:text-slate-500">Salary</span>
            </div>
            <div className="text-sm font-bold text-slate-700 dark:text-slate-200">
              {typeof user.salary === "number" ? formatCurrency(user.salary) : String(user.salary)}
            </div>
          </div>
          {user.yearsToRetire != null && user.yearsToRetire >= 0 && (
            <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100/50 dark:border-slate-600 flex flex-col justify-center col-span-3 sm:col-span-1">
              <div className="flex items-center gap-1.5 mb-1">
                <Clock size={10} className="text-slate-400" />
                <span className="text-[10px] text-slate-400 font-medium dark:text-slate-500">Years to Retire</span>
              </div>
              <div className="text-sm font-bold text-slate-700 dark:text-slate-200">{user.yearsToRetire}</div>
            </div>
          )}
          {user.retirementLocation && (
            <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100/50 dark:border-slate-600 flex flex-col justify-center col-span-3 sm:col-span-1">
              <div className="flex items-center gap-1.5 mb-1">
                <MapPin size={10} className="text-slate-400" />
                <span className="text-[10px] text-slate-400 font-medium dark:text-slate-500">Retirement Location</span>
              </div>
              <div className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate" title={user.retirementLocation}>{user.retirementLocation}</div>
            </div>
          )}
          {user.otherSavings != null && user.otherSavings > 0 && (
            <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100/50 dark:border-slate-600 flex flex-col justify-center col-span-3 sm:col-span-1">
              <div className="flex items-center gap-1.5 mb-1">
                <PiggyBank size={10} className="text-slate-400" />
                <span className="text-[10px] text-slate-400 font-medium dark:text-slate-500">Other Savings</span>
              </div>
              <div className="text-sm font-bold text-slate-700 dark:text-slate-200">{formatCurrency(user.otherSavings)}</div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] dark:bg-slate-800 dark:border-slate-700">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 dark:text-slate-500">
          Plan Overview
        </h4>
        <p className="text-lg font-medium text-slate-800 leading-snug mb-2 dark:text-slate-200">
          {plan.isRecommended
            ? "Best for tax-free growth over time."
            : "A solid option for your retirement savings."}
        </p>
        {rationale && (
          <p className="text-sm text-slate-600 leading-relaxed mb-4 dark:text-slate-300">
            {rationale}
          </p>
        )}
        <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950/40 p-4 border border-indigo-100 dark:border-indigo-900 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl -mr-8 -mt-8" aria-hidden />
          <div className="relative z-10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity size={14} className="text-indigo-600 dark:text-indigo-400" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Match Score</span>
              </div>
              <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{confidenceScore}%</span>
            </div>
            <div className="h-1.5 w-full bg-white dark:bg-slate-700 rounded-full overflow-hidden border border-indigo-100 dark:border-indigo-800">
              <div
                className="h-full bg-indigo-500 dark:bg-indigo-500 transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(100, confidenceScore)}%` }}
              />
            </div>
            <p className="text-[11px] text-indigo-900/70 dark:text-indigo-200/80 leading-relaxed">
              {plan.isRecommended
                ? "Excellent for growing your money tax-free."
                : "Better for keeping more money in your paycheck today."}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] dark:bg-slate-800 dark:border-slate-700 space-y-5">
        <MetricRow icon={<TrendingUp size={14} />} label="Growth" value={confidenceScore > 90 ? "Maximum" : "Stable"} score={confidenceScore} color="bg-indigo-500" />
        <MetricRow icon={<ShieldCheck size={14} />} label="Tax Benefits" value={confidenceScore > 90 ? "Tax-Free" : "Pay Later"} score={confidenceScore} color="bg-emerald-500" />
        <MetricRow icon={<Unlock size={14} />} label="Access to Money" value="Flexible" score={Math.min(100, (plan.benefits?.length ?? 0) * 25)} color="bg-blue-500" />
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] dark:bg-slate-800 dark:border-slate-700 space-y-6">
        <div className="space-y-3">
          <h5 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2 dark:text-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden /> Pros
          </h5>
          <ul className="space-y-2.5">
            {(plan.benefits ?? []).map((value, i) => (
              <li key={i} className="flex gap-2.5 text-slate-600 text-xs dark:text-slate-300">
                <Check size={14} className="text-emerald-500 shrink-0" />
                <span>{value}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full h-px bg-slate-100 dark:bg-slate-700" aria-hidden />
        <div className="space-y-3">
          <h5 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2 dark:text-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" aria-hidden /> Cons
          </h5>
          <ul className="space-y-2.5">
            <li className="flex gap-2.5 text-slate-500 text-xs dark:text-slate-400">
              <X size={14} className="text-slate-400 shrink-0" />
              <span>{plan.id === "roth-401k" || plan.isRecommended ? "You don't get a tax break today" : "You pay taxes when you take money out"}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

const MetricRow: React.FC<{ icon: React.ReactNode; label: string; value: string; score: number; color: string }> = ({ icon, label, value, score, color }) => (
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-400 shrink-0 border border-slate-100 dark:border-slate-600">
      {icon}
    </div>
    <div className="flex-1">
      <div className="flex justify-between items-baseline mb-1.5">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider dark:text-slate-500">{label}</span>
        <span className="text-[10px] font-bold text-slate-900 dark:text-slate-200">{value}</span>
      </div>
      <div className="h-1 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${Math.min(100, score)}%` }} />
      </div>
    </div>
  </div>
);
