import { useTranslation } from "react-i18next";
import { DashboardCard } from "../../../../../components/dashboard/DashboardCard";
import { StepGuidance } from "../../../../../components/transactions/StepGuidance";
import type { TransactionStepProps } from "../../../../../components/transactions/TransactionApplication";

export const RepaymentTermsStep = ({ transaction, initialData, onDataChange }: TransactionStepProps) => {
  const { t } = useTranslation("transactions");
  return (
    <div className="flex flex-col gap-6" style={{ gap: "var(--spacing-6)" }}>
      <StepGuidance>{t("loan.guidance.repaymentTerms")}</StepGuidance>
      <DashboardCard title={t("loan.sections.repaymentTerm")}>
        <p style={{ color: "var(--enroll-text-secondary)" }}>{t("placeholder.repaymentTerms")}</p>
      </DashboardCard>
    </div>
  );
};
