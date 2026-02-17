import { useTranslation } from "react-i18next";
import { DashboardCard } from "../dashboard/DashboardCard";
import { StepGuidance } from "./StepGuidance";
import type { TransactionStepProps } from "./TransactionApplication";
import { getStepLabelKeys } from "../../config/transactionSteps";
import type { TransactionType } from "../../types/transactions";

/** Guidance key path per type and step index (e.g. "withdrawal.guidance.eligibility"). */
const GUIDANCE_KEYS: Partial<Record<TransactionType, string[]>> = {
  withdrawal: ["withdrawal.guidance.eligibility", "withdrawal.guidance.amount", "withdrawal.guidance.tax", "withdrawal.guidance.review"],
  distribution: ["distribution.guidance.eligibility", "distribution.guidance.amount", "distribution.guidance.tax", "distribution.guidance.review"],
  rollover: ["rollover.guidance.eligibility", "rollover.guidance.amount", "rollover.guidance.destination", "rollover.guidance.review"],
  transfer: ["transfer.guidance.eligibility", "transfer.guidance.details", "transfer.guidance.investment", "transfer.guidance.review"],
  rebalance: ["rebalance.guidance.eligibility", "rebalance.guidance.current", "rebalance.guidance.target", "rebalance.guidance.review"],
};

/** Placeholder content key per type and step index. */
const PLACEHOLDER_KEYS: Partial<Record<TransactionType, string[]>> = {
  withdrawal: ["placeholder.withdrawalEligibility", "placeholder.withdrawalAmount", "placeholder.taxInfo", "placeholder.reviewWithdrawal"],
  distribution: ["placeholder.distributionEligibility", "placeholder.distributionAmount", "placeholder.taxInfo", "placeholder.reviewDistribution"],
  rollover: ["placeholder.rolloverEligibility", "placeholder.rolloverAmount", "placeholder.destinationAccount", "placeholder.reviewRollover"],
  transfer: ["placeholder.transferEligibility", "placeholder.transferDetails", "placeholder.investmentSelection", "placeholder.reviewTransfer"],
  rebalance: ["placeholder.rebalanceEligibility", "placeholder.currentAllocation", "placeholder.targetAllocation", "placeholder.reviewRebalance"],
};

/**
 * Generic placeholder step for transaction flows (withdrawal, rollover, transfer, etc.).
 * Uses Enrollment StepGuidance and token-based styling.
 */
export const PlaceholderStep = ({
  transaction,
  currentStep,
  readOnly,
  onDataChange,
}: TransactionStepProps) => {
  const { t } = useTranslation("transactions");
  const stepKeys = getStepLabelKeys(transaction.type);
  const stepLabelKey = stepKeys[currentStep];
  const stepLabel = stepLabelKey ? t(stepLabelKey) : `Step ${currentStep + 1}`;
  const guidanceKeys = GUIDANCE_KEYS[transaction.type];
  const guidance = guidanceKeys?.[currentStep] ? t(guidanceKeys[currentStep]) : null;
  const placeholderKeys = PLACEHOLDER_KEYS[transaction.type];
  const placeholderContent = placeholderKeys?.[currentStep]
    ? t(placeholderKeys[currentStep])
    : t("placeholder.stepImplemented", { stepLabel });

  const isLastStep = currentStep === stepKeys.length - 1;
  const isReadOnly = readOnly || transaction.status !== "draft";
  const isIrreversible = transaction.isIrreversible;

  return (
    <div className="flex flex-col gap-6" style={{ gap: "var(--spacing-6)" }}>
      {guidance && <StepGuidance>{guidance}</StepGuidance>}
      <DashboardCard title={isLastStep && isReadOnly ? t("loan.sections.reviewConfirm") : stepLabel}>
        <div className="flex flex-col gap-4" style={{ gap: "var(--spacing-4)", color: "var(--enroll-text-primary)" }}>
          <p style={{ color: "var(--enroll-text-secondary)" }}>{placeholderContent}</p>

          {isLastStep && isIrreversible && !isReadOnly && (
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

          {isLastStep && (
            <p style={{ color: "var(--enroll-text-secondary)" }}>{t("shared.summaryPlaceholder")}</p>
          )}

          {isLastStep && !isReadOnly && (
            <label className="flex cursor-pointer items-start gap-3 text-sm">
              <input
                type="checkbox"
                required
                className="mt-0.5 rounded border-[var(--enroll-card-border)] focus:ring-2 focus:ring-[var(--enroll-brand)]"
                style={{ accentColor: "var(--enroll-brand)" }}
                onChange={(e) => {
                  if (onDataChange) onDataChange({ confirmationAccepted: e.target.checked });
                }}
              />
              <span style={{ color: "var(--enroll-text-primary)" }}>
                {t("shared.confirmCheckbox")}
              </span>
            </label>
          )}

          {isLastStep && isReadOnly && (
            <p className="text-sm" style={{ color: "var(--enroll-text-secondary)" }}>
              {transaction.status === "completed" ? t("shared.completedNote") : t("shared.submittedNote")}
            </p>
          )}
        </div>
      </DashboardCard>
    </div>
  );
};
