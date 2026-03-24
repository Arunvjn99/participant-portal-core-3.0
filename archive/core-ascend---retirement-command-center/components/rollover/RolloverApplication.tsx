import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, 
  Info, TrendingUp, ShieldCheck, ArrowRight,
  Briefcase, Building2, Wallet, ArrowRightLeft, Upload,
  Calendar, Check, Zap, PieChart, FileText
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { CountUp } from '../ui/CountUp';
import { ProgressBar } from '../ui/ProgressBar';
import { Plan, RolloverFormData, RolloverIntentType, RolloverTaxType, RolloverMethodType, InvestmentMapType } from '../../types';

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

// --- STAGE 0: Intent ---

const StageIntent = ({ data, setData }: { data: RolloverFormData, setData: any }) => {
  const options: { id: RolloverIntentType, title: string, desc: string, icon: React.ReactNode }[] = [
    { 
      id: 'Inbound', 
      title: 'Roll In Funds', 
      desc: 'Move money from a previous employer into this plan.', 
      icon: <ArrowRightLeft className="w-5 h-5 text-emerald-600" />
    },
    { 
      id: 'Consolidate', 
      title: 'Consolidate Accounts', 
      desc: 'Combine multiple past 401(k)s for easier management.', 
      icon: <Briefcase className="w-5 h-5 text-blue-600" />
    },
    { 
      id: 'IRA_Inbound', 
      title: 'Transfer from IRA', 
      desc: 'Move funds from a personal IRA into this plan.', 
      icon: <Wallet className="w-5 h-5 text-indigo-600" />
    },
    { 
      id: 'Outbound', 
      title: 'Roll Out Funds', 
      desc: 'Move funds out to an IRA or new employer plan.', 
      icon: <ArrowRight className="w-5 h-5 text-slate-500" />
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Rollover Intent</h2>
        <p className="text-slate-500 text-sm mt-1">Select the type of transfer you would like to initiate.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((opt) => (
          <div 
            key={opt.id}
            onClick={() => setData({ ...data, intent: opt.id })}
            className={`
              p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 group
              ${data.intent === opt.id 
                ? 'bg-white border-brand-600 shadow-md ring-1 ring-brand-100' 
                : 'bg-white border-slate-200 hover:border-brand-200 hover:shadow-sm'}
            `}
          >
            <div className={`p-2.5 rounded-lg w-fit mb-3 ${data.intent === opt.id ? 'bg-brand-50' : 'bg-slate-50 group-hover:bg-brand-50/50'}`}>
              {opt.icon}
            </div>
            <h3 className={`font-semibold mb-1 ${data.intent === opt.id ? 'text-brand-700' : 'text-slate-900'}`}>
              {opt.title}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {opt.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- STAGE 1: Source ---

const StageSource = ({ data, setData }: { data: RolloverFormData, setData: any }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Source Identification</h2>
        <p className="text-slate-500 text-sm mt-1">Provide details about the external account.</p>
      </div>

      {data.intent === 'Consolidate' && (
          <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 flex gap-4 animate-in fade-in">
             <div className="bg-white p-2 rounded-lg h-fit shadow-sm">
                <Briefcase className="w-5 h-5 text-brand-600" />
             </div>
             <div className="flex-1">
                <h4 className="text-sm font-bold text-brand-900">Prior Plan Found</h4>
                <p className="text-xs text-brand-700 mt-1">
                   We found a record for <span className="font-semibold">Legacy Corp 401(k)</span>. Would you like to autofill?
                </p>
             </div>
             <button 
                onClick={() => setData({...data, providerName: 'Legacy Corp', accountType: '401(k)'})}
                className="text-xs font-bold text-white bg-brand-600 px-3 py-1.5 rounded-lg hover:bg-brand-700 h-fit"
             >
                Autofill
             </button>
          </div>
      )}

      <Card className="p-6 space-y-4">
         <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Financial Institution</label>
            <input 
              type="text" 
              value={data.providerName}
              onChange={(e) => setData({...data, providerName: e.target.value})}
              className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
              placeholder="e.g. Fidelity, Vanguard, Previous Employer"
            />
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Account Type</label>
                <select 
                  value={data.accountType}
                  onChange={(e) => setData({...data, accountType: e.target.value})}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none bg-white"
                >
                   <option value="">Select Type</option>
                   <option value="401(k)">401(k)</option>
                   <option value="403(b)">403(b)</option>
                   <option value="IRA">Traditional IRA</option>
                   <option value="Roth IRA">Roth IRA</option>
                </select>
            </div>
            <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Account Number</label>
                <input 
                  type="text" 
                  value={data.accountNumber}
                  onChange={(e) => setData({...data, accountNumber: e.target.value})}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                  placeholder="••••••••••"
                />
            </div>
         </div>

         <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Estimated Balance</label>
            <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 text-sm">$</span>
                <input 
                type="number" 
                value={data.estimatedBalance || ''}
                onChange={(e) => setData({...data, estimatedBalance: Number(e.target.value)})}
                className="w-full p-2.5 pl-7 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none font-semibold text-slate-900"
                placeholder="0.00"
                />
            </div>
         </div>
      </Card>
    </div>
  );
};

// --- STAGE 2: Tax Treatment ---

const StageTax = ({ data, setData }: { data: RolloverFormData, setData: any }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Tax Treatment</h2>
        <p className="text-slate-500 text-sm mt-1">Select how the funds will be transferred to manage tax implications.</p>
      </div>

      <div className="space-y-4">
         <div 
           onClick={() => setData({...data, taxTreatment: 'Direct'})}
           className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${data.taxTreatment === 'Direct' ? 'bg-emerald-50/50 border-emerald-500 ring-1 ring-emerald-200' : 'bg-white border-slate-200 hover:border-emerald-200'}`}
         >
            <div className="flex justify-between items-start">
               <div className="flex gap-3">
                  <div className={`p-2 rounded-lg ${data.taxTreatment === 'Direct' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                     <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                     <h4 className={`font-bold ${data.taxTreatment === 'Direct' ? 'text-emerald-900' : 'text-slate-900'}`}>Direct Rollover (Recommended)</h4>
                     <p className="text-sm text-slate-500 mt-1">Funds move directly between institutions. No immediate tax impact.</p>
                  </div>
               </div>
               {data.taxTreatment === 'Direct' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
            </div>
         </div>

         <div 
           onClick={() => setData({...data, taxTreatment: 'Indirect'})}
           className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${data.taxTreatment === 'Indirect' ? 'bg-amber-50/50 border-amber-500 ring-1 ring-amber-200' : 'bg-white border-slate-200 hover:border-amber-200'}`}
         >
            <div className="flex justify-between items-start">
               <div className="flex gap-3">
                  <div className={`p-2 rounded-lg ${data.taxTreatment === 'Indirect' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
                     <ArrowRightLeft className="w-5 h-5" />
                  </div>
                  <div>
                     <h4 className={`font-bold ${data.taxTreatment === 'Indirect' ? 'text-amber-900' : 'text-slate-900'}`}>Indirect Rollover (60-Day Rule)</h4>
                     <p className="text-sm text-slate-500 mt-1">Funds are paid to you, and you redeposit them within 60 days.</p>
                  </div>
               </div>
               {data.taxTreatment === 'Indirect' && <CheckCircle2 className="w-5 h-5 text-amber-600" />}
            </div>
            
            {data.taxTreatment === 'Indirect' && (
                <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100 flex gap-3 text-xs text-amber-800">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>
                        <strong>Warning:</strong> The plan may withhold 20% for federal taxes. You must deposit the full amount (including the withheld portion) within 60 days to avoid penalties.
                    </span>
                </div>
            )}
         </div>
      </div>
      
      <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
         <input 
            type="checkbox" 
            checked={data.hasRoth} 
            onChange={(e) => setData({...data, hasRoth: e.target.checked})}
            className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
         />
         <div>
            <span className="text-sm font-semibold text-slate-700">Include Roth Funds?</span>
            <p className="text-xs text-slate-500">Check this if the source account contains after-tax Roth contributions.</p>
         </div>
      </div>
    </div>
  );
};

// --- STAGE 3: Method ---

const StageMethod = ({ data, setData }: { data: RolloverFormData, setData: any }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Transfer Method</h2>
        <p className="text-slate-500 text-sm mt-1">How will the funds be delivered?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
              { id: 'Electronic', title: 'Electronic (Wire)', days: '3-5 Days', icon: <Zap className="w-4 h-4" /> },
              { id: 'Check_Plan', title: 'Check to Plan', days: '7-10 Days', icon: <Building2 className="w-4 h-4" /> },
              { id: 'Check_Participant', title: 'Check to You', days: '7-14 Days', icon: <Briefcase className="w-4 h-4" /> },
          ].map((m: any) => (
              <div 
                key={m.id}
                onClick={() => setData({...data, method: m.id})}
                className={`
                   p-4 rounded-xl border-2 cursor-pointer text-center hover:border-brand-300 transition-all
                   ${data.method === m.id ? 'bg-brand-50 border-brand-500 text-brand-800' : 'bg-white border-slate-200 text-slate-600'}
                `}
              >
                 <div className="flex justify-center mb-2">{m.icon}</div>
                 <div className="font-bold text-sm">{m.title}</div>
                 <div className="text-xs opacity-70">{m.days}</div>
              </div>
          ))}
      </div>

      {data.method.includes('Check') && (
          <Card className="bg-slate-50 border-slate-200">
             <CardHeader title="Mailing Instructions" className="py-3" />
             <CardContent className="p-4 text-sm space-y-2 text-slate-600">
                <p><span className="font-bold">Payable To:</span> Core Ascend Trust Company</p>
                <p><span className="font-bold">FBO:</span> Your Name / Plan #12345</p>
                <p><span className="font-bold">Address:</span> P.O. Box 9999, Boston, MA 02110</p>
             </CardContent>
          </Card>
      )}

      <Card>
         <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
             <h4 className="font-semibold text-sm text-slate-700">Required Documents</h4>
             <span className="text-xs text-slate-400">0 of 2 Uploaded</span>
         </div>
         <div className="p-4 space-y-3">
             <div className="flex items-center justify-between p-3 border border-slate-200 border-dashed rounded-lg hover:bg-slate-50 cursor-pointer">
                 <div className="flex items-center gap-3">
                     <FileText className="w-5 h-5 text-slate-400" />
                     <div className="text-sm text-slate-600">Distribution Statement</div>
                 </div>
                 <Upload className="w-4 h-4 text-brand-600" />
             </div>
             <div className="flex items-center justify-between p-3 border border-slate-200 border-dashed rounded-lg hover:bg-slate-50 cursor-pointer">
                 <div className="flex items-center gap-3">
                     <FileText className="w-5 h-5 text-slate-400" />
                     <div className="text-sm text-slate-600">Rollover Request Form</div>
                 </div>
                 <Upload className="w-4 h-4 text-brand-600" />
             </div>
         </div>
      </Card>
    </div>
  );
};

// --- STAGE 4: Mapping ---

const StageMapping = ({ data, setData }: { data: RolloverFormData, setData: any }) => {
    
  // Mock Data for Chart
  const chartData = [
      { name: 'Equities', current: 60, recommended: 75 },
      { name: 'Bonds', current: 30, recommended: 20 },
      { name: 'Cash', current: 10, recommended: 5 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Investment Mapping</h2>
        <p className="text-slate-500 text-sm mt-1">How should we invest these funds once they arrive?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
              { id: 'Current', title: 'Match Current', desc: 'Use my existing plan allocation.' },
              { id: 'TargetDate', title: 'Target Date 2050', desc: 'Age-appropriate diversified fund.' },
              { id: 'AI_Recommended', title: 'AI Smart Mix', desc: 'Optimized for your goal profile.' },
          ].map((m: any) => (
              <div 
                key={m.id}
                onClick={() => setData({...data, investmentStrategy: m.id})}
                className={`
                   p-4 rounded-xl border-2 cursor-pointer transition-all
                   ${data.investmentStrategy === m.id ? 'bg-brand-50 border-brand-500 text-brand-800' : 'bg-white border-slate-200 text-slate-600'}
                `}
              >
                 <div className="font-bold text-sm mb-1">{m.title}</div>
                 <div className="text-xs opacity-70 leading-relaxed">{m.desc}</div>
              </div>
          ))}
      </div>

      {data.investmentStrategy === 'AI_Recommended' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-4 bg-indigo-50 border-indigo-100">
                 <div className="flex gap-3 mb-2">
                     <Zap className="w-5 h-5 text-indigo-600" />
                     <h4 className="font-bold text-indigo-900 text-sm">AI Insight</h4>
                 </div>
                 <p className="text-xs text-indigo-800 leading-relaxed">
                     This strategy improves your diversification by <span className="font-bold">12%</span> and reduces weighted expense ratio to <span className="font-bold">0.05%</span>.
                 </p>
              </Card>
              <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20 }}>
                          <XAxis type="number" hide />
                          <YAxis dataKey="name" type="category" width={60} tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                          <Tooltip cursor={{fill: 'transparent'}} />
                          <Bar dataKey="current" fill="#cbd5e1" barSize={8} radius={[0, 4, 4, 0]} name="Current" />
                          <Bar dataKey="recommended" fill="#4f46e5" barSize={8} radius={[0, 4, 4, 0]} name="AI Mix" />
                      </BarChart>
                  </ResponsiveContainer>
              </div>
          </div>
      )}
    </div>
  );
};

