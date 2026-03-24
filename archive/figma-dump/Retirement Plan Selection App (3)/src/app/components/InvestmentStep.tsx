import { useState } from "react";
import { TrendingUp, PieChart, BarChart3, Target, Shield, Zap, AlertCircle, CheckCircle2, Info, Sparkles, Clock, DollarSign, TrendingDown, ArrowUpRight, User, PhoneCall, MessageCircle, Scale, Edit3, Plus, Minus } from "lucide-react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "motion/react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Legend } from "recharts";
import { AskAIButton } from "./AskAIButton";

// Last updated: 2026-03-03

interface InvestmentStepProps {
  currentContribution: number;
  salary: number;
  selectedPlan: string;
  userAge: number;
}

// Investment portfolio options
const portfolioOptions = [
  {
    id: "aggressive",
    name: "Aggressive Growth",
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
      stocks: 60,
      bonds: 30,
      other: 10,
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
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.99 }}
      onClick={onSelect}
      className={`relative bg-white rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden ${
        isSelected
          ? 'border-indigo-500 shadow-xl ring-4 ring-indigo-100'
          : 'border-gray-200 shadow-md hover:shadow-lg hover:border-indigo-300'
      }`}
    >
      {isRecommended && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md">
            <Sparkles className="w-3 h-3" />
            Recommended
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 bg-gradient-to-br ${portfolio.gradient} rounded-xl flex items-center justify-center shadow-md`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{portfolio.name}</h3>
              <p className="text-sm text-gray-500">{portfolio.risk} Risk</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          {portfolio.description}
        </p>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">Target Return</div>
            <div className="text-lg font-black text-gray-900">{portfolio.targetReturn}%</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">Age Range</div>
            <div className="text-sm font-bold text-gray-900">{portfolio.ageRange}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">Timeline</div>
            <div className="text-xs font-bold text-gray-900">{portfolio.yearsToRetirement}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-600">Allocation:</div>
          <div className="flex items-center gap-2 flex-1">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden flex">
              <div style={{ width: `${portfolio.allocation.stocks}%` }} className="bg-blue-500" />
              <div style={{ width: `${portfolio.allocation.bonds}%` }} className="bg-emerald-500" />
              <div style={{ width: `${portfolio.allocation.other}%` }} className="bg-amber-500" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-blue-600">{portfolio.allocation.stocks}%</span>
            <span className="font-semibold text-emerald-600">{portfolio.allocation.bonds}%</span>
            <span className="font-semibold text-amber-600">{portfolio.allocation.other}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function InvestmentStep({ currentContribution, salary, selectedPlan, userAge }: InvestmentStepProps) {
  const recommendedId = getRecommendedPortfolio(userAge);
  const [selectedPortfolio, setSelectedPortfolio] = useState(recommendedId);
  
  // Fund allocation state
  const [isEditingAllocation, setIsEditingAllocation] = useState(false);
  const [fundAllocations, setFundAllocations] = useState({
    roth: { funds: 0, percentage: 0 },
    pretax: { funds: 3, percentage: 100 },
    afterTax: { funds: 0, percentage: 0 },
  });
  const [tempAllocations, setTempAllocations] = useState(fundAllocations);

  const portfolio = portfolioOptions.find((p) => p.id === selectedPortfolio) || portfolioOptions[2];
  const yearsToRetirement = 65 - userAge;

  // Calculate total allocation percentage
  const totalAllocation = tempAllocations.roth.percentage + tempAllocations.pretax.percentage + tempAllocations.afterTax.percentage;
  const isValidAllocation = totalAllocation === 100;

  // Handle allocation edit
  const handleEditAllocation = () => {
    setTempAllocations(fundAllocations);
    setIsEditingAllocation(true);
  };

  const handleSaveAllocation = () => {
    if (isValidAllocation) {
      setFundAllocations(tempAllocations);
      setIsEditingAllocation(false);
    }
  };

  const handleCancelAllocation = () => {
    setTempAllocations(fundAllocations);
    setIsEditingAllocation(false);
  };

  const updateAllocation = (source: 'roth' | 'pretax' | 'afterTax', field: 'funds' | 'percentage', value: number) => {
    setTempAllocations(prev => ({
      ...prev,
      [source]: {
        ...prev[source],
        [field]: Math.max(0, field === 'percentage' ? Math.min(100, value) : value)
      }
    }));
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
          <div className="absolute -left-4 top-0 w-1 h-14 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full" />
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Choose Your Investment Strategy
          </h2>
          <p className="text-gray-600 text-lg">
            Select a portfolio that matches your risk tolerance and retirement timeline
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Portfolio Options */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="lg:col-span-2 space-y-4"
        >
          {/* AI Insight */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 border border-indigo-200 rounded-2xl p-5">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-indigo-900 text-base mb-1.5">💡 AI Recommendation</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    At age {userAge} with {yearsToRetirement} years to retirement,{" "}
                    <span className="font-bold text-indigo-700">{portfolioOptions.find(p => p.id === recommendedId)?.name}</span> offers the best balance of growth and stability for your timeline.
                  </p>
                </div>
                <AskAIButton className="flex-shrink-0" />
              </div>
            </div>
          </motion.div>

          {/* Fund Allocation Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 text-lg">Fund Allocation</h3>
                <PieChart className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600 mb-5">
                Choose how to allocate your contributions across different tax-advantaged accounts
              </p>
              
              <div className="space-y-3">
                {/* Roth Card */}
                <motion.div
                  whileHover={{ x: 4 }}
                  className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl p-4 cursor-pointer transition-all hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-gray-900 text-base">Roth</h4>
                          <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">Tax-Free</span>
                        </div>
                        <p className="text-xs text-gray-600">
                          After-tax contributions, tax-free withdrawals in retirement
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 pl-4 border-l border-gray-200">
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">Funds</div>
                        {isEditingAllocation ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => updateAllocation('roth', 'funds', tempAllocations.roth.funds - 1)}
                              className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center transition-colors"
                            >
                              <Minus className="w-3 h-3 text-gray-700" />
                            </button>
                            <div className="text-lg font-black text-gray-900 w-10 text-center">{tempAllocations.roth.funds}</div>
                            <button
                              onClick={() => updateAllocation('roth', 'funds', tempAllocations.roth.funds + 1)}
                              className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center transition-colors"
                            >
                              <Plus className="w-3 h-3 text-gray-700" />
                            </button>
                          </div>
                        ) : (
                          <div className="text-lg font-black text-gray-900">{tempAllocations.roth.funds}</div>
                        )}
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">Allocation</div>
                        {isEditingAllocation ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={tempAllocations.roth.percentage}
                              onChange={(e) => updateAllocation('roth', 'percentage', parseInt(e.target.value) || 0)}
                              className="w-16 px-2 py-1 text-center text-lg font-black text-indigo-600 bg-white border-2 border-indigo-300 rounded focus:outline-none focus:border-indigo-500"
                              min="0"
                              max="100"
                            />
                            <span className="text-lg font-black text-indigo-600">%</span>
                          </div>
                        ) : (
                          <div className="text-lg font-black text-indigo-600">{tempAllocations.roth.percentage}%</div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Pretax Card */}
                <motion.div
                  whileHover={{ x: 4 }}
                  className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl p-4 cursor-pointer transition-all hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <TrendingDown className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-gray-900 text-base">Pretax</h4>
                          <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">Tax-Deferred</span>
                        </div>
                        <p className="text-xs text-gray-600">
                          Pre-tax contributions, reduce current taxable income
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 pl-4 border-l border-gray-200">
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">Funds</div>
                        {isEditingAllocation ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => updateAllocation('pretax', 'funds', tempAllocations.pretax.funds - 1)}
                              className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center transition-colors"
                            >
                              <Minus className="w-3 h-3 text-gray-700" />
                            </button>
                            <div className="text-lg font-black text-gray-900 w-10 text-center">{tempAllocations.pretax.funds}</div>
                            <button
                              onClick={() => updateAllocation('pretax', 'funds', tempAllocations.pretax.funds + 1)}
                              className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center transition-colors"
                            >
                              <Plus className="w-3 h-3 text-gray-700" />
                            </button>
                          </div>
                        ) : (
                          <div className="text-lg font-black text-gray-900">{tempAllocations.pretax.funds}</div>
                        )}
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">Allocation</div>
                        {isEditingAllocation ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={tempAllocations.pretax.percentage}
                              onChange={(e) => updateAllocation('pretax', 'percentage', parseInt(e.target.value) || 0)}
                              className="w-16 px-2 py-1 text-center text-lg font-black text-indigo-600 bg-white border-2 border-indigo-300 rounded focus:outline-none focus:border-indigo-500"
                              min="0"
                              max="100"
                            />
                            <span className="text-lg font-black text-indigo-600">%</span>
                          </div>
                        ) : (
                          <div className="text-lg font-black text-indigo-600">{tempAllocations.pretax.percentage}%</div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* After Tax Card */}
                <motion.div
                  whileHover={{ x: 4 }}
                  className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl p-4 cursor-pointer transition-all hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-gray-900 text-base">After Tax</h4>
                          <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">Flexible</span>
                        </div>
                        <p className="text-xs text-gray-600">
                          Additional contributions beyond traditional limits
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 pl-4 border-l border-gray-200">
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">Funds</div>
                        {isEditingAllocation ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => updateAllocation('afterTax', 'funds', tempAllocations.afterTax.funds - 1)}
                              className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center transition-colors"
                            >
                              <Minus className="w-3 h-3 text-gray-700" />
                            </button>
                            <div className="text-lg font-black text-gray-900 w-10 text-center">{tempAllocations.afterTax.funds}</div>
                            <button
                              onClick={() => updateAllocation('afterTax', 'funds', tempAllocations.afterTax.funds + 1)}
                              className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center transition-colors"
                            >
                              <Plus className="w-3 h-3 text-gray-700" />
                            </button>
                          </div>
                        ) : (
                          <div className="text-lg font-black text-gray-900">{tempAllocations.afterTax.funds}</div>
                        )}
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">Allocation</div>
                        {isEditingAllocation ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={tempAllocations.afterTax.percentage}
                              onChange={(e) => updateAllocation('afterTax', 'percentage', parseInt(e.target.value) || 0)}
                              className="w-16 px-2 py-1 text-center text-lg font-black text-indigo-600 bg-white border-2 border-indigo-300 rounded focus:outline-none focus:border-indigo-500"
                              min="0"
                              max="100"
                            />
                            <span className="text-lg font-black text-indigo-600">%</span>
                          </div>
                        ) : (
                          <div className="text-lg font-black text-indigo-600">{tempAllocations.afterTax.percentage}%</div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Edit/Save/Cancel Buttons */}
              <div className="mt-4">
                {!isValidAllocation && isEditingAllocation && (
                  <div className="mb-3 px-4 py-2 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <span className="text-sm text-red-700">
                      Total allocation must equal 100%. Current total: {totalAllocation}%
                    </span>
                  </div>
                )}
                <div className="flex justify-end">
                  {isEditingAllocation ? (
                    <>
                      <Button
                        className="mr-2 bg-gray-200 text-gray-700 hover:bg-gray-300"
                        size="default"
                        onClick={handleCancelAllocation}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        size="default"
                        onClick={handleSaveAllocation}
                        disabled={!isValidAllocation}
                      >
                        Save
                      </Button>
                    </>
                  ) : (
                    <Button
                      className="bg-indigo-600 text-white hover:bg-indigo-700"
                      size="default"
                      onClick={handleEditAllocation}
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Allocation
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {portfolioOptions.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + index * 0.05 }}
            >
              <PortfolioCard
                portfolio={option}
                isSelected={selectedPortfolio === option.id}
                isRecommended={option.id === recommendedId}
                onSelect={() => setSelectedPortfolio(option.id)}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Right Column - Summary & Projection */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          {/* Investment Strategy Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="group relative bg-white rounded-[20px] border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className={`relative p-8 bg-gradient-to-br ${portfolio.bgGradient}`}>
              {/* Top Section with Icon and Content */}
              <div className="flex items-center gap-4 mb-4">
                {/* Decorative Icon Badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.3 }}
                  className={`flex-shrink-0 w-16 h-16 bg-gradient-to-br ${portfolio.gradient} rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden group-hover:shadow-xl transition-shadow duration-300`}
                >
                  {/* Animated shimmer effect */}
                  <motion.div
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                  />
                  {portfolio.icon && <portfolio.icon className="w-8 h-8 text-white relative z-10" />}
                </motion.div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold text-gray-500 tracking-[0.15em] uppercase mb-2">
                    INVESTMENT STYLE
                  </div>
                  <div className="text-xs text-gray-600 mb-1">You belong to:</div>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 }}
                    className="text-xl font-bold text-gray-900 mb-1"
                  >
                    {portfolio.name}
                  </motion.div>
                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    <span>{portfolio.risk === "Moderate" ? "Growth + stability" : portfolio.description.split(" ").slice(0, 3).join(" ")}</span>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-1 h-3 rounded-full transition-all duration-300 ${
                            i < portfolio.riskLevel
                              ? 'bg-gradient-to-t from-gray-400 to-gray-600'
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Button - Bottom */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-sm font-bold text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <Edit3 className="w-4 h-4" />
                Edit Investment Strategy
              </motion.button>
            </div>
          </motion.div>

          {/* Selected Portfolio Summary */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sticky top-6">
            {/* Header */}
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-1">Allocation Summary</h3>
              <p className="text-sm text-gray-600">Real-time impact of your elections.</p>
            </div>

            {/* Allocation Donut Chart */}
            <div className="mb-5">
              <div className="flex items-center justify-center mb-4 relative">
                <ResponsiveContainer width="100%" height={240}>
                  <RechartsPieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={95}
                      paddingAngle={3}
                      dataKey="value"
                      startAngle={90}
                      endAngle={450}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                      ))}
                    </Pie>
                  </RechartsPieChart>
                </ResponsiveContainer>
                {/* Center Text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-black text-gray-900 mb-1">100%</div>
                    <div className="text-xs font-semibold text-gray-500 tracking-wider">TOTAL</div>
                  </div>
                </div>
              </div>

              {/* Valid Allocation Badge */}
              <div className="flex justify-center mb-5">
                <div className="px-5 py-2 bg-emerald-50 border-2 border-emerald-200 rounded-full flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-bold text-emerald-700">Valid Allocation</span>
                </div>
              </div>

              {/* Fund Legend */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-sm font-medium text-gray-700">S&P 500 Index Fund</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{pieData[0].value}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-sm font-medium text-gray-700">Total Bond Market Index</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{pieData[1].value}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="text-sm font-medium text-gray-700">International Stock Index</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{pieData[2].value}%</span>
                </div>
              </div>
            </div>

            {/* Estimated Value */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-5 text-white mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold opacity-90">Estimated at Retirement</span>
                <ArrowUpRight className="w-5 h-5" />
              </div>
              <div className="text-3xl font-black mb-1">
                ${finalBalance.toLocaleString()}
              </div>
              <div className="text-xs opacity-75">
                In {yearsToRetirement} years at {portfolio.targetReturn}% avg. return
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-5 pt-5 border-t border-gray-200">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-gray-500 leading-relaxed">
                  Projections are estimates only. Actual returns will vary based on market performance and investment choices.
                </p>
              </div>
            </div>
          </div>

          {/* Risk Tolerance Info */}
          

          {/* Advisor Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800 rounded-2xl p-6 shadow-xl overflow-hidden"
          >
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl" />
            
            {/* 3D User Icon Effect */}
            <div className="relative mb-4 flex justify-center">
              <div className="relative">
                {/* Shadow layers for 3D effect */}
                <div className="absolute inset-0 w-20 h-20 bg-white/10 rounded-2xl blur-md translate-y-2" />
                <div className="absolute inset-0 w-20 h-20 bg-white/15 rounded-2xl blur-sm translate-y-1" />
                
                {/* Main icon container */}
                <div className="relative w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform">
                  <div className="relative">
                    {/* 3D User Icon with CSS layering */}
                    <div className="relative w-12 h-12">
                      {/* Head */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-5 bg-gradient-to-br from-slate-500 via-slate-600 to-slate-800 rounded-full shadow-lg">
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent rounded-full" />
                        <div className="absolute bottom-0 right-0 w-2 h-2 bg-slate-900/40 rounded-full blur-sm" />
                      </div>
                      
                      {/* Body/Shoulders */}
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-7 bg-gradient-to-br from-slate-500 via-slate-600 to-slate-800 rounded-t-full shadow-lg overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/25 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 h-2 bg-slate-900/30 blur-sm" />
                      </div>
                      
                      {/* 3D depth shadow */}
                      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-5 h-5 bg-slate-900/20 rounded-full blur-md" />
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-10 h-7 bg-slate-900/20 rounded-t-full blur-md" />
                    </div>
                    
                    {/* Animated pulse ring */}
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.4, 0, 0.4],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute inset-0 border-2 border-slate-400 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="relative text-center">
              <h4 className="font-bold text-white text-base mb-2">
                Need Expert Help?
              </h4>
              <p className="text-sm text-slate-200 leading-relaxed mb-4">
                Need help choosing? Get personalized advice from our experts.
              </p>

              {/* CTA Buttons */}
              <div className="space-y-2">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    className="w-full bg-white text-slate-700 hover:bg-slate-50 font-bold shadow-lg"
                    size="default"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Chat with AI Advisor
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    variant="outline"
                    className="w-full bg-transparent text-white border-2 border-white/30 hover:bg-white/10 hover:border-white/50 font-semibold"
                    size="default"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Connect with Advisor
                  </Button>
                </motion.div>
              </div>

              {/* Availability indicator */}
              
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-8 bg-gray-50 border border-gray-200 rounded-2xl p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm mb-1">Automatic Rebalancing</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Your portfolio is automatically rebalanced quarterly to maintain your target allocation.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm mb-1">Professional Management</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Expert portfolio managers handle all investment decisions and monitoring for you.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm mb-1">Change Anytime</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Switch between portfolios at any time as your goals and risk tolerance evolve.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}