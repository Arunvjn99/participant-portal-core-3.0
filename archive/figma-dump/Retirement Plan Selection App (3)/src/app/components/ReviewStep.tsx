import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Edit, 
  TrendingUp, 
  DollarSign, 
  ShieldCheck,
  AlertCircle,
  ChevronRight,
  Percent,
  Target,
  PiggyBank,
  Sparkles,
  PartyPopper,
  CheckCircle2
} from "lucide-react";
import { Button } from "./ui/button";

interface ReviewStepProps {
  selectedPlan: string;
  currentContribution: number;
  salary: number;
  userAge: number;
  onEdit: (step: number) => void;
}

export function ReviewStep({ 
  selectedPlan, 
  currentContribution, 
  salary, 
  userAge,
  onEdit 
}: ReviewStepProps) {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Calculate values
  const annualContribution = (salary * currentContribution) / 100;
  const employerMatch = (salary * 3) / 100;
  const yearsToRetirement = 65 - userAge;
  const projectedValue = Math.round(
    (annualContribution + employerMatch) * yearsToRetirement * Math.pow(1.07, yearsToRetirement / 2)
  );
  const currentScore = Math.min(Math.round((projectedValue / 4000000) * 100), 100);

  // Fund allocation data
  const fundAllocations = [
    { name: "S&P 500 Index", allocation: 48.2, color: "#3B82F6" },
    { name: "Bond Market", allocation: 30.0, color: "#10B981" },
    { name: "International", allocation: 20.0, color: "#F59E0B" },
    { name: "Real Estate", allocation: 10.0, color: "#EC4899" },
  ];

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-4 sm:py-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-4 sm:mb-6"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0f172b] mb-2">
          You're Almost Done! 🎉
        </h1>
        <p className="text-xs sm:text-sm text-[#64748b] mb-4 sm:mb-6">
          Review your enrollment summary and confirm to complete your retirement plan setup.
        </p>
        
        {/* Plan Overview Card */}
        <div className="bg-white rounded-2xl border-2 border-blue-200 shadow-lg overflow-hidden">
          {/* Header Strip */}
          <div className="bg-gradient-to-r from-blue-100 via-cyan-50 to-indigo-100 px-4 sm:px-6 py-2.5 border-b border-blue-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <div className="text-[9px] sm:text-[10px] text-blue-700 font-semibold uppercase tracking-wide">Your Plan</div>
                  <div className="text-base sm:text-lg font-bold text-[#0f172b]">{selectedPlan}</div>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-[9px] sm:text-[10px] text-blue-700 font-semibold uppercase tracking-wide">Retirement Age</div>
                <div className="text-base sm:text-lg font-bold text-[#0f172b]">65</div>
              </div>
            </div>
          </div>

          {/* Main Content - Flow Design */}
          <div className="p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 lg:gap-6">
              {/* Annual Contribution */}
              <div className="flex-1">
                <div className="bg-white rounded-2xl p-3 sm:p-4 border-2 border-blue-100 relative">
                  <div className="absolute -top-2.5 left-4 sm:left-6 bg-purple-600 text-white text-[9px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    Annual Contribution
                  </div>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1">
                      <div className="text-[9px] sm:text-[10px] text-purple-600 font-bold uppercase tracking-wide mb-0.5">Per Year</div>
                      <div className="text-2xl sm:text-3xl font-black text-[#0f172b]">
                        ${(annualContribution + employerMatch).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-[9px] text-purple-600 font-bold uppercase tracking-wide mb-0.5">You</div>
                      <div className="text-sm sm:text-base font-bold text-[#0f172b]">${Math.round(annualContribution).toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-purple-600 font-bold uppercase tracking-wide mb-0.5">Employer</div>
                      <div className="text-sm sm:text-base font-bold text-emerald-600">${Math.round(employerMatch).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Growth Connector */}
              <div className="flex lg:flex-col flex-row items-center gap-2 lg:gap-1.5 flex-shrink-0 px-3 justify-center lg:justify-start">
                <div className="w-16 lg:w-16 h-0.5 bg-gradient-to-r from-purple-300 via-gray-300 to-emerald-300" />
                <div className="text-[10px] font-bold text-[#64748b] uppercase tracking-wide whitespace-nowrap">Growth</div>
                <div className="text-[10px] font-semibold text-emerald-600 whitespace-nowrap">~7% APY</div>
                <div className="w-16 lg:w-16 h-0.5 bg-gradient-to-r from-purple-300 via-gray-300 to-emerald-300" />
              </div>

              {/* Projected Value */}
              <div className="flex-1">
                <div className="bg-emerald-50/50 rounded-2xl p-3 sm:p-4 border-2 border-emerald-200 relative">
                  <div className="absolute -top-2.5 left-4 sm:left-6 bg-emerald-600 text-white text-[9px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    Projected Value
                  </div>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1">
                      <div className="text-[9px] sm:text-[10px] text-emerald-700 font-bold uppercase tracking-wide mb-0.5">At Age 65</div>
                      <div className="text-2xl sm:text-3xl font-black text-[#0f172b]">
                        ${projectedValue.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <div className="text-[9px] sm:text-[10px] text-emerald-700 font-bold uppercase tracking-wide">
                        {yearsToRetirement} Years to Grow
                      </div>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-emerald-200/50">
                    <p className="text-[9px] text-[#64748b] leading-relaxed">
                      <span className="font-bold text-amber-700">Note:</span> Estimates based on 7% annual growth. Actual results vary with market conditions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
        {/* Retirement Readiness Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white border border-[#e2e8f0] rounded-xl p-4 sm:p-5"
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-xs sm:text-sm font-bold text-[#0f172b]">
              Retirement Readiness
            </h2>
            <button
              onClick={() => onEdit(4)}
              className="text-[#0ea5e9] hover:text-[#0284c7] text-xs font-medium flex items-center gap-1 transition-colors"
            >
              <Edit className="w-3 h-3" />
              Edit
            </button>
          </div>

          {/* Circular Score */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0">
              <svg className="w-full h-full -rotate-90">
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="50%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#0EA5E9" />
                  </linearGradient>
                </defs>
                
                {/* Background circle */}
                <circle
                  cx="50%"
                  cy="50%"
                  r="56"
                  fill="none"
                  stroke="#DBEAFE"
                  strokeWidth="12"
                  opacity="0.3"
                />
                
                {/* Progress circle */}
                <motion.circle
                  cx="50%"
                  cy="50%"
                  r="56"
                  fill="none"
                  stroke="url(#scoreGradient)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 56 * (1 - currentScore / 100) }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                />
              </svg>
              
              {/* Score Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="text-3xl sm:text-4xl font-black bg-gradient-to-br from-blue-700 via-sky-600 to-cyan-600 bg-clip-text text-transparent"
                >
                  {currentScore}
                </motion.div>
                <div className="text-[10px] font-medium text-blue-500/60">out of 100</div>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 w-full">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-full mb-2 sm:mb-3">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wide">Needs Attention</span>
              </div>
              
              <p className="text-xs text-[#64748b] leading-relaxed mb-3">
                Your score is based on contributions, timeline, and projected growth. Consider increasing your contribution rate.
              </p>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#64748b]">Years to Retirement</span>
                  <span className="font-bold text-[#0f172b]">{yearsToRetirement} years</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#64748b]">Projected Value</span>
                  <span className="font-bold text-[#0f172b]">${projectedValue.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Insight for Score Improvement */}
          
        </motion.div>

        {/* Contributions Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="bg-white border border-[#e2e8f0] rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Percent className="w-5 h-5 text-purple-600" />
              <h2 className="text-sm font-bold text-[#0f172b]">
                Your Contributions
              </h2>
            </div>
            <button
              onClick={() => onEdit(1)}
              className="text-[#0ea5e9] hover:text-[#0284c7] text-xs font-medium flex items-center gap-1 transition-colors"
            >
              <Edit className="w-3 h-3" />
              Edit
            </button>
          </div>

          {/* Main Contribution Display */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 mb-4 border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-[#64748b] mb-1">Total Rate</div>
                <div className="text-4xl font-black text-[#0f172b]">{currentContribution}%</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-[#64748b] mb-1">Per Year</div>
                <div className="text-xl font-bold text-[#0f172b]">
                  ${(annualContribution + employerMatch).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#64748b]">Your Contribution</span>
              <span className="font-bold text-[#0f172b]">{currentContribution}% • ${Math.round(annualContribution).toLocaleString()}/yr</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#64748b]">Employer Match</span>
              <span className="font-bold text-emerald-600">3% • ${Math.round(employerMatch).toLocaleString()}/yr</span>
            </div>
          </div>

          {/* AI Insight for Contribution Optimization */}
          
        </motion.div>
      </div>

      {/* AI-Powered Comprehensive Insight Card */}
      

      {/* Auto-Increase and Investment Allocation - Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Auto-Increase Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white border border-[#e2e8f0] rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-600" />
              <h2 className="text-sm font-bold text-[#0f172b]">
                Auto-Increase (ADI)
              </h2>
            </div>
            <button
              onClick={() => onEdit(2)}
              className="text-[#0ea5e9] hover:text-[#0284c7] text-xs font-medium flex items-center gap-1 transition-colors"
            >
              <Edit className="w-3 h-3" />
              Edit
            </button>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-200 mb-3">
            <div className="grid grid-cols-2 gap-6 pb-5 mb-5 border-b border-amber-200/50">
              <div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-black text-[#0f172b]">+1%</span>
                  <span className="text-base text-[#64748b]">per year</span>
                </div>
                <div className="text-xs font-semibold text-[#64748b] uppercase tracking-wide">
                  Annual Increase
                </div>
              </div>
              <div className="border-l border-amber-300 pl-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-black text-[#0f172b]">15%</span>
                  <span className="text-base text-[#64748b]">cap</span>
                </div>
                <div className="text-xs font-semibold text-[#64748b] uppercase tracking-wide">
                  Maximum Limit
                </div>
              </div>
            </div>
            
            {/* Progress Section */}
            <div>
              <div className="flex items-center justify-between mb-2 text-sm">
                <span className="text-[#64748b]">Starting at {currentContribution}%</span>
                <span className="text-[#64748b]">Reaching 15% in {15 - currentContribution} years</span>
              </div>
              <div className="relative h-2 bg-amber-200 rounded-full overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentContribution / 15) * 100}%` }}
                  transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Investment Allocation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="bg-white border border-[#e2e8f0] rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <PiggyBank className="w-4 h-4 text-indigo-600" />
              <h2 className="text-xs font-bold text-[#0f172b] uppercase tracking-wide">
                Asset Class Distribution
              </h2>
            </div>
            <button
              onClick={() => onEdit(3)}
              className="text-[#0ea5e9] hover:text-[#0284c7] text-xs font-medium flex items-center gap-1 transition-colors"
            >
              <Edit className="w-3 h-3" />
              Edit
            </button>
          </div>

          {/* Asset Class Progress Bars */}
          <div className="space-y-4">
            {/* Stocks */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-bold text-[#0f172b]">Stocks</span>
                <span className="text-xl font-black text-[#3B82F6]">68.2%</span>
              </div>
              <div className="relative h-3 bg-blue-100/50 rounded-full overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-[#3B82F6] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "68.2%" }}
                  transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Bonds */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-bold text-[#0f172b]">Bonds</span>
                <span className="text-xl font-black text-[#60A5FA]">30%</span>
              </div>
              <div className="relative h-3 bg-blue-100/50 rounded-full overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-[#60A5FA] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "30%" }}
                  transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Real Estate */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-bold text-[#0f172b]">Real Estate</span>
                <span className="text-xl font-black text-[#2563EB]">10%</span>
              </div>
              <div className="relative h-3 bg-blue-100/50 rounded-full overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-[#2563EB] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "10%" }}
                  transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Terms and Confirm */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="space-y-4"
      >
        {/* Terms Checkbox */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-4">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-[#0ea5e9] border-gray-300 rounded focus:ring-[#0ea5e9]"
            />
            <label htmlFor="terms" className="text-sm text-[#475569] leading-relaxed cursor-pointer">
              <span className="font-semibold text-[#0f172b]">I agree to the terms and conditions.</span> By continuing, you agree to comply with federal retirement plan regulations. Investments involve market risk, and you may lose value.
            </label>
          </div>
        </div>

        {/* Confirm Button */}
        <div className="flex justify-end">
          <Button
            className={`px-10 py-6 text-base font-bold transition-all ${
              agreedToTerms
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            disabled={!agreedToTerms}
            onClick={() => setShowSuccessModal(true)}
          >
            Confirm Enrollment
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </motion.div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            onClick={() => setShowSuccessModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500" />
              
              {/* Confetti Animation */}
              <div className="absolute top-10 left-10">
                <motion.div
                  initial={{ scale: 0, rotate: 0 }}
                  animate={{ 
                    scale: [0, 1.2, 1],
                    rotate: [0, 180, 360],
                    y: [0, -20, 0]
                  }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <Sparkles className="w-6 h-6 text-amber-400" />
                </motion.div>
              </div>
              
              <div className="absolute top-10 right-10">
                <motion.div
                  initial={{ scale: 0, rotate: 0 }}
                  animate={{ 
                    scale: [0, 1.2, 1],
                    rotate: [0, -180, -360],
                    y: [0, -20, 0]
                  }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <PartyPopper className="w-6 h-6 text-purple-400" />
                </motion.div>
              </div>

              {/* Success Icon */}
              <div className="flex justify-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 200,
                    damping: 10,
                    delay: 0.2 
                  }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full blur-xl opacity-50" />
                  <div className="relative bg-gradient-to-br from-emerald-400 to-green-500 rounded-full p-6">
                    <CheckCircle2 className="w-16 h-16 text-white" strokeWidth={2.5} />
                  </div>
                </motion.div>
              </div>

              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center mb-3"
              >
                <h2 className="text-3xl font-black text-[#0f172b] mb-2">
                  🎉 Congratulations!
                </h2>
                <p className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Enrollment Successful
                </p>
              </motion.div>

              {/* Message */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-6"
              >
                <p className="text-sm text-[#64748b] text-center leading-relaxed mb-4">
                  Your <span className="font-bold text-[#0f172b]">{selectedPlan}</span> retirement plan has been successfully set up! Your contributions will begin with your next paycheck.
                </p>
                
                {/* Next Steps Card */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
                  <h3 className="text-xs font-bold text-[#0f172b] uppercase tracking-wide mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-600" />
                    What Happens Next
                  </h3>
                  <ul className="space-y-2 text-xs text-[#64748b]">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                      <span>You'll receive a confirmation email within 24 hours</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 flex-shrink-0" />
                      <span>Your first contribution starts next pay period</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                      <span>Track your progress anytime in your account dashboard</span>
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full py-6 text-base font-bold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all"
                >
                  Got It!
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}