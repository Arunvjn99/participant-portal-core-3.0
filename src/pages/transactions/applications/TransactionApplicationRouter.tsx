import { useParams, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { TransactionApplication } from "../../../components/transactions/TransactionApplication";
import type { TransactionStepDefinition } from "../../../components/transactions/TransactionApplication";
import type { TransactionType } from "../../../types/transactions";
import type { Transaction } from "../../../types/transactions";
import { transactionStore } from "../../../data/transactionStore";
import { getStepLabelKeys } from "../../../config/transactionSteps";

// Loan-specific steps
import { EligibilityStep } from "./loan/steps/EligibilityStep";
import { LoanAmountStep } from "./loan/steps/LoanAmountStep";
import { RepaymentTermsStep } from "./loan/steps/RepaymentTermsStep";
import { ReviewStep } from "./loan/steps/ReviewStep";

// Placeholder step for other transaction types
import { PlaceholderStep } from "../../../components/transactions/PlaceholderStep";

/**
 * Get step definitions for a transaction type with translated labels
 */
const getStepDefinitions = (
  type: TransactionType,
  t: (key: string) => string
): TransactionStepDefinition[] => {
  const stepKeys = getStepLabelKeys(type);
  const stepLabels = stepKeys.map((key) => t(key));

  switch (type) {
    case "loan":
      return [
        { stepId: "eligibility", label: stepLabels[0], component: EligibilityStep },
        { stepId: "loan-amount", label: stepLabels[1], component: LoanAmountStep },
        { stepId: "repayment-terms", label: stepLabels[2], component: RepaymentTermsStep },
        { stepId: "review-submit", label: stepLabels[3], component: ReviewStep },
      ];
    case "withdrawal":
    case "distribution":
    case "rollover":
    case "transfer":
    case "rebalance":
      return stepLabels.map((label, index) => ({
        stepId: `step-${index}`,
        label,
        component: PlaceholderStep,
      }));
    default:
      return [];
  }
};

/**
 * Generic router component for transaction applications
 * Handles routing for /transactions/:transactionType/start and /transactions/:transactionType/:transactionId
 */
export const TransactionApplicationRouter = () => {
  const { transactionType, transactionId } = useParams<{
    transactionType: TransactionType;
    transactionId?: string;
  }>();
  const { t } = useTranslation("transactions");

  if (!transactionType) {
    return <Navigate to="/transactions" replace />;
  }

  const validTypes: TransactionType[] = ["loan", "withdrawal", "distribution", "rollover", "transfer", "rebalance"];
  if (!validTypes.includes(transactionType)) {
    return <Navigate to="/transactions" replace />;
  }

  const steps = getStepDefinitions(transactionType, t);

  // Handle "start" route - create draft and redirect
  if (!transactionId || transactionId === "start") {
    const draft = transactionStore.createDraft(transactionType);
    return <Navigate to={`/transactions/${transactionType}/${draft.id}`} replace />;
  }

  // Handle existing transaction - verify it exists
  const transaction = transactionStore.getTransaction(transactionId);
  if (!transaction) {
    return <Navigate to="/transactions" replace />;
  }

  // Verify transaction type matches
  if (transaction.type !== transactionType) {
    return <Navigate to="/transactions" replace />;
  }

  const handleSubmit = async (_transaction: Transaction, _data: Record<string, unknown>) => {
    // TODO: Implement actual submission logic (API call)
  };

  // Determine read-only mode based on transaction status
  // Draft: editable (readOnly = false)
  // Active/Completed: read-only (readOnly = true)
  const readOnly = transaction.status !== "draft";

  return (
    <TransactionApplication
      transactionType={transactionType}
      steps={steps}
      onSubmit={handleSubmit}
      readOnly={readOnly}
    />
  );
};
