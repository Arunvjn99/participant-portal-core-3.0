import { DashboardCard } from "../../../../../components/dashboard/DashboardCard";
import { StepGuidance } from "../../../../../components/transactions/StepGuidance";
import type { TransactionStepProps } from "../../../../../components/transactions/TransactionApplication";

const LOAN_AMOUNT_GUIDANCE = "Choose how you would like to receive your funds securely.";

export const LoanAmountStep = ({ transaction, initialData, onDataChange }: TransactionStepProps) => {
  return (
    <div className="flex flex-col gap-6" style={{ gap: "var(--spacing-6)" }}>
      <StepGuidance>{LOAN_AMOUNT_GUIDANCE}</StepGuidance>
      <DashboardCard title="Loan Amount">
        <p style={{ color: "var(--enroll-text-secondary)" }}>Loan amount selection will be implemented here.</p>
      </DashboardCard>
    </div>
  );
};
