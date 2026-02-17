import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { DashboardHeader } from "../dashboard/DashboardHeader";
import { EnrollmentStepper } from "../enrollment/EnrollmentStepper";
import { TransactionFlowLayout } from "./TransactionFlowLayout";
import { TransactionFlowFooter } from "./TransactionFlowFooter";
import { transactionStore } from "../../data/transactionStore";
import type { TransactionType, Transaction } from "../../types/transactions";

/**
 * Step definition for transaction application flows
 */
export interface TransactionStepDefinition {
  stepId: string;
  label: string;
  component: React.ComponentType<TransactionStepProps>;
  validate?: (data: any) => boolean | Promise<boolean>;
}

/**
 * Props passed to each step component
 */
export interface TransactionStepProps {
  currentStep: number;
  totalSteps: number;
  transaction: Transaction;
  initialData?: any;
  onDataChange?: (data: any) => void;
  readOnly?: boolean;
}

/**
 * Props for TransactionApplication component
 */
export interface TransactionApplicationProps {
  transactionType: TransactionType;
  steps: TransactionStepDefinition[];
  initialData?: any;
  /** If provided, called on submit. If it returns/resolves, component navigates to /transactions. Pass onSuccess for custom navigation with state. */
  onSubmit?: (transaction: Transaction, data: any) => void | Promise<void>;
  /** If provided, called instead of default navigate("/transactions"). Use to pass success state. */
  onSuccessNavigate?: (transaction: Transaction, data: any) => void;
  readOnly?: boolean;
}

/**
 * Generic transaction application component that handles:
 * - Stepper rendering
 * - Current step index management
 * - Next / Back / Save & Exit behavior
 * - Final submit handling
 */
export const TransactionApplication = ({
  transactionType,
  steps,
  initialData,
  onSubmit,
  onSuccessNavigate,
  readOnly: propReadOnly,
}: TransactionApplicationProps) => {
  const { t } = useTranslation();
  const { transactionId } = useParams<{ transactionId: string }>();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [stepData, setStepData] = useState<any>(initialData || {});
  const [validationError, setValidationError] = useState<string | null>(null);

  // If no transactionId, create a draft and redirect
  if (!transactionId) {
    const draft = transactionStore.createDraft(transactionType);
    navigate(`/transactions/${transactionType}/${draft.id}`, { replace: true });
    return null;
  }

  const transaction = transactionStore.getTransaction(transactionId);

  if (!transaction) {
    return (
      <DashboardLayout header={<DashboardHeader />}>
        <div className="transaction-application">
          <p>{t("transactions.transactionNotFound")}</p>
        </div>
      </DashboardLayout>
    );
  }

  // Determine read-only mode based on transaction status
  // Draft: editable (readOnly = false)
  // Active: read-only navigation only (readOnly = true)
  // Completed: fully read-only (readOnly = true)
  const readOnly = propReadOnly !== undefined 
    ? propReadOnly 
    : transaction.status !== "draft";

  const totalSteps = steps.length;
  const isLastStep = currentStep === totalSteps - 1;
  const currentStepDefinition = steps[currentStep];
  const CurrentStepComponent = currentStepDefinition.component;

  const handleNext = async () => {
    if (readOnly) {
      // In read-only mode, just navigate forward through steps
      if (!isLastStep) {
        setCurrentStep(currentStep + 1);
      }
      return;
    }

    if (isLastStep) {
      // Validate last step before submit
      if (currentStepDefinition.validate) {
        const isValid = await currentStepDefinition.validate(stepData);
        if (!isValid) {
          setValidationError("Please confirm the terms above");
          return;
        }
      }
      setValidationError(null);
      // Handle submission
      if (onSubmit) {
        await onSubmit(transaction, stepData);
      } else {
        console.log("Submit transaction", { transaction, stepData });
      }
      // Navigate to transactions hub (with optional success state)
      if (onSuccessNavigate) {
        onSuccessNavigate(transaction, stepData);
      } else {
        navigate("/transactions");
      }
    } else {
      if (currentStepDefinition.validate) {
        const isValid = await currentStepDefinition.validate(stepData);
        if (!isValid) {
          setValidationError(isLastStep ? "Please confirm the terms above" : "Please complete all required fields");
          return;
        }
      }
      setValidationError(null);
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setValidationError(null);
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveAndExit = () => {
    // Transaction is already saved as draft
    navigate("/transactions");
  };

  const handleDataChange = (data: any) => {
    if (readOnly) {
      // Prevent data changes in read-only mode
      return;
    }
    setStepData((prev: any) => ({ ...prev, ...data }));
  };

  // Build step labels for the stepper (translate keys)
  const stepLabels = steps.map((step) => t(step.label));

  const title = getTransactionTypeLabel(transactionType, t);
  const subtitle = t("transactions.stepOf", { current: currentStep + 1, total: totalSteps });

  return (
    <DashboardLayout header={<DashboardHeader />} transparentBackground>
      <TransactionFlowLayout
        title={`${title} ${t("transactions.application")}`}
        subtitle={subtitle}
        onBack={() => navigate("/transactions")}
      >
        <div className="mb-8">
          <EnrollmentStepper
            currentStep={currentStep}
            totalSteps={totalSteps}
            stepLabels={stepLabels}
          />
        </div>

        <div className="space-y-6 min-h-[400px]">
          {readOnly && (
            <div
              className="p-4 rounded-[var(--radius-lg)] border"
              style={{
                background: "var(--color-background-secondary)",
                borderColor: "var(--color-border)",
              }}
            >
              <span className="font-semibold" style={{ color: "var(--color-text)" }}>
                {transaction.status === "completed" ? t("transactions.viewOnly") : t("transactions.readOnly")}
              </span>
              {transaction.status === "active" && (
                <p className="mt-1 text-sm" style={{ color: "var(--color-text-secondary)" }}>
                  {t("transactions.processedMessage")}
                </p>
              )}
              {transaction.status === "completed" && (
                <p className="mt-1 text-sm" style={{ color: "var(--color-text-secondary)" }}>
                  {t("transactions.completedMessage")}
                </p>
              )}
            </div>
          )}
          <CurrentStepComponent
            currentStep={currentStep}
            totalSteps={totalSteps}
            transaction={transaction}
            initialData={stepData}
            onDataChange={handleDataChange}
            readOnly={readOnly}
          />
        </div>

        <TransactionFlowFooter
          currentStep={currentStep}
          totalSteps={totalSteps}
          primaryLabel={readOnly ? "Back to Transactions" : isLastStep ? "Submit" : "Next"}
          primaryDisabled={false}
          onPrimary={readOnly ? () => navigate("/transactions") : handleNext}
          onBack={handleBack}
          onSaveAndExit={handleSaveAndExit}
          summaryText={validationError ?? undefined}
          summaryError={!!validationError}
        />
      </TransactionFlowLayout>
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
