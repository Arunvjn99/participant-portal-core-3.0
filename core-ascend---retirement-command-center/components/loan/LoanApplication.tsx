import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChevronRight, ChevronLeft, ShieldCheck, PieChart, 
  FileText, CheckCircle2, Lock, AlertCircle, 
  Info, TrendingUp, Calendar, CreditCard, Building2,
  ChevronDown, ChevronUp, Download, ArrowRight, Wallet,
  Clock, DollarSign, Percent, Banknote, ListChecks
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { CountUp } from '../ui/CountUp';
import { Plan, LoanFormData, LoanConfig } from '../../types';

// --- Types & Mock Data ---

const MOCK_FUNDS = [
  { name: 'Vanguard Target Retirement 2050', allocation: 60, code: 'VFIFX' },
  { name: 'Fidelity 500 Index Fund', allocation: 25, code: 'FXAIX' },
  { name: 'T. Rowe Price Blue Chip Growth', allocation: 15, code: 'TRBCX' }
];

// --- Utility Functions ---

const calculatePMT = (rate: number, nper: number, pv: number) => {
  const r = rate / 1200;
  return (pv * r * Math.pow(1 + r, nper)) / (Math.pow(1 + r, nper) - 1);
};

const generateAmortizationSchedule = (amount: number, rate: number, years: number) => {
  const r = rate / 1200;
  const n = years * 12;
  const pmt = calculatePMT(rate, n, amount);
  
  let balance = amount;
  const schedule = [];
  const today = new Date();
  
  for (let i = 1; i <= n; i++) {
    const interest = balance * r;
    const principal = pmt - interest;
    balance -= principal;
    
    // Generate some rows
    if (i <= 12 || i % 12 === 0) { // Optimize for mock display
      const date = new Date(today);
      date.setMonth(today.getMonth() + i);
      schedule.push({
        no: i,
        date: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        payment: pmt,
        principal,
        interest,
        balance: Math.max(0, balance)
      });
    }
  }
  return schedule;
};

// --- Sub-Components ---

