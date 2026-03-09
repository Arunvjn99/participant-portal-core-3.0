import { Button } from "./ui/button";
import { Check, Edit2 } from "lucide-react";

interface UserDetails {
  age: number;
  retiringAt: number;
  salary: string;
  yearsToRetire: number;
}

interface PlanSidebarProps {
  planHighlight: string;
  advantages: string[];
  userDetails: UserDetails;
  onEditDetails: () => void;
}

export function PlanSidebar({ planHighlight, advantages, userDetails, onEditDetails }: PlanSidebarProps) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-6 h-fit sticky top-6">
      {/* Need Help Deciding */}
      <div>
        <h4 className="text-sm font-semibold text-gray-500 mb-3">NEED HELP DECIDING?</h4>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-900 font-semibold">{planHighlight}</p>
        </div>
      </div>

      {/* Key Advantages */}
      <div>
        <h4 className="text-sm font-semibold text-gray-500 mb-3">KEY ADVANTAGES</h4>
        <ul className="space-y-3">
          {advantages.map((advantage, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">{advantage}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* User Details */}
      
    </div>
  );
}