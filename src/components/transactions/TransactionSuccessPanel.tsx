import { useNavigate, useLocation } from "react-router-dom";
import { getRoutingVersion, withVersion } from "@/core/version";
import { useTranslation } from "react-i18next";
import { TxIconSuccess } from "@/components/icons/transaction-icons";

type SuccessType = "Loan" | "Withdrawal" | "Transfer" | "Rollover" | "Rebalance";

export interface SuccessState {
  type: SuccessType;
  amount?: number;
}

const SUCCESS_TYPE_KEYS: Record<SuccessType, string> = {
  Loan: "transactions.success.typeLoan",
  Withdrawal: "transactions.success.typeWithdrawal",
  Transfer: "transactions.success.typeTransfer",
  Rollover: "transactions.success.typeRollover",
  Rebalance: "transactions.success.typeRebalance",
};

/**
 * Post-submit confirmation on the transaction dashboard (token-only styles).
 */
export function TransactionSuccessPanel() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const version = getRoutingVersion(location.pathname);
  const state = location.state as { success?: SuccessState } | null;
  const success = state?.success;

  if (!success) return null;

  const { type, amount } = success;

  const handleReturn = () => {
    navigate(withVersion(version, "/transactions"), { replace: true, state: {} });
  };

  const amountFormatted = amount
    ? amount.toLocaleString(undefined, { style: "currency", currency: "USD" })
    : "";
  const amountInterp = amountFormatted ? t("transactions.success.amountFor", { amount: amountFormatted }) : "";
  const base = t("transactions.success.requestReceivedBase", { amount: amountInterp });
  const getMessage = () => {
    switch (type) {
      case "Transfer":
        return `${base} ${t("transactions.success.transferMessage")}`;
      case "Rollover":
        return `${base} ${t("transactions.success.rolloverMessage")}`;
      default:
        return `${base} ${t("transactions.success.defaultMessage")}`;
    }
  };

  const typeLabel = t(SUCCESS_TYPE_KEYS[type]);

  return (
    <section className="txn-success-panel" aria-live="polite">
      <TxIconSuccess size={24} className="txn-success-panel__icon" />
      <h2 className="txn-success-panel__title">{t("transactions.success.titleSubmitted", { type: typeLabel })}</h2>
      <p className="txn-success-panel__body">{getMessage()}</p>
      <button type="button" className="btn btn-primary" onClick={handleReturn}>
        {t("transactions.backToTransactions")}
      </button>
    </section>
  );
}
