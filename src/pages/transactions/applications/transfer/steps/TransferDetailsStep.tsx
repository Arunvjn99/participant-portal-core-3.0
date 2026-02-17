import { useCallback } from "react";
import { TransactionStepCard } from "../../../../../components/transactions/TransactionStepCard";
import type { TransactionStepProps } from "../../../../../components/transactions/TransactionApplication";

const INTENTS = [
  { value: "Rebalance", label: "Rebalance to target" },
  { value: "ReduceRisk", label: "Reduce risk" },
  { value: "Growth", label: "Increase growth" },
  { value: "Manual", label: "Manual allocation" },
] as const;

export const TransferDetailsStep = ({ initialData, onDataChange }: TransactionStepProps) => {
  const intent = initialData?.intent ?? "Rebalance";

  const handleIntentChange = useCallback(
    (value: string) => onDataChange?.({ intent: value }),
    [onDataChange]
  );

  return (
    <TransactionStepCard title="Transfer Details">
      <div className="space-y-6">
        <p className="text-sm" style={{ color: "var(--enroll-text-secondary)" }}>
          Choose your reallocation intent. This helps us suggest an appropriate allocation.
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
              <span className="font-medium" style={{ color: "var(--enroll-text-primary)" }}>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>
    </TransactionStepCard>
  );
};
