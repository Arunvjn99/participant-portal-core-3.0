import { Card } from "./ui/card";
import { Button } from "./ui/button";

interface QuickActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  contextInfo: string;
  additionalInfo?: string;
  onClick: () => void;
}

export function QuickActionCard({
  icon,
  title,
  description,
  contextInfo,
  additionalInfo,
  onClick,
}: QuickActionCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group" onClick={onClick}>
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
          {icon}
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600 mb-3">{description}</p>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-blue-700">{contextInfo}</p>
            {additionalInfo && (
              <p className="text-xs text-gray-500">{additionalInfo}</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <Button variant="ghost" size="sm" className="w-full group-hover:bg-blue-50">
          Get Started →
        </Button>
      </div>
    </Card>
  );
}