const Stepper = ({ currentStep, steps }: { currentStep: number, steps: string[] }) => (
  <div className="flex items-center justify-between mb-8 px-4 relative">
    <div className="absolute left-0 right-0 top-3.5 h-0.5 bg-slate-100 -z-10" />
    {steps.map((step, index) => {
      const isActive = index === currentStep;
      const isCompleted = index < currentStep;
      return (
        <div key={step} className="flex flex-col items-center z-10">
          <div className={`
            w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 border-2
            ${isActive 
              ? 'bg-white border-brand-600 text-brand-600 ring-4 ring-brand-50 scale-110' 
              : isCompleted 
                ? 'bg-emerald-500 border-emerald-500 text-white' 
                : 'bg-white border-slate-200 text-slate-300'}
          `}>
            {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
          </div>
          <span className={`
            text-[10px] uppercase tracking-wider font-semibold mt-2 transition-colors duration-300
            ${isActive ? 'text-brand-700' : 'text-slate-400'}
          `}>
            {step}
          </span>
        </div>
      );
    })}
  </div>
);

const ImpactMessage = ({ type, title, message }: { type: 'info' | 'warning' | 'success', title: string, message: string }) => {
  const styles = {
    info: 'bg-blue-50 border-blue-100 text-blue-700',
    warning: 'bg-amber-50 border-amber-100 text-amber-700',
    success: 'bg-emerald-50 border-emerald-100 text-emerald-700',
  };
  const icons = {
    info: <Info className="w-4 h-4 text-blue-500" />,
    warning: <AlertCircle className="w-4 h-4 text-amber-500" />,
    success: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
  };

  return (
    <div className={`p-4 rounded-lg border flex gap-3 ${styles[type]}`}>
      <div className="mt-0.5 flex-shrink-0">{icons[type]}</div>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs opacity-90 mt-0.5 leading-relaxed">{message}</p>
      </div>
    </div>
  );
};

// --- Live Amortization Widget (Collapsible) ---
const AmortizationPreview = ({ amount, rate, years }: { amount: number, rate: number, years: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const schedule = useMemo(() => generateAmortizationSchedule(amount, rate, years).slice(0, 6), [amount, rate, years]);

  return (
    <div className="mt-4 border-t border-slate-100 pt-2">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-2 text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors"
      >
        <span className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5" /> View Repayment Breakdown
        </span>
        {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
        <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-2.5">Date</th>
                <th className="p-2.5 text-right">Payment</th>
                <th className="p-2.5 text-right">Principal</th>
                <th className="p-2.5 text-right">Interest</th>
                <th className="p-2.5 text-right">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/50">
              {schedule.map((row) => (
                <tr key={row.no} className="text-slate-600 hover:bg-slate-100/50 transition-colors">
                  <td className="p-2.5 font-medium">{row.date}</td>
                  <td className="p-2.5 text-right font-medium text-slate-900">${row.payment.toFixed(2)}</td>
                  <td className="p-2.5 text-right">${row.principal.toFixed(2)}</td>
                  <td className="p-2.5 text-right text-emerald-600">+${row.interest.toFixed(2)}</td>
                  <td className="p-2.5 text-right text-slate-500">${row.balance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-2 bg-slate-50 border-t border-slate-200 text-center">
             <button className="text-[10px] font-semibold text-brand-600 hover:text-brand-800 uppercase tracking-wide">
                View Full Schedule
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Smart Tenure Insights ---
const TenureInsights = ({ years, amount, rate }: { years: number, amount: number, rate: number }) => {
  // Compare with a baseline (e.g. 5 years if current is < 5, or 3 years if current is 5)
  const comparisonYears = years === 5 ? 3 : 5;
  
  const currentMonthly = calculatePMT(rate, years * 12, amount);
  const comparisonMonthly = calculatePMT(rate, comparisonYears * 12, amount);
  const diffMonthly = currentMonthly - comparisonMonthly;
  
  const totalInterestCurrent = (currentMonthly * years * 12) - amount;
  const totalInterestComparison = (comparisonMonthly * comparisonYears * 12) - amount;
  const diffInterest = totalInterestCurrent - totalInterestComparison;

  const isLongTerm = years >= 4;

  return (
    <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className={`p-4 rounded-lg border flex gap-3 ${isLongTerm ? 'bg-indigo-50 border-indigo-100' : 'bg-emerald-50 border-emerald-100'}`}>
        <div className={`mt-0.5 ${isLongTerm ? 'text-indigo-600' : 'text-emerald-600'}`}>
          {isLongTerm ? <TrendingUp className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
        </div>
        <div>
           <p className={`text-xs font-bold uppercase tracking-wide mb-1 ${isLongTerm ? 'text-indigo-800' : 'text-emerald-800'}`}>
             {isLongTerm ? 'Cash Flow Optimized' : 'Interest Saver'}
           </p>
           <p className="text-sm font-medium text-slate-800 mb-2">
             {isLongTerm 
               ? `Extending to ${years} years lowers your monthly payment but increases total interest.`
               : `Choosing ${years} years saves you money on interest but requires higher monthly payments.`
             }
           </p>
           <div className="flex gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">vs {comparisonYears} Year Term</span>
                <span className={`font-bold ${diffMonthly < 0 ? 'text-emerald-600' : 'text-slate-600'}`}>
                   {diffMonthly < 0 ? '-' : '+'}${Math.abs(diffMonthly).toFixed(0)} / mo
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Total Interest Impact</span>
                <span className={`font-bold ${diffInterest < 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                   {diffInterest < 0 ? '-' : '+'}${Math.abs(diffInterest).toFixed(0)}
                </span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- Updated Right Panel ---

const LoanSummaryPanel = ({ 
  data, 
  config, 
  projectedLoss,
  plan,
  step
}: { 
  data: LoanFormData, 
  config: LoanConfig, 
  projectedLoss: number,
  plan: Plan,
  step: number
}) => {
  const monthlyPayment = calculatePMT(config.interestRate, data.tenureYears * 12, data.amount);
  const netDisbursement = data.amount - config.originationFee;

  // Projection Chart Data
  const chartData = [
    { year: 'Now', baseline: plan.balance, withLoan: plan.balance - data.amount },
    { year: '5Y', baseline: plan.balance * 1.35, withLoan: (plan.balance - data.amount) * 1.35 + (data.amount * 1.1) }, // Simplified recovery curve
    { year: '10Y', baseline: plan.balance * 1.8, withLoan: (plan.balance - data.amount) * 1.8 + (data.amount * 1.3) },
    { year: '20Y', baseline: plan.balance * 2.8, withLoan: (plan.balance - data.amount) * 2.8 + (data.amount * 1.5) },
  ];

  return (
    <div className="sticky top-24 space-y-6 animate-in fade-in slide-in-from-right-4 duration-700">
      
      {/* Primary Context Card */}
      <Card className="bg-slate-50/50 border-slate-200 shadow-sm overflow-hidden">
        <CardHeader 
          title="Estimated Retirement Impact" 
          subtitle="Impact at age 65"
          className="bg-white border-b border-slate-100 py-4"
          action={<TrendingUp className="w-5 h-5 text-brand-500" />}
        />
        <div className="h-48 w-full bg-white p-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gradBaseline" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#cbd5e1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#cbd5e1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gradLoan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '11px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
              />
              <Area type="monotone" dataKey="baseline" stroke="#94a3b8" strokeDasharray="4 4" fill="url(#gradBaseline)" strokeWidth={2} name="Projected (No Loan)" />
              <Area type="monotone" dataKey="withLoan" stroke="#0ea5e9" fill="url(#gradLoan)" strokeWidth={2} name="With Loan" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="px-5 py-3 bg-white border-t border-slate-100 flex justify-between items-center text-xs">
           <span className="text-slate-500 font-medium">Projected Variance</span>
           <span className="text-amber-600 font-bold">-${projectedLoss.toLocaleString()}</span>
        </div>
        <div className="px-5 py-2 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400 text-center">
           Reflects temporary withdrawal from market growth.
        </div>
      </Card>

      {/* Summary Metrics */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-5 space-y-5">
           <div>
             <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Estimated Monthly Payment</p>
             <div className="flex items-baseline gap-2">
               <CountUp end={monthlyPayment} prefix="$" decimals={2} className="text-3xl font-bold text-slate-900" />
               <span className="text-xs text-slate-500 font-medium">/ month</span>
             </div>
           </div>
           
           <div className="h-px bg-slate-100" />
           
           <div className="space-y-3">
             <div className="flex justify-between text-sm">
               <span className="text-slate-500">Principal Amount</span>
               <span className="font-medium text-slate-900">${data.amount.toLocaleString()}</span>
             </div>
             <div className="flex justify-between text-sm">
               <span className="text-slate-500">Origination Fee</span>
               <span className="font-medium text-slate-900">${config.originationFee}</span>
             </div>
             <div className="flex justify-between text-sm pt-2 border-t border-slate-50">
               <span className="text-slate-700 font-semibold">Net Disbursement</span>
               <span className="font-bold text-emerald-600">${netDisbursement.toLocaleString()}</span>
             </div>
           </div>
        </CardContent>
      </Card>
      
      {/* Helper Note */}
      <div className="flex gap-3 px-2 opacity-80">
        <ShieldCheck className="w-4 h-4 text-slate-400 mt-0.5" />
        <p className="text-xs text-slate-400 leading-relaxed">
           Your data is secured with 256-bit encryption. Funds typically disbursed within 2-3 business days.
        </p>
      </div>

    </div>
  );
};

// --- STAGE 1: Strategy (Updated) ---

const StageStrategy = ({ data, setData, config, plan }: any) => {
  const maxLoan = Math.min(plan.vestedBalance * 0.5, config.maxAmountAbsolute);
  const percentUtilized = data.amount / plan.vestedBalance;
  
  const getAdvisorNote = () => {
    if (percentUtilized < 0.2) return "This conservative amount keeps your long-term wealth projection highly stable.";
    if (percentUtilized < 0.4) return "This amount is balanced. Ensure your repayment plan fits your monthly budget comfortably.";
    return "This loan represents a significant portion of your balance. Consider a shorter tenure to replenish funds faster.";
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Loan Strategy</h2>
        <p className="text-slate-500 text-sm mt-2 max-w-xl">
          Customize your loan terms to balance your immediate cash needs with your long-term retirement goals.
        </p>
      </div>

      <Card className="p-8 border-slate-200 shadow-sm relative overflow-visible">
        <div className="flex justify-between items-end mb-8">
          <div>
            <label className="text-sm font-bold text-slate-700 block mb-1">I want to borrow</label>
            <div className="flex items-center gap-2 text-xs text-slate-500">
               <span>Max Eligible: ${maxLoan.toLocaleString()}</span>
               <span className="w-1 h-1 rounded-full bg-slate-300" />
               <span className={`${percentUtilized > 0.4 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>
                 {(percentUtilized * 100).toFixed(0)}% of Vested Balance
               </span>
            </div>
          </div>
          <div className="text-right">
             <div className="inline-flex items-baseline bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
                <span className="text-lg text-slate-400 mr-1">$</span>
                <input 
                  type="number"
                  value={data.amount}
                  onChange={(e) => setData({...data, amount: Number(e.target.value)})}
                  className="w-32 bg-transparent text-3xl font-bold text-slate-900 outline-none text-right p-0 border-none focus:ring-0"
                  min={config.minAmount}
                  max={maxLoan}
                />
             </div>
          </div>
        </div>
        
        <div className="relative mb-6">
          <input 
            type="range" 
            min={config.minAmount} 
            max={maxLoan} 
            step={100}
            value={data.amount}
            onChange={(e) => setData({...data, amount: Number(e.target.value)})}
            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-600 relative z-10 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        <div className="flex gap-3 bg-slate-50/80 p-3 rounded-lg border border-slate-100/50 mb-6">
           <div className="mt-0.5"><Info className="w-4 h-4 text-brand-600" /></div>
           <p className="text-xs text-slate-600 leading-relaxed font-medium">
             {getAdvisorNote()}
           </p>
        </div>

        <AmortizationPreview amount={data.amount} rate={config.interestRate} years={data.tenureYears} />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 h-full flex flex-col justify-between">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-4">Repayment Tenure</label>
            <div className="grid grid-cols-5 gap-2 mb-4">
              {[1, 2, 3, 4, 5].map(year => (
                <button
                  key={year}
                  onClick={() => setData({...data, tenureYears: year})}
                  className={`
                    py-2.5 rounded-lg text-sm font-bold transition-all
                    ${data.tenureYears === year 
                      ? 'bg-brand-600 text-white shadow-md ring-2 ring-brand-100 transform scale-105' 
                      : 'bg-slate-50 border border-slate-200 text-slate-500 hover:border-brand-300 hover:bg-white hover:text-brand-600'}
                  `}
                >
                  {year}Y
                </button>
              ))}
            </div>
          </div>
          <TenureInsights years={data.tenureYears} amount={data.amount} rate={config.interestRate} />
        </Card>

        <Card className="p-6 h-full">
          <label className="block text-sm font-bold text-slate-700 mb-4">Loan Purpose</label>
          <div className="space-y-3">
             <div className="relative">
                <select 
                  value={data.purpose}
                  onChange={(e) => setData({...data, purpose: e.target.value})}
                  className="w-full p-3 pl-10 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium focus:ring-2 focus:ring-brand-500 outline-none transition-all appearance-none"
                >
                  {['General', 'Residential', 'Hardship', 'Education'].map(p => (
                    <option key={p} value={p}>{p} Purpose</option>
                  ))}
                </select>
                <TargetIcon purpose={data.purpose} className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <ChevronDown className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
             </div>
             
             <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
               <p className="text-xs text-slate-500 leading-relaxed">
                 <span className="font-semibold text-slate-700">Note:</span> Residential loans may require a Purchase Agreement and can extend up to 15 years in some plans.
               </p>
             </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

// Helper for Purpose Icon
const TargetIcon = ({ purpose, className }: { purpose: string, className?: string }) => {
   if (purpose === 'Residential') return <Building2 className={className} />;
   if (purpose === 'Education') return <FileText className={className} />;
   if (purpose === 'Hardship') return <AlertCircle className={className} />;
   return <Wallet className={className} />;
};

// --- STAGE 2: Money Flow (Preserved) ---
const StageMoneyFlow = ({ data, setData, config }: any) => {
  const netDisbursement = data.amount - config.originationFee;
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + (data.paymentMethod === 'Check' ? 7 : 3));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Money Flow</h2>
        <p className="text-slate-500 text-sm mt-1">Review disbursement details and source of funds.</p>
      </div>

      <Card className="overflow-hidden">
        <CardHeader title="Disbursement Method" className="bg-slate-50/50 border-b border-slate-100 py-4" />
        <CardContent className="p-6 space-y-6">
          <div className="flex gap-4">
             {['EFT', 'Check'].map(method => (
               <div 
                 key={method}
                 onClick={() => setData({...data, paymentMethod: method})}
                 className={`
                   flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3
                   ${data.paymentMethod === method 
                     ? 'border-brand-500 bg-brand-50/50 ring-1 ring-brand-200' 
                     : 'border-slate-100 bg-white hover:border-slate-200'}
                 `}
               >
                 <div className={`p-2 rounded-lg ${data.paymentMethod === method ? 'bg-brand-100 text-brand-600' : 'bg-slate-100 text-slate-500'}`}>
                   {method === 'EFT' ? <CreditCard className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                 </div>
                 <div>
                   <p className={`text-sm font-bold ${data.paymentMethod === method ? 'text-brand-900' : 'text-slate-700'}`}>
                     {method === 'EFT' ? 'Direct Deposit' : 'Paper Check'}
                   </p>
                   <p className="text-xs text-slate-500">
                     {method === 'EFT' ? 'Fastest (2-3 days)' : 'Mail (7-10 days)'}
                   </p>
                 </div>
               </div>
             ))}
          </div>

          {data.paymentMethod === 'EFT' ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Routing Number</label>
                  <input 
                    type="text" 
                    value={data.routingNumber}
                    onChange={(e) => setData({...data, routingNumber: e.target.value})}
                    placeholder="000000000"
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Account Number</label>
                  <input 
                    type="password" 
                    value={data.accountNumber}
                    onChange={(e) => setData({...data, accountNumber: e.target.value})}
                    placeholder="••••••••••••"
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none font-mono text-sm"
                  />
                </div>
                <div className="md:col-span-2 flex gap-4">
                  {['Checking', 'Savings'].map(type => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="acctType"
                        checked={data.accountType === type}
                        onChange={() => setData({...data, accountType: type})}
                        className="text-brand-600 focus:ring-brand-500" 
                      />
                      <span className="text-sm text-slate-700">{type}</span>
                    </label>
                  ))}
                </div>
             </div>
          ) : (
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 flex gap-3 animate-in fade-in">
               <Building2 className="w-5 h-5 text-amber-600" />
               <div>
                  <p className="text-sm font-semibold text-amber-900">Mailing to Address on File</p>
                  <p className="text-xs text-amber-700 mt-1">1234 Innovation Dr, San Francisco, CA 94103</p>
               </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// --- STAGE 3: Compliance ---
const StageCompliance = ({ data, setData }: any) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <h2 className="text-xl font-bold text-slate-900">Compliance</h2>
      <ImpactMessage 
        type="warning" 
        title="Important Considerations" 
        message="Failure to repay this loan according to the schedule may result in the outstanding balance being treated as a taxable distribution." 
      />
      <div className="grid gap-4">
        {[
          { key: 'agreedToTerms', title: 'Loan Promissory Note', desc: 'Legal agreement outlining repayment obligations.' },
          { key: 'agreedToDisclosures', title: 'Truth in Lending Disclosure', desc: 'Breakdown of APR and finance charges.' },
          { key: 'spousalConsent', title: 'Spousal Consent', desc: 'Required for married participants.' }
        ].map((item: any) => (
          <div key={item.key} onClick={() => setData({...data, [item.key]: !data[item.key]})} className={`p-5 rounded-xl border cursor-pointer transition-all ${data[item.key] ? 'bg-brand-50 border-brand-500' : 'bg-white border-slate-200'}`}>
            <div className="flex gap-4 items-center">
              <div className={`w-5 h-5 rounded border flex items-center justify-center ${data[item.key] ? 'bg-brand-600 border-brand-600' : 'border-slate-300'}`}>
                {data[item.key] && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-sm">{item.title}</h4>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- STAGE 4: Final Review (Enhanced) ---
const StageReview = ({ data, config, plan }: any) => {
  const r = config.interestRate / 1200;
  const n = data.tenureYears * 12;
  const payment = (data.amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalRepayment = payment * n;
  const totalInterest = totalRepayment - data.amount;
  const netDisbursement = data.amount - config.originationFee;

  const today = new Date();
  
  // Amortization Preview (First 3)
  const schedule = useMemo(() => generateAmortizationSchedule(data.amount, config.interestRate, data.tenureYears).slice(0, 3), [data.amount, config.interestRate, data.tenureYears]);

  // Advisor Insight Logic
  const percentUtilized = data.amount / plan.vestedBalance;
  const isHighRisk = percentUtilized > 0.3;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Review Application</h2>
        <p className="text-slate-500 text-sm mt-1">Please verify all details before submitting. This action will initiate the loan process.</p>
      </div>

      {/* 1. Loan Structure & Cost */}
      <Card>
        <CardHeader title="Loan Structure & Costs" className="py-4 bg-slate-50/50" />
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Configuration */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Configuration</h4>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-600">Principal Amount</dt>
                  <dd className="font-semibold text-slate-900">${data.amount.toLocaleString()}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-600">Interest Rate (Fixed)</dt>
                  <dd className="font-semibold text-slate-900">{config.interestRate}% APR</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-600">Term Length</dt>
                  <dd className="font-semibold text-slate-900">{data.tenureYears} Years</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-600">Payment Frequency</dt>
                  <dd className="font-semibold text-slate-900">{data.frequency}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-600">Loan Purpose</dt>
                  <dd className="font-semibold text-slate-900">{data.purpose}</dd>
                </div>
              </dl>
            </div>

            {/* Right: Cost Breakdown */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Cost Analysis</h4>
              <dl className="space-y-3 text-sm">
                 <div className="flex justify-between">
                  <dt className="text-slate-600">Total Interest</dt>
                  <dd className="font-medium text-amber-600">+${totalInterest.toLocaleString(undefined, {maximumFractionDigits: 0})}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-600 flex items-center gap-1">
                    Origination Fee <Info className="w-3 h-3 text-slate-400" />
                  </dt>
                  <dd className="font-medium text-slate-900">${config.originationFee}</dd>
                </div>
                 <div className="flex justify-between border-t border-slate-100 pt-2">
                  <dt className="text-slate-600 font-medium">Total Repayment</dt>
                  <dd className="font-bold text-slate-900">${totalRepayment.toLocaleString(undefined, {maximumFractionDigits: 0})}</dd>
                </div>
                 <div className="flex justify-between bg-emerald-50/50 p-2 rounded-lg -mx-2">
                  <dt className="text-emerald-800 font-semibold">Net Disbursement</dt>
                  <dd className="font-bold text-emerald-700">${netDisbursement.toLocaleString()}</dd>
                </div>
              </dl>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Amortization Snapshot */}
       <Card>
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
           <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
             <Calendar className="w-4 h-4 text-slate-500" /> Amortization Preview
           </h3>
           <button className="text-xs font-semibold text-brand-600 hover:text-brand-700">View Full Schedule</button>
        </div>
        <div className="overflow-x-auto">
           <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium">
                <tr>
                  <th className="p-3 pl-6">#</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-right">Principal</th>
                  <th className="p-3 text-right">Interest</th>
                  <th className="p-3 text-right pr-6">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {schedule.map(row => (
                   <tr key={row.no}>
                     <td className="p-3 pl-6 text-slate-500">{row.no}</td>
                     <td className="p-3 text-slate-700">{row.date}</td>
                     <td className="p-3 text-right text-slate-900">${row.principal.toFixed(2)}</td>
                     <td className="p-3 text-right text-emerald-600">${row.interest.toFixed(2)}</td>
                     <td className="p-3 text-right text-slate-500 pr-6">${row.balance.toLocaleString()}</td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </Card>

      {/* 3. Risk & Compliance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Advisor Note */}
         <div className={`p-4 rounded-xl border flex gap-3 ${isHighRisk ? 'bg-amber-50 border-amber-100' : 'bg-blue-50 border-blue-100'}`}>
            <div className="mt-0.5">
               {isHighRisk ? <AlertCircle className="w-5 h-5 text-amber-600" /> : <ShieldCheck className="w-5 h-5 text-blue-600" />}
            </div>
            <div>
               <p className={`text-sm font-bold ${isHighRisk ? 'text-amber-800' : 'text-blue-800'}`}>
                 {isHighRisk ? 'Utilization Notice' : 'Advisor Insight'}
               </p>
               <p className={`text-xs mt-1 leading-relaxed ${isHighRisk ? 'text-amber-700' : 'text-blue-700'}`}>
                 {isHighRisk 
                   ? `You are borrowing ${(percentUtilized*100).toFixed(0)}% of your vested balance. Ensure you have a stable repayment plan.`
                   : "Your borrowing level is within the recommended conservative range, minimizing impact on long-term growth."
                 }
               </p>
            </div>
         </div>

         {/* Compliance Checklist */}
         <div className="p-4 rounded-xl border border-slate-200 bg-white">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Compliance Verified</h4>
            <div className="space-y-2">
               <div className="flex items-center gap-2 text-xs text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Terms of Service Acknowledged
               </div>
               <div className="flex items-center gap-2 text-xs text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Truth in Lending Disclosure Accepted
               </div>
               <div className="flex items-center gap-2 text-xs text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Spousal Consent (Verified)
               </div>
            </div>
         </div>
      </div>

      {/* 4. What Happens Next */}
      <div className="pt-4 border-t border-slate-200">
         <h3 className="text-sm font-semibold text-slate-900 mb-4">What Happens Next</h3>
         <div className="flex items-center justify-between text-xs text-slate-500 relative">
             {/* Line */}
             <div className="absolute top-2 left-0 w-full h-0.5 bg-slate-100 -z-10" />
             
             {['Application Submitted', 'Processing (1 Day)', 'Funds Disbursed', 'First Payment'].map((step, i) => (
                <div key={step} className="flex flex-col items-center bg-white px-2 z-10">
                   <div className={`w-4 h-4 rounded-full border-2 ${i === 0 ? 'border-brand-600 bg-brand-600' : 'border-slate-300 bg-white'} mb-1`} />
                   <span>{step}</span>
                   {i === 2 && <span className="text-[10px] text-brand-600 font-medium">2-3 Days</span>}
                </div>
             ))}
         </div>
      </div>
    </div>
  );
};

// --- MAIN ORCHESTRATOR ---

export const LoanApplication = ({ plan, onCancel, onComplete }: { plan: Plan, onCancel: () => void, onComplete: () => void }) => {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const config: LoanConfig = {
    interestRate: 6.5,
    originationFee: 75.00,
    minAmount: 1000,
    maxAmountAbsolute: 50000,
    maxVestedPercentage: 50
  };

  const [formData, setFormData] = useState<LoanFormData>({
    amount: 5000,
    tenureYears: 5,
    frequency: 'Biweekly',
    purpose: 'General',
    paymentMethod: 'EFT',
    routingNumber: '',
    accountNumber: '',
    accountType: 'Checking',
    agreedToTerms: false,
    agreedToDisclosures: false,
    spousalConsent: false,
  });

  const steps = ['Strategy', 'Money Flow', 'Compliance', 'Review'];
  
  // Projection logic
  const projectedLoss = useMemo(() => {
    // Rough calculation: Future Value of Amount at 7% for 20 years minus Cost of Loan
    return Math.round(formData.amount * 1.8); 
  }, [formData.amount, formData.tenureYears]);

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else handleSubmit();
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
        setIsSubmitting(false);
        onComplete();
    }, 2000);
  };

  const renderStage = () => {
    switch(step) {
      case 0: return <StageStrategy data={formData} setData={setFormData} config={config} plan={plan} />;
      case 1: return <StageMoneyFlow data={formData} setData={setFormData} config={config} />;
      case 2: return <StageCompliance data={formData} setData={setFormData} />;
      case 3: return <StageReview data={formData} config={config} plan={plan} />;
      default: return null;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[600px] animate-in fade-in duration-500">
      {/* Left: Main Content (70%) */}
      <div className="lg:col-span-8">
        <div className="mb-8">
          <button onClick={onCancel} className="text-xs font-semibold text-slate-400 hover:text-slate-600 mb-4 flex items-center gap-1 group">
             <ChevronLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" /> Back to Dashboard
          </button>
          <Stepper currentStep={step} steps={steps} />
        </div>
        
        <div className="min-h-[400px]">
           {renderStage()}
        </div>

        <div className="mt-10 pt-6 border-t border-slate-200">
           <div className="flex justify-between items-center">
             {step > 0 ? (
               <button 
                 onClick={() => setStep(step - 1)}
                 className="px-6 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors"
               >
                 Back
               </button>
             ) : (
               <button onClick={onCancel} className="px-6 py-2.5 text-slate-400 font-medium text-sm hover:text-slate-600">
                  Cancel Application
               </button>
             )}
             
             <button 
               onClick={handleNext}
               disabled={isSubmitting}
               className="px-8 py-3 rounded-lg bg-brand-600 text-white font-semibold text-sm hover:bg-brand-700 shadow-md shadow-brand-200 hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-95"
             >
               {isSubmitting ? 'Processing...' : step === steps.length - 1 ? 'Confirm & Submit Loan Request' : 'Continue'}
               {!isSubmitting && <ArrowRight className="w-4 h-4" />}
             </button>
           </div>
           {step === steps.length - 1 && (
             <p className="text-center text-xs text-slate-400 mt-4 max-w-lg mx-auto leading-relaxed">
               By clicking submit, you agree to the electronic signing of all documents. You can track your request status in the Transactions tab.
             </p>
           )}
        </div>
      </div>

      {/* Right: Contextual Insight Panel (30%) */}
      <div className="lg:col-span-4 hidden lg:block">
        <LoanSummaryPanel 
          data={formData} 
          config={config} 
          projectedLoss={projectedLoss} 
          plan={plan}
          step={step}
        />
      </div>
    </div>
  );
};