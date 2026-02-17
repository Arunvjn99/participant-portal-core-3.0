import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { DashboardHeader } from "../dashboard/DashboardHeader";
import { EnrollmentStepper } from "../enrollment/EnrollmentStepper";
import { DashboardCard } from "../dashboard/DashboardCard";
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
  onSubmit?: (transaction: Transaction, data: any) => void | Promise<void>;
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
  readOnly: propReadOnly,
}: TransactionApplicationProps) => {
  const { transactionId } = useParams<{ transactionId: string }>();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [stepData, setStepData] = useState<any>(initialData || {});

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
        <div className="mx-auto max-w-7xl px-4 py-8" style={{ color: "var(--enroll-text-primary)" }}>
          <p>Transaction not found.</p>
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
      // Handle submission
      if (onSubmit) {
        await onSubmit(transaction, stepData);
      } else {
        // Default submit behavior
        console.log("Submit transaction", { transaction, stepData });
      }
      // Navigate to transactions hub after submission
      navigate("/transactions");
    } else {
      // Optional: Validate before proceeding
      if (currentStepDefinition.validate) {
        const isValid = await currentStepDefinition.validate(stepData);
        if (!isValid) {
          return; // Stay on current step if validation fails
        }
      }
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

  const handleDataChange = (data: any) => {
    if (readOnly) {
      // Prevent data changes in read-only mode
      return;
    }
    setStepData((prev: any) => ({ ...prev, ...data }));
  };

  const stepLabels = steps.map((step) => step.label);
  const isLoan = transactionType === "loan";

  return (
    <DashboardLayout header={<DashboardHeader />}>
      <div
        className="flex min-h-screen flex-col"
        style={{ background: "var(--enroll-bg)" }}
      >
        {/* Page header — enrollment spacing */}
        <div
          className="border-b px-4 py-4 md:px-6"
          style={{
            borderColor: "var(--enroll-card-border)",
            background: "var(--enroll-card-bg)",
            boxShadow: "var(--enroll-elevation-1)",
          }}
        >
          <div className="mx-auto max-w-7xl">
            <button
              type="button"
              onClick={() => navigate("/transactions")}
              className="mb-2 text-sm font-medium hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ color: "var(--enroll-brand)" }}
              aria-label="Back to transactions"
            >
              ← Back to Transactions
            </button>
            <h1
              className="text-xl font-semibold md:text-2xl"
              style={{ color: "var(--enroll-text-primary)" }}
            >
              {getTransactionTypeLabel(transactionType)} Application
            </h1>
            <div className="mt-4">
              <EnrollmentStepper
                currentStep={currentStep}
                totalSteps={totalSteps}
                stepLabels={stepLabels}
              />
            </div>
          </div>
        </div>

        {/* Main content — grid for loan (8+4), single column otherwise */}
        <div className="flex-1 px-4 py-6 md:px-6 md:py-8" style={{ gap: "var(--spacing-8)" }}>
          <div
            className={`mx-auto max-w-7xl ${isLoan ? "grid gap-8 lg:grid-cols-12 lg:gap-8" : "flex flex-col gap-8"}`}
          >
            <div className={isLoan ? "lg:col-span-8" : "flex flex-col gap-6"}>
              {readOnly && (
                <div
                  className="mb-4 rounded-2xl border p-4"
                  style={{
                    borderColor: "var(--enroll-card-border)",
                    background: "var(--enroll-soft-bg)",
                    color: "var(--enroll-text-primary)",
                  }}
                >
                  <span className="font-semibold">
                    {transaction.status === "completed" ? "View Only" : "Read Only"}
                  </span>
                  {transaction.status === "active" && (
                    <p className="mt-1 text-sm" style={{ color: "var(--enroll-text-secondary)" }}>
                      This transaction is being processed. You can view details but cannot make changes.
                    </p>
                  )}
                  {transaction.status === "completed" && (
                    <p className="mt-1 text-sm" style={{ color: "var(--enroll-text-secondary)" }}>
                      This transaction has been completed. You can view details and documents.
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

            {isLoan && (
              <aside className="lg:col-span-4">
                <DashboardCard title="Loan summary">
                  <p className="text-sm" style={{ color: "var(--enroll-text-secondary)" }}>
                    Your loan details and projected payments will appear here as you complete each step.
                  </p>
                </DashboardCard>
              </aside>
            )}
          </div>
        </div>

        {/* Sticky footer — enrollment CTA layout */}
        <footer
          className="sticky bottom-0 border-t px-4 py-4 md:px-6"
          style={{
            borderColor: "var(--enroll-card-border)",
            background: "var(--enroll-card-bg)",
            boxShadow: "var(--enroll-elevation-1)",
          }}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="rounded-xl border px-6 py-3 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                borderColor: "var(--enroll-card-border)",
                background: "var(--enroll-card-bg)",
                color: "var(--enroll-text-primary)",
              }}
              aria-label="Previous step"
            >
              Back
            </button>
            <div className="flex gap-3">
              {!readOnly && (
                <button
                  type="button"
                  onClick={handleSaveAndExit}
                  className="rounded-xl border px-6 py-3 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{
                    borderColor: "var(--enroll-card-border)",
                    background: "var(--enroll-card-bg)",
                    color: "var(--enroll-text-primary)",
                  }}
                  aria-label="Save and exit"
                >
                  Save & Exit
                </button>
              )}
              {readOnly ? (
                <button
                  type="button"
                  onClick={() => navigate("/transactions")}
                  className="rounded-xl px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{ background: "var(--enroll-brand)" }}
                  aria-label="Back to transactions"
                >
                  Back to Transactions
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="rounded-xl px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{ background: "var(--enroll-brand)" }}
                  aria-label={isLastStep ? "Submit" : "Next step"}
                >
                  {isLastStep ? "Submit" : "Next"}
                </button>
              )}
            </div>
          </div>
        </footer>
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
