import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ChevronDown, Clock, CheckCircle2, AlertCircle, FileText } from "lucide-react";
import { useState } from "react";

interface Transaction {
  id: string;
  type: string;
  amount: string;
  status: "Action Required" | "Processing" | "Completed";
  submittedDate: string;
  currentStep: "Submitted" | "Processing" | "Approved" | "Funds Sent";
  details?: {
    description: string;
    nextSteps?: string;
    estimatedCompletion?: string;
  };
}

const statusSteps = ["Submitted", "Processing", "Approved", "Funds Sent"];

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "Loan Request",
    amount: "$5,000",
    status: "Action Required",
    submittedDate: "March 6, 2026",
    currentStep: "Submitted",
    details: {
      description: "Additional documentation required",
      nextSteps: "Please upload proof of employment and recent pay stubs",
      estimatedCompletion: "2-3 days after documents received",
    },
  },
  {
    id: "2",
    type: "Hardship Withdrawal",
    amount: "$3,200",
    status: "Processing",
    submittedDate: "March 8, 2026",
    currentStep: "Processing",
    details: {
      description: "Your withdrawal request is being reviewed by the plan administrator",
      estimatedCompletion: "March 12, 2026",
    },
  },
  {
    id: "3",
    type: "Investment Rebalance",
    amount: "—",
    status: "Processing",
    submittedDate: "March 9, 2026",
    currentStep: "Approved",
    details: {
      description: "Rebalancing your portfolio according to your target allocation",
      estimatedCompletion: "Completes next trading day",
    },
  },
  {
    id: "4",
    type: "Fund Transfer",
    amount: "$1,500",
    status: "Completed",
    submittedDate: "March 5, 2026",
    currentStep: "Funds Sent",
    details: {
      description: "Transfer completed successfully",
      estimatedCompletion: "Completed on March 6, 2026",
    },
  },
];

export function ActiveTransactionsSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Sort transactions by priority
  const sortedTransactions = [...mockTransactions].sort((a, b) => {
    const priority = {
      "Action Required": 1,
      "Processing": 2,
      "Completed": 3,
    };
    return priority[a.status] - priority[b.status];
  });

  const getStatusBadgeClass = (status: Transaction["status"]) => {
    switch (status) {
      case "Action Required":
        return "bg-red-100 text-red-800 hover:bg-red-100 border-red-200";
      case "Processing":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200";
      case "Completed":
        return "bg-green-100 text-green-800 hover:bg-green-100 border-green-200";
    }
  };

  const getStatusIcon = (status: Transaction["status"]) => {
    switch (status) {
      case "Action Required":
        return <AlertCircle className="w-4 h-4" />;
      case "Processing":
        return <Clock className="w-4 h-4" />;
      case "Completed":
        return <CheckCircle2 className="w-4 h-4" />;
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getStepProgress = (currentStep: Transaction["currentStep"]) => {
    return statusSteps.indexOf(currentStep);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Active Transactions</h2>
          <p className="text-sm text-gray-600 mt-1">
            {sortedTransactions.length} {sortedTransactions.length === 1 ? "transaction" : "transactions"} in progress
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {sortedTransactions.map((transaction) => {
          const isExpanded = expandedId === transaction.id;
          const currentStepIndex = getStepProgress(transaction.currentStep);
          const progressPercentage = ((currentStepIndex + 1) / statusSteps.length) * 100;

          return (
            <div
              key={transaction.id}
              className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors"
            >
              {/* Transaction Row */}
              <button
                onClick={() => toggleExpand(transaction.id)}
                className="w-full px-4 py-3 flex items-center gap-4 hover:bg-gray-50 transition-colors"
              >
                {/* Status Icon */}
                <div className="flex-shrink-0">
                  {getStatusIcon(transaction.status)}
                </div>

                {/* Transaction Info */}
                <div className="flex-1 grid grid-cols-4 gap-4 items-center text-left">
                  <div>
                    <p className="font-medium text-gray-900">{transaction.type}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{transaction.submittedDate}</p>
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900">{transaction.amount}</p>
                  </div>

                  <div>
                    <Badge className={getStatusBadgeClass(transaction.status)}>
                      {transaction.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 min-w-[60px]">
                      {transaction.currentStep}
                    </span>
                  </div>
                </div>

                {/* Expand Icon */}
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-4 py-4 border-t border-gray-200 bg-gray-50">
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                      Progress Details
                    </h4>
                    
                    {/* Detailed Progress Stepper */}
                    <div className="relative">
                      <div className="flex justify-between mb-2">
                        {statusSteps.map((step, index) => {
                          const isComplete = index <= currentStepIndex;
                          const isCurrent = index === currentStepIndex;
                          
                          return (
                            <div key={step} className="flex flex-col items-center flex-1">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                                  isComplete
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 text-gray-400"
                                } ${isCurrent ? "ring-4 ring-blue-100" : ""}`}
                              >
                                {isComplete ? (
                                  <CheckCircle2 className="w-4 h-4" />
                                ) : (
                                  <span className="text-xs font-medium">{index + 1}</span>
                                )}
                              </div>
                              <p
                                className={`text-xs text-center ${
                                  isComplete ? "text-gray-900 font-medium" : "text-gray-500"
                                }`}
                              >
                                {step}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                      
                      {/* Connecting Lines */}
                      <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -z-10">
                        <div
                          className="h-full bg-blue-600 transition-all"
                          style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Transaction Details */}
                  {transaction.details && (
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <FileText className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-900">
                            {transaction.details.description}
                          </p>
                          {transaction.details.nextSteps && (
                            <p className="text-sm text-blue-700 font-medium mt-1">
                              {transaction.details.nextSteps}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {transaction.details.estimatedCompletion && (
                        <div className="flex items-start gap-2">
                          <Clock className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Estimated completion:</span>{" "}
                            {transaction.details.estimatedCompletion}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {sortedTransactions.length === 0 && (
        <div className="text-center py-12">
          <CheckCircle2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600">No active transactions</p>
          <p className="text-sm text-gray-500 mt-1">
            Your completed transactions appear in Recent Transactions below
          </p>
        </div>
      )}
    </Card>
  );
}
