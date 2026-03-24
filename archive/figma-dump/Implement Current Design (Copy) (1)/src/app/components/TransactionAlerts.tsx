import { motion } from "motion/react";
import {
  FileText,
  Clock,
  ShieldAlert,
  ArrowUpRight,
  X,
} from "lucide-react";
import { useState } from "react";

interface Alert {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
  type: "warning" | "info" | "action";
}

const initialAlerts: Alert[] = [
  {
    id: "1",
    icon: <FileText className="w-4 h-4" />,
    title: "Document Required",
    description:
      "Upload your voided check to continue processing loan #LN-0228.",
    time: "2 hours ago",
    type: "action",
  },
  {
    id: "2",
    icon: <Clock className="w-4 h-4" />,
    title: "Admin Review Pending",
    description:
      "Your hardship withdrawal is under compliance review. Estimated: 1-2 days.",
    time: "1 day ago",
    type: "info",
  },
  {
    id: "3",
    icon: <ShieldAlert className="w-4 h-4" />,
    title: "Bank Verification Needed",
    description:
      "Verify your bank account ending ****1234 to enable EFT disbursement.",
    time: "3 days ago",
    type: "warning",
  },
];

const typeStyles: Record<
  string,
  { bg: string; icon: string; dot: string; border: string }
> = {
  action: {
    bg: "bg-amber-50/60",
    icon: "bg-amber-100 text-amber-600",
    dot: "bg-amber-500",
    border: "border-amber-100/60",
  },
  info: {
    bg: "bg-blue-50/60",
    icon: "bg-blue-100 text-blue-600",
    dot: "bg-blue-500",
    border: "border-blue-100/60",
  },
  warning: {
    bg: "bg-rose-50/60",
    icon: "bg-rose-100 text-rose-600",
    dot: "bg-rose-500",
    border: "border-rose-100/60",
  },
};

export function TransactionAlerts() {
  const [alerts, setAlerts] = useState(initialAlerts);

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  if (alerts.length === 0) {
    return (
      <div className="text-center py-6">
        <ShieldAlert className="w-8 h-8 text-gray-200 mx-auto mb-2" />
        <p className="text-sm text-gray-400">No alerts</p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {alerts.map((alert, idx) => {
        const style = typeStyles[alert.type];
        return (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ delay: idx * 0.06, duration: 0.3 }}
            className={`flex items-start gap-3 p-3.5 rounded-xl ${style.bg} border ${style.border} group`}
          >
            <div className={`p-1.5 rounded-lg ${style.icon} flex-shrink-0 mt-0.5`}>
              {alert.icon}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                <p className="text-xs font-semibold text-gray-900">
                  {alert.title}
                </p>
              </div>
              <p className="text-[11px] text-gray-600 leading-relaxed mb-1">
                {alert.description}
              </p>
              <span className="text-[10px] text-gray-400">{alert.time}</span>
            </div>

            <button
              onClick={() => dismissAlert(alert.id)}
              className="p-1 rounded-md hover:bg-white/60 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
            >
              <X className="w-3 h-3 text-gray-400" />
            </button>
          </motion.div>
        );
      })}
    </div>
  );
}
