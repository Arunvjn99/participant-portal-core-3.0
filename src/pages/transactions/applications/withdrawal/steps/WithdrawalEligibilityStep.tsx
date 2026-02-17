import { useTranslation } from "react-i18next";
import { CheckCircle2 } from "lucide-react";
import { TransactionStepCard } from "../../../../../components/transactions/TransactionStepCard";
import { ACCOUNT_OVERVIEW } from "../../../../../data/accountOverview";
import type { TransactionStepProps } from "../../../../../components/transactions/TransactionApplication";

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);

const MAX_WITHDRAWAL_PCT = 0.25;

export const WithdrawalEligibilityStep = ({ initialData, onDataChange, readOnly }: TransactionStepProps) => {
  const { t } = useTranslation();
  const vestedBalance = ACCOUNT_OVERVIEW.vestedBalance;
  const availableAmount = Math.floor(vestedBalance * MAX_WITHDRAWAL_PCT);

  if (readOnly) {
    return (
      <TransactionStepCard title={t("transactions.withdrawal.eligibility")}>
        <p className="text-sm" style={{ color: "var(--enroll-text-secondary)" }}>
          {t("transactions.withdrawal.eligibilityReadOnly", {
            vested: formatCurrency(vestedBalance),
            available: formatCurrency(availableAmount),
          })}
        </p>
      </TransactionStepCard>
    );
  }

  return (
    <TransactionStepCard title={t("transactions.withdrawal.eligibility")}>
      <div className="space-y-6">
        <div
          className="flex items-start gap-4 p-4 rounded-[var(--radius-lg)] border"
          style={{
            background: "var(--color-success-light)",
            borderColor: "var(--color-success)",
          }}
        >
          <CheckCircle2 className="h-6 w-6 shrink-0" style={{ color: "var(--color-success)" }} />
          <div>
            <p className="font-semibold" style={{ color: "var(--enroll-text-primary)" }}>
              {t("transactions.withdrawal.mayBeAvailable")}
            </p>
            <p className="mt-1 text-sm" style={{ color: "var(--enroll-text-secondary)" }}>
              {t("transactions.withdrawal.mayBeEligible")}
            </p>
          </div>
        </div>
        <dl className="grid gap-3 sm:grid-cols-2">
          <div className="p-3 rounded-[var(--radius-md)]" style={{ background: "var(--enroll-soft-bg)" }}>
            <dt className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--enroll-text-muted)" }}>{t("transactions.withdrawal.vestedBalance")}</dt>
            <dd className="mt-1 font-semibold" style={{ color: "var(--enroll-text-primary)" }}>{formatCurrency(vestedBalance)}</dd>
          </div>
          <div className="p-3 rounded-[var(--radius-md)]" style={{ background: "var(--enroll-soft-bg)" }}>
            <dt className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--enroll-text-muted)" }}>{t("transactions.withdrawal.estAvailable")}</dt>
            <dd className="mt-1 font-semibold" style={{ color: "var(--enroll-text-primary)" }}>{formatCurrency(availableAmount)}</dd>
          </div>
        </dl>
      </div>
    </TransactionStepCard>
  );
};
