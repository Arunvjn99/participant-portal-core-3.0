import { useParams, useNavigate, Navigate } from "react-router-dom";
import { TransactionApplication } from "../../../components/transactions/TransactionApplication";
import type { TransactionStepDefinition } from "../../../components/transactions/TransactionApplication";
import type { TransactionType } from "../../../types/transactions";
import type { Transaction } from "../../../types/transactions";
import { transactionStore } from "../../../data/transactionStore";
import { ACCOUNT_OVERVIEW } from "../../../data/accountOverview";
import { getStepLabels } from "../../../config/transactionSteps";

// Loan steps
import { EligibilityStep } from "./loan/steps/EligibilityStep";
import { LoanAmountStep } from "./loan/steps/LoanAmountStep";
import { RepaymentTermsStep } from "./loan/steps/RepaymentTermsStep";
import { ReviewStep } from "./loan/steps/ReviewStep";

// Withdrawal steps
import { WithdrawalEligibilityStep } from "./withdrawal/steps/WithdrawalEligibilityStep";
import { WithdrawalAmountStep } from "./withdrawal/steps/WithdrawalAmountStep";
import { WithdrawalTaxStep } from "./withdrawal/steps/WithdrawalTaxStep";
import { WithdrawalReviewStep } from "./withdrawal/steps/WithdrawalReviewStep";

// Transfer steps
import { TransferEligibilityStep } from "./transfer/steps/TransferEligibilityStep";
import { TransferDetailsStep } from "./transfer/steps/TransferDetailsStep";
import { TransferInvestmentStep } from "./transfer/steps/TransferInvestmentStep";
import { TransferReviewStep } from "./transfer/steps/TransferReviewStep";

// Rollover steps
import { RolloverEligibilityStep } from "./rollover/steps/RolloverEligibilityStep";
import { RolloverAmountStep } from "./rollover/steps/RolloverAmountStep";
import { RolloverDestinationStep } from "./rollover/steps/RolloverDestinationStep";
import { RolloverReviewStep } from "./rollover/steps/RolloverReviewStep";

// Placeholder for distribution, rebalance
import { PlaceholderStep } from "../../../components/transactions/PlaceholderStep";

/**
 * Get step definitions for a transaction type
 */
