import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle2 } from "lucide-react";
import { TransactionStepCard } from "../../../../../components/transactions/TransactionStepCard";
import { RetirementImpact } from "../../../../../components/transactions/RetirementImpact";
import type { TransactionStepProps } from "../../../../../components/transactions/TransactionApplication";

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);

export const RolloverReviewStep = ({ transaction, initialData, onDataChange, readOnly }: TransactionStepProps) => {
  const { t } = useTranslation();
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
      ? t("transactions.rollover.impactLow")
      : impactLevel === "medium"
        ? t("transactions.rollover.impactMedium")
        : t("transactions.rollover.impactHigh");

  const timelineSteps = [
    { label: t("transactions.rollover.timelineRequestReceived"), detail: t("transactions.rollover.timelineRequestReceivedDetail") },
    { label: t("transactions.rollover.timelineTransfer"), detail: t("transactions.rollover.timelineTransferDetail") },
    { label: t("transactions.rollover.timelineFundsReceived"), detail: t("transactions.rollover.timelineFundsReceivedDetail") },
  ];

  return (
    <TransactionStepCard title={isReadOnly ? t("transactions.loan.reviewConfirm") : t("transactions.loan.reviewSubmit")}>
      <div className="space-y-6">
        <dl className="space-y-0">
          <div className="flex justify-between py-2 border-b" style={{ borderColor: "var(--enroll-card-border)" }}>
            <dt style={{ color: "var(--enroll-text-secondary)" }}>{t("transactions.rollover.estimatedAmount")}</dt>
            <dd className="font-semibold" style={{ color: "var(--enroll-text-primary)" }}>{formatCurrency(estimatedBalance)}</dd>
          </div>
          <div className="flex justify-between py-2 border-b" style={{ borderColor: "var(--enroll-card-border)" }}>
            <dt style={{ color: "var(--enroll-text-secondary)" }}>{t("transactions.rollover.source")}</dt>
            <dd className="font-semibold" style={{ color: "var(--enroll-text-primary)" }}>{providerName || "—"}</dd>
          </div>
          <div className="flex justify-between py-2">
            <dt style={{ color: "var(--enroll-text-secondary)" }}>{t("transactions.rollover.accountType")}</dt>
            <dd className="font-semibold" style={{ color: "var(--enroll-text-primary)" }}>{accountType}</dd>
          </div>
        </dl>

        <RetirementImpact level={impactLevel} rationale={impactRationale} />

        <div>
          <p className="text-sm font-semibold mb-3" style={{ color: "var(--enroll-text-primary)" }}>{t("transactions.loan.whatHappensNext")}</p>
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
              {t("transactions.rollover.confirmDirectRollover")}
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
