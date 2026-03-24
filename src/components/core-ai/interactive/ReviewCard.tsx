import type { CoreAIStructuredPayload, ReviewCardPayload } from "@/core/ai/interactive/types";

function money(n: number): string {
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function moneyCents(n: number): string {
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export interface ReviewCardProps {
  payload: ReviewCardPayload;
  onAction: (payload: CoreAIStructuredPayload) => void;
}

export function ReviewCard({ payload, onAction }: ReviewCardProps) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-textSecondary)]">{payload.title}</p>
      <p className="mt-2 text-sm text-[var(--color-text)]">
        You&apos;re ready to open <strong>loan configuration</strong> with these estimates:
      </p>

      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-[var(--color-textSecondary)]">Amount</dt>
          <dd className="font-medium text-[var(--color-text)]">{money(payload.amount)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-[var(--color-textSecondary)]">Est. payment</dt>
          <dd className="font-medium text-[var(--color-text)]">{moneyCents(payload.monthlyPayment)}/mo</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-[var(--color-textSecondary)]">Term</dt>
          <dd className="font-medium text-[var(--color-text)]">{payload.tenureMonths} mo</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-[var(--color-textSecondary)]">Rate</dt>
          <dd className="font-medium text-[var(--color-text)]">{payload.annualRatePercent}% APR</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-[var(--color-textSecondary)]">Disbursement</dt>
          <dd className="text-right font-medium text-[var(--color-text)]">{payload.disbursementLabel}</dd>
        </div>
        <div className="flex justify-between border-t border-[var(--color-border)] pt-2">
          <dt className="text-[var(--color-textSecondary)]">Est. net (after fees)</dt>
          <dd className="font-semibold text-[var(--color-success)]">{moneyCents(payload.netAmount)}</dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={() => onAction({ action: "review_card_submit" })}
        className="mt-5 w-full rounded-xl bg-primary py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
      >
        Submit loan
      </button>
    </div>
  );
}
