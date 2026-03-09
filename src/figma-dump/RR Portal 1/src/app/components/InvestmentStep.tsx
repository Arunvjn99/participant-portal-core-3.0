import { useState, useMemo } from "react";
import { TrendingUp, PieChart, BarChart3, Target, Shield, Zap, AlertCircle, CheckCircle2, Info, Sparkles, Clock, DollarSign, TrendingDown, ArrowUpRight, User, PhoneCall, MessageCircle, Scale, Edit3, X, Plus, ChevronRight, Lock, SlidersHorizontal, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "motion/react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Legend } from "recharts";
import { AskAIButton } from "./AskAIButton";
import { FundModal } from "./FundModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { useBranding } from "../../hooks/useBranding";

// Last updated: 2026-03-06

interface InvestmentStepProps {
  currentContribution: number;
  salary: number;
  selectedPlan: string;
  userAge: number;
}

// Fund type definition
interface Fund {
  id: string;
  name: string;
  ticker: string;
  category: string;
  marketCap: 'Large Cap' | 'Mid Cap' | 'Small Cap' | 'Multi Cap' | 'N/A';
  riskLevel: number;
  allocation: number;
}

// Investment portfolio options
const portfolioOptions = [
  {
    id: "aggressive",
    name: "Aggressive",
    risk: "High",
    riskLevel: 5,
    targetReturn: 9.5,
    description: "Maximum growth potential for long-term investors comfortable with volatility",
    allocation: {
      stocks: 90,
      bonds: 5,
      other: 5,
    },
    ageRange: "20s - 30s",
    yearsToRetirement: "25+ years",
    color: "#dc2626",
    gradient: "from-red-500 to-orange-500",
    bgGradient: "from-red-50 to-orange-50",
    icon: Zap,
  },
  {
    id: "growth",
    name: "Growth",
    risk: "Moderate-High",
    riskLevel: 4,
    targetReturn: 8.5,
    description: "Strong growth focus with moderate diversification for mid-career investors",
    allocation: {
      stocks: 80,
      bonds: 15,
      other: 5,
    },
    ageRange: "30s - 40s",
    yearsToRetirement: "15-25 years",
    color: "#ea580c",
    gradient: "from-orange-500 to-amber-500",
    bgGradient: "from-orange-50 to-amber-50",
    icon: TrendingUp,
  },
  {
    id: "moderate",
    name: "Moderate",
    risk: "Moderate",
    riskLevel: 3,
    targetReturn: 7.5,
    description: "Balanced approach mixing growth and stability for approaching retirement",
    allocation: {
      stocks: 70,
      bonds: 30,
      other: 0,
    },
    ageRange: "40s - 50s",
    yearsToRetirement: "10-15 years",
    color: "#2563eb",
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50",
    icon: Target,
    recommended: true,
  },
  {
    id: "conservative",
    name: "Conservative",
    risk: "Low-Moderate",
    riskLevel: 2,
    targetReturn: 6.0,
    description: "Capital preservation with modest growth for near-retirement investors",
    allocation: {
      stocks: 40,
      bonds: 50,
      other: 10,
    },
    ageRange: "50s - 60s",
    yearsToRetirement: "5-10 years",
    color: "#16a34a",
    gradient: "from-emerald-500 to-teal-500",
    bgGradient: "from-emerald-50 to-teal-50",
    icon: Shield,
  },
  {
    id: "income",
    name: "Income Focus",
    risk: "Low",
    riskLevel: 1,
    targetReturn: 4.5,
    description: "Steady income generation with capital preservation for retirees",
    allocation: {
      stocks: 20,
      bonds: 70,
      other: 10,
    },
    ageRange: "60s+",
    yearsToRetirement: "In retirement",
    color: "#7c3aed",
    gradient: "from-violet-500 to-purple-500",
    bgGradient: "from-violet-50 to-purple-50",
    icon: DollarSign,
  },
];

// Calculate recommended portfolio based on age
function getRecommendedPortfolio(age: number) {
  if (age < 35) return "aggressive";
  if (age < 45) return "growth";
  if (age < 55) return "moderate";
  if (age < 65) return "conservative";
  return "income";
}

// Generate sparkline points based on fund risk level
function getSparklinePoints(riskLevel: number, fundId: string): string {
  // Seed-like variation based on fundId
  const seed = fundId.charCodeAt(0) + (fundId.length > 1 ? fundId.charCodeAt(1) : 0);
  const amplitude = riskLevel * 1.5;
  const points: string[] = [];
  for (let i = 0; i <= 8; i++) {
    const x = (i / 8) * 60;
    const trend = riskLevel > 5 ? -i * 0.8 : -i * 0.4;
    const noise = Math.sin(i * 2.3 + seed) * amplitude;
    const y = 14 + trend + noise;
    points.push(`${x.toFixed(1)},${Math.max(2, Math.min(26, y)).toFixed(1)}`);
  }
  return points.join(' ');
}

// Fund color based on category
function getFundColor(category: string): string {
  switch (category) {
    case 'Fixed Income': return '#3b82f6';
    case 'Target Date': return '#f59e0b';
    default: return '#10b981';
  }
}

// Market cap badge styling
function getMarketCapStyle(marketCap: string): { bg: string; text: string } | null {
  switch (marketCap) {
    case 'Large Cap': return { bg: 'bg-blue-50 border-blue-100', text: 'text-blue-600' };
    case 'Mid Cap': return { bg: 'bg-amber-50 border-amber-100', text: 'text-amber-600' };
    case 'Small Cap': return { bg: 'bg-purple-50 border-purple-100', text: 'text-purple-600' };
    default: return null;
  }
}

// Portfolio Card Component
function PortfolioCard({
  portfolio,
  isSelected,
  isRecommended,
  onSelect,
}: {
  portfolio: typeof portfolioOptions[0];
  isSelected: boolean;
  isRecommended: boolean;
  onSelect: () => void;
}) {
  const Icon = portfolio.icon;

  // Prepare data for mini pie chart
  const pieData = [
    { name: "Stocks", value: portfolio.allocation.stocks, color: "#3b82f6" },
    { name: "Bonds", value: portfolio.allocation.bonds, color: "#10b981" },
    { name: "Other", value: portfolio.allocation.other, color: "#f59e0b" },
  ];

  return (
    <motion.button
      onClick={onSelect}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={`relative w-full text-left rounded-2xl border-2 transition-all duration-300 ${
        isSelected
          ? 'border-indigo-500 bg-indigo-50 shadow-lg'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
      }`}
    >
      
    </motion.button>
  );
}

export function InvestmentStep({ currentContribution, salary, selectedPlan, userAge }: InvestmentStepProps) {
  const branding = useBranding();
  const recommendedId = getRecommendedPortfolio(userAge);
  const [selectedPortfolio, setSelectedPortfolio] = useState(recommendedId);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAllocationDialogOpen, setIsAllocationDialogOpen] = useState(false);
  const [preTaxPercent, setPreTaxPercent] = useState(60);
  const [rothPercent, setRothPercent] = useState(30);
  const [afterTaxPercent, setAfterTaxPercent] = useState(10);
  
  // Account type being edited
  const [editingAccountType, setEditingAccountType] = useState<'preTax' | 'roth' | 'afterTax'>('preTax');
  
  // Funds for each account type
  const [preTaxFunds, setPreTaxFunds] = useState<Fund[]>([
    { id: '1', name: 'Vanguard Total Stock', ticker: 'VTI', category: 'Equity', marketCap: 'Large Cap', riskLevel: 8, allocation: 40 },
    { id: '2', name: 'Vanguard Total Bond', ticker: 'BND', category: 'Fixed Income', marketCap: 'Mid Cap', riskLevel: 3, allocation: 25 },
    { id: '3', name: 'Intl Growth Fund', ticker: 'VXUS', category: 'Equity', marketCap: 'Mid Cap', riskLevel: 9, allocation: 20 },
    { id: '4', name: 'Target Retirement 2060', ticker: 'VTTSX', category: 'Target Date', marketCap: 'Mid Cap', riskLevel: 6, allocation: 15 },
  ]);
  
  const [rothFunds, setRothFunds] = useState<Fund[]>([
    { id: '5', name: 'Vanguard Total Stock', ticker: 'VTI', category: 'Equity', marketCap: 'Large Cap', riskLevel: 8, allocation: 85 },
    { id: '6', name: 'Vanguard Total Bond', ticker: 'BND', category: 'Fixed Income', marketCap: 'Mid Cap', riskLevel: 3, allocation: 15 },
  ]);
  
  const [afterTaxFunds, setAfterTaxFunds] = useState<Fund[]>([
    { id: '7', name: 'Vanguard Total Stock', ticker: 'VTI', category: 'Equity', marketCap: 'Large Cap', riskLevel: 8, allocation: 100 },
  ]);

  // Toggles
  const [useContributionSources, setUseContributionSources] = useState(true);
  const [allowEditAllocation, setAllowEditAllocation] = useState(false);
  
  // Expand/collapse state for each account's fund list
  const [expandedAccounts, setExpandedAccounts] = useState<Record<string, boolean>>({
    roth: false,
    preTax: false,
    afterTax: false,
  });
  
  const toggleAccountExpand = (account: string) => {
    setExpandedAccounts(prev => ({ ...prev, [account]: !prev[account] }));
  };
  
  // Fund detail popup state
  const [fundPopupAccount, setFundPopupAccount] = useState<'roth' | 'preTax' | 'afterTax' | null>(null);

  const getFundPopupData = () => {
    if (fundPopupAccount === 'roth') return { funds: rothFunds, label: 'Roth', subtitle: 'Tax Free', icon: Shield };
    if (fundPopupAccount === 'preTax') return { funds: preTaxFunds, label: 'Pretax', subtitle: 'Tax Deferred', icon: DollarSign };
    if (fundPopupAccount === 'afterTax') return { funds: afterTaxFunds, label: 'After Tax', subtitle: 'Taxable', icon: Scale };
    return null;
  };

  const portfolio = portfolioOptions.find((p) => p.id === selectedPortfolio) || portfolioOptions[2];
  const yearsToRetirement = 65 - userAge;
  
  // Open modal for specific account type
  const openEditModal = (accountType: 'preTax' | 'roth' | 'afterTax' = 'preTax') => {
    setEditingAccountType(accountType);
    setIsEditModalOpen(true);
  };
  
  // Get current funds based on editing account type
  const getCurrentFunds = () => {
    if (editingAccountType === 'preTax') return preTaxFunds;
    if (editingAccountType === 'roth') return rothFunds;
    return afterTaxFunds;
  };
  
  // Set current funds
  const setCurrentFunds = (funds: Fund[]) => {
    if (editingAccountType === 'preTax') setPreTaxFunds(funds);
    else if (editingAccountType === 'roth') setRothFunds(funds);
    else setAfterTaxFunds(funds);
  };
  
  // Update fund allocation
  const updateFundAllocation = (fundId: string, newAllocation: number) => {
    const funds = getCurrentFunds();
    const updatedFunds = funds.map(fund => 
      fund.id === fundId ? { ...fund, allocation: newAllocation } : fund
    );
    setCurrentFunds(updatedFunds);
  };
  
  // Remove fund
  const removeFund = (fundId: string) => {
    const funds = getCurrentFunds();
    setCurrentFunds(funds.filter(fund => fund.id !== fundId));
  };
  
  // Add fund
  const addFund = (fund: { id: string; name: string; ticker: string; category: string; marketCap: 'Large Cap' | 'Mid Cap' | 'Small Cap' | 'Multi Cap' | 'N/A'; riskLevel: number }) => {
    const funds = getCurrentFunds();
    const newFund: Fund = {
      ...fund,
      allocation: 0,
    };
    setCurrentFunds([...funds, newFund]);
  };
  
  // Calculate total allocation
  const getTotalAllocation = () => {
    const funds = getCurrentFunds();
    return funds.reduce((sum, fund) => sum + fund.allocation, 0);
  };
  
  // Get account type label
  const getAccountTypeLabel = () => {
    if (editingAccountType === 'preTax') return 'Pre-tax';
    if (editingAccountType === 'roth') return 'Roth';
    return 'After-tax';
  };
  
  // Save changes from modal
  const saveChanges = () => {
    setIsEditModalOpen(false);
  };
  
  // Cancel changes
  const cancelChanges = () => {
    setIsEditModalOpen(false);
  };

  // Calculate projections
  const annualContribution = (salary * currentContribution) / 100;
  const projectionYears = Math.min(yearsToRetirement, 30);
  
  const projectionData = [];
  let balance = 0;
  
  for (let year = 0; year <= projectionYears; year += 5) {
    if (year === 0) {
      projectionData.push({
        year: "Now",
        balance: 0,
      });
    } else {
      // Simplified projection: annual contribution * years * (1 + avg return)^years
      balance = annualContribution * year * Math.pow(1 + portfolio.targetReturn / 100, year / 2);
      projectionData.push({
        year: `${year}y`,
        balance: Math.round(balance),
      });
    }
  }

  const finalBalance = projectionData[projectionData.length - 1].balance;

  // Pie chart data
  const pieData = [
    { name: "Stocks", value: portfolio.allocation.stocks, color: "#3b82f6" },
    { name: "Bonds", value: portfolio.allocation.bonds, color: "#10b981" },
    { name: "Other", value: portfolio.allocation.other, color: "#f59e0b" },
  ];

// Replace with dynamic allocation summary
  const CATEGORY_COLORS: Record<string, string> = {
    'Equity': '#3b82f6',
    'Fixed Income': '#10b981',
    'Target Date': '#f59e0b',
    'Real Estate': '#8b5cf6',
    'Commodities': '#ef4444',
    'Other': '#6b7280',
  };

  const allocationSummary = useMemo(() => {
    const allFundSets: { funds: Fund[]; weight: number }[] = [
      { funds: rothFunds, weight: rothPercent },
      { funds: preTaxFunds, weight: preTaxPercent },
      { funds: afterTaxFunds, weight: afterTaxPercent },
    ];

    // Aggregate by category, weighted by account contribution %
    const categoryMap: Record<string, number> = {};
    const fundDetailMap: Record<string, { name: string; ticker: string; value: number; color: string }> = {};

    for (const { funds, weight } of allFundSets) {
      const fundTotal = funds.reduce((s, f) => s + f.allocation, 0);
      if (fundTotal === 0) continue;
      for (const fund of funds) {
        // Effective weight: accountWeight% * (fund.allocation / fundTotal)
        const effectivePercent = (weight / 100) * (fund.allocation / fundTotal) * 100;
        const category = fund.category || 'Other';
        categoryMap[category] = (categoryMap[category] || 0) + effectivePercent;

        // Track individual fund detail
        const key = fund.ticker;
        if (!fundDetailMap[key]) {
          fundDetailMap[key] = {
            name: fund.name,
            ticker: fund.ticker,
            value: 0,
            color: CATEGORY_COLORS[category] || CATEGORY_COLORS['Other'],
          };
        }
        fundDetailMap[key].value += effectivePercent;
      }
    }

    // Build category-level pie data
    const categoryPieData = Object.entries(categoryMap)
      .filter(([, value]) => value > 0.5)
      .map(([category, value]) => ({
        name: category === 'Equity' ? 'Stocks' : category === 'Fixed Income' ? 'Bonds' : category,
        value: Math.round(value * 10) / 10,
        color: CATEGORY_COLORS[category] || CATEGORY_COLORS['Other'],
      }))
      .sort((a, b) => b.value - a.value);

    // Build fund-level legend data
    const fundLegendData = Object.values(fundDetailMap)
      .filter(f => f.value > 0.5)
      .map(f => ({ ...f, value: Math.round(f.value * 10) / 10 }))
      .sort((a, b) => b.value - a.value);

    const total = Math.round(categoryPieData.reduce((s, d) => s + d.value, 0));

    return { categoryPieData, fundLegendData, total };
  }, [rothFunds, preTaxFunds, afterTaxFunds, rothPercent, preTaxPercent, afterTaxPercent]);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <div className="relative">
          
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Choose How Your Retirement Savings Are Invested
          </h2>
          <p className="text-gray-600 text-base">
            Pick an investment approach that aligns with your risk level and retirement goals.
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Investment Choices */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="lg:col-span-2 space-y-5"
        >
          {/* Plan Default Tab */}
          

          {/* Contribution Sources Toggle */}
          

          {/* Investment Strategy Card - HERO SECTION (moved to left col top) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="group relative bg-white rounded-2xl border border-gray-200 shadow-sm transition-all duration-300"
          >
            <div className="relative px-5 py-4 overflow-hidden cursor-default">
              {/* Subtle background accent */}
              <div className={`absolute inset-0 bg-gradient-to-r ${portfolio.bgGradient} opacity-40`} />
              <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-white/80 to-transparent" />

              <div className="relative flex items-center justify-between gap-4">
                {/* Left: Icon + Content */}
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <div
                      className={`w-11 h-11 bg-gradient-to-br ${portfolio.gradient} rounded-xl flex items-center justify-center shadow-md ring-2 ring-white`}
                    >
                      {(() => {
                        const Icon = portfolio.icon;
                        return <Icon className="w-5 h-5 text-white" />;
                      })()}
                    </div>
                  </motion.div>

                  <div className="flex-1 min-w-0">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.35 }}
                      className="flex items-center gap-2 mb-0.5"
                    >
                      <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">You Belong To</span>
                      
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="flex items-baseline gap-2"
                    >
                      <span className="text-lg font-bold text-gray-900 leading-tight truncate">
                        {portfolio.name} Investor
                      </span>
                      
                    </motion.div>
                  </div>
                </div>

                {/* Right: Risk Indicator + Edit */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  {/* Risk Level Dots */}
                  

                  <motion.button
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-shrink-0 px-3 py-1.5 rounded-lg text-gray-500 hover:text-gray-700 flex items-center gap-1.5 transition-all duration-200 text-sm font-medium hover:bg-white/80 border border-transparent hover:border-gray-200 cursor-pointer"
                    title="Edit Investment Strategy"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Talk to Advisor – Revenue-Generating Hero Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.22 }}
          >
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${branding.colors.primary}, ${branding.colors.primary}dd)` }}
            >
              {/* Subtle decorative circles */}
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 bg-white -translate-y-10 translate-x-10" />
              <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full opacity-[0.07] bg-white translate-y-8 -translate-x-6" />

              <div className="relative px-5 py-3.5">
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 border border-white/10">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-white mb-0">Need Help Choosing?</h3>
                    <p className="text-sm text-white/75">
                      Get personalized guidance on choosing the right investments.
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-[13px] text-white/70 flex items-center gap-1.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                      </span>
                      Available
                    </span>
                    <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white font-semibold text-sm transition-all duration-200 hover:shadow-lg hover:shadow-black/10 cursor-pointer" style={{ color: branding.colors.primary }}>
                      <PhoneCall className="w-4 h-4" />
                      <span>Schedule a Call</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Your Investment Mix - Fund Breakdowns by Source */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <PieChart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Plan Recommended Portfolio</h3>
                  <p className="text-gray-500 text-[14px]">Your contributions are invested in a recommended mix for long-term retirement growth.</p>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-3">
              {/* Roth Account */}
              {(() => {
                const rothTotal = rothFunds.reduce((s, f) => s + f.allocation, 0);
                const rothComplete = rothTotal === 100;
                return (
                  <div className="rounded-xl border border-gray-200 bg-gray-50/30 overflow-hidden">
                    <button
                      onClick={() => setFundPopupAccount('roth')}
                      className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100/60 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                          <Shield className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="text-left space-y-1">
                          <p className="text-sm font-semibold text-gray-900">Roth · <span className="font-normal text-gray-500">Tax Free</span></p>
                          <p className="text-sm text-gray-500 flex items-center gap-1.5"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">{rothFunds.length} fund{rothFunds.length !== 1 ? 's' : ''}</span> {rothComplete ? '100% allocated' : `${rothTotal}% allocated`}</p>
                        </div>
                      </div>
                      <span className="font-semibold flex-shrink-0 underline text-[14px]" style={{ color: branding.colors.primary }}>View funds</span>
                    </button>
                  </div>
                );
              })()}

              {/* Pretax Account */}
              {(() => {
                const preTaxTotal = preTaxFunds.reduce((s, f) => s + f.allocation, 0);
                const preTaxComplete = preTaxTotal === 100;
                return (
                  <div className="rounded-xl border border-gray-200 bg-gray-50/30 overflow-hidden">
                    <button
                      onClick={() => setFundPopupAccount('preTax')}
                      className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100/60 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                          <DollarSign className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="text-left space-y-1">
                          <p className="text-sm font-semibold text-gray-900">Pretax · <span className="font-normal text-gray-500">Tax Deferred</span></p>
                          <p className="text-sm text-gray-500 flex items-center gap-1.5"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">{preTaxFunds.length} fund{preTaxFunds.length !== 1 ? 's' : ''}</span> {preTaxComplete ? '100% allocated' : `${preTaxTotal}% allocated`}</p>
                        </div>
                      </div>
                      <span className="font-semibold flex-shrink-0 underline text-[14px]" style={{ color: branding.colors.primary }}>View funds</span>
                    </button>
                  </div>
                );
              })()}

              {/* After Tax Account */}
              {(() => {
                const afterTaxTotal = afterTaxFunds.reduce((s, f) => s + f.allocation, 0);
                const afterTaxComplete = afterTaxTotal === 100;
                return (
                  <div className="rounded-xl border border-gray-200 bg-gray-50/30 overflow-hidden">
                    <button
                      onClick={() => setFundPopupAccount('afterTax')}
                      className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100/60 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                          <Scale className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="text-left space-y-1">
                          <p className="text-sm font-semibold text-gray-900">After Tax · <span className="font-normal text-gray-500">Taxable</span></p>
                          <p className="text-sm text-gray-500 flex items-center gap-1.5"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">{afterTaxFunds.length} fund{afterTaxFunds.length !== 1 ? 's' : ''}</span> {afterTaxComplete ? '100% allocated' : `${afterTaxTotal}% allocated`}</p>
                        </div>
                      </div>
                      <span className="font-semibold flex-shrink-0 underline text-[14px]" style={{ color: branding.colors.primary }}>View funds</span>
                    </button>
                  </div>
                );
              })()}
            </div>

            {/* Customize Funds – Integrated Footer Action */}
            <div className="border-t border-gray-200">
              <button
                onClick={() => openEditModal('preTax')}
                className="w-full group flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: branding.colors.primary + '12' }}
                >
                  <SlidersHorizontal className="w-4.5 h-4.5" style={{ color: branding.colors.primary }} />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <h3 className="text-sm font-semibold text-gray-900">Customize Your Investments</h3>
                  <p className="text-[13px] text-gray-500">Select funds and set allocations across your accounts</p>
                </div>
                <div className="flex items-center gap-1.5 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0">
                  <Edit3 className="w-4 h-4" />
                  <span className="text-sm font-medium">Edit</span>
                </div>
              </button>
            </div>
          </div>

          {/* Allow Edit Toggle */}
          

          {/* Choose My Investments CTA - removed, merged into Plan Recommended Portfolio */}

          {/* Plan Default Portfolio Card */}
        </motion.div>

        {/* Right Column - Summary & Projection */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-5"
        >
          {/* Selected Portfolio Summary */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sticky top-6">
            {/* Header */}
            <div className="mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Allocation Summary</h3>
                  <p className="text-gray-500 text-sm">Real-time impact of your elections</p>
                </div>
              </div>
            </div>

            {/* Allocation Donut Chart */}
            <div className="mb-3">
              <div className="flex items-center justify-center mb-3 relative">
                <ResponsiveContainer width="100%" height={140}>
                  <RechartsPieChart>
                    <Pie
                      data={allocationSummary.categoryPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={44}
                      outerRadius={62}
                      paddingAngle={4}
                      dataKey="value"
                      nameKey="name"
                      startAngle={90}
                      endAngle={450}
                      cornerRadius={6}
                      stroke="none"
                    >
                      {allocationSummary.categoryPieData.map((entry, index) => (
                        <Cell key={`cell-investment-${entry.name}-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </RechartsPieChart>
                </ResponsiveContainer>
                {/* Center Text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-900 tracking-tight">100%</div>
                    <div className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest">Allocated</div>
                  </div>
                </div>
              </div>

              {/* Fund Legend */}
              <div className="space-y-0">
                {allocationSummary.fundLegendData.map((fund) => (
                  <div key={fund.ticker} className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: fund.color }} />
                      <span className="text-sm font-medium text-gray-800 truncate">{fund.name}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900 flex-shrink-0">{fund.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Estimated Value */}
            

            {/* Disclaimer */}
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-start gap-2">
                <Info className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Projections are estimates only. Actual returns will vary based on market performance and investment choices.
                </p>
              </div>
            </div>
          </div>

          {/* Advisor Contact - De-emphasized */}
          
        </motion.div>
      </div>

      {/* Bottom Info */}
      

      {/* Edit Allocation Modal */}
      <AnimatePresence>
        <FundModal
          isOpen={isEditModalOpen}
          accountType={editingAccountType}
          funds={getCurrentFunds()}
          onClose={cancelChanges}
          onSave={saveChanges}
          onUpdateAllocation={updateFundAllocation}
          onRemoveFund={removeFund}
          onAddFund={addFund}
          getTotalAllocation={getTotalAllocation}
          getAccountTypeLabel={getAccountTypeLabel}
        />
      </AnimatePresence>

      {/* Allocation by Source Dialog */}
      <Dialog open={isAllocationDialogOpen} onOpenChange={setIsAllocationDialogOpen}>
        
      </Dialog>

      {/* Fund Detail Popup */}
      <AnimatePresence>
        {fundPopupAccount !== null && (() => {
          const data = getFundPopupData();
          if (!data) return null;
          const { funds, label, subtitle, icon: AcctIcon } = data;
          const total = funds.reduce((s, f) => s + f.allocation, 0);
          const isComplete = total === 100;
          return (
            <>
              {/* Backdrop */}
              <motion.div
                key="fund-popup-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setFundPopupAccount(null)}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              />
              
              {/* Modal */}
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                  key="fund-popup-modal"
                  initial={{ opacity: 0, scale: 0.96, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 20 }}
                  transition={{ type: "spring", damping: 30, stiffness: 400 }}
                  className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[85vh] overflow-hidden border border-gray-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="bg-white px-3 py-3 flex items-center justify-between border-b border-gray-100">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">{label}</h2>
                      <p className="text-xs text-gray-500">{subtitle} · {funds.length} fund{funds.length !== 1 ? 's' : ''}</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setFundPopupAccount(null)}
                      className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-600" />
                    </motion.button>
                  </div>

                  {/* Content */}
                  <div className="px-3 py-3 space-y-3 max-h-[calc(85vh-150px)] overflow-y-auto">
                    {/* Fund Items */}
                    {funds.length > 0 && (
                      <div className="space-y-2">
                        {funds.map((fund) => {
                          const color = getFundColor(fund.category);
                          return (
                            <div key={fund.id} className="bg-gray-50/50 rounded-lg border border-gray-200 p-3 hover:border-gray-300 transition-all">
                              {/* Fund Header */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: branding.colors.primary }}>
                                    <TrendingUp className="w-3.5 h-3.5 text-white" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <h3 className="text-sm font-bold text-gray-900 truncate">{fund.name}</h3>
                                      <span className="px-1.5 py-0.5 text-white text-xs font-bold rounded flex-shrink-0" style={{ backgroundColor: branding.colors.primary }}>
                                        {fund.ticker}
                                      </span>
                                      <span className="text-xs text-gray-500">{fund.category}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  {/* Risk bars */}
                                  <div className="flex items-center gap-1.5">
                                    <svg width="16" height="12" viewBox="0 0 16 12" className="flex-shrink-0">
                                      <polyline
                                        points="0,10 4,7 8,4 12,6 16,2"
                                        fill="none"
                                        stroke="#6B7280"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                    <div className="flex gap-0.5">
                                      {[...Array(4)].map((_, i) => (
                                        <div 
                                          key={i} 
                                          className={`w-1 h-3 ${
                                            i < Math.ceil(fund.riskLevel / 2.5) ? '' : 'bg-gray-300'
                                          }`}
                                          style={i < Math.ceil(fund.riskLevel / 2.5) ? { backgroundColor: branding.colors.primary } : undefined}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Allocation Bar (read-only) */}
                              <div className="flex items-center gap-2 mt-2">
                                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full rounded-full transition-all duration-300"
                                    style={{ width: `${fund.allocation}%`, backgroundColor: branding.colors.primary }}
                                  />
                                </div>
                                <div className="flex items-center gap-0.5 min-w-[75px]">
                                  <div className="w-[60px] px-2 py-1.5 text-center text-sm font-bold text-gray-900 bg-gray-50 border border-gray-200 rounded-lg">
                                    {fund.allocation.toFixed(1)}
                                  </div>
                                  <span className="text-gray-900 font-bold text-sm">%</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Total Allocation */}
                    {funds.length > 0 && (
                      <div className={`rounded-lg border p-2 ${
                        isComplete
                          ? 'bg-green-50/50 border-green-200'
                          : total > 100
                            ? 'bg-red-50/50 border-red-200'
                            : 'bg-amber-50/50 border-amber-200'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-gray-700">Total Allocation</p>
                            {!isComplete && (
                              <p className={`text-xs font-medium ${
                                total > 100 ? 'text-red-600' : 'text-amber-600'
                              }`}>
                                {total > 100
                                  ? `Over by ${(total - 100).toFixed(1)}%`
                                  : `${(100 - total).toFixed(1)}% remaining`
                                }
                              </p>
                            )}
                          </div>
                          <div className="flex items-baseline gap-0.5">
                            <span className={`text-lg font-bold ${
                              isComplete
                                ? 'text-green-600'
                                : total > 100
                                  ? 'text-red-600'
                                  : 'text-amber-600'
                            }`}>
                              {total.toFixed(1)}
                            </span>
                            <span className={`text-sm font-bold ${
                              isComplete
                                ? 'text-green-600'
                                : total > 100
                                  ? 'text-red-600'
                                  : 'text-amber-600'
                            }`}>%</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  
                </motion.div>
              </div>
            </>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}