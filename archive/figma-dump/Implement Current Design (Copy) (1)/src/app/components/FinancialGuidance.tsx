import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { TrendingUp, DollarSign, Calendar, AlertTriangle } from "lucide-react";

export function FinancialGuidance() {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Financial Guidance
      </h2>

      <div className="space-y-6">
        {/* Retirement Impact Panel */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-3">
                Retirement Impact Overview
              </h3>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Available Loan</p>
                  <p className="text-lg font-semibold text-gray-900">$10,000</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Monthly Repayment</p>
                  <p className="text-lg font-semibold text-gray-900">$96</p>
                  <p className="text-xs text-gray-500">per paycheck</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Projected Balance</p>
                  <p className="text-lg font-semibold text-gray-900">$420,000</p>
                  <p className="text-xs text-gray-500">at retirement</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900 mb-1">
                Consider Your Options
              </h4>
              <p className="text-sm text-gray-700">
                Taking a loan may reduce your retirement savings by up to $8,200. 
                Consider other options if possible before withdrawing from your retirement account.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
            <DollarSign className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900 mb-1">
                Maximize Your Contributions
              </h4>
              <p className="text-sm text-gray-700">
                You're contributing 5% of your salary. Consider increasing to 6% 
                to receive your full employer match of $1,800 annually.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900 mb-1">
                Quarterly Rebalancing
              </h4>
              <p className="text-sm text-gray-700">
                Your portfolio hasn't been rebalanced in 6 months. Consider reviewing 
                your investment allocation to maintain your target risk profile.
              </p>
              <Button variant="link" className="px-0 h-auto mt-2 text-blue-700">
                Review Portfolio →
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
