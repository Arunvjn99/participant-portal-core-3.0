import type { ReactNode } from "react";
import { BaseApplication } from "./BaseApplication";
import { DashboardCard } from "../../../components/dashboard/DashboardCard";
import { StepGuidance } from "../../../components/transactions/StepGuidance";
import { getStepLabels } from "../../../config/transactionSteps";

const ROLLOVER_GUIDANCE = [
  "Confirm your eligibility and understand rollover rules.",
  "Choose the amount and source of funds to roll over.",
  "Enter destination account details for a direct rollover.",
  "Confirm your selections and understand the tax treatment.",
];

export const RolloverApplication = () => {
  const stepLabels = getStepLabels("rollover");

  const renderStepContent = (currentStep: number) => {
    const guidance = ROLLOVER_GUIDANCE[currentStep];
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
            <p style={{ color: "var(--enroll-text-secondary)" }}>Rollover application eligibility check will be implemented here.</p>
          </DashboardCard>
        );
      case 1:
        return wrap(
          <DashboardCard title={stepLabels[1]}>
            <p style={{ color: "var(--enroll-text-secondary)" }}>Rollover amount selection will be implemented here.</p>
          </DashboardCard>
        );
      case 2:
        return wrap(
          <DashboardCard title={stepLabels[2]}>
            <p style={{ color: "var(--enroll-text-secondary)" }}>Destination account information will be implemented here.</p>
          </DashboardCard>
        );
      case 3:
        return wrap(
          <DashboardCard title={stepLabels[3]}>
            <p style={{ color: "var(--enroll-text-secondary)" }}>Review your rollover details and submit your application. Summary and warnings will be displayed here.</p>
          </DashboardCard>
        );
      default:
        return null;
    }
  };

  return (
    <BaseApplication transactionType="rollover">
      {(currentStep) => renderStepContent(currentStep)}
    </BaseApplication>
  );
};
