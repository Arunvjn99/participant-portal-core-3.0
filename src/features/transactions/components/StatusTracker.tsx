import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { TransactionLifecycleStatus } from "../types";

interface InProgressItem {
  id: string;
  label: string;
  status: TransactionLifecycleStatus;
  progress: number;
  eta?: string;
}

const statusLabel: Record<TransactionLifecycleStatus, string> = {
  pending: "Pending",
  processing: "Processing",
  completed: "Completed",
  failed: "Failed",
  scheduled: "Scheduled",
};

const mockInProgress: InProgressItem[] = [
  { id: "1", label: "Rollover from Previous 401(k)", status: "processing", progress: 65, eta: "3 days" },
  { id: "2", label: "Scheduled loan payment", status: "scheduled", progress: 0, eta: "Mar 15" },
  { id: "3", label: "Upcoming auto increase", status: "pending", progress: 0, eta: "Apr 1" },
];

export const StatusTracker = memo(function StatusTracker() {
  const reduced = !!useReducedMotion();
  const items = mockInProgress.filter((i) => i.status !== "completed" && i.status !== "failed");
  if (items.length === 0) return null;

  return (
    <motion.section
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="space-y-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] p-[var(--spacing-4)]"
      style={{ background: "var(--color-surface)", boxShadow: "var(--shadow-sm)" }}
    >
      <h2 className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
        In progress
      </h2>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id} className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm" style={{ color: "var(--color-text)" }}>
                {item.label}
              </span>
              <span
                className="text-xs font-medium"
                style={{
                  color:
                    item.status === "failed"
                      ? "var(--color-danger)"
                      : item.status === "completed"
                        ? "var(--color-success)"
                        : "var(--color-text-secondary)",
                }}
              >
                {statusLabel[item.status]}
                {item.eta ? ` · ${item.eta}` : ""}
              </span>
            </div>
            {item.progress > 0 && (
              <div
                className="h-1.5 w-full overflow-hidden rounded-[var(--radius-full)]"
                style={{ background: "var(--color-border)" }}
              >
                <motion.div
                  initial={reduced ? false : { width: 0 }}
                  animate={{ width: `${item.progress}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="h-full rounded-[var(--radius-full)]"
                  style={{ background: "var(--color-primary)" }}
                />
              </div>
            )}
          </li>
        ))}
      </ul>
    </motion.section>
  );
});
