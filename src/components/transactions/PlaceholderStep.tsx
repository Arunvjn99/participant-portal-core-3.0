import { useTranslation } from "react-i18next";
import { DashboardCard } from "../dashboard/DashboardCard";
import type { TransactionStepProps } from "./TransactionApplication";
import { getStepLabels } from "../../config/transactionSteps";

/**
 * Generic placeholder step component for transaction flows
 * Used for transaction types that don't have specific step components yet
 */
export const PlaceholderStep = ({ transaction, currentStep, readOnly, onDataChange }: TransactionStepProps) => {
  const { t } = useTranslation();
  const stepLabels = getStepLabels(transaction.type);
  const stepLabelKey = stepLabels[currentStep];
  const stepLabel = stepLabelKey ? t(stepLabelKey) : t("transactions.placeholder.stepN", { n: currentStep + 1 });

  const getPlaceholderContent = () => {
    switch (transaction.type) {
      case "withdrawal":
        return currentStep === 0
          ? t("transactions.placeholder.withdrawalEligibility")
          : currentStep === 1
            ? t("transactions.placeholder.withdrawalAmount")
            : currentStep === 2
              ? t("transactions.placeholder.withdrawalTax")
              : t("transactions.placeholder.withdrawalReview");
      case "distribution":
        return currentStep === 0
          ? t("transactions.placeholder.distributionEligibility")
          : currentStep === 1
            ? t("transactions.placeholder.distributionAmount")
            : currentStep === 2
              ? t("transactions.placeholder.distributionTax")
              : t("transactions.placeholder.distributionReview");
      case "rollover":
        return currentStep === 0
          ? t("transactions.placeholder.rolloverEligibility")
          : currentStep === 1
            ? t("transactions.placeholder.rolloverAmount")
            : currentStep === 2
              ? t("transactions.placeholder.rolloverDestination")
              : t("transactions.placeholder.rolloverReview");
      case "transfer":
        return currentStep === 0
          ? t("transactions.placeholder.transferEligibility")
          : currentStep === 1
            ? t("transactions.placeholder.transferDetails")
            : currentStep === 2
              ? t("transactions.placeholder.transferInvestment")
              : t("transactions.placeholder.transferReview");
      case "rebalance":
        return currentStep === 0
          ? t("transactions.placeholder.rebalanceEligibility")
          : currentStep === 1
            ? t("transactions.placeholder.rebalanceCurrent")
            : currentStep === 2
              ? t("transactions.placeholder.rebalanceTarget")
              : t("transactions.placeholder.rebalanceReview");
      default:
        return t("transactions.placeholder.stepWillBeImplemented", { label: stepLabelKey ? t(stepLabelKey) : String(currentStep + 1) });
    }
  };

  const isLastStep = currentStep === stepLabels.length - 1;
  const isReadOnly = readOnly || transaction.status !== "draft";
  const isIrreversible = transaction.isIrreversible;

  return (
    <DashboardCard title={isLastStep && isReadOnly ? t("transactions.placeholder.reviewConfirm") : stepLabel}>
      <div className={isLastStep ? "review-step" : ""}>
        <p>{getPlaceholderContent()}</p>

        {isLastStep && isIrreversible && !isReadOnly && (
          <div className="review-step__warning">
            <strong>⚠️ {t("transactions.placeholder.irreversibleAction")}</strong>
            <p>{t("transactions.placeholder.irreversibleWarning")}</p>
          </div>
        )}

        {isLastStep && (
          <div className="review-step__summary">
            <p>{t("transactions.placeholder.summaryPlaceholder")}</p>
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
              <span>{t("transactions.placeholder.confirmReviewedTerms")}</span>
            </label>
          </div>
        )}

        {isLastStep && isReadOnly && (
          <div className="review-step__read-only-note">
            <p>
              {t("transactions.loan.submittedOrCompleted", {
                status: transaction.status === "completed" ? t("transactions.placeholder.statusCompleted") : t("transactions.placeholder.statusSubmitted"),
              })}
            </p>
          </div>
        )}
      </div>
    </DashboardCard>
  );
};
