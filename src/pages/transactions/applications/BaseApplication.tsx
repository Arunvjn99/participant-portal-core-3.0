import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../../layouts/DashboardLayout";
import { DashboardHeader } from "../../../components/dashboard/DashboardHeader";
import { DashboardCard } from "../../../components/dashboard/DashboardCard";
import { EnrollmentStepper } from "../../../components/enrollment/EnrollmentStepper";
import { transactionStore } from "../../../data/transactionStore";
import { getStepLabels, getTotalSteps } from "../../../config/transactionSteps";
import type { TransactionType } from "../../../types/transactions";

interface BaseApplicationProps {
  transactionType: TransactionType;
  children: (currentStep: number, setCurrentStep: (step: number) => void) => React.ReactNode;
}

/**
 * Base component for all transaction application flows
 * Handles draft creation, routing, stepper, and common layout
 */
export const BaseApplication = ({ transactionType, children }: BaseApplicationProps) => {
  const { transactionId } = useParams<{ transactionId: string }>();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  // If no transactionId, create a draft and redirect
  if (!transactionId) {
    const draft = transactionStore.createDraft(transactionType);
    navigate(`/transactions/${transactionType}/application/${draft.id}`, { replace: true });
    return null;
  }

  const transaction = transactionStore.getTransaction(transactionId);

  if (!transaction) {
    return (
      <DashboardLayout header={<DashboardHeader />}>
        <DashboardCard>
          <p>Transaction not found.</p>
        </DashboardCard>
      </DashboardLayout>
    );
  }

  const totalSteps = getTotalSteps(transactionType);
  const isLastStep = currentStep === totalSteps - 1;

  const handleNext = () => {
    if (isLastStep) {
      // TODO: Handle submission
      console.log("Submit transaction");
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveAndExit = () => {
    // Transaction is already saved as draft
    navigate("/transactions");
  };

  return (
    <DashboardLayout header={<DashboardHeader />}>
      <div className="transaction-application">
        <div className="transaction-application__header">
          <button
            type="button"
            onClick={() => navigate("/transactions")}
            className="transaction-application__back-button"
            aria-label="Back to transactions"
          >
            ← Back to Transactions
          </button>
          <h1 className="transaction-application__title">
            {getTransactionTypeLabel(transactionType)} Application
          </h1>
        </div>

        <div className="transaction-application__stepper">
          <EnrollmentStepper
            currentStep={currentStep}
            totalSteps={totalSteps}
            stepLabels={getStepLabels(transactionType)}
          />
        </div>

        <div className="transaction-application__content">
          {children(currentStep, setCurrentStep)}
        </div>

        <div className="transaction-application__footer">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="transaction-application__button transaction-application__button--back"
          >
            Back
          </button>
          <div className="transaction-application__footer-actions">
            <button
              type="button"
              onClick={handleSaveAndExit}
              className="transaction-application__button transaction-application__button--save"
            >
              Save & Exit
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="transaction-application__button transaction-application__button--next"
            >
              {isLastStep ? "Submit" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const getTransactionTypeLabel = (type: TransactionType): string => {
  switch (type) {
    case "loan":
      return "401(k) Loan";
    case "withdrawal":
      return "Hardship Withdrawal";
    case "distribution":
      return "Distribution";
    case "rollover":
      return "Rollover";
    case "transfer":
      return "Transfer Investments";
    case "rebalance":
      return "Rebalance Portfolio";
    default:
      return "Transaction";
  }
};