const getStepDefinitions = (type: TransactionType): TransactionStepDefinition[] => {
  const stepLabels = getStepLabels(type);

  switch (type) {
    case "loan": {
      const moneyFlowValid = (data: any) => {
        const method = data?.paymentMethod ?? "EFT";
        if (method === "Check") return true;
        const routing = String(data?.routingNumber ?? "").replace(/\D/g, "");
        const account = String(data?.accountNumber ?? "").replace(/\D/g, "");
        return routing.length === 9 && account.length >= 4 && account.length <= 17;
      };
      const complianceValid = (data: any) =>
        !!(data?.agreedToTerms && data?.agreedToDisclosures && data?.spousalConsent);
      return [
        { stepId: "eligibility", label: stepLabels[0], component: EligibilityStep },
        { stepId: "loan-amount", label: stepLabels[1], component: LoanAmountStep, validate: moneyFlowValid },
        { stepId: "repayment-terms", label: stepLabels[2], component: RepaymentTermsStep, validate: complianceValid },
        {
          stepId: "review-submit",
          label: stepLabels[3],
          component: ReviewStep,
          validate: (data) => !!data?.confirmationAccepted,
        },
      ];
    }
    case "withdrawal":
    case "distribution": {
      const withdrawalMax = Math.floor(ACCOUNT_OVERVIEW.vestedBalance * 0.25);
      const withdrawalAmountValid = (data: any) => {
        const a = typeof data?.amount === "number" ? data.amount : 0;
        return a >= 100 && a <= withdrawalMax;
      };
      return [
        { stepId: "eligibility", label: stepLabels[0], component: WithdrawalEligibilityStep },
        { stepId: "amount", label: stepLabels[1], component: WithdrawalAmountStep, validate: withdrawalAmountValid },
        { stepId: "tax", label: stepLabels[2], component: WithdrawalTaxStep },
        {
          stepId: "review",
          label: stepLabels[3],
          component: WithdrawalReviewStep,
          validate: (data) => !!data?.confirmationAccepted,
        },
      ];
    }
    case "transfer":
    case "rebalance":
      return [
        { stepId: "eligibility", label: stepLabels[0], component: TransferEligibilityStep },
        { stepId: "details", label: stepLabels[1], component: TransferDetailsStep },
        { stepId: "investment", label: stepLabels[2], component: TransferInvestmentStep },
        {
          stepId: "review",
          label: stepLabels[3],
          component: TransferReviewStep,
          validate: (data) => !!data?.confirmationAccepted,
        },
      ];
    case "rollover": {
      const rolloverAmountValid = (data: any) => {
        const a = typeof data?.estimatedBalance === "number" ? data.estimatedBalance : typeof data?.amount === "number" ? data.amount : 0;
        return a >= 1;
      };
      const rolloverDestinationValid = (data: any) => (data?.providerName ?? "").trim().length >= 2;
      return [
        { stepId: "eligibility", label: stepLabels[0], component: RolloverEligibilityStep },
        { stepId: "amount", label: stepLabels[1], component: RolloverAmountStep, validate: rolloverAmountValid },
        { stepId: "destination", label: stepLabels[2], component: RolloverDestinationStep, validate: rolloverDestinationValid },
        {
          stepId: "review",
          label: stepLabels[3],
          component: RolloverReviewStep,
          validate: (data) => !!data?.confirmationAccepted,
        },
      ];
    }
    default:
      return stepLabels.map((label, index) => ({
        stepId: `step-${index}`,
        label,
        component: PlaceholderStep,
      }));
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

  if (!transactionType) {
    return <Navigate to="/transactions" replace />;
  }

  // Validate transaction type
  const validTypes: TransactionType[] = ["loan", "withdrawal", "distribution", "rollover", "transfer", "rebalance"];
  if (!validTypes.includes(transactionType)) {
    return <Navigate to="/transactions" replace />;
  }

  const steps = getStepDefinitions(transactionType);

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

  const navigate = useNavigate();

  const handleSubmit = async (transaction: Transaction, data: Record<string, unknown>) => {
    let amount: number;
    let rationale: string;
    switch (transaction.type) {
      case "loan":
        amount = typeof data?.amount === "number" ? data.amount : transaction.amount ?? 0;
        rationale = "Loan repayment schedule in place. Impact will be recalculated after disbursement.";
        break;
      case "withdrawal":
      case "distribution":
        amount = typeof data?.amount === "number" ? data.amount : transaction.amount ?? 0;
        rationale = "Withdrawal reduces invested balance. Impact will be recalculated after processing.";
        break;
      case "rollover":
        amount = typeof data?.estimatedBalance === "number" ? data.estimatedBalance : typeof data?.amount === "number" ? data.amount : transaction.amount ?? 0;
        rationale = "Rollover will increase balance once funds are received. Impact will be updated after completion.";
        break;
      default:
        amount = typeof data?.amount === "number" ? data.amount : transaction.amount ?? 0;
        rationale = "Impact will be recalculated after processing.";
    }
    transactionStore.updateTransaction(transaction.id, {
      amount,
      status: "active",
      retirementImpact: { level: "low", rationale },
    });
  };

  const handleSuccessNavigate = (transaction: Transaction, data: Record<string, unknown>) => {
    const typeMap: Record<string, string> = {
      loan: "Loan",
      withdrawal: "Withdrawal",
      distribution: "Withdrawal",
      transfer: "Transfer",
      rebalance: "Transfer",
      rollover: "Rollover",
    };
    const successType = typeMap[transaction.type] ?? "Transaction";
    const amount = typeof data?.amount === "number" ? data.amount : (transaction.amount as number | undefined);
    navigate("/transactions", { state: { success: { type: successType, amount } } });
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
      onSuccessNavigate={handleSuccessNavigate}
      readOnly={readOnly}
    />
  );
};
