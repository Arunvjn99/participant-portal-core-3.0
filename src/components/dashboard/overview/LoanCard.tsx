import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { LoanData } from "@/hooks/useDashboardData";

export type LoanCardProps = {
  loan: LoanData;
  titleKey: string;
  onOpenLoan: () => void;
  onNewRequest: () => void;
  remainingLabelKey: string;
  nextPaymentLabelKey: string;
  paidOffLabelKey: string;
};

export function LoanCard({
  loan,
  titleKey,
  onOpenLoan,
  onNewRequest,
  remainingLabelKey,
  nextPaymentLabelKey,
  paidOffLabelKey,
}: LoanCardProps) {
  const { t } = useTranslation();

  return (
    <div className="dashboard-screen-card">
      <div className="dashboard-screen-loan__head">
        <h2 className="dashboard-screen-section-title dashboard-screen-section-title--flush">{t(titleKey)}</h2>
        <button type="button" className="dashboard-screen-loan__link" onClick={onNewRequest}>
          {t("dashboardOverview.loan.requestNew")}
        </button>
      </div>
      <button type="button" className="dashboard-screen-loan__body" onClick={onOpenLoan}>
        <div className="dashboard-screen-loan__title-row">
          <span className="dashboard-screen-loan__title">{loan.title}</span>
          <span className="dashboard-screen-loan__badge">{t(loan.statusLabelKey)}</span>
        </div>
        <p className="dashboard-screen-loan__meta">
          <span className="dashboard-screen-loan__meta-line">{t(remainingLabelKey, { amount: loan.remainingLabel })}</span>
          <span className="dashboard-screen-loan__meta-line">{t(nextPaymentLabelKey, { detail: loan.nextPaymentLabel })}</span>
        </p>
        <p className="dashboard-screen-loan__label">{t(paidOffLabelKey, { pct: loan.percentPaid })}</p>
        <div className="dashboard-screen-progress">
          <motion.div
            className="dashboard-screen-progress__fill dashboard-screen-progress__fill--success"
            initial={{ width: 0 }}
            animate={{ width: `${loan.percentPaid}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
        <p className="dashboard-screen-loan__footer">{loan.paymentsLeftLabel}</p>
      </button>
    </div>
  );
}
