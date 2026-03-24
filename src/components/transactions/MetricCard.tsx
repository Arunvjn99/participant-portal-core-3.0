export type MetricCardProps = {
  label: string;
  value: string;
  hint?: string;
};

/**
 * Compact metric — plan / flow summaries.
 */
export function MetricCard({ label, value, hint }: MetricCardProps) {
  return (
    <div className="txn-flow-card txn-flow-card--metric">
      <p className="txn-field-label">{label}</p>
      <p className="txn-metric-card__value">{value}</p>
      {hint ? <p className="txn-metric-card__hint">{hint}</p> : null}
    </div>
  );
}
