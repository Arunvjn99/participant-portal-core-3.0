import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, 
  Info, TrendingUp, DollarSign, Building2, CreditCard, 
  FileText, ShieldCheck, Lock, Download, AlertTriangle, ArrowRight,
  Calculator, PieChart
} from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { CountUp } from '../ui/CountUp';
import { Plan, WithdrawalFormData, WithdrawalConfig, WithdrawalCategory } from '../../types';

// --- Utility Components ---

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

const ImpactBadge = ({ type, text }: { type: 'neutral' | 'warning' | 'critical', text: string }) => {
  const styles = {
    neutral: 'bg-slate-100 text-slate-600 border-slate-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    critical: 'bg-red-50 text-red-700 border-red-200',
  };
  return (
    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${styles[type]}`}>
      {text}
    </span>
  );
};

// --- STAGE 0: Eligibility & Context ---

const StageEligibility = ({ plan }: { plan: Plan }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Eligibility Check</h2>
        <p className="text-slate-500 text-sm mt-1">Reviewing your plan status and withdrawal options.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 border-l-4 border-l-emerald-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900">Eligible for Withdrawal</h3>
          </div>
          <div className="space-y-3 text-sm">
             <div className="flex justify-between border-b border-slate-50 pb-2">
               <span className="text-slate-500">Participant Status</span>
               <span className="font-medium text-slate-900">Active</span>
             </div>
             <div className="flex justify-between border-b border-slate-50 pb-2">
               <span className="text-slate-500">Vested Balance</span>
               <span className="font-medium text-slate-900">${plan.vestedBalance.toLocaleString()}</span>
             </div>
             <div className="flex justify-between">
               <span className="text-slate-500">Plan Age</span>
               <span className="font-medium text-slate-900">5 Years, 2 Months</span>
             </div>
          </div>
        </Card>

        <Card className="p-6 bg-slate-50 border-slate-200">
           <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
             <Info className="w-4 h-4 text-brand-600" /> Plan Rules & Context
           </h3>
           <ul className="space-y-3">
             <li className="flex gap-3 text-sm text-slate-600">
               <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
               <span>You are under age 59½. Withdrawals may be subject to a 10% IRS early distribution penalty.</span>
             </li>
             <li className="flex gap-3 text-sm text-slate-600">
               <FileText className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
               <span>Documentation may be required for Hardship withdrawals depending on the reason.</span>
             </li>
           </ul>
        </Card>
      </div>
    </div>
  );
};

// --- STAGE 1: Withdrawal Type ---

const StageTypeSelection = ({ data, setData }: { data: WithdrawalFormData, setData: any }) => {
  const types: { id: WithdrawalCategory, title: string, desc: string, penalty: boolean }[] = [
    { id: 'Hardship', title: 'Hardship Withdrawal', desc: 'For immediate and heavy financial needs (e.g., medical, eviction).', penalty: true },
    { id: 'In-Service', title: 'In-Service Withdrawal', desc: 'Available for participants over age 59½.', penalty: false },
    { id: 'Rollover', title: 'Direct Rollover', desc: 'Transfer funds to an IRA or another qualified plan.', penalty: false },
    { id: 'Termination', title: 'Termination Dist.', desc: 'Full payout after leaving employment.', penalty: true },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Select Withdrawal Type</h2>
        <p className="text-slate-500 text-sm mt-1">Choose the category that best fits your current situation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {types.map((type) => (
          <div 
            key={type.id}
            onClick={() => setData({ ...data, type: type.id })}
            className={`
              p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 relative overflow-hidden group
              ${data.type === type.id 
                ? 'bg-white border-brand-600 shadow-md ring-1 ring-brand-100' 
                : 'bg-white border-slate-200 hover:border-brand-300 hover:shadow-sm'}
            `}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className={`font-semibold ${data.type === type.id ? 'text-brand-700' : 'text-slate-900'}`}>
                {type.title}
              </h3>
              {data.type === type.id && <CheckCircle2 className="w-5 h-5 text-brand-600" />}
            </div>
            <p className="text-sm text-slate-500 mb-4 h-10">{type.desc}</p>
            
            <div className="flex gap-2">
              {type.penalty && <ImpactBadge type="warning" text="Tax Penalty Likely" />}
              <ImpactBadge type="neutral" text="Taxable Income" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- STAGE 2: Amount Selection ---

const StageAmount = ({ data, setData, config, plan }: { data: WithdrawalFormData, setData: any, config: WithdrawalConfig, plan: Plan }) => {
  const maxAmount = plan.vestedBalance;
  
  // Real-time Impact Logic
  const projectedLoss = Math.round(data.amount * Math.pow(1.07, 20)); // Rough 7% growth over 20 years

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Withdrawal Amount</h2>
        <p className="text-slate-500 text-sm mt-1">Specify how much you wish to withdraw from your vested balance.</p>
      </div>

      <Card className="p-8 border-slate-200 shadow-sm">
         <div className="flex justify-between items-end mb-6">
            <div>
              <label className="text-sm font-bold text-slate-700 block mb-1">Gross Withdrawal</label>
              <p className="text-xs text-slate-500">Available: ${maxAmount.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <div className="inline-flex items-baseline bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-300 transition-all">
                  <span className="text-lg text-slate-400 mr-1">$</span>
                  <input 
                    type="number"
                    value={data.amount}
                    onChange={(e) => setData({...data, amount: Number(e.target.value)})}
                    className="w-32 bg-transparent text-3xl font-bold text-slate-900 outline-none text-right p-0 border-none focus:ring-0"
                    min={config.minAmount}
                    max={maxAmount}
                  />
              </div>
            </div>
         </div>

         <div className="relative mb-8">
            <input 
              type="range" 
              min={config.minAmount} 
              max={maxAmount} 
              step={100}
              value={data.amount}
              onChange={(e) => setData({...data, amount: Number(e.target.value)})}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-600 relative z-10 focus:outline-none"
            />
         </div>

         {/* Smart Advisor Insight */}
         <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex gap-4">
            <div className="bg-white p-2 rounded-full h-fit shadow-sm">
               <TrendingUp className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
               <h4 className="text-sm font-bold text-indigo-900">Future Value Impact</h4>
               <p className="text-xs text-indigo-700 mt-1 leading-relaxed">
                 Withdrawing <strong>${data.amount.toLocaleString()}</strong> today could reduce your potential retirement balance by approximately <strong>${projectedLoss.toLocaleString()}</strong> at age 65 (assuming 7% growth).
               </p>
               <div className="mt-3 flex gap-4">
                  <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                     See Recovery Strategy <ArrowRight className="w-3 h-3" />
                  </button>
               </div>
            </div>
         </div>
      </Card>
    </div>
  );
};

// --- STAGE 3: Tax & Distribution ---

const StageTaxDistribution = ({ data, setData, config }: { data: WithdrawalFormData, setData: any, config: WithdrawalConfig }) => {
  const netAmount = data.amount * (1 - (data.federalTaxRate/100) - (data.stateTaxRate/100));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Tax & Distribution</h2>
        <p className="text-slate-500 text-sm mt-1">Configure tax withholding and payment method.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tax Section */}
        <Card className="p-6">
           <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
             <Calculator className="w-4 h-4 text-slate-400" /> Tax Withholding
           </h3>
           
           <div className="space-y-4">
             <div>
               <label className="block text-xs font-semibold text-slate-500 mb-1.5">Federal Tax (%)</label>
               <div className="relative">
                 <input 
                   type="number" 
                   value={data.federalTaxRate}
                   onChange={(e) => setData({...data, federalTaxRate: Number(e.target.value)})}
                   className="w-full p-2.5 pl-3 pr-8 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-brand-500 outline-none"
                 />
                 <span className="absolute right-3 top-2.5 text-slate-400 text-sm">%</span>
               </div>
               <p className="text-[10px] text-slate-400 mt-1">Mandatory minimum: {config.mandatoryFedWithholding * 100}%</p>
             </div>

             <div>
               <label className="block text-xs font-semibold text-slate-500 mb-1.5">State Tax (%)</label>
               <div className="relative">
                 <input 
                   type="number" 
                   value={data.stateTaxRate}
                   onChange={(e) => setData({...data, stateTaxRate: Number(e.target.value)})}
                   className="w-full p-2.5 pl-3 pr-8 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-brand-500 outline-none"
                 />
                 <span className="absolute right-3 top-2.5 text-slate-400 text-sm">%</span>
               </div>
             </div>
           </div>
        </Card>

        {/* Banking Section */}
        <Card className="p-6">
           <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
             <Building2 className="w-4 h-4 text-slate-400" /> Payment Method
           </h3>
           
           <div className="flex gap-3 mb-4">
              {['EFT', 'Check'].map((m) => (
                <button
                  key={m}
                  onClick={() => setData({...data, distributionMethod: m})}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-colors ${data.distributionMethod === m ? 'bg-brand-50 border-brand-500 text-brand-700' : 'bg-white border-slate-200 text-slate-600'}`}
                >
                  {m === 'EFT' ? 'Direct Deposit' : 'Paper Check'}
                </button>
              ))}
           </div>

           {data.distributionMethod === 'EFT' ? (
             <div className="space-y-3">
               <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Routing Number</label>
                  <div className="relative">
                    <input type="text" value={data.routingNumber} onChange={(e) => setData({...data, routingNumber: e.target.value})} className="w-full p-2 border border-slate-200 rounded text-sm font-mono" placeholder="000000000" />
                    <Lock className="w-3 h-3 text-emerald-500 absolute right-3 top-3" />
                  </div>
               </div>
               <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Account Number</label>
                  <div className="relative">
                    <input type="password" value={data.accountNumber} onChange={(e) => setData({...data, accountNumber: e.target.value})} className="w-full p-2 border border-slate-200 rounded text-sm font-mono" placeholder="••••••••" />
                    <Lock className="w-3 h-3 text-emerald-500 absolute right-3 top-3" />
                  </div>
               </div>
             </div>
           ) : (
             <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 text-xs text-amber-800">
               Check will be mailed to the address on file within 7-10 business days.
             </div>
           )}
        </Card>
      </div>
    </div>
  );
};

