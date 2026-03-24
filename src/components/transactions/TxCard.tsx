import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * Unified transaction flow card — wraps `fig-tx-card` + optional title + children.
 * Replaces ad-hoc `<section className="fig-tx-card">` patterns across all flows.
 */
export function TxCard({
  title,
  id,
  children,
  className,
}: {
  title?: string;
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("fig-tx-card tx-flow-card", className)} aria-labelledby={id}>
      {title ? (
        <h2 id={id} className="fig-tx-card__title">
          {title}
        </h2>
      ) : null}
      {children}
    </section>
  );
}

/**
 * Metric tile inside a TxCard grid.
 */
export function TxMetric({
  label,
  value,
  icon,
  tone = "primary",
}: {
  label: string;
  value: string;
  icon?: ReactNode;
  tone?: "primary" | "success" | "warn" | "violet" | "sky";
}) {
  return (
    <div className="fig-tx-metric">
      {icon ? <div className={`fig-tx-metric__icon fig-tx-metric__icon--${tone}`} aria-hidden>{icon}</div> : null}
      <div>
        <p className="fig-tx-metric__label">{label}</p>
        <p className="fig-tx-metric__value">{value}</p>
      </div>
    </div>
  );
}

/**
 * Warning callout block inside a flow page.
 */
export function TxCalloutWarn({
  title,
  children,
  id,
}: {
  title?: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <div className="fig-tx-callout-warn" role="note" aria-labelledby={id}>
      {title ? (
        <h3 id={id} className="fig-tx-callout-warn__title">
          {title}
        </h3>
      ) : null}
      {children}
    </div>
  );
}

/**
 * Info callout block inside a flow page.
 */
export function TxCalloutInfo({
  title,
  children,
  icon,
}: {
  title?: string;
  children: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="fig-tx-callout-info">
      {icon ? <span className="fig-tx-metric__icon fig-tx-metric__icon--primary fig-shrink-0" aria-hidden>{icon}</span> : null}
      <div>
        {title ? <p className="fig-tx-callout-info__title">{title}</p> : null}
        <div className="fig-tx-callout-info__body">{children}</div>
      </div>
    </div>
  );
}
