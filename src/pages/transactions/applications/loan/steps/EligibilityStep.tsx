import { DashboardCard } from "../../../../../components/dashboard/DashboardCard";
import { StepGuidance } from "../../../../../components/transactions/StepGuidance";
import type { TransactionStepProps } from "../../../../../components/transactions/TransactionApplication";

const ELIGIBILITY_GUIDANCE = "Customize your loan to balance immediate needs with long-term retirement growth.";

export const EligibilityStep = ({ transaction, initialData, onDataChange }: TransactionStepProps) => {
  return (
    <div className="flex flex-col gap-6" style={{ gap: "var(--spacing-6)" }}>
      <StepGuidance>{ELIGIBILITY_GUIDANCE}</StepGuidance>
      <DashboardCard title="Eligibility">
        <p style={{ color: "var(--enroll-text-secondary)" }}>Loan application eligibility check will be implemented here.</p>
      </DashboardCard>
    </div>
  );
};
