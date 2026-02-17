import { DashboardCard } from "../dashboard/DashboardCard";
import type { TransactionStepProps } from "./TransactionApplication";
import { getStepLabels } from "../../config/transactionSteps";

/**
 * Generic placeholder step component for transaction flows
 * Used for transaction types that don't have specific step components yet
 */
export const PlaceholderStep = ({ transaction, currentStep, readOnly, onDataChange }: TransactionStepProps) => {
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

  return (
    <DashboardCard title={isLastStep && isReadOnly ? "Review & Confirm" : stepLabel}>
      <div className={isLastStep ? "review-step" : ""}>
        <p>{getPlaceholderContent()}</p>
        
        {isLastStep && isIrreversible && !isReadOnly && (
          <div className="review-step__warning">
            <strong>⚠️ Irreversible Action</strong>
            <p>This transaction cannot be undone once submitted. Please review all details carefully.</p>
          </div>
        )}

        {isLastStep && (
          <div className="review-step__summary">
            <p>Summary and warnings will be displayed here.</p>
          </div>
        )}

        {isLastStep && !isReadOnly && (
          <div className="review-step__confirmation">
            <label className="review-step__checkbox-label">
              <input
                type="checkbox"
                required
                className="review-step__checkbox"
                onChange={(e) => {
                  if (onDataChange) {
                    onDataChange({ confirmationAccepted: e.target.checked });
                  }
                }}
              />
              <span>I confirm that I have reviewed all details and understand the terms of this transaction.</span>
            </label>
          </div>
        )}

        {isLastStep && isReadOnly && (
          <div className="review-step__read-only-note">
            <p>This transaction has been {transaction.status === "completed" ? "completed" : "submitted for processing"}.</p>
          </div>
        )}
      </div>
    </DashboardCard>
  );
};
