import { motion } from "motion/react";
import {
  HandCoins,
  DollarSign,
  ArrowLeftRight,
  PieChart,
  RefreshCcw,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface EligibilityItem {
  icon: React.ReactNode;
  label: string;
  eligible: boolean;
  detail: string;
  color: string;
}

const eligibilityItems: EligibilityItem[] = [
  {
    icon: <HandCoins className="w-4 h-4" />,
    label: "Loan",
    eligible: true,
    detail: "Up to $10,000",
    color: "violet",
  },
  {
    icon: <DollarSign className="w-4 h-4" />,
    label: "Withdrawal",
    eligible: true,
    detail: "Up to $5,000",
    color: "rose",
  },
  {
    icon: <ArrowLeftRight className="w-4 h-4" />,
    label: "Transfer",
    eligible: true,
    detail: "No restrictions",
    color: "blue",
  },
  {
    icon: <PieChart className="w-4 h-4" />,
    label: "Rebalance",
    eligible: true,
    detail: "Available now",
    color: "teal",
  },
  {
    icon: <RefreshCcw className="w-4 h-4" />,
    label: "Rollover",
    eligible: true,
    detail: "Eligible",
    color: "indigo",
  },
];

const colorMap: Record<string, { icon: string; bg: string }> = {
  violet: { icon: "text-violet-600", bg: "bg-violet-50" },
  rose: { icon: "text-rose-600", bg: "bg-rose-50" },
  blue: { icon: "text-blue-600", bg: "bg-blue-50" },
  teal: { icon: "text-teal-600", bg: "bg-teal-50" },
  indigo: { icon: "text-indigo-600", bg: "bg-indigo-50" },
};

export function EligibilityWidget() {
  return (
    <div className="grid grid-cols-5 gap-3">
      {eligibilityItems.map((item, idx) => {
        const colors = colorMap[item.color];
        return (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.3 }}
            className="flex flex-col items-center p-3 rounded-xl bg-white border border-gray-100/80 hover:border-gray-200 transition-all"
            style={{
              boxShadow:
                "0 1px 2px rgba(0,0,0,0.02), 0 2px 8px rgba(0,0,0,0.02)",
            }}
          >
            <div
              className={`p-2 rounded-lg ${colors.bg} ${colors.icon} mb-2`}
            >
              {item.icon}
            </div>
            <p className="text-xs font-medium text-gray-900 mb-0.5">
              {item.label}
            </p>
            <div className="flex items-center gap-1">
              {item.eligible ? (
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              ) : (
                <XCircle className="w-3 h-3 text-gray-300" />
              )}
              <span
                className={`text-[10px] ${item.eligible ? "text-emerald-600" : "text-gray-400"}`}
              >
                {item.detail}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
