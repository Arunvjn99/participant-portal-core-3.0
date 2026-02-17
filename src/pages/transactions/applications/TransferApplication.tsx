import type { ReactNode } from "react";
import { BaseApplication } from "./BaseApplication";
import { DashboardCard } from "../../../components/dashboard/DashboardCard";
import { StepGuidance } from "../../../components/transactions/StepGuidance";
import { getStepLabels } from "../../../config/transactionSteps";

const TRANSFER_GUIDANCE = [
  "Confirm your eligibility to transfer between investment options.",
  "Specify transfer details and effective date.",
  "Choose target investments for the transferred amount.",
  "Confirm your selections and submit the transfer.",
];

export const TransferApplication = () => {
  const stepLabels = getStepLabels("transfer");

  const renderStepContent = (currentStep: number) => {
    const guidance = TRANSFER_GUIDANCE[currentStep];
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
            <p style={{ color: "var(--enroll-text-secondary)" }}>Transfer application eligibility check will be implemented here.</p>
          </DashboardCard>
        );
      case 1:
        return wrap(
          <DashboardCard title={stepLabels[1]}>
            <p style={{ color: "var(--enroll-text-secondary)" }}>Transfer details will be implemented here.</p>
          </DashboardCard>
        );
      case 2:
        return wrap(
          <DashboardCard title={stepLabels[2]}>
            <p style={{ color: "var(--enroll-text-secondary)" }}>Investment selection will be implemented here.</p>
          </DashboardCard>
        );
      case 3:
        return wrap(
          <DashboardCard title={stepLabels[3]}>
            <p style={{ color: "var(--enroll-text-secondary)" }}>Review your transfer details and submit your application. Summary and warnings will be displayed here.</p>
          </DashboardCard>
        );
      default:
        return null;
    }
  };

  return (
    <BaseApplication transactionType="transfer">
      {(currentStep) => renderStepContent(currentStep)}
    </BaseApplication>
  );
};
