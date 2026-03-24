import { cn } from "@/lib/utils";

export type AlertCardVariant = "warning" | "error" | "info" | "success";

export type AlertCardProps = {
  title?: string;
  children: React.ReactNode;
  variant: AlertCardVariant;
  className?: string;
};

const map: Record<AlertCardVariant, string> = {
  warning: "txn-alert-card--warning",
  error: "txn-alert-card--error",
  info: "txn-alert-card--info",
  success: "txn-alert-card--success",
};

/**
 * Inline alert — warning / error / info / success (token-backed).
 */
export function AlertCard({ title, children, variant, className }: AlertCardProps) {
  return (
    <div className={cn("txn-alert-card", map[variant], className)} role="status">
      {title ? <p className="txn-alert-card__title">{title}</p> : null}
      <div className="txn-alert-card__body">{children}</div>
    </div>
  );
}
