import { useCallback } from "react";
import { TransactionStepCard } from "../../../../../components/transactions/TransactionStepCard";
import type { TransactionStepProps } from "../../../../../components/transactions/TransactionApplication";

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);

export const RolloverAmountStep = ({ initialData, onDataChange, readOnly }: TransactionStepProps) => {
  const estimatedBalance = initialData?.estimatedBalance ?? 25000;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = parseFloat(e.target.value);
      if (!isNaN(v) && v >= 0) onDataChange?.({ estimatedBalance: v, amount: v });
    },
    [onDataChange]
  );

  if (readOnly) {
    return (
      <TransactionStepCard title="Rollover Amount">
        <p className="text-sm" style={{ color: "var(--enroll-text-secondary)" }}>
          Estimated: {formatCurrency(estimatedBalance)}
        </p>
      </TransactionStepCard>
    );
  }

  return (
    <TransactionStepCard title="Rollover Amount">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--enroll-text-primary)" }}>
            Estimated balance to roll over
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-medium" style={{ color: "var(--enroll-text-muted)" }}>$</span>
            <input
              type="number"
              min={0}
              step={1000}
              value={estimatedBalance}
              onChange={handleChange}
              className="w-full pl-8 pr-4 py-3 rounded-[var(--radius-lg)] border text-lg font-semibold"
              style={{
                background: "var(--enroll-card-bg)",
                borderColor: "var(--enroll-card-border)",
                color: "var(--enroll-text-primary)",
              }}
            />
          </div>
          <p className="mt-1 text-sm" style={{ color: "var(--enroll-text-muted)" }}>
            Approximate amount from your previous plan or IRA
          </p>
        </div>
      </div>
    </TransactionStepCard>
  );
};