// --- STAGE 5: Review ---

const StageReview = ({ data }: { data: RolloverFormData }) => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
             <div>
                <h2 className="text-2xl font-bold text-slate-900">Review & Submit</h2>
                <p className="text-slate-500 text-sm mt-1">Please verify all details before submitting.</p>
            </div>

            <Card>
                <CardHeader title="Rollover Summary" className="py-4 bg-slate-50/50" />
                <div className="p-6 space-y-4 text-sm">
                    <div className="flex justify-between">
                        <span className="text-slate-500">Source</span>
                        <span className="font-semibold text-slate-900">{data.providerName} ({data.accountType})</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">Estimated Amount</span>
                        <span className="font-semibold text-slate-900">${data.estimatedBalance?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">Tax Treatment</span>
                        <span className="font-semibold text-slate-900">{data.taxTreatment} {data.hasRoth ? '(Includes Roth)' : ''}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">Transfer Method</span>
                        <span className="font-semibold text-slate-900">{data.method.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">Investment Strategy</span>
                        <span className="font-semibold text-brand-600">{data.investmentStrategy.replace('_', ' ')}</span>
                    </div>
                </div>
            </Card>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
                    <span className="text-sm text-slate-600">I confirm that the information provided is accurate to the best of my knowledge.</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
                    <span className="text-sm text-slate-600">I understand the tax implications of this rollover transaction.</span>
                </label>
            </div>
        </div>
    );
};

