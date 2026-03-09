import { Target } from "lucide-react";

interface GoalSimulatorCardProps {
  goalPercentage: number;
  retirementAge: number;
  monthlyContribution: number;
  retirementGoal: number;
}

export function GoalSimulatorCard({
  goalPercentage,
  retirementAge,
  monthlyContribution,
  retirementGoal
}: GoalSimulatorCardProps) {
  // Calculate circular progress
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (goalPercentage / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Goal Simulator</h3>
          <p className="text-sm text-gray-500 mt-1">Track your progress toward retirement</p>
        </div>
      </div>

      <div className="flex items-center gap-8">
        {/* Circular Progress */}
        <div className="flex-shrink-0">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="#E5E7EB"
                strokeWidth="8"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="#6366F1"
                strokeWidth="8"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-3xl font-bold text-indigo-600">{goalPercentage}%</div>
              <div className="text-xs text-gray-500">to goal</div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="flex-1 grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-500 mb-1">Retirement Age</div>
            <div className="text-xl font-bold text-gray-900">{retirementAge}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Monthly Contribution</div>
            <div className="text-xl font-bold text-gray-900">${monthlyContribution.toLocaleString()}</div>
          </div>
          <div className="col-span-2">
            <div className="text-sm text-gray-500 mb-1">Retirement Goal</div>
            <div className="text-2xl font-bold text-indigo-600">${retirementGoal.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}