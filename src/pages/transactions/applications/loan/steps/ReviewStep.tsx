import { DashboardCard } from "../../../../../components/dashboard/DashboardCard";
import { StepGuidance } from "../../../../../components/transactions/StepGuidance";
import type { TransactionStepProps } from "../../../../../components/transactions/TransactionApplication";

const REVIEW_GUIDANCE = "Confirm your selections and understand the long-term impact.";

export const ReviewStep = ({ transaction, initialData, onDataChange, readOnly }: TransactionStepProps) => {
  const isReadOnly = readOnly || transaction.status !== "draft";
  const isIrreversible = transaction.isIrreversible;

  return (
    <div className="flex flex-col gap-6" style={{ gap: "var(--spacing-6)" }}>
      <StepGuidance>{REVIEW_GUIDANCE}</StepGuidance>
      <DashboardCard title={isReadOnly ? "Review & Confirm" : "Review & Submit"}>
        <div className="flex flex-col gap-4" style={{ gap: "var(--spacing-4)", color: "var(--enroll-text-primary)" }}>
          <p style={{ color: "var(--enroll-text-secondary)" }}>
            Review your loan details{isReadOnly ? "" : " and submit your application"}.
          </p>

          {isIrreversible && !isReadOnly && (
            <div
              className="rounded-xl border p-4"
              style={{
                borderColor: "var(--color-warning)",
                background: "var(--color-warning-light)",
                color: "var(--enroll-text-primary)",
              }}
            >
              <strong>⚠️ Irreversible Action</strong>
              <p className="mt-1 text-sm">This transaction cannot be undone once submitted. Please review all details carefully.</p>
            </div>
          )}

          <div>
            <p style={{ color: "var(--enroll-text-secondary)" }}>Summary and warnings will be displayed here.</p>
          </div>

          {!isReadOnly && (
            <label className="flex cursor-pointer items-start gap-3 text-sm">
              <input
                type="checkbox"
                required
                className="mt-0.5 rounded border-[var(--enroll-card-border)] focus:ring-2 focus:ring-[var(--enroll-brand)]"
                onChange={(e) => {
                  if (onDataChange) {
                    onDataChange({ confirmationAccepted: e.target.checked });
                  }
                }}
              />
              <span style={{ color: "var(--enroll-text-primary)" }}>
                I confirm that I have reviewed all details and understand the terms of this transaction.
              </span>
            </label>
          )}

          {isReadOnly && (
            <p className="text-sm" style={{ color: "var(--enroll-text-secondary)" }}>
              This transaction has been {transaction.status === "completed" ? "completed" : "submitted for processing"}.
            </p>
          )}
        </div>
      </DashboardCard>
    </div>
  );
};
