import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { TransactionStepCard } from "../../../../../components/transactions/TransactionStepCard";
import type { TransactionStepProps } from "../../../../../components/transactions/TransactionApplication";

export const TransferReviewStep = ({ transaction, initialData, onDataChange, readOnly }: TransactionStepProps) => {
  const { t } = useTranslation();
  const isReadOnly = readOnly || transaction.status !== "draft";
  const intent = initialData?.intent ?? "Rebalance";
  const confirmationAccepted = initialData?.confirmationAccepted ?? false;

  const handleConfirmationChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onDataChange?.({ confirmationAccepted: e.target.checked }),
    [onDataChange]
  );

  return (
    <TransactionStepCard title={isReadOnly ? t("transactions.loan.reviewConfirm") : t("transactions.loan.reviewSubmit")}>
      <div className="space-y-6">
        <dl className="space-y-3">
          <div className="flex justify-between py-2 border-b" style={{ borderColor: "var(--enroll-card-border)" }}>
            <dt style={{ color: "var(--enroll-text-secondary)" }}>{t("transactions.transfer.intent")}</dt>
            <dd className="font-semibold" style={{ color: "var(--enroll-text-primary)" }}>{intent}</dd>
          </div>
          <div className="flex justify-between py-2" style={{ borderColor: "var(--enroll-card-border)" }}>
            <dt style={{ color: "var(--enroll-text-secondary)" }}>{t("transactions.transfer.effective")}</dt>
            <dd className="font-semibold" style={{ color: "var(--enroll-text-primary)" }}>{t("transactions.transfer.effectiveNextClose")}</dd>
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
              {t("transactions.transfer.understandNextClose")}
            </span>
          </label>
        )}
        {isReadOnly && (
          <p className="text-sm" style={{ color: "var(--enroll-text-secondary)" }}>
            {t("transactions.loan.submittedOrCompleted", {
              status: transaction.status === "completed" ? t("transactions.placeholder.statusCompleted") : t("transactions.placeholder.statusSubmitted"),
            })}
          </p>
        )}
      </div>
    </TransactionStepCard>
  );
};
