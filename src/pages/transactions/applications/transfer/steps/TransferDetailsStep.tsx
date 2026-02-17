import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { TransactionStepCard } from "../../../../../components/transactions/TransactionStepCard";
import type { TransactionStepProps } from "../../../../../components/transactions/TransactionApplication";

const INTENTS = [
  { value: "Rebalance", labelKey: "transactions.transfer.intentRebalance" },
  { value: "ReduceRisk", labelKey: "transactions.transfer.intentReduceRisk" },
  { value: "Growth", labelKey: "transactions.transfer.intentGrowth" },
  { value: "Manual", labelKey: "transactions.transfer.intentManual" },
] as const;

export const TransferDetailsStep = ({ initialData, onDataChange }: TransactionStepProps) => {
  const { t } = useTranslation();
  const intent = initialData?.intent ?? "Rebalance";

  const handleIntentChange = useCallback(
    (value: string) => onDataChange?.({ intent: value }),
    [onDataChange]
  );

  return (
    <TransactionStepCard title={t("transactions.transfer.transferDetails")}>
      <div className="space-y-6">
        <p className="text-sm" style={{ color: "var(--enroll-text-secondary)" }}>
          {t("transactions.transfer.chooseIntent")}
        </p>
        <div className="space-y-2">
          {INTENTS.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-3 p-4 rounded-[var(--radius-lg)] border cursor-pointer transition-colors"
              style={{
                background: intent === opt.value ? "var(--txn-brand-soft)" : "var(--enroll-card-bg)",
                borderColor: intent === opt.value ? "var(--enroll-brand)" : "var(--enroll-card-border)",
              }}
            >
              <input
                type="radio"
                name="intent"
                value={opt.value}
                checked={intent === opt.value}
                onChange={() => handleIntentChange(opt.value)}
                style={{ accentColor: "var(--enroll-brand)" }}
              />
              <span className="font-medium" style={{ color: "var(--enroll-text-primary)" }}>{t(opt.labelKey)}</span>
            </label>
          ))}
        </div>
      </div>
    </TransactionStepCard>
  );
};
