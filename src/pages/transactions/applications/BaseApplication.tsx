import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { DashboardLayout } from "../../../layouts/DashboardLayout";
import { DashboardHeader } from "../../../components/dashboard/DashboardHeader";
import { EnrollmentStepper } from "../../../components/enrollment/EnrollmentStepper";
import { transactionStore } from "../../../data/transactionStore";
import { getStepLabelKeys, getTotalSteps } from "../../../config/transactionSteps";
import type { TransactionType } from "../../../types/transactions";

interface BaseApplicationProps {
  transactionType: TransactionType;
  children: (currentStep: number, setCurrentStep: (step: number) => void) => React.ReactNode;
}

/**
 * Base component for all transaction application flows.
 * Uses same enrollment shell as TransactionApplication (tokens, stepper, sticky footer).
 */
export const BaseApplication = ({ transactionType, children }: BaseApplicationProps) => {
  const { transactionId } = useParams<{ transactionId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation(["dashboard", "transactions", "common"]);
  const [currentStep, setCurrentStep] = useState(0);

  if (!transactionId) {
    const draft = transactionStore.createDraft(transactionType);
    navigate(`/transactions/${transactionType}/application/${draft.id}`, { replace: true });
    return null;
  }

  const transaction = transactionStore.getTransaction(transactionId);

  if (!transaction) {
    return (
      <DashboardLayout header={<DashboardHeader />}>
        <div className="mx-auto max-w-7xl px-4 py-8" style={{ color: "var(--enroll-text-primary)" }}>
          <p>{t("dashboard:transactionNotFound")}</p>
        </div>
      </DashboardLayout>
    );
  }

  const totalSteps = getTotalSteps(transactionType);
  const isLastStep = currentStep === totalSteps - 1;
  const stepLabels = getStepLabelKeys(transactionType).map((key) => t(`transactions:${key}`));

  const handleNext = () => {
    if (isLastStep) {
      console.log("Submit transaction");
      navigate("/transactions");
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleSaveAndExit = () => {
    navigate("/transactions");
  };

  return (
    <DashboardLayout header={<DashboardHeader />}>
      <div className="flex min-h-screen flex-col" style={{ background: "var(--enroll-bg)" }}>
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
              aria-label={t("common:buttons.backToTransactions")}
            >
              ← {t("common:buttons.backToTransactions")}
            </button>
            <h1
              className="text-xl font-semibold md:text-2xl"
              style={{ color: "var(--enroll-text-primary)" }}
            >
              {t(`transactions:applications.${transactionType}`)}
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

        <div className="flex-1 px-4 py-6 md:px-6 md:py-8" style={{ gap: "var(--spacing-8)" }}>
          <div className="mx-auto max-w-7xl flex flex-col gap-8">
            {children(currentStep, setCurrentStep)}
          </div>
        </div>

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
              aria-label={t("common:labels.previousStep")}
            >
              {t("common:buttons.back")}
            </button>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleSaveAndExit}
                className="rounded-xl border px-6 py-3 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{
                  borderColor: "var(--enroll-card-border)",
                  background: "var(--enroll-card-bg)",
                  color: "var(--enroll-text-primary)",
                }}
                aria-label={t("common:buttons.saveAndExit")}
              >
                {t("common:buttons.saveAndExit")}
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="rounded-xl px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ background: "var(--enroll-brand)" }}
                aria-label={isLastStep ? t("common:buttons.submit") : t("common:labels.nextStep")}
              >
                {isLastStep ? t("common:buttons.submit") : t("common:buttons.next")}
              </button>
            </div>
          </div>
        </footer>
      </div>
    </DashboardLayout>
  );
};
