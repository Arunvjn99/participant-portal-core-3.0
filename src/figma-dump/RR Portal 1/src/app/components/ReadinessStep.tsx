import { useState } from "react";
import { 
  TrendingUp, 
  DollarSign, 
  Target, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Clock, 
  PieChart, 
  Shield, 
  Info,
  ArrowUpRight,
  Award,
  Zap,
  TrendingDown
} from "lucide-react";
import { motion } from "motion/react";
import { AskAIButton } from "./AskAIButton";

interface ReadinessStepProps {
  selectedPlan: string;
  currentContribution: number;
  salary: number;
  userAge: number;
  investmentStrategy?: string;
}

export function ReadinessStep({ 
  selectedPlan, 
  currentContribution, 
  salary, 
  userAge,
  investmentStrategy = "Moderate"
}: ReadinessStepProps) {
  const yearsToRetirement = 65 - userAge;
  const annualContribution = (salary * currentContribution) / 100;
  
  // Calculate readiness score (0-100)
  const calculateReadinessScore = () => {
    let score = 0;
    
    // Contribution rate (max 40 points)
    if (currentContribution >= 15) score += 40;
    else if (currentContribution >= 10) score += 30;
    else if (currentContribution >= 6) score += 20;
    else score += 10;
    
    // Time to retirement (max 30 points)
    if (yearsToRetirement >= 30) score += 30;
    else if (yearsToRetirement >= 20) score += 25;
    else if (yearsToRetirement >= 10) score += 15;
    else score += 5;
    
    // Plan selection (max 15 points)
    if (selectedPlan.includes("401(k)")) score += 15;
    else score += 10;
    
    // Investment strategy (max 15 points)
    score += 15;
    
    return Math.min(score, 100);
  };
  
  const readinessScore = calculateReadinessScore();
  
  // Determine readiness level
  const getReadinessLevel = () => {
    if (readinessScore >= 80) return { label: "Excellent", color: "emerald", icon: Award };
    if (readinessScore >= 60) return { label: "Good", color: "blue", icon: CheckCircle2 };
    if (readinessScore >= 40) return { label: "Fair", color: "amber", icon: AlertTriangle };
    return { label: "Needs Improvement", color: "red", icon: TrendingDown };
  };
  
  const readinessLevel = getReadinessLevel();
  const ReadinessIcon = readinessLevel.icon;
  
  // Estimated retirement balance (simplified)
  const estimatedBalance = Math.round(
    annualContribution * yearsToRetirement * Math.pow(1.07, yearsToRetirement / 2)
  );
  
  // Strengths and improvements
  const strengths = [];
  const improvements = [];
  
  if (currentContribution >= 10) {
    strengths.push({
      icon: DollarSign,
      title: "Strong Contribution Rate",
      description: `Contributing ${currentContribution}% is above the recommended 10% minimum`
    });
  } else {
    improvements.push({
      icon: DollarSign,
      title: "Increase Contributions",
      description: `Consider increasing from ${currentContribution}% to at least 10%`,
      impact: "Could boost retirement savings by 40%+"
    });
  }
  
  if (yearsToRetirement >= 20) {
    strengths.push({
      icon: Clock,
      title: "Time on Your Side",
      description: `${yearsToRetirement} years until retirement gives your investments time to grow`
    });
  } else if (yearsToRetirement < 10) {
    improvements.push({
      icon: Clock,
      title: "Limited Time Horizon",
      description: "Consider maximizing contributions in remaining years",
      impact: "Every year counts significantly now"
    });
  }
  
  if (selectedPlan.includes("Roth") || selectedPlan.includes("401(k)")) {
    strengths.push({
      icon: Shield,
      title: "Tax-Advantaged Account",
      description: `${selectedPlan} provides excellent tax benefits for retirement`
    });
  }
  
  strengths.push({
    icon: PieChart,
    title: "Diversified Strategy",
    description: `${investmentStrategy} investment approach matches your timeline`
  });
  
  // If no improvements, add a suggestion
  if (improvements.length === 0) {
    improvements.push({
      icon: Zap,
      title: "Maximize Employer Match",
      description: "Ensure you're getting the full employer match benefit",
      impact: "Free money to accelerate your savings"
    });
  }

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
            Retirement Readiness Check
          </h2>
          <p className="text-gray-600 text-lg">
            Let's review your retirement plan preparedness and ensure you're on track
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Readiness Score & Details */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Readiness Score Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Your Readiness Score</h3>
                <p className="text-sm text-gray-600">Based on your current elections and timeline</p>
              </div>
              <AskAIButton />
            </div>

            {/* Score Visualization */}
            <div className="relative mb-6">
              <div className="flex items-center justify-center">
                <div className="relative">
                  {/* Circular Progress */}
                  <svg className="transform -rotate-90" width="200" height="200">
                    {/* Background circle */}
                    <circle
                      cx="100"
                      cy="100"
                      r="85"
                      stroke="#e5e7eb"
                      strokeWidth="12"
                      fill="none"
                    />
                    {/* Progress circle */}
                    <motion.circle
                      cx="100"
                      cy="100"
                      r="85"
                      stroke={`url(#gradient-${readinessLevel.color})`}
                      strokeWidth="12"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 85}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 85 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 85 * (1 - readinessScore / 100) }}
                      transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
                    />
                    {/* Gradient definitions */}
                    <defs>
                      <linearGradient id="gradient-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop key="emerald-stop-1" offset="0%" stopColor="#10b981" />
                        <stop key="emerald-stop-2" offset="100%" stopColor="#059669" />
                      </linearGradient>
                      <linearGradient id="gradient-blue" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop key="blue-stop-1" offset="0%" stopColor="#3b82f6" />
                        <stop key="blue-stop-2" offset="100%" stopColor="#2563eb" />
                      </linearGradient>
                      <linearGradient id="gradient-amber" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop key="amber-stop-1" offset="0%" stopColor="#f59e0b" />
                        <stop key="amber-stop-2" offset="100%" stopColor="#d97706" />
                      </linearGradient>
                      <linearGradient id="gradient-red" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop key="red-stop-1" offset="0%" stopColor="#ef4444" />
                        <stop key="red-stop-2" offset="100%" stopColor="#dc2626" />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  {/* Center content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.5, type: "spring" }}
                      className={`w-14 h-14 bg-gradient-to-br from-${readinessLevel.color}-500 to-${readinessLevel.color}-600 rounded-full flex items-center justify-center mb-2 shadow-lg`}
                    >
                      <ReadinessIcon className="w-7 h-7 text-white" />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.7 }}
                      className="text-center"
                    >
                      <div className="text-4xl font-black text-gray-900">{readinessScore}</div>
                      <div className="text-xs font-semibold text-gray-500">out of 100</div>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Readiness Level Badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="flex justify-center mt-4"
              >
                <div className={`px-6 py-2 bg-gradient-to-r from-${readinessLevel.color}-50 to-${readinessLevel.color}-100 border-2 border-${readinessLevel.color}-200 rounded-full`}>
                  <span className={`text-sm font-bold text-${readinessLevel.color}-700`}>
                    {readinessLevel.label} Readiness
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.0 }}
                className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{currentContribution}%</div>
                <div className="text-xs text-gray-600">Contribution Rate</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.1 }}
                className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{yearsToRetirement}</div>
                <div className="text-xs text-gray-600">Years to Retire</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="text-xl font-bold text-gray-900 mb-1">${Math.round(estimatedBalance / 1000)}K</div>
                <div className="text-xs text-gray-600">Est. at Retirement</div>
              </motion.div>
            </div>
          </div>

          {/* What You're Doing Well */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.3 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6"
          >
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-200">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">What You're Doing Well</h3>
                <p className="text-xs text-gray-600">Strengths in your retirement plan</p>
              </div>
            </div>

            <div className="space-y-4">
              {strengths.map((strength, index) => {
                const StrengthIcon = strength.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
                    className="flex items-start gap-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200"
                  >
                    <div className="w-9 h-9 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <StrengthIcon className="w-4.5 h-4.5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-sm mb-1">{strength.title}</h4>
                      <p className="text-xs text-gray-700 leading-relaxed">{strength.description}</p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Areas to Improve */}
          {improvements.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.6 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6"
            >
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-200">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Opportunities to Improve</h3>
                  <p className="text-xs text-gray-600">Actions to strengthen your plan</p>
                </div>
              </div>

              <div className="space-y-4">
                {improvements.map((improvement, index) => {
                  const ImprovementIcon = improvement.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 1.7 + index * 0.1 }}
                      className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <ImprovementIcon className="w-4.5 h-4.5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-sm mb-1">{improvement.title}</h4>
                          <p className="text-xs text-gray-700 leading-relaxed mb-2">{improvement.description}</p>
                        </div>
                      </div>
                      {improvement.impact && (
                        <div className="flex items-center gap-2 ml-12 p-2 bg-white rounded-lg border border-amber-200">
                          <ArrowUpRight className="w-4 h-4 text-amber-600" />
                          <span className="text-xs font-semibold text-amber-700">Impact: {improvement.impact}</span>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Right Column - Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          {/* Your Selections Summary */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-5 sticky top-6">
            <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-gray-200">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Your Selections</h3>
                <p className="text-xs text-gray-500">Quick summary</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Selected Plan */}
              <div>
                <div className="text-xs font-semibold text-gray-500 mb-2">Retirement Plan</div>
                <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                  <div className="font-bold text-gray-900 text-sm">{selectedPlan}</div>
                </div>
              </div>

              {/* Contribution */}
              <div>
                <div className="text-xs font-semibold text-gray-500 mb-2">Contribution Rate</div>
                <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900">{currentContribution}%</span>
                    <span className="text-xs text-gray-600">of salary</span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    ${annualContribution.toLocaleString()}/year
                  </div>
                </div>
              </div>

              {/* Investment Strategy */}
              <div>
                <div className="text-xs font-semibold text-gray-500 mb-2">Investment Strategy</div>
                <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                  <div className="font-bold text-gray-900 text-sm">{investmentStrategy}</div>
                  <div className="text-xs text-gray-600 mt-1">Risk-appropriate allocation</div>
                </div>
              </div>

              {/* Auto Increase */}
              <div>
                <div className="text-xs font-semibold text-gray-500 mb-2">Auto-Increase</div>
                <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600" />
                    <span className="font-bold text-gray-900 text-sm">Enabled</span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">1% annual increase</div>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-5 pt-4 border-t border-gray-200">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-gray-500 leading-relaxed">
                  This readiness assessment is based on general retirement planning guidelines. Individual circumstances may vary.
                </p>
              </div>
            </div>
          </div>

          {/* Next Steps CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.9 }}
            className="relative bg-gradient-to-r from-[#0043AA] to-blue-600 rounded-xl p-5 shadow-lg border-2 border-blue-400/30 overflow-hidden group hover:shadow-xl transition-all duration-300"
          >
            {/* Animated background shimmer */}
            <motion.div
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2,
                ease: "easeInOut",
              }}
              className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
            />
            
            {/* Decorative orbs */}
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-blue-400/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-indigo-400/20 rounded-full blur-xl" />
            
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-bold text-white text-base">Ready to Proceed?</h4>
              </div>
              <p className="text-sm text-blue-100 leading-relaxed">
                Your retirement plan looks great! Continue to review all your selections before final submission.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
