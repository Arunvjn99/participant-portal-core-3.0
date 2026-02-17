import { useCallback } from "react";
import { CheckCircle2 } from "lucide-react";
import { TransactionStepCard } from "../../../../../components/transactions/TransactionStepCard";
import { RetirementImpact } from "../../../../../components/transactions/RetirementImpact";
import type { TransactionStepProps } from "../../../../../components/transactions/TransactionApplication";

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);

export const RolloverReviewStep = ({ transaction, initialData, onDataChange, readOnly }: TransactionStepProps) => {
  const isReadOnly = readOnly || transaction.status !== "draft";
  const estimatedBalance = initialData?.estimatedBalance ?? initialData?.amount ?? 25000;
  const providerName = initialData?.providerName ?? "";
  const accountType = initialData?.accountType ?? "401(k)";
  const confirmationAccepted = initialData?.confirmationAccepted ?? false;

  const handleConfirmationChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onDataChange?.({ confirmationAccepted: e.target.checked }),
    [onDataChange]
  );

  const impactLevel = estimatedBalance <= 10000 ? "low" : estimatedBalance <= 50000 ? "medium" : "high";
  const impactRationale =
    impactLevel === "low"
      ? "Consolidating this amount can simplify management. Funds will be invested per your allocation."
      : impactLevel === "medium"
        ? "This rollover will meaningfully increase your balance here. Direct rollover avoids tax and penalty."
        : "This is a substantial rollover. Once received, funds will be invested according to your current allocation.";

  const timelineSteps = [
    { label: "Request received", detail: "We’ll send you instructions and any required forms for your prior provider." },
    { label: "Transfer from prior plan", detail: "You request a direct rollover from your previous 401(k) or IRA to this plan." },
    { label: "Funds received", detail: "Once we receive the funds, they will be invested per your allocation (typically 5–10 business days)." },
  ];

  return (
    <TransactionStepCard title={isReadOnly ? "Review & Confirm" : "Review & Submit"}>
      <div className="space-y-6">
        <dl className="space-y-0">
          <div className="flex justify-between py-2 border-b" style={{ borderColor: "var(--enroll-card-border)" }}>
            <dt style={{ color: "var(--enroll-text-secondary)" }}>Estimated amount</dt>
            <dd className="font-semibold" style={{ color: "var(--enroll-text-primary)" }}>{formatCurrency(estimatedBalance)}</dd>
          </div>
          <div className="flex justify-between py-2 border-b" style={{ borderColor: "var(--enroll-card-border)" }}>
            <dt style={{ color: "var(--enroll-text-secondary)" }}>Source</dt>
            <dd className="font-semibold" style={{ color: "var(--enroll-text-primary)" }}>{providerName || "—"}</dd>
          </div>
          <div className="flex justify-between py-2">
            <dt style={{ color: "var(--enroll-text-secondary)" }}>Account type</dt>
            <dd className="font-semibold" style={{ color: "var(--enroll-text-primary)" }}>{accountType}</dd>
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
              I confirm that I am initiating a direct rollover and understand the process.
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
