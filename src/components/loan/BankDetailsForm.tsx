import { motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";
import type { PaymentSetupData } from "../../types/loan";

interface BankDetailsFormProps {
  value: PaymentSetupData | null;
  onChange: (data: Partial<PaymentSetupData>) => void;
  errors?: Record<string, string>;
  disabled?: boolean;
}

/**
 * ACH routing + account number. Fully typed, aria labels, keyboard navigable.
 */
export function BankDetailsForm({
  value,
  onChange,
  errors = {},
  disabled = false,
}: BankDetailsFormProps) {
  const reduced = useReducedMotion();
  const routing = value?.routingNumber ?? "";
  const account = value?.accountNumber ?? "";
  const accountType = value?.accountType ?? "checking";

  return (
    <motion.div
      className="space-y-4"
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div style={{ marginBottom: "var(--spacing-4)" }}>
        <label
          htmlFor="loan-routing"
          className="mb-1 block text-sm font-medium"
          style={{ color: "var(--enroll-text-secondary)" }}
        >
          Routing number
        </label>
        <input
          id="loan-routing"
          type="text"
          inputMode="numeric"
          autoComplete="routing-number"
          value={routing}
          onChange={(e) => onChange({ routingNumber: e.target.value.replace(/\D/g, "").slice(0, 9) })}
          disabled={disabled}
          className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2"
          style={{
            borderColor: "var(--enroll-card-border)",
            background: "var(--enroll-card-bg)",
            color: "var(--enroll-text-primary)",
          }}
          aria-label="Routing number (9 digits)"
          aria-invalid={!!errors.routingNumber}
          aria-describedby={errors.routingNumber ? "loan-routing-error" : undefined}
        />
        {errors.routingNumber && (
          <p id="loan-routing-error" className="mt-1 text-sm" style={{ color: "var(--color-danger)" }} role="alert">
            {errors.routingNumber}
          </p>
        )}
      </div>
      <div style={{ marginBottom: "var(--spacing-4)" }}>
        <label
          htmlFor="loan-account"
          className="mb-1 block text-sm font-medium"
          style={{ color: "var(--enroll-text-secondary)" }}
        >
          Account number
        </label>
        <input
          id="loan-account"
          type="text"
          inputMode="numeric"
          autoComplete="account-number"
          value={account}
          onChange={(e) => onChange({ accountNumber: e.target.value.replace(/\D/g, "").slice(0, 17) })}
          disabled={disabled}
          className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--enroll-brand)]"
          style={{
            borderColor: "var(--enroll-card-border)",
            background: "var(--enroll-card-bg)",
            color: "var(--enroll-text-primary)",
          }}
          aria-label="Account number"
          aria-invalid={!!errors.accountNumber}
          aria-describedby={errors.accountNumber ? "loan-account-error" : undefined}
        />
        {errors.accountNumber && (
          <p id="loan-account-error" className="mt-1 text-sm" style={{ color: "var(--color-danger)" }} role="alert">
            {errors.accountNumber}
          </p>
        )}
      </div>
      <div>
        <fieldset className="space-y-2" style={{ gap: "var(--spacing-2)" }} aria-label="Account type">
          <legend className="text-sm font-medium" style={{ color: "var(--enroll-text-secondary)" }}>Account type</legend>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="loan-account-type"
              value="checking"
              checked={accountType === "checking"}
              onChange={() => onChange({ accountType: "checking" })}
              disabled={disabled}
              className="rounded-full border-[var(--enroll-card-border)] focus:ring-2 focus:ring-[var(--enroll-brand)]"
              style={{ accentColor: "var(--enroll-brand)" }}
              aria-label="Checking"
            />
            <span className="text-sm" style={{ color: "var(--enroll-text-secondary)" }}>Checking</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="loan-account-type"
              value="savings"
              checked={accountType === "savings"}
              onChange={() => onChange({ accountType: "savings" })}
              disabled={disabled}
              className="rounded-full border-[var(--enroll-card-border)] focus:ring-2 focus:ring-[var(--enroll-brand)]"
              style={{ accentColor: "var(--enroll-brand)" }}
              aria-label="Savings"
            />
            <span className="text-sm" style={{ color: "var(--enroll-text-secondary)" }}>Savings</span>
          </label>
        </fieldset>
      </div>
    </motion.div>
  );
}
