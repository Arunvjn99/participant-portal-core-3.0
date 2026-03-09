import { Button } from "./ui/button";
import { ProjectedBalanceCard } from "./ProjectedBalanceCard";
import { RetirementReadinessCard } from "./RetirementReadinessCard";
import { AccountOverviewCard } from "./AccountOverviewCard";
import { GoalSimulatorCard } from "./GoalSimulatorCard";
import { LearningHubCard } from "./LearningHubCard";
import { QuickActionsCard } from "./QuickActionsCard";
import { motion } from "motion/react";
import {
  Download,
  Mail,
  Calendar,
  PieChart,
  Bell,
  Info,
  Sparkles,
  Edit2
} from "lucide-react";

interface PostEnrollmentDashboardProps {
  selectedPlan: string;
  currentContribution: number;
  salary: number;
  userAge: number;
  investmentStrategy?: string;
  autoIncreaseEnabled?: boolean;
  autoIncreaseRate?: number;
  userName?: string;
}

export function PostEnrollmentDashboard({ 
  selectedPlan, 
  currentContribution, 
  salary, 
  userAge,
  investmentStrategy = "Moderate",
  autoIncreaseEnabled = true,
  autoIncreaseRate = 1,
  userName = "Sarah"
}: PostEnrollmentDashboardProps) {
  const yearsToRetirement = 65 - userAge;
  const annualContribution = (salary * currentContribution) / 100;
  const monthlyContribution = annualContribution / 12;
  const estimatedBalance = Math.round(
    annualContribution * yearsToRetirement * Math.pow(1.07, yearsToRetirement / 2)
  );
  const confirmationNumber = `RET-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Projected Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
        >
          <ProjectedBalanceCard 
            totalBalance={3470868}
            netFlow={1286}
            monthImpact={18500}
          />
        </motion.div>

        {/* Retirement Readiness Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-8"
        >
          <RetirementReadinessCard 
            score={11}
            yearsToRetirement={yearsToRetirement}
            projectedValue={434969}
          />
        </motion.div>

        {/* Account Overview Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65 }}
        >
          <AccountOverviewCard
            planName="TechVantage 401(k) Retirement Plan"
            accountBalance={234992}
            ytdChange={12500}
            ytdPercentage={80}
            vestedBalance={207992}
            rolloverEligible={207992}
            availableCash={-187192}
          />
        </motion.div>

        {/* Goal Simulator Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <GoalSimulatorCard
            goalPercentage={90}
            retirementAge={65}
            monthlyContribution={1050}
            retirementGoal={2256000}
          />
        </motion.div>

        {/* Learning Hub Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.75 }}
        >
          <LearningHubCard />
        </motion.div>

        {/* Quick Actions Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <QuickActionsCard />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Enrollment Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Retirement Readiness</h2>
                <button className="flex items-center gap-2 text-[#0043AA] hover:text-blue-700 font-semibold transition-colors">
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
              </div>

              <div className="flex items-start gap-8">
                {/* Left side - Circular Score Gauge */}
                <div className="flex-shrink-0">
                  <div className="relative w-48 h-48">
                    {/* Background circle */}
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                      {/* Background ring */}
                      <circle
                        cx="100"
                        cy="100"
                        r="85"
                        stroke="#E5E7EB"
                        strokeWidth="12"
                        fill="none"
                      />
                      {/* Blue progress segments */}
                      {[0, 1, 2, 3].map((segment) => {
                        const startAngle = segment * 90;
                        const endAngle = startAngle + 80; // 80 degrees for each segment with 10 degree gap
                        const isActive = segment < Math.ceil((11 / 100) * 4);
                        
                        const startRad = (startAngle * Math.PI) / 180;
                        const endRad = (endAngle * Math.PI) / 180;
                        
                        const x1 = 100 + 85 * Math.cos(startRad);
                        const y1 = 100 + 85 * Math.sin(startRad);
                        const x2 = 100 + 85 * Math.cos(endRad);
                        const y2 = 100 + 85 * Math.sin(endRad);
                        
                        return (
                          <path
                            key={segment}
                            d={`M ${x1} ${y1} A 85 85 0 0 1 ${x2} ${y2}`}
                            stroke={isActive ? "#3B82F6" : "#E5E7EB"}
                            strokeWidth="12"
                            fill="none"
                            strokeLinecap="round"
                          />
                        );
                      })}
                    </svg>
                    {/* Score text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-6xl font-bold text-[#3B82F6]">11</div>
                      <div className="text-sm text-gray-500 mt-1">out of 100</div>
                    </div>
                  </div>
                </div>

                {/* Right side - Status and Details */}
                <div className="flex-1 space-y-6">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-400 bg-amber-50 mb-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span className="text-xs font-bold uppercase tracking-wide text-amber-700">
                        NEEDS ATTENTION
                      </span>
                    </div>

                    <p className="text-gray-600 leading-relaxed">
                      Your score is based on contributions, timeline, and projected growth. Consider increasing your contribution rate.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-6 pt-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-2">Years to Retirement</div>
                      <div className="text-2xl font-bold text-gray-900">{yearsToRetirement} years</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-2">Projected Value</div>
                      <div className="text-2xl font-bold text-gray-900">${(434969).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Next Steps Timeline */}
            

            {/* Resources */}
            
          </div>

          {/* Right Column - Actions & Support */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sticky top-6"
            >
              <div className="flex items-center gap-2 mb-5">
                <Sparkles className="w-5 h-5 text-[#0043AA]" />
                <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
              </div>

              <div className="space-y-3">
                <Button className="w-full bg-gradient-to-r from-[#0043AA] to-blue-600 hover:from-[#0043AA]/90 hover:to-blue-600/90 text-white shadow-lg">
                  <Download className="w-4 h-4 mr-2" />
                  Download Confirmation
                </Button>

                <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-50">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Summary
                </Button>

                <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-50">
                  <Calendar className="w-4 h-4 mr-2" />
                  Add to Calendar
                </Button>

                <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-50">
                  <PieChart className="w-4 h-4 mr-2" />
                  View Investment Mix
                </Button>
              </div>

              {/* Notifications */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <Bell className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-700">
                    <span className="font-semibold">Stay updated:</span> We'll send you email notifications about your account activity.
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Support */}
            

            {/* Important Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-gray-900">Important Reminder</h3>
              </div>

              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#0043AA] rounded-full mt-2 flex-shrink-0" />
                  <div>Keep your beneficiary information up to date</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#0043AA] rounded-full mt-2 flex-shrink-0" />
                  <div>Review your investment mix annually</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#0043AA] rounded-full mt-2 flex-shrink-0" />
                  <div>Consider increasing contributions as your salary grows</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer CTA */}
        
      </div>
    </div>
  );
}