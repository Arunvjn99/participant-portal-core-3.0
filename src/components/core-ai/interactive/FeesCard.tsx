import type { CoreAIStructuredPayload, FeesCardPayload } from "@/core/ai/interactive/types";

function money(n: number): string {
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export interface FeesCardProps {
  payload: FeesCardPayload;
  onAction: (payload: CoreAIStructuredPayload) => void;
}

export function FeesCard({ payload, onAction }: FeesCardProps) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-textSecondary)]">{payload.title}</p>
      <p className="mt-1 text-[11px] text-[var(--color-textSecondary)]">{payload.disbursementLabel}</p>

      <ul className="mt-4 space-y-2 text-sm text-[var(--color-text)]">
        <li className="flex justify-between">
          <span className="text-[var(--color-textSecondary)]">Processing fee</span>
          <span>{money(payload.processingFee)}</span>
        </li>
        <li className="flex justify-between">
          <span className="text-[var(--color-textSecondary)]">Other charges</span>
          <span>{money(payload.otherCharges)}</span>
        </li>
        <li className="flex justify-between border-t border-[var(--color-border)] pt-2 font-semibold">
          <span>Loan principal</span>
          <span>{money(payload.principal)}</span>
        </li>
        <li className="flex justify-between text-[var(--color-success)]">
          <span>Est. net to you</span>
          <span>{money(payload.netAmount)}</span>
        </li>
      </ul>

      <button
        type="button"
        onClick={() => onAction({ action: "fees_card_continue" })}
        className="mt-5 w-full rounded-xl bg-primary py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
      >
        Continue
      </button>
    </div>
  );
}
