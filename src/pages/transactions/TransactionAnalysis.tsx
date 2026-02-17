import type { CSSProperties } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

const getTransactionTypeLabel = (type: TransactionType): string => {
  switch (type) {
    case "loan":
      return "401(k) Loan";
    case "withdrawal":
      return "Hardship Withdrawal";
    case "distribution":
      return "Distribution";
    case "rollover":
      return "Rollover";
    case "transfer":
      return "Transfer Investments";
    case "rebalance":
      return "Rebalance Portfolio";
  }
};

const getStatusLabel = (status: string): string => {
  switch (status) {
    case "draft":
      return "Draft";
    case "active":
      return "Active";
    case "completed":
      return "Completed";
    case "cancelled":
      return "Cancelled";
    default:
      return status;
  }
};

const getTransactionExplanation = (type: TransactionType): string => {
  switch (type) {
    case "loan":
      return "You're borrowing from your 401(k) account. The loan amount is deducted from your balance, and you'll repay it with interest through payroll deductions over the loan term. Interest payments go back into your account.";
    case "withdrawal":
      return "You're taking an early withdrawal from your 401(k). This permanently reduces your retirement savings. Withdrawals are subject to income tax and may incur a 10% early withdrawal penalty if you're under age 59½.";
    case "distribution":
      return "You're receiving a distribution from your 401(k). This permanently reduces your retirement balance. Distributions are subject to income tax, and required minimum distributions (RMDs) are mandatory starting at age 73.";
    case "rollover":
      return "You're moving funds from this 401(k) to another qualified retirement account. Rollovers preserve your retirement savings and maintain tax-deferred status when completed within 60 days or as a direct transfer.";
    case "transfer":
      return "You're transferring investments between accounts. This allows you to move funds while maintaining your investment strategy and tax-deferred status.";
    case "rebalance":
      return "You're rebalancing your portfolio to adjust your investment allocation. This helps maintain your target asset allocation and manage risk over time.";
  }
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
  const { transactionId } = useParams<{ transactionId: string }>();
  const navigate = useNavigate();

  if (!transactionId) {
    return (
      <DashboardLayout header={<DashboardHeader />} transparentBackground>
        <TransactionFlowLayout title="Transaction Details" onBack={() => navigate("/transactions")}>
          <TransactionStepCard title="Not Found">
            <p>Transaction not found.</p>
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
        <TransactionFlowLayout title="Transaction Details" onBack={() => navigate("/transactions")}>
          <TransactionStepCard title="Not Found">
            <p>Transaction not found.</p>
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
        return "Resume Transaction";
      case "active":
        return "Track Status";
      case "completed":
        return "View Documents";
      default:
        return "View Details";
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
        title="Transaction Details"
        subtitle={getTransactionTypeLabel(transaction.type)}
        onBack={() => navigate("/transactions")}
      >
        <div className="space-y-6">
          <TransactionStepCard title="Transaction Summary">
            <div className="space-y-0">
              <SummaryRow label="Type" value={getTransactionTypeLabel(transaction.type)} />
              <SummaryRow
                label="Status"
                value={getStatusLabel(transaction.status)}
                valueStyle={getStatusStyle()}
              />
              <SummaryRow label="Amount" value={formatCurrency(transaction.amount ?? 0)} />
              <SummaryRow
                label="Date Initiated"
                value={new Date(transaction.dateInitiated).toLocaleDateString()}
              />
              {transaction.dateCompleted && (
                <SummaryRow
                  label="Date Completed"
                  value={new Date(transaction.dateCompleted).toLocaleDateString()}
                />
              )}
              {transaction.processingTime && (
                <SummaryRow label="Processing Time" value={transaction.processingTime} />
              )}
            </div>
          </TransactionStepCard>

          <TransactionStepCard title="What This Transaction Does">
            <p
              className="text-[0.9375em] leading-relaxed"
              style={{ color: "var(--enroll-text-secondary)" }}
            >
              {getTransactionExplanation(transaction.type)}
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
            <TransactionStepCard title="Financial Breakdown">
              <div className="space-y-0">
                {transaction.grossAmount && (
                  <SummaryRow label="Gross Amount" value={formatCurrency(transaction.grossAmount)} />
                )}
                {transaction.fees !== undefined && transaction.fees > 0 && (
                  <SummaryRow label="Fees" value={formatCurrency(transaction.fees)} />
                )}
                {transaction.taxWithholding !== undefined && transaction.taxWithholding > 0 && (
                  <SummaryRow
                    label="Tax Withholding"
                    value={formatCurrency(transaction.taxWithholding)}
                  />
                )}
                {transaction.netAmount && (
                  <SummaryRow
                    label="Net Amount"
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
                      Repayment Information
                    </h3>
                    <div className="space-y-0">
                      <SummaryRow
                        label="Monthly Payment"
                        value={formatCurrency(transaction.repaymentInfo.monthlyPayment)}
                      />
                      <SummaryRow
                        label="Term"
                        value={`${transaction.repaymentInfo.termMonths} months`}
                      />
                      <SummaryRow
                        label="Interest Rate"
                        value={`${transaction.repaymentInfo.interestRate}%`}
                      />
                    </div>
                  </div>
                )}
              </div>
            </TransactionStepCard>
          )}

          <TransactionStepCard title="Timeline & Compliance">
            {transaction.milestones && (
              <div className="mb-4">
                <TransactionStepper milestones={transaction.milestones} status={transaction.status} />
              </div>
            )}
            {transaction.isIrreversible && (
              <WarningBanner
                message="This transaction is irreversible. Once completed, it cannot be undone."
                type="warning"
              />
            )}
            {transaction.legalConfirmations && transaction.legalConfirmations.length > 0 && (
              <div className="mt-4">
                <h3
                  className="text-sm font-semibold mb-2"
                  style={{ color: "var(--enroll-text-primary)" }}
                >
                  Legal Confirmations
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
