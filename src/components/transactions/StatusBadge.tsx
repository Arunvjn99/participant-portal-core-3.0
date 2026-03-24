import { cn } from "@/lib/utils";

export type TransactionStatusVariant = "completed" | "pending" | "failed" | "draft";

export type StatusBadgeProps = {
  children: React.ReactNode;
  variant: TransactionStatusVariant;
};

const variantClass: Record<TransactionStatusVariant, string> = {
  completed: "txn-status-badge--completed",
  pending: "txn-status-badge--pending",
  failed: "txn-status-badge--failed",
  draft: "txn-status-badge--draft",
};

/**
 * Status chip for lists and review screens.
 */
export function StatusBadge({ children, variant }: StatusBadgeProps) {
  return <span className={cn("txn-status-badge", variantClass[variant])}>{children}</span>;
}
