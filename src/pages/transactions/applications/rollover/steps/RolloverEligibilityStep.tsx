import { useTranslation } from "react-i18next";
import { CheckCircle2 } from "lucide-react";
import { TransactionStepCard } from "../../../../../components/transactions/TransactionStepCard";
import { ACCOUNT_OVERVIEW } from "../../../../../data/accountOverview";
import type { TransactionStepProps } from "../../../../../components/transactions/TransactionApplication";

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);

export const RolloverEligibilityStep = ({ readOnly }: TransactionStepProps) => {
  const { t } = useTranslation();
  if (readOnly) {
    return (
      <TransactionStepCard title={t("transactions.rollover.eligibility")}>
        <p className="text-sm" style={{ color: "var(--enroll-text-secondary)" }}>
          {t("transactions.rollover.currentBalanceReadOnly", { amount: formatCurrency(ACCOUNT_OVERVIEW.totalBalance) })}
        </p>
      </TransactionStepCard>
    );
  }
  return (
    <TransactionStepCard title={t("transactions.rollover.eligibility")}>
      <div className="space-y-6">
        <div
          className="flex items-start gap-4 p-4 rounded-[var(--radius-lg)] border"
          style={{ background: "var(--color-success-light)", borderColor: "var(--color-success)" }}
        >
          <CheckCircle2 className="h-6 w-6 shrink-0" style={{ color: "var(--color-success)" }} />
          <div>
            <p className="font-semibold" style={{ color: "var(--enroll-text-primary)" }}>{t("transactions.rollover.canConsolidate")}</p>
            <p className="mt-1 text-sm" style={{ color: "var(--enroll-text-secondary)" }}>
              {t("transactions.rollover.rolloverDesc")}
            </p>
          </div>
        </div>
        <div className="p-3 rounded-[var(--radius-md)]" style={{ background: "var(--enroll-soft-bg)" }}>
          <p className="text-sm" style={{ color: "var(--enroll-text-secondary)" }}>
            {t("transactions.rollover.currentBalance")} <span className="font-semibold" style={{ color: "var(--enroll-text-primary)" }}>{formatCurrency(ACCOUNT_OVERVIEW.totalBalance)}</span>
          </p>
        </div>
      </div>
    </TransactionStepCard>
  );
};
