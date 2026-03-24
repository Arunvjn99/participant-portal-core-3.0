import { useNavigate } from "react-router";
import { useEnrollment } from "./enrollment-context";
import { Sparkles, ArrowRight, ArrowLeft, Info, Minus, Plus, TrendingUp } from "lucide-react";
import { useState, useId } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from "recharts";

function generateProjectionData(percent: number, salary: number) {
  const annual = salary * (percent / 100);
  const matchPercent = Math.min(percent, 6);
  const matchAnnual = salary * (matchPercent / 100);
  const data = [];
  let total = 0;
  let contributions = 0;
  for (let year = 0; year <= 30; year++) {
    const yearlyContribution = annual + matchAnnual;
    contributions += yearlyContribution;
    total = (total + yearlyContribution) * 1.07;
    data.push({
      year: `${year}yr`,
      value: Math.round(total),
      contributions: Math.round(contributions),
      marketGain: Math.round(total - contributions),
    });
  }
  return data;
}

export function ContributionSetup() {
  const navigate = useNavigate();
  const { data, updateData, setCurrentStep, personalization } = useEnrollment();
  const [compareMode, setCompareMode] = useState(false);
  const [comparePercent, setComparePercent] = useState(12);
  const [percentInput, setPercentInput] = useState(String(data.contributionPercent));
  const [dollarInput, setDollarInput] = useState(String(Math.round((data.salary * data.contributionPercent) / 100)));
  const gradientId = useId();
  const percent = data.contributionPercent;
  const salary = data.salary;
  
  // Calculate monthly values
  const monthlyPaycheck = Math.round(salary / 12);
  const monthlyContribution = Math.round((salary * percent) / 100 / 12);
  const matchPercent = Math.min(percent, 6);
  const monthlyMatch = Math.round((salary * matchPercent) / 100 / 12);
  
  // Calculate take-home impact (rough estimate: 22% tax rate)
  const monthlyTakeHomeImpact = Math.round(monthlyContribution * 0.78);
  
  // Projection calculations
  const projectionData = generateProjectionData(percent, salary);
  const projectedTotal = projectionData[projectionData.length - 1]?.value || 0;
  
  // Monthly retirement income estimate (4% withdrawal rule)
  const monthlyRetirementIncome = Math.round((projectedTotal * 0.04) / 12);
  
  // Progress indicator (based on recommended 12%)
  const recommendedPercent = 12;
  const progressPercentage = Math.min((percent / recommendedPercent) * 100, 100);
  
  // Income replacement percentage (rough estimate)
  const incomeReplacementPercent = Math.min(Math.round((monthlyRetirementIncome / (salary / 12)) * 100), 100);
  
  // Comparison data
  const comparisonData = generateProjectionData(comparePercent, salary);
  const comparisonTotal = comparisonData[comparisonData.length - 1]?.value || 0;
  const difference = comparisonTotal - projectedTotal;
  
  // Microcopy calculation (1% increase impact)
  const onePercentIncrease = generateProjectionData(percent + 1, salary);
  const onePercentImpact = (onePercentIncrease[onePercentIncrease.length - 1]?.value || 0) - projectedTotal;

  const quickOptions = [
    { label: "4% Start", value: 4, icon: null },
    { label: "6% Employer match", value: 6, icon: "✅" },
    { label: "10% Strong start", value: 10, icon: null },
    { label: "15% Fast track", value: 15, icon: "🚀" },
  ];

  const handleNext = () => {
    setCurrentStep(3);
    navigate("/contribution-source");
  };
  
  const adjustPercent = (delta: number) => {
    const newValue = Math.max(1, Math.min(25, percent + delta));
    updateData({ contributionPercent: newValue });
    setPercentInput(String(newValue));
    setDollarInput(String(Math.round((salary * newValue) / 100)));
  };
  
  const handlePercentInputChange = (value: string) => {
    setPercentInput(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 25) {
      updateData({ contributionPercent: Math.round(numValue) });
      setDollarInput(String(Math.round((salary * numValue) / 100)));
    }
  };
  
  const handleDollarInputChange = (value: string) => {
    setDollarInput(value);
    const numValue = parseFloat(value.replace(/,/g, ''));
    if (!isNaN(numValue)) {
      const calculatedPercent = Math.round((numValue / salary) * 100);
      if (calculatedPercent >= 1 && calculatedPercent <= 25) {
        updateData({ contributionPercent: calculatedPercent });
        setPercentInput(String(calculatedPercent));
      }
    }
  };
  
  const handleQuickOption = (value: number) => {
    updateData({ contributionPercent: value });
    setPercentInput(String(value));
    setDollarInput(String(Math.round((salary * value) / 100)));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button 
          onClick={() => { setCurrentStep(1); navigate("/plan"); }} 
          className="flex items-center gap-1 text-muted-foreground mb-3 hover:text-foreground transition-colors" 
          style={{ fontSize: "0.85rem" }}
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1>Set your retirement savings</h1>
        <p className="text-muted-foreground mt-1" style={{ fontSize: "0.95rem" }}>
          We'll guide you to the right contribution for your future
        </p>
      </div>

      {/* Recommendation Banner */}
      

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* ─── LEFT CARD: Contribution Selector ─── */}
        <div className="bg-card rounded-2xl border border-border shadow-lg p-6 space-y-6">
          {/* Monthly Paycheck Display */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/30 rounded-xl p-4 border border-blue-200/50">
            <p className="text-muted-foreground text-center" style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Monthly Paycheck
            </p>
            <p className="text-foreground text-center mt-1" style={{ fontSize: "1.4rem", fontWeight: 700 }}>
              ${monthlyPaycheck.toLocaleString()}
            </p>
          </div>
          
          {/* Large percentage display with +/- buttons */}
          <div className="text-center">
            <p className="text-muted-foreground mb-3" style={{ fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Your Contribution
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => adjustPercent(-1)}
                className="w-11 h-11 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 flex items-center justify-center transition-colors"
                aria-label="Decrease percentage"
              >
                <Minus className="w-5 h-5 text-blue-600" />
              </button>
              <p className="text-blue-600" style={{ fontSize: "4rem", fontWeight: 800, lineHeight: 1, letterSpacing: "-0.02em" }}>
                {percent}%
              </p>
              <button
                onClick={() => adjustPercent(1)}
                className="w-11 h-11 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 flex items-center justify-center transition-colors"
                aria-label="Increase percentage"
              >
                <Plus className="w-5 h-5 text-blue-600" />
              </button>
            </div>
          </div>
          
          {/* Text Input Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-muted-foreground block mb-2" style={{ fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Percentage
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="25"
                  step="0.5"
                  value={percentInput}
                  onChange={(e) => handlePercentInputChange(e.target.value)}
                  className="w-full px-3 py-2.5 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  style={{ fontSize: "0.95rem", fontWeight: 500 }}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                  %
                </span>
              </div>
            </div>
            <div>
              <label className="text-muted-foreground block mb-2" style={{ fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Annual $
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                  $
                </span>
                <input
                  type="text"
                  value={dollarInput}
                  onChange={(e) => handleDollarInputChange(e.target.value)}
                  className="w-full pl-7 pr-3 py-2.5 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  style={{ fontSize: "0.95rem", fontWeight: 500 }}
                />
              </div>
            </div>
          </div>

          {/* Quick Select - moved up */}
          <div>
            <p className="text-muted-foreground mb-2" style={{ fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Quick Select
            </p>
            <div className="flex gap-2 flex-wrap">
              {quickOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleQuickOption(opt.value)}
                  className={`px-2.5 py-1.5 rounded-lg transition-all ${
                    percent === opt.value
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-secondary text-secondary-foreground hover:bg-accent hover:scale-105"
                  }`}
                  style={{ fontSize: "0.75rem", fontWeight: 600 }}
                >
                  {opt.label} {opt.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Slider */}
          <div className="px-1">
            <input
              type="range"
              min={1}
              max={25}
              value={percent}
              onChange={(e) => {
                const newValue = Number(e.target.value);
                updateData({ contributionPercent: newValue });
                setPercentInput(String(newValue));
                setDollarInput(String(Math.round((salary * newValue) / 100)));
              }}
              className="w-full h-2.5 bg-secondary rounded-full appearance-none cursor-pointer accent-blue-600"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((percent - 1) / 24) * 100}%, var(--secondary) ${((percent - 1) / 24) * 100}%, var(--secondary) 100%)`
              }}
            />
            <div className="flex justify-between text-muted-foreground mt-2" style={{ fontSize: "0.7rem" }}>
              <span>1%</span>
              <span>25%</span>
            </div>
          </div>

          {/* Pro Tip - moved here */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100/30 rounded-xl p-3.5 border border-purple-200/50">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-purple-900" style={{ fontSize: "0.7rem", fontWeight: 700, marginBottom: "0.25rem" }}>
                  Pro Tip
                </p>
                <p className="text-purple-700" style={{ fontSize: "0.75rem", lineHeight: 1.5 }}>
                  Increasing just 1% could add ~${onePercentImpact.toLocaleString()} to your retirement
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── RIGHT CARD: Projection & Chart ─── */}
        <div className="bg-card rounded-2xl border border-border shadow-lg p-6 space-y-5">
          {/* Header with Progress */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-foreground" style={{ fontSize: "0.95rem", fontWeight: 600 }}>
                Retirement Savings Projection
              </h3>
              <p className="text-muted-foreground mt-0.5" style={{ fontSize: "0.75rem" }}>
                Growth over 30 years at 7% annual return
              </p>
            </div>
            
            {/* Progress Indicator */}
            <div className="text-right">
              <p className="text-green-700" style={{ fontSize: "0.8rem", fontWeight: 700 }}>
                {Math.round(progressPercentage)}% on track
              </p>
              <div className="w-28 h-1.5 bg-green-100 rounded-full overflow-hidden mt-1">
                <div 
                  className="h-full bg-green-600 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Two column: Projected Total + Monthly Impact */}
          <div className="grid grid-cols-2 gap-4">
            {/* Projected Total Banner */}
            <div className="bg-gradient-to-br from-green-50 to-green-100/30 rounded-xl p-4 border border-green-200/50">
              <p className="text-muted-foreground text-center" style={{ fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Projected at Age {personalization.retirementAge}
              </p>
              <p className="text-green-700 text-center mt-1" style={{ fontSize: "1.8rem", fontWeight: 800, lineHeight: 1 }}>
                ${(projectedTotal / 1000000).toFixed(1)}M
              </p>
              <p className="text-green-600 text-center mt-1.5" style={{ fontSize: "0.75rem", fontWeight: 500 }}>
                ≈ ${monthlyRetirementIncome.toLocaleString()}/mo
              </p>
            </div>

            {/* Monthly Impact - moved here */}
            <div className="bg-gradient-to-br from-blue-50/50 to-transparent rounded-xl p-4 space-y-2.5 border border-blue-100/50">
              <p className="text-foreground text-center" style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Monthly Impact
              </p>
              
              <div className="space-y-2">
                {/* You contribute */}
                <div>
                  <p className="text-muted-foreground text-center" style={{ fontSize: "0.7rem" }}>
                    You contribute
                  </p>
                  <p className="text-foreground text-center mt-0.5" style={{ fontSize: "1rem", fontWeight: 700 }}>
                    ${monthlyContribution.toLocaleString()}
                  </p>
                </div>
                
                {/* Employer adds */}
                <div className="bg-green-50 rounded-lg p-2 border border-green-200/50">
                  <p className="text-green-700 text-center" style={{ fontSize: "0.7rem", fontWeight: 600 }}>
                    Employer adds
                  </p>
                  <p className="text-green-700 text-center mt-0.5" style={{ fontSize: "1rem", fontWeight: 700 }}>
                    +${monthlyMatch.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Chart */}
          <div className="h-64 bg-gradient-to-br from-blue-50/30 to-transparent rounded-xl p-3 border border-blue-100/50">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projectionData}>
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id={`${gradientId}-market`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid key="grid" strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.4} vertical={false} />
                <XAxis 
                  key="xaxis"
                  dataKey="year" 
                  tick={{ fontSize: 10, fill: '#64748b', fontWeight: 500 }} 
                  tickLine={false} 
                  axisLine={{ stroke: '#cbd5e1' }}
                  interval={4}
                  dy={5}
                />
                <YAxis 
                  key="yaxis"
                  tick={{ fontSize: 10, fill: '#64748b', fontWeight: 500 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `$${(val / 1000000).toFixed(1)}M`}
                  dx={-5}
                />
                <Tooltip
                  key="tooltip"
                  formatter={(val: number, name: string) => {
                    if (name === "value") return [`$${val.toLocaleString()}`, "Total Savings"];
                    if (name === "contributions") return [`$${val.toLocaleString()}`, "Your Contributions"];
                    if (name === "marketGain") return [`$${val.toLocaleString()}`, "Market Gains"];
                    return [val, name];
                  }}
                  contentStyle={{ 
                    borderRadius: 12, 
                    fontSize: 11, 
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    fontWeight: 500
                  }}
                />
                <ReferenceLine 
                  key="refline"
                  y={projectedTotal * 0.75} 
                  stroke="#10b981" 
                  strokeDasharray="5 5" 
                  strokeWidth={2}
                  label={{ value: 'Target Goal', position: 'insideTopRight', fill: '#059669', fontSize: 10, fontWeight: 600 }}
                />
                <Area 
                  key="area-contributions"
                  type="monotone" 
                  dataKey="contributions" 
                  stroke="#64748b" 
                  fill="transparent"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
                <Area 
                  key="area-market"
                  type="monotone" 
                  dataKey="marketGain" 
                  stroke="#10b981" 
                  fill={`url(#${gradientId}-market)`}
                  strokeWidth={2}
                  stackId="1"
                />
                <Area 
                  key="area-total"
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  fill={`url(#${gradientId})`} 
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          {/* Chart Legend */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-blue-600"></div>
              <p className="text-muted-foreground" style={{ fontSize: "0.7rem" }}>Total Savings</p>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-green-600"></div>
              <p className="text-muted-foreground" style={{ fontSize: "0.7rem" }}>Market Gains</p>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-slate-500" style={{ borderTop: "2px dashed #64748b" }}></div>
              <p className="text-muted-foreground" style={{ fontSize: "0.7rem" }}>Your Contributions</p>
            </div>
          </div>
          
          {/* Disclaimer */}
          <div className="flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-muted-foreground" style={{ fontSize: "0.7rem", lineHeight: 1.5 }}>
              Projection assumes 7% annual return. Actual results may vary. Monthly income uses 4% withdrawal rule.
            </p>
          </div>

          {/* Comparison Toggle */}
          <div className="bg-secondary/30 rounded-xl p-4 space-y-3 border border-border/50">
            <div className="flex items-center justify-between">
              <p className="text-foreground" style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Compare Scenarios
              </p>
              <button
                onClick={() => setCompareMode(!compareMode)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  compareMode 
                    ? "bg-blue-600 text-white shadow-md" 
                    : "bg-card border border-border text-foreground hover:bg-accent"
                }`}
                style={{ fontSize: "0.7rem", fontWeight: 600 }}
              >
                {compareMode ? "Hide" : "Show"}
              </button>
            </div>
            
            {compareMode && (
              <div className="space-y-3 pt-2 border-t border-border/50">
                <div className="flex gap-2">
                  {[10, 12, 15].map((val) => (
                    <button
                      key={val}
                      onClick={() => setComparePercent(val)}
                      className={`flex-1 px-3 py-2 rounded-lg transition-all ${
                        comparePercent === val
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-card border border-border text-foreground hover:bg-accent"
                      }`}
                      style={{ fontSize: "0.8rem", fontWeight: 600 }}
                    >
                      {val}%
                    </button>
                  ))}
                </div>
                
                <div className={`rounded-lg p-3 ${difference < 0 ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
                  <p className={difference < 0 ? 'text-red-800' : 'text-green-800'} style={{ fontSize: "0.85rem", fontWeight: 700 }}>
                    {difference >= 0 ? '+' : ''}${Math.abs(difference).toLocaleString()}
                  </p>
                  <p className={difference < 0 ? 'text-red-600' : 'text-green-600'} style={{ fontSize: "0.7rem" }}>
                    {difference >= 0 ? 'more' : 'less'} with {comparePercent}% vs {percent}%
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="sticky bottom-4 md:static space-y-3">
        <button
          onClick={handleNext}
          className="w-full bg-blue-600 text-white py-4 px-8 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg md:shadow-md"
          style={{ fontSize: "1.05rem", fontWeight: 600 }}
        >
          Save & Continue <ArrowRight className="w-5 h-5" />
        </button>
        <p className="text-center text-muted-foreground" style={{ fontSize: "0.85rem" }}>
          You can adjust anytime
        </p>
      </div>
    </div>
  );
}