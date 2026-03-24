import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { useState } from "react";

interface Transaction {
  id: string;
  type: string;
  amount: string;
  submittedDate: string;
  status: "Action Required" | "Processing" | "Completed";
  currentStep: "Submitted" | "Processing" | "Approved" | "Funds Sent";
  estimatedCompletion?: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "Loan Request",
    amount: "$5,000",
    status: "Action Required",
    submittedDate: "March 6, 2026",
    currentStep: "Submitted",
    estimatedCompletion: "Pending document upload",
  },
  {
    id: "2",
    type: "Hardship Withdrawal",
    amount: "$3,200",
    status: "Processing",
    submittedDate: "March 8, 2026",
    currentStep: "Processing",
    estimatedCompletion: "March 12, 2026",
  },
  {
    id: "3",
    type: "Investment Rebalance",
    amount: "—",
    status: "Processing",
    submittedDate: "March 9, 2026",
    currentStep: "Approved",
    estimatedCompletion: "Next trading day",
  },
];

const statusSteps = ["Submitted", "Processing", "Approved", "Funds Sent"];

export function ActiveTransactionsTimeline() {
  const getStatusBadgeClass = (status: Transaction["status"]) => {
    switch (status) {
      case "Action Required":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200";
      case "Processing":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200";
      case "Completed":
        return "bg-green-100 text-green-800 hover:bg-green-100 border-green-200";
    }
  };

  const getStepStatus = (
    stepIndex: number,
    currentStep: Transaction["currentStep"]
  ) => {
    const currentIndex = statusSteps.indexOf(currentStep);
    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "upcoming";
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Active Transactions
      </h2>

      <div className="space-y-6">
        {mockTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
          >
            {/* Transaction Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">
                  {transaction.type}
                </h3>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-sm text-gray-600">
                    Amount: {transaction.amount}
                  </span>
                  <span className="text-sm text-gray-500">
                    {transaction.submittedDate}
                  </span>
                </div>
              </div>
              <Badge className={getStatusBadgeClass(transaction.status)}>
                {transaction.status}
              </Badge>
            </div>

            {/* Visual Timeline */}
            <div className="relative mb-3">
              <div className="flex items-center justify-between">
                {statusSteps.map((step, index) => {
                  const stepStatus = getStepStatus(index, transaction.currentStep);

                  return (
                    <div
                      key={step}
                      className="flex flex-col items-center flex-1 relative"
                    >
                      {/* Step Circle */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 z-10 ${
                          stepStatus === "completed"
                            ? "bg-blue-600 text-white"
                            : stepStatus === "current"
                            ? "bg-blue-600 text-white ring-4 ring-blue-100"
                            : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        {stepStatus === "completed" ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : stepStatus === "current" ? (
                          <Circle className="w-4 h-4 fill-current" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                      </div>

                      {/* Step Label */}
                      <p
                        className={`text-xs text-center ${
                          stepStatus === "completed" || stepStatus === "current"
                            ? "text-gray-900 font-medium"
                            : "text-gray-500"
                        }`}
                      >
                        {step}
                      </p>

                      {/* Connecting Line */}
                      {index < statusSteps.length - 1 && (
                        <div
                          className={`absolute top-4 left-1/2 w-full h-0.5 -z-10 ${
                            stepStatus === "completed"
                              ? "bg-blue-600"
                              : "bg-gray-200"
                          }`}
                          style={{ width: "calc(100% - 32px)", marginLeft: "16px" }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Estimated Completion */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-3">
              <Clock className="w-4 h-4" />
              <span>
                {transaction.status === "Action Required"
                  ? transaction.estimatedCompletion
                  : `Estimated completion: ${transaction.estimatedCompletion}`}
              </span>
            </div>
          </div>
        ))}
      </div>

      {mockTransactions.length === 0 && (
        <div className="text-center py-12">
          <CheckCircle2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600">No active transactions</p>
        </div>
      )}
    </Card>
  );
}
