import type { CSSProperties } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { TransactionFlowLayout } from "../../components/transactions/TransactionFlowLayout";
import { TransactionStepCard } from "../../components/transactions/TransactionStepCard";
import { RetirementImpact } from "../../components/transactions/RetirementImpact";
import { WarningBanner } from "../../components/transactions/WarningBanner";
import { TransactionStepper } from "../../components/transactions/TransactionStepper";
import { transactionStore } from "../../data/transactionStore";
import { getTransactionById } from "../../data/mockTransactions";
import Button from "../../components/ui/Button";
import type { TransactionType } from "../../types/transactions";

const TYPE_KEYS: Record<TransactionType, string> = {
  loan: "transactions.loanApplication",
  withdrawal: "transactions.withdrawalApplication",
  distribution: "transactions.distributionApplication",
  rollover: "transactions.rolloverApplication",
  transfer: "transactions.transferApplication",
  rebalance: "transactions.rebalanceApplication",
};

const STATUS_KEYS: Record<string, string> = {
  draft: "transactions.analysis.statusDraft",
  active: "transactions.analysis.statusActive",
  completed: "transactions.analysis.statusCompleted",
  cancelled: "transactions.analysis.statusCancelled",
};

const EXPLANATION_KEYS: Record<TransactionType, string> = {
  loan: "transactions.analysis.explanationLoan",
  withdrawal: "transactions.analysis.explanationWithdrawal",
  distribution: "transactions.analysis.explanationDistribution",
  rollover: "transactions.analysis.explanationRollover",
  transfer: "transactions.analysis.explanationTransfer",
  rebalance: "transactions.analysis.explanationRebalance",
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

const SummaryRow = ({
  label,
  value,
  valueStyle,
}: {
  label: string;
  value: string;
  valueStyle?: CSSProperties;
}) => (
  <div
    className="flex justify-between items-center py-2 border-b last:border-b-0"
    style={{ borderColor: "var(--enroll-card-border)" }}
  >
    <span className="text-[0.9375em] font-medium" style={{ color: "var(--enroll-text-muted)" }}>
      {label}
    </span>
    <span
      className="text-[0.9375em] font-medium"
      style={valueStyle ?? { color: "var(--enroll-text-primary)" }}
    >
      {value}
    </span>
  </div>
);

export const TransactionAnalysis = () => {
  const { t } = useTranslation();
  const { transactionId } = useParams<{ transactionId: string }>();
  const navigate = useNavigate();

  if (!transactionId) {
    return (
      <DashboardLayout header={<DashboardHeader />} transparentBackground>
        <TransactionFlowLayout title={t("transactions.analysis.transactionDetails")} onBack={() => navigate("/transactions")}>
          <TransactionStepCard title={t("transactions.analysis.notFound")}>
            <p>{t("transactions.analysis.transactionNotFound")}</p>
          </TransactionStepCard>
        </TransactionFlowLayout>
      </DashboardLayout>
    );
  }

  // Use transactionStore first (drafts, flow-created), then mock data
  const transaction =
    transactionStore.getTransaction(transactionId) ?? getTransactionById(transactionId);

  if (!transaction) {
    return (
      <DashboardLayout header={<DashboardHeader />} transparentBackground>
        <TransactionFlowLayout title={t("transactions.analysis.transactionDetails")} onBack={() => navigate("/transactions")}>
          <TransactionStepCard title={t("transactions.analysis.notFound")}>
            <p>{t("transactions.analysis.transactionNotFound")}</p>
          </TransactionStepCard>
        </TransactionFlowLayout>
      </DashboardLayout>
    );
  }

  const handleAction = () => {
    switch (transaction.status) {
      case "draft":
      case "active":
        navigate(`/transactions/${transaction.type}/${transaction.id}`);
        break;
      case "completed":
        // Placeholder: in production would open documents
        console.log("View documents");
        break;
      default:
        navigate("/transactions");
    }
  };

  const getActionLabel = (): string => {
    switch (transaction.status) {
      case "draft":
        return t("transactions.analysis.resumeTransaction");
      case "active":
        return t("transactions.analysis.trackStatus");
      case "completed":
        return t("transactions.analysis.viewDocuments");
      default:
        return t("transactions.analysis.viewDetails");
    }
  };

  const getStatusStyle = (): CSSProperties | undefined => {
    if (transaction.status === "completed")
      return { color: "var(--color-success, #22c55e)" };
    if (transaction.status === "active") return { color: "var(--enroll-brand)" };
    return undefined;
  };

  return (
    <DashboardLayout header={<DashboardHeader />} transparentBackground>
      <TransactionFlowLayout
        title={t("transactions.analysis.transactionDetails")}
        subtitle={t(TYPE_KEYS[transaction.type])}
        onBack={() => navigate("/transactions")}
      >
        <div className="space-y-6">
          <TransactionStepCard title={t("transactions.analysis.transactionSummary")}>
            <div className="space-y-0">
              <SummaryRow label={t("transactions.analysis.type")} value={t(TYPE_KEYS[transaction.type])} />
              <SummaryRow
                label={t("transactions.analysis.status")}
                value={STATUS_KEYS[transaction.status] ? t(STATUS_KEYS[transaction.status]) : transaction.status}
                valueStyle={getStatusStyle()}
              />
              <SummaryRow label={t("transactions.analysis.amount")} value={formatCurrency(transaction.amount ?? 0)} />
              <SummaryRow
                label={t("transactions.analysis.dateInitiated")}
                value={new Date(transaction.dateInitiated).toLocaleDateString()}
              />
              {transaction.dateCompleted && (
                <SummaryRow
                  label={t("transactions.analysis.dateCompleted")}
                  value={new Date(transaction.dateCompleted).toLocaleDateString()}
                />
              )}
              {transaction.processingTime && (
                <SummaryRow label={t("transactions.analysis.processingTime")} value={transaction.processingTime} />
              )}
            </div>
          </TransactionStepCard>

          <TransactionStepCard title={t("transactions.analysis.whatThisDoes")}>
            <p
              className="text-[0.9375em] leading-relaxed"
              style={{ color: "var(--enroll-text-secondary)" }}
            >
              {t(EXPLANATION_KEYS[transaction.type])}
            </p>
          </TransactionStepCard>

          <RetirementImpact
            level={transaction.retirementImpact.level}
            rationale={transaction.retirementImpact.rationale}
          />

          {(transaction.grossAmount ||
            (transaction.fees !== undefined && transaction.fees > 0) ||
            (transaction.taxWithholding !== undefined && transaction.taxWithholding > 0) ||
            transaction.netAmount ||
            transaction.repaymentInfo) && (
            <TransactionStepCard title={t("transactions.analysis.financialBreakdown")}>
              <div className="space-y-0">
                {transaction.grossAmount && (
                  <SummaryRow label={t("transactions.analysis.grossAmount")} value={formatCurrency(transaction.grossAmount)} />
                )}
                {transaction.fees !== undefined && transaction.fees > 0 && (
                  <SummaryRow label={t("transactions.analysis.fees")} value={formatCurrency(transaction.fees)} />
                )}
                {transaction.taxWithholding !== undefined && transaction.taxWithholding > 0 && (
                  <SummaryRow
                    label={t("transactions.analysis.taxWithholding")}
                    value={formatCurrency(transaction.taxWithholding)}
                  />
                )}
                {transaction.netAmount && (
                  <SummaryRow
                    label={t("transactions.analysis.netAmount")}
                    value={formatCurrency(transaction.netAmount)}
                    valueStyle={{ color: "var(--enroll-text-primary)", fontWeight: 600 }}
                  />
                )}
                {transaction.repaymentInfo && (
                  <div className="mt-4 pt-4 border-t" style={{ borderColor: "var(--enroll-card-border)" }}>
                    <h3
                      className="text-sm font-semibold mb-3"
                      style={{ color: "var(--enroll-text-primary)" }}
                    >
                      {t("transactions.analysis.repaymentInformation")}
                    </h3>
                    <div className="space-y-0">
                      <SummaryRow
                        label={t("transactions.analysis.monthlyPayment")}
                        value={formatCurrency(transaction.repaymentInfo.monthlyPayment)}
                      />
                      <SummaryRow
                        label={t("transactions.analysis.term")}
                        value={t("transactions.analysis.termMonths", { months: transaction.repaymentInfo.termMonths })}
                      />
                      <SummaryRow
                        label={t("transactions.analysis.interestRate")}
                        value={`${transaction.repaymentInfo.interestRate}%`}
                      />
                    </div>
                  </div>
                )}
              </div>
            </TransactionStepCard>
          )}

          <TransactionStepCard title={t("transactions.analysis.timelineAndCompliance")}>
            {transaction.milestones && (
              <div className="mb-4">
                <TransactionStepper milestones={transaction.milestones} status={transaction.status} />
              </div>
            )}
            {transaction.isIrreversible && (
              <WarningBanner
                message={t("transactions.analysis.irreversibleWarning")}
                type="warning"
              />
            )}
            {transaction.legalConfirmations && transaction.legalConfirmations.length > 0 && (
              <div className="mt-4">
                <h3
                  className="text-sm font-semibold mb-2"
                  style={{ color: "var(--enroll-text-primary)" }}
                >
                  {t("transactions.analysis.legalConfirmations")}
                </h3>
                <ul className="list-disc list-inside space-y-1" style={{ color: "var(--enroll-text-secondary)" }}>
                  {transaction.legalConfirmations.map((confirmation, index) => (
                    <li key={index}>{confirmation}</li>
                  ))}
                </ul>
              </div>
            )}
          </TransactionStepCard>

          <div className="pt-4">
            <Button
              onClick={handleAction}
              className="min-w-[200px]"
              style={{
                background: "var(--enroll-brand)",
                color: "var(--color-text-inverse)",
              }}
            >
              {getActionLabel()}
            </Button>
          </div>
        </div>
      </TransactionFlowLayout>
    </DashboardLayout>
  );
};
