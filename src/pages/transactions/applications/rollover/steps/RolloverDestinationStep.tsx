import { useCallback } from "react";
import { TransactionStepCard } from "../../../../../components/transactions/TransactionStepCard";
import type { TransactionStepProps } from "../../../../../components/transactions/TransactionApplication";

export const RolloverDestinationStep = ({ initialData, onDataChange, readOnly }: TransactionStepProps) => {
  const providerName = initialData?.providerName ?? "";
  const accountType = initialData?.accountType ?? "401(k)";

  if (readOnly) {
    return (
      <TransactionStepCard title="Destination Account">
        <p className="text-sm" style={{ color: "var(--enroll-text-secondary)" }}>
          Source: {providerName || "—"} · {accountType}
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
    <TransactionStepCard title="Destination Account">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--enroll-text-primary)" }}>
            Source institution / plan name
          </label>
          <input
            type="text"
            value={providerName}
            onChange={handleProviderChange}
            placeholder="e.g. Fidelity, Vanguard"
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
            Account type
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
            <option value="401(k)">401(k)</option>
            <option value="403(b)">403(b)</option>
            <option value="IRA">IRA</option>
            <option value="Roth IRA">Roth IRA</option>
          </select>
        </div>
      </div>
    </TransactionStepCard>
  );
};
