import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
          <p>{t("transactions.transactionNotFound")}</p>
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
            aria-label={t("transactions.backToTransactions")}
          >
            ← {t("transactions.backToTransactions")}
          </button>
          <h1 className="transaction-application__title">
            {getTransactionTypeLabel(transactionType, t)} {t("transactions.application")}
          </h1>
        </div>

        <div className="transaction-application__stepper">
          <EnrollmentStepper
            currentStep={currentStep}
            totalSteps={totalSteps}
            stepLabels={getStepLabels(transactionType).map((key) => t(key))}
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
            {t("transactions.back")}
          </button>
          <div className="transaction-application__footer-actions">
            <button
              type="button"
              onClick={handleSaveAndExit}
              className="transaction-application__button transaction-application__button--save"
            >
              {t("transactions.saveAndExit")}
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="transaction-application__button transaction-application__button--next"
            >
              {isLastStep ? t("transactions.submit") : t("transactions.next")}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const getTransactionTypeLabel = (type: TransactionType, t: (key: string) => string): string => {
  switch (type) {
    case "loan":
      return t("transactions.loanApplication");
    case "withdrawal":
      return t("transactions.withdrawalApplication");
    case "distribution":
      return t("transactions.distributionApplication");
    case "rollover":
      return t("transactions.rolloverApplication");
    case "transfer":
      return t("transactions.transferApplication");
    case "rebalance":
      return t("transactions.rebalanceApplication");
    default:
      return t("transactions.application");
  }
};
