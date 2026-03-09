import { 
  CheckCircle2, 
  Edit2, 
  DollarSign, 
  TrendingUp, 
  PieChart, 
  Shield, 
  Calendar,
  ArrowUpRight,
  Sparkles,
  FileText,
  Lock,
  Info,
  Building2,
  Percent,
  Target,
  Briefcase
} from "lucide-react";
import { motion } from "motion/react";
import { AskAIButton } from "./AskAIButton";
import { Button } from "./ui/button";
import { useState } from "react";

interface ReviewStepProps {
  selectedPlan: string;
  currentContribution: number;
  salary: number;
  userAge: number;
  investmentStrategy?: string;
  autoIncreaseEnabled?: boolean;
  autoIncreaseRate?: number;
  onEdit?: (step: number) => void;
  onAcknowledgmentChange?: (acknowledged: boolean) => void;
}

export function ReviewStep({ 
  selectedPlan, 
  currentContribution, 
  salary, 
  userAge,
  investmentStrategy = "Moderate",
  autoIncreaseEnabled = true,
  autoIncreaseRate = 1,
  onEdit,
  onAcknowledgmentChange
}: ReviewStepProps) {
  const yearsToRetirement = 65 - userAge;
  const annualContribution = (salary * currentContribution) / 100;
  const monthlyContribution = annualContribution / 12;
  
  // Estimated retirement balance (simplified)
  const estimatedBalance = Math.round(
    annualContribution * yearsToRetirement * Math.pow(1.07, yearsToRetirement / 2)
  );

  const handleEdit = (step: number) => {
    if (onEdit) {
      onEdit(step);
    }
  };

  // Review sections
  const reviewSections = [
    {
      step: 0,
      title: "Retirement Plan",
      icon: Shield,
      color: "blue",
      items: [
        { label: "Selected Plan", value: selectedPlan },
        { 
          label: "Plan Type", 
          value: selectedPlan.includes("Roth") 
            ? "After-tax contributions, tax-free withdrawals" 
            : "Pre-tax contributions, tax-deferred growth" 
        },
        { 
          label: "Tax Advantage", 
          value: selectedPlan.includes("Roth") 
            ? "Pay taxes now, withdraw tax-free in retirement" 
            : "Lower taxable income now, pay taxes in retirement" 
        }
      ]
    },
    {
      step: 1,
      title: "Contribution Settings",
      icon: DollarSign,
      color: "emerald",
      items: [
        { 
          label: "Contribution Rate", 
          value: `${currentContribution}% of salary`,
          highlight: true
        },
        { 
          label: "Annual Contribution", 
          value: `$${annualContribution.toLocaleString()}`,
          subValue: `$${monthlyContribution.toLocaleString()}/month`
        },
        { 
          label: "Current Salary", 
          value: `$${salary.toLocaleString()}/year` 
        }
      ]
    },
    {
      step: 2,
      title: "Auto-Increase",
      icon: TrendingUp,
      color: "amber",
      items: [
        { 
          label: "Status", 
          value: autoIncreaseEnabled ? "Enabled" : "Disabled",
          badge: autoIncreaseEnabled ? "active" : "inactive"
        },
        { 
          label: "Annual Increase", 
          value: autoIncreaseEnabled ? `${autoIncreaseRate}% per year` : "N/A" 
        },
        { 
          label: "Maximum Rate", 
          value: autoIncreaseEnabled ? "15%" : "N/A" 
        }
      ]
    },
    {
      step: 3,
      title: "Investment Strategy",
      icon: PieChart,
      color: "purple",
      items: [
        { 
          label: "Risk Profile", 
          value: investmentStrategy,
          highlight: true
        },
        { 
          label: "Investment Mix", 
          value: investmentStrategy === "Aggressive" 
            ? "90% Stocks, 10% Bonds" 
            : investmentStrategy === "Moderate" 
            ? "70% Stocks, 30% Bonds" 
            : "50% Stocks, 50% Bonds" 
        },
        { 
          label: "Rebalancing", 
          value: "Automatic quarterly" 
        }
      ]
    }
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
          <div className="absolute -left-4 top-0 w-1 h-14 bg-gradient-to-b from-emerald-600 to-teal-600 rounded-full" />
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Review Your Selections
          </h2>
          <p className="text-gray-600 text-lg">
            Please review your retirement plan configuration before submitting
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Review Sections */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="lg:col-span-2 space-y-5"
        >
          {reviewSections.map((section, sectionIndex) => {
            const SectionIcon = section.icon;
            return (
              <motion.div
                key={sectionIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + sectionIndex * 0.1 }}
                className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
              >
                {/* Section Header */}
                <div className={`bg-gradient-to-r from-${section.color}-50 to-${section.color}-100 border-b border-${section.color}-200 p-5 flex items-center justify-between`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 bg-gradient-to-br from-${section.color}-500 to-${section.color}-600 rounded-xl flex items-center justify-center shadow-lg`}>
                      <SectionIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{section.title}</h3>
                      <p className="text-xs text-gray-600">Step {sectionIndex + 1}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(section.step)}
                    className="text-gray-600 hover:text-gray-900 hover:bg-white/50"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>

                {/* Section Content */}
                <div className="p-5 space-y-4">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start justify-between py-2 border-b border-gray-100 last:border-0">
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-500 mb-1">{item.label}</div>
                        <div className="flex items-center gap-2">
                          {item.highlight && (
                            <div className={`w-1.5 h-1.5 bg-${section.color}-500 rounded-full`} />
                          )}
                          <div className="text-base font-bold text-gray-900">{item.value}</div>
                          {item.badge && (
                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                              item.badge === 'active' 
                                ? 'bg-emerald-100 text-emerald-700' 
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {item.badge === 'active' ? 'Active' : 'Inactive'}
                            </span>
                          )}
                        </div>
                        {item.subValue && (
                          <div className="text-xs text-gray-600 mt-1">{item.subValue}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}

          {/* Terms & Conditions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Important Information</h3>
                <p className="text-sm text-gray-600">Please review before submitting</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700">
                  <span className="font-semibold">Enrollment effective date:</span> Your elections will take effect on the next available pay period, typically within 1-2 pay cycles.
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl border border-amber-200">
                <Lock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700">
                  <span className="font-semibold">Changes & modifications:</span> You may change your contribution rate at any time. Investment changes can be made quarterly.
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <Shield className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700">
                  <span className="font-semibold">ERISA protection:</span> Your retirement account is protected under federal ERISA regulations and includes fiduciary oversight.
                </div>
              </div>
            </div>

            {/* Acknowledgment Checkbox */}
            <div className="mt-5 pt-5 border-t border-gray-200">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 rounded border-gray-300 text-[#0043AA] focus:ring-[#0043AA] mt-0.5 cursor-pointer"
                  onChange={(e) => onAcknowledgmentChange?.(e.target.checked)}
                />
                <span className="text-sm text-gray-700 leading-relaxed">
                  I acknowledge that I have reviewed my retirement plan selections and understand the terms and conditions. I authorize my employer to deduct the specified contribution amount from my paycheck.
                </span>
              </label>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column - Summary & Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          {/* Summary Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-5 sticky top-6">
            <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-gray-200">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Plan Summary</h3>
                <p className="text-xs text-gray-500">Your retirement at a glance</p>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="space-y-4 mb-5">
              {/* Monthly Contribution */}
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  <span className="text-xs font-semibold text-gray-600">Monthly Contribution</span>
                </div>
                <div className="text-3xl font-black text-gray-900">${monthlyContribution.toLocaleString()}</div>
                <div className="text-xs text-gray-600 mt-1">{currentContribution}% of monthly salary</div>
              </div>

              {/* Annual Contribution */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span className="text-xs font-semibold text-gray-600">Annual Contribution</span>
                </div>
                <div className="text-2xl font-black text-gray-900">${annualContribution.toLocaleString()}</div>
                <div className="text-xs text-gray-600 mt-1">per year</div>
              </div>

              {/* Projected Balance */}
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <span className="text-xs font-semibold text-gray-600">Projected Balance</span>
                </div>
                <div className="text-2xl font-black text-gray-900">${Math.round(estimatedBalance / 1000)}K</div>
                <div className="text-xs text-gray-600 mt-1">at age 65 (estimated)</div>
              </div>
            </div>

            {/* Quick Facts */}
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-gray-700">
                  <span className="font-semibold">{selectedPlan}</span> selected
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-gray-700">
                  <span className="font-semibold">{investmentStrategy}</span> investment strategy
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-gray-700">
                  Auto-increase <span className="font-semibold">{autoIncreaseEnabled ? 'enabled' : 'disabled'}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-gray-700">
                  <span className="font-semibold">{yearsToRetirement} years</span> until retirement
                </div>
              </div>
            </div>

            {/* AI Assistance */}
            <div className="mt-5 pt-4 border-t border-gray-200">
              <div className="text-xs text-gray-600 mb-3">Need help with your selections?</div>
              <AskAIButton />
            </div>
          </div>

          {/* Submit CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
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
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-bold text-white text-base">Ready to Submit?</h4>
              </div>
              <p className="text-sm text-blue-100 leading-relaxed mb-4">
                Your retirement plan is configured and ready to go. Click below to finalize your enrollment.
              </p>
              
              <Button 
                className="w-full bg-white text-[#0043AA] hover:bg-gray-50 font-bold shadow-lg"
                size="lg"
              >
                Submit Enrollment
                <ArrowUpRight className="w-5 h-5 ml-2" />
              </Button>
              
              <div className="mt-3 text-xs text-blue-200 text-center">
                You'll receive a confirmation email shortly
              </div>
            </div>
          </motion.div>

          {/* Help Card */}
          <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl p-5 border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-5 h-5 text-gray-600" />
              <h4 className="font-bold text-gray-900 text-sm">Need Assistance?</h4>
            </div>
            <p className="text-xs text-gray-600 mb-4 leading-relaxed">
              Contact our benefits team if you have questions about your retirement plan enrollment.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-700">
                <div className="w-1.5 h-1.5 bg-[#0043AA] rounded-full" />
                <span>Email: benefits@company.com</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-700">
                <div className="w-1.5 h-1.5 bg-[#0043AA] rounded-full" />
                <span>Phone: 1-800-BENEFITS</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-700">
                <div className="w-1.5 h-1.5 bg-[#0043AA] rounded-full" />
                <span>Hours: Mon-Fri, 8am-6pm EST</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}