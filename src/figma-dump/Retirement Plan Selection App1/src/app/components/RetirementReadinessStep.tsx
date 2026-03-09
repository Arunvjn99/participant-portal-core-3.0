import { useState } from "react";
import { motion } from "motion/react";
import { 
  Sparkles, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
  Target,
  Zap,
  Info,
  ArrowUp
} from "lucide-react";
import { Button } from "./ui/button";
import svgPaths from "../../imports/svg-128mxuwk0j";

interface RetirementReadinessStepProps {
  currentContribution: number;
  salary: number;
  userAge: number;
  onNext: () => void;
}

export function RetirementReadinessStep({ 
  currentContribution, 
  salary, 
  userAge,
  onNext 
}: RetirementReadinessStepProps) {
  const [selectedImprovements, setSelectedImprovements] = useState<string[]>([]);

  // Calculate current values
  const annualContribution = (salary * currentContribution) / 100;
  const employerMatch = (salary * 3) / 100;
  const yearsToRetirement = 65 - userAge;
  const projectedValue = Math.round(
    (annualContribution + employerMatch) * yearsToRetirement * Math.pow(1.07, yearsToRetirement / 2)
  );
  const currentScore = Math.min(Math.round((projectedValue / 4000000) * 100), 100);

  // Improvement scenarios
  const improvements = [
    {
      id: "contribution",
      icon: DollarSign,
      title: "Increase Contributions by 3%",
      description: "Raising your contribution rate could add significant growth to your retirement savings over time due to compound interest.",
      impact: "+$180K",
      impactLabel: "Projected",
      scoreIncrease: 12,
      impactType: "High Impact"
    },
    {
      id: "autoIncrease",
      icon: TrendingUp,
      title: "Enable Auto-Increase (1% annually)",
      description: "Gradual annual increases help you save more without feeling the impact all at once on your monthly budget.",
      impact: "+$95K",
      impactLabel: "Projected",
      scoreIncrease: 6,
      impactType: "Medium Impact"
    },
    {
      id: "employerMatch",
      icon: ShieldCheck,
      title: "Maximize Employer Match",
      description: "Don't leave free money on the table—capture the full employer match available to you immediately.",
      impact: "+$120K",
      impactLabel: "Projected",
      scoreIncrease: 8,
      impactType: "Medium Impact"
    }
  ];

  // Calculate potential new score
  const potentialScore = Math.min(currentScore + improvements.reduce((sum, imp) => sum + imp.scoreIncrease, 0), 100);

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-4 sm:py-8">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12">
        {/* AI-Powered Analysis Badge */}
        

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0f172b] mb-2 sm:mb-4">
          Your Retirement Readiness Score
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-lg lg:text-xl font-medium bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent px-4">
          Your personalized score based on contributions, timeline, and projected market performance.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[410px_1fr] gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Left Card - Readiness Score */}
        <div className="bg-white border border-[#f1f5f9] rounded-2xl shadow-sm p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-[#0f172b] text-center mb-4 sm:mb-6">
            Readiness Score
          </h2>

          {/* Score Visualization */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto mb-4 sm:mb-6">
            {/* Gradient Glow Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-sky-50 to-cyan-100 rounded-full blur-2xl opacity-40 animate-pulse" />
            
            {/* Outer Ring - Decorative */}
            <motion.div 
              className="absolute inset-4 rounded-full border-2 border-blue-200/30"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
            />

            {/* Main Chart Container */}
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Background Circle */}
              <svg className="absolute inset-8 w-[calc(100%-4rem)] h-[calc(100%-4rem)] -rotate-90">
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="50%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#0EA5E9" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                
                {/* Background track */}
                <circle
                  cx="50%"
                  cy="50%"
                  r="90"
                  fill="none"
                  stroke="#DBEAFE"
                  strokeWidth="20"
                  opacity="0.3"
                />
                
                {/* Animated Progress Circle */}
                <motion.circle
                  cx="50%"
                  cy="50%"
                  r="90"
                  fill="none"
                  stroke="url(#progressGradient)"
                  strokeWidth="20"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 90}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 90 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 90 * (1 - currentScore / 100) }}
                  transition={{ duration: 2, ease: "easeInOut", delay: 0.3 }}
                  filter="url(#glow)"
                />
              </svg>

              {/* Animated Sparkles */}
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                <Sparkles className="absolute top-8 right-12 w-4 h-4 sm:w-5 sm:h-5 text-blue-400 animate-pulse" />
                <Sparkles className="absolute bottom-12 left-10 w-3 h-3 sm:w-4 sm:h-4 text-cyan-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
                <Sparkles className="absolute top-16 left-16 w-2.5 h-2.5 sm:w-3 sm:h-3 text-sky-400 animate-pulse" style={{ animationDelay: '1s' }} />
              </motion.div>

              {/* Pulsing Dot at Progress End */}
              <motion.div
                className="absolute"
                style={{
                  top: '50%',
                  left: '50%',
                  marginTop: '-8px',
                  marginLeft: '-8px',
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  rotate: -90 + (currentScore * 3.6)
                }}
                transition={{ delay: 1.8, duration: 0.5, type: "spring" }}
              >
                <div className="relative" style={{ transform: 'translate(0, -90px)' }}>
                  <motion.div
                    className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full shadow-lg shadow-blue-500/50"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <div className="absolute inset-0 w-4 h-4 sm:w-5 sm:h-5 bg-blue-400 rounded-full animate-ping opacity-75" />
                </div>
              </motion.div>

              {/* Score Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                  className="text-5xl sm:text-7xl font-black bg-gradient-to-br from-blue-700 via-sky-600 to-cyan-600 bg-clip-text text-transparent mb-1"
                >
                  {currentScore}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="mt-2 text-xs font-medium text-blue-500/60 tracking-wider"
                >
                  out of 100
                </motion.div>
              </div>
            </div>
          </div>

          {/* Status Badge - Below Chart */}
          <div className="flex justify-center mb-4 sm:mb-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-full"
            >
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">Needs Attention</span>
            </motion.div>
          </div>

          {/* Understanding Your Score Section */}
          <div className="bg-[#f8fafc] rounded-lg p-3 mb-3">
            <div className="flex items-start gap-2 mb-1.5">
              <Info className="w-4 h-4 text-[#0ea5e9] mt-0.5 flex-shrink-0" />
              <h3 className="text-base sm:text-lg font-semibold text-[#0f172b]">Understanding Your Score</h3>
            </div>
            <p className="text-xs sm:text-sm text-[#45556c] leading-snug">
              Your score of {currentScore} is based on contributions, timeline, and projected growth—there's room to improve.
            </p>
          </div>

          {/* Ask AI Button */}
          

          {/* Funding Plan Report */}
          <motion.div 
            className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-[#bfdbfe] rounded-xl p-3 sm:p-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <h3 className="text-sm sm:text-base font-bold text-[#0f172b] mb-3">Annual Funding Summary</h3>
            
            <div className="space-y-2.5">
              {/* Expected */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#64748b] rounded-full flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium text-[#475569]">Retirement Income Goal</span>
                </div>
                <span className="text-sm sm:text-base font-bold text-[#0f172b]">${(projectedValue * 0.03).toLocaleString()}</span>
              </div>
              
              {/* All Income */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex gap-[3px]">
                    <div className="w-3 h-3 bg-[#3b82f6] rounded-full flex-shrink-0" />
                    
                    
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-[#475569]">Current Annual Contributions</span>
                </div>
                <span className="text-sm sm:text-base font-bold text-[#0ea5e9]">${annualContribution.toLocaleString()}</span>
              </div>
              
              <div className="h-px bg-[#cbd5e1]" />
              
              {/* Shortfall */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#ef4444] rounded-full flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium text-[#475569]">Annual Savings Gap</span>
                </div>
                <span className="text-sm sm:text-base font-bold text-[#dc2626]">${Math.max(0, projectedValue * 0.03 - annualContribution).toLocaleString()}</span>
              </div>
            </div>

            {/* Info Note */}
            <div className="mt-3 pt-3 border-t border-[#cbd5e1]">
              <p className="text-xs text-[#64748b] leading-relaxed">
                This shows the gap between your retirement income goal and current annual contributions. Close this gap by increasing contributions or adjusting your retirement timeline.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right Section */}
        <div className="space-y-4 sm:space-y-6">
          {/* Not Ready for Retirement Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 border-2 border-red-200 rounded-2xl shadow-sm p-4 sm:p-6"
          >
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-7 h-7 sm:w-8 sm:h-8 text-white" strokeWidth={2.5} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg sm:text-xl font-bold text-[#0f172b]">
                    You're Not Ready Yet
                  </h3>
                  <span className="inline-flex items-center px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                    Action Required
                  </span>
                </div>
                
                <p className="text-sm sm:text-base text-[#64748b] mb-4 leading-relaxed">
                  You're not on track for your desired retirement. Small changes now can make a big difference.
                </p>

                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-red-200">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div>
                      <div className="text-xs text-[#64748b] mb-1">Current Gap</div>
                      <div className="text-xl sm:text-2xl font-black text-red-600">
                        ${Math.round((projectedValue * 0.03 - annualContribution) / 1000)}K
                      </div>
                      <div className="text-xs text-[#64748b]">per year short</div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-[#64748b] mb-1">Time Left</div>
                      <div className="text-xl sm:text-2xl font-black text-orange-600">
                        {yearsToRetirement}
                      </div>
                      <div className="text-xs text-[#64748b]">years to retire</div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-[#64748b] mb-1">Readiness</div>
                      <div className="text-xl sm:text-2xl font-black text-amber-600">
                        {currentScore}%
                      </div>
                      <div className="text-xs text-[#64748b]">of target goal</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <Zap className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs sm:text-sm text-amber-900 font-medium">
                    <strong>Act now:</strong> Follow the recommendations below to close your gap.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* User Snapshot Card */}
          

          {/* AI Recommendations Card */}
          <div className="bg-white border border-[#f1f5f9] rounded-2xl shadow-sm">
            {/* Header */}
            <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-[#f1f5f9]">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 20 20">
                    <g clipPath="url(#clip0_108_1862)">
                      <path d={svgPaths.p12331400} stroke="#0EA5E9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                      <path d="M16.6667 1.66667V5" stroke="#0EA5E9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                      <path d="M18.3333 3.33333H15" stroke="#0EA5E9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                      <path d={svgPaths.p3d506d00} stroke="#0EA5E9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                    </g>
                  </svg>
                  <h2 className="text-lg sm:text-xl font-bold text-[#0f172b]">AI Recommendations</h2>
                </div>
                <span className="text-xs sm:text-sm text-[#62748e]">3 actions available</span>
              </div>
              <p className="text-xs sm:text-sm text-[#45556c]">
                Applying all recommendations could boost your score to <span className="font-semibold text-[#0ea5e9]">{potentialScore}</span>
              </p>
            </div>

            {/* Recommendations List */}
            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              {improvements.map((improvement, index) => {
                const Icon = improvement.icon;
                const isHighImpact = improvement.impactType === "High Impact";

                return (
                  <div
                    key={improvement.id}
                    className="border border-[#f1f5f9] rounded-xl p-3 sm:p-4 hover:border-[#e2e8f0] hover:shadow-sm transition-all"
                  >
                    <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                      {/* Icon */}
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#eff6ff] rounded-full flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#0ea5e9]" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Title and Badges */}
                        <div className="flex items-start gap-2 mb-2 flex-wrap">
                          <h3 className="text-base sm:text-lg font-semibold text-[#0f172b]">
                            {improvement.title}
                          </h3>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#dbeafe] text-[#0369a1] rounded text-xs font-medium">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12">
                              <path d={svgPaths.p92e2d80} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M6 4V2H4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M1 7H2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M10 7H11" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M7.5 6.5V7.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M4.5 6.5V7.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            AI
                          </span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            isHighImpact
                              ? 'bg-[#ffe2e2] text-[#c10007]'
                              : 'bg-[#fff4e5] text-[#c76700]'
                          }`}>
                            {improvement.impactType}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-xs sm:text-sm text-[#45556c] mb-3 leading-relaxed">
                          {improvement.description}
                        </p>

                        {/* Metrics */}
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                          <div className="flex items-center gap-1 text-[#00a63e] font-medium">
                            <ArrowUp className="w-3 h-3 sm:w-4 sm:h-4" />
                            {improvement.impact} {improvement.impactLabel}
                          </div>
                          <div className="flex items-center gap-1 text-[#0ea5e9] font-medium">
                            <Target className="w-3 h-3 sm:w-4 sm:h-4" />
                            +{improvement.scoreIncrease} pts Score
                          </div>
                        </div>
                      </div>

                      {/* Apply Button */}
                      <Button
                        size="sm"
                        className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-4 sm:px-6 py-2 rounded-lg font-medium flex-shrink-0 w-full sm:w-auto text-sm"
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-end">
        <Button
          onClick={onNext}
          size="lg"
          className="w-full sm:w-auto px-6 sm:px-10 py-4 sm:py-5 text-sm sm:text-base font-bold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg rounded-xl"
        >
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

// Helper function to generate projection data
function generateProjectionData(
  currentContribution: number, 
  newContribution: number, 
  salary: number, 
  years: number,
  autoIncrease: boolean = false,
  returnRate: number = 0.07
) {
  const data = [];
  let currentValue = 0;
  let improvedValue = 0;
  
  for (let year = 0; year <= Math.min(years, 30); year += 5) {
    const currentAnnual = (salary * currentContribution) / 100;
    const improvedAnnual = (salary * (newContribution + (autoIncrease ? year * 0.01 : 0))) / 100;
    
    currentValue = currentAnnual * year * Math.pow(1 + 0.07, year / 2);
    improvedValue = improvedAnnual * year * Math.pow(1 + returnRate, year / 2);
    
    data.push({
      year,
      current: Math.round(currentValue),
      improved: Math.round(improvedValue)
    });
  }
  
  return data;
}