import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { TransactionStepCard } from "../../../../../components/transactions/TransactionStepCard";
import { ACCOUNT_OVERVIEW } from "../../../../../data/accountOverview";
import type { TransactionStepProps } from "../../../../../components/transactions/TransactionApplication";

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);

const MIN_WITHDRAWAL = 100;

export const WithdrawalAmountStep = ({ initialData, onDataChange, readOnly }: TransactionStepProps) => {
  const { t } = useTranslation();
  const vestedBalance = ACCOUNT_OVERVIEW.vestedBalance;
  const maxAmount = Math.floor(vestedBalance * 0.25);
  const amount = initialData?.amount ?? Math.min(5000, maxAmount);

  const handleAmountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = parseFloat(e.target.value);
      if (!isNaN(v) && v >= 0) onDataChange?.({ amount: Math.min(maxAmount, Math.max(MIN_WITHDRAWAL, v)) });
    },
    [maxAmount, onDataChange]
  );

  if (readOnly) {
    return (
      <TransactionStepCard title={t("transactions.withdrawal.withdrawalAmount")}>
        <p className="text-sm" style={{ color: "var(--enroll-text-secondary)" }}>
          {t("transactions.withdrawal.requestedReadOnly", { amount: formatCurrency(amount) })}
        </p>
      </TransactionStepCard>
    );
  }

  return (
    <TransactionStepCard title={t("transactions.withdrawal.withdrawalAmount")}>
      <div className="space-y-6">
        <div>
          <label htmlFor="withdrawal-amount" className="block text-sm font-medium mb-2" style={{ color: "var(--enroll-text-primary)" }}>
            {t("transactions.withdrawal.requestedAmount")}
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-medium" style={{ color: "var(--enroll-text-muted)" }}>$</span>
            <input
              id="withdrawal-amount"
              type="number"
              min={MIN_WITHDRAWAL}
              max={maxAmount}
              step={100}
              value={amount}
              onChange={handleAmountChange}
              className="w-full pl-8 pr-4 py-3 rounded-[var(--radius-lg)] border text-lg font-semibold"
              style={{
                background: "var(--enroll-card-bg)",
                borderColor: "var(--enroll-card-border)",
                color: "var(--enroll-text-primary)",
              }}
            />
          </div>
          <p className="mt-1 text-sm" style={{ color: "var(--enroll-text-muted)" }}>
            {t("transactions.withdrawal.maxSubjectToPlan", { max: formatCurrency(maxAmount) })}
          </p>
        </div>
        <div
          className="p-4 rounded-[var(--radius-lg)] border"
          style={{ background: "var(--color-warning-light)", borderColor: "var(--color-warning)" }}
        >
          <p className="text-sm" style={{ color: "var(--enroll-text-primary)" }}>
            {t("transactions.withdrawal.taxPenaltyWarning")}
          </p>
        </div>
      </div>
    </TransactionStepCard>
  );
};
