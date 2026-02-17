import { useCallback } from "react";
import { CreditCard, FileText } from "lucide-react";
import { TransactionStepCard } from "../../../../../components/transactions/TransactionStepCard";
import type { TransactionStepProps } from "../../../../../components/transactions/TransactionApplication";

const ROUTING_LEN = 9;
const ACCOUNT_MIN = 4;
const ACCOUNT_MAX = 17;

export const LoanAmountStep = ({ initialData, onDataChange, readOnly }: TransactionStepProps) => {
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
      <TransactionStepCard title="Money Flow">
        <p className="text-sm" style={{ color: "var(--enroll-text-secondary)" }}>
          Disbursement: {paymentMethod === "EFT" ? "Direct deposit" : "Paper check"}
          {paymentMethod === "EFT" && accountType && ` · ${accountType}`}
        </p>
      </TransactionStepCard>
    );
  }

  return (
    <TransactionStepCard title="Money Flow">
      <div className="space-y-6">
        <p className="text-sm" style={{ color: "var(--enroll-text-secondary)" }}>
          Review disbursement details and how you will receive funds.
        </p>

        <div>
          <p className="text-sm font-bold mb-3" style={{ color: "var(--enroll-text-primary)" }}>Disbursement method</p>
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
                <p className="font-bold text-sm" style={{ color: "var(--enroll-text-primary)" }}>Direct deposit</p>
                <p className="text-xs" style={{ color: "var(--enroll-text-muted)" }}>Fastest (2–3 days)</p>
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
                <p className="font-bold text-sm" style={{ color: "var(--enroll-text-primary)" }}>Paper check</p>
                <p className="text-xs" style={{ color: "var(--enroll-text-muted)" }}>Mail (7–10 days)</p>
              </div>
            </button>
          </div>
        </div>

        {paymentMethod === "EFT" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase mb-1.5" style={{ color: "var(--enroll-text-muted)" }}>Routing number</label>
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
              <p className="mt-1 text-[10px]" style={{ color: "var(--enroll-text-muted)" }}>9 digits</p>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase mb-1.5" style={{ color: "var(--enroll-text-muted)" }}>Account number</label>
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
              <p className="mt-1 text-[10px]" style={{ color: "var(--enroll-text-muted)" }}>4–17 digits</p>
            </div>
            <div>
              <p className="block text-xs font-semibold uppercase mb-2" style={{ color: "var(--enroll-text-muted)" }}>Account type</p>
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
                    <span className="text-sm" style={{ color: "var(--enroll-text-primary)" }}>{type}</span>
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
              <p className="text-sm font-semibold" style={{ color: "var(--enroll-text-primary)" }}>Mailing to address on file</p>
              <p className="text-xs mt-1" style={{ color: "var(--enroll-text-secondary)" }}>Check will be mailed to your address on file within 7–10 business days.</p>
            </div>
          </div>
        )}
      </div>
    </TransactionStepCard>
  );
};
