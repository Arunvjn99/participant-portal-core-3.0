import { useCallback } from "react";
import { TransactionStepCard } from "../../../../../components/transactions/TransactionStepCard";
import type { TransactionStepProps } from "../../../../../components/transactions/TransactionApplication";

export const TransferReviewStep = ({ transaction, initialData, onDataChange, readOnly }: TransactionStepProps) => {
  const isReadOnly = readOnly || transaction.status !== "draft";
  const intent = initialData?.intent ?? "Rebalance";
  const confirmationAccepted = initialData?.confirmationAccepted ?? false;

  const handleConfirmationChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onDataChange?.({ confirmationAccepted: e.target.checked }),
    [onDataChange]
  );

  return (
    <TransactionStepCard title={isReadOnly ? "Review & Confirm" : "Review & Submit"}>
      <div className="space-y-6">
        <dl className="space-y-3">
          <div className="flex justify-between py-2 border-b" style={{ borderColor: "var(--enroll-card-border)" }}>
            <dt style={{ color: "var(--enroll-text-secondary)" }}>Intent</dt>
            <dd className="font-semibold" style={{ color: "var(--enroll-text-primary)" }}>{intent}</dd>
          </div>
          <div className="flex justify-between py-2" style={{ borderColor: "var(--enroll-card-border)" }}>
            <dt style={{ color: "var(--enroll-text-secondary)" }}>Effective</dt>
            <dd className="font-semibold" style={{ color: "var(--enroll-text-primary)" }}>Next market close (4:00 PM ET)</dd>
          </div>
        </dl>
        {!isReadOnly && (
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmationAccepted}
              onChange={handleConfirmationChange}
              className="mt-1 rounded"
              style={{ accentColor: "var(--enroll-brand)" }}
            />
            <span className="text-sm" style={{ color: "var(--enroll-text-secondary)" }}>
              I understand that reallocation will take effect at the next market close.
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
