import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";

interface ActiveTransactionCardProps {
  type: string;
  amount: string;
  status: "Submitted" | "Processing" | "Approved" | "Funds Sent";
  submittedDate: string;
}

const statusSteps = ["Submitted", "Processing", "Approved", "Funds Sent"];

export function ActiveTransactionCard({
  type,
  amount,
  status,
  submittedDate,
}: ActiveTransactionCardProps) {
  const currentStepIndex = statusSteps.indexOf(status);
  const progressValue = ((currentStepIndex + 1) / statusSteps.length) * 100;

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">{type}</h3>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{amount}</p>
        </div>
        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
          {status}
        </Badge>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">Submitted: {submittedDate}</p>
      
      <div className="space-y-3">
        <Progress value={progressValue} className="h-2" />
        <div className="flex justify-between text-xs">
          {statusSteps.map((step, index) => (
            <span
              key={step}
              className={index <= currentStepIndex ? "text-gray-900 font-medium" : "text-gray-400"}
            >
              {step}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}
