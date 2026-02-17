import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { CreditCard, FileText } from "lucide-react";
import { TransactionStepCard } from "../../../../../components/transactions/TransactionStepCard";
import type { TransactionStepProps } from "../../../../../components/transactions/TransactionApplication";

const ROUTING_LEN = 9;
const ACCOUNT_MIN = 4;
const ACCOUNT_MAX = 17;

export const LoanAmountStep = ({ initialData, onDataChange, readOnly }: TransactionStepProps) => {
  const { t } = useTranslation();
  const paymentMethod = initialData?.paymentMethod ?? "EFT";
  const routingNumber = initialData?.routingNumber ?? "";
  const accountNumber = initialData?.accountNumber ?? "";
  const accountType = initialData?.accountType ?? "Checking";

  const handleMethodChange = useCallback(
    (method: "EFT" | "Check") => {
      onDataChange?.({ paymentMethod: method });
    },
    [onDataChange]
  );
  const handleRoutingChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value.replace(/\D/g, "").slice(0, ROUTING_LEN);
      onDataChange?.({ routingNumber: v });
    },
    [onDataChange]
  );
  const handleAccountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value.replace(/\D/g, "").slice(0, ACCOUNT_MAX);
      onDataChange?.({ accountNumber: v });
    },
    [onDataChange]
  );
  const handleAccountTypeChange = useCallback(
    (type: "Checking" | "Savings") => {
      onDataChange?.({ accountType: type });
    },
    [onDataChange]
  );

  if (readOnly) {
    return (
      <TransactionStepCard title={t("transactions.loan.moneyFlow")}>
        <p className="text-sm" style={{ color: "var(--enroll-text-secondary)" }}>
          {t("transactions.loan.disbursement")}: {paymentMethod === "EFT" ? t("transactions.loan.directDeposit") : t("transactions.loan.paperCheck")}
          {paymentMethod === "EFT" && accountType && ` · ${accountType}`}
        </p>
      </TransactionStepCard>
    );
  }

  return (
    <TransactionStepCard title={t("transactions.loan.moneyFlow")}>
      <div className="space-y-6">
        <p className="text-sm" style={{ color: "var(--enroll-text-secondary)" }}>
          {t("transactions.loan.reviewDisbursement")}
        </p>

        <div>
          <p className="text-sm font-bold mb-3" style={{ color: "var(--enroll-text-primary)" }}>{t("transactions.loan.disbursementMethod")}</p>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleMethodChange("EFT")}
              className="flex items-center gap-3 p-4 rounded-[var(--radius-xl)] border-2 transition-all text-left"
              style={{
                borderColor: paymentMethod === "EFT" ? "var(--enroll-brand)" : "var(--enroll-card-border)",
                background: paymentMethod === "EFT" ? "var(--txn-brand-soft)" : "var(--enroll-card-bg)",
              }}
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-lg)]"
                style={{
                  background: paymentMethod === "EFT" ? "var(--txn-brand-soft)" : "var(--enroll-soft-bg)",
                  color: paymentMethod === "EFT" ? "var(--enroll-brand)" : "var(--enroll-text-muted)",
                }}
              >
                <CreditCard className="h-5 w-5" />
              </span>
              <div>
                <p className="font-bold text-sm" style={{ color: "var(--enroll-text-primary)" }}>{t("transactions.loan.directDeposit")}</p>
                <p className="text-xs" style={{ color: "var(--enroll-text-muted)" }}>{t("transactions.loan.fastestDays")}</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => handleMethodChange("Check")}
              className="flex items-center gap-3 p-4 rounded-[var(--radius-xl)] border-2 transition-all text-left"
              style={{
                borderColor: paymentMethod === "Check" ? "var(--enroll-brand)" : "var(--enroll-card-border)",
                background: paymentMethod === "Check" ? "var(--txn-brand-soft)" : "var(--enroll-card-bg)",
              }}
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-lg)]"
                style={{
                  background: paymentMethod === "Check" ? "var(--txn-brand-soft)" : "var(--enroll-soft-bg)",
                  color: paymentMethod === "Check" ? "var(--enroll-brand)" : "var(--enroll-text-muted)",
                }}
              >
                <FileText className="h-5 w-5" />
              </span>
              <div>
                <p className="font-bold text-sm" style={{ color: "var(--enroll-text-primary)" }}>{t("transactions.loan.paperCheck")}</p>
                <p className="text-xs" style={{ color: "var(--enroll-text-muted)" }}>{t("transactions.loan.mailDays")}</p>
              </div>
            </button>
          </div>
        </div>

        {paymentMethod === "EFT" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase mb-1.5" style={{ color: "var(--enroll-text-muted)" }}>{t("transactions.loan.routingNumber")}</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={ROUTING_LEN}
                value={routingNumber}
                onChange={handleRoutingChange}
                placeholder="000000000"
                className="w-full px-4 py-2.5 rounded-[var(--radius-lg)] border font-mono text-sm"
                style={{
                  background: "var(--enroll-card-bg)",
                  borderColor: "var(--enroll-card-border)",
                  color: "var(--enroll-text-primary)",
                }}
              />
              <p className="mt-1 text-[10px]" style={{ color: "var(--enroll-text-muted)" }}>{t("transactions.loan.routingDigits")}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase mb-1.5" style={{ color: "var(--enroll-text-muted)" }}>{t("transactions.loan.accountNumber")}</label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={ACCOUNT_MAX}
                value={accountNumber}
                onChange={handleAccountChange}
                placeholder="••••••••••"
                className="w-full px-4 py-2.5 rounded-[var(--radius-lg)] border font-mono text-sm"
                style={{
                  background: "var(--enroll-card-bg)",
                  borderColor: "var(--enroll-card-border)",
                  color: "var(--enroll-text-primary)",
                }}
              />
              <p className="mt-1 text-[10px]" style={{ color: "var(--enroll-text-muted)" }}>{t("transactions.loan.accountDigits")}</p>
            </div>
            <div>
              <p className="block text-xs font-semibold uppercase mb-2" style={{ color: "var(--enroll-text-muted)" }}>{t("transactions.loan.accountType")}</p>
              <div className="flex gap-4">
                {(["Checking", "Savings"] as const).map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="accountType"
                      checked={accountType === type}
                      onChange={() => handleAccountTypeChange(type)}
                      className="rounded-full"
                      style={{ accentColor: "var(--enroll-brand)" }}
                    />
                    <span className="text-sm" style={{ color: "var(--enroll-text-primary)" }}>{t(type === "Checking" ? "transactions.loan.checking" : "transactions.loan.savings")}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {paymentMethod === "Check" && (
          <div
            className="p-4 rounded-[var(--radius-lg)] border flex gap-3"
            style={{
              background: "var(--color-warning-light)",
              borderColor: "var(--color-warning)",
            }}
          >
            <FileText className="h-5 w-5 shrink-0" style={{ color: "var(--color-warning)" }} />
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--enroll-text-primary)" }}>{t("transactions.loan.mailingToAddress")}</p>
              <p className="text-xs mt-1" style={{ color: "var(--enroll-text-secondary)" }}>{t("transactions.loan.checkMailedNote")}</p>
            </div>
          </div>
        )}
      </div>
    </TransactionStepCard>
  );
};
