import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCurrencyFormatter } from "../../hooks/useCurrencyFormatter";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { DashboardCard } from "../../components/dashboard/DashboardCard";
import { RetirementImpact } from "../../components/transactions/RetirementImpact";
import { WarningBanner } from "../../components/transactions/WarningBanner";
import { TransactionStepper } from "../../components/transactions/TransactionStepper";
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

export const TransactionAnalysis = () => {
  const { transactionId } = useParams<{ transactionId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation("dashboard");
  const formatCurrency = useCurrencyFormatter({ minimumFractionDigits: 0, maximumFractionDigits: 0 });

  if (!transactionId) {
    return (
      <DashboardLayout header={<DashboardHeader />}>
        <div className="transaction-analysis">
          <DashboardCard>
            <p>{t("transactionNotFound")}</p>
          </DashboardCard>
        </div>
      </DashboardLayout>
    );
  }

  const transaction = getTransactionById(transactionId);

  if (!transaction) {
    return (
      <DashboardLayout header={<DashboardHeader />}>
        <div className="transaction-analysis">
          <DashboardCard>
            <p>{t("transactionNotFound")}</p>
          </DashboardCard>
        </div>
      </DashboardLayout>
    );
  }


  const handleAction = () => {
    switch (transaction.status) {
      case "draft":
        // TODO: Navigate to resume transaction flow
        console.log("Resume transaction");
        break;
      case "active":
        // TODO: Navigate to status tracking
        console.log("Track status");
        break;
      case "completed":
        // TODO: Navigate to documents
        console.log("View documents");
        break;
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

  return (
    <DashboardLayout header={<DashboardHeader />}>
      <div className="transaction-analysis">
        <div className="transaction-analysis__header">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="transaction-analysis__back-button"
            aria-label="Back to transactions"
          >
            ← Back
          </button>
          <h1 className="transaction-analysis__title">Transaction Details</h1>
        </div>

        <div className="transaction-analysis__content">
          {/* Card 1: Transaction Summary */}
          <DashboardCard title="Transaction Summary">
            <div className="transaction-summary">
              <div className="transaction-summary__row">
                <span className="transaction-summary__label">Type:</span>
                <span className="transaction-summary__value">{getTransactionTypeLabel(transaction.type)}</span>
              </div>
              <div className="transaction-summary__row">
                <span className="transaction-summary__label">Status:</span>
                <span className={`transaction-summary__value transaction-summary__value--${transaction.status}`}>
                  {getStatusLabel(transaction.status)}
                </span>
              </div>
              <div className="transaction-summary__row">
                <span className="transaction-summary__label">Amount:</span>
                <span className="transaction-summary__value">{formatCurrency(transaction.amount)}</span>
              </div>
              <div className="transaction-summary__row">
                <span className="transaction-summary__label">Date Initiated:</span>
                <span className="transaction-summary__value">
                  {new Date(transaction.dateInitiated).toLocaleDateString()}
                </span>
              </div>
              {transaction.dateCompleted && (
                <div className="transaction-summary__row">
                  <span className="transaction-summary__label">Date Completed:</span>
                  <span className="transaction-summary__value">
                    {new Date(transaction.dateCompleted).toLocaleDateString()}
                  </span>
                </div>
              )}
              {transaction.processingTime && (
                <div className="transaction-summary__row">
                  <span className="transaction-summary__label">Processing Time:</span>
                  <span className="transaction-summary__value">{transaction.processingTime}</span>
                </div>
              )}
            </div>
          </DashboardCard>

          {/* Card 2: What This Transaction Does */}
          <DashboardCard title="What This Transaction Does">
            <p className="transaction-explanation">{getTransactionExplanation(transaction.type)}</p>
          </DashboardCard>

          {/* Card 3: Retirement Impact */}
          <RetirementImpact
            level={transaction.retirementImpact.level}
            rationale={transaction.retirementImpact.rationale}
          />

          {/* Card 4: Financial Breakdown */}
          <DashboardCard title="Financial Breakdown">
            <div className="financial-breakdown">
              {transaction.grossAmount && (
                <div className="financial-breakdown__row">
                  <span className="financial-breakdown__label">Gross Amount:</span>
                  <span className="financial-breakdown__value">{formatCurrency(transaction.grossAmount)}</span>
                </div>
              )}
              {transaction.fees !== undefined && transaction.fees > 0 && (
                <div className="financial-breakdown__row">
                  <span className="financial-breakdown__label">Fees:</span>
                  <span className="financial-breakdown__value">{formatCurrency(transaction.fees)}</span>
                </div>
              )}
              {transaction.taxWithholding !== undefined && transaction.taxWithholding > 0 && (
                <div className="financial-breakdown__row">
                  <span className="financial-breakdown__label">Tax Withholding:</span>
                  <span className="financial-breakdown__value">{formatCurrency(transaction.taxWithholding)}</span>
                </div>
              )}
              {transaction.netAmount && (
                <div className="financial-breakdown__row financial-breakdown__row--total">
                  <span className="financial-breakdown__label">Net Amount:</span>
                  <span className="financial-breakdown__value">{formatCurrency(transaction.netAmount)}</span>
                </div>
              )}
              {transaction.repaymentInfo && (
                <div className="financial-breakdown__repayment">
                  <h3 className="financial-breakdown__repayment-title">Repayment Information</h3>
                  <div className="financial-breakdown__row">
                    <span className="financial-breakdown__label">Monthly Payment:</span>
                    <span className="financial-breakdown__value">
                      {formatCurrency(transaction.repaymentInfo.monthlyPayment)}
                    </span>
                  </div>
                  <div className="financial-breakdown__row">
                    <span className="financial-breakdown__label">Term:</span>
                    <span className="financial-breakdown__value">
                      {transaction.repaymentInfo.termMonths} months
                    </span>
                  </div>
                  <div className="financial-breakdown__row">
                    <span className="financial-breakdown__label">Interest Rate:</span>
                    <span className="financial-breakdown__value">
                      {transaction.repaymentInfo.interestRate}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          </DashboardCard>

          {/* Card 5: Timeline & Compliance */}
          <DashboardCard title="Timeline & Compliance">
            {transaction.milestones && (
              <div className="transaction-timeline">
                <TransactionStepper milestones={transaction.milestones} status={transaction.status} />
              </div>
            )}
            {transaction.isIrreversible && (
              <WarningBanner
                message="This transaction is irreversible. Once completed, it cannot be undone."
                type="warning"
              />
            )}
            {transaction.legalConfirmations.length > 0 && (
              <div className="legal-confirmations">
                <h3 className="legal-confirmations__title">Legal Confirmations</h3>
                <ul className="legal-confirmations__list">
                  {transaction.legalConfirmations.map((confirmation, index) => (
                    <li key={index} className="legal-confirmations__item">
                      {confirmation}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </DashboardCard>

          {/* Action Button */}
          <div className="transaction-analysis__actions">
            <Button onClick={handleAction} className="transaction-analysis__action-button">
              {getActionLabel()}
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
