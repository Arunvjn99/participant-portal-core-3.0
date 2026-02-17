import { useTranslation } from "react-i18next";
import { DashboardCard } from "../../../../../components/dashboard/DashboardCard";
import { StepGuidance } from "../../../../../components/transactions/StepGuidance";
import type { TransactionStepProps } from "../../../../../components/transactions/TransactionApplication";

export const ReviewStep = ({ transaction, initialData, onDataChange, readOnly }: TransactionStepProps) => {
  const { t } = useTranslation("transactions");
  const isReadOnly = readOnly || transaction.status !== "draft";
  const isIrreversible = transaction.isIrreversible;

  return (
    <div className="flex flex-col gap-6" style={{ gap: "var(--spacing-6)" }}>
      <StepGuidance>{t("loan.guidance.review")}</StepGuidance>
      <DashboardCard title={isReadOnly ? t("loan.sections.reviewConfirm") : t("loan.sections.reviewSubmit")}>
        <div className="flex flex-col gap-4" style={{ gap: "var(--spacing-4)", color: "var(--enroll-text-primary)" }}>
          <p style={{ color: "var(--enroll-text-secondary)" }}>{t("shared.summaryPlaceholder")}</p>

          {isIrreversible && !isReadOnly && (
            <div
              className="rounded-xl border p-4"
              style={{
                borderColor: "var(--color-warning)",
                background: "var(--color-warning-light)",
                color: "var(--enroll-text-primary)",
              }}
            >
              <strong>⚠️ {t("shared.irreversibleWarning")}</strong>
              <p className="mt-1 text-sm">{t("shared.irreversibleMessage")}</p>
            </div>
          )}

          <div>
            <p style={{ color: "var(--enroll-text-secondary)" }}>{t("shared.summaryPlaceholder")}</p>
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
              <span style={{ color: "var(--enroll-text-primary)" }}>{t("shared.confirmCheckbox")}</span>
            </label>
          )}

          {isReadOnly && (
            <p className="text-sm" style={{ color: "var(--enroll-text-secondary)" }}>
              {transaction.status === "completed" ? t("shared.completedNote") : t("shared.submittedNote")}
            </p>
          )}
        </div>
      </DashboardCard>
    </div>
  );
};