// --- RIGHT SIDEBAR ---

const RolloverSidebar = ({ step }: { step: number }) => {
    return (
        <div className="sticky top-24 space-y-6 animate-in fade-in slide-in-from-right-4 duration-700">
            {step === 0 && (
                <Card className="bg-slate-50 border-slate-200">
                    <CardHeader title="Why Roll Over?" className="py-3" />
                    <CardContent className="p-4 text-sm text-slate-600 space-y-3">
                        <p>Consolidating your retirement accounts can make it easier to manage your asset allocation and track your progress.</p>
                        <ul className="list-disc pl-4 space-y-1">
                            <li>Simplified view</li>
                            <li>Potentially lower fees</li>
                            <li>Easier RMD management</li>
                        </ul>
                    </CardContent>
                </Card>
            )}

            {step === 2 && (
                <Card className="bg-slate-900 text-white border-slate-800">
                    <CardHeader title="Tax Impact Estimate" className="py-3 border-slate-800" />
                    <CardContent className="p-4">
                        <div className="flex justify-between mb-2">
                            <span className="text-slate-400 text-sm">Est. Withholding</span>
                            <span className="text-amber-400 font-bold">$0.00</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                            Direct rollovers typically avoid mandatory 20% federal withholding.
                        </p>
                    </CardContent>
                </Card>
            )}

            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                <div className="flex gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    <div>
                        <p className="text-xs font-bold text-slate-800">Fiduciary Standard</p>
                        <p className="text-[10px] text-slate-500 mt-1">
                            We act in your best interest when facilitating transfers.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- MAIN ORCHESTRATOR ---

export const RolloverApplication = ({ plan, onCancel, onComplete }: { plan: Plan, onCancel: () => void, onComplete: () => void }) => {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const steps = ['Intent', 'Source', 'Tax', 'Method', 'Map', 'Review'];

  const [formData, setFormData] = useState<RolloverFormData>({
    intent: 'Inbound',
    providerName: '',
    accountType: '',
    accountNumber: '',
    estimatedBalance: 0,
    taxTreatment: 'Direct',
    hasRoth: false,
    method: 'Electronic',
    investmentStrategy: 'Current',
    agreedToTerms: false,
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
      case 0: return <StageIntent data={formData} setData={setFormData} />;
      case 1: return <StageSource data={formData} setData={setFormData} />;
      case 2: return <StageTax data={formData} setData={setFormData} />;
      case 3: return <StageMethod data={formData} setData={setFormData} />;
      case 4: return <StageMapping data={formData} setData={setFormData} />;
      case 5: return <StageReview data={formData} />;
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
               {isSubmitting ? 'Processing...' : step === steps.length - 1 ? 'Submit Rollover Request' : 'Continue'}
               {!isSubmitting && <ArrowRight className="w-4 h-4" />}
             </button>
           </div>
        </div>
      </div>

      <div className="lg:col-span-4 hidden lg:block">
        <RolloverSidebar step={step} />
      </div>
    </div>
  );
};