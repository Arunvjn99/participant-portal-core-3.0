import { useCallback } from "react";
import { FileSignature, FileText, Heart } from "lucide-react";
import { TransactionStepCard } from "../../../../../components/transactions/TransactionStepCard";
import type { TransactionStepProps } from "../../../../../components/transactions/TransactionApplication";

export const RepaymentTermsStep = ({ initialData, onDataChange, readOnly }: TransactionStepProps) => {
  const agreedToTerms = initialData?.agreedToTerms ?? false;
  const agreedToDisclosures = initialData?.agreedToDisclosures ?? false;
  const spousalConsent = initialData?.spousalConsent ?? false;

  const handleTermsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onDataChange?.({ agreedToTerms: e.target.checked });
    },
    [onDataChange]
  );
  const handleDisclosuresChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onDataChange?.({ agreedToDisclosures: e.target.checked });
    },
    [onDataChange]
  );
  const handleSpousalChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onDataChange?.({ spousalConsent: e.target.checked });
    },
    [onDataChange]
  );

  if (readOnly) {
    return (
      <TransactionStepCard title="Compliance">
        <p className="text-sm" style={{ color: "var(--enroll-text-secondary)" }}>
          Promissory Note, Truth in Lending, and Spousal Consent acknowledged.
        </p>
      </TransactionStepCard>
    );
  }

  return (
    <TransactionStepCard title="Compliance">
      <p className="text-sm mb-6" style={{ color: "var(--enroll-text-secondary)" }}>
        Please read and acknowledge the following before continuing. All are required to submit your loan request.
      </p>
      <div className="space-y-4">
        <label
          className="flex items-start gap-3 p-4 rounded-[var(--radius-lg)] border cursor-pointer transition-colors"
          style={{
            background: agreedToTerms ? "var(--txn-brand-soft)" : "var(--enroll-card-bg)",
            borderColor: agreedToTerms ? "var(--enroll-brand)" : "var(--enroll-card-border)",
          }}
        >
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={handleTermsChange}
            className="mt-0.5 rounded"
            style={{ accentColor: "var(--enroll-brand)" }}
          />
          <span className="flex items-start gap-2 flex-1">
            <FileSignature className="h-5 w-5 shrink-0 mt-0.5" style={{ color: "var(--enroll-text-muted)" }} />
            <span className="text-sm" style={{ color: "var(--enroll-text-primary)" }}>
              <strong>Promissory Note.</strong> I agree to repay this loan according to the terms and schedule. I understand that default may result in the loan being treated as a distribution and subject to taxes and penalties.
            </span>
          </span>
        </label>

        <label
          className="flex items-start gap-3 p-4 rounded-[var(--radius-lg)] border cursor-pointer transition-colors"
          style={{
            background: agreedToDisclosures ? "var(--txn-brand-soft)" : "var(--enroll-card-bg)",
            borderColor: agreedToDisclosures ? "var(--enroll-brand)" : "var(--enroll-card-border)",
          }}
        >
          <input
            type="checkbox"
            checked={agreedToDisclosures}
            onChange={handleDisclosuresChange}
            className="mt-0.5 rounded"
            style={{ accentColor: "var(--enroll-brand)" }}
          />
          <span className="flex items-start gap-2 flex-1">
            <FileText className="h-5 w-5 shrink-0 mt-0.5" style={{ color: "var(--enroll-text-muted)" }} />
            <span className="text-sm" style={{ color: "var(--enroll-text-primary)" }}>
              <strong>Truth in Lending.</strong> I have received and understand the required disclosures, including the APR, finance charge, and payment schedule.
            </span>
          </span>
        </label>

        <label
          className="flex items-start gap-3 p-4 rounded-[var(--radius-lg)] border cursor-pointer transition-colors"
          style={{
            background: spousalConsent ? "var(--txn-brand-soft)" : "var(--enroll-card-bg)",
            borderColor: spousalConsent ? "var(--enroll-brand)" : "var(--enroll-card-border)",
          }}
        >
          <input
            type="checkbox"
            checked={spousalConsent}
            onChange={handleSpousalChange}
            className="mt-0.5 rounded"
            style={{ accentColor: "var(--enroll-brand)" }}
          />
          <span className="flex items-start gap-2 flex-1">
            <Heart className="h-5 w-5 shrink-0 mt-0.5" style={{ color: "var(--enroll-text-muted)" }} />
            <span className="text-sm" style={{ color: "var(--enroll-text-primary)" }}>
              <strong>Spousal Consent.</strong> If required by the plan, my spouse has been informed and consents to this loan.
            </span>
          </span>
        </label>
      </div>
    </TransactionStepCard>
  );
};
