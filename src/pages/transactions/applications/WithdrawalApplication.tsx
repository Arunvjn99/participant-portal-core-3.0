import type { ReactNode } from "react";
import { BaseApplication } from "./BaseApplication";
import { DashboardCard } from "../../../components/dashboard/DashboardCard";
import { StepGuidance } from "../../../components/transactions/StepGuidance";
import { getStepLabels } from "../../../config/transactionSteps";

const WITHDRAWAL_GUIDANCE = [
  "Confirm your eligibility for a hardship withdrawal before proceeding.",
  "Choose how you would like to receive your funds and the amount.",
  "Review tax implications and withholding options for your situation.",
  "Confirm your selections and understand the impact on your retirement savings.",
];

export const WithdrawalApplication = () => {
  const stepLabels = getStepLabels("withdrawal");

  const renderStepContent = (currentStep: number) => {
    const guidance = WITHDRAWAL_GUIDANCE[currentStep];
    const wrap = (content: ReactNode) => (
      <div className="flex flex-col gap-6" style={{ gap: "var(--spacing-6)" }}>
        {guidance && <StepGuidance>{guidance}</StepGuidance>}
        {content}
      </div>
    );
    switch (currentStep) {
      case 0:
        return wrap(
          <DashboardCard title={stepLabels[0]}>
            <p style={{ color: "var(--enroll-text-secondary)" }}>Withdrawal application eligibility check will be implemented here.</p>
          </DashboardCard>
        );
      case 1:
        return wrap(
          <DashboardCard title={stepLabels[1]}>
            <p style={{ color: "var(--enroll-text-secondary)" }}>Withdrawal amount selection will be implemented here.</p>
          </DashboardCard>
        );
      case 2:
        return wrap(
          <DashboardCard title={stepLabels[2]}>
            <p style={{ color: "var(--enroll-text-secondary)" }}>Tax information and withholding options will be implemented here.</p>
          </DashboardCard>
        );
      case 3:
        return wrap(
          <DashboardCard title={stepLabels[3]}>
            <p style={{ color: "var(--enroll-text-secondary)" }}>Review your withdrawal details and submit your application. Summary and warnings will be displayed here.</p>
          </DashboardCard>
        );
      default:
        return null;
    }
  };

  return (
    <BaseApplication transactionType="withdrawal">
      {(currentStep) => renderStepContent(currentStep)}
    </BaseApplication>
  );
};
