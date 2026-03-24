import { useState } from "react";
import { TrendingUp, DollarSign, Info, Percent, Zap, Sparkles, Settings, PiggyBank, LineChart } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "motion/react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { AskAIButton } from "./AskAIButton";

interface ContributionStepProps {
  salary: number;
  selectedPlan: string;
}

export function ContributionStep({ salary, selectedPlan }: ContributionStepProps) {
  const [contributionMode, setContributionMode] = useState<"percentage" | "dollar">("percentage");
  const [percentage, setPercentage] = useState(6);
  const [monthlyDollar, setMonthlyDollar] = useState(225);
  
  // Contribution split management
  const [sources, setSources] = useState({
    preTax: { enabled: true, percentage: 50 },
    roth: { enabled: false, percentage: 0 },
    afterTax: { enabled: true, percentage: 50 }
  });
  
  const [isModifyingSplit, setIsModifyingSplit] = useState(false);
  
  const annualSalary = salary;
  const contributionLimit = 23000;
  const monthlyContributionLimit = Math.floor(contributionLimit / 12);
  const employerMatchRate = 6;
  const payPeriodsPerYear = 12; // Monthly
  
  // Calculate values based on mode
  const yearlyContribution = contributionMode === "percentage" 
    ? (annualSalary * percentage) / 100 
    : monthlyDollar * 12;
  const monthlyContribution = yearlyContribution / 12;
  const perPaycheckContribution = yearlyContribution / payPeriodsPerYear;
  
  const employerMatch = Math.min((annualSalary * employerMatchRate) / 100, yearlyContribution);
  const perPaycheckEmployerMatch = employerMatch / payPeriodsPerYear;
  const perPaycheckTotal = perPaycheckContribution + perPaycheckEmployerMatch;
  
  const totalAnnualContribution = yearlyContribution + employerMatch;
  
  // Retirement projection (simple compound interest)
  const yearsToRetire = 8;
  const annualReturn = 0.07;
  const futureValue = totalAnnualContribution * (((Math.pow(1 + annualReturn, yearsToRetire) - 1) / annualReturn) * (1 + annualReturn));
  
  // Calculate year-by-year projection data for chart
  const projectionData = [];
  let balance = 0;
  for (let year = 0; year <= yearsToRetire; year++) {
    if (year === 0) {
      projectionData.push({
        year: `Now`,
        value: 0,
        contributions: 0,
      });
    } else {
      balance = (balance + totalAnnualContribution) * (1 + annualReturn);
      const totalContributions = totalAnnualContribution * year;
      projectionData.push({
        year: `Year ${year}`,
        value: Math.round(balance),
        contributions: Math.round(totalContributions),
      });
    }
  }
  
  const handlePercentageChange = (value: number) => {
    setPercentage(value);
    setMonthlyDollar(Math.round((annualSalary * value) / 100 / 12));
  };
  
  const handleDollarChange = (value: number) => {
    setMonthlyDollar(value);
    setPercentage(Math.round((value * 12 / annualSalary) * 100 * 10) / 10);
  };
  
  const setPreset = (presetPercentage: number) => {
    setPercentage(presetPercentage);
    setMonthlyDollar(Math.round((annualSalary * presetPercentage) / 100 / 12));
  };

  // Handle source toggle
  const toggleSource = (sourceKey: 'preTax' | 'roth' | 'afterTax') => {
    setSources(prev => {
      const newSources = { ...prev };
      newSources[sourceKey].enabled = !newSources[sourceKey].enabled;
      
      // Recalculate percentages if disabling
      if (!newSources[sourceKey].enabled) {
        newSources[sourceKey].percentage = 0;
        const enabledSources = Object.keys(newSources).filter(
          key => newSources[key as keyof typeof newSources].enabled
        );
        if (enabledSources.length === 1) {
          const onlySource = enabledSources[0] as keyof typeof newSources;
          newSources[onlySource].percentage = 100;
        }
      } else {
        // If enabling, distribute evenly among enabled sources
        const enabledCount = Object.values(newSources).filter(s => s.enabled).length;
        const evenSplit = Math.floor(100 / enabledCount);
        let remaining = 100;
        Object.keys(newSources).forEach((key, index) => {
          const sourceKey = key as keyof typeof newSources;
          if (newSources[sourceKey].enabled) {
            if (index === Object.keys(newSources).filter(k => newSources[k as keyof typeof newSources].enabled).length - 1) {
              newSources[sourceKey].percentage = remaining;
            } else {
              newSources[sourceKey].percentage = evenSplit;
              remaining -= evenSplit;
            }
          }
        });
      }
      
      return newSources;
    });
  };

  // Handle source percentage change
  const handleSourcePercentageChange = (sourceKey: 'preTax' | 'roth' | 'afterTax', value: number) => {
    setSources(prev => {
      const newSources = { ...prev };
      const enabledSources = Object.keys(newSources).filter(
        key => newSources[key as keyof typeof newSources].enabled
      ) as Array<keyof typeof newSources>;
      
      if (enabledSources.length === 1) {
        newSources[sourceKey].percentage = 100;
        return newSources;
      }
      
      const otherSources = enabledSources.filter(key => key !== sourceKey);
      const totalOtherPercentage = otherSources.reduce(
        (sum, key) => sum + newSources[key].percentage, 0
      );
      
      const maxValue = 100 - otherSources.length; // Leave at least 1% for others
      const clampedValue = Math.min(Math.max(value, 0), maxValue);
      
      newSources[sourceKey].percentage = clampedValue;
      
      // Distribute remainder among other sources
      const remaining = 100 - clampedValue;
      const distributionRatio = remaining / totalOtherPercentage;
      
      otherSources.forEach(key => {
        newSources[key].percentage = Math.round(newSources[key].percentage * distributionRatio);
      });
      
      // Fix rounding errors
      const total = Object.values(newSources).reduce((sum, s) => s.enabled ? sum + s.percentage : sum, 0);
      if (total !== 100 && otherSources.length > 0) {
        const lastSource = otherSources[otherSources.length - 1];
        newSources[lastSource].percentage += (100 - total);
      }
      
      return newSources;
    });
  };

  // Calculate split amounts
  const preTaxAmount = (yearlyContribution * sources.preTax.percentage) / 100;
  const rothAmount = (yearlyContribution * sources.roth.percentage) / 100;
  const afterTaxAmount = (yearlyContribution * sources.afterTax.percentage) / 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative">
          <div className="absolute -left-4 top-0 w-1 h-12 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            How much would you like to contribute?
          </h2>
          <p className="text-gray-600">
            to your {selectedPlan}
          </p>
        </div>
      </motion.div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Contribution Controls */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* AI Insight */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 border border-purple-200 rounded-xl p-5 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-blue-200/30 rounded-full blur-3xl" />
            <div className="relative flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-1">✨ AI Insight: Maximize Your Match</h4>
                <p className="text-sm text-gray-700">
                  Your employer matches up to {employerMatchRate}% of your salary. By contributing at least {employerMatchRate}%, you'll get the full match of ${Math.round((annualSalary * employerMatchRate) / 100).toLocaleString()}/year in free money!
                </p>
              </div>
            </div>
          </motion.div>

          {/* Main Contribution Slider Card */}
          <div className="bg-white rounded-2xl shadow p-6 border border-gray-200">
            {/* Card Title */}
            <div className="mb-4 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-gray-900">Set Your Contribution</h3>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Retirement contributions are automatic deductions from your paycheck that go into your retirement account. Your employer may match a portion of your contributions, giving you free money toward retirement. You can adjust your contribution amount anytime.');
                    }}
                    className="flex items-center gap-1 px-2 py-1 rounded bg-indigo-50 hover:bg-indigo-100 transition-colors group"
                    title="Learn about contributions"
                  >
                    <Zap className="w-3 h-3 text-indigo-400 group-hover:text-indigo-600" />
                    <span className="text-xs text-indigo-500 group-hover:text-indigo-700 font-medium">Ask AI</span>
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-0.5">Choose how much to save for retirement</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 mb-0.5">Monthly Paycheck</div>
                <div className="text-lg font-bold text-gray-900">
                  ${(annualSalary / 12).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Header with Toggle */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Quick:</span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => setPreset(4)}
                    variant="outline"
                    className={`px-3 py-1 h-8 text-xs ${
                      percentage === 4 ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-300"
                    }`}
                  >
                    4% Safe
                  </Button>
                  
                  <Button
                    size="sm"
                    onClick={() => setPreset(6)}
                    variant="outline"
                    className={`px-3 py-1 h-8 text-xs ${
                      percentage === 6 ? "border-green-600 bg-green-50 text-green-700" : "border-gray-300"
                    }`}
                  >
                    6% Match
                  </Button>
                  
                  <Button
                    size="sm"
                    onClick={() => setPreset(15)}
                    variant="outline"
                    className={`px-3 py-1 h-8 text-xs ${
                      percentage === 15 ? "border-purple-600 bg-purple-50 text-purple-700" : "border-gray-300"
                    }`}
                  >
                    15% Aggressive
                  </Button>
                </div>
              </div>

              {/* Toggle % / $ */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setContributionMode("percentage")}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    contributionMode === "percentage"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Percent className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setContributionMode("dollar")}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    contributionMode === "dollar"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <DollarSign className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Slider with manual input */}
            <div className="mb-4">
              <div className="flex items-end justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1.5">Your Contribution</h3>
                  {contributionMode === "percentage" ? (
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min="1"
                        max="25"
                        value={percentage}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          if (val >= 1 && val <= 25) {
                            handlePercentageChange(val);
                          }
                        }}
                        className="w-36 text-5xl font-bold text-blue-600 border-2 border-gray-300 focus:border-blue-600 outline-none bg-white rounded-lg px-3 py-2 text-center shadow-sm"
                      />
                      <span className="text-2xl text-gray-500 mb-1">%</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-2xl text-gray-500 mb-1">$</span>
                      <input
                        type="number"
                        min="450"
                        max={monthlyContributionLimit}
                        step="100"
                        value={monthlyDollar}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          if (val >= 450 && val <= monthlyContributionLimit) {
                            handleDollarChange(val);
                          }
                        }}
                        className="w-44 text-4xl font-bold text-blue-600 border-2 border-gray-300 focus:border-blue-600 outline-none bg-white rounded-lg px-3 py-2 text-center shadow-sm"
                      />
                      <span className="text-sm text-gray-500 mb-1">/mo</span>
                    </div>
                  )}
                </div>
                <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200 min-w-[200px]">
                  <div className="flex items-center gap-2 mb-1">
                    <PiggyBank className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-semibold text-emerald-900">Building Your Future</span>
                  </div>
                  <p className="text-sm text-emerald-800">
                    You're saving <span className="font-bold">${Math.round(monthlyContribution).toLocaleString()}/month</span>
                  </p>
                </div>
              </div>
              
              {/* Slider */}
              <div className="relative mb-2">
                {contributionMode === "percentage" ? (
                  <>
                    <input
                      type="range"
                      min="1"
                      max="25"
                      step="1"
                      value={percentage}
                      onChange={(e) => handlePercentageChange(Number(e.target.value))}
                      className="w-full custom-slider cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(percentage / 25) * 100}%, #e5e7eb ${(percentage / 25) * 100}%, #e5e7eb 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1.5">
                      <span>1%</span>
                      <span>25%</span>
                    </div>
                  </>
                ) : (
                  <>
                    <input
                      type="range"
                      min="450"
                      max={monthlyContributionLimit}
                      step="100"
                      value={monthlyDollar}
                      onChange={(e) => handleDollarChange(Number(e.target.value))}
                      className="w-full custom-slider cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(monthlyDollar / monthlyContributionLimit) * 100}%, #e5e7eb ${(monthlyDollar / monthlyContributionLimit) * 100}%, #e5e7eb 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1.5">
                      <span>$450</span>
                      <span>${monthlyContributionLimit.toLocaleString()}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Yearly contribution at bottom */}
              

              {/* Contribution Source Split Section - Always Visible */}
              <div className="mt-5 pt-5 border-t border-gray-200">
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      
                      <h4 className="text-base font-bold text-gray-900">Tax Strategy</h4>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsModifyingSplit(!isModifyingSplit)}
                      className={`flex items-center gap-2 h-9 px-3.5 text-xs font-semibold transition-all duration-300 transform hover:scale-105 shadow-sm ${
                        isModifyingSplit 
                          ? "border-blue-600 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-200 animate-pulse" 
                          : "border-blue-400 bg-white text-blue-700 hover:bg-blue-50 hover:shadow-md"
                      }`}
                    >
                      <Settings className={`w-3.5 h-3.5 transition-transform duration-300 ${isModifyingSplit ? "rotate-90" : ""}`} />
                      {isModifyingSplit ? "Done" : "Edit Contribution Split"}
                    </Button>
                  </div>
                  <p className="text-gray-600 text-xs">Choose how to split your contributions across different tax treatments</p>
                </div>
                
                {/* Source Cards with Checkboxes and Sliders */}
                <div className="space-y-2">
                  {/* Pre-tax Card */}
                  <div className={`rounded-lg p-2.5 border transition-all ${ sources.preTax.enabled ? "border-gray-300 bg-gray-100" : "border-gray-200 bg-gray-100" } bg-[#fefefe]`}>
                    <label className="flex items-center justify-between mb-1.5 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={sources.preTax.enabled}
                          onChange={() => toggleSource('preTax')}
                          disabled={!isModifyingSplit}
                          className="w-4 h-4 text-blue-600 rounded border-2 border-gray-300 cursor-pointer disabled:cursor-not-allowed"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-semibold text-gray-900">Pre-tax</span>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                alert('Pre-tax contributions reduce your taxable income now. You pay taxes when you withdraw in retirement. Great for lowering current tax burden.');
                              }}
                              className="flex items-center gap-1 px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 transition-colors group"
                              title="Learn about Pre-tax"
                            >
                              <Zap className="w-3 h-3 text-blue-400 group-hover:text-blue-600" />
                              <span className="text-xs text-blue-500 group-hover:text-blue-700 font-medium">Ask AI</span>
                            </button>
                          </div>
                          {sources.preTax.enabled && (
                            <div className="flex items-center gap-1 mt-0.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                              <span className="text-xs text-gray-500">Active</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {sources.preTax.enabled && (
                        <div className="text-right">
                          <span className="text-sm font-bold text-blue-600">{sources.preTax.percentage}%</span>
                          <span className="text-xs text-gray-600 ml-1.5 block">${Math.round(preTaxAmount / 12).toLocaleString()}/mo</span>
                        </div>
                      )}
                    </label>
                    {sources.preTax.enabled && isModifyingSplit && (
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={sources.preTax.percentage}
                        onChange={(e) => handleSourcePercentageChange('preTax', Number(e.target.value))}
                        className="w-full custom-slider cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${sources.preTax.percentage}%, #e5e7eb ${sources.preTax.percentage}%, #e5e7eb 100%)`
                        }}
                      />
                    )}
                  </div>

                  {/* Roth Card */}
                  <div className={`rounded-lg p-2.5 border transition-all ${ sources.roth.enabled ? "border-gray-300 bg-gray-100" : "border-gray-200 bg-gray-100" } bg-[#fefefe]`}>
                    <label className="flex items-center justify-between mb-1.5 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={sources.roth.enabled}
                          onChange={() => toggleSource('roth')}
                          disabled={!isModifyingSplit}
                          className="w-4 h-4 text-purple-600 rounded border-2 border-gray-300 cursor-pointer disabled:cursor-not-allowed"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-semibold text-gray-900">Roth</span>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                alert('Roth contributions are made with after-tax dollars. Your withdrawals in retirement are tax-free. Ideal if you expect higher taxes later.');
                              }}
                              className="flex items-center gap-1 px-2 py-1 rounded bg-purple-50 hover:bg-purple-100 transition-colors group"
                              title="Learn about Roth"
                            >
                              <Zap className="w-3 h-3 text-purple-400 group-hover:text-purple-600" />
                              <span className="text-xs text-purple-500 group-hover:text-purple-700 font-medium">Ask AI</span>
                            </button>
                          </div>
                          {sources.roth.enabled && (
                            <div className="flex items-center gap-1 mt-0.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-purple-600"></div>
                              <span className="text-xs text-gray-500">Active</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {sources.roth.enabled && (
                        <div className="text-right">
                          <span className="text-sm font-bold text-purple-600">{sources.roth.percentage}%</span>
                          <span className="text-xs text-gray-600 ml-1.5 block">${Math.round(rothAmount / 12).toLocaleString()}/mo</span>
                        </div>
                      )}
                    </label>
                    {sources.roth.enabled && isModifyingSplit && (
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={sources.roth.percentage}
                        onChange={(e) => handleSourcePercentageChange('roth', Number(e.target.value))}
                        className="w-full custom-slider cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${sources.roth.percentage}%, #e5e7eb ${sources.roth.percentage}%, #e5e7eb 100%)`
                        }}
                      />
                    )}
                  </div>

                  {/* After-tax Card */}
                  <div className={`rounded-lg p-2.5 border transition-all ${ sources.afterTax.enabled ? "border-gray-300 bg-gray-100" : "border-gray-200 bg-gray-100" } bg-[#fefefe]`}>
                    <label className="flex items-center justify-between mb-1.5 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={sources.afterTax.enabled}
                          onChange={() => toggleSource('afterTax')}
                          disabled={!isModifyingSplit}
                          className="w-4 h-4 text-emerald-600 rounded border-2 border-gray-300 cursor-pointer disabled:cursor-not-allowed"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-semibold text-gray-900">After-tax</span>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                alert('After-tax contributions allow you to save beyond normal limits. Can be converted to Roth for tax-free growth (mega backdoor Roth strategy).');
                              }}
                              className="flex items-center gap-1 px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 transition-colors group"
                              title="Learn about After-tax"
                            >
                              <Zap className="w-3 h-3 text-emerald-400 group-hover:text-emerald-600" />
                              <span className="text-xs text-emerald-500 group-hover:text-emerald-700 font-medium">Ask AI</span>
                            </button>
                          </div>
                          {sources.afterTax.enabled && (
                            <div className="flex items-center gap-1 mt-0.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-600"></div>
                              <span className="text-xs text-gray-500">Active</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {sources.afterTax.enabled && (
                        <div className="text-right">
                          <span className="text-sm font-bold text-emerald-600">{sources.afterTax.percentage}%</span>
                          <span className="text-xs text-gray-600 ml-1.5 block">${Math.round(afterTaxAmount / 12).toLocaleString()}/mo</span>
                        </div>
                      )}
                    </label>
                    {sources.afterTax.enabled && isModifyingSplit && (
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={sources.afterTax.percentage}
                        onChange={(e) => handleSourcePercentageChange('afterTax', Number(e.target.value))}
                        className="w-full custom-slider cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${sources.afterTax.percentage}%, #e5e7eb ${sources.afterTax.percentage}%, #e5e7eb 100%)`
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* Visual Split Bar */}
                <div className="mt-3">
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden flex shadow-inner">
                    {sources.preTax.enabled && sources.preTax.percentage > 0 && (
                      <div 
                        className="bg-blue-400 flex items-center justify-center text-xs text-white font-semibold transition-all"
                        style={{ width: `${sources.preTax.percentage}%` }}
                      >
                        {sources.preTax.percentage > 10 && `${sources.preTax.percentage}%`}
                      </div>
                    )}
                    {sources.roth.enabled && sources.roth.percentage > 0 && (
                      <div 
                        className="bg-purple-400 flex items-center justify-center text-xs text-white font-semibold transition-all"
                        style={{ width: `${sources.roth.percentage}%` }}
                      >
                        {sources.roth.percentage > 10 && `${sources.roth.percentage}%`}
                      </div>
                    )}
                    {sources.afterTax.enabled && sources.afterTax.percentage > 0 && (
                      <div 
                        className="bg-emerald-400 flex items-center justify-center text-xs text-white font-semibold transition-all"
                        style={{ width: `${sources.afterTax.percentage}%` }}
                      >
                        {sources.afterTax.percentage > 10 && `${sources.afterTax.percentage}%`}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column - Summary Cards */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          {/* Retirement Projection Card */}
          <div className="bg-white rounded-2xl shadow border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <LineChart className="w-4 h-4 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Retirement Projection</h3>
            </div>
            
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-1">Projected value at age 39</div>
              <div className="text-3xl font-bold text-emerald-600">
                ${Math.round(futureValue).toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 mt-1">in {yearsToRetire} years</div>
            </div>

            {/* Interactive Chart */}
            <div className="mb-4">
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={projectionData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorContributions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="year" 
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                    tickLine={false}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                    labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="contributions" 
                    stroke="#2563eb" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorContributions)"
                    name="Your Contributions"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorValue)"
                    name="Total Value"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#2563eb]"></div>
                <span className="text-xs text-gray-600">Your Contributions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-xs text-gray-600">Total Value</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-xs text-gray-600 mb-1">Contributions</div>
                <div className="font-bold text-[#2563eb]">
                  ${Math.round(totalAnnualContribution * yearsToRetire).toLocaleString()}
                </div>
              </div>
              <div className="bg-emerald-50 rounded-lg p-3">
                <div className="text-xs text-gray-600 mb-1">Growth</div>
                <div className="font-bold text-emerald-600">
                  ${Math.round(futureValue - (totalAnnualContribution * yearsToRetire)).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-600">
                    <span className="font-semibold text-gray-700">Disclaimer:</span> Projection assumes 7% annual return. Actual results may vary. Investments involve risk.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Paycheck Impact Card */}
          <div className="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
            
            
            <div className="p-5">
              {/* Single Line Breakdown */}
              <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-center flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#2563eb]"></div>
                    <span className="text-sm text-gray-700">You</span>
                    <span className="font-bold text-gray-900">${perPaycheckContribution.toFixed(2)}</span>
                  </div>
                  <div className="text-gray-400">+</div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#059669]"></div>
                    <span className="text-sm text-gray-700">Employer</span>
                    <span className="font-bold text-gray-900">${perPaycheckEmployerMatch.toFixed(2)}</span>
                  </div>
                  <div className="text-gray-400">=</div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-sm text-gray-700">Total</span>
                    <span className="text-xl font-bold text-blue-600 whitespace-nowrap">${Math.round(totalAnnualContribution / 12).toLocaleString()}/mo</span>
                  </div>
                </div>
              </div>

              {/* Visual Progress Bar */}
              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden shadow-inner">
                <div className="flex h-full">
                  <div 
                    className="bg-blue-300 transition-all"
                    style={{ width: `${(perPaycheckContribution / perPaycheckTotal) * 100}%` }}
                  />
                  <div 
                    className="bg-emerald-300 transition-all"
                    style={{ width: `${(perPaycheckEmployerMatch / perPaycheckTotal) * 100}%` }}
                  />
                </div>
              </div>

              <p className="text-xs text-gray-500 text-center mt-3">
                Based on {payPeriodsPerYear} pay periods per year • <span className="font-bold text-gray-900">${Math.round(totalAnnualContribution).toLocaleString()}/yr</span> total
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}