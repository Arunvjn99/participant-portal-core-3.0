import React, { useState } from 'react';
import { Bell, Search, User, Menu, Mic, CheckCircle2 } from 'lucide-react';
import { PlanSwitcher } from './components/transactions/PlanSwitcher';
import { ActivityHero } from './components/transactions/ActivityHero';
import { SmartInsights } from './components/transactions/SmartInsights';
import { ActionHub } from './components/transactions/ActionHub';
import { ActivityRiskOverview } from './components/transactions/ActivityRiskOverview';
import { ActivityTimeline } from './components/transactions/ActivityTimeline';
import { LoanApplication } from './components/loan/LoanApplication';
import { WithdrawalApplication } from './components/withdrawal/WithdrawalApplication';
import { TransferApplication } from './components/transfer/TransferApplication';
import { RolloverApplication } from './components/rollover/RolloverApplication';
import { PLANS, INSIGHTS, CHART_DATA, RECENT_TRANSACTIONS } from './services/mockData';

const Navbar = () => (
  <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-900 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-brand-900/20">C</div>
            <span className="font-bold text-xl tracking-tight text-slate-900">CORE <span className="font-normal text-brand-600">Ascend</span></span>
          </div>
          <div className="hidden md:flex space-x-8">
            {['Dashboard', 'Enrollment', 'Profile', 'Transactions', 'Statements'].map((item) => (
              <a 
                key={item} 
                href="#" 
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors ${item === 'Transactions' ? 'border-brand-500 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-400 hover:text-slate-500 transition-colors">
             <Search className="w-5 h-5" />
          </button>
          <button className="p-2 text-slate-400 hover:text-brand-600 transition-colors">
             <Mic className="w-5 h-5" />
          </button>
          <button className="p-2 text-slate-400 hover:text-slate-500 transition-colors relative">
             <Bell className="w-5 h-5" />
             <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          <button className="p-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
             <User className="w-5 h-5" />
          </button>
          <div className="md:hidden">
             <Menu className="w-6 h-6 text-slate-600" />
          </div>
        </div>
      </div>
    </div>
  </nav>
);

const SuccessScreen = ({ type, amount, onReturn }: { type: 'Loan' | 'Withdrawal' | 'Transfer' | 'Rollover', amount?: number, onReturn: () => void }) => (
    <div className="max-w-lg mx-auto text-center py-20 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">{type} Request Submitted</h2>
        <p className="text-slate-500 mb-8">
            Your request {amount && <span>for <span className="font-semibold text-slate-900">${amount.toLocaleString()}</span></span>} has been securely received. 
            {type === 'Transfer' ? ' Your portfolio will be rebalanced at the next market close (4:00 PM ET).' : 
             type === 'Rollover' ? ' We are awaiting funds from your external provider.' : ' Funds typically arrive in 2-3 business days.'}
        </p>
        <button 
            onClick={onReturn}
            className="px-8 py-3 rounded-lg bg-brand-600 text-white font-semibold hover:bg-brand-700 transition-colors"
        >
            Return to Dashboard
        </button>
    </div>
);

const App: React.FC = () => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>(PLANS[0].id);
  const [view, setView] = useState<'dashboard' | 'loan' | 'loan-success' | 'withdrawal' | 'withdrawal-success' | 'transfer' | 'transfer-success' | 'rollover' | 'rollover-success'>('dashboard');
  
  const currentPlan = PLANS.find(p => p.id === selectedPlanId) || PLANS[0];
  // Mock vested balance logic for loan eligibility
  currentPlan.vestedBalance = currentPlan.balance * 0.8; 

  const filteredTransactions = RECENT_TRANSACTIONS.filter(t => t.planId === selectedPlanId || selectedPlanId === 'all');

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900 selection:bg-brand-100 selection:text-brand-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {view === 'dashboard' && (
          <>
            <PlanSwitcher 
              plans={PLANS} 
              selectedPlanId={selectedPlanId} 
              onSelectPlan={setSelectedPlanId} 
            />
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <ActivityHero plan={currentPlan} data={CHART_DATA} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                <ActionHub onNavigate={(page) => setView(page as any)} />
                <SmartInsights insights={INSIGHTS} />
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">Detailed Activity</h3>
                  <ActivityTimeline transactions={filteredTransactions} />
                </div>
              </div>
              <div className="lg:col-span-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                <ActivityRiskOverview />
              </div>
            </div>
          </>
        )}

        {view === 'loan' && (
            <LoanApplication 
                plan={currentPlan} 
                onCancel={() => setView('dashboard')}
                onComplete={() => setView('loan-success')}
            />
        )}

        {view === 'loan-success' && (
            <SuccessScreen type="Loan" amount={5000} onReturn={() => setView('dashboard')} />
        )}

        {view === 'withdrawal' && (
          <WithdrawalApplication 
            plan={currentPlan}
            onCancel={() => setView('dashboard')}
            onComplete={() => setView('withdrawal-success')}
          />
        )}

        {view === 'withdrawal-success' && (
          <SuccessScreen type="Withdrawal" amount={1000} onReturn={() => setView('dashboard')} />
        )}
        
        {view === 'transfer' && (
          <TransferApplication 
            plan={currentPlan}
            onCancel={() => setView('dashboard')}
            onComplete={() => setView('transfer-success')}
          />
        )}

        {view === 'transfer-success' && (
          <SuccessScreen type="Transfer" onReturn={() => setView('dashboard')} />
        )}

        {view === 'rollover' && (
          <RolloverApplication 
            plan={currentPlan}
            onCancel={() => setView('dashboard')}
            onComplete={() => setView('rollover-success')}
          />
        )}

        {view === 'rollover-success' && (
          <SuccessScreen type="Rollover" onReturn={() => setView('dashboard')} />
        )}

      </main>
    </div>
  );
};

export default App;