// --- STAGE 4: Financial Impact & Review ---

const StageReview = ({ data, config, plan }: { data: WithdrawalFormData, config: WithdrawalConfig, plan: Plan }) => {
  const penaltyAmount = data.amount * config.penaltyRate;
  const fedTaxAmount = data.amount * (data.federalTaxRate / 100);
  const stateTaxAmount = data.amount * (data.stateTaxRate / 100);
  const totalDeductions = penaltyAmount + fedTaxAmount + stateTaxAmount + config.processingFee;
  const netAmount = data.amount - totalDeductions;

  // Chart Data
  const chartData = [
    { year: 'Now', current: plan.balance, postWithdrawal: plan.balance - data.amount },
    { year: '+10y', current: plan.balance * 1.8, postWithdrawal: (plan.balance - data.amount) * 1.8 },
    { year: '+20y', current: plan.balance * 2.8, postWithdrawal: (plan.balance - data.amount) * 2.8 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Review & Confirm</h2>
        <p className="text-slate-500 text-sm mt-1">Understand the impact before finalizing your request.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Financial Breakdown */}
        <div className="lg:col-span-1 space-y-4">
           <Card>
             <CardHeader title="Breakdown" className="py-3 bg-slate-50/50" />
             <CardContent className="p-4 space-y-3 text-sm">
                <div className="flex justify-between">
                   <span className="text-slate-500">Requested</span>
                   <span className="font-bold text-slate-900">${data.amount.toLocaleString()}</span>
                </div>
                <div className="h-px bg-slate-100" />
                <div className="flex justify-between text-amber-700">
                   <span>Fed Tax ({data.federalTaxRate}%)</span>
                   <span>-${fedTaxAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between text-amber-700">
                   <span>State Tax ({data.stateTaxRate}%)</span>
                   <span>-${stateTaxAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between text-red-600">
                   <span className="flex items-center gap-1">Early Penalty (10%) <Info className="w-3 h-3" /></span>
                   <span>-${penaltyAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                   <span>Processing Fee</span>
                   <span>-${config.processingFee}</span>
                </div>
                <div className="h-px bg-slate-100" />
                <div className="flex justify-between p-2 bg-emerald-50 rounded-lg -mx-2">
                   <span className="font-bold text-emerald-800">Net Disbursement</span>
                   <span className="font-bold text-emerald-700">${netAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
             </CardContent>
           </Card>
        </div>

        {/* Middle: Impact Chart */}
        <div className="lg:col-span-2">
           <Card className="h-full">
             <CardHeader title="Long-Term Projection" subtitle="Impact at Age 65" className="py-3" />
             <div className="h-64 p-4">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="gradCurrent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="gradPost" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                    <Area type="monotone" dataKey="current" stroke="#94a3b8" fill="url(#gradCurrent)" strokeWidth={2} name="Baseline" />
                    <Area type="monotone" dataKey="postWithdrawal" stroke="#f59e0b" fill="url(#gradPost)" strokeWidth={2} name="After Withdrawal" />
                  </AreaChart>
               </ResponsiveContainer>
             </div>
             <div className="px-6 pb-6">
                <p className="text-xs text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="font-bold text-slate-700">Advisory Note:</span> To recover this balance, consider increasing your contribution rate by <span className="text-emerald-600 font-bold">1%</span> for the next 3 years.
                </p>
             </div>
           </Card>
        </div>
      </div>

      {/* Compliance Checkboxes */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4">
        <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Required Acknowledgments</h4>
        {[
          { text: "I understand that this withdrawal will permanently reduce my retirement savings.", key: "1" },
          { text: "I acknowledge the 10% early withdrawal penalty and tax implications.", key: "2" },
          { text: "I certify that the information provided is accurate.", key: "3" }
        ].map((item) => (
          <label key={item.key} className="flex items-start gap-3 cursor-pointer">
             <input type="checkbox" className="mt-1 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
             <span className="text-sm text-slate-600">{item.text}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

// --- RIGHT SIDEBAR (Context Aware) ---

const WithdrawalSidebar = ({ data, config }: { data: WithdrawalFormData, config: WithdrawalConfig }) => {
  return (
    <div className="sticky top-24 space-y-6 animate-in fade-in slide-in-from-right-4 duration-700">
      <Card className="bg-slate-900 text-white border-slate-800 relative overflow-hidden">
         <div className="absolute top-0 right-0 p-24 bg-brand-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
         <CardContent className="p-6 relative z-10 space-y-4">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Estimated Net Payout</p>
              <CountUp 
                end={data.amount * (1 - (data.federalTaxRate/100) - (data.stateTaxRate/100) - config.penaltyRate) - config.processingFee} 
                prefix="$" 
                className="text-3xl font-bold text-white tracking-tight" 
                decimals={2}
              />
            </div>
            <div className="h-px bg-slate-800" />
            <div className="space-y-2 text-sm">
               <div className="flex justify-between">
                  <span className="text-slate-400">Gross</span>
                  <span className="text-slate-200">${data.amount.toLocaleString()}</span>
               </div>
               <div className="flex justify-between">
                  <span className="text-slate-400">Total Taxes</span>
                  <span className="text-amber-400">{(data.federalTaxRate + data.stateTaxRate)}%</span>
               </div>
               <div className="flex justify-between">
                  <span className="text-slate-400">Penalty</span>
                  <span className="text-red-400">10%</span>
               </div>
            </div>
         </CardContent>
      </Card>

      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
         <div className="flex gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <div>
               <p className="text-xs font-bold text-slate-800">Secure Transaction</p>
               <p className="text-[10px] text-slate-500 mt-1">
                  Your request is encrypted and processed via our secure clearing house.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};

// --- MAIN ORCHESTRATOR ---

export const WithdrawalApplication = ({ plan, onCancel, onComplete }: { plan: Plan, onCancel: () => void, onComplete: () => void }) => {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const steps = ['Eligibility', 'Type', 'Amount', 'Tax', 'Review'];

  const config: WithdrawalConfig = {
    penaltyRate: 0.10,
    minAmount: 500,
    mandatoryFedWithholding: 0.20,
    processingFee: 50
  };

  const [formData, setFormData] = useState<WithdrawalFormData>({
    type: 'Hardship',
    amount: 1000,
    federalTaxRate: 20,
    stateTaxRate: 5,
    distributionMethod: 'EFT',
    routingNumber: '',
    accountNumber: '',
    accountType: 'Checking',
    agreedToTerms: false,
    agreedToPenalty: false,
    agreedToTax: false
  });

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
      case 0: return <StageEligibility plan={plan} />;
      case 1: return <StageTypeSelection data={formData} setData={setFormData} />;
      case 2: return <StageAmount data={formData} setData={setFormData} config={config} plan={plan} />;
      case 3: return <StageTaxDistribution data={formData} setData={setFormData} config={config} />;
      case 4: return <StageReview data={formData} config={config} plan={plan} />;
      default: return null;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[600px] animate-in fade-in duration-500">
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
               <button onClick={() => setStep(step - 1)} className="px-6 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors">
                 Back
               </button>
             ) : (
               <button onClick={onCancel} className="px-6 py-2.5 text-slate-400 font-medium text-sm hover:text-slate-600">
                  Cancel
               </button>
             )}
             
             <button 
               onClick={handleNext}
               disabled={isSubmitting}
               className="px-8 py-3 rounded-lg bg-brand-600 text-white font-semibold text-sm hover:bg-brand-700 shadow-md shadow-brand-200 hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-95"
             >
               {isSubmitting ? 'Processing...' : step === steps.length - 1 ? 'Confirm Withdrawal' : 'Continue'}
               {!isSubmitting && <ArrowRight className="w-4 h-4" />}
             </button>
           </div>
        </div>
      </div>

      <div className="lg:col-span-4 hidden lg:block">
        <WithdrawalSidebar data={formData} config={config} />
      </div>
    </div>
  );
};