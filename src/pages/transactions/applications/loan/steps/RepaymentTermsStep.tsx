import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { FileSignature, FileText, Heart } from "lucide-react";
import { TransactionStepCard } from "../../../../../components/transactions/TransactionStepCard";
import type { TransactionStepProps } from "../../../../../components/transactions/TransactionApplication";

export const RepaymentTermsStep = ({ initialData, onDataChange, readOnly }: TransactionStepProps) => {
  const { t } = useTranslation();
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
      <TransactionStepCard title={t("transactions.loan.compliance")}>
        <p className="text-sm" style={{ color: "var(--enroll-text-secondary)" }}>
          {t("transactions.loan.complianceReadOnlyNote")}
        </p>
      </TransactionStepCard>
    );
  }

  return (
    <TransactionStepCard title={t("transactions.loan.compliance")}>
      <p className="text-sm mb-6" style={{ color: "var(--enroll-text-secondary)" }}>
        {t("transactions.loan.complianceIntro")}
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
              <strong>{t("transactions.loan.promissoryNoteTitle")}</strong> {t("transactions.loan.promissoryNoteText")}
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
              <strong>{t("transactions.loan.truthInLendingTitle")}</strong> {t("transactions.loan.truthInLendingText")}
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
              <strong>{t("transactions.loan.spousalConsentTitle")}</strong> {t("transactions.loan.spousalConsentText")}
            </span>
          </span>
        </label>
      </div>
    </TransactionStepCard>
  );
};
