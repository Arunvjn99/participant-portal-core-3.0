import { DashboardCard } from "../dashboard/DashboardCard";
import { StepGuidance } from "./StepGuidance";
import type { TransactionStepProps } from "./TransactionApplication";
import { getStepLabels } from "../../config/transactionSteps";
import type { TransactionType } from "../../types/transactions";

/** Human engagement messages per transaction type and step index (0 = first step, etc.). */
const STEP_GUIDANCE: Partial<Record<TransactionType, string[]>> = {
  withdrawal: [
    "Confirm your eligibility for a hardship withdrawal before proceeding.",
    "Choose how you would like to receive your funds and the amount.",
    "Review tax implications and withholding options for your situation.",
    "Confirm your selections and understand the impact on your retirement savings.",
  ],
  distribution: [
    "Confirm your eligibility for a distribution.",
    "Select the distribution amount and method.",
    "Review tax withholding and reporting options.",
    "Confirm your selections and submit your request.",
  ],
  rollover: [
    "Confirm your eligibility and understand rollover rules.",
    "Choose the amount and source of funds to roll over.",
    "Enter destination account details for a direct rollover.",
    "Confirm your selections and understand the tax treatment.",
  ],
  transfer: [
    "Confirm your eligibility to transfer between investment options.",
    "Specify transfer details and effective date.",
    "Choose target investments for the transferred amount.",
    "Confirm your selections and submit the transfer.",
  ],
  rebalance: [
    "Review your current allocation and rebalance goals.",
    "See how your current investments are allocated.",
    "Set your target allocation across funds.",
    "Confirm your selections and submit the rebalance.",
  ],
};

function getGuidanceMessage(transactionType: TransactionType, currentStep: number): string | null {
  const messages = STEP_GUIDANCE[transactionType];
  return messages?.[currentStep] ?? null;
}

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
  const stepLabels = getStepLabels(transaction.type);
  const stepLabel = stepLabels[currentStep] || `Step ${currentStep + 1}`;

  const getPlaceholderContent = () => {
    switch (transaction.type) {
      case "withdrawal":
        return currentStep === 0
          ? "Withdrawal application eligibility check will be implemented here."
          : currentStep === 1
            ? "Withdrawal amount selection will be implemented here."
            : currentStep === 2
              ? "Tax information and withholding options will be implemented here."
              : "Review your withdrawal details and submit your application.";
      case "distribution":
        return currentStep === 0
          ? "Distribution application eligibility check will be implemented here."
          : currentStep === 1
            ? "Distribution amount selection will be implemented here."
            : currentStep === 2
              ? "Tax withholding options will be implemented here."
              : "Review your distribution details and submit your application.";
      case "rollover":
        return currentStep === 0
          ? "Rollover application eligibility check will be implemented here."
          : currentStep === 1
            ? "Rollover amount selection will be implemented here."
            : currentStep === 2
              ? "Destination account selection will be implemented here."
              : "Review your rollover details and submit your application.";
      case "transfer":
        return currentStep === 0
          ? "Transfer application eligibility check will be implemented here."
          : currentStep === 1
            ? "Transfer details will be implemented here."
            : currentStep === 2
              ? "Investment selection will be implemented here."
              : "Review your transfer details and submit your application.";
      case "rebalance":
        return currentStep === 0
          ? "Rebalance application eligibility check will be implemented here."
          : currentStep === 1
            ? "Current allocation review will be implemented here."
            : currentStep === 2
              ? "Target allocation selection will be implemented here."
              : "Review your rebalance details and submit your application.";
      default:
        return `${stepLabel} step will be implemented here.`;
    }
  };

  const isLastStep = currentStep === stepLabels.length - 1;
  const isReadOnly = readOnly || transaction.status !== "draft";
  const isIrreversible = transaction.isIrreversible;
  const guidance = getGuidanceMessage(transaction.type, currentStep);

  return (
    <div className="flex flex-col gap-6" style={{ gap: "var(--spacing-6)" }}>
      {guidance && <StepGuidance>{guidance}</StepGuidance>}
      <DashboardCard title={isLastStep && isReadOnly ? "Review & Confirm" : stepLabel}>
        <div className="flex flex-col gap-4" style={{ gap: "var(--spacing-4)", color: "var(--enroll-text-primary)" }}>
          <p style={{ color: "var(--enroll-text-secondary)" }}>{getPlaceholderContent()}</p>

          {isLastStep && isIrreversible && !isReadOnly && (
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

          {isLastStep && (
            <p style={{ color: "var(--enroll-text-secondary)" }}>Summary and warnings will be displayed here.</p>
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
                I confirm that I have reviewed all details and understand the terms of this transaction.
              </span>
            </label>
          )}

          {isLastStep && isReadOnly && (
            <p className="text-sm" style={{ color: "var(--enroll-text-secondary)" }}>
              This transaction has been {transaction.status === "completed" ? "completed" : "submitted for processing"}.
            </p>
          )}
        </div>
      </DashboardCard>
    </div>
  );
};
