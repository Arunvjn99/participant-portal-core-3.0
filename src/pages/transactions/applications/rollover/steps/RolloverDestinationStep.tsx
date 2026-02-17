import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { TransactionStepCard } from "../../../../../components/transactions/TransactionStepCard";
import type { TransactionStepProps } from "../../../../../components/transactions/TransactionApplication";

export const RolloverDestinationStep = ({ initialData, onDataChange, readOnly }: TransactionStepProps) => {
  const { t } = useTranslation();
  const providerName = initialData?.providerName ?? "";
  const accountType = initialData?.accountType ?? "401(k)";

  if (readOnly) {
    return (
      <TransactionStepCard title={t("transactions.rollover.destinationAccount")}>
        <p className="text-sm" style={{ color: "var(--enroll-text-secondary)" }}>
          {t("transactions.rollover.sourceReadOnly", { source: providerName || "—", accountType })}
        </p>
      </TransactionStepCard>
    );
  }

  const handleProviderChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onDataChange?.({ providerName: e.target.value }),
    [onDataChange]
  );

  const handleAccountTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => onDataChange?.({ accountType: e.target.value }),
    [onDataChange]
  );

  return (
    <TransactionStepCard title={t("transactions.rollover.destinationAccount")}>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--enroll-text-primary)" }}>
            {t("transactions.rollover.sourceInstitution")}
          </label>
          <input
            type="text"
            value={providerName}
            onChange={handleProviderChange}
            placeholder={t("transactions.rollover.sourcePlaceholder")}
            className="w-full px-4 py-3 rounded-[var(--radius-lg)] border"
            style={{
              background: "var(--enroll-card-bg)",
              borderColor: "var(--enroll-card-border)",
              color: "var(--enroll-text-primary)",
            }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--enroll-text-primary)" }}>
            {t("transactions.rollover.accountType")}
          </label>
          <select
            value={accountType}
            onChange={handleAccountTypeChange}
            className="w-full px-4 py-3 rounded-[var(--radius-lg)] border"
            style={{
              background: "var(--enroll-card-bg)",
              borderColor: "var(--enroll-card-border)",
              color: "var(--enroll-text-primary)",
            }}
          >
            <option value="401(k)">{t("transactions.rollover.accountType401k")}</option>
            <option value="403(b)">{t("transactions.rollover.accountType403b")}</option>
            <option value="IRA">{t("transactions.rollover.accountTypeIRA")}</option>
            <option value="Roth IRA">{t("transactions.rollover.accountTypeRothIRA")}</option>
          </select>
        </div>
      </div>
    </TransactionStepCard>
  );
};
