import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { TransactionStepCard } from "../../../../../components/transactions/TransactionStepCard";
import type { TransactionStepProps } from "../../../../../components/transactions/TransactionApplication";

export const WithdrawalTaxStep = ({ initialData, onDataChange, readOnly }: TransactionStepProps) => {
  const { t } = useTranslation();
  const federalRate = initialData?.federalTaxRate ?? 20;
  const stateRate = initialData?.stateTaxRate ?? 5;

  if (readOnly) {
    return (
      <TransactionStepCard title={t("transactions.withdrawal.taxInformation")}>
        <p className="text-sm" style={{ color: "var(--enroll-text-secondary)" }}>
          {t("transactions.withdrawal.taxReadOnly", { federal: federalRate, state: stateRate })}
        </p>
      </TransactionStepCard>
    );
  }

  const handleFederalChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = parseFloat(e.target.value);
      if (!isNaN(v)) onDataChange?.({ federalTaxRate: Math.min(100, Math.max(0, v)) });
    },
    [onDataChange]
  );

  const handleStateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = parseFloat(e.target.value);
      if (!isNaN(v)) onDataChange?.({ stateTaxRate: Math.min(100, Math.max(0, v)) });
    },
    [onDataChange]
  );

  return (
    <TransactionStepCard title={t("transactions.withdrawal.taxInformation")}>
      <div className="space-y-6">
        <p className="text-sm" style={{ color: "var(--enroll-text-secondary)" }}>
          {t("transactions.withdrawal.federalWithholdingNote")}
        </p>
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--enroll-text-primary)" }}>
            {t("transactions.withdrawal.federalWithholdingPct")}
          </label>
          <input
            type="number"
            min={0}
            max={100}
            step={1}
            value={federalRate}
            onChange={handleFederalChange}
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
            {t("transactions.withdrawal.stateWithholdingPct")}
          </label>
          <input
            type="number"
            min={0}
            max={100}
            step={1}
            value={stateRate}
            onChange={handleStateChange}
            className="w-full px-4 py-3 rounded-[var(--radius-lg)] border"
            style={{
              background: "var(--enroll-card-bg)",
              borderColor: "var(--enroll-card-border)",
              color: "var(--enroll-text-primary)",
            }}
          />
        </div>
      </div>
    </TransactionStepCard>
  );
};
