import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, 
  Info, TrendingUp, PieChart, ShieldCheck, ArrowRight,
  BarChart2, RefreshCw, Zap, Sliders, Layers, Target, Check
} from 'lucide-react';
import { 
  PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip,
  AreaChart, Area, XAxis, CartesianGrid, Legend
} from 'recharts';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { CountUp } from '../ui/CountUp';
import { ProgressBar } from '../ui/ProgressBar';
import { Plan, Fund, TransferFormData, TransferIntentType } from '../../types';
import { AVAILABLE_FUNDS } from '../../services/mockData';

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

const RiskMeter = ({ score }: { score: number }) => {
  // Score 1-10
  const getColor = (s: number) => {
    if (s <= 3) return 'bg-emerald-500';
    if (s <= 7) return 'bg-amber-500';
    return 'bg-red-500';
  };
  
  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i} 
            className={`w-1.5 h-2 rounded-sm ${i < score / 2 ? getColor(score) : 'bg-slate-200'}`} 
          />
        ))}
      </div>
      <span className="text-[10px] font-bold text-slate-500 ml-1">Risk: {score}/10</span>
    </div>
  );
};

// --- STAGE 0: Intent ---

const StageIntent = ({ data, setData }: { data: TransferFormData, setData: any }) => {
  const intents: { id: TransferIntentType, title: string, desc: string, icon: React.ReactNode }[] = [
    { 
      id: 'Rebalance', 
      title: 'Rebalance Portfolio', 
      desc: 'Reset your portfolio to your original target allocation.', 
      icon: <RefreshCw className="w-5 h-5 text-blue-600" />
    },
    { 
      id: 'ReduceRisk', 
      title: 'Reduce Risk', 
      desc: 'Shift towards bonds and stable value funds.', 
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />
    },
    { 
      id: 'Growth', 
      title: 'Increase Growth', 
      desc: 'Maximize exposure to equities for higher potential return.', 
      icon: <TrendingUp className="w-5 h-5 text-indigo-600" />
    },
    { 
      id: 'AI_Recommended', 
      title: 'AI Smart Mix', 
      desc: 'Apply a diversified mix tailored to your age and goals.', 
      icon: <Zap className="w-5 h-5 text-amber-500" />
    },
    { 
      id: 'Manual', 
      title: 'Manual Selection', 
      desc: 'Build your own custom allocation from scratch.', 
      icon: <Sliders className="w-5 h-5 text-slate-600" />
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Transfer Intent</h2>
        <p className="text-slate-500 text-sm mt-1">Why are you looking to reallocate your portfolio today?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {intents.map((item) => (
          <div 
            key={item.id}
            onClick={() => setData({ ...data, intent: item.id })}
            className={`
              p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 group
              ${data.intent === item.id 
                ? 'bg-white border-brand-600 shadow-md ring-1 ring-brand-100' 
                : 'bg-white border-slate-200 hover:border-brand-200 hover:shadow-sm'}
            `}
          >
            <div className={`p-2.5 rounded-lg w-fit mb-3 ${data.intent === item.id ? 'bg-brand-50' : 'bg-slate-50 group-hover:bg-brand-50/50'}`}>
              {item.icon}
            </div>
            <h3 className={`font-semibold mb-1 ${data.intent === item.id ? 'text-brand-700' : 'text-slate-900'}`}>
              {item.title}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- STAGE 1: Source Selection ---

const StageSource = ({ data, setData, plan }: { data: TransferFormData, setData: any, plan: Plan }) => {
  const sources = [
    { id: 'all', name: 'Total Portfolio', balance: plan.balance, type: 'All Sources', risk: 7 },
    { id: 'pretax', name: 'Pre-Tax Deferral', balance: plan.balance * 0.7, type: 'Source', risk: 7 },
    { id: 'roth', name: 'Roth Contribution', balance: plan.balance * 0.3, type: 'Source', risk: 8 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Select Source</h2>
        <p className="text-slate-500 text-sm mt-1">Which portion of your portfolio would you like to reallocate?</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {sources.map((source) => (
          <div 
            key={source.id}
            onClick={() => setData({ ...data, sourceId: source.id })}
            className={`
              flex items-center justify-between p-5 rounded-xl border transition-all cursor-pointer
              ${data.sourceId === source.id 
                ? 'bg-brand-50/30 border-brand-500 shadow-sm' 
                : 'bg-white border-slate-200 hover:border-slate-300'}
            `}
          >
            <div className="flex items-center gap-4">
               <div className={`p-3 rounded-full ${data.sourceId === source.id ? 'bg-brand-100 text-brand-600' : 'bg-slate-100 text-slate-400'}`}>
                 <Layers className="w-5 h-5" />
               </div>
               <div>
                 <h3 className={`font-semibold ${data.sourceId === source.id ? 'text-brand-900' : 'text-slate-900'}`}>
                   {source.name}
                 </h3>
                 <p className="text-xs text-slate-500">{source.type}</p>
               </div>
            </div>

            <div className="flex items-center gap-8">
               <div className="text-right">
                  <p className="text-xs font-semibold text-slate-400 uppercase">Balance</p>
                  <p className="font-bold text-slate-900">${source.balance.toLocaleString()}</p>
               </div>
               <div className="hidden md:block">
                  <RiskMeter score={source.risk} />
               </div>
               <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${data.sourceId === source.id ? 'bg-brand-600 border-brand-600 text-white' : 'border-slate-300'}`}>
                  {data.sourceId === source.id && <Check className="w-4 h-4" />}
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- STAGE 2: Allocation Builder (The WOW Step) ---

const StageBuilder = ({ data, setData }: { data: TransferFormData, setData: any }) => {
  const funds = AVAILABLE_FUNDS;
  
  const totalAllocation = Object.values(data.allocations).reduce((a, b) => a + b, 0);
  const isValid = totalAllocation === 100;
  
  const handleSliderChange = (fundId: string, val: number) => {
    setData({
      ...data,
      allocations: { ...data.allocations, [fundId]: val }
    });
  };

  const applyRecommendation = () => {
    // Mock Logic for "Smart Mix"
    const newAlloc = {
      'f1': 0, 'f2': 40, 'f3': 20, 'f4': 30, 'f5': 10, 'f6': 0
    };
    setData({ ...data, allocations: newAlloc });
  };

  // Mock chart data for live impact
  const dataBefore = funds.map(f => ({ name: f.ticker, value: f.currentAllocation }));
  const dataAfter = funds.map(f => ({ name: f.ticker, value: data.allocations[f.id] || 0 }));
  
  const COLORS = ['#0ea5e9', '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#10b981'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      {/* Left Column: Builder */}
      <div className="lg:col-span-8 space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Allocation Builder</h2>
            <p className="text-slate-500 text-sm mt-1">Adjust sliders to set your new portfolio mix.</p>
          </div>
          {data.intent === 'AI_Recommended' && (
            <button 
              onClick={applyRecommendation}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors"
            >
              <Zap className="w-3.5 h-3.5" /> Apply AI Smart Mix
            </button>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
           <div className="grid grid-cols-12 gap-4 p-4 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <div className="col-span-5">Fund Name</div>
              <div className="col-span-2 text-center">Risk / Exp</div>
              <div className="col-span-5">Allocation %</div>
           </div>
           
           <div className="divide-y divide-slate-100">
             {funds.map((fund) => {
               const alloc = data.allocations[fund.id] || 0;
               return (
                 <div key={fund.id} className={`grid grid-cols-12 gap-4 p-4 items-center transition-colors ${alloc > 0 ? 'bg-slate-50/30' : ''}`}>
                    <div className="col-span-5">
                       <div className="flex items-center gap-3">
                          <div className={`w-1 h-8 rounded-full ${alloc > 0 ? 'bg-brand-500' : 'bg-slate-200'}`} />
                          <div>
                            <p className="font-semibold text-slate-900 text-sm truncate">{fund.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{fund.ticker}</span>
                              <span className="text-[10px] text-slate-400">{fund.category}</span>
                            </div>
                          </div>
                       </div>
                    </div>
                    
                    <div className="col-span-2 text-center">
                       <div className="flex flex-col items-center gap-1">
                          <RiskMeter score={fund.riskScore} />
                          <span className="text-[10px] text-slate-400">{fund.expenseRatio}% Exp</span>
                       </div>
                    </div>

                    <div className="col-span-5">
                       <div className="flex items-center gap-4">
                          <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            step="1"
                            value={alloc}
                            onChange={(e) => handleSliderChange(fund.id, Number(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                          />
                          <div className={`
                            w-16 py-1.5 rounded-md border text-center text-sm font-bold
                            ${alloc > 0 ? 'border-brand-200 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-400'}
                          `}>
                            {alloc}%
                          </div>
                       </div>
                    </div>
                 </div>
               );
             })}
           </div>

           {/* Footer Total */}
           <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
              <span className="text-sm font-medium text-slate-600">Total Allocation</span>
              <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border ${isValid ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
                 <span className="font-bold">{totalAllocation}%</span>
                 {isValid ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              </div>
           </div>
        </div>
      </div>

      {/* Right Column: Live Impact */}
      <div className="lg:col-span-4 space-y-6">
        <Card className="sticky top-24">
          <CardHeader title="Live Impact Analysis" className="py-4 border-slate-100" />
          <CardContent className="space-y-6">
             
             {/* Charts */}
             <div className="h-48 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={dataAfter.filter(d => d.value > 0)}
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {dataAfter.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ReTooltip />
                  </RePieChart>
                </ResponsiveContainer>
                {/* Center Text */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                   <div className="text-center">
                      <span className="text-xs text-slate-400 block">New Mix</span>
                   </div>
                </div>
             </div>

             {/* Metrics Comparison */}
             <div className="space-y-3">
                <div className="flex justify-between text-sm">
                   <span className="text-slate-500">Exp. Return (5Y)</span>
                   <div className="flex items-center gap-2">
                      <span className="text-slate-400 line-through">7.2%</span>
                      <ArrowRight className="w-3 h-3 text-slate-300" />
                      <span className="font-bold text-emerald-600">8.4%</span>
                   </div>
                </div>
                <div className="flex justify-between text-sm">
                   <span className="text-slate-500">Risk Score</span>
                   <div className="flex items-center gap-2">
                      <span className="text-slate-400 line-through">6.5</span>
                      <ArrowRight className="w-3 h-3 text-slate-300" />
                      <span className="font-bold text-amber-600">7.1</span>
                   </div>
                </div>
                <div className="flex justify-between text-sm">
                   <span className="text-slate-500">Expense Ratio</span>
                   <div className="flex items-center gap-2">
                      <span className="text-slate-400 line-through">0.08%</span>
                      <ArrowRight className="w-3 h-3 text-slate-300" />
                      <span className="font-bold text-slate-900">0.06%</span>
                   </div>
                </div>
             </div>
             
             {/* AI Insight */}
             <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-100 flex gap-3">
                <div className="mt-0.5"><Zap className="w-4 h-4 text-indigo-600" /></div>
                <p className="text-xs text-indigo-800 leading-relaxed">
                   This new allocation improves your diversification score by <strong>12%</strong> and aligns better with your retirement horizon.
                </p>
             </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// --- STAGE 3: Review ---

const StageReview = ({ data, plan }: { data: TransferFormData, plan: Plan }) => {
  // Mock Projection Data
  const chartData = [
    { year: '2025', current: 142000, projected: 142000 },
    { year: '2030', current: 210000, projected: 225000 },
    { year: '2035', current: 320000, projected: 355000 },
    { year: '2040', current: 480000, projected: 540000 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
       <div className="lg:col-span-8 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Review & Confirm</h2>
            <p className="text-slate-500 text-sm mt-1">Verify your allocation changes and potential impact.</p>
          </div>

          <Card>
             <CardHeader title="Transfer Summary" className="py-4 bg-slate-50/50" />
             <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <p className="text-xs font-bold text-slate-500 uppercase mb-1">Source</p>
                   <p className="font-medium text-slate-900">Total Portfolio (All Sources)</p>
                   <p className="text-sm text-slate-500 mt-1">${plan.balance.toLocaleString()}</p>
                </div>
                <div>
                   <p className="text-xs font-bold text-slate-500 uppercase mb-1">Target Allocation</p>
                   <div className="space-y-1">
                      {Object.entries(data.allocations).filter(([_, v]) => v > 0).map(([k, v]) => {
                         const fund = AVAILABLE_FUNDS.find(f => f.id === k);
                         return (
                            <div key={k} className="flex justify-between text-sm">
                               <span className="text-slate-600">{fund?.ticker}</span>
                               <span className="font-medium text-slate-900">{v}%</span>
                            </div>
                         );
                      })}
                   </div>
                </div>
             </div>
             <div className="px-6 pb-6 pt-0">
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-100 flex gap-3">
                   <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                   <div>
                      <p className="text-sm font-bold text-amber-800">Frequent Trading Policy</p>
                      <p className="text-xs text-amber-700 mt-1">
                         Funds moved out of International Index cannot be moved back in for 30 days. This transfer will execute at the next market close (4:00 PM ET).
                      </p>
                   </div>
                </div>
             </div>
          </Card>
          
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
              <span className="text-sm text-slate-600">I understand that past performance does not guarantee future results and that investment involves risk, including possible loss of principal.</span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
              <span className="text-sm text-slate-600">I confirm that this reallocation aligns with my long-term financial goals and risk tolerance.</span>
            </label>
          </div>
       </div>

       <div className="lg:col-span-4">
          <Card className="h-full">
             <CardHeader title="Projected Outcome" subtitle="Age 65 Forecast" className="py-4" />
             <div className="h-64 w-full p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="gradProj" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                    <ReTooltip />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Area type="monotone" dataKey="current" stroke="#94a3b8" fill="transparent" strokeWidth={2} name="Current Path" strokeDasharray="4 4" />
                    <Area type="monotone" dataKey="projected" stroke="#10b981" fill="url(#gradProj)" strokeWidth={2} name="New Allocation" />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
             <div className="px-6 pb-6 text-center">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Projected Difference</p>
                <p className="text-2xl font-bold text-emerald-600">+$60,000</p>
             </div>
          </Card>
       </div>
    </div>
  );
};

// --- MAIN ORCHESTRATOR ---

export const TransferApplication = ({ plan, onCancel, onComplete }: { plan: Plan, onCancel: () => void, onComplete: () => void }) => {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const steps = ['Intent', 'Source', 'Allocation', 'Review'];

  const [formData, setFormData] = useState<TransferFormData>({
    intent: 'Rebalance',
    sourceId: 'all',
    allocations: AVAILABLE_FUNDS.reduce((acc, fund) => ({ ...acc, [fund.id]: fund.currentAllocation }), {}),
    agreedToRisk: false,
    agreedToGoals: false
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
      case 0: return <StageIntent data={formData} setData={setFormData} />;
      case 1: return <StageSource data={formData} setData={setFormData} plan={plan} />;
      case 2: return <StageBuilder data={formData} setData={setFormData} />;
      case 3: return <StageReview data={formData} plan={plan} />;
      default: return null;
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 min-h-[600px] animate-in fade-in duration-500 max-w-6xl mx-auto">
      <div>
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
               {isSubmitting ? 'Processing...' : step === steps.length - 1 ? 'Submit Transfer' : 'Continue'}
               {!isSubmitting && <ArrowRight className="w-4 h-4" />}
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};