import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type AttentionTimelineItem = {
  id: string;
  title: string;
  description: string;
  amount?: string;
  actionLabel?: string;
  onAction?: () => void;
};

const DEFAULT_ITEMS: AttentionTimelineItem[] = [
  {
    id: "1",
    title: "Loan Request — Action Required",
    description: "Upload required documents to continue processing your loan request.",
    amount: "$5,000",
    actionLabel: "Resolve issue",
  },
  {
    id: "2",
    title: "Withdrawal — Verification",
    description: "Additional documentation needed for hardship review.",
    amount: "$1,200",
    actionLabel: "Resolve issue",
  },
  {
    id: "3",
    title: "Rollover — In progress",
    description: "Awaiting custodian transfer confirmation.",
    amount: "$18,500",
    actionLabel: "Resolve issue",
  },
  {
    id: "4",
    title: "Transfer — Review",
    description: "Large transfer flagged for secondary approval.",
    amount: "$4,000",
    actionLabel: "Resolve issue",
  },
];

export function TransactionCenterAttentionTimeline({
  items = DEFAULT_ITEMS,
}: {
  items?: AttentionTimelineItem[];
}) {
  if (items.length === 0) {
    return (
      <div
        style={{
          background: "var(--card-bg)",
          borderRadius: 16,
          border: "1px solid var(--border)",
          padding: "24px 28px",
        }}
      >
        <div className="text-center py-4">
          <AlertCircle className="w-8 h-8 mx-auto mb-2" style={{ color: "var(--border)" }} />
          <p style={{ fontSize: 13, color: "var(--color-text-tertiary)", fontWeight: 500 }}>No action required</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "var(--card-bg)",
        borderRadius: 16,
        border: "1px solid var(--border)",
        padding: "14px 18px",
      }}
    >
      <div className="space-y-2.5">
        {items.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08, duration: 0.3 }}
            className={cn(
              "rounded-xl border border-amber-200/90 bg-gradient-to-br from-amber-50 to-orange-50/95 p-3",
              "dark:border-amber-500/30 dark:from-amber-950/45 dark:to-orange-950/35",
            )}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-start gap-2.5 min-w-0 flex-1">
                <div
                  className={cn(
                    "flex h-[26px] w-[26px] flex-shrink-0 items-center justify-center rounded-md",
                    "bg-amber-100 text-amber-800 dark:bg-amber-900/55 dark:text-amber-200",
                  )}
                >
                  <AlertCircle className="w-[13px] h-[13px]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="h-[5px] w-[5px] flex-shrink-0 rounded-full bg-amber-500 dark:bg-amber-400" />
                    <p
                      style={{
                        fontSize: 12.5,
                        fontWeight: 700,
                        color: "var(--foreground)",
                        letterSpacing: "-0.3px",
                        lineHeight: 1.2,
                      }}
                    >
                      {item.title}
                    </p>
                    {item.amount ? (
                      <span style={{ fontSize: 11, color: "var(--color-text-secondary)", fontWeight: 500 }}>Amount: {item.amount}</span>
                    ) : null}
                  </div>
                  <p
                    style={{
                      fontSize: 11,
                      color: "var(--color-text-secondary)",
                      fontWeight: 500,
                      lineHeight: 1.35,
                      marginTop: 2,
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              </div>

              {item.onAction && item.actionLabel ? (
                <div className="flex justify-end sm:justify-start sm:flex-shrink-0">
                  <button
                    type="button"
                    onClick={item.onAction}
                    className={cn(
                      "rounded-lg border px-3.5 py-1.5 text-xs font-bold transition-all duration-200",
                      "border-amber-300 bg-card text-amber-900 hover:bg-amber-50/80",
                      "dark:border-amber-600/40 dark:text-amber-100 dark:hover:bg-amber-950/40",
                    )}
                  >
                    {item.actionLabel}
                  </button>
                </div>
              ) : null}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
