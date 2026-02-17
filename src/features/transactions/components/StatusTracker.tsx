import { memo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Card, CardContent } from "../../../components/ui/card";
import { SectionHeader } from "../../../components/dashboard/shared/SectionHeader";
import { ProgressBar } from "../../../components/dashboard/shared/ProgressBar";
import { StatusBadge } from "../../../components/dashboard/shared/StatusBadge";
import type { TransactionLifecycleStatus } from "../types";

interface InProgressItem {
  id: string;
  label: string;
  status: TransactionLifecycleStatus;
  progress: number;
  eta?: string;
  details?: string;
}

const statusLabel: Record<TransactionLifecycleStatus, string> = {
  pending: "Pending",
  processing: "Processing",
  completed: "Completed",
  failed: "Failed",
  scheduled: "Scheduled",
};

const statusVariant: Record<TransactionLifecycleStatus, "success" | "warning" | "danger" | "neutral" | "primary"> = {
  pending: "neutral",
  processing: "primary",
  completed: "success",
  failed: "danger",
  scheduled: "warning",
};

const MOCK_ITEMS: InProgressItem[] = [
  {
    id: "1",
    label: "Rollover from Previous 401(k)",
    status: "processing",
    progress: 65,
    eta: "3 days",
    details: "Funds are being transferred from your previous employer's plan. You'll receive a confirmation when complete.",
  },
  {
    id: "2",
    label: "Scheduled loan payment",
    status: "scheduled",
    progress: 0,
    eta: "Mar 15",
    details: "Monthly payment of $833.33 will be deducted automatically.",
  },
  {
    id: "3",
    label: "Upcoming auto increase",
    status: "pending",
    progress: 0,
    eta: "Apr 1",
    details: "Your contribution rate will increase from 9% to 10% on April 1st.",
  },
];

export const StatusTracker = memo(function StatusTracker() {
  const reduced = !!useReducedMotion();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const items = MOCK_ITEMS.filter((i) => i.status !== "completed" && i.status !== "failed");

  if (items.length === 0) return null;

  return (
    <motion.section
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="space-y-3"
    >
      <SectionHeader title="In progress" subtitle="Active and scheduled items" />
      <Card className="border-[var(--color-border)]" style={{ boxShadow: "var(--shadow-sm)" }}>
        <CardContent className="p-4">
          <ul className="space-y-4">
            {items.map((item) => {
              const isExpanded = expandedId === item.id;
              return (
                <li
                  key={item.id}
                  className="border-b border-[var(--color-border)] pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
                      {item.label}
                    </span>
                    <div className="flex items-center gap-2">
                      <StatusBadge label={statusLabel[item.status]} variant={statusVariant[item.status]} />
                      {item.eta && (
                        <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                          {item.eta}
                        </span>
                      )}
                    </div>
                  </div>
                  {item.progress > 0 && (
                    <div className="mt-2">
                      <ProgressBar value={item.progress} max={100} height={6} />
                    </div>
                  )}
                  {item.details && (
                    <>
                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        className="mt-2 text-xs font-medium"
                        style={{ color: "var(--color-primary)" }}
                      >
                        {isExpanded ? "Less" : "Details"}
                      </button>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="overflow-hidden"
                          >
                            <p
                              className="mt-2 text-xs leading-relaxed"
                              style={{ color: "var(--color-text-secondary)" }}
                            >
                              {item.details}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </motion.section>
  );
});
