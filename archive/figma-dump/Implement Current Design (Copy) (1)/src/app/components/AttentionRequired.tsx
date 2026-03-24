import { motion } from "motion/react";
import {
  FileText,
  Clock,
  ShieldAlert,
  ArrowRight,
  X,
  AlertCircle,
  FileWarning,
} from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

interface AttentionItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  time?: string;
  type: "critical" | "warning" | "info" | "action";
  actionLabel?: string;
  onAction?: () => void;
  amount?: string;
}

const typeStyles: Record<
  string,
  { bg: string; icon: string; dot: string; border: string }
> = {
  critical: {
    bg: "bg-amber-50/60",
    icon: "bg-amber-100 text-amber-600",
    dot: "bg-amber-500",
    border: "border-amber-100/60",
  },
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

interface AttentionRequiredProps {
  onResolve?: () => void;
}

export function AttentionRequired({ onResolve }: AttentionRequiredProps) {
  const [items, setItems] = useState<AttentionItem[]>([
    {
      id: "critical-1",
      icon: <AlertCircle className="w-4 h-4" />,
      title: "Loan Request - Action Required",
      description:
        "Upload required documents to continue processing your loan request.",
      amount: "$5,000",
      type: "critical",
      actionLabel: "Resolve Issue",
      onAction: onResolve,
    },
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
  ]);

  const dismissItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  if (items.length === 0) {
    return (
      <div
        className="rounded-2xl border border-gray-100/80 bg-white p-6"
        style={{
          boxShadow:
            "0 1px 2px rgba(0,0,0,0.03), 0 8px 24px rgba(0,0,0,0.05)",
        }}
      >
        <div className="text-center py-4">
          <ShieldAlert className="w-8 h-8 text-gray-200 mx-auto mb-2" />
          <p className="text-sm text-gray-400">No action required</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl border border-gray-100/80 bg-white p-3 sm:p-4"
      style={{
        boxShadow: "0 1px 2px rgba(0,0,0,0.03), 0 8px 24px rgba(0,0,0,0.05)",
      }}
    >
      <div className="space-y-2 sm:space-y-2.5">
        {items.map((item, idx) => {
          const style = typeStyles[item.type];
          const isCritical = item.type === "critical";

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ delay: idx * 0.06, duration: 0.3 }}
              className={`flex items-start gap-2.5 sm:gap-3 p-3 sm:p-3.5 rounded-xl ${style.bg} border ${style.border} group ${
                isCritical ? "flex-col" : ""
              }`}
            >
              <div className="flex items-start gap-2.5 sm:gap-3 flex-1 min-w-0">
                <div
                  className={`p-1.5 rounded-lg ${style.icon} flex-shrink-0 mt-0.5`}
                >
                  {item.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                    <p className="text-xs font-semibold text-gray-900">
                      {item.title}
                    </p>
                    {item.amount && (
                      <span className="text-[10px] text-gray-600">
                        Amount: {item.amount}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-600 leading-relaxed mb-1">
                    {item.description}
                  </p>
                  {item.time && (
                    <span className="text-[10px] text-gray-400">
                      {item.time}
                    </span>
                  )}
                </div>

                {!isCritical && (
                  <button
                    onClick={() => dismissItem(item.id)}
                    className="p-1 rounded-md hover:bg-white/60 transition-colors sm:opacity-0 sm:group-hover:opacity-100 flex-shrink-0"
                  >
                    <X className="w-3 h-3 text-gray-400" />
                  </button>
                )}
              </div>

              {isCritical && item.onAction && (
                <Button
                  onClick={item.onAction}
                  size="sm"
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0 rounded-xl h-9 transition-all duration-200 group cursor-pointer mt-2"
                  style={{ boxShadow: "0 2px 10px rgba(245,158,11,0.25)" }}
                >
                  {item.actionLabel || "Take Action"}
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}