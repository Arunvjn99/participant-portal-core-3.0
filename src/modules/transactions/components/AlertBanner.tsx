import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type AlertBannerVariant = "info" | "warning" | "critical";

const variantClass: Record<AlertBannerVariant, string> = {
  info: "tx-alert-banner--info",
  warning: "tx-alert-banner--warning",
  critical: "tx-alert-banner--critical",
};

export type AlertBannerProps = {
  title: string;
  children?: ReactNode;
  variant?: AlertBannerVariant;
};

export function AlertBanner({ title, children, variant = "info" }: AlertBannerProps) {
  return (
    <div className={cn("tx-alert-banner card-soft", variantClass[variant])} role="status">
      <p className="font-semibold text-foreground">{title}</p>
      {children ? <div className="mt-2 text-sm text-muted-foreground">{children}</div> : null}
    </div>
  );
}
