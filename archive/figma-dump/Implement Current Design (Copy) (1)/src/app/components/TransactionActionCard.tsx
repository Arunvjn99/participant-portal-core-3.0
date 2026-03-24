import { Card } from "./ui/card";
import { ArrowRight } from "lucide-react";

interface TransactionActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  processingTime?: string;
  onClick?: () => void;
}

export function TransactionActionCard({
  icon,
  title,
  description,
  processingTime,
  onClick,
}: TransactionActionCardProps) {
  return (
    <Card
      className="p-6 hover:shadow-lg transition-shadow cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex flex-col h-full">
        <div className="p-3 rounded-lg bg-blue-50 text-blue-600 w-fit mb-4">
          {icon}
        </div>
        
        <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-3 flex-1">{description}</p>
        
        {processingTime && (
          <p className="text-xs text-gray-500 mb-4">{processingTime}</p>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-blue-600">Get started</span>
          <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Card>
  );
}
