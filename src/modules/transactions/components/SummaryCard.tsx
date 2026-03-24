import type { ReactNode } from "react";

export type SummaryRow = { label: string; value: string; emphasize?: boolean };

export type SummaryCardProps = {
  title: string;
  rows: SummaryRow[];
  footer?: ReactNode;
};

export function SummaryCard({ title, rows, footer }: SummaryCardProps) {
  return (
    <section className="card">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <ul className="mt-4 space-y-3">
        {rows.map((row) => (
          <li key={row.label} className="flex items-center justify-between gap-4 text-sm">
            <span className="text-muted-foreground">{row.label}</span>
            <span className={row.emphasize ? "font-semibold text-primary" : "font-medium tabular-nums text-foreground"}>{row.value}</span>
          </li>
        ))}
      </ul>
      {footer ? <div className="mt-4 border-t border-border pt-4 text-sm text-muted-foreground">{footer}</div> : null}
    </section>
  );
}
