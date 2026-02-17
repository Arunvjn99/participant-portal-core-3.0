import { useCallback } from "react";
import { CheckCircle2 } from "lucide-react";
import { TransactionStepCard } from "../../../../../components/transactions/TransactionStepCard";
import { RetirementImpact } from "../../../../../components/transactions/RetirementImpact";
import type { TransactionStepProps } from "../../../../../components/transactions/TransactionApplication";

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(n);

export const WithdrawalReviewStep = ({ transaction, initialData, onDataChange, readOnly }: TransactionStepProps) => {
  const isReadOnly = readOnly || transaction.status !== "draft";
  const amount = initialData?.amount ?? 1000;
  const federalRate = initialData?.federalTaxRate ?? 20;
  const stateRate = initialData?.stateTaxRate ?? 5;
  const confirmationAccepted = initialData?.confirmationAccepted ?? false;

  const federalWithhold = amount * (federalRate / 100);
  const stateWithhold = amount * (stateRate / 100);
  const netAmount = amount - federalWithhold - stateWithhold;

  const handleConfirmationChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onDataChange?.({ confirmationAccepted: e.target.checked }),
    [onDataChange]
  );

  const impactLevel = amount <= 5000 ? "low" : amount <= 15000 ? "medium" : "high";
  const impactRationale =
    impactLevel === "low"
      ? "This withdrawal has limited impact on your projected balance. Consider resuming or increasing contributions when possible."
      : impactLevel === "medium"
        ? "This amount reduces your invested balance. Tax and penalty may apply; review withholding and consider timing."
        : "This is a significant withdrawal. Ensure you understand tax, penalty, and long-term impact on retirement goals.";

  const timelineSteps = [
    { label: "Request received", detail: "We’ll verify eligibility and process your hardship withdrawal." },
    { label: "Tax withholding", detail: `Federal (${federalRate}%) and state (${stateRate}%) withholding will be applied per your election.` },
    { label: "Disbursement", detail: "Net amount will be sent via your chosen method (typically 5–10 business days)." },
  ];

  return (
    <TransactionStepCard title={isReadOnly ? "Review & Confirm" : "Review & Submit"}>
      <div className="space-y-6">
        <dl className="space-y-0">
          <div className="flex justify-between py-2 border-b" style={{ borderColor: "var(--enroll-card-border)" }}>
            <dt style={{ color: "var(--enroll-text-secondary)" }}>Gross amount</dt>
            <dd className="font-semibold" style={{ color: "var(--enroll-text-primary)" }}>{formatCurrency(amount)}</dd>
          </div>
          <div className="flex justify-between py-2 border-b" style={{ borderColor: "var(--enroll-card-border)" }}>
            <dt style={{ color: "var(--enroll-text-secondary)" }}>Federal withholding ({federalRate}%)</dt>
            <dd className="font-semibold" style={{ color: "var(--enroll-text-primary)" }}>-{formatCurrency(federalWithhold)}</dd>
          </div>
          <div className="flex justify-between py-2 border-b" style={{ borderColor: "var(--enroll-card-border)" }}>
            <dt style={{ color: "var(--enroll-text-secondary)" }}>State withholding ({stateRate}%)</dt>
            <dd className="font-semibold" style={{ color: "var(--enroll-text-primary)" }}>-{formatCurrency(stateWithhold)}</dd>
          </div>
          <div className="flex justify-between py-2">
            <dt style={{ color: "var(--enroll-text-secondary)" }}>Net amount</dt>
            <dd className="font-semibold" style={{ color: "var(--enroll-text-primary)" }}>{formatCurrency(netAmount)}</dd>
          </div>
        </dl>

        <RetirementImpact level={impactLevel} rationale={impactRationale} />

        <div>
          <p className="text-sm font-semibold mb-3" style={{ color: "var(--enroll-text-primary)" }}>What happens next</p>
          <ul className="space-y-3">
            {timelineSteps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                  style={{ background: "var(--txn-brand-soft)", color: "var(--enroll-brand)" }}
                >
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--enroll-text-primary)" }}>{step.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--enroll-text-muted)" }}>{step.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {!isReadOnly && (
          <div
            className="p-4 rounded-[var(--radius-lg)] border"
            style={{ background: "var(--color-warning-light)", borderColor: "var(--color-warning)" }}
          >
            <p className="text-sm" style={{ color: "var(--enroll-text-primary)" }}>
              Hardship withdrawals may be subject to income tax and a 10% early withdrawal penalty if under 59½.
            </p>
          </div>
        )}

        {!isReadOnly && (
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmationAccepted}
              onChange={handleConfirmationChange}
              className="mt-1 rounded"
              style={{ accentColor: "var(--enroll-brand)" }}
            />
            <span className="text-sm flex items-center gap-2" style={{ color: "var(--enroll-text-secondary)" }}>
              <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: "var(--color-success)" }} />
              I understand the tax implications and penalties that may apply.
            </span>
          </label>
        )}
        {isReadOnly && (
          <p className="text-sm" style={{ color: "var(--enroll-text-secondary)" }}>
            This transaction has been {transaction.status === "completed" ? "completed" : "submitted for processing"}.
          </p>
        )}
      </div>
    </TransactionStepCard>
  );
};
