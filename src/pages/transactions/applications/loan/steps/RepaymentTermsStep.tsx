import { DashboardCard } from "../../../../../components/dashboard/DashboardCard";
import { StepGuidance } from "../../../../../components/transactions/StepGuidance";
import type { TransactionStepProps } from "../../../../../components/transactions/TransactionApplication";

const REPAYMENT_GUIDANCE = "Review the legal disclosures carefully before proceeding.";

export const RepaymentTermsStep = ({ transaction, initialData, onDataChange }: TransactionStepProps) => {
  return (
    <div className="flex flex-col gap-6" style={{ gap: "var(--spacing-6)" }}>
      <StepGuidance>{REPAYMENT_GUIDANCE}</StepGuidance>
      <DashboardCard title="Repayment Terms">
        <p style={{ color: "var(--enroll-text-secondary)" }}>Repayment terms selection will be implemented here.</p>
      </DashboardCard>
    </div>
  );
};
