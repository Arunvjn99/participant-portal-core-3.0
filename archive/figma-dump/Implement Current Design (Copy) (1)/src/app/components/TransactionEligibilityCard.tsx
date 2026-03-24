import { Card } from "./ui/card";

interface TransactionEligibilityCardProps {
  title: string;
  primaryText: string;
  details: string[];
  icon: React.ReactNode;
}

export function TransactionEligibilityCard({
  title,
  primaryText,
  details,
  icon,
}: TransactionEligibilityCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-2xl font-semibold text-gray-900 mb-3">{primaryText}</p>
          <div className="space-y-1">
            {details.map((detail, index) => (
              <p key={index} className="text-sm text-gray-600">
                {detail}
              </p>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
