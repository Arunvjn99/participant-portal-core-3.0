import { useState } from "react";
import { TrendingUp, Zap, Calendar, Target, ArrowUpRight, Info, Pause, Play, RotateCcw, Sparkles, ChevronDown, ShieldCheck, ArrowRight, X, Rocket, BadgeDollarSign, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "motion/react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Line, LineChart } from "recharts";

// Last updated: 2026-03-03

interface AutoIncreaseStepProps {
  currentContribution: number;
  salary: number;
  selectedPlan: string;
}

const frequencies = [
  { id: "annually", label: "Annually", description: "Once per year", months: 12 },
  { id: "semi-annually", label: "Semi-Annually", description: "Every 6 months", months: 6 },
  { id: "quarterly", label: "Quarterly", description: "Every 3 months", months: 3 },
];

const increasePresets = [
  { value: 1, label: "1%", description: "Conservative", color: "blue" },
  { value: 2, label: "2%", description: "Recommended", color: "emerald" },
  { value: 3, label: "3%", description: "Aggressive", color: "purple" },
];

// Education screen shown first
function EducationScreen({
  currentContribution,
  salary,
  onEnable,
  onSkip,
}: {
  currentContribution: number;
  salary: number;
  onEnable: () => void;
  onSkip: () => void;
}) {
  const yearsToProject = 10;
  const annualReturn = 0.07;
  const employerMatchRate = 6;
  const autoIncreaseRate = 2;
  const maxCap = 15;

  const comparisonData = [];
  let flatBalance = 0;
  let autoBalance = 0;
  let flatPct = currentContribution;
  let autoPct = currentContribution;

  for (let year = 0; year <= yearsToProject; year++) {
    comparisonData.push({
      year: year === 0 ? "Now" : `Yr ${year}`,
      withoutAutoIncrease: Math.round(flatBalance),
      withAutoIncrease: Math.round(autoBalance),
    });

    const flatContrib = (salary * flatPct) / 100;
    const flatMatch = Math.min((salary * employerMatchRate) / 100, flatContrib);
    flatBalance = (flatBalance + flatContrib + flatMatch) * (1 + annualReturn);

    const autoContrib = (salary * autoPct) / 100;
    const autoMatch = Math.min((salary * employerMatchRate) / 100, autoContrib);
    autoBalance = (autoBalance + autoContrib + autoMatch) * (1 + annualReturn);

    autoPct = Math.min(autoPct + autoIncreaseRate, maxCap);
  }

  const finalFlat = Math.round(flatBalance);
  const finalAuto = Math.round(autoBalance);
  const difference = finalAuto - finalFlat;
  const monthlyImpact = Math.round((salary * 2) / 100 / 12);

  // Prepare chart data for each card
  const withoutAutoData = comparisonData.map((d) => ({
    year: d.year,
    value: d.withoutAutoIncrease,
  }));

  const withAutoData = comparisonData.map((d) => ({
    year: d.year,
    value: d.withAutoIncrease,
  }));

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-5"
      >
        <div className="relative">
          <div className="absolute -left-4 top-0 w-1 h-12 bg-gradient-to-b from-[#096] to-[#2b7fff] rounded-full" />
          <h2 className="text-[30px] font-bold text-[#101828] mb-2 leading-[36px]">
            Auto Increase Your Savings
          </h2>
          <p className="text-[#4a5565] text-base">
            Small automatic increases add up to big results over time
          </p>
        </div>
      </motion.div>

      {/* AI Insight */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-4"
      >
        <div className="bg-gradient-to-r from-[#eef2ff] via-[#faf5ff] to-[#eff6ff] border border-[#c6d2ff] rounded-[10px] p-[17px]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-[#615fff] to-[#ad46ff] rounded-[10px] flex items-center justify-center flex-shrink-0 shadow-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm text-[#364153] leading-relaxed">
              <span className="font-bold text-[#432dd7]">AI Insight</span> - Small automatic increases today can add up to <span className="font-bold text-[#312c85]">+${difference.toLocaleString()}</span> in just {yearsToProject} years — helping you enjoy a more comfortable retirement.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main Comparison Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xl mb-4"
      >
        {/* Two comparison sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Without Auto Increase */}
          <div className="text-center bg-[rgba(249,250,251,0.5)] rounded-2xl p-5 border border-[rgba(229,231,235,0.5)] relative">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 border border-[#e5e7eb]">
              <TrendingUp className="w-6 h-6 text-[#99a1af]" />
            </div>
            <h3 className="text-lg font-bold text-[#101828] mb-2 leading-7">Keep it Steady</h3>
            <div className="text-xs uppercase tracking-[0.3px] text-[#6a7282] mb-2 font-semibold">Without Auto Increase</div>
            <div className="text-4xl font-bold text-[#364153] mb-1.5 leading-10">${finalFlat.toLocaleString()}</div>
            <div className="text-sm text-[#6a7282] mb-4 leading-5">Stay at {currentContribution}% for {yearsToProject} years</div>
            
            <Button
              size="sm"
              onClick={onSkip}
              variant="outline"
              className="w-full h-11 border-2 border-[#d1d5dc] text-[#364153] hover:bg-gray-100 hover:border-gray-400 font-semibold rounded-lg"
            >
              Skip for Now
            </Button>
          </div>

          {/* With Auto Increase */}
          <div className="text-center relative bg-gradient-to-br from-[rgba(236,253,245,0.6)] to-[rgba(239,246,255,0.4)] rounded-2xl p-5 border border-[rgba(164,244,207,0.5)]">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-[#00bc7d] text-white text-xs font-bold rounded-full shadow-md h-6 flex items-center">
              RECOMMENDED
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-[#d0fae5] to-[#dbeafe] rounded-2xl flex items-center justify-center mx-auto mb-3 border border-[#a4f4cf]">
              <Rocket className="w-6 h-6 text-[#096]" />
            </div>
            <h3 className="text-lg font-bold text-[#004f3b] mb-2 leading-7">Grow Gradually</h3>
            <div className="text-xs uppercase tracking-[0.3px] text-[#007a55] mb-2 font-semibold">With Auto Increase</div>
            <div className="text-4xl font-bold text-[#096] mb-1.5 leading-10">${finalAuto.toLocaleString()}</div>
            <div className="text-sm text-[#4a5565] mb-4 leading-5">Grow from {currentContribution}% to {maxCap}%</div>
            
            <Button
              size="sm"
              onClick={onEnable}
              className="w-full h-[58px] bg-[#096] hover:bg-[#007a55] text-white shadow-sm rounded-[10px] transition-colors flex flex-col items-center justify-center gap-0.5"
            >
              <span className="text-sm font-semibold leading-5">Enable Auto Increase</span>
              <span className="text-xs font-normal text-[#d0fae5] leading-4">Yes, Increase My Contributions</span>
            </Button>
          </div>
        </div>

        {/* Difference Highlight */}
        <div className="relative bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-50 rounded-2xl p-6 mb-6 overflow-hidden border border-emerald-200/60">
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent" />
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-200/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-200/20 rounded-full blur-2xl" />
          
          <div className="relative">
            <div className="text-center">
              <div className="text-[#007a55] text-sm font-semibold mb-1.5">Strengthen Your Future with Automatic Increases</div>
              <div className="text-5xl font-black text-[#096] mb-1.5">
                +${difference.toLocaleString()}
              </div>
              <div className="text-[#4a5565] text-base">over {yearsToProject} years with Auto Increase</div>
            </div>
          </div>
        </div>

        {/* Benefit Pills */}
        <div className="flex gap-2.5 justify-center flex-wrap mb-4">
          <div className="flex items-center gap-2 px-[15px] py-2 bg-[rgba(236,253,245,0.5)] rounded-full border border-[#d0fae5] h-[38px]">
            <BadgeDollarSign className="w-4 h-4 text-[#00bc7d]" />
            <span className="text-sm font-medium text-[#007a55] leading-5">Only ${monthlyImpact}/mo more</span>
          </div>
          <div className="flex items-center gap-2 px-[15px] py-2 bg-[rgba(239,246,255,0.5)] rounded-full border border-[#dbeafe] h-[38px]">
            <ShieldCheck className="w-4 h-4 text-[#2b7fff]" />
            <span className="text-sm font-medium text-[#1447e6] leading-5">Pause anytime</span>
          </div>
          <div className="flex items-center gap-2 px-[15px] py-2 bg-[rgba(238,242,255,0.5)] rounded-full border border-[#e0e7ff] h-[38px]">
            <Clock className="w-4 h-4 text-[#615fff]" />
            <span className="text-sm font-medium text-[#432dd7] leading-5">Fully automatic</span>
          </div>
        </div>

        {/* Additional Info */}
        <p className="text-center text-sm text-[#6a7282] leading-5">
          You can always change this later in your plan settings
        </p>
      </motion.div>
    </div>
  );
}

// Configuration screen shown after user opts in
function ConfigurationScreen({
  currentContribution,
  salary,
  selectedPlan,
}: {
  currentContribution: number;
  salary: number;
  selectedPlan: string;
}) {
  const [increaseAmount, setIncreaseAmount] = useState(2);
  const [maxCap, setMaxCap] = useState(15);
  const [frequency, setFrequency] = useState("annually");
  const [startMonth, setStartMonth] = useState("january");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const contributionLimit = 25;
  const effectiveCap = Math.min(maxCap, contributionLimit);
  const selectedFrequency = frequencies.find(f => f.id === frequency) || frequencies[0];

  // Calculate retirement projection data comparing with/without auto increase
  const currentAge = 35; // Assume current age
  const retirementAge = 65;
  const yearsToRetirement = retirementAge - currentAge;
  const yearsToProject = 10; // Shorter timeframe for AI insights and chart
  const annualReturn = 0.07;
  const employerMatchRate = 6;

  const projectionData = [];
  let balanceWithAuto = 0;
  let balanceWithoutAuto = 0;
  let currentPctWithAuto = currentContribution;
  const increasesPerYear = 12 / selectedFrequency.months;

  // Generate 10-year projection data
  for (let year = 0; year <= yearsToProject; year++) {
    // Without auto increase - stays flat
    const flatContrib = (salary * currentContribution) / 100;
    const flatMatch = Math.min((salary * employerMatchRate) / 100, flatContrib);
    const flatTotal = flatContrib + flatMatch;
    
    if (year > 0) {
      balanceWithoutAuto = (balanceWithoutAuto + flatTotal) * (1 + annualReturn);
    } else {
      balanceWithoutAuto = flatTotal;
    }

    // With auto increase - grows over time
    const autoContrib = (salary * currentPctWithAuto) / 100;
    const autoMatch = Math.min((salary * employerMatchRate) / 100, autoContrib);
    const autoTotal = autoContrib + autoMatch;
    
    if (year > 0) {
      balanceWithAuto = (balanceWithAuto + autoTotal) * (1 + annualReturn);
    } else {
      balanceWithAuto = autoTotal;
    }

    projectionData.push({
      year: year === 0 ? "Now" : `Yr ${year}`,
      withoutAutoIncrease: Math.round(balanceWithoutAuto),
      withAutoIncrease: Math.round(balanceWithAuto),
      contributionRate: Math.round(currentPctWithAuto * 10) / 10,
    });

    currentPctWithAuto = Math.min(currentPctWithAuto + increaseAmount * increasesPerYear, effectiveCap);
  }

  const finalBalanceWithAuto = projectionData[projectionData.length - 1].withAutoIncrease;
  const finalBalanceWithoutAuto = projectionData[projectionData.length - 1].withoutAutoIncrease;
  const difference = finalBalanceWithAuto - finalBalanceWithoutAuto;
  const finalPercentage = projectionData[projectionData.length - 1].contributionRate;

  const yearsToReachCap = Math.ceil((effectiveCap - currentContribution) / (increaseAmount * increasesPerYear));

  // Calculate additional savings for AI insight
  const flatTotal = projectionData.reduce(() => Math.round((salary * currentContribution) / 100), 0) * (yearsToRetirement + 1);
  const autoTotal = projectionData.reduce((sum, d, idx) => {
    if (idx === 0) return 0;
    const pct = Math.min(currentContribution + (increaseAmount * increasesPerYear * idx), effectiveCap);
    return sum + Math.round((salary * pct) / 100);
  }, 0);
  const additionalSavings = autoTotal - flatTotal;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative">
          <div className="absolute -left-4 top-0 w-1 h-12 bg-gradient-to-b from-emerald-500 to-blue-600 rounded-full" />
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-bold text-gray-900">
              Configure Auto Increase
            </h2>
            <div className="px-3 py-1 bg-emerald-100 border border-emerald-300 rounded-full">
              <span className="text-xs font-bold text-emerald-700">ENABLED</span>
            </div>
          </div>
          <p className="text-gray-600">
            Customize how your {selectedPlan} contributions grow over time
          </p>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Controls */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Frequency Card */}
          <div className="bg-white rounded-2xl shadow border border-gray-200 p-4">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Select your auto-increase frequency</h3>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3">
              {frequencies.map((freq) => (
                <motion.button
                  key={freq.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFrequency(freq.id)}
                  className={`relative p-2 rounded-lg border-2 transition-all text-center ${
                    frequency === freq.id
                      ? "border-blue-500 bg-blue-50 shadow-md shadow-blue-100"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className={`text-sm font-bold mb-0.5 ${
                    frequency === freq.id ? "text-blue-600" : "text-gray-900"
                  }`}>
                    {freq.label}
                  </div>
                  <div className="text-xs text-gray-500">{freq.description}</div>
                  {frequency === freq.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>

            {/* AI Insight for Frequency */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-3"
            >
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-blue-900 text-xs mb-0.5">💡 AI Insight</h4>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    {frequency === "annually" && "Annual increases align with typical raise cycles, making it easier to adjust your budget once per year."}
                    {frequency === "semi-annually" && "Semi-annual increases help you reach your goals faster while still giving you time to adjust between increases."}
                    {frequency === "quarterly" && "Quarterly increases accelerate your savings growth, though changes happen more frequently."}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Increase Amount Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3">
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-7 h-7 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">How much you want to increase your contribution</h3>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="mb-2.5">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-600 font-medium">Quick:</label>
                  <div className="flex gap-1">
                    {increasePresets.map((preset) => (
                      <motion.button
                        key={preset.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIncreaseAmount(preset.value)}
                        className={`px-2 py-0.5 border transition-all duration-200 ${ increaseAmount === preset.value ? "border-emerald-500 bg-emerald-50" : "border-gray-300 bg-white hover:border-gray-400" } rounded-lg`}
                      >
                        <span className={`text-xs font-medium whitespace-nowrap ${
                          increaseAmount === preset.value ? "text-emerald-700" : "text-gray-700"
                        }`}>
                          {preset.label} {preset.description}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Custom Amount with Slider and Input */}
              
                
                <div className="flex items-center gap-3 mb-1.5">
                  <div className="flex-1">
                    <input
                      type="range"
                      min="0.5"
                      max="5"
                      step="0.5"
                      value={increaseAmount}
                      onChange={(e) => setIncreaseAmount(Number(e.target.value))}
                      className="w-full custom-slider cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #10b981 0%, #10b981 ${((increaseAmount - 0.5) / 4.5) * 100}%, #e5e7eb ${((increaseAmount - 0.5) / 4.5) * 100}%, #e5e7eb 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-0.5">
                      <span>0.5%</span>
                      <span>5%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1.5 bg-emerald-50 rounded-lg px-2.5 py-1.5 border border-emerald-200">
                    <input
                      type="number"
                      min="0.5"
                      max="5"
                      step="0.5"
                      value={increaseAmount}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (val >= 0.5 && val <= 5) {
                          setIncreaseAmount(val);
                        }
                      }}
                      className="w-10 text-lg font-black text-emerald-600 outline-none text-center bg-transparent"
                    />
                    <span className="text-sm font-bold text-emerald-600">%</span>
                  </div>
                </div>

                <div className="text-xs text-gray-600 text-center mb-2.5">
                  Your contribution will increase by <span className="font-bold text-emerald-600">{increaseAmount}%</span> each period
                </div>
              

              {/* AI Insight */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 border border-indigo-200 rounded-lg p-2.5"
              >
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-indigo-900 text-xs mb-0.5">💡 AI Insight</h4>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      A {increaseAmount <= 1.5 ? "conservative" : increaseAmount >= 2.5 ? "aggressive" : "balanced"} <span className="font-bold text-indigo-700">{increaseAmount}%</span> increase — most find 1-2% barely noticeable in their paycheck.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

          {/* Maximum Limit Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3">
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-7 h-7 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Set maximum contribution limit</h3>
                </div>
              </div>

              <div className="mb-2.5">
                <div className="flex items-center gap-3 mb-1.5">
                  <div className="flex-1">
                    <label className="text-xs text-gray-600 font-medium mb-1 block">Stop auto-increase at:</label>
                    <input
                      type="range"
                      min={currentContribution + 1}
                      max={contributionLimit}
                      step="1"
                      value={maxCap}
                      onChange={(e) => setMaxCap(Number(e.target.value))}
                      className="w-full custom-slider cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #9333ea 0%, #9333ea ${((maxCap - currentContribution - 1) / (contributionLimit - currentContribution - 1)) * 100}%, #e5e7eb ${((maxCap - currentContribution - 1) / (contributionLimit - currentContribution - 1)) * 100}%, #e5e7eb 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-0.5">
                      <span>{currentContribution + 1}%</span>
                      <span>{contributionLimit}% (IRS Max)</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1.5 bg-purple-50 rounded-lg px-2.5 py-1.5 border border-purple-200">
                    <input
                      type="number"
                      min={currentContribution + 1}
                      max={contributionLimit}
                      value={maxCap}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (val >= currentContribution + 1 && val <= contributionLimit) {
                          setMaxCap(val);
                        }
                      }}
                      className="w-10 text-lg font-black text-purple-600 outline-none text-center bg-transparent"
                    />
                    <span className="text-sm font-bold text-purple-600">%</span>
                  </div>
                </div>

                <div className="text-xs text-gray-600 text-center mt-1.5">
                  Auto increases will stop at <span className="font-bold text-purple-600">{maxCap}%</span>
                </div>
              </div>

              {/* AI Insight */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 border border-purple-200 rounded-lg p-2.5"
              >
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-purple-900 text-xs mb-0.5">💡 AI Insight</h4>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      Your contributions will stay at {maxCap}% once reached. You'll be notified when you hit this limit and can adjust manually anytime.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

          {/* Advanced Settings */}
          

          {/* AI Insight */}
          
        </motion.div>

        {/* Right Column - Projection & Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          {/* 10-Year Growth Projection */}
          <div className="bg-white rounded-2xl shadow border border-gray-200 p-5">
            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-cyan-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Retirement Projection</h3>
                <p className="text-xs text-gray-500">Retirement savings comparison</p>
              </div>
            </div>

            {/* Area Chart */}
            <div className="mb-4">
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={projectionData}>
                  <defs>
                    <linearGradient id="areaWithAuto" x1="0" y1="0" x2="0" y2="1">
                      <stop key="auto-start" offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop key="auto-end" offset="100%" stopColor="#10b981" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="areaWithoutAuto" x1="0" y1="0" x2="0" y2="1">
                      <stop key="no-auto-start" offset="0%" stopColor="#6b7280" stopOpacity={0.3} />
                      <stop key="no-auto-end" offset="100%" stopColor="#6b7280" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="year" 
                    tick={{ fontSize: 11, fill: "#6b7280" }} 
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: "#6b7280" }} 
                    tickLine={false} 
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} 
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px" }}
                    formatter={(value: number, name: string) => [
                      `$${value.toLocaleString()}`, 
                      name === "withAutoIncrease" ? "With Auto Increase" : "Without Auto Increase"
                    ]}
                    labelStyle={{ fontWeight: "bold", marginBottom: "4px" }}
                  />
                  <Area 
                    key="without-auto-area"
                    type="monotone" 
                    dataKey="withoutAutoIncrease" 
                    stroke="#6b7280" 
                    strokeWidth={2}
                    fill="url(#areaWithoutAuto)"
                    name="withoutAutoIncrease"
                  />
                  <Area 
                    key="with-auto-area"
                    type="monotone" 
                    dataKey="withAutoIncrease" 
                    stroke="#10b981" 
                    strokeWidth={2.5}
                    fill="url(#areaWithAuto)"
                    name="withAutoIncrease"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                <span className="text-xs text-gray-600">Without Auto Increase</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-xs text-gray-600">With Auto Increase</span>
              </div>
            </div>

            {/* Comparison Cards */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* Without Auto Increase */}
              <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                  <span className="text-xs font-bold text-gray-700 uppercase">Without</span>
                </div>
                <div className="text-lg font-bold text-gray-900 mb-0.5">
                  ${finalBalanceWithoutAuto.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">Stay at {currentContribution}%</div>
              </div>

              {/* With Auto Increase */}
              <div className="bg-emerald-50 border-2 border-emerald-400 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-xs font-bold text-emerald-700 uppercase">With Auto</span>
                </div>
                <div className="text-lg font-bold text-emerald-600 mb-0.5">
                  ${finalBalanceWithAuto.toLocaleString()}
                </div>
                <div className="text-xs text-emerald-600">Grow to {finalPercentage}%</div>
              </div>
            </div>

            {/* Extra Savings Banner */}
            <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 rounded-xl p-4 mb-4 relative overflow-hidden">
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <div className="text-white/90 text-xs font-semibold mb-1">Extra Savings</div>
                  <div className="text-white text-3xl font-black">
                    +${difference.toLocaleString()}
                  </div>
                </div>
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <ArrowUpRight className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="absolute inset-0 bg-sky-200/70"></div>
            </div>

            {/* Disclaimer */}
            <div className="bg-amber-50/50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    <span className="font-semibold text-amber-900">Projection Disclaimer:</span> These projections are estimates based on assumed 7% annual returns and current contribution settings. Actual results may vary based on market performance, salary changes, and investment choices. Past performance does not guarantee future results.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Impact Summary Card */}
          
        </motion.div>
      </div>
    </div>
  );
}

// Main component with two phases
export function AutoIncreaseStep({ currentContribution, salary, selectedPlan }: AutoIncreaseStepProps) {
  const [phase, setPhase] = useState<"education" | "configure" | "skipped">("education");

  return (
    <AnimatePresence mode="wait">
      {phase === "education" && (
        <motion.div
          key="education"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.35 }}
        >
          <EducationScreen
            currentContribution={currentContribution}
            salary={salary}
            onEnable={() => setPhase("configure")}
            onSkip={() => setPhase("skipped")}
          />
        </motion.div>
      )}

      {phase === "configure" && (
        <motion.div
          key="configure"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ConfigurationScreen
            currentContribution={currentContribution}
            salary={salary}
            selectedPlan={selectedPlan}
          />
        </motion.div>
      )}

      {phase === "skipped" && (
        <motion.div
          key="skipped"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="relative">
            <div className="absolute -left-4 top-0 w-1 h-12 bg-gradient-to-b from-gray-400 to-gray-500 rounded-full" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Auto Increase Skipped
            </h2>
            <p className="text-gray-600">
              Your contributions will remain at {currentContribution}% unless you manually adjust them
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow border border-gray-200 p-8 text-center max-w-xl mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Pause className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Auto Increase Configured</h3>
            <p className="text-gray-600 mb-4 text-sm">
              Your {selectedPlan} contribution rate will stay at {currentContribution}%. You can always enable auto increase later from your plan settings.
            </p>
            
            {/* Warning about lost savings */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <X className="w-5 h-5 text-red-600" />
                </div>
                <p className="text-sm font-bold text-red-900">Potential Missed Savings</p>
              </div>
              <p className="text-sm text-red-700">
                By skipping, you will be losing{" "}
                <span className="font-black text-red-600">
                  ${(() => {
                    const yearsToProject = 10;
                    const annualReturn = 0.07;
                    const employerMatchRate = 6;
                    const autoIncreaseRate = 2;
                    const maxCap = 15;
                    
                    let flatBalance = 0;
                    let autoBalance = 0;
                    let flatPct = currentContribution;
                    let autoPct = currentContribution;
                    
                    for (let year = 0; year <= yearsToProject; year++) {
                      const flatContrib = (salary * flatPct) / 100;
                      const flatMatch = Math.min((salary * employerMatchRate) / 100, flatContrib);
                      flatBalance = (flatBalance + flatContrib + flatMatch) * (1 + annualReturn);
                      
                      const autoContrib = (salary * autoPct) / 100;
                      const autoMatch = Math.min((salary * employerMatchRate) / 100, autoContrib);
                      autoBalance = (autoBalance + autoContrib + autoMatch) * (1 + annualReturn);
                      
                      autoPct = Math.min(autoPct + autoIncreaseRate, maxCap);
                    }
                    
                    return (Math.round(autoBalance) - Math.round(flatBalance)).toLocaleString();
                  })()}
                </span>{" "}
                in potential retirement savings over 10 years.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                onClick={() => setPhase("education")}
                className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white"
              >
                <Play className="w-4 h-4 mr-2" />
                Reconsider Auto Increase
              </Button>
              <p className="text-xs text-gray-400">Click Continue to proceed without it</